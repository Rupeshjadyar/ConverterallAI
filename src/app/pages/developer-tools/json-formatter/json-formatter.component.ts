import { Component, ElementRef, OnDestroy, ViewChild, afterNextRender, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Node } from 'jsonc-parser';
import {
  checkInputSize,
  formatJsonDocument,
  highlightJson,
  INPUT_LIMIT_MESSAGE,
  jsonChildren,
  type JsonDocument,
  jsonPosition,
  JsonSourceError,
  MAX_INPUT_BYTES,
  parseJsonDocument,
} from './json-workspace';

type View = 'code' | 'tree';
type Operation = 'format' | 'minify' | 'sort';
type UndoDirection = -1 | 1;
type NoticeKind = 'success' | 'error' | 'warning';
type Indent = '2' | '3' | '4' | 'tab' | 'compact';

interface Notice {
  kind: NoticeKind;
  message: string;
  offset?: number;
}

interface Result {
  document: JsonDocument;
  text: string;
  sorted: boolean;
}

interface TreeRow {
  id: number;
  label: string;
  type: Node['type'];
  preview: string;
  depth: number;
  expandable: boolean;
  expanded: boolean;
}

const SAMPLE = '{"orderId":9007199254740993,"items":[{"sku":"A12","quantity":2}],"paid":false}';
const INDENTS: Record<Indent, string> = { '2': '  ', '3': '   ', '4': '    ', tab: '\t', compact: '' };
const TREE_PAGE_SIZE = 200;
const MAX_TREE_ROWS = 2_000;
const HISTORY_LIMIT = 30;
const HISTORY_CHARACTERS = 4 * 1024 * 1024;
const LINE_HEIGHT = 22;
const GUTTER_ROWS = Array.from({ length: 48 }, (_, index) => index);
const BACKGROUND_KEY = 'converterallai.jsonFormatter.background';
const BACKGROUNDS = [
  { name: 'Green', color: '#27b515' },
  { name: 'Blue', color: '#16478f' },
  { name: 'Black', color: '#131519' },
  { name: 'White', color: '#ffffff' },
] as const;

@Component({
  selector: 'app-json-formatter',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './json-formatter.component.html',
  styleUrl: './json-formatter.component.css',
})
export class JsonFormatterComponent implements OnDestroy {
  @ViewChild('inputEditor') private inputEditor?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('outputEditor') private outputEditor?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('urlToggle') private urlToggle?: ElementRef<HTMLButtonElement>;
  @ViewChild('urlField') private urlField?: ElementRef<HTMLInputElement>;

  readonly rawJson = signal('');
  readonly indentation = signal<Indent>('2');
  readonly notice = signal<Notice | null>(null);
  readonly result = signal<Result | null>(null);
  readonly output = computed(() => this.result()?.text ?? '');
  readonly pendingAction = signal('');
  readonly view = signal<View>('code');
  readonly urlOpen = signal(false);
  readonly focusMode = signal(false);
  readonly backgrounds = BACKGROUNDS;
  readonly background = signal<string>(BACKGROUNDS[0].color);
  readonly lightBackground = computed(() => {
    const channels = this.background().slice(1).match(/../g)!.map((hex) => {
      const channel = Number.parseInt(hex, 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722 > 0.179;
  });
  readonly inputScroll = signal(0);
  readonly outputScroll = signal(0);
  readonly inputScrollX = signal(0);
  readonly outputScrollX = signal(0);
  readonly inputTokens = computed(() => highlightJson(this.rawJson()));
  readonly outputTokens = computed(() => highlightJson(this.output()));
  readonly inputLineCount = computed(() => countLines(this.rawJson()));
  readonly outputLineCount = computed(() => countLines(this.output()));
  readonly gutterRows = GUTTER_ROWS;
  readonly lineHeight = LINE_HEIGHT;

  private readonly expandedNodes = signal(new Set<number>());
  private readonly treeLimit = signal(TREE_PAGE_SIZE);
  private readonly history = signal<string[]>(['']);
  private readonly historyIndex = signal(0);
  private revision = 0;
  private fetchController?: AbortController;

  readonly canUndo = computed(() => this.historyIndex() > 0);
  readonly canRedo = computed(() => this.historyIndex() + 1 < this.history().length);
  readonly treeRows = computed(() => this.buildTreeRows());
  readonly hasMoreTreeRows = computed(() => this.treeRows().length > this.treeLimit());
  readonly visibleTreeRows = computed(() => this.treeRows().slice(0, this.treeLimit()));
  readonly canShowMoreTreeRows = computed(() => this.hasMoreTreeRows() && this.treeLimit() < MAX_TREE_ROWS);

  constructor() {
    afterNextRender(() => {
      try {
        const stored = localStorage.getItem(BACKGROUND_KEY);
        if (stored && /^#[\da-f]{6}$/i.test(stored)) this.background.set(stored.toLowerCase());
      } catch { /* The picker still works without storage. */ }
    });
  }

  chooseBackground(color: string): void {
    if (!/^#[\da-f]{6}$/i.test(color)) return;
    const selected = color.toLowerCase();
    this.background.set(selected);
    try { localStorage.setItem(BACKGROUND_KEY, selected); } catch { /* Keep it for the current visit. */ }
  }

  ngOnDestroy(): void {
    this.revision++;
    this.fetchController?.abort();
  }

  onEditorInput(editor: HTMLTextAreaElement): void {
    if (editor.value.length > MAX_INPUT_BYTES) {
      editor.value = this.rawJson();
      this.reportError(new JsonSourceError(INPUT_LIMIT_MESSAGE));
      return;
    }
    this.changeInput(editor.value);
  }

  private changeInput(source: string): void {
    source = source.replace(/\r\n?/g, '\n');
    if (source === this.rawJson()) return;
    const history = this.history().slice(0, this.historyIndex() + 1);
    history.push(source);
    let length = history.reduce((total, item) => total + item.length, 0);
    while (history.length > HISTORY_LIMIT || length > HISTORY_CHARACTERS) {
      length -= history.shift()!.length;
    }
    this.history.set(history);
    this.historyIndex.set(history.length - 1);
    this.replaceInput(source);
  }

  private replaceInput(source: string): void {
    this.cancelPending();
    this.rawJson.set(source);
    this.clearResult();
    this.notice.set(null);
  }

  moveHistory(direction: UndoDirection): void {
    const next = this.historyIndex() + direction;
    const source = this.history()[next];
    if (source === undefined) return;
    this.historyIndex.set(next);
    this.replaceInput(source);
    this.inputScroll.set(0);
    this.inputEditor?.nativeElement.focus();
  }

  clearInput(): void {
    if (this.rawJson()) this.changeInput('');
    else this.replaceInput('');
    this.inputScroll.set(0);
    this.inputEditor?.nativeElement.focus();
  }

  loadSample(): void {
    this.changeInput(SAMPLE);
    this.inputScroll.set(0);
    this.run('format');
  }

  setIndentation(value: string): void {
    const indent = value as Indent;
    this.indentation.set(indent);
    const current = this.result();
    if (!current) return;

    try {
      this.setResult(current.document, INDENTS[indent], current.sorted, 'Output indentation updated.');
    } catch (error) {
      this.reportError(error);
    }
  }

  validate(): void {
    this.cancelPending();
    try {
      this.reportSuccess('Valid JSON.', parseJsonDocument(this.rawJson()));
    } catch (error) {
      this.clearResult();
      this.reportError(error);
    }
  }

  run(operation: Operation): void {
    this.cancelPending();
    const indent = operation === 'minify' ? '' : INDENTS[this.indentation()];
    const message = {
      format: 'JSON formatted.',
      minify: 'JSON minified.',
      sort: 'Object keys sorted. Use output as input to keep this order.',
    }[operation];

    try {
      this.setResult(parseJsonDocument(this.rawJson()), indent, operation === 'sort', message);
    } catch (error) {
      this.clearResult();
      this.reportError(error);
    }
  }

  async repair(): Promise<void> {
    const operation = this.startPending('Repairing JSON…');
    const source = this.rawJson();
    try {
      try {
        const document = parseJsonDocument(source);
        this.setResult(document, INDENTS[this.indentation()], false, 'JSON is already valid.');
        return;
      } catch (error) {
        if (!(error instanceof JsonSourceError) || error.offset === undefined) throw error;
      }

      const { jsonrepair } = await import('jsonrepair');
      if (!this.isCurrent(operation)) return;
      let repaired: JsonDocument;
      try {
        repaired = parseJsonDocument(jsonrepair(source));
      } catch {
        // Give the user the location in the original editor rather than a position in the repair.
        parseJsonDocument(source);
        return;
      }
      this.setResult(repaired, INDENTS[this.indentation()], false, 'Suggested repair. Review the output before using it.');
    } catch (error) {
      if (this.isCurrent(operation)) {
        this.clearResult();
        this.reportError(error);
      }
    } finally {
      if (this.isCurrent(operation)) this.pendingAction.set('');
    }
  }

  useOutput(): void {
    const result = this.result();
    if (!result) return;
    try {
      checkInputSize(result.text);
    } catch (error) {
      this.reportError(error);
      return;
    }
    this.changeInput(result.text);
    this.result.set(result);
    this.inputScroll.set(0);
    this.reportSuccess('Output copied to the input editor.', result.document);
    this.inputEditor?.nativeElement.focus();
  }

  async uploadFile(input: HTMLInputElement): Promise<void> {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const operation = this.startPending('Reading file…');
    try {
      if (file.size > MAX_INPUT_BYTES) throw new JsonSourceError(INPUT_LIMIT_MESSAGE);
      const source = decodeUtf8(await file.arrayBuffer());
      if (this.isCurrent(operation)) this.acceptImport(source);
    } catch (error) {
      if (this.isCurrent(operation)) {
        this.reportError(error, 'Could not read this file. Choose a UTF-8 JSON file.');
      }
    } finally {
      if (this.isCurrent(operation)) this.pendingAction.set('');
    }
  }

  async paste(): Promise<void> {
    const operation = this.startPending('Reading clipboard…');
    try {
      const source = await navigator.clipboard.readText();
      if (!this.isCurrent(operation)) return;
      if (!source.trim()) throw new JsonSourceError('The clipboard contains no JSON text.');
      this.acceptImport(source);
    } catch (error) {
      if (this.isCurrent(operation)) {
        this.reportError(error, 'Clipboard access is unavailable. Paste directly into the input editor.');
      }
    } finally {
      if (this.isCurrent(operation)) this.pendingAction.set('');
    }
  }

  toggleUrl(): void {
    if (this.urlOpen()) {
      this.closeUrl();
    } else {
      this.urlOpen.set(true);
      setTimeout(() => {
        if (this.urlOpen()) this.urlField?.nativeElement.focus();
      });
    }
  }

  private closeUrl(): void {
    if (this.fetchController) this.cancelPending();
    this.urlOpen.set(false);
    this.urlToggle?.nativeElement.focus();
  }

  async importUrl(event: Event, value: string): Promise<void> {
    event.preventDefault();
    let url: URL;
    try {
      url = new URL(value.trim());
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error();
    } catch {
      this.cancelPending();
      this.notice.set({ kind: 'error', message: 'Enter an HTTP or HTTPS URL without embedded credentials.' });
      return;
    }

    const operation = this.startPending('Fetching JSON…');
    const controller = new AbortController();
    this.fetchController = controller;
    const timeout = setTimeout(() => controller.abort(), 12_000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      });
      if (!response.ok) {
        void response.body?.cancel().catch(() => {});
        throw new JsonSourceError(`The URL returned HTTP ${response.status}.`);
      }
      const source = await readResponse(response);
      if (!this.isCurrent(operation)) return;
      this.fetchController = undefined;
      this.closeUrl();
      this.acceptImport(source);
    } catch (error) {
      if (!this.isCurrent(operation)) return;
      this.reportError(
        error,
        controller.signal.aborted ? 'The URL request timed out.' : 'Could not fetch this URL. The server must allow browser access (CORS).',
      );
    } finally {
      clearTimeout(timeout);
      if (this.isCurrent(operation)) {
        this.fetchController = undefined;
        this.pendingAction.set('');
      }
    }
  }

  private acceptImport(source: string): void {
    checkInputSize(source);
    this.changeInput(source.replace(/^\uFEFF/, ''));
    this.inputScroll.set(0);
    this.run('format');
  }

  async copy(): Promise<void> {
    const result = this.result();
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.text);
      if (result === this.result()) this.reportSuccess('Output copied.', result.document);
    } catch {
      if (result !== this.result()) return;
      this.view.set('code');
      setTimeout(() => {
        if (result !== this.result()) return;
        const editor = this.outputEditor?.nativeElement;
        editor?.focus();
        editor?.select();
      });
      this.notice.set({ kind: 'error', message: 'Clipboard access is unavailable. Copy the selected output manually.' });
    }
  }

  download(): void {
    const source = this.output();
    if (!source) return;
    const url = URL.createObjectURL(new Blob([source], { type: 'application/json;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted.json';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  print(): void {
    const source = this.output();
    if (!source) return;
    const popup = window.open('', '_blank');
    if (!popup) {
      this.notice.set({ kind: 'error', message: 'Allow pop-ups for this page to print the output.' });
      return;
    }
    popup.opener = null;
    popup.document.title = 'Formatted JSON';
    const pre = popup.document.createElement('pre');
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.overflowWrap = 'anywhere';
    pre.textContent = source;
    popup.document.body.replaceChildren(pre);
    popup.focus();
    popup.print();
  }

  setView(view: View): void {
    if (view === 'tree' && !this.result()) this.run('format');
    if (view === 'code' || this.result()) this.view.set(view);
  }

  toggleNode(id: number): void {
    this.expandedNodes.update((expanded) => {
      const next = new Set(expanded);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  showMoreTree(): void {
    this.treeLimit.update((limit) => Math.min(limit + TREE_PAGE_SIZE, MAX_TREE_ROWS));
  }

  goToError(): void {
    const offset = this.notice()?.offset;
    const editor = this.inputEditor?.nativeElement;
    if (offset === undefined || !editor) return;
    editor.focus();
    editor.setSelectionRange(offset, offset);
    const { line } = jsonPosition(this.rawJson(), offset);
    editor.scrollTop = Math.max(0, (line - 3) * LINE_HEIGHT);
    this.inputScroll.set(editor.scrollTop);
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && (this.urlOpen() || this.focusMode())) {
      if (this.urlOpen()) this.closeUrl();
      else this.focusMode.set(false);
      return;
    }

    if (!(event.metaKey || event.ctrlKey) || event.altKey) return;
    if (event.key === 'Enter' && !this.urlOpen()) {
      event.preventDefault();
      this.validate();
    } else if (event.shiftKey && event.key.toLowerCase() === 'f' && !this.urlOpen()) {
      event.preventDefault();
      this.run('format');
    } else if (event.key.toLowerCase() === 'z' && event.target === this.inputEditor?.nativeElement) {
      event.preventDefault();
      this.moveHistory(event.shiftKey ? 1 : -1);
    } else if (event.key.toLowerCase() === 'y' && event.target === this.inputEditor?.nativeElement) {
      event.preventDefault();
      this.moveHistory(1);
    }
  }

  gutterStart(scroll: number): number {
    return Math.floor(scroll / LINE_HEIGHT) + 1;
  }

  private buildTreeRows(): TreeRow[] {
    const rows: TreeRow[] = [];
    const result = this.result();
    if (!result || this.view() !== 'tree') return rows;
    const expanded = this.expandedNodes();
    const limit = this.treeLimit();
    const source = result.document.source;

    function visit(node: Node, label: string, depth: number): void {
      const size = node.children?.length ?? 0;
      const container = node.type === 'object' || node.type === 'array';
      const open = size > 0 && expanded.has(node.offset);
      const start = node.offset;
      const preview = container
        ? (node.type === 'object' ? '{' + size + '}' : '[' + size + ']')
        : source.slice(start, start + Math.min(node.length, 180)) + (node.length > 180 ? '…' : '');
      rows.push({ id: start, label, type: node.type, preview, depth, expandable: size > 0, expanded: open });
      if (!open) return;

      const children = jsonChildren(node, result!.sorted);
      for (let i = 0; i < children.length && rows.length <= limit; i++) {
        const child = children[i];
        if (child.type === 'property') {
          const [key, value] = child.children!;
          const name = source.slice(key.offset, key.offset + Math.min(key.length, 180));
          visit(value, name + (key.length > 180 ? '…' : ''), depth + 1);
        } else {
          visit(child, String(i), depth + 1);
        }
      }
    }

    visit(result.document.root, 'Root', 0);
    return rows;
  }

  private setResult(document: JsonDocument, indent: string, sorted: boolean, message: string): void {
    const text = formatJsonDocument(document, indent, sorted);
    this.result.set({ document, text, sorted });
    this.expandedNodes.set(new Set([document.root.offset]));
    this.treeLimit.set(TREE_PAGE_SIZE);
    this.outputScroll.set(0);
    this.outputScrollX.set(0);
    if (this.outputEditor) {
      this.outputEditor.nativeElement.scrollTop = 0;
      this.outputEditor.nativeElement.scrollLeft = 0;
    }
    this.reportSuccess(message, document);
  }

  private clearResult(): void {
    this.result.set(null);
    this.outputScroll.set(0);
    this.outputScrollX.set(0);
  }

  private reportSuccess(message: string, document: JsonDocument): void {
    const count = document.duplicateKeys;
    this.notice.set(count ? {
      kind: 'warning',
      message: `${message} Found ${count} duplicate ${count === 1 ? 'key' : 'keys'}. All entries are preserved.`,
    } : { kind: 'success', message });
  }

  private reportError(error: unknown, fallback = 'Could not process this JSON.'): void {
    if (!(error instanceof JsonSourceError)) {
      this.notice.set({ kind: 'error', message: fallback });
      return;
    }
    const offset = error.offset;
    if (offset === undefined) {
      this.notice.set({ kind: 'error', message: error.message });
      return;
    }
    const { line, column } = jsonPosition(this.rawJson(), offset);
    this.notice.set({ kind: 'error', message: `Line ${line}, column ${column}. ${error.message}`, offset });
  }

  private startPending(label: string): number {
    this.cancelPending();
    this.notice.set(null);
    this.pendingAction.set(label);
    return this.revision;
  }

  private cancelPending(): void {
    this.revision++;
    this.fetchController?.abort();
    this.fetchController = undefined;
    this.pendingAction.set('');
  }

  private isCurrent(revision: number): boolean {
    return this.revision === revision;
  }
}

function countLines(text: string): number {
  let lines = 1;
  for (let end = text.indexOf('\n'); end !== -1; end = text.indexOf('\n', end + 1)) lines++;
  return lines;
}

function decodeUtf8(buffer: ArrayBuffer): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch {
    throw new JsonSourceError('The input could not be decoded as UTF-8.');
  }
}

async function readResponse(response: Response): Promise<string> {
  if (Number(response.headers.get('content-length')) > MAX_INPUT_BYTES) {
    void response.body?.cancel().catch(() => {});
    throw new JsonSourceError(INPUT_LIMIT_MESSAGE);
  }
  if (!response.body) return '';

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  const chunks: string[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_INPUT_BYTES) throw new JsonSourceError(INPUT_LIMIT_MESSAGE);
      try {
        chunks.push(decoder.decode(value, { stream: true }));
      } catch {
        throw new JsonSourceError('The response could not be decoded as UTF-8.');
      }
    }
    try {
      chunks.push(decoder.decode());
    } catch {
      throw new JsonSourceError('The response could not be decoded as UTF-8.');
    }
    return chunks.join('');
  } finally {
    void reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
