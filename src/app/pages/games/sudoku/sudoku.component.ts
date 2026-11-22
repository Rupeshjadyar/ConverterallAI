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
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.css']
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
