import { FixedGameClock } from '../fixed-game-clock';
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
  templateUrl: './brick-breaker.component.html',
  styleUrls: ['./brick-breaker.component.css']
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
