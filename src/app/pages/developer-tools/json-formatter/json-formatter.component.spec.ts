import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { JsonFormatterComponent } from './json-formatter.component';
import { formatJsonDocument, highlightJson, JsonSourceError, parseJsonDocument } from './json-workspace';

describe('JsonFormatterComponent', () => {
  let component: JsonFormatterComponent;
  let fixture: ComponentFixture<JsonFormatterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonFormatterComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonFormatterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function enter(source: string): void {
    fixture.detectChanges();
    const editor: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    editor.value = source;
    editor.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('clears stale output on edit and points to an invalid value', () => {
    enter('{"a": 1}');
    component.run('format');
    expect(component.output()).toContain('"a": 1');

    enter('{\n  "a": }');
    expect(component.output()).toBe('');
    component.validate();
    expect(component.notice()).toEqual({
      kind: 'error', message: 'Line 2, column 8. Expected a JSON value.', offset: 9,
    });
    component.goToError();
    expect(fixture.nativeElement.querySelector('textarea').selectionStart).toBe(9);
  });

  it('keeps the original input while previewing a strict JSON repair', async () => {
    const source = `{name: "O'Brien", list: [1,],}`;
    enter(source);
    await component.repair();
    expect(component.rawJson()).toBe(source);
    expect(component.notice()?.message).toContain('Suggested repair');
    expect(JSON.parse(component.output())).toEqual({ name: "O'Brien", list: [1] });
    component.useOutput();
    expect(component.rawJson()).toBe(component.output());
    component.moveHistory(-1);
    expect(component.rawJson()).toBe(source);
    expect(component.output()).toBe('');
  });

  it('keeps identical key names in different branches independent', () => {
    enter('{"left":{"real":{"a":1}},"right":{"real":{"b":2}}}');
    component.setView('tree');
    for (const row of component.visibleTreeRows().slice(1)) component.toggleNode(row.id);
    const repeats = component.visibleTreeRows().filter((row) => row.label === '"real"');
    expect(repeats.length).toBe(2);
    component.toggleNode(repeats[0].id);
    expect(component.visibleTreeRows().some((row) => row.label === '"a"')).toBe(true);
    expect(component.visibleTreeRows().some((row) => row.label === '"b"')).toBe(false);
  });

  it.each(['false', 'null', '0', '""'])('shows %s as a tree root', (scalar) => {
    enter(scalar);
    component.setView('tree');
    expect(component.visibleTreeRows()).toHaveLength(1);
    expect(component.visibleTreeRows()[0].preview).toBe(scalar);
  });
});

describe('JSON document transformations', () => {
  it('highlights raw tokens without changing the source text', () => {
    const source = '{\n  "label": "<example>", "ready": true, "id": 9007199254740993\n}';
    const tokens = highlightJson(source)!;
    expect(tokens.map((token) => token.text).join('')).toBe(source);
    expect(tokens.filter((token) => token.kind === 'json-key').map((token) => token.text)).toEqual(['"label"', '"ready"', '"id"']);
    expect(tokens.find((token) => token.kind === 'json-number')?.text).toBe('9007199254740993');
    expect(highlightJson(' '.repeat(40_001))).toBeNull();
  });
  it('preserves exact numbers, literal strings, duplicate keys, and source order', () => {
    const source = '{"10": 1e400, "2": -0, "id": 9007199254740993, "id": 9007199254740995, "text": "x, } \\u0041"}';
    const document = parseJsonDocument(source);
    expect(document.duplicateKeys).toBe(1);
    expect(formatJsonDocument(document, '')).toBe(source.replace(/: /g, ':').replace(/, (?=")/g, ','));
    expect(formatJsonDocument(document, '  ')).toContain('"id": 9007199254740993,\n  "id": 9007199254740995');
  });

  it('sorts nested object keys and preserves array order and special property names', () => {
    const source = '{"z":[{"c":1,"a":2},0],"__proto__":{"value":3},"a":4}';
    expect(formatJsonDocument(parseJsonDocument(source), '', true)).toBe(
      '{"__proto__":{"value":3},"a":4,"z":[{"a":2,"c":1},0]}',
    );
  });

  it.each(['{"a":1,}', '[1,]', '// comment\n{}', '01', '-.5', '1e+', '"\\x00"', '"a\tb"'])('rejects invalid JSON %j', (source) => {
    expect(() => parseJsonDocument(source)).toThrow(JsonSourceError);
  });

  it('bounds nesting before parsing a deeply nested document', () => {
    expect(() => parseJsonDocument('['.repeat(101) + '0' + ']'.repeat(101))).toThrow(/100 levels/);
  });
});
