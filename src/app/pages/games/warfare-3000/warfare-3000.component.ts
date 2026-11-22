import { Component, ElementRef, OnInit, OnDestroy, ViewChild, NgZone, ChangeDetectorRef, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { io, Socket } from 'socket.io-client';

// CONSTANTS FOR GAME WORLD & CONFIG
const ARENA_WIDTH = 1600;
const ARENA_HEIGHT = 1000;
const PRODUCTION_SERVER_URL = 'https://warfare3000-server.onrender.com';

interface PlayerState {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  a: number; // Angle in radians
  hp: number;
  score: number;

  // Lerp targets for client-side smoothing
  targetX?: number;
  targetY?: number;
  targetA?: number;
}

interface BulletState {
  id: string;
  x: number;
  y: number;
  ownerId: string;
}

interface KillFeedItem {
  id: string;
  text: string;
  time: number;
}

interface TouchJoystick {
  active: boolean;
  pointerId: number | null;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

@Component({
  selector: 'app-warfare-3000',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './warfare-3000.component.html',
  styleUrls: ['./warfare-3000.component.css']
})
export class Warfare3000Component implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  gameState: 'LOBBY' | 'PLAYING' = 'LOBBY';
  playerName: string = '';
  isConnected: boolean = false;
  isConnecting = false;
  joining = false;
  practice = false;
  serverStatus = 'Checking connection…';
  serverUrlDisplay: string = '';

  private socket: Socket | null = null;
  private serverUrl: string = '';
  private ctx!: CanvasRenderingContext2D;

  myPlayerId: string | null = null;
  localPlayer: PlayerState | null = null;
  players: Map<string, PlayerState> = new Map();
  bullets: BulletState[] = [];
  leaderboard: PlayerState[] = [];
  killFeed: KillFeedItem[] = [];

  // Controls State
  private keysPressed: { [key: string]: boolean } = {};
  private mouseWorldPos = { x: 0, y: 0 };
  private mouseScreenPos = { x: 0, y: 0 };
  private isMouseDown: boolean = false;

  // Touch Joysticks State
  private isTouchDevice: boolean = false;
  private moveJoystick: TouchJoystick = { active: false, pointerId: null, startX: 0, startY: 0, currentX: 0, currentY: 0 };
  private aimJoystick: TouchJoystick = { active: false, pointerId: null, startX: 0, startY: 0, currentX: 0, currentY: 0 };

  // Render & Camera
  private animFrameId: number | null = null;
  private inputIntervalId: any = null;
  private camera = { x: ARENA_WIDTH / 2, y: ARENA_HEIGHT / 2, scale: 1 };
  private dpr: number = 1;

  private platformId = inject(PLATFORM_ID);
  private view = inject(ChangeDetectorRef);
  private lifetime?: AbortController;
  private gameControls?: AbortController;
  private joinTimer?: ReturnType<typeof setTimeout>;
  private viewSize = { width: 1, height: 1 };
  private practiceShots: (BulletState & { a: number; age: number })[] = [];
  private nextPracticeShot = 0;
  private shotId = 0;
  private practiceHudAt = 0;
  private matchGeneration = 0;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.lifetime = new AbortController();
    try { this.playerName = localStorage.getItem('warfare3000_callsign') || ''; } catch { /* Optional storage. */ }
    if (!this.playerName) this.playerName = 'Tanker_' + Math.floor(100 + Math.random() * 900);
    this.serverUrl = this.detectServerUrl();
    this.serverUrlDisplay = this.serverUrl.replace(/^https?:\/\//, '');
    this.initCanvas();
    if (this.ctx) this.retryConnection();
  }

  ngOnDestroy(): void {
    this.lifetime?.abort();
    this.stopMatch();
    this.disconnectSocket();
  }

  private disconnectSocket(): void {
    clearTimeout(this.joinTimer);
    this.socket?.removeAllListeners();
    this.socket?.disconnect();
    this.socket = null;
  }

  leaveMatch(): void {
    this.stopMatch();
    this.gameState = 'LOBBY';
    this.practice = false;
    this.retryConnection();
  }

  private stopMatch(): void {
    this.matchGeneration++;
    this.gameControls?.abort();
    if (this.animFrameId !== null) cancelAnimationFrame(this.animFrameId);
    clearInterval(this.inputIntervalId);
    clearTimeout(this.joinTimer);
    this.animFrameId = null;
    this.inputIntervalId = null;
    this.joining = false;
    this.myPlayerId = null;
    this.localPlayer = null;
    this.players.clear();
    this.leaderboard = [];
    this.bullets = [];
    this.practiceShots = [];
    this.killFeed = [];
    this.resetControls();
  }

  private resetControls(): void {
    this.keysPressed = {};
    this.isMouseDown = false;
    this.moveJoystick.active = false;
    this.aimJoystick.active = false;
  }

  private detectServerUrl(): string {
    const hostname = window.location.hostname;
    // Check if localhost or local IP
    const isLocal = 
      hostname === 'localhost' || 
      hostname === '127.0.0.1' || 
      /^192\.168\./.test(hostname) || 
      /^10\./.test(hostname) || 
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname);

    if (isLocal) {
      return `http://${hostname}:3000`;
    }
    return PRODUCTION_SERVER_URL;
  }

  retryConnection(): void {
    this.disconnectSocket();
    this.isConnected = false;
    this.isConnecting = true;
    this.serverStatus = 'Checking multiplayer connection…';
    const socket = io(this.serverUrl, {
      transports: ['polling', 'websocket'],
      reconnection: false,
      timeout: 4_500,
    });
    this.socket = socket;

    socket.on('connect', () => {
      this.isConnected = true;
      this.isConnecting = false;
      this.serverStatus = 'Multiplayer available';
      this.view.markForCheck();
    });

    const unavailable = () => {
      if (this.gameState === 'PLAYING' && !this.practice) {
        this.stopMatch();
        this.gameState = 'LOBBY';
      }
      this.joining = false;
      this.isConnected = false;
      this.isConnecting = false;
      this.serverStatus = 'Multiplayer unavailable. Local practice is ready.';
      this.view.markForCheck();
    };
    socket.on('connect_error', unavailable);
    socket.on('disconnect', unavailable);
    socket.on('init', (data: { id: string }) => {
      if (!this.joining || !data?.id) return;
      clearTimeout(this.joinTimer);
      this.joining = false;
      this.myPlayerId = data.id;
      this.beginMatch();
    });
    socket.on('gameState', (snapshot) => {
      if (this.gameState === 'PLAYING' && !this.practice) this.handleServerGameState(snapshot);
    });
    socket.on('playerKilled', (data) => {
      if (this.gameState === 'PLAYING' && !this.practice) this.addKillFeedItem(data);
    });
  }

  joinGame(): void {
    const name = this.playerName.trim().slice(0, 12);
    if (!name || !this.socket?.connected || this.joining || !this.ctx) return;
    try { localStorage.setItem('warfare3000_callsign', name); } catch { /* Optional storage. */ }
    this.joining = true;
    this.socket.emit('join', { name });
    this.joinTimer = setTimeout(() => {
      this.joining = false;
      this.serverStatus = 'The arena did not answer. Retry the connection or start local practice.';
      this.isConnected = false;
      this.disconnectSocket();
      this.view.markForCheck();
    }, 4_500);
  }

  startPractice(): void {
    if (!this.ctx) return;
    this.stopMatch();
    this.disconnectSocket();
    this.isConnecting = false;
    this.isConnected = false;
    this.practice = true;
    this.myPlayerId = 'local';
    this.localPlayer = { id: 'local', name: this.playerName.trim() || 'Player', color: '#57b88e',
      x: ARENA_WIDTH / 2, y: ARENA_HEIGHT / 2, a: 0, hp: 100, score: 0 };
    this.camera.x = this.localPlayer.x;
    this.camera.y = this.localPlayer.y;
    this.players.set(this.localPlayer.id, this.localPlayer);
    [ { x: 1080, y: 440 }, { x: 645, y: 705 }, { x: 1200, y: 690 }, { x: 520, y: 330 } ].forEach((point, index) => {
      const id = 'target-' + index;
      this.players.set(id, { id, name: 'Practice target', color: '#c58a51', ...point, a: 0, hp: 100, score: 0 });
    });
    this.nextPracticeShot = 0;
    this.beginMatch();
  }

  private beginMatch(): void {
    this.gameState = 'PLAYING';
    this.setupControlListeners();
    if (!this.practice) this.startInputLoop();
    this.startRenderLoop();
    this.view.markForCheck();
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) {
      this.serverStatus = 'A canvas could not be opened in this browser.';
      return;
    }
    this.ctx = context;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas(), { signal: this.lifetime?.signal });
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const bounds = canvas.parentElement!.getBoundingClientRect();
    const width = Math.max(1, bounds.width);
    const height = Math.max(1, bounds.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.viewSize = { width, height };
    canvas.width = width * this.dpr;
    canvas.height = height * this.dpr;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private setupControlListeners(): void {
    this.gameControls?.abort();
    this.gameControls = new AbortController();
    const options = { signal: this.gameControls.signal };
    const canvas = this.canvasRef.nativeElement;

    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.target instanceof HTMLButtonElement) return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
      this.keysPressed[e.key.toLowerCase()] = true;
      this.keysPressed[e.code] = true;
    }, options);
    window.addEventListener('keyup', (e) => {
      this.keysPressed[e.key.toLowerCase()] = false;
      this.keysPressed[e.code] = false;
    }, options);
    window.addEventListener('blur', () => this.resetControls(), options);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.resetControls();
    }, options);
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseScreenPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }, options);
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) this.isMouseDown = true;
    }, options);
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.isMouseDown = false;
    }, options);
    canvas.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return;
      canvas.setPointerCapture(e.pointerId);
      this.handlePointerDown(e);
    }, options);
    canvas.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') this.handlePointerMove(e);
    }, options);
    canvas.addEventListener('pointerup', (e) => this.handlePointerUp(e), options);
    canvas.addEventListener('pointercancel', (e) => this.handlePointerUp(e), options);
    canvas.addEventListener('lostpointercapture', (e) => this.handlePointerUp(e), options);
  }

  private handlePointerDown(e: PointerEvent): void {
    this.isTouchDevice = true;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const screenMidX = this.viewSize.width / 2;

    if (x < screenMidX) {
      // Left half -> Movement Joystick
      if (!this.moveJoystick.active) {
        this.moveJoystick = {
          active: true,
          pointerId: e.pointerId,
          startX: x,
          startY: y,
          currentX: x,
          currentY: y
        };
      }
    } else {
      // Right half -> Aim Joystick
      if (!this.aimJoystick.active) {
        this.aimJoystick = {
          active: true,
          pointerId: e.pointerId,
          startX: x,
          startY: y,
          currentX: x,
          currentY: y
        };
      }
    }
  }

  private handlePointerMove(e: PointerEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.moveJoystick.active && this.moveJoystick.pointerId === e.pointerId) {
      this.moveJoystick.currentX = x;
      this.moveJoystick.currentY = y;
    }

    if (this.aimJoystick.active && this.aimJoystick.pointerId === e.pointerId) {
      this.aimJoystick.currentX = x;
      this.aimJoystick.currentY = y;
    }
  }

  private handlePointerUp(e: PointerEvent): void {
    if (this.moveJoystick.active && this.moveJoystick.pointerId === e.pointerId) {
      this.moveJoystick.active = false;
      this.moveJoystick.pointerId = null;
    }

    if (this.aimJoystick.active && this.aimJoystick.pointerId === e.pointerId) {
      this.aimJoystick.active = false;
      this.aimJoystick.pointerId = null;
    }
  }

  // SENDS INPUT TO SERVER AT 30 HZ
  private startInputLoop(): void {
    this.ngZone.runOutsideAngular(() => {
      this.inputIntervalId = setInterval(() => {
        if (this.gameState !== 'PLAYING' || !this.socket || !this.isConnected) return;

        const input = this.computeCurrentInput();
        this.socket.volatile.emit('playerInput', input);
      }, 1000 / 30);
    });
  }

  private computeCurrentInput(): { mx: number; my: number; a: number; f: boolean } {
    let mx = 0;
    let my = 0;
    let aimAngle = 0;
    let fire = false;

    if (this.isTouchDevice && (this.moveJoystick.active || this.aimJoystick.active)) {
      // --- TOUCH TWIN-STICK CONTROLS ---
      if (this.moveJoystick.active) {
        const dx = this.moveJoystick.currentX - this.moveJoystick.startX;
        const dy = this.moveJoystick.currentY - this.moveJoystick.startY;
        const dist = Math.hypot(dx, dy);
        const maxDist = 55;

        if (dist > 5) {
          const normDist = Math.min(dist, maxDist) / maxDist;
          mx = (dx / dist) * normDist;
          my = (dy / dist) * normDist;
        }
      }

      if (this.aimJoystick.active) {
        const dx = this.aimJoystick.currentX - this.aimJoystick.startX;
        const dy = this.aimJoystick.currentY - this.aimJoystick.startY;
        const dist = Math.hypot(dx, dy);

        aimAngle = Math.atan2(dy, dx);
        if (dist > 12) {
          fire = true; // Auto shoot when aim stick pushed out
        }
      } else if (this.localPlayer) {
        aimAngle = this.localPlayer.a;
      }
    } else {
      // --- LAPTOP / MOUSE & KEYBOARD CONTROLS ---
      if (this.keysPressed['w'] || this.keysPressed['ArrowUp']) my -= 1;
      if (this.keysPressed['s'] || this.keysPressed['ArrowDown']) my += 1;
      if (this.keysPressed['a'] || this.keysPressed['ArrowLeft']) mx -= 1;
      if (this.keysPressed['d'] || this.keysPressed['ArrowRight']) mx += 1;

      // Normalize diagonal keyboard speed
      const mag = Math.hypot(mx, my);
      if (mag > 1) {
        mx /= mag;
        my /= mag;
      }

      // Calculate aim angle towards mouse world coordinates
      if (this.localPlayer) {
        const viewportW = this.viewSize.width;
        const viewportH = this.viewSize.height;
        
        // Convert screen mouse pos to world space
        const mouseWorldX = this.camera.x + (this.mouseScreenPos.x - viewportW / 2) / this.camera.scale;
        const mouseWorldY = this.camera.y + (this.mouseScreenPos.y - viewportH / 2) / this.camera.scale;

        aimAngle = Math.atan2(mouseWorldY - this.localPlayer.y, mouseWorldX - this.localPlayer.x);
      }

      fire = this.isMouseDown || !!this.keysPressed['Space'];
    }

    return { mx, my, a: aimAngle, f: fire };
  }

  // PROCESS SERVER SNAPSHOT
  private handleServerGameState(snapshot: any): void {
    if (!snapshot || !snapshot.players) return;

    const currentIds = new Set<string>();

    snapshot.players.forEach((sp: any) => {
      currentIds.add(sp.id);

      if (this.players.has(sp.id)) {
        // Update targets for smooth lerp
        const existing = this.players.get(sp.id)!;
        existing.targetX = sp.x;
        existing.targetY = sp.y;
        existing.targetA = sp.a;
        existing.hp = sp.hp;
        existing.score = sp.score;
        existing.name = sp.name;
        existing.color = sp.color;
      } else {
        // New player
        const newP: PlayerState = {
          id: sp.id,
          name: sp.name,
          color: sp.color,
          x: sp.x,
          y: sp.y,
          a: sp.a,
          hp: sp.hp,
          score: sp.score,
          targetX: sp.x,
          targetY: sp.y,
          targetA: sp.a
        };
        this.players.set(sp.id, newP);
      }
    });

    // Remove left players
    for (const [id] of this.players.entries()) {
      if (!currentIds.has(id)) {
        this.players.delete(id);
      }
    }

    // Bullets
    this.bullets = snapshot.bullets || [];

    // Local player reference & Leaderboard
    if (this.myPlayerId && this.players.has(this.myPlayerId)) {
      this.localPlayer = this.players.get(this.myPlayerId)!;
    }

    // Update Top 5 Leaderboard
    const sorted = Array.from(this.players.values()).sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    this.leaderboard = sorted.slice(0, 5);
    this.refreshHud();
  }

  private addKillFeedItem(data: any): void {
    const text = `⚔️ ${data.killerName} destroyed ${data.victimName} (+1)`;
    const item: KillFeedItem = {
      id: Math.random().toString(),
      text,
      time: Date.now()
    };
    this.killFeed.unshift(item);
    if (this.killFeed.length > 5) {
      this.killFeed.pop();
    }
    const generation = this.matchGeneration;
    this.view.markForCheck();
    setTimeout(() => {
      if (generation !== this.matchGeneration) return;
      this.killFeed = this.killFeed.filter((hit) => hit.id !== item.id);
      this.view.markForCheck();
    }, 4500);
  }

  // MAIN RENDER LOOP (60 FPS OUTSIDE ANGULAR ZONE)
  private startRenderLoop(): void {
    this.ngZone.runOutsideAngular(() => {
      let last = performance.now();
      const render = (now: number) => {
        if (this.practice) this.updatePractice(Math.min(.045, (now - last) / 1_000), now);
        last = now;
        this.updateInterpolation();
        this.renderCanvas();
        this.animFrameId = requestAnimationFrame(render);
      };
      this.animFrameId = requestAnimationFrame(render);
    });
  }

  private refreshHud(): void {
    const now = performance.now();
    if (now < this.practiceHudAt) return;
    this.practiceHudAt = now + 100;
    this.view.markForCheck();
  }

  private updatePractice(dt: number, now: number): void {
    const player = this.localPlayer;
    if (!player || document.hidden) return;
    const input = this.computeCurrentInput();
    player.x = Math.max(30, Math.min(ARENA_WIDTH - 30, player.x + input.mx * dt * 250));
    player.y = Math.max(30, Math.min(ARENA_HEIGHT - 30, player.y + input.my * dt * 250));
    player.a = input.a;
    if (input.f && now >= this.nextPracticeShot) {
      this.practiceShots.push({ id: String(this.shotId++), ownerId: player.id, x: player.x, y: player.y, a: input.a, age: 0 });
      this.nextPracticeShot = now + 250;
    }
    this.practiceShots = this.practiceShots.filter((shot) => {
      shot.age += dt;
      shot.x += Math.cos(shot.a) * dt * 580;
      shot.y += Math.sin(shot.a) * dt * 580;
      if (shot.age > 2 || shot.x < 0 || shot.x > ARENA_WIDTH || shot.y < 0 || shot.y > ARENA_HEIGHT) return false;
      for (const target of this.players.values()) {
        if (target === player || Math.hypot(shot.x - target.x, shot.y - target.y) > 25) continue;
        player.score++;
        target.x = 90 + Math.random() * (ARENA_WIDTH - 180);
        target.y = 90 + Math.random() * (ARENA_HEIGHT - 180);
        this.view.markForCheck();
        return false;
      }
      return true;
    });
    this.bullets = this.practiceShots;
  }

  private updateInterpolation(): void {
    const lerpRate = 0.25; // Smooth interpolation speed

    this.players.forEach((p) => {
      if (p.targetX !== undefined) {
        p.x += (p.targetX - p.x) * lerpRate;
      }
      if (p.targetY !== undefined) {
        p.y += (p.targetY - p.y) * lerpRate;
      }
      if (p.targetA !== undefined) {
        // Shortest angle difference interpolation
        let diff = p.targetA - p.a;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        p.a += diff * lerpRate;
      }
    });

    // Camera follow local player smoothly
    if (this.localPlayer) {
      this.camera.x += (this.localPlayer.x - this.camera.x) * 0.15;
      this.camera.y += (this.localPlayer.y - this.camera.y) * 0.15;
    }

    // Scale camera according to screen aspect ratio
    const vw = this.viewSize.width;
    const vh = this.viewSize.height;
    const baseDimension = Math.min(vw, vh);
    this.camera.scale = Math.max(0.65, Math.min(1.3, baseDimension / 650));
  }

  private renderCanvas(): void {
    const ctx = this.ctx;
    const width = this.viewSize.width;
    const height = this.viewSize.height;

    // Clear background
    ctx.fillStyle = '#121c12';
    ctx.fillRect(0, 0, width, height);

    ctx.save();

    // Transform viewport around Camera
    ctx.translate(width / 2, height / 2);
    ctx.scale(this.camera.scale, this.camera.scale);
    ctx.translate(-this.camera.x, -this.camera.y);

    // 1. DRAW GROUND GRID
    this.drawGroundGrid(ctx);

    // 2. DRAW ARENA BORDER
    this.drawArenaBorder(ctx);

    // 3. DRAW BULLETS
    this.drawBullets(ctx);

    // 4. DRAW TANKS
    this.players.forEach((p) => {
      this.drawTank(ctx, p);
    });

    ctx.restore();

    // 5. DRAW TOUCH JOYSTICKS OVERLAY (IF MOBILE / TOUCH ACTIVE)
    if (this.isTouchDevice) {
      this.drawTouchJoysticks(ctx);
    }
  }

  private drawGroundGrid(ctx: CanvasRenderingContext2D): void {
    const gridSize = 60;
    ctx.strokeStyle = '#1b2a1b';
    ctx.lineWidth = 1;

    // Draw grid inside arena
    ctx.beginPath();
    for (let x = 0; x <= ARENA_WIDTH; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ARENA_HEIGHT);
    }
    for (let y = 0; y <= ARENA_HEIGHT; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(ARENA_WIDTH, y);
    }
    ctx.stroke();
  }

  private drawArenaBorder(ctx: CanvasRenderingContext2D): void {
    // Arena ground fill
    ctx.strokeStyle = '#c29b53';
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, ARENA_WIDTH, ARENA_HEIGHT);

    // Outer warning diagonal hazard stripes
    const stripeWidth = 24;
    ctx.save();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.strokeRect(-stripeWidth / 2, -stripeWidth / 2, ARENA_WIDTH + stripeWidth, ARENA_HEIGHT + stripeWidth);
    ctx.restore();
  }

  private drawTank(ctx: CanvasRenderingContext2D, p: PlayerState): void {
    const isSelf = p.id === this.myPlayerId;

    ctx.save();
    ctx.translate(p.x, p.y);

    // --- TANK SHADOW ---
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(3, 5, 26, 20, p.a, 0, Math.PI * 2);
    ctx.fill();

    // --- ROTATED TANK BODY & BARREL ---
    ctx.save();
    ctx.rotate(p.a);

    // TANK TREADS (Top & Bottom tracks)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-24, -19, 48, 7);
    ctx.fillRect(-24, 12, 48, 7);

    // Tread details (wheel lines)
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    for (let tx = -20; tx <= 20; tx += 8) {
      ctx.beginPath(); ctx.moveTo(tx, -19); ctx.lineTo(tx, -12); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(tx, 12); ctx.lineTo(tx, 19); ctx.stroke();
    }

    // MAIN TANK BODY RECTANGLE
    ctx.fillStyle = p.color;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.roundRect(-22, -14, 44, 28, 6);
    ctx.fill();
    ctx.stroke();

    // Body accent detail (camo line or panel)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(-18, -10, 12, 20);

    // BARREL (GUN CANNON)
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.fillRect(0, -4, 30, 8);
    ctx.strokeRect(0, -4, 30, 8);

    // Muzzle brake tip
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(26, -5, 6, 10);

    // CENTER TURRET CAP
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // End rotated tank body

    // --- HEALTH BAR & NAME BADGE (Non-rotating above tank) ---
    const badgeY = -34;

    // HP Bar Outer Box
    const barW = 54;
    const barH = 6;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(-barW / 2, badgeY, barW, barH);

    // HP Bar Inner Fill
    const hpRatio = Math.max(0, p.hp / 100);
    ctx.fillStyle = hpRatio > 0.5 ? '#22c55e' : (hpRatio > 0.25 ? '#f59e0b' : '#ef4444');
    ctx.fillRect(-barW / 2, badgeY, barW * hpRatio, barH);

    // HP Bar Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-barW / 2, badgeY, barW, barH);

    // Player Name Text
    ctx.font = 'bold 12px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = isSelf ? '#fef08a' : '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.strokeText(p.name, 0, badgeY - 5);
    ctx.fillText(p.name, 0, badgeY - 5);

    // Self indicator arrow
    if (isSelf) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(0, badgeY - 18);
      ctx.lineTo(-5, badgeY - 24);
      ctx.lineTo(5, badgeY - 24);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  private drawBullets(ctx: CanvasRenderingContext2D): void {
    this.bullets.forEach((b) => {
      ctx.save();
      ctx.translate(b.x, b.y);

      // Glow halo
      const grad = ctx.createRadialGradient(0, 0, 1, 0, 0, 10);
      grad.addColorStop(0, 'rgba(254, 240, 138, 1)');
      grad.addColorStop(0.4, 'rgba(245, 158, 11, 0.8)');
      grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();

      // Core bullet
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });
  }

  private drawTouchJoysticks(ctx: CanvasRenderingContext2D): void {
    // Render Left Move Joystick
    if (this.moveJoystick.active) {
      this.drawJoystick(ctx, this.moveJoystick.startX, this.moveJoystick.startY, this.moveJoystick.currentX, this.moveJoystick.currentY, '#84cc16');
    }

    // Render Right Aim Joystick
    if (this.aimJoystick.active) {
      this.drawJoystick(ctx, this.aimJoystick.startX, this.aimJoystick.startY, this.aimJoystick.currentX, this.aimJoystick.currentY, '#f59e0b');
    }
  }

  private drawJoystick(ctx: CanvasRenderingContext2D, startX: number, startY: number, curX: number, curY: number, color: string): void {
    ctx.save();
    
    // Outer Base Ring
    ctx.beginPath();
    ctx.arc(startX, startY, 55, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Calculate clamped inner knob position
    const dx = curX - startX;
    const dy = curY - startY;
    const dist = Math.hypot(dx, dy);
    const maxR = 55;
    const knobX = startX + (dist > maxR ? (dx / dist) * maxR : dx);
    const knobY = startY + (dist > maxR ? (dy / dist) * maxR : dy);

    // Inner Knob
    ctx.beginPath();
    ctx.arc(knobX, knobY, 24, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }
}
