import { FixedGameClock } from '../fixed-game-clock';
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pong',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.css']
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

  private readonly clock = new FixedGameClock();

  private gameLoop = (timestamp?: number): void => {
    if (this.gameState() !== 'playing') return;
    if (timestamp === undefined) {
      if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
      this.clock.reset();
      this.render();
    } else {
      const ticks = this.clock.ticks(timestamp);
      for (let tick = 0; tick < ticks && this.gameState() === 'playing'; tick++) this.update();
      if (ticks) this.render();
    }
    if (this.gameState() === 'playing') this.animFrameId = requestAnimationFrame(this.gameLoop);
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
