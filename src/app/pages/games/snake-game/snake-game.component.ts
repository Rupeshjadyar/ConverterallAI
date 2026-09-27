import { Component, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-snake-game',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="snake-container">
      
      <div class="game-header">
        <div class="header-left">
          <a routerLink="/games" class="back-link">← All Games</a>
          <h1 class="game-title">Retro Snake Arcade 🐍</h1>
        </div>

        <div class="header-scores">
          <div class="score-badge glass">
            <span class="badge-label">SCORE</span>
            <span class="badge-num">{{ score() }}</span>
          </div>
          <div class="score-badge glass best-badge">
            <span class="badge-label">BEST</span>
            <span class="badge-num">{{ bestScore() }}</span>
          </div>
        </div>
      </div>

      <!-- Controls & Speed -->
      <div class="settings-bar">
        <div class="speed-select">
          <label>Speed:</label>
          <select [ngModel]="speedSetting()" (ngModelChange)="setSpeed($event)">
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
            <option value="insane">Insane 🔥</option>
          </select>
        </div>

        <div class="btn-group">
          <button (click)="togglePause()" class="btn-top" [disabled]="isGameOver()">
            {{ isPaused() ? '▶ Resume' : '⏸ Pause' }}
          </button>
          <button (click)="resetGame()" class="btn-top btn-restart">
            🔄 Restart
          </button>
        </div>
      </div>

      <!-- Canvas Arcade Screen -->
      <div class="canvas-wrapper glass">
        <canvas #gameCanvas width="400" height="400" class="snake-canvas"></canvas>

        <!-- Game Over Modal -->
        <div *ngIf="isGameOver()" class="game-over-overlay">
          <div class="game-over-box">
            <h2>💥 GAME OVER</h2>
            <p>Score: <strong>{{ score() }}</strong> | Best: <strong>{{ bestScore() }}</strong></p>
            <button (click)="resetGame()" class="btn-play-again">Play Again ➔</button>
          </div>
        </div>

        <!-- Pause Screen -->
        <div *ngIf="isPaused() && !isGameOver()" class="game-over-overlay">
          <div class="game-over-box">
            <h2>⏸ PAUSED</h2>
            <button (click)="togglePause()" class="btn-play-again">Resume Game</button>
          </div>
        </div>
      </div>

      <!-- Mobile On-Screen D-Pad -->
      <div class="dpad-container">
        <div class="dpad-row">
          <button (click)="setDirection(0, -1)" class="dpad-key">▲</button>
        </div>
        <div class="dpad-row">
          <button (click)="setDirection(-1, 0)" class="dpad-key">◀</button>
          <button (click)="setDirection(0, 1)" class="dpad-key">▼</button>
          <button (click)="setDirection(1, 0)" class="dpad-key">▶</button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .snake-container {
      max-width: 520px;
      margin: 0 auto;
      padding: 1.5rem;
      font-family: inherit;
    }

    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
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

    .header-scores {
      display: flex;
      gap: 0.5rem;
    }

    .score-badge {
      padding: 0.4rem 0.8rem;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 70px;
    }

    .best-badge { border-color: rgba(234, 179, 8, 0.4); }
    .badge-label { font-size: 0.65rem; font-weight: 800; color: #94a3b8; }
    .badge-num { font-size: 1.15rem; font-weight: 900; color: #fff; }

    .settings-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .speed-select select {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: var(--text-color, #fff);
      padding: 0.35rem 0.65rem;
      border-radius: 8px;
      font-size: 0.82rem;
      outline: none;
    }

    .btn-group {
      display: flex;
      gap: 0.4rem;
    }

    .btn-top {
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.8rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
    }

    .btn-restart {
      background: linear-gradient(135deg, #8b5cf6, #38bdf8);
      border: none;
    }

    /* Canvas Frame */
    .canvas-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 20px;
      overflow: hidden;
      background: #020617;
      border: 3px solid rgba(34, 197, 94, 0.3);
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
    }

    .snake-canvas {
      width: 100%;
      height: 100%;
      display: block;
    }

    .game-over-overlay {
      position: absolute;
      inset: 0;
      background: rgba(2, 6, 23, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      z-index: 10;
    }

    .game-over-box h2 {
      font-size: 2rem;
      font-weight: 900;
      color: #ef4444;
      margin-bottom: 0.5rem;
    }

    .game-over-box p {
      color: #94a3b8;
      margin-bottom: 1.5rem;
    }

    .btn-play-again {
      padding: 0.75rem 2rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #22c55e, #10b981);
      color: #000;
      font-weight: 900;
      font-size: 1rem;
      border: none;
      cursor: pointer;
    }

    /* D-Pad */
    .dpad-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      margin-top: 1.25rem;
    }

    .dpad-row {
      display: flex;
      gap: 0.4rem;
    }

    .dpad-key {
      width: 52px;
      height: 48px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .dpad-key:active {
      background: #22c55e;
      color: #000;
    }
  `]
})
export class SnakeGameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  score = signal(0);
  bestScore = signal(0);
  isGameOver = signal(false);
  isPaused = signal(false);
  speedSetting = signal<'normal' | 'fast' | 'insane'>('normal');

  private gridSize = 20; // 20x20 grid
  private cellSize = 20;
  private snake: Point[] = [];
  private dir: Point = { x: 1, y: 0 };
  private nextDir: Point = { x: 1, y: 0 };
  private food: Point = { x: 10, y: 10 };
  private bonusFood: Point | null = null;
  private gameLoopId: any;
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d')!;
    const saved = localStorage.getItem('snake_best_score');
    if (saved) this.bestScore.set(parseInt(saved, 10));
    this.resetGame();
  }

  ngOnDestroy() {
    if (this.gameLoopId) clearInterval(this.gameLoopId);
  }

  setSpeed(s: 'normal' | 'fast' | 'insane') {
    this.speedSetting.set(s);
    if (!this.isGameOver() && !this.isPaused()) {
      this.startLoop();
    }
  }

  resetGame() {
    this.snake = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 }
    ];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.score.set(0);
    this.isGameOver.set(false);
    this.isPaused.set(false);
    this.bonusFood = null;
    this.spawnFood();

    this.startLoop();
  }

  togglePause() {
    this.isPaused.set(!this.isPaused());
    if (this.isPaused()) {
      clearInterval(this.gameLoopId);
    } else {
      this.startLoop();
    }
  }

  private startLoop() {
    if (this.gameLoopId) clearInterval(this.gameLoopId);
    const intervals: Record<string, number> = { normal: 110, fast: 80, insane: 50 };
    this.gameLoopId = setInterval(() => this.update(), intervals[this.speedSetting()]);
  }

  @HostListener('window:keydown', ['$event'])
  handleKey(e: KeyboardEvent) {
    if (this.isGameOver()) return;
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { e.preventDefault(); this.setDirection(0, -1); }
    if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { e.preventDefault(); this.setDirection(0, 1); }
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); this.setDirection(-1, 0); }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); this.setDirection(1, 0); }
    if (e.key === ' ') { e.preventDefault(); this.togglePause(); }
  }

  setDirection(dx: number, dy: number) {
    // Prevent 180-degree instant reversal
    if (dx !== 0 && this.dir.x !== -dx) {
      this.nextDir = { x: dx, y: 0 };
    } else if (dy !== 0 && this.dir.y !== -dy) {
      this.nextDir = { x: 0, y: dy };
    }
  }

  private update() {
    this.dir = this.nextDir;

    const head: Point = {
      x: this.snake[0].x + this.dir.x,
      y: this.snake[0].y + this.dir.y
    };

    // Wall Collision
    if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
      this.triggerGameOver();
      return;
    }

    // Self Collision
    if (this.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      this.triggerGameOver();
      return;
    }

    this.snake.unshift(head);

    // Eat regular food
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score.update(s => s + 10);
      if (this.score() > this.bestScore()) {
        this.bestScore.set(this.score());
        localStorage.setItem('snake_best_score', this.score().toString());
      }
      this.spawnFood();
      if (Math.random() > 0.7 && !this.bonusFood) {
        this.spawnBonusFood();
      }
    } else if (this.bonusFood && head.x === this.bonusFood.x && head.y === this.bonusFood.y) {
      this.score.update(s => s + 50);
      this.bonusFood = null;
    } else {
      this.snake.pop();
    }

    this.render();
  }

  private spawnFood() {
    let p: Point;
    do {
      p = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
    } while (this.snake.some(s => s.x === p.x && s.y === p.y));
    this.food = p;
  }

  private spawnBonusFood() {
    let p: Point;
    do {
      p = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
    } while (this.snake.some(s => s.x === p.x && s.y === p.y) || (this.food.x === p.x && this.food.y === p.y));
    this.bonusFood = p;
  }

  private triggerGameOver() {
    this.isGameOver.set(true);
    clearInterval(this.gameLoopId);
  }

  private render() {
    const ctx = this.ctx;
    const canvas = this.canvasRef.nativeElement;

    // Clear Canvas
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= this.gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * this.cellSize, 0);
      ctx.lineTo(i * this.cellSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * this.cellSize);
      ctx.lineTo(canvas.width, i * this.cellSize);
      ctx.stroke();
    }

    // Food (Apple)
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(
      this.food.x * this.cellSize + this.cellSize / 2,
      this.food.y * this.cellSize + this.cellSize / 2,
      this.cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Bonus Food (Gold Star)
    if (this.bonusFood) {
      ctx.fillStyle = '#eab308';
      ctx.shadowColor = '#eab308';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(
        this.bonusFood.x * this.cellSize + this.cellSize / 2,
        this.bonusFood.y * this.cellSize + this.cellSize / 2,
        this.cellSize / 2 - 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Snake
    this.snake.forEach((seg, idx) => {
      ctx.fillStyle = idx === 0 ? '#4ade80' : '#22c55e';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = idx === 0 ? 12 : 6;

      ctx.fillRect(
        seg.x * this.cellSize + 1,
        seg.y * this.cellSize + 1,
        this.cellSize - 2,
        this.cellSize - 2
      );
    });

    ctx.shadowBlur = 0;
  }
}
