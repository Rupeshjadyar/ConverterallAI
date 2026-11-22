import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TypingSpeedTestComponent } from './typing-speed-test.component';
import { generateTestTokens } from './typing-speed-test.data';

describe('Typing Speed Test', () => {
  it('tracks typing attempts, excludes Backspace, and repeats the same passage', () => {
    TestBed.configureTestingModule({ imports: [TypingSpeedTestComponent], providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(TypingSpeedTestComponent);
    const tool = fixture.componentInstance;
    fixture.detectChanges();
    tool.setMode('custom');
    tool.customText.set('ab cd');
    tool.initNewTest();
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('#test-typing-entry');
    function enter(text: string): void {
      input.value = text;
      input.dispatchEvent(new Event('input'));
    }

    enter('');
    expect(tool.testStatus()).toBe('idle');
    enter('x');
    enter('');
    enter('a');
    enter('ab');
    enter('ab ');
    enter('c');
    enter('cd');
    expect(tool.testStatus()).toBe('finished');
    expect(tool.totalKeystrokes()).toBe(6);
    expect(tool.accuracy()).toBe(83);
    expect(tool.incorrectKeystrokes()).toBe(0);

    tool.repeatSameTest();
    expect(tool.words().map(({ original }) => original)).toEqual(['ab', 'cd']);
    expect(input.value).toBe('');
    expect(tool.testStatus()).toBe('idle');
    fixture.destroy();
  });

  it('honors exact word-count settings in code mode', () => {
    for (const count of [10, 25, 50, 100, 120]) {
      expect(generateTestTokens({ count, difficulty: 'code' })).toHaveLength(count);
    }
  });
});
