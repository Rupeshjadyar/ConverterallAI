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
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css']
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
