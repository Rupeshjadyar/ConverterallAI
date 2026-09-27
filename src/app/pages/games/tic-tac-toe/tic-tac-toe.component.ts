import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

type PlayerMark = 'X' | 'O';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="ttt-container">
      
      <div class="game-header">
        <div class="header-left">
          <a routerLink="/games" class="back-link">← All Games</a>
          <h1 class="game-title">Tic-Tac-Toe Neon ❌⭕</h1>
        </div>

        <div class="header-controls">
          <div class="mode-select">
            <label>Mode:</label>
            <select [ngModel]="gameMode()" (ngModelChange)="setMode($event)">
              <option value="unbeatable">🤖 vs Unbeatable AI</option>
              <option value="easy">🤖 vs Casual AI</option>
              <option value="2p">👥 2 Players (Pass & Play)</option>
            </select>
          </div>
          <button (click)="resetGame()" class="btn-top">🔄 Restart</button>
        </div>
      </div>

      <div class="ttt-arena">
        
        <!-- Scoreboard -->
        <div class="scoreboard glass">
          <div class="score-card player-x" [class.turn-glow]="turn() === 'X' && !winner()">
            <span class="player-label">PLAYER X (You)</span>
            <span class="score-num">{{ xWins() }}</span>
          </div>

          <div class="score-card ties-card">
            <span class="player-label">TIES</span>
            <span class="score-num">{{ ties() }}</span>
          </div>

          <div class="score-card player-o" [class.turn-glow]="turn() === 'O' && !winner()">
            <span class="player-label">{{ gameMode() === '2p' ? 'PLAYER O' : 'AI BOT (O)' }}</span>
            <span class="score-num">{{ oWins() }}</span>
          </div>
        </div>

        <!-- 3x3 Grid Board -->
        <div class="board-frame glass">
          <div class="ttt-grid">
            <div *ngFor="let cell of board; let idx = index" 
                 class="ttt-cell" 
                 [ngClass]="getCellClass(idx)"
                 (click)="onCellClick(idx)">
              
              <span *ngIf="cell === 'X'" class="mark-x">✕</span>
              <span *ngIf="cell === 'O'" class="mark-o">◯</span>
            </div>
          </div>
        </div>

        <!-- Result Status -->
        <div *ngIf="winner()" class="winner-box glass">
          <h2 *ngIf="winner() === 'X'">🎉 Player X Takes The Win!</h2>
          <h2 *ngIf="winner() === 'O'">🎉 Player O (AI) Wins!</h2>
          <h2 *ngIf="winner() === 'draw'">🤝 It's a Tie Game!</h2>
          <button (click)="resetGame()" class="btn-play-again">Play Next Round ➔</button>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .ttt-container {
      max-width: 520px;
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

    /* Scoreboard */
    .scoreboard {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 16px;
      margin-bottom: 1.5rem;
    }

    .score-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.6rem;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.2s;
    }

    .player-label {
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.05em;
    }

    .score-num {
      font-size: 1.4rem;
      font-weight: 900;
    }

    .player-x .player-label { color: #38bdf8; }
    .player-x .score-num { color: #38bdf8; }
    .player-x.turn-glow {
      border-color: #38bdf8;
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);
    }

    .player-o .player-label { color: #ec4899; }
    .player-o .score-num { color: #ec4899; }
    .player-o.turn-glow {
      border-color: #ec4899;
      box-shadow: 0 0 15px rgba(236, 72, 153, 0.4);
    }

    .ties-card .player-label { color: #94a3b8; }
    .ties-card .score-num { color: #fff; }

    /* Board Frame */
    .board-frame {
      padding: 1rem;
      border-radius: 20px;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
      margin-bottom: 1.5rem;
    }

    .ttt-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 10px;
      width: 100%;
      aspect-ratio: 1 / 1;
    }

    .ttt-cell {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s;
    }

    .ttt-cell:hover {
      background: rgba(255, 255, 255, 0.08);
      transform: scale(1.02);
    }

    .cell-win {
      background: rgba(139, 92, 246, 0.3) !important;
      border-color: #a855f7 !important;
      box-shadow: 0 0 25px rgba(168, 85, 247, 0.6);
      animation: winPulse 0.8s infinite alternate;
    }

    @keyframes winPulse {
      from { transform: scale(1); }
      to { transform: scale(1.06); }
    }

    .mark-x {
      font-size: clamp(3rem, 10vw, 4.5rem);
      font-weight: 900;
      color: #38bdf8;
      text-shadow: 0 0 20px rgba(56, 189, 248, 0.8);
      animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .mark-o {
      font-size: clamp(3rem, 10vw, 4.5rem);
      font-weight: 900;
      color: #ec4899;
      text-shadow: 0 0 20px rgba(236, 72, 153, 0.8);
      animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes popIn {
      from { transform: scale(0.3); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    /* Winner Box */
    .winner-box {
      padding: 1.5rem;
      border-radius: 18px;
      text-align: center;
      animation: popIn 0.3s;
    }

    .winner-box h2 {
      font-size: 1.4rem;
      font-weight: 900;
      color: #fff;
      margin-bottom: 1rem;
    }

    .btn-play-again {
      padding: 0.65rem 1.75rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #8b5cf6, #38bdf8);
      color: #fff;
      font-weight: 800;
      font-size: 0.95rem;
      border: none;
      cursor: pointer;
    }
  `]
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
