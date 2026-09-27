import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  points: number;
  hits: number;
  alive: boolean;
}

interface PowerUp {
  x: number;
  y: number;
  type: 'expand' | 'multiball' | 'laser' | 'slow' | 'life';
  color: string;
  symbol: string;
  speed: number;
  active: boolean;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  speed: number;
}

@Component({
  selector: 'app-brick-breaker',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bb-page-container">
      
      <!-- Top Navigation -->
      <div class="bb-header-bar">
        <div class="header-left">
          <a routerLink="/games" class="back-button">
            <span class="back-arrow">←</span> All Games
          </a>
          <h1 class="game-heading">Neon Brick Breaker 🧱</h1>
        </div>

        <div class="header-right">
          <div class="stat-badge highscore-badge">
            <span>High Score: {{ highScore() }}</span>
          </div>

          <button (click)="toggleMute()" class="btn-mute" [title]="isMuted ? 'Unmute' : 'Mute'">
            <span>{{ isMuted ? '🔇' : '🔊' }}</span>
          </button>
        </div>
      </div>

      <!-- Card Container -->
      <div class="bb-card">
        <!-- Top Stats Grid -->
        <div class="stats-top-grid">
          <div class="stat-item">
            <span class="stat-lbl">SCORE</span>
            <span class="stat-num score-color">{{ score() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-lbl">STAGE</span>
            <span class="stat-num stage-color">{{ level() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-lbl">LIVES</span>
            <div class="lives-row">
              <span *ngFor="let i of [].constructor(lives())">❤️</span>
              <span *ngIf="lives() === 0" class="no-lives">0</span>
            </div>
          </div>
          <div class="stat-item">
            <span class="stat-lbl">COMBO</span>
            <span class="stat-num combo-color">{{ combo() > 1 ? 'x' + combo() : '1x' }}</span>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="canvas-wrapper">
          <canvas #gameCanvas width="640" height="480" class="game-canvas"></canvas>

          <!-- Start Ready Overlay -->
          <div *ngIf="gameState() === 'ready'" class="overlay-modal">
            <div class="modal-card">
              <div class="modal-icon-box">🚀</div>
              <h2 class="modal-title">Ready to Break?</h2>
              <p class="modal-subtitle">Use mouse, touch drag, or Left/Right Arrow keys to bounce the ball and smash glowing bricks.</p>
              <button (click)="startGame()" class="btn-play-primary">
                ⚡ PLAY NOW
              </button>
            </div>
          </div>

          <!-- Paused Overlay -->
          <div *ngIf="gameState() === 'paused'" class="overlay-modal">
            <div class="modal-card">
              <h2 class="modal-title pause-title">GAME PAUSED</h2>
              <button (click)="togglePause()" class="btn-play-primary">
                Resume (Space)
              </button>
            </div>
          </div>

          <!-- Game Over Overlay -->
          <div *ngIf="gameState() === 'gameover'" class="overlay-modal">
            <div class="modal-card">
              <div class="modal-icon-large">💥</div>
              <h2 class="defeat-title">GAME OVER</h2>
              <p class="modal-subtitle">Final Score: <b class="score-highlight">{{ score() }}</b></p>
              <button (click)="restartGame()" class="btn-play-primary defeat-btn">
                TRY AGAIN
              </button>
            </div>
          </div>

          <!-- Stage Win Overlay -->
          <div *ngIf="gameState() === 'win'" class="overlay-modal">
            <div class="modal-card">
              <div class="modal-icon-large">🏆</div>
              <h2 class="victory-title">STAGE CLEARED!</h2>
              <p class="modal-subtitle">Bonus +{{ level() * 500 }} Points!</p>
              <button (click)="nextLevel()" class="btn-play-primary victory-btn">
                NEXT LEVEL (Stage {{ level() + 1 }})
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Touch Bar -->
        <div class="mobile-touch-panel">
          <button (touchstart)="startMoveLeft()" (touchend)="stopMove()" class="touch-btn">◀ Left</button>
          <button (touchstart)="startMoveRight()" (touchend)="stopMove()" class="touch-btn">Right ▶</button>
        </div>

        <!-- Footer Legend -->
        <div class="card-footer">
          <div class="keys-legend">
            <span>🖱️ Mouse / Touch</span>
            <span>⌨️ ◀ / ▶ Arrows</span>
            <span>⏸️ Space to Pause</span>
          </div>
          <div class="footer-actions">
            <button *ngIf="gameState() === 'playing'" (click)="togglePause()" class="btn-footer">Pause</button>
            <button (click)="restartGame()" class="btn-footer">Restart</button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .bb-page-container {
      max-width: 780px;
      margin: 0 auto;
      padding: 1.5rem 1rem 3rem 1rem;
      font-family: inherit;
      color: var(--text-color, #f8fafc);
      user-select: none;
    }

    /* Top Bar */
    .bb-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.2rem;
      flex-wrap: wrap;
      gap: 0.8rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .back-button {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.2s;
    }

    .back-button:hover {
      color: #f59e0b;
      border-color: rgba(245, 158, 11, 0.4);
    }

    .game-heading {
      font-size: 1.35rem;
      font-weight: 900;
      margin: 0;
      color: #fff;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .stat-badge {
      padding: 0.35rem 0.75rem;
      border-radius: 99px;
      font-family: monospace;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .highscore-badge {
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.35);
      color: #fbbf24;
    }

    .btn-mute {
      padding: 0.35rem 0.65rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      font-size: 0.9rem;
    }

    /* Card Wrapper */
    .bb-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 1.25rem;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(12px);
    }

    .stats-top-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .stat-item {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 0.6rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stat-lbl { font-size: 0.65rem; font-weight: 800; color: #94a3b8; letter-spacing: 0.5px; }
    .stat-num { font-size: 1.35rem; font-weight: 900; font-family: monospace; }
    .score-color { color: #fbbf24; }
    .stage-color { color: #22d3ee; }
    .combo-color { color: #34d399; }
    .lives-row { font-size: 1rem; min-height: 1.5rem; display: flex; align-items: center; justify-content: center; gap: 2px; }
    .no-lives { color: #64748b; font-family: monospace; font-size: 0.85rem; }

    /* Canvas Frame */
    .canvas-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 3;
      background: #020617;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .game-canvas {
      width: 100%;
      height: 100%;
      display: block;
      cursor: none;
    }

    /* Modals */
    .overlay-modal {
      position: absolute;
      inset: 0;
      background: rgba(2, 6, 23, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 20;
      padding: 1rem;
    }

    .modal-card {
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 18px;
      padding: 1.75rem;
      max-width: 380px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .modal-icon-box {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      background: rgba(245, 158, 11, 0.2);
      border: 1px solid rgba(245, 158, 11, 0.4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      margin-bottom: 0.8rem;
    }

    .modal-icon-large { font-size: 2.5rem; margin-bottom: 0.4rem; }
    .modal-title { font-size: 1.5rem; font-weight: 900; color: #fff; margin: 0 0 0.4rem 0; }
    .pause-title { color: #fbbf24; }
    .victory-title { font-size: 1.6rem; font-weight: 900; color: #34d399; margin: 0 0 0.4rem 0; }
    .defeat-title { font-size: 1.6rem; font-weight: 900; color: #f43f5e; margin: 0 0 0.4rem 0; }
    .modal-subtitle { font-size: 0.85rem; color: #94a3b8; line-height: 1.4; margin-bottom: 1.25rem; }
    .score-highlight { color: #fbbf24; font-family: monospace; }

    .btn-play-primary {
      width: 100%;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 900;
      font-size: 0.95rem;
      background: linear-gradient(135deg, #f59e0b, #ea580c);
      color: #000;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35);
      transition: all 0.2s;
    }

    .btn-play-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
    }

    .victory-btn { background: linear-gradient(135deg, #10b981, #06b6d4); color: #000; }
    .defeat-btn { background: linear-gradient(135deg, #f43f5e, #fb923c); color: #000; }

    /* Mobile Controls */
    .mobile-touch-panel {
      display: none;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    @media (max-width: 640px) {
      .mobile-touch-panel { display: grid; }
    }

    .touch-btn {
      padding: 0.85rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      font-size: 1rem;
      font-weight: 800;
      cursor: pointer;
    }

    .touch-btn:active { background: #f59e0b; color: #000; }

    /* Footer */
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1rem;
      padding-top: 0.8rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.75rem;
      color: #94a3b8;
    }

    .keys-legend { display: flex; gap: 1rem; flex-wrap: wrap; }
    .footer-actions { display: flex; gap: 0.5rem; }
    .btn-footer {
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
    }
  `]
})
export class BrickBreakerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  score = signal(0);
  level = signal(1);
  lives = signal(3);
  combo = signal(1);
  highScore = signal(0);
  gameState = signal<'ready' | 'playing' | 'paused' | 'gameover' | 'win'>('ready');
  isMuted = false;

  private ctx!: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private audioCtx: AudioContext | null = null;

  private paddle = { x: 270, y: 450, w: 100, h: 14, speed: 8, dx: 0, defaultW: 100 };
  private balls: Ball[] = [];
  private bricks: Brick[] = [];
  private powerUps: PowerUp[] = [];
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private touchMoveDir: 'left' | 'right' | null = null;

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d')!;
    
    const saved = localStorage.getItem('brick_breaker_highscore');
    if (saved) this.highScore.set(parseInt(saved, 10));

    this.setupListeners();
    this.resetLevel();
    this.render();
  }

  ngOnDestroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.audioCtx) this.audioCtx.close();
  }

  private initAudio() {
    if (typeof window === 'undefined') return;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number) {
    if (this.isMuted) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Audio error catch
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
  }

  private setupListeners() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    
    canvas.addEventListener('mousemove', (e) => {
      if (this.gameState() !== 'playing') return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const mouseX = (e.clientX - rect.left) * scaleX;
      this.paddle.x = Math.max(0, Math.min(canvas.width - this.paddle.w, mouseX - this.paddle.w / 2));
    });

    canvas.addEventListener('touchmove', (e) => {
      if (this.gameState() !== 'playing') return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const touchX = (e.touches[0].clientX - rect.left) * scaleX;
      this.paddle.x = Math.max(0, Math.min(canvas.width - this.paddle.w, touchX - this.paddle.w / 2));
    }, { passive: false });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      this.paddle.dx = -this.paddle.speed;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      this.paddle.dx = this.paddle.speed;
    } else if (e.code === 'Space') {
      e.preventDefault();
      if (this.gameState() === 'ready') this.startGame();
      else if (this.gameState() === 'playing' || this.gameState() === 'paused') this.togglePause();
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(e: KeyboardEvent) {
    if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(e.key)) {
      this.paddle.dx = 0;
    }
  }

  startMoveLeft() { this.touchMoveDir = 'left'; }
  startMoveRight() { this.touchMoveDir = 'right'; }
  stopMove() { this.touchMoveDir = null; }

  startGame() {
    this.initAudio();
    this.gameState.set('playing');
    this.gameLoop();
  }

  togglePause() {
    if (this.gameState() === 'playing') {
      this.gameState.set('paused');
    } else if (this.gameState() === 'paused') {
      this.gameState.set('playing');
      this.gameLoop();
    }
  }

  restartGame() {
    this.score.set(0);
    this.level.set(1);
    this.lives.set(3);
    this.combo.set(1);
    this.resetLevel();
    this.gameState.set('playing');
    this.gameLoop();
  }

  nextLevel() {
    this.level.update(l => l + 1);
    this.score.update(s => s + this.level() * 500);
    this.resetLevel();
    this.gameState.set('playing');
    this.gameLoop();
  }

  private resetLevel() {
    const canvas = this.canvasRef?.nativeElement;
    const cw = canvas ? canvas.width : 640;
    const ch = canvas ? canvas.height : 480;

    this.paddle.w = this.paddle.defaultW;
    this.paddle.x = (cw - this.paddle.w) / 2;
    this.paddle.y = ch - 35;
    this.paddle.dx = 0;

    const baseSpeed = 4.5 + this.level() * 0.5;
    this.balls = [{
      x: cw / 2,
      y: this.paddle.y - 15,
      dx: (Math.random() > 0.5 ? 1 : -1) * (baseSpeed * 0.7),
      dy: -baseSpeed,
      radius: 7,
      speed: baseSpeed
    }];

    this.powerUps = [];
    this.buildBricks();
  }

  private buildBricks() {
    const rows = 5 + Math.min(3, this.level() - 1);
    const cols = 9;
    const padding = 6;
    const offsetTop = 45;
    const offsetLeft = 25;
    const brickW = (640 - offsetLeft * 2 - (cols - 1) * padding) / cols;
    const brickH = 18;

    const colors = [
      '#f43f5e',
      '#fb923c',
      '#facc15',
      '#34d399',
      '#38bdf8',
      '#a855f7',
      '#ec4899',
      '#06b6d4'
    ];

    this.bricks = [];
    for (let r = 0; r < rows; r++) {
      const color = colors[r % colors.length];
      const points = (rows - r) * 10;
      const hits = r === 0 && this.level() > 2 ? 2 : 1;

      for (let c = 0; c < cols; c++) {
        if (this.level() === 2 && (r + c) % 2 === 1) continue;
        if (this.level() >= 3 && r === 2 && (c === 2 || c === 6)) continue;

        this.bricks.push({
          x: offsetLeft + c * (brickW + padding),
          y: offsetTop + r * (brickH + padding),
          w: brickW,
          h: brickH,
          color,
          points,
          hits,
          alive: true
        });
      }
    }
  }

  private gameLoop = () => {
    if (this.gameState() !== 'playing') return;

    this.update();
    this.render();

    this.animFrameId = requestAnimationFrame(this.gameLoop);
  };

  private update() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    if (this.touchMoveDir === 'left') this.paddle.x -= this.paddle.speed;
    else if (this.touchMoveDir === 'right') this.paddle.x += this.paddle.speed;
    else this.paddle.x += this.paddle.dx;

    this.paddle.x = Math.max(0, Math.min(canvas.width - this.paddle.w, this.paddle.x));

    for (const p of this.powerUps) {
      if (!p.active) continue;
      p.y += p.speed;

      if (
        p.y + 12 >= this.paddle.y &&
        p.y - 12 <= this.paddle.y + this.paddle.h &&
        p.x >= this.paddle.x &&
        p.x <= this.paddle.x + this.paddle.w
      ) {
        p.active = false;
        this.applyPowerUp(p.type);
        this.playTone(880, 'sine', 0.15);
      } else if (p.y > canvas.height + 20) {
        p.active = false;
      }
    }

    for (let i = this.balls.length - 1; i >= 0; i--) {
      const ball = this.balls[i];
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.dx = Math.abs(ball.dx);
        this.playTone(300, 'square', 0.05);
      } else if (ball.x + ball.radius >= canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.dx = -Math.abs(ball.dx);
        this.playTone(300, 'square', 0.05);
      }

      if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.dy = Math.abs(ball.dy);
        this.playTone(300, 'square', 0.05);
      }

      if (
        ball.y + ball.radius >= this.paddle.y &&
        ball.y - ball.radius <= this.paddle.y + this.paddle.h &&
        ball.x >= this.paddle.x &&
        ball.x <= this.paddle.x + this.paddle.w
      ) {
        ball.dy = -Math.abs(ball.dy);
        
        const hitOffset = (ball.x - (this.paddle.x + this.paddle.w / 2)) / (this.paddle.w / 2);
        const maxAngle = Math.PI / 3;
        const bounceAngle = hitOffset * maxAngle;

        const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = currentSpeed * Math.sin(bounceAngle);
        ball.dy = -currentSpeed * Math.cos(bounceAngle);

        this.combo.set(1);
        this.playTone(440, 'sine', 0.08);
      }

      for (const brick of this.bricks) {
        if (!brick.alive) continue;

        if (
          ball.x + ball.radius >= brick.x &&
          ball.x - ball.radius <= brick.x + brick.w &&
          ball.y + ball.radius >= brick.y &&
          ball.y - ball.radius <= brick.y + brick.h
        ) {
          const prevX = ball.x - ball.dx;
          if (prevX < brick.x || prevX > brick.x + brick.w) {
            ball.dx = -ball.dx;
          } else {
            ball.dy = -ball.dy;
          }

          brick.hits--;
          if (brick.hits <= 0) {
            brick.alive = false;
            const pts = brick.points * this.combo();
            this.score.update(s => s + pts);
            this.combo.update(c => Math.min(8, c + 1));
            this.playTone(520 + this.combo() * 40, 'triangle', 0.07);

            if (Math.random() < 0.15) {
              this.spawnPowerUp(brick.x + brick.w / 2, brick.y + brick.h / 2);
            }
          } else {
            this.playTone(220, 'square', 0.05);
          }
          break;
        }
      }

      if (ball.y - ball.radius > canvas.height) {
        this.balls.splice(i, 1);
      }
    }

    if (this.balls.length === 0) {
      this.lives.update(l => l - 1);
      this.playTone(180, 'sawtooth', 0.3);

      if (this.lives() <= 0) {
        this.gameState.set('gameover');
        this.updateHighScore();
        return;
      } else {
        this.resetLevel();
      }
    }

    const activeBricks = this.bricks.filter(b => b.alive).length;
    if (activeBricks === 0) {
      this.gameState.set('win');
      this.updateHighScore();
      this.playTone(700, 'sine', 0.4);
    }
  }

  private spawnPowerUp(x: number, y: number) {
    const types: PowerUp['type'][] = ['expand', 'multiball', 'slow', 'life'];
    const type = types[Math.floor(Math.random() * types.length)];
    const config = {
      expand: { color: '#38bdf8', symbol: '↔️' },
      multiball: { color: '#fb923c', symbol: '⚡' },
      slow: { color: '#34d399', symbol: '🐢' },
      life: { color: '#f43f5e', symbol: '❤️' },
      laser: { color: '#ec4899', symbol: '🔫' }
    }[type];

    this.powerUps.push({
      x,
      y,
      type,
      color: config.color,
      symbol: config.symbol,
      speed: 2.2,
      active: true
    });
  }

  private applyPowerUp(type: PowerUp['type']) {
    switch (type) {
      case 'expand':
        this.paddle.w = Math.min(180, this.paddle.w + 30);
        setTimeout(() => this.paddle.w = this.paddle.defaultW, 10000);
        break;
      case 'multiball':
        if (this.balls.length > 0) {
          const b = this.balls[0];
          this.balls.push(
            { x: b.x, y: b.y, dx: -b.dx, dy: b.dy, radius: b.radius, speed: b.speed },
            { x: b.x, y: b.y, dx: b.dx * 0.8, dy: -Math.abs(b.dy), radius: b.radius, speed: b.speed }
          );
        }
        break;
      case 'slow':
        for (const b of this.balls) {
          b.dx *= 0.7;
          b.dy *= 0.7;
        }
        break;
      case 'life':
        this.lives.update(l => Math.min(5, l + 1));
        break;
    }
  }

  private updateHighScore() {
    if (this.score() > this.highScore()) {
      this.highScore.set(this.score());
      if (this.isBrowser) {
        localStorage.setItem('brick_breaker_highscore', this.score().toString());
      }
    }
  }

  private render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, '#020617');
    bgGrad.addColorStop(1, '#090d1f');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (const brick of this.bricks) {
      if (!brick.alive) continue;

      ctx.save();
      ctx.shadowColor = brick.color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = brick.color;
      
      this.roundRect(ctx, brick.x, brick.y, brick.w, brick.h, 4);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      this.roundRect(ctx, brick.x + 2, brick.y + 2, brick.w - 4, brick.h / 3, 2);
      ctx.fill();

      ctx.restore();
    }

    for (const p of this.powerUps) {
      if (!p.active) continue;
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.symbol, p.x, p.y);
      ctx.restore();
    }

    ctx.save();
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    const paddleGrad = ctx.createLinearGradient(this.paddle.x, 0, this.paddle.x + this.paddle.w, 0);
    paddleGrad.addColorStop(0, '#f59e0b');
    paddleGrad.addColorStop(0.5, '#fbbf24');
    paddleGrad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = paddleGrad;
    this.roundRect(ctx, this.paddle.x, this.paddle.y, this.paddle.w, this.paddle.h, 7);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.roundRect(ctx, this.paddle.x + 4, this.paddle.y + 2, this.paddle.w - 8, 3, 2);
    ctx.fill();
    ctx.restore();

    for (const ball of this.balls) {
      ctx.save();
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
}
