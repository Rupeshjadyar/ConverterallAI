import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-json-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './json-formatter.component.html',
  styleUrls: ['./json-formatter.component.css']
})
export class JsonFormatterComponent implements OnInit {
  @ViewChild('inputTextarea') inputTextareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('outputTextarea') outputTextareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('inputGutter') inputGutterRef!: ElementRef<HTMLDivElement>;
  @ViewChild('outputGutter') outputGutterRef!: ElementRef<HTMLDivElement>;

  rawJson = '';
  formattedJson = '';
  statusMessage = '';
  isError = false;
  indentation: string = '2';
  viewMode: 'code' | 'tree' = 'code';
  isFullscreen = false;

  cursorLine = 1;
  currentCol = 1;

  parsedObject: any = null;
  collapsedKeys = new Set<string>();

  // History stack for Undo / Redo
  history: string[] = [];
  historyIndex: number = -1;
  private isPushingHistory = true;

  get inputLength(): number {
    return this.rawJson ? this.rawJson.length : 0;
  }

  get outputLength(): number {
    return this.formattedJson ? this.formattedJson.length : 0;
  }

  get lineCount(): number {
    return this.formattedJson ? this.formattedJson.split('\n').length : 0;
  }

  get byteSize(): string {
    if (!this.formattedJson) return '0 B';
    const bytes = new Blob([this.formattedJson]).size;
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(2) + ' KB';
  }

  get inputLines(): number[] {
    const count = (this.rawJson || '').split('\n').length;
    return Array.from({ length: Math.max(count, 22) }, (_, i) => i + 1);
  }

  get outputLines(): number[] {
    const count = (this.formattedJson || '').split('\n').length;
    return Array.from({ length: Math.max(count, 22) }, (_, i) => i + 1);
  }

  ngOnInit() {
    this.loadSampleJson();
  }

  onRawJsonChange() {
    this.statusMessage = '';
    this.isError = false;
    this.pushHistory(this.rawJson);
  }

  private pushHistory(val: string) {
    if (!this.isPushingHistory) return;
    if (this.history[this.historyIndex] === val) return;

    // Truncate redo branches
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(val);
    if (this.history.length > 50) this.history.shift();
    this.historyIndex = this.history.length - 1;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.isPushingHistory = false;
      this.rawJson = this.history[this.historyIndex] || '';
      this.beautifyJson();
      this.isPushingHistory = true;
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.isPushingHistory = false;
      this.rawJson = this.history[this.historyIndex] || '';
      this.beautifyJson();
      this.isPushingHistory = true;
    }
  }

  beautifyJson() {
    if (!this.rawJson || !this.rawJson.trim()) {
      this.formattedJson = '';
      this.parsedObject = null;
      return;
    }

    try {
      const parsed = JSON.parse(this.rawJson);
      this.parsedObject = parsed;

      let indent: string | number = 2;
      if (this.indentation === '3') indent = 3;
      else if (this.indentation === '4') indent = 4;
      else if (this.indentation === 'tab') indent = '\t';
      else if (this.indentation === 'compact') indent = 0;

      this.formattedJson = JSON.stringify(parsed, null, indent);
      this.isError = false;
      this.statusMessage = 'Valid JSON formatted successfully!';
    } catch (e: any) {
      this.isError = true;
      this.statusMessage = `Syntax Error: ${e.message}`;
    }
  }

  validateJson() {
    if (!this.rawJson || !this.rawJson.trim()) {
      this.isError = true;
      this.statusMessage = 'Error: JSON input is empty. Please enter JSON to validate.';
      return;
    }

    try {
      JSON.parse(this.rawJson);
      this.isError = false;
      this.statusMessage = 'Valid JSON! No syntax errors detected.';
    } catch (e: any) {
      this.isError = true;
      this.statusMessage = `Invalid JSON: ${e.message}`;
    }
  }

  minifyJson() {
    if (!this.rawJson || !this.rawJson.trim()) return;

    try {
      const parsed = JSON.parse(this.rawJson);
      this.parsedObject = parsed;
      this.formattedJson = JSON.stringify(parsed);
      this.indentation = 'compact';
      this.isError = false;
      this.statusMessage = 'JSON minified (compacted without whitespace)!';
    } catch (e: any) {
      this.isError = true;
      this.statusMessage = `Syntax Error: ${e.message}`;
    }
  }

  sortJsonKeys() {
    if (!this.rawJson || !this.rawJson.trim()) return;

    try {
      const parsed = JSON.parse(this.rawJson);
      const sorted = this.deepSortObject(parsed);
      this.rawJson = JSON.stringify(sorted, null, 2);
      this.beautifyJson();
      this.statusMessage = 'JSON keys sorted alphabetically!';
      this.isError = false;
    } catch (e: any) {
      this.isError = true;
      this.statusMessage = `Cannot sort: ${e.message}`;
    }
  }

  private deepSortObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.deepSortObject(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((result: any, key) => {
          result[key] = this.deepSortObject(obj[key]);
          return result;
        }, {});
    }
    return obj;
  }

  repairJson() {
    if (!this.rawJson) return;
    try {
      // Fix single quotes to double quotes, trailing commas
      const fixed = this.rawJson
        .replace(/'/g, '"')
        .replace(/,\s*([}\]])/g, '$1');
      JSON.parse(fixed);
      this.rawJson = fixed;
      this.beautifyJson();
      this.statusMessage = 'Repaired quotes & trailing commas!';
      this.isError = false;
    } catch {
      this.beautifyJson();
    }
  }

  loadSampleJson() {
    const sample = {
      product: 'ConverterAll AI Developer Suite',
      version: '2.5.0',
      active: true,
      features: [
        'Real-time JSON Beautifier & Minifier',
        'Interactive Collapsible Tree Visualizer',
        'Syntax Diagnostics & Line Highlights',
        'In-Browser SQL Masterclass & Sandbox'
      ],
      author: {
        name: 'ConverterAll Team',
        skills: ['Angular', 'TypeScript', 'CSS3', 'Web APIs']
      },
      stats: {
        totalTools: 25,
        rating: 4.95,
        clientSide: true
      }
    };
    this.rawJson = JSON.stringify(sample, null, 2);
    this.pushHistory(this.rawJson);
    this.beautifyJson();
    this.statusMessage = '';
  }

  clearAll() {
    this.rawJson = '';
    this.formattedJson = '';
    this.parsedObject = null;
    this.statusMessage = '';
    this.isError = false;
    this.cursorLine = 1;
    this.currentCol = 1;
  }

  clearInput() {
    this.rawJson = '';
    this.statusMessage = '';
  }

  async pasteFromClipboard() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        const text = await navigator.clipboard.readText();
        this.rawJson = text;
        this.beautifyJson();
        this.statusMessage = 'Pasted from clipboard!';
        this.isError = false;
      } catch {
        this.statusMessage = 'Clipboard permission denied. Please paste directly into the box.';
        this.isError = true;
      }
    }
  }

  async copyFormattedJson() {
    if (!this.formattedJson) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(this.formattedJson);
      this.statusMessage = 'Copied formatted JSON to clipboard! ✓';
      this.isError = false;
      setTimeout(() => {
        if (this.statusMessage.includes('Copied')) this.statusMessage = '';
      }, 2500);
    }
  }

  downloadJsonFile() {
    const content = this.formattedJson || this.rawJson;
    if (!content || typeof document === 'undefined') return;

    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
    this.statusMessage = 'JSON file download started!';
    this.isError = false;
  }

  onFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.rawJson = reader.result as string;
      this.beautifyJson();
      this.statusMessage = `Loaded "${file.name}" successfully!`;
      this.isError = false;
      input.value = '';
    };
    reader.readAsText(file);
  }

  openUrlPrompt() {
    if (typeof window === 'undefined') return;
    const url = window.prompt('Enter JSON API or Raw URL to fetch:');
    if (!url) return;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.rawJson = JSON.stringify(data, null, 2);
        this.beautifyJson();
        this.statusMessage = 'Fetched data from URL successfully!';
        this.isError = false;
      })
      .catch(err => {
        this.isError = true;
        this.statusMessage = `Failed to fetch URL: ${err.message}`;
      });
  }

  printJson() {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<pre>${this.formattedJson || this.rawJson}</pre>`);
    printWindow.document.close();
    printWindow.print();
  }

  toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'code' ? 'tree' : 'code';
    if (this.viewMode === 'tree' && !this.parsedObject && this.rawJson) {
      try {
        this.parsedObject = JSON.parse(this.rawJson);
      } catch {}
    }
  }

  syncInputScroll() {
    if (this.inputTextareaRef && this.inputGutterRef) {
      this.inputGutterRef.nativeElement.scrollTop = this.inputTextareaRef.nativeElement.scrollTop;
    }
  }

  syncOutputScroll() {
    if (this.outputTextareaRef && this.outputGutterRef) {
      this.outputGutterRef.nativeElement.scrollTop = this.outputTextareaRef.nativeElement.scrollTop;
    }
  }

  updateCursorPos(event: any) {
    const textarea = event.target as HTMLTextAreaElement;
    const selStart = textarea.selectionStart || 0;
    const textBefore = textarea.value.substring(0, selStart);
    const lines = textBefore.split('\n');
    this.cursorLine = lines.length;
    this.currentCol = lines[lines.length - 1].length + 1;
  }

  // Tree View Helper Functions
  isObject(val: any): boolean {
    return val !== null && typeof val === 'object';
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  getObjectKeys(val: any): string[] {
    return val && typeof val === 'object' ? Object.keys(val) : [];
  }

  getKeysCount(val: any): number {
    return val && typeof val === 'object' ? Object.keys(val).length : 0;
  }

  isCollapsed(key: string): boolean {
    return this.collapsedKeys.has(key);
  }

  toggleNodeCollapse(key: string) {
    if (this.collapsedKeys.has(key)) {
      this.collapsedKeys.delete(key);
    } else {
      this.collapsedKeys.add(key);
    }
  }

  getValClass(val: any): string {
    if (typeof val === 'string') return 'val-string';
    if (typeof val === 'number') return 'val-number';
    if (typeof val === 'boolean') return 'val-boolean';
    return 'val-null';
  }

  formatPrimitive(val: any): string {
    if (typeof val === 'string') return `"${val}"`;
    return String(val);
  }
}
