export function insertedText(previous: string, current: string): { text: string; start: number } {
  let start = 0;
  while (start < previous.length && start < current.length && previous[start] === current[start]) start++;
  let end = current.length;
  let previousEnd = previous.length;
  while (end > start && previousEnd > start && current[end - 1] === previous[previousEnd - 1]) {
    end--;
    previousEnd--;
  }
  return { text: current.slice(start, end), start };
}

export function wordsPerMinute(characters: number, elapsedSeconds: number): number {
  return Math.round(characters * 12 / Math.max(1, elapsedSeconds));
}
