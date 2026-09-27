import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pong',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="pong-page-container">
      
      <!-- Top Navigation -->
      <div class="pong-header-bar">
        <div class="header-left">
          <a routerLink="/games" class="back-button">
            <span class="back-arrow">←</span> All Games
          </a>
          <h1 class="game-heading">Neon Cyber Pong 🏓</h1>
        </div>

        <div class="header-right">
          <div class="stat-badge rally-badge">
            <span>Rally: {{ rallyCount() }} | Max: {{ maxRally() }}</span>
          </div>

          <button (click)="toggleMute()" class="btn-mute" [title]="isMuted ? 'Unmute' : 'Mute'">
            <span>{{ isMuted ? '🔇' : '🔊' }}</span>
          </button>
        </div>
      </div>

      <!-- Settings & Controls Bar -->
      <div class="pong-card">
        <div class="settings-toolbar">
          <div class="setting-group">
            <span class="setting-label">Mode:</span>
            <div class="btn-pill-group">
              <button (click)="setMode('ai')" [class.active]="gameMode() === 'ai'" class="btn-pill">
                🤖 1P vs AI
              </button>
              <button (click)="setMode('2p')" [class.active]="gameMode() === '2p'" class="btn-pill">
                👥 2-Player Local
              </button>
            </div>
          </div>

          <div *ngIf="gameMode() === 'ai'" class="setting-group">
            <span class="setting-label">Difficulty:</span>
            <div class="btn-pill-group">
              <button *ngFor="let diff of ['easy', 'medium', 'hard']" (click)="setDifficulty(diff)" [class.active]="difficulty() === diff" class="btn-pill capitalize">
                {{ diff }}
              </button>
            </div>
          </div>

          <div class="setting-group">
            <span class="setting-label">Play to:</span>
            <div class="btn-pill-group">
              <button *ngFor="let pts of [5, 10, 15]" (click)="setTargetScore(pts)" [class.active]="targetScore() === pts" class="btn-pill">
                {{ pts }} pts
              </button>
            </div>
          </div>
        </div>

        <!-- Scoreboard -->
        <div class="scoreboard-banner">
          <div class="score-player p1-score">
            <span class="player-title">{{ gameMode() === 'ai' ? 'Player 1 (You)' : 'Player 1 (Left)' }}</span>
            <span class="score-digits">{{ p1Score() }}</span>
          </div>

          <div class="vs-badge">VS</div>

          <div class="score-player p2-score">
            <span class="player-title">{{ gameMode() === 'ai' ? 'AI Bot' : 'Player 2 (Right)' }}</span>
            <span class="score-digits">{{ p2Score() }}</span>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="canvas-wrapper">
          <canvas #pongCanvas width="720" height="405" class="game-canvas"></canvas>

          <!-- Start / Ready Overlay -->
          <div *ngIf="gameState() === 'ready'" class="overlay-modal">
            <div class="modal-card">
              <div class="modal-icon-box">🏓</div>
              <h2 class="modal-title">Ready to Serve?</h2>
              <p class="modal-subtitle">
                {{ gameMode() === 'ai' ? 'Move paddle with W/S, Up/Down keys or Mouse/Touch to deflect the cyber ball.' : 'Player 1: W/S keys | Player 2: Up/Down Arrow keys' }}
              </p>
              <button (click)="startGame()" class="btn-serve-primary">
                ⚡ SERVE BALL
              </button>
            </div>
          </div>

          <!-- Winner Overlay -->
          <div *ngIf="gameState() === 'gameover'" class="overlay-modal">
            <div class="modal-card">
              <div class="modal-icon-large">🏆</div>
              <h2 class="victory-title">{{ winner() }} WINS!</h2>
              <p class="modal-subtitle">Final Score: {{ p1Score() }} - {{ p2Score() }} (Longest Rally: {{ maxRally() }})</p>
              <button (click)="restartMatch()" class="btn-serve-primary">
                PLAY AGAIN
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Touch Controls -->
        <div class="mobile-touch-panel">
          <div class="touch-player-box">
            <span class="touch-label p1-label">Player 1</span>
            <div class="touch-btn-row">
              <button (touchstart)="p1Up = true" (touchend)="p1Up = false" class="touch-ctrl-btn">▲</button>
              <button (touchstart)="p1Down = true" (touchend)="p1Down = false" class="touch-ctrl-btn">▼</button>
            </div>
          </div>

          <div *ngIf="gameMode() === '2p'" class="touch-player-box">
            <span class="touch-label p2-label">Player 2</span>
            <div class="touch-btn-row">
              <button (touchstart)="p2Up = true" (touchend)="p2Up = false" class="touch-ctrl-btn">▲</button>
              <button (touchstart)="p2Down = true" (touchend)="p2Down = false" class="touch-ctrl-btn">▼</button>
            </div>
          </div>
        </div>

        <!-- Footer Key Legend -->
        <div class="card-footer">
          <div class="keys-legend">
            <span>🎮 P1: <b>W / S</b> or <b>Mouse</b></span>
            <span *ngIf="gameMode() === '2p'">🎮 P2: <b>▲ / ▼ Arrows</b></span>
            <span>⏸️ <b>Space</b> to pause</span>
          </div>
          <button (click)="restartMatch()" class="btn-reset">Reset</button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .pong-page-container {
      max-width: 860px;
      margin: 0 auto;
      padding: 1.5rem 1rem 3rem 1rem;
      font-family: inherit;
      color: var(--text-color, #f8fafc);
      user-select: none;
    }

    /* Top Bar */
    .pong-header-bar {
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
      color: #06b6d4;
      border-color: rgba(6, 182, 212, 0.4);
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

    .rally-badge {
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.35);
      color: #22d3ee;
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
    .pong-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 1.25rem;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(12px);
    }

    .settings-toolbar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 1rem;
    }

    .setting-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .setting-label {
      font-size: 0.8rem;
      color: #94a3b8;
      font-weight: 600;
    }

    .btn-pill-group {
      display: flex;
      background: rgba(0, 0, 0, 0.35);
      padding: 2px;
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-pill {
      padding: 0.3rem 0.65rem;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-pill.capitalize { text-transform: capitalize; }

    .btn-pill.active {
      background: #06b6d4;
      color: #000;
    }

    /* Scoreboard */
    .scoreboard-banner {
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: rgba(0, 0, 0, 0.4);
      padding: 0.75rem;
      border-radius: 14px;
      margin-bottom: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .score-player { text-align: center; }
    .player-title { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; display: block; margin-bottom: 2px; }
    .p1-score .player-title { color: #22d3ee; }
    .p2-score .player-title { color: #f43f5e; }
    .score-digits { font-size: 2.5rem; font-weight: 900; font-family: monospace; }
    .p1-score .score-digits { color: #22d3ee; }
    .p2-score .score-digits { color: #f43f5e; }
    .vs-badge { font-family: monospace; font-size: 1.1rem; color: #64748b; font-weight: 800; }

    /* Canvas Frame */
    .canvas-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
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
      max-width: 400px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }

    .modal-icon-box {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      background: rgba(6, 182, 212, 0.2);
      border: 1px solid rgba(6, 182, 212, 0.4);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      margin-bottom: 0.8rem;
    }

    .modal-icon-large { font-size: 2.5rem; margin-bottom: 0.4rem; }
    .modal-title { font-size: 1.5rem; font-weight: 900; color: #fff; margin: 0 0 0.4rem 0; }
    .victory-title { font-size: 1.6rem; font-weight: 900; color: #22d3ee; margin: 0 0 0.4rem 0; }
    .modal-subtitle { font-size: 0.85rem; color: #94a3b8; line-height: 1.4; margin-bottom: 1.25rem; }

    .btn-serve-primary {
      width: 100%;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 900;
      font-size: 0.95rem;
      background: linear-gradient(135deg, #06b6d4, #3b82f6);
      color: #000;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(6, 182, 212, 0.35);
      transition: all 0.2s;
    }

    .btn-serve-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(6, 182, 212, 0.5);
    }

    /* Mobile Controls */
    .mobile-touch-panel {
      display: none;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 1rem;
    }

    @media (max-width: 640px) {
      .mobile-touch-panel { display: grid; }
    }

    .touch-player-box {
      background: rgba(0, 0, 0, 0.35);
      padding: 0.6rem;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }

    .touch-label { font-size: 0.75rem; font-weight: 800; }
    .p1-label { color: #22d3ee; }
    .p2-label { color: #f43f5e; }
    .touch-btn-row { display: flex; gap: 8px; width: 100%; }
    .touch-ctrl-btn {
      flex: 1;
      padding: 0.75rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      font-size: 1.1rem;
      font-weight: 900;
    }
    .touch-ctrl-btn:active { background: #06b6d4; color: #000; }

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
    .btn-reset {
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
    }
  `]
})
export class PongComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pongCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  p1Score = signal(0);
  p2Score = signal(0);
  rallyCount = signal(0);
  maxRally = signal(0);
  targetScore = signal(5);
  gameMode = signal<'ai' | '2p'>('ai');
  difficulty = signal<'easy' | 'medium' | 'hard'>('medium');
  gameState = signal<'ready' | 'playing' | 'paused' | 'gameover'>('ready');
  winner = signal('');
  isMuted = false;

  p1Up = false;
  p1Down = false;
  p2Up = false;
  p2Down = false;

  private ctx!: CanvasRenderingContext2D;
  private animFrameId: number | null = null;
  private audioCtx: AudioContext | null = null;

  private p1 = { x: 20, y: 150, w: 12, h: 80, speed: 7, vy: 0 };
  private p2 = { x: 688, y: 150, w: 12, h: 80, speed: 7, vy: 0 };

  private ball = {
    x: 360,
    y: 202,
    vx: 5,
    vy: 3,
    radius: 7,
    speed: 5.5,
    baseSpeed: 5.5,
    trail: [] as { x: number; y: number }[]
  };

  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private keys: { [key: string]: boolean } = {};

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    this.ctx = canvas.getContext('2d')!;

    this.setupListeners();
    this.resetPositions();
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
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Audio catch
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
  }

  setMode(mode: 'ai' | '2p') {
    this.gameMode.set(mode);
    this.restartMatch();
  }

  setDifficulty(diff: any) {
    this.difficulty.set(diff);
  }

  setTargetScore(pts: number) {
    this.targetScore.set(pts);
    this.restartMatch();
  }

  private setupListeners() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    canvas.addEventListener('mousemove', (e) => {
      if (this.gameState() !== 'playing') return;
      const rect = canvas.getBoundingClientRect();
      const scaleY = canvas.height / rect.height;
      const mouseY = (e.clientY - rect.top) * scaleY;
      this.p1.y = Math.max(0, Math.min(canvas.height - this.p1.h, mouseY - this.p1.h / 2));
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(e: KeyboardEvent) {
    this.keys[e.key] = true;
    if (e.code === 'Space') {
      e.preventDefault();
      if (this.gameState() === 'ready') this.startGame();
      else if (this.gameState() === 'playing') this.gameState.set('paused');
      else if (this.gameState() === 'paused') {
        this.gameState.set('playing');
        this.gameLoop();
      }
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(e: KeyboardEvent) {
    this.keys[e.key] = false;
  }

  startGame() {
    this.initAudio();
    this.gameState.set('playing');
    this.gameLoop();
  }

  restartMatch() {
    this.p1Score.set(0);
    this.p2Score.set(0);
    this.rallyCount.set(0);
    this.maxRally.set(0);
    this.resetPositions();
    this.gameState.set('ready');
    this.render();
  }

  private resetPositions(servingPlayer: 1 | 2 = 1) {
    const canvas = this.canvasRef?.nativeElement;
    const cw = canvas ? canvas.width : 720;
    const ch = canvas ? canvas.height : 405;

    this.p1.y = (ch - this.p1.h) / 2;
    this.p2.y = (ch - this.p2.h) / 2;

    this.ball.x = cw / 2;
    this.ball.y = ch / 2;
    this.ball.speed = this.ball.baseSpeed;
    this.ball.trail = [];

    const angle = (Math.random() * Math.PI / 4) - Math.PI / 8;
    const dir = servingPlayer === 1 ? -1 : 1;
    this.ball.vx = dir * this.ball.speed * Math.cos(angle);
    this.ball.vy = this.ball.speed * Math.sin(angle);
    this.rallyCount.set(0);
  }

  private gameLoop = () => {
    if (this.gameState() !== 'playing') return;

    this.update();
    this.render();

    this.animFrameId = requestAnimationFrame(this.gameLoop);
  };

  private update() {
    const canvas = this.canvasRef.nativeElement;

    if (this.keys['w'] || this.keys['W'] || this.p1Up) {
      this.p1.y -= this.p1.speed;
    }
    if (this.keys['s'] || this.keys['S'] || this.p1Down) {
      this.p1.y += this.p1.speed;
    }
    this.p1.y = Math.max(0, Math.min(canvas.height - this.p1.h, this.p1.y));

    if (this.gameMode() === '2p') {
      if (this.keys['ArrowUp'] || this.p2Up) {
        this.p2.y -= this.p2.speed;
      }
      if (this.keys['ArrowDown'] || this.p2Down) {
        this.p2.y += this.p2.speed;
      }
    } else {
      this.updateAI(canvas);
    }
    this.p2.y = Math.max(0, Math.min(canvas.height - this.p2.h, this.p2.y));

    this.ball.trail.push({ x: this.ball.x, y: this.ball.y });
    if (this.ball.trail.length > 8) this.ball.trail.shift();

    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;

    if (this.ball.y - this.ball.radius <= 0) {
      this.ball.y = this.ball.radius;
      this.ball.vy = -this.ball.vy;
      this.playTone(320, 'square', 0.05);
    } else if (this.ball.y + this.ball.radius >= canvas.height) {
      this.ball.y = canvas.height - this.ball.radius;
      this.ball.vy = -this.ball.vy;
      this.playTone(320, 'square', 0.05);
    }

    if (
      this.ball.x - this.ball.radius <= this.p1.x + this.p1.w &&
      this.ball.x + this.ball.radius >= this.p1.x &&
      this.ball.y >= this.p1.y &&
      this.ball.y <= this.p1.y + this.p1.h &&
      this.ball.vx < 0
    ) {
      this.handlePaddleBounce(this.p1, 1);
    }

    if (
      this.ball.x + this.ball.radius >= this.p2.x &&
      this.ball.x - this.ball.radius <= this.p2.x + this.p2.w &&
      this.ball.y >= this.p2.y &&
      this.ball.y <= this.p2.y + this.p2.h &&
      this.ball.vx > 0
    ) {
      this.handlePaddleBounce(this.p2, -1);
    }

    if (this.ball.x < 0) {
      this.p2Score.update(s => s + 1);
      this.playTone(200, 'sawtooth', 0.2);
      this.checkMatchOver();
      if (this.gameState() === 'playing') this.resetPositions(2);
    } else if (this.ball.x > canvas.width) {
      this.p1Score.update(s => s + 1);
      this.playTone(550, 'sine', 0.2);
      this.checkMatchOver();
      if (this.gameState() === 'playing') this.resetPositions(1);
    }
  }

  private handlePaddleBounce(paddle: typeof this.p1, dir: 1 | -1) {
    const hitOffset = (this.ball.y - (paddle.y + paddle.h / 2)) / (paddle.h / 2);
    const maxBounceAngle = (5 * Math.PI) / 12;
    const bounceAngle = hitOffset * maxBounceAngle;

    this.ball.speed = Math.min(13, this.ball.speed + 0.35);
    this.ball.vx = dir * this.ball.speed * Math.cos(bounceAngle);
    this.ball.vy = this.ball.speed * Math.sin(bounceAngle);

    this.rallyCount.update(r => r + 1);
    if (this.rallyCount() > this.maxRally()) {
      this.maxRally.set(this.rallyCount());
    }

    this.playTone(450 + Math.min(300, this.rallyCount() * 20), 'triangle', 0.08);
  }

  private updateAI(canvas: HTMLCanvasElement) {
    const targetY = this.ball.y - this.p2.h / 2;
    const diff = this.difficulty();
    let aiSpeed = 4.5;
    let reactionChance = 0.85;

    if (diff === 'easy') {
      aiSpeed = 3.5;
      reactionChance = 0.65;
    } else if (diff === 'hard') {
      aiSpeed = 6.2;
      reactionChance = 0.98;
    }

    if (this.ball.vx > 0 && Math.random() < reactionChance) {
      if (this.p2.y < targetY - 4) {
        this.p2.y += aiSpeed;
      } else if (this.p2.y > targetY + 4) {
        this.p2.y -= aiSpeed;
      }
    }
  }

  private checkMatchOver() {
    const target = this.targetScore();
    if (this.p1Score() >= target) {
      this.winner.set(this.gameMode() === 'ai' ? 'PLAYER 1' : 'PLAYER 1');
      this.gameState.set('gameover');
      this.playTone(880, 'sine', 0.4);
    } else if (this.p2Score() >= target) {
      this.winner.set(this.gameMode() === 'ai' ? 'AI BOT' : 'PLAYER 2');
      this.gameState.set('gameover');
      this.playTone(220, 'sawtooth', 0.4);
    }
  }

  private render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const canvas = this.canvasRef.nativeElement;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    for (let i = 0; i < this.ball.trail.length; i++) {
      const pos = this.ball.trail[i];
      const alpha = (i + 1) / (this.ball.trail.length + 1) * 0.3;
      ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.ball.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#22d3ee';
    this.roundRect(ctx, this.p1.x, this.p1.y, this.p1.w, this.p1.h, 6);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#fb7185';
    this.roundRect(ctx, this.p2.x, this.p2.y, this.p2.w, this.p2.h, 6);
    ctx.fill();
    ctx.restore();
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
