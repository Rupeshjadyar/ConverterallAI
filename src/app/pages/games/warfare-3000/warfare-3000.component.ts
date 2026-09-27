import { Component, ElementRef, OnInit, OnDestroy, ViewChild, NgZone, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  template: `
    <div class="game-wrapper">
      
      <!-- START SCREEN / LOBBY OVERLAY -->
      <div *ngIf="gameState === 'LOBBY'" class="lobby-overlay glass-panel">
        <div class="lobby-card">
          <div class="military-header">
            <span class="crosshair-icon">🎯</span>
            <h1 class="title-text">WARFARE 3000</h1>
            <p class="subtitle-text">REAL-TIME MULTIPLAYER TANK ARENA SHOOTER</p>
          </div>

          <form (ngSubmit)="joinGame()" class="join-form">
            <div class="input-group">
              <label for="playerNameInput">OPERATOR CALLSIGN</label>
              <input 
                id="playerNameInput"
                type="text" 
                [(ngModel)]="playerName" 
                name="playerName"
                maxlength="12" 
                placeholder="Enter Call-Sign"
                class="callsign-input"
                autocomplete="off"
                required
              />
              <span class="char-counter">{{ playerName.length }}/12</span>
            </div>

            <div class="server-status-pill">
              <span class="status-dot" [class.connected]="isConnected" [class.connecting]="isConnecting"></span>
              <span>Server: {{ serverUrlDisplay }}</span>
            </div>

            <button type="submit" [disabled]="!playerName.trim() || isConnecting" class="btn-join-arena">
              <span *ngIf="!isConnecting">ENTER ARENA ⚔️</span>
              <span *ngIf="isConnecting">CONNECTING TO ARENA...</span>
            </button>
          </form>

          <div class="controls-guide">
            <h3>🎮 FIELD CONTROLS</h3>
            <div class="guide-grid">
              <div class="guide-card">
                <h4>💻 LAPTOP / PC</h4>
                <ul>
                  <li><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or <kbd>▲</kbd><kbd>◄</kbd><kbd>▼</kbd><kbd>►</kbd> Move Tank</li>
                  <li><span class="icon">🖱️</span> Mouse to Aim Barrel</li>
                  <li><span class="icon">💥</span> Left Click to Fire</li>
                </ul>
              </div>
              <div class="guide-card">
                <h4>📱 MOBILE / TABLET</h4>
                <ul>
                  <li><span class="icon">🕹️</span> Left Screen: Move Joystick</li>
                  <li><span class="icon">🎯</span> Right Screen: Aim Joystick</li>
                  <li><span class="icon">⚡</span> Auto-fire while aiming!</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="back-link">
            <a routerLink="/games" class="btn-back">← Back to Game Hub</a>
          </div>
        </div>
      </div>

      <!-- DISCONNECTED / RECONNECTING BANNER -->
      <div *ngIf="gameState === 'PLAYING' && !isConnected" class="disconnection-banner">
        ⚠️ Connection Lost! Reconnecting to Warfare 3000 Server...
      </div>

      <!-- TOP-RIGHT LEADERBOARD HUD -->
      <div *ngIf="gameState === 'PLAYING'" class="leaderboard-hud glass-panel">
        <div class="hud-header">
          <span class="hud-icon">🏆</span>
          <span class="hud-title">TOP TANKERS</span>
        </div>
        <div class="leaderboard-list">
          <div 
            *ngFor="let p of leaderboard; let i = index" 
            class="leaderboard-item"
            [class.is-self]="p.id === myPlayerId">
            <span class="rank-badge" [ngClass]="'rank-' + (i + 1)">#{{ i + 1 }}</span>
            <span class="player-color-dot" [style.background-color]="p.color"></span>
            <span class="player-name">{{ p.name }}</span>
            <span class="player-score">{{ p.score }} Kills</span>
          </div>
          <div *ngIf="leaderboard.length === 0" class="empty-board">
            Waiting for combatants...
          </div>
        </div>
      </div>

      <!-- TOP-LEFT SELF STATUS HUD -->
      <div *ngIf="gameState === 'PLAYING' && localPlayer" class="player-hud glass-panel">
        <div class="hud-self-header">
          <span class="self-color-indicator" [style.background-color]="localPlayer.color"></span>
          <span class="self-name">{{ localPlayer.name }}</span>
          <span class="self-kills">⚔️ {{ localPlayer.score }} Kills</span>
        </div>
        <div class="hp-bar-outer">
          <div 
            class="hp-bar-inner" 
            [style.width.%]="localPlayer.hp"
            [class.hp-high]="localPlayer.hp > 50"
            [class.hp-mid]="localPlayer.hp <= 50 && localPlayer.hp > 25"
            [class.hp-low]="localPlayer.hp <= 25">
          </div>
          <span class="hp-text">{{ localPlayer.hp }} / 100 HP</span>
        </div>
      </div>

      <!-- KILL FEED OVERLAY -->
      <div *ngIf="gameState === 'PLAYING'" class="kill-feed">
        <div *ngFor="let kill of killFeed" class="kill-feed-item">
          {{ kill.text }}
        </div>
      </div>

      <!-- CANVAS DISPLAY FOR 2D ARENA -->
      <canvas #gameCanvas class="game-canvas"></canvas>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-color: #0d130d;
      font-family: 'Impact', 'Trebuchet MS', 'Arial Black', sans-serif;
      user-select: none;
      -webkit-user-select: none;
    }

    .game-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .game-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      touch-action: none;
      background-color: #121c12;
      cursor: crosshair;
    }

    /* GLASS PANELS & MILITARY STYLING */
    .glass-panel {
      background: rgba(18, 28, 18, 0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(194, 155, 83, 0.35);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(194, 155, 83, 0.1);
    }

    /* LOBBY OVERLAY */
    .lobby-overlay {
      position: absolute;
      inset: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: radial-gradient(circle at center, rgba(30, 48, 30, 0.95) 0%, rgba(10, 16, 10, 0.98) 100%);
    }

    .lobby-card {
      width: 100%;
      max-width: 620px;
      padding: 2.5rem;
      border-radius: 16px;
      border: 2px solid #c29b53;
      box-shadow: 0 0 35px rgba(194, 155, 83, 0.25);
      text-align: center;
    }

    .military-header .crosshair-icon {
      font-size: 2.8rem;
      display: block;
      margin-bottom: 0.3rem;
    }

    .title-text {
      font-size: clamp(2.4rem, 6vw, 3.8rem);
      font-weight: 900;
      letter-spacing: 2px;
      color: #f59e0b;
      text-shadow: 0 0 15px rgba(245, 158, 11, 0.5), 3px 3px 0 #000;
      margin: 0;
    }

    .subtitle-text {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      color: #a3b899;
      letter-spacing: 1.5px;
      margin-top: 0.25rem;
      margin-bottom: 1.8rem;
    }

    .join-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .input-group {
      position: relative;
      text-align: left;
    }

    .input-group label {
      display: block;
      font-size: 0.82rem;
      color: #c29b53;
      letter-spacing: 1px;
      margin-bottom: 0.4rem;
      font-weight: bold;
    }

    .callsign-input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.9rem 1.2rem;
      font-family: inherit;
      font-size: 1.3rem;
      letter-spacing: 2px;
      text-transform: uppercase;
      background: rgba(0, 0, 0, 0.6);
      border: 2px solid #4a6344;
      border-radius: 10px;
      color: #e2e8f0;
      outline: none;
      transition: all 0.2s ease;
    }

    .callsign-input:focus {
      border-color: #f59e0b;
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
      background: rgba(0, 0, 0, 0.8);
    }

    .char-counter {
      position: absolute;
      right: 12px;
      bottom: 12px;
      font-family: system-ui, sans-serif;
      font-size: 0.75rem;
      color: #64748b;
    }

    .server-status-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-family: system-ui, sans-serif;
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ef4444;
    }
    .status-dot.connected { background: #22c55e; box-shadow: 0 0 8px #22c55e; }
    .status-dot.connecting { background: #f59e0b; animation: pulse 1s infinite alternate; }

    @keyframes pulse {
      from { opacity: 0.4; }
      to { opacity: 1; }
    }

    .btn-join-arena {
      padding: 1rem 1.5rem;
      font-family: inherit;
      font-size: 1.4rem;
      letter-spacing: 2px;
      color: #1a2e1a;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      border: none;
      border-radius: 10px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
      transition: all 0.2s ease;
    }

    .btn-join-arena:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.6);
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    }

    .btn-join-arena:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    /* GUIDE CARDS */
    .controls-guide h3 {
      font-size: 1.1rem;
      color: #c29b53;
      letter-spacing: 1px;
      margin-bottom: 0.75rem;
    }

    .guide-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      text-align: left;
      font-family: system-ui, -apple-system, sans-serif;
    }

    @media (max-width: 580px) {
      .guide-grid {
        grid-template-columns: 1fr;
      }
    }

    .guide-card {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(194, 155, 83, 0.2);
      border-radius: 10px;
      padding: 0.85rem 1rem;
    }

    .guide-card h4 {
      font-size: 0.85rem;
      color: #84cc16;
      margin: 0 0 0.5rem 0;
    }

    .guide-card ul {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 0.8rem;
      color: #cbd5e1;
    }

    .guide-card li {
      margin-bottom: 0.35rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    kbd {
      background: #334155;
      color: #fff;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
    }

    .back-link {
      margin-top: 1.5rem;
    }

    .btn-back {
      font-family: system-ui, sans-serif;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.88rem;
      transition: color 0.2s;
    }

    .btn-back:hover {
      color: #fff;
    }

    /* LEADERBOARD HUD (TOP-RIGHT) */
    .leaderboard-hud {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 50;
      width: 240px;
      border-radius: 12px;
      padding: 0.75rem 1rem;
      pointer-events: none;
    }

    .hud-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(194, 155, 83, 0.3);
      margin-bottom: 0.5rem;
    }

    .hud-icon {
      font-size: 1.1rem;
    }

    .hud-title {
      font-size: 1.05rem;
      color: #f59e0b;
      letter-spacing: 1px;
    }

    .leaderboard-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .leaderboard-item {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      font-family: system-ui, sans-serif;
      font-size: 0.82rem;
      color: #e2e8f0;
      padding: 0.25rem 0.4rem;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.2);
    }

    .leaderboard-item.is-self {
      background: rgba(245, 158, 11, 0.25);
      border: 1px solid rgba(245, 158, 11, 0.5);
    }

    .rank-badge {
      font-weight: 900;
      font-size: 0.78rem;
      width: 24px;
      text-align: center;
    }
    .rank-1 { color: #f59e0b; }
    .rank-2 { color: #94a3b8; }
    .rank-3 { color: #b45309; }

    .player-color-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .player-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-weight: 600;
    }

    .player-score {
      font-weight: 700;
      color: #84cc16;
    }

    .empty-board {
      font-family: system-ui, sans-serif;
      font-size: 0.78rem;
      color: #64748b;
      text-align: center;
      padding: 0.5rem 0;
    }

    /* PLAYER STATUS HUD (TOP-LEFT) */
    .player-hud {
      position: absolute;
      top: 1rem;
      left: 1rem;
      z-index: 50;
      min-width: 220px;
      border-radius: 12px;
      padding: 0.75rem 1rem;
      pointer-events: none;
    }

    .hud-self-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.4rem;
    }

    .self-color-indicator {
      width: 14px;
      height: 14px;
      border-radius: 4px;
      border: 1px solid #fff;
    }

    .self-name {
      font-size: 1.15rem;
      color: #fff;
      letter-spacing: 1px;
    }

    .self-kills {
      margin-left: auto;
      font-family: system-ui, sans-serif;
      font-size: 0.82rem;
      font-weight: 800;
      color: #84cc16;
    }

    .hp-bar-outer {
      position: relative;
      width: 100%;
      height: 18px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 99px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .hp-bar-inner {
      height: 100%;
      transition: width 0.15s ease-out;
    }
    .hp-high { background: linear-gradient(90deg, #22c55e, #4ade80); }
    .hp-mid { background: linear-gradient(90deg, #d97706, #f59e0b); }
    .hp-low { background: linear-gradient(90deg, #dc2626, #ef4444); }

    .hp-text {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, sans-serif;
      font-size: 0.72rem;
      font-weight: 900;
      color: #fff;
      text-shadow: 1px 1px 2px #000;
    }

    /* KILL FEED */
    .kill-feed {
      position: absolute;
      top: 5rem;
      left: 1rem;
      z-index: 40;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      pointer-events: none;
    }

    .kill-feed-item {
      font-family: system-ui, sans-serif;
      font-size: 0.82rem;
      font-weight: 700;
      color: #fef08a;
      background: rgba(0, 0, 0, 0.75);
      border-left: 3px solid #f59e0b;
      padding: 0.35rem 0.75rem;
      border-radius: 0 6px 6px 0;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .disconnection-banner {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 90;
      background: #dc2626;
      color: #fff;
      text-align: center;
      padding: 0.5rem;
      font-family: system-ui, sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
    }
  `]
})
export class Warfare3000Component implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  gameState: 'LOBBY' | 'PLAYING' = 'LOBBY';
  playerName: string = '';
  isConnected: boolean = false;
  isConnecting: boolean = false;
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

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    // Generate default random callsign if empty
    const savedName = localStorage.getItem('warfare3000_callsign');
    this.playerName = savedName || 'Tanker_' + Math.floor(100 + Math.random() * 900);

    this.serverUrl = this.detectServerUrl();
    this.serverUrlDisplay = this.serverUrl.replace(/^https?:\/\//, '');

    // Setup canvas
    this.initCanvas();
    this.connectSocket();
  }

  ngOnDestroy(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.inputIntervalId) {
      clearInterval(this.inputIntervalId);
    }
    if (this.socket) {
      this.socket.disconnect();
    }
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

  private connectSocket(): void {
    this.isConnecting = true;
    this.socket = io(this.serverUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      timeout: 5000
    });

    this.socket.on('connect', () => {
      console.log('Socket.IO connected:', this.socket?.id);
      this.isConnected = true;
      this.isConnecting = false;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      this.isConnected = false;
    });

    this.socket.on('init', (data: any) => {
      this.myPlayerId = data.id;
      console.log('Joined arena with player ID:', this.myPlayerId);
    });

    this.socket.on('gameState', (snapshot: any) => {
      this.handleServerGameState(snapshot);
    });

    this.socket.on('playerKilled', (data: any) => {
      this.addKillFeedItem(data);
    });
  }

  joinGame(): void {
    if (!this.playerName.trim() || !this.socket) return;
    
    const trimmedName = this.playerName.trim().substring(0, 12);
    localStorage.setItem('warfare3000_callsign', trimmedName);

    this.socket.emit('join', { name: trimmedName });
    this.gameState = 'PLAYING';

    // Start controls & render loop outside Angular zone for high performance
    this.setupControlListeners();
    this.startInputLoop();
    this.startRenderLoop();
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * this.dpr;
    canvas.height = height * this.dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Scale canvas context for retina displays
    this.ctx.scale(this.dpr, this.dpr);
  }

  // LISTENERS FOR KEYBOARD, MOUSE, AND TOUCH
  private setupControlListeners(): void {
    const canvas = this.canvasRef.nativeElement;

    // Keyboard
    window.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }
      this.keysPressed[e.key.toLowerCase()] = true;
      this.keysPressed[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keysPressed[e.key.toLowerCase()] = false;
      this.keysPressed[e.code] = false;
    });

    // Mouse
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseScreenPos.x = e.clientX - rect.left;
      this.mouseScreenPos.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // Left click
        this.isMouseDown = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isMouseDown = false;
      }
    });

    // Pointer / Touch Events for Twin-Stick Joysticks
    canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e));
    canvas.addEventListener('pointermove', (e) => this.handlePointerMove(e));
    canvas.addEventListener('pointerup', (e) => this.handlePointerUp(e));
    canvas.addEventListener('pointercancel', (e) => this.handlePointerUp(e));
  }

  private handlePointerDown(e: PointerEvent): void {
    this.isTouchDevice = true;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const screenMidX = window.innerWidth / 2;

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
        this.socket.emit('playerInput', input);
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
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;
        
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
    setTimeout(() => {
      this.killFeed = this.killFeed.filter(k => k.id !== item.id);
    }, 4500);
  }

  // MAIN RENDER LOOP (60 FPS OUTSIDE ANGULAR ZONE)
  private startRenderLoop(): void {
    this.ngZone.runOutsideAngular(() => {
      const render = () => {
        this.updateInterpolation();
        this.renderCanvas();
        this.animFrameId = requestAnimationFrame(render);
      };
      this.animFrameId = requestAnimationFrame(render);
    });
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
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const baseDimension = Math.min(vw, vh);
    this.camera.scale = Math.max(0.65, Math.min(1.3, baseDimension / 650));
  }

  private renderCanvas(): void {
    const ctx = this.ctx;
    const width = window.innerWidth;
    const height = window.innerHeight;

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
