import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

type PlayerMark = 'X' | 'O';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.css']
})
export class TicTacToeComponent implements OnInit {
  board: (PlayerMark | null)[] = Array(9).fill(null);
  turn = signal<PlayerMark>('X');
  winner = signal<PlayerMark | 'draw' | null>(null);
  winLine = signal<number[]>([]);
  gameMode = signal<'unbeatable' | 'easy' | '2p'>('unbeatable');

  xWins = signal(0);
  oWins = signal(0);
  ties = signal(0);

  ngOnInit() {
    this.resetGame();
  }

  setMode(m: 'unbeatable' | 'easy' | '2p') {
    this.gameMode.set(m);
    this.xWins.set(0);
    this.oWins.set(0);
    this.ties.set(0);
    this.resetGame();
  }

  resetGame() {
    this.board = Array(9).fill(null);
    this.turn.set('X');
    this.winner.set(null);
    this.winLine.set([]);
  }

  onCellClick(idx: number) {
    if (this.board[idx] || this.winner()) return;
    if (this.gameMode() !== '2p' && this.turn() === 'O') return;

    this.makeMove(idx, this.turn());

    if (!this.winner()) {
      const next = this.turn() === 'X' ? 'O' : 'X';
      this.turn.set(next);

      if (this.gameMode() !== '2p' && next === 'O') {
        setTimeout(() => this.makeAIMove(), 400);
      }
    }
  }

  makeMove(idx: number, player: PlayerMark) {
    this.board[idx] = player;
    this.checkWinner();
  }

  makeAIMove() {
    if (this.winner()) return;

    let bestIdx = -1;
    if (this.gameMode() === 'easy') {
      const empty = this.board.map((v, i) => v === null ? i : -1).filter(i => i !== -1);
      bestIdx = empty[Math.floor(Math.random() * empty.length)];
    } else {
      // Minimax
      bestIdx = this.minimaxBestMove(this.board);
    }

    if (bestIdx !== -1) {
      this.makeMove(bestIdx, 'O');
      if (!this.winner()) this.turn.set('X');
    }
  }

  minimaxBestMove(b: (PlayerMark | null)[]): number {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
      if (b[i] === null) {
        b[i] = 'O';
        const score = this.minimax(b, 0, false);
        b[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }

  minimax(b: (PlayerMark | null)[], depth: number, isMax: boolean): number {
    const win = this.evaluateWin(b);
    if (win === 'O') return 10 - depth;
    if (win === 'X') return depth - 10;
    if (b.every(x => x !== null)) return 0;

    if (isMax) {
      let maxEval = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) {
          b[i] = 'O';
          maxEval = Math.max(maxEval, this.minimax(b, depth + 1, false));
          b[i] = null;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < 9; i++) {
        if (b[i] === null) {
          b[i] = 'X';
          minEval = Math.min(minEval, this.minimax(b, depth + 1, true));
          b[i] = null;
        }
      }
      return minEval;
    }
  }

  evaluateWin(b: (PlayerMark | null)[]): PlayerMark | null {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const [a, bIdx, c] of lines) {
      if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
        return b[a];
      }
    }
    return null;
  }

  checkWinner() {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    for (const [a, b, c] of lines) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        const w = this.board[a]!;
        this.winner.set(w);
        this.winLine.set([a, b, c]);
        if (w === 'X') this.xWins.update(v => v + 1);
        else this.oWins.update(v => v + 1);
        return;
      }
    }

    if (this.board.every(cell => cell !== null)) {
      this.winner.set('draw');
      this.ties.update(v => v + 1);
    }
  }

  getCellClass(idx: number): string {
    return this.winLine().includes(idx) ? 'cell-win' : '';
  }
}
