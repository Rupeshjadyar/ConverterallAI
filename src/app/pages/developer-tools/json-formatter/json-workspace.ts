import {
  createScanner,
  type Node,
  type ParseError,
  parseTree,
  printParseErrorCode,
} from 'jsonc-parser';

export const MAX_INPUT_BYTES = 2 * 1024 * 1024;
export const INPUT_LIMIT_MESSAGE = 'Input exceeds the 2 MiB limit.';
const MAX_DEPTH = 100;
const MAX_TOKENS = 250_000;
const MAX_OUTPUT_LENGTH = 8 * 1024 * 1024;

export interface JsonDocument {
  source: string;
  root: Node;
  duplicateKeys: number;
}

export class JsonSourceError extends Error {
  constructor(message: string, readonly offset?: number) {
    super(message);
  }
}

const syntaxMessages: Record<string, string> = {
  InvalidSymbol: 'Unexpected token.',
  InvalidNumberFormat: 'Invalid number.',
  PropertyNameExpected: 'Expected a property name in double quotes.',
  ValueExpected: 'Expected a JSON value.',
  ColonExpected: 'Expected a colon after the property name.',
  CommaExpected: 'Expected a comma between entries.',
  CloseBraceExpected: 'Expected a closing brace.',
  CloseBracketExpected: 'Expected a closing bracket.',
  EndOfFileExpected: 'Unexpected content after the JSON value.',
  InvalidCommentToken: 'Comments are invalid in JSON.',
  UnexpectedEndOfComment: 'Unterminated comment.',
  UnexpectedEndOfString: 'Unterminated string.',
  UnexpectedEndOfNumber: 'Incomplete number.',
  InvalidUnicode: 'Invalid Unicode escape in a string.',
  InvalidEscapeCharacter: 'Invalid escape in a string.',
  InvalidCharacter: 'A control character inside a string must be escaped.',
};

export function checkInputSize(source: string): void {
  if (source.length > MAX_INPUT_BYTES || new TextEncoder().encode(source).byteLength > MAX_INPUT_BYTES) {
    throw new JsonSourceError(INPUT_LIMIT_MESSAGE);
  }
}

export function parseJsonDocument(source: string): JsonDocument {
  checkInputSize(source);
  if (!source.trim()) throw new JsonSourceError('Enter a JSON value to continue.');

  // Bound work and nesting before calling the recursive JSON parser.
  const scanner = createScanner(source, true);
  const closingTokens: string[] = [];
  scanner.scan();
  for (let tokens = 1; scanner.getTokenLength() > 0; tokens++, scanner.scan()) {
    const offset = scanner.getTokenOffset();
    const character = source[offset];
    if (tokens > MAX_TOKENS) throw new JsonSourceError('JSON exceeds the 250,000-token limit.');
    if (character === '{' || character === '[') {
      closingTokens.push(character === '{' ? '}' : ']');
      if (closingTokens.length > MAX_DEPTH) {
        throw new JsonSourceError(`JSON exceeds ${MAX_DEPTH} levels of nesting.`, offset);
      }
    } else if ((character === '}' || character === ']') && closingTokens.pop() !== character) {
      throw new JsonSourceError('Unexpected closing bracket or brace.', offset);
    }
  }

  const errors: ParseError[] = [];
  const root = parseTree(source, errors, { disallowComments: true, allowTrailingComma: false });
  if (errors.length || !root) {
    const first = errors[0];
    const message = first && syntaxMessages[printParseErrorCode(first.error)];
    throw new JsonSourceError(message || 'Invalid JSON.', first?.offset ?? 0);
  }
  return { source, root, duplicateKeys: countDuplicateKeys(root) };
}

function countDuplicateKeys(node: Node): number {
  let count = 0;
  if (node.type === 'object') {
    const names = new Set<string>();
    for (const property of node.children ?? []) {
      const [key, value] = property.children!;
      if (names.has(key.value as string)) count++;
      else names.add(key.value as string);
      count += countDuplicateKeys(value);
    }
  } else if (node.type === 'array') {
    for (const child of node.children ?? []) count += countDuplicateKeys(child);
  }
  return count;
}

export function jsonChildren(node: Node, sorted: boolean): Node[] {
  const children = node.children ?? [];
  if (!sorted || node.type !== 'object') return children;
  return children.slice().sort((left, right) => {
    const a = left.children![0].value as string;
    const b = right.children![0].value as string;
    return a < b ? -1 : a > b ? 1 : 0;
  });
}

export function formatJsonDocument(document: JsonDocument, indent: string, sorted = false): string {
  const chunks: string[] = [];
  let length = 0;
  const append = (chunk: string) => {
    length += chunk.length;
    if (length > MAX_OUTPUT_LENGTH) {
      throw new JsonSourceError('Formatted output is too large. Choose a smaller indent or use Minify.');
    }
    chunks.push(chunk);
  };
  const line = (depth: number) => indent ? `\n${indent.repeat(depth)}` : '';

  function write(node: Node, depth: number): void {
    if (node.type !== 'object' && node.type !== 'array') {
      append(document.source.slice(node.offset, node.offset + node.length));
      return;
    }
    const object = node.type === 'object';
    append(object ? '{' : '[');
    const children = jsonChildren(node, sorted);
    children.forEach((child, index) => {
      if (index) append(',');
      if (indent) append(line(depth + 1));
      if (object) {
        const [key, value] = child.children!;
        write(key, depth + 1);
        append(indent ? ': ' : ':');
        write(value, depth + 1);
      } else {
        write(child, depth + 1);
      }
    });
    if (children.length && indent) append(line(depth));
    append(object ? '}' : ']');
  }

  write(document.root, 0);
  return chunks.join('');
}

export function jsonPosition(source: string, offset: number): { line: number; column: number } {
  let line = 1;
  let lineStart = 0;
  for (let i = 0; i < offset; i++) {
    if (source[i] === '\n') {
      line++;
      lineStart = i + 1;
    }
  }
  return { line, column: offset - lineStart + 1 };
}
