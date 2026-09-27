import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
type PieceColor = 'w' | 'b';

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

interface Move {
  from: [number, number];
  to: [number, number];
  piece: ChessPiece;
  captured?: ChessPiece | null;
  notation?: string;
}

@Component({
  selector: 'app-chess',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="chess-container">
      
      <!-- Top Header Navigation -->
      <div class="game-header">
        <div class="header-left">
          <a routerLink="/games" class="back-link">← All Games</a>
          <h1 class="game-title">Chess Master ♟️</h1>
        </div>

        <div class="game-controls-bar">
          <!-- Game Mode Switcher -->
          <div class="mode-select">
            <label>Mode:</label>
            <select [ngModel]="gameMode()" (ngModelChange)="setMode($event)">
              <option value="ai">🤖 vs Computer AI</option>
              <option value="2p">👥 2 Players (Pass & Play)</option>
            </select>
          </div>

          <!-- AI Difficulty -->
          <div class="mode-select" *ngIf="gameMode() === 'ai'">
            <label>AI Level:</label>
            <select [ngModel]="aiDifficulty()" (ngModelChange)="aiDifficulty.set($event)">
              <option value="easy">Casual (Easy)</option>
              <option value="medium">Tactical (Medium)</option>
              <option value="hard">Master (Hard)</option>
            </select>
          </div>

          <button (click)="resetGame()" class="btn-control btn-new">🔄 New Game</button>
          <button (click)="flipBoard()" class="btn-control btn-flip">🔄 Flip Board</button>
        </div>
      </div>

      <!-- Main Game Arena -->
      <div class="chess-arena">
        
        <!-- Left Side: Board & Captures -->
        <div class="board-column">
          
          <!-- Black Player Card & Captures -->
          <div class="player-bar black-bar" [class.turn-active]="turn() === 'b' && !isGameOver()">
            <div class="player-info">
              <span class="player-avatar">🤖</span>
              <div>
                <span class="player-name">{{ gameMode() === 'ai' ? 'Computer AI (Black)' : 'Black Player' }}</span>
                <span class="player-sub">{{ turn() === 'b' ? 'Thinking / Turn...' : 'Waiting' }}</span>
              </div>
            </div>
            <div class="captured-tray">
              <span *ngFor="let p of capturedByWhite()" class="captured-piece">{{ getPieceSymbol(p) }}</span>
            </div>
          </div>

          <!-- The 8x8 Chess Board -->
          <div class="board-wrapper">
            <div class="chess-board" [class.board-flipped]="isFlipped()">
              <div *ngFor="let row of displayRows(); let rIdx = index" class="board-row">
                <div *ngFor="let col of displayCols(); let cIdx = index" 
                     class="board-square" 
                     [ngClass]="getSquareClass(row, col)"
                     (click)="onSquareClick(row, col)">
                  
                  <!-- Rank/File Labels on edges -->
                  <span *ngIf="cIdx === 0" class="coord rank-coord">{{ 8 - row }}</span>
                  <span *ngIf="rIdx === 7" class="coord file-coord">{{ getFileLabel(col) }}</span>

                  <!-- Move dot indicator -->
                  <div *ngIf="isLegalMove(row, col)" class="legal-dot" [class.has-capture]="board[row][col]"></div>

                  <!-- Chess Piece -->
                  <div *ngIf="board[row][col] as piece" 
                       class="piece" 
                       [ngClass]="[piece.color === 'w' ? 'white-piece' : 'black-piece', piece.type]">
                    {{ getPieceSymbol(piece) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- White Player Card & Captures -->
          <div class="player-bar white-bar" [class.turn-active]="turn() === 'w' && !isGameOver()">
            <div class="player-info">
              <span class="player-avatar">👤</span>
              <div>
                <span class="player-name">White Player (You)</span>
                <span class="player-sub">{{ turn() === 'w' ? 'Your Turn to Move' : 'Waiting' }}</span>
              </div>
            </div>
            <div class="captured-tray">
              <span *ngFor="let p of capturedByBlack()" class="captured-piece">{{ getPieceSymbol(p) }}</span>
            </div>
          </div>

        </div>

        <!-- Right Side: Move History & Match Stats -->
        <div class="sidebar-column glass">
          <div class="status-box" [ngClass]="statusBoxClass()">
            <div class="status-headline">{{ gameStatusText() }}</div>
            <div class="status-subtext" *ngIf="inCheck() && !isGameOver()">⚠️ King is in Check!</div>
          </div>

          <div class="move-history-card">
            <h3 class="history-title">📜 Move History ({{ moveHistory().length }})</h3>
            <div class="moves-scroll">
              <div *ngFor="let turnNum of getTurnNumbers()" class="move-row">
                <span class="turn-num">{{ turnNum }}.</span>
                <span class="move-cell white-move">{{ getMoveNotation(turnNum, 'w') }}</span>
                <span class="move-cell black-move">{{ getMoveNotation(turnNum, 'b') }}</span>
              </div>
              <div *ngIf="moveHistory().length === 0" class="no-moves">Game has just started. Make your first move!</div>
            </div>
          </div>

          <div class="quick-tips-card">
            <h4>💡 Quick Controls</h4>
            <ul>
              <li>Click any of your pieces to see legal target squares.</li>
              <li>Click green glowing dot to make a move.</li>
              <li>Toggle between <strong>AI Computer</strong> and <strong>2-Player Local</strong> anytime.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .chess-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
      font-family: inherit;
    }

    /* Header */
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

    .game-controls-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .mode-select {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: #94a3b8;
    }

    .mode-select select {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: var(--text-color, #fff);
      padding: 0.4rem 0.75rem;
      border-radius: 10px;
      font-size: 0.85rem;
      outline: none;
      cursor: pointer;
    }

    .btn-control {
      padding: 0.45rem 0.9rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
    }

    .btn-new {
      background: linear-gradient(135deg, #8b5cf6, #38bdf8);
      color: #fff;
    }

    .btn-flip {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
      color: var(--text-color, #fff);
    }

    /* Main Layout */
    .chess-arena {
      display: grid;
      grid-template-columns: minmax(320px, 640px) 1fr;
      gap: 2rem;
      align-items: start;
    }

    @media (max-width: 960px) {
      .chess-arena {
        grid-template-columns: 1fr;
      }
    }

    /* Player Bars */
    .player-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 0.6rem;
      transition: all 0.2s;
    }

    .white-bar {
      margin-top: 0.6rem;
      margin-bottom: 0;
    }

    .player-bar.turn-active {
      border-color: #8b5cf6;
      background: rgba(139, 92, 246, 0.12);
      box-shadow: 0 0 15px rgba(139, 92, 246, 0.2);
    }

    .player-info {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .player-avatar {
      font-size: 1.5rem;
    }

    .player-name {
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      display: block;
    }

    .player-sub {
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .captured-tray {
      display: flex;
      gap: 0.1rem;
      font-size: 1.25rem;
      user-select: none;
    }

    /* Board Wrapper */
    .board-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      max-width: 640px;
      margin: 0 auto;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
      border: 2px solid rgba(255, 255, 255, 0.15);
    }

    .chess-board {
      display: grid;
      grid-template-rows: repeat(8, 1fr);
      width: 100%;
      height: 100%;
    }

    .board-row {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
    }

    .board-square {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      transition: background-color 0.15s ease;
    }

    .sq-light {
      background-color: #e2e8f0;
    }

    .sq-dark {
      background-color: #475569;
    }

    .sq-selected {
      background-color: #a855f7 !important;
    }

    .sq-check {
      background-color: #ef4444 !important;
      animation: checkPulse 1s infinite alternate;
    }

    @keyframes checkPulse {
      from { box-shadow: inset 0 0 10px #b91c1c; }
      to { box-shadow: inset 0 0 25px #ff0000; }
    }

    .sq-last-move {
      background-color: rgba(234, 179, 8, 0.45) !important;
    }

    .coord {
      position: absolute;
      font-size: 0.65rem;
      font-weight: 800;
      pointer-events: none;
      opacity: 0.6;
    }

    .rank-coord {
      top: 2px;
      left: 3px;
    }

    .file-coord {
      bottom: 2px;
      right: 3px;
    }

    .piece {
      font-size: clamp(1.8rem, 6vw, 3.2rem);
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4));
      transition: transform 0.15s;
    }

    .board-square:hover .piece {
      transform: scale(1.1);
    }

    .white-piece {
      color: #ffffff;
      text-shadow: 0 0 2px #000, 0 0 6px rgba(255, 255, 255, 0.8);
    }

    .black-piece {
      color: #0f172a;
      text-shadow: 0 0 1px #fff;
    }

    .legal-dot {
      position: absolute;
      width: 32%;
      height: 32%;
      border-radius: 50%;
      background: rgba(34, 197, 94, 0.7);
      box-shadow: 0 0 8px rgba(34, 197, 94, 0.9);
      pointer-events: none;
      z-index: 5;
    }

    .legal-dot.has-capture {
      width: 80%;
      height: 80%;
      background: transparent;
      border: 4px solid rgba(239, 68, 68, 0.85);
      box-shadow: 0 0 12px rgba(239, 68, 68, 0.9);
    }

    /* Sidebar Column */
    .sidebar-column {
      padding: 1.5rem;
      border-radius: 18px;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .status-box {
      padding: 1rem;
      border-radius: 14px;
      text-align: center;
    }

    .status-box.active-turn {
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.35);
      color: #c4b5fd;
    }

    .status-box.game-won {
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid rgba(34, 197, 94, 0.4);
      color: #4ade80;
    }

    .status-headline {
      font-size: 1.15rem;
      font-weight: 800;
    }

    .status-subtext {
      font-size: 0.85rem;
      font-weight: 700;
      color: #f87171;
      margin-top: 0.3rem;
    }

    .move-history-card {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 14px;
      padding: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .history-title {
      font-size: 0.95rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      margin-bottom: 0.75rem;
    }

    .moves-scroll {
      max-height: 220px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .move-row {
      display: grid;
      grid-template-columns: 35px 1fr 1fr;
      font-size: 0.85rem;
      padding: 0.2rem 0.4rem;
      border-radius: 6px;
    }

    .move-row:nth-child(even) {
      background: rgba(255, 255, 255, 0.03);
    }

    .turn-num {
      color: #64748b;
      font-weight: 700;
    }

    .move-cell {
      font-weight: 600;
      color: var(--text-color, #fff);
    }

    .no-moves {
      color: #64748b;
      font-size: 0.82rem;
      text-align: center;
      padding: 1rem;
    }

    .quick-tips-card {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 14px;
      padding: 1rem;
    }

    .quick-tips-card h4 {
      font-size: 0.9rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      margin-bottom: 0.5rem;
    }

    .quick-tips-card ul {
      margin: 0;
      padding-left: 1.2rem;
      font-size: 0.8rem;
      color: #94a3b8;
      line-height: 1.5;
    }

    /* Light Theme */
    :host-context(body.light-theme) .mode-select select { background: #fff; border-color: #cbd5e1; color: #0f172a; }
    :host-context(body.light-theme) .player-bar { background: #f8fafc; border-color: #e2e8f0; }
    :host-context(body.light-theme) .player-name { color: #0f172a; }
    :host-context(body.light-theme) .sidebar-column { background: #ffffff; border: 1px solid #e2e8f0; }
    :host-context(body.light-theme) .move-history-card { background: #f8fafc; border-color: #e2e8f0; }
    :host-context(body.light-theme) .move-cell { color: #0f172a; }
  `]
})
export class ChessComponent implements OnInit {
  board: (ChessPiece | null)[][] = [];
  turn = signal<PieceColor>('w');
  selectedSquare = signal<[number, number] | null>(null);
  legalMoves = signal<[number, number][]>([]);
  moveHistory = signal<Move[]>([]);
  isGameOver = signal<boolean>(false);
  gameWinner = signal<PieceColor | 'draw' | null>(null);
  inCheck = signal<boolean>(false);
  
  gameMode = signal<'ai' | '2p'>('ai');
  aiDifficulty = signal<'easy' | 'medium' | 'hard'>('medium');
  isFlipped = signal<boolean>(false);

  capturedByWhite = signal<ChessPiece[]>([]);
  capturedByBlack = signal<ChessPiece[]>([]);

  displayRows = computed(() => this.isFlipped() ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7]);
  displayCols = computed(() => this.isFlipped() ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7]);

  ngOnInit() {
    this.resetGame();
  }

  setMode(mode: 'ai' | '2p') {
    this.gameMode.set(mode);
    this.resetGame();
  }

  flipBoard() {
    this.isFlipped.set(!this.isFlipped());
  }

  resetGame() {
    this.board = this.createInitialBoard();
    this.turn.set('w');
    this.selectedSquare.set(null);
    this.legalMoves.set([]);
    this.moveHistory.set([]);
    this.isGameOver.set(false);
    this.gameWinner.set(null);
    this.inCheck.set(false);
    this.capturedByWhite.set([]);
    this.capturedByBlack.set([]);
  }

  createInitialBoard(): (ChessPiece | null)[][] {
    const b: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Major pieces
    const backRow: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    for (let c = 0; c < 8; c++) {
      b[0][c] = { type: backRow[c], color: 'b' };
      b[1][c] = { type: 'p', color: 'b' };
      b[6][c] = { type: 'p', color: 'w' };
      b[7][c] = { type: backRow[c], color: 'w' };
    }
    return b;
  }

  onSquareClick(r: number, c: number) {
    if (this.isGameOver()) return;
    if (this.gameMode() === 'ai' && this.turn() === 'b') return; // AI's turn

    const selected = this.selectedSquare();
    const piece = this.board[r][c];

    // If square is in legal moves -> execute move
    if (selected && this.isLegalMove(r, c)) {
      this.makeMove(selected[0], selected[1], r, c);
      this.selectedSquare.set(null);
      this.legalMoves.set([]);

      if (!this.isGameOver() && this.gameMode() === 'ai' && this.turn() === 'b') {
        setTimeout(() => this.makeAIMove(), 400);
      }
      return;
    }

    // Select piece of current player's turn
    if (piece && piece.color === this.turn()) {
      this.selectedSquare.set([r, c]);
      this.legalMoves.set(this.getPieceLegalMoves(r, c, this.board));
    } else {
      this.selectedSquare.set(null);
      this.legalMoves.set([]);
    }
  }

  isLegalMove(r: number, c: number): boolean {
    return this.legalMoves().some(([lr, lc]) => lr === r && lc === c);
  }

  makeMove(fromR: number, fromC: number, toR: number, toC: number) {
    const piece = this.board[fromR][fromC]!;
    const captured = this.board[toR][toC];

    if (captured) {
      if (piece.color === 'w') {
        this.capturedByWhite.update(arr => [...arr, captured]);
      } else {
        this.capturedByBlack.update(arr => [...arr, captured]);
      }
    }

    // Move piece
    this.board[toR][toC] = piece;
    this.board[fromR][fromC] = null;

    // Pawn Promotion
    if (piece.type === 'p' && (toR === 0 || toR === 7)) {
      piece.type = 'q';
    }

    // Log move
    const notation = this.generateNotation(piece, fromR, fromC, toR, toC, captured != null);
    const move: Move = { from: [fromR, fromC], to: [toR, toC], piece: { ...piece }, captured, notation };
    this.moveHistory.update(arr => [...arr, move]);

    // Next turn
    const nextTurn = this.turn() === 'w' ? 'b' : 'w';
    this.turn.set(nextTurn);

    // Check & Checkmate evaluation
    const inCheck = this.isKingInCheck(nextTurn, this.board);
    this.inCheck.set(inCheck);

    const hasMoves = this.hasAnyLegalMoves(nextTurn, this.board);
    if (!hasMoves) {
      this.isGameOver.set(true);
      if (inCheck) {
        this.gameWinner.set(piece.color);
      } else {
        this.gameWinner.set('draw'); // Stalemate
      }
    }
  }

  makeAIMove() {
    if (this.isGameOver() || this.turn() !== 'b') return;

    const allMoves: { from: [number, number]; to: [number, number]; score: number }[] = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (p && p.color === 'b') {
          const moves = this.getPieceLegalMoves(r, c, this.board);
          for (const [tr, tc] of moves) {
            let score = 0;
            const target = this.board[tr][tc];
            if (target) {
              const values: Record<PieceType, number> = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };
              score += values[target.type];
            }
            // Control center bonus
            if ((tr === 3 || tr === 4) && (tc === 3 || tc === 4)) score += 3;
            allMoves.push({ from: [r, c], to: [tr, tc], score });
          }
        }
      }
    }

    if (allMoves.length === 0) return;

    // Sort by score
    allMoves.sort((a, b) => b.score - a.score);

    let chosenMove = allMoves[0];
    if (this.aiDifficulty() === 'easy') {
      chosenMove = allMoves[Math.floor(Math.random() * allMoves.length)];
    } else if (this.aiDifficulty() === 'medium') {
      const topFew = allMoves.slice(0, Math.min(3, allMoves.length));
      chosenMove = topFew[Math.floor(Math.random() * topFew.length)];
    }

    this.makeMove(chosenMove.from[0], chosenMove.from[1], chosenMove.to[0], chosenMove.to[1]);
  }

  getPieceLegalMoves(r: number, c: number, b: (ChessPiece | null)[][]): [number, number][] {
    const piece = b[r][c];
    if (!piece) return [];

    const rawMoves = this.getRawMoves(r, c, piece, b);
    // Filter out moves that leave own King in check
    return rawMoves.filter(([tr, tc]) => {
      const tempBoard = b.map(row => [...row]);
      tempBoard[tr][tc] = piece;
      tempBoard[r][c] = null;
      return !this.isKingInCheck(piece.color, tempBoard);
    });
  }

  getRawMoves(r: number, c: number, piece: ChessPiece, b: (ChessPiece | null)[][]): [number, number][] {
    const moves: [number, number][] = [];
    const color = piece.color;
    const enemy = color === 'w' ? 'b' : 'w';

    const addIfValid = (nr: number, nc: number): boolean => {
      if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) return false;
      const target = b[nr][nc];
      if (!target) {
        moves.push([nr, nc]);
        return true; // continue sliding
      }
      if (target.color === enemy) {
        moves.push([nr, nc]);
      }
      return false; // hit piece, stop sliding
    };

    if (piece.type === 'p') {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      // 1 square forward
      if (r + dir >= 0 && r + dir < 8 && !b[r + dir][c]) {
        moves.push([r + dir, c]);
        // 2 squares forward from starting rank
        if (r === startRow && !b[r + 2 * dir][c]) {
          moves.push([r + 2 * dir, c]);
        }
      }
      // Diagonal captures
      for (const dc of [-1, 1]) {
        const tr = r + dir;
        const tc = c + dc;
        if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
          const t = b[tr][tc];
          if (t && t.color === enemy) moves.push([tr, tc]);
        }
      }
    } else if (piece.type === 'n') {
      const knightOffsets = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      for (const [dr, dc] of knightOffsets) addIfValid(r + dr, c + dc);
    } else if (piece.type === 'b') {
      const dirs = [[-1,-1],[-1,1],[1,-1],[1,1]];
      for (const [dr, dc] of dirs) {
        let step = 1;
        while (addIfValid(r + dr * step, c + dc * step)) step++;
      }
    } else if (piece.type === 'r') {
      const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
      for (const [dr, dc] of dirs) {
        let step = 1;
        while (addIfValid(r + dr * step, c + dc * step)) step++;
      }
    } else if (piece.type === 'q') {
      const dirs = [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
      for (const [dr, dc] of dirs) {
        let step = 1;
        while (addIfValid(r + dr * step, c + dc * step)) step++;
      }
    } else if (piece.type === 'k') {
      const dirs = [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
      for (const [dr, dc] of dirs) addIfValid(r + dr, c + dc);
    }

    return moves;
  }

  isKingInCheck(color: PieceColor, b: (ChessPiece | null)[][]): boolean {
    let kingR = -1;
    let kingC = -1;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = b[r][c];
        if (p && p.type === 'k' && p.color === color) {
          kingR = r;
          kingC = c;
          break;
        }
      }
    }

    if (kingR === -1) return false;

    const enemy = color === 'w' ? 'b' : 'w';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = b[r][c];
        if (p && p.color === enemy) {
          const raw = this.getRawMoves(r, c, p, b);
          if (raw.some(([tr, tc]) => tr === kingR && tc === kingC)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  hasAnyLegalMoves(color: PieceColor, b: (ChessPiece | null)[][]): boolean {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = b[r][c];
        if (p && p.color === color) {
          if (this.getPieceLegalMoves(r, c, b).length > 0) return true;
        }
      }
    }
    return false;
  }

  getPieceSymbol(piece: ChessPiece): string {
    const symbols: Record<PieceColor, Record<PieceType, string>> = {
      w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
      b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
    };
    return symbols[piece.color][piece.type];
  }

  getFileLabel(col: number): string {
    return String.fromCharCode(97 + col);
  }

  getSquareClass(r: number, c: number): string {
    const isDark = (r + c) % 2 === 1;
    let cls = isDark ? 'sq-dark' : 'sq-light';
    
    const sel = this.selectedSquare();
    if (sel && sel[0] === r && sel[1] === c) {
      cls += ' sq-selected';
    }

    const p = this.board[r][c];
    if (p && p.type === 'k' && p.color === this.turn() && this.inCheck()) {
      cls += ' sq-check';
    }

    const last = this.moveHistory().slice(-1)[0];
    if (last && ((last.from[0] === r && last.from[1] === c) || (last.to[0] === r && last.to[1] === c))) {
      cls += ' sq-last-move';
    }

    return cls;
  }

  generateNotation(p: ChessPiece, fr: number, fc: number, tr: number, tc: number, isCap: boolean): string {
    const pLetter = p.type === 'p' ? (isCap ? this.getFileLabel(fc) : '') : p.type.toUpperCase();
    const capSign = isCap ? 'x' : '';
    const dest = `${this.getFileLabel(tc)}${8 - tr}`;
    return `${pLetter}${capSign}${dest}`;
  }

  gameStatusText(): string {
    if (this.isGameOver()) {
      const winner = this.gameWinner();
      if (winner === 'w') return '🏆 Checkmate! White Wins!';
      if (winner === 'b') return '🏆 Checkmate! Black Wins!';
      return '🤝 Game Drawn by Stalemate!';
    }
    return this.turn() === 'w' ? '⚪ White’s Turn' : '⚫ Black’s Turn';
  }

  statusBoxClass(): string {
    if (this.isGameOver()) return 'game-won';
    return 'active-turn';
  }

  getTurnNumbers(): number[] {
    const count = Math.ceil(this.moveHistory().length / 2);
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  getMoveNotation(turnNum: number, color: PieceColor): string {
    const index = (turnNum - 1) * 2 + (color === 'w' ? 0 : 1);
    const m = this.moveHistory()[index];
    return m ? m.notation || '' : '';
  }
}
