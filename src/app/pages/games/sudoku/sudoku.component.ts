import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface SudokuCell {
  row: number;
  col: number;
  val: number | null;
  initial: boolean;
  notes: number[];
  isError: boolean;
}

@Component({
  selector: 'app-sudoku',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="sudoku-container">
      
      <div class="game-header">
        <div class="header-left">
          <a routerLink="/games" class="back-link">← All Games</a>
          <h1 class="game-title">Sudoku Master 🔢</h1>
        </div>

        <div class="header-controls">
          <div class="mode-select">
            <label>Difficulty:</label>
            <select [ngModel]="difficulty()" (ngModelChange)="setDifficulty($event)">
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>
          <button (click)="newGame()" class="btn-top">🔄 New Game</button>
        </div>
      </div>

      <div class="sudoku-arena">
        
        <!-- Status Bar -->
        <div class="status-bar glass">
          <div class="status-item">
            <span class="status-label">Difficulty</span>
            <span class="status-val diff-tag">{{ difficulty().toUpperCase() }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Mistakes</span>
            <span class="status-val text-red">{{ mistakes() }}/3</span>
          </div>
          <div class="status-item">
            <span class="status-label">Time</span>
            <span class="status-val">{{ formatTime(secondsElapsed()) }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Pencil Notes</span>
            <button (click)="pencilMode.set(!pencilMode())" class="btn-pencil" [class.active-pencil]="pencilMode()">
              ✏️ {{ pencilMode() ? 'ON' : 'OFF' }}
            </button>
          </div>
        </div>

        <!-- 9x9 Sudoku Board -->
        <div class="board-frame glass">
          <div class="sudoku-grid">
            <div *ngFor="let row of board; let r = index" class="grid-row">
              <div *ngFor="let cell of row; let c = index" 
                   class="grid-cell"
                   [ngClass]="getCellClass(cell)"
                   (click)="selectCell(cell)">
                
                <span *ngIf="cell.val" class="cell-num">{{ cell.val }}</span>

                <!-- Pencil Notes Mini Grid -->
                <div *ngIf="!cell.val && cell.notes.length > 0" class="notes-grid">
                  <span *ngFor="let n of [1,2,3,4,5,6,7,8,9]" class="note-num">
                    {{ cell.notes.includes(n) ? n : '' }}
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Keypad & Action Controls -->
        <div class="controls-card glass">
          <div class="keypad-grid">
            <button *ngFor="let n of [1,2,3,4,5,6,7,8,9]" class="key-btn" (click)="inputNumber(n)">
              {{ n }}
            </button>
          </div>

          <div class="action-keys-row">
            <button (click)="eraseCell()" class="btn-action-key">🧹 Erase</button>
            <button (click)="pencilMode.set(!pencilMode())" class="btn-action-key" [class.btn-active]="pencilMode()">
              ✏️ Notes ({{ pencilMode() ? 'ON' : 'OFF' }})
            </button>
            <button (click)="getHint()" class="btn-action-key btn-hint">💡 Hint</button>
          </div>
        </div>

        <!-- Victory Modal -->
        <div *ngIf="isCompleted()" class="win-modal glass">
          <div class="win-box">
            <h2>🎉 Sudoku Solved!</h2>
            <p>You completed the {{ difficulty() }} puzzle in {{ formatTime(secondsElapsed()) }} with {{ mistakes() }} mistakes!</p>
            <button (click)="newGame()" class="btn-new-puzzle">Play Next Puzzle ➔</button>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .sudoku-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem;
      font-family: inherit;
    }

    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .back-link {
      font-size: 0.85rem;
      color: #a78bfa;
      text-decoration: none;
      font-weight: 700;
      margin-bottom: 0.25rem;
      display: inline-block;
    }

    .game-title {
      font-size: 1.8rem;
      font-weight: 900;
      color: var(--text-color, #fff);
      margin: 0;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .mode-select select {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: var(--text-color, #fff);
      padding: 0.4rem 0.75rem;
      border-radius: 10px;
      font-size: 0.85rem;
      outline: none;
    }

    .btn-top {
      padding: 0.45rem 1rem;
      border-radius: 10px;
      background: linear-gradient(135deg, #8b5cf6, #38bdf8);
      color: #fff;
      font-weight: 700;
      font-size: 0.85rem;
      border: none;
      cursor: pointer;
    }

    /* Status Bar */
    .status-bar {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0.75rem 1rem;
      border-radius: 16px;
      margin-bottom: 1.25rem;
    }

    .status-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .status-label {
      font-size: 0.72rem;
      color: #94a3b8;
      font-weight: 700;
      text-transform: uppercase;
    }

    .status-val {
      font-size: 1.1rem;
      font-weight: 800;
      color: #fff;
    }

    .text-red { color: #f87171; }

    .btn-pencil {
      padding: 0.2rem 0.6rem;
      border-radius: 99px;
      font-size: 0.75rem;
      font-weight: 800;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      cursor: pointer;
    }

    .btn-pencil.active-pencil {
      background: #8b5cf6;
      border-color: #8b5cf6;
    }

    /* Board Frame */
    .board-frame {
      padding: 0.8rem;
      border-radius: 20px;
      max-width: 520px;
      margin: 0 auto 1.5rem;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
    }

    .sudoku-grid {
      display: grid;
      grid-template-rows: repeat(9, 1fr);
      border: 3px solid #6366f1;
      border-radius: 12px;
      overflow: hidden;
    }

    .grid-row {
      display: grid;
      grid-template-columns: repeat(9, 1fr);
    }

    .grid-row:nth-child(3), .grid-row:nth-child(6) {
      border-bottom: 3px solid #6366f1;
    }

    .grid-cell {
      aspect-ratio: 1 / 1;
      border: 1px solid rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: clamp(1.2rem, 3.5vw, 1.8rem);
      font-weight: 800;
      user-select: none;
      transition: background-color 0.15s;
      background: rgba(255, 255, 255, 0.02);
    }

    .grid-cell:nth-child(3), .grid-cell:nth-child(6) {
      border-right: 3px solid #6366f1;
    }

    .cell-initial {
      color: var(--text-color, #fff);
      font-weight: 900;
      background: rgba(255, 255, 255, 0.05);
    }

    .cell-user {
      color: #38bdf8;
    }

    .cell-selected {
      background: #8b5cf6 !important;
      color: #fff !important;
    }

    .cell-highlighted {
      background: rgba(139, 92, 246, 0.18);
    }

    .cell-same-val {
      background: rgba(56, 189, 248, 0.25);
    }

    .cell-error {
      background: rgba(239, 68, 68, 0.4) !important;
      color: #fca5a5 !important;
    }

    .notes-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      width: 100%;
      height: 100%;
      padding: 2px;
    }

    .note-num {
      font-size: 0.6rem;
      font-weight: 600;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Keypad */
    .controls-card {
      padding: 1.25rem;
      border-radius: 18px;
      max-width: 520px;
      margin: 0 auto;
    }

    .keypad-grid {
      display: grid;
      grid-template-columns: repeat(9, 1fr);
      gap: 6px;
      margin-bottom: 1rem;
    }

    .key-btn {
      aspect-ratio: 1 / 1;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: var(--text-color, #fff);
      font-size: 1.3rem;
      font-weight: 900;
      cursor: pointer;
      transition: all 0.15s;
    }

    .key-btn:hover {
      background: #8b5cf6;
      color: #fff;
      transform: scale(1.05);
    }

    .action-keys-row {
      display: flex;
      gap: 0.6rem;
      justify-content: space-between;
    }

    .btn-action-key {
      flex: 1;
      padding: 0.65rem 0.5rem;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: var(--text-color, #fff);
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .btn-action-key.btn-active {
      background: #8b5cf6;
      color: #fff;
    }

    .btn-hint {
      background: rgba(234, 179, 8, 0.2);
      border-color: rgba(234, 179, 8, 0.4);
      color: #fde047;
    }

    /* Victory Modal */
    .win-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 2.5rem;
      border-radius: 24px;
      text-align: center;
      background: rgba(15, 23, 42, 0.96);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      z-index: 1000;
    }

    .win-box h2 {
      font-size: 1.8rem;
      font-weight: 900;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .win-box p {
      color: #94a3b8;
      margin-bottom: 1.5rem;
    }

    .btn-new-puzzle {
      padding: 0.75rem 2rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #8b5cf6, #38bdf8);
      color: #fff;
      font-weight: 800;
      font-size: 1rem;
      border: none;
      cursor: pointer;
    }
  `]
})
export class SudokuComponent implements OnInit, OnDestroy {
  board: SudokuCell[][] = [];
  solution: number[][] = [];
  selectedCell = signal<SudokuCell | null>(null);
  difficulty = signal<'easy' | 'medium' | 'hard'>('easy');
  pencilMode = signal<boolean>(false);
  mistakes = signal<number>(0);
  secondsElapsed = signal<number>(0);
  isCompleted = signal<boolean>(false);

  private timerInterval: any;

  ngOnInit() {
    this.newGame();
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  setDifficulty(d: 'easy' | 'medium' | 'hard') {
    this.difficulty.set(d);
    this.newGame();
  }

  newGame() {
    this.mistakes.set(0);
    this.secondsElapsed.set(0);
    this.isCompleted.set(false);
    this.selectedCell.set(null);

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => this.secondsElapsed.update(s => s + 1), 1000);

    const fullGrid = this.generateCompleteSudoku();
    this.solution = fullGrid.map(row => [...row]);

    // Remove numbers based on difficulty
    const clues = this.difficulty() === 'easy' ? 42 : (this.difficulty() === 'medium' ? 32 : 24);
    const puzzle = this.createPuzzleFromSolution(fullGrid, clues);

    this.board = [];
    for (let r = 0; r < 9; r++) {
      const row: SudokuCell[] = [];
      for (let c = 0; c < 9; c++) {
        const val = puzzle[r][c];
        row.push({
          row: r,
          col: c,
          val: val === 0 ? null : val,
          initial: val !== 0,
          notes: [],
          isError: false
        });
      }
      this.board.push(row);
    }
  }

  generateCompleteSudoku(): number[][] {
    const grid: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));
    this.solveSudoku(grid);
    return grid;
  }

  solveSudoku(grid: number[][]): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          const numbers = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
          for (const num of numbers) {
            if (this.isValidPlacement(grid, r, c, num)) {
              grid[r][c] = num;
              if (this.solveSudoku(grid)) return true;
              grid[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  isValidPlacement(grid: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
      const boxR = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const boxC = 3 * Math.floor(col / 3) + (i % 3);
      if (grid[boxR][boxC] === num) return false;
    }
    return true;
  }

  createPuzzleFromSolution(fullGrid: number[][], cluesToKeep: number): number[][] {
    const puzzle = fullGrid.map(row => [...row]);
    let removed = 81 - cluesToKeep;
    while (removed > 0) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (puzzle[r][c] !== 0) {
        puzzle[r][c] = 0;
        removed--;
      }
    }
    return puzzle;
  }

  selectCell(cell: SudokuCell) {
    this.selectedCell.set(cell);
  }

  inputNumber(n: number) {
    const cell = this.selectedCell();
    if (!cell || cell.initial || this.isCompleted()) return;

    if (this.pencilMode()) {
      if (cell.notes.includes(n)) {
        cell.notes = cell.notes.filter(x => x !== n);
      } else {
        cell.notes.push(n);
        cell.notes.sort();
      }
      return;
    }

    cell.notes = [];
    const correctVal = this.solution[cell.row][cell.col];

    if (n === correctVal) {
      cell.val = n;
      cell.isError = false;
      this.checkVictory();
    } else {
      cell.val = n;
      cell.isError = true;
      this.mistakes.update(m => m + 1);
    }
  }

  eraseCell() {
    const cell = this.selectedCell();
    if (!cell || cell.initial || this.isCompleted()) return;
    cell.val = null;
    cell.notes = [];
    cell.isError = false;
  }

  getHint() {
    const cell = this.selectedCell();
    if (!cell || cell.initial || this.isCompleted()) return;
    const correct = this.solution[cell.row][cell.col];
    cell.val = correct;
    cell.notes = [];
    cell.isError = false;
    this.checkVictory();
  }

  checkVictory() {
    const allFilledAndCorrect = this.board.every((row, r) => 
      row.every((cell, c) => cell.val === this.solution[r][c])
    );
    if (allFilledAndCorrect) {
      this.isCompleted.set(true);
      if (this.timerInterval) clearInterval(this.timerInterval);
    }
  }

  getCellClass(cell: SudokuCell): string {
    const sel = this.selectedCell();
    let cls = cell.initial ? 'cell-initial' : 'cell-user';

    if (cell.isError) cls += ' cell-error';

    if (sel) {
      if (sel.row === cell.row && sel.col === cell.col) {
        cls += ' cell-selected';
      } else if (sel.row === cell.row || sel.col === cell.col || 
                (Math.floor(sel.row/3) === Math.floor(cell.row/3) && Math.floor(sel.col/3) === Math.floor(cell.col/3))) {
        cls += ' cell-highlighted';
      }

      if (sel.val && cell.val === sel.val && (sel.row !== cell.row || sel.col !== cell.col)) {
        cls += ' cell-same-val';
      }
    }

    return cls;
  }

  formatTime(totalSec: number): string {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
