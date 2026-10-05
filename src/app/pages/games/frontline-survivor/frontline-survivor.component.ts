import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as THREE from 'three';

export interface WeaponItem {
  id: string;
  name: string;
  type: string;
  icon: string;
  damage: number;
  fireRate: number;
  accuracy: number;
  clipSize: number;
  reloadTimeMs: number;
}

export interface EnemySoldier3D {
  id: number;
  group: THREE.Group;
  headMesh: THREE.Mesh;
  bodyMesh: THREE.Mesh;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  hp: number;
  maxHp: number;
  speed: number;
  alive: boolean;
  dying: boolean;
  deathTimer: number;
  walkTimer: number;
  shootTimer: number;
}

@Component({
  selector: 'app-frontline-survivor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './frontline-survivor.component.html',
  styleUrls: ['./frontline-survivor.component.scss']
})
export class FrontlineSurvivorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('lobbyCanvas') lobbyCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lobbyCanvasContainer') lobbyContainerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('gameCanvas') gameCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('gameCanvasContainer') gameContainerRef!: ElementRef<HTMLDivElement>;

  // Navigation Screens
  currentScreen: 'lobby' | 'mode-select' | 'arsenal' | 'in-game' = 'lobby';
  modeCategory: 'main' | 'solo' | 'team' = 'main';
  selectedMode = 'Free For All';

  // Economy & Local Persistence State
  playerCash = 500;
  playerHealth = 100;
  playerArmor = 100;
  score = 0;
  wave = 1;
  matchKills = 0;
  killFeed: string[] = [];

  // Weapons Arsenal
  weaponsList: WeaponItem[] = [
    { id: 'm4a1', name: 'M4A1 TACTICAL RIFLE', type: 'Assault Rifle', icon: '🔫', damage: 35, fireRate: 130, accuracy: 90, clipSize: 30, reloadTimeMs: 1600 },
    { id: 'awp', name: 'AWP HEAVY SNIPER', type: 'Sniper Rifle', icon: '🎯', damage: 100, fireRate: 850, accuracy: 99, clipSize: 10, reloadTimeMs: 2200 },
    { id: 'deagle', name: 'DESERT EAGLE .50', type: 'Secondary Pistol', icon: '💥', damage: 55, fireRate: 280, accuracy: 84, clipSize: 7, reloadTimeMs: 1300 },
    { id: 'shotgun', name: 'SPAS-12 SHOTGUN', type: 'Heavy Shotgun', icon: '⚡', damage: 85, fireRate: 600, accuracy: 72, clipSize: 8, reloadTimeMs: 1900 }
  ];
  selectedWeapon: WeaponItem = this.weaponsList[0];
  currentAmmo = 30;
  reserveAmmo = 120;
  isReloading = false;

  // In-Game Three.js WebGL Engine
  private gameScene!: THREE.Scene;
  private gameCamera!: THREE.PerspectiveCamera;
  private gameRenderer!: THREE.WebGLRenderer;
  private fpsGunGroup!: THREE.Group;
  private muzzleFlashMesh!: THREE.Mesh;
  private animFrameId: number | null = null;
  private lastTime = 0;
  private raycaster = new THREE.Raycaster();
  private muzzleLight!: THREE.PointLight;
  private audioCtx: AudioContext | null = null;

  // Gun Recoil Spring State
  private gunRecoilZ = 0;
  private gunRecoilRotX = 0;

  // Lobby Three.js WebGL Scene
  private lobbyScene!: THREE.Scene;
  private lobbyCamera!: THREE.PerspectiveCamera;
  private lobbyRenderer!: THREE.WebGLRenderer;
  private lobbySoldier!: THREE.Group;
  private lobbyAnimId: number | null = null;

  // FPS Controller Physics State
  private yaw = 0;
  private pitch = 0;
  private playerPos = new THREE.Vector3(0, 1.7, 18);
  private velocityY = 0;
  private isGrounded = true;
  private readonly PLAYER_HEIGHT = 1.7;
  private readonly ARENA_LIMIT = 34;

  // Interactive UI & Combat Flags
  isAdsActive = false;
  isPaused = false;
  isGameOver = false;
  isMuted = false;
  showDamageFlash = false;
  showWaveBanner = false;
  showHitmarker = false;
  isHeadshot = false;

  // Input states
  private keys: { [key: string]: boolean } = {};
  private isMouseDown = false;
  private lastShotTime = 0;
  private nextBotId = 1;
  private enemies: EnemySoldier3D[] = [];

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedCash = localStorage.getItem('fragen_player_cash');
      if (savedCash) {
        this.playerCash = parseInt(savedCash, 10) || 500;
      }
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('pointerlockchange', this.onPointerLockChange);
    }
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      this.initLobby3D();
    }, 100);
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('pointerlockchange', this.onPointerLockChange);
    }
    this.stopGameLoop();
    this.stopLobbyLoop();
    if (this.gameRenderer) this.gameRenderer.dispose();
    if (this.lobbyRenderer) this.lobbyRenderer.dispose();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.currentScreen === 'lobby' && this.lobbyRenderer && this.lobbyContainerRef) {
      const container = this.lobbyContainerRef.nativeElement;
      const w = container.clientWidth;
      const h = container.clientHeight;
      this.lobbyCamera.aspect = w / h;
      this.lobbyCamera.updateProjectionMatrix();
      this.lobbyRenderer.setSize(w, h);
    }

    if (this.currentScreen === 'in-game' && this.gameRenderer && this.gameContainerRef) {
      const container = this.gameContainerRef.nativeElement;
      const w = container.clientWidth;
      const h = container.clientHeight;
      this.gameCamera.aspect = w / h;
      this.gameCamera.updateProjectionMatrix();
      this.gameRenderer.setSize(w, h);
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    this.keys[e.code] = true;

    if (e.code === 'KeyR' && !this.isReloading) {
      this.reloadWeapon();
    }

    if (e.code === 'Space' && this.isGrounded && this.currentScreen === 'in-game' && !this.isPaused && !this.isGameOver) {
      this.velocityY = 10;
      this.isGrounded = false;
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent): void {
    this.keys[e.code] = false;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (this.currentScreen !== 'in-game' || this.isPaused || this.isGameOver) return;
    if (document.pointerLockElement !== this.gameCanvasRef.nativeElement) return;

    const sensitivity = 0.0022;
    this.yaw -= e.movementX * sensitivity;
    this.pitch -= e.movementY * sensitivity;

    const maxPitch = Math.PI / 2.15;
    this.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.pitch));

    this.gameCamera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }

  @HostListener('window:mousedown', ['$event'])
  onMouseDown(e: MouseEvent): void {
    if (this.currentScreen !== 'in-game' || this.isPaused || this.isGameOver) return;

    if (e.button === 0) { // Left Click: Fire
      this.isMouseDown = true;
      this.tryShoot();
    } else if (e.button === 2) { // Right Click: ADS Scope Toggle
      e.preventDefault();
      this.isAdsActive = !this.isAdsActive;
      const targetFov = this.isAdsActive ? (this.selectedWeapon.id === 'awp' ? 18 : 38) : 75;
      this.gameCamera.fov = targetFov;
      this.gameCamera.updateProjectionMatrix();
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(e: MouseEvent): void {
    if (e.button === 0) {
      this.isMouseDown = false;
    }
  }

  @HostListener('window:contextmenu', ['$event'])
  onContextMenu(e: MouseEvent): void {
    if (this.currentScreen === 'in-game') {
      e.preventDefault();
    }
  }

  openScreen(screen: 'lobby' | 'mode-select' | 'arsenal' | 'in-game'): void {
    this.currentScreen = screen;
    if (screen === 'lobby') {
      setTimeout(() => this.initLobby3D(), 50);
    } else {
      this.stopLobbyLoop();
    }
  }

  selectCategory(cat: 'solo' | 'team'): void {
    this.modeCategory = cat;
  }

  selectWeapon(w: WeaponItem): void {
    this.selectedWeapon = w;
    this.currentAmmo = w.clipSize;
  }

  startMatch(modeName: string): void {
    this.selectedMode = modeName;
    this.openScreen('in-game');
    this.initAudioContext();

    this.score = 0;
    this.wave = 1;
    this.matchKills = 0;
    this.playerHealth = 100;
    this.playerArmor = 100;
    this.currentAmmo = this.selectedWeapon.clipSize;
    this.reserveAmmo = 120;
    this.isGameOver = false;
    this.isPaused = false;
    this.isAdsActive = false;
    this.killFeed = [];

    setTimeout(() => {
      this.initGame3D();
      this.requestPointerLock();
      this.triggerWaveBanner();
      this.spawnEnemies(this.wave);

      this.lastTime = performance.now();
      this.stopGameLoop();
      this.ngZone.runOutsideAngular(() => {
        this.gameLoop(performance.now());
      });
    }, 100);
  }

  exitToLobby(): void {
    this.stopGameLoop();
    if (document.exitPointerLock) document.exitPointerLock();
    this.openScreen('lobby');
  }

  onGameViewportClick(): void {
    if (this.currentScreen === 'in-game' && this.isPaused && !this.isGameOver) {
      this.requestPointerLock();
    }
  }

  requestPointerLock(): void {
    if (this.gameCanvasRef) {
      this.gameCanvasRef.nativeElement.requestPointerLock();
    }
  }

  private onPointerLockChange = (): void => {
    if (this.currentScreen !== 'in-game') return;

    if (document.pointerLockElement === this.gameCanvasRef.nativeElement) {
      this.ngZone.run(() => this.isPaused = false);
    } else {
      this.ngZone.run(() => this.isPaused = true);
    }
  };

  // ---------------- LOBBY THREE.JS SCENE ----------------
  private initLobby3D(): void {
    if (!this.lobbyCanvasRef || !this.lobbyContainerRef) return;
    const canvas = this.lobbyCanvasRef.nativeElement;
    const container = this.lobbyContainerRef.nativeElement;
    const w = container.clientWidth > 0 ? container.clientWidth : 960;
    const h = container.clientHeight > 0 ? container.clientHeight : 620;

    this.lobbyScene = new THREE.Scene();
    this.lobbyScene.background = new THREE.Color(0x090d16);
    this.lobbyScene.fog = new THREE.FogExp2(0x090d16, 0.03);

    this.lobbyCamera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    this.lobbyCamera.position.set(0, 1.8, 4.5);
    this.lobbyCamera.lookAt(0, 1.2, 0);

    this.lobbyRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.lobbyRenderer.setSize(w, h);
    this.lobbyRenderer.shadowMap.enabled = true;
    this.lobbyRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lights
    const amb = new THREE.AmbientLight(0xffffff, 0.7);
    this.lobbyScene.add(amb);

    const dir = new THREE.DirectionalLight(0xf59e0b, 1.5);
    dir.position.set(5, 10, 5);
    dir.castShadow = true;
    this.lobbyScene.add(dir);

    // Desert Urban Background Floor
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.lobbyScene.add(floor);

    // 3D Militarized Soldier Model in Lobby Center
    this.lobbySoldier = this.createMilitarizedSoldierMesh();
    this.lobbySoldier.position.set(0, 0, 0);
    this.lobbyScene.add(this.lobbySoldier);

    this.stopLobbyLoop();
    this.lobbyLoop();
  }

  private lobbyLoop = (): void => {
    if (this.lobbySoldier) {
      this.lobbySoldier.rotation.y += 0.005; // Idle slow spin
    }
    if (this.lobbyRenderer && this.lobbyScene && this.lobbyCamera) {
      this.lobbyRenderer.render(this.lobbyScene, this.lobbyCamera);
    }
    this.lobbyAnimId = requestAnimationFrame(this.lobbyLoop);
  };

  private stopLobbyLoop(): void {
    if (this.lobbyAnimId !== null) {
      cancelAnimationFrame(this.lobbyAnimId);
      this.lobbyAnimId = null;
    }
  }

  // ---------------- IN-GAME THREE.JS SCENE ----------------
  private initGame3D(): void {
    if (!this.gameCanvasRef || !this.gameContainerRef) return;
    const canvas = this.gameCanvasRef.nativeElement;
    const container = this.gameContainerRef.nativeElement;
    const w = container.clientWidth > 0 ? container.clientWidth : 960;
    const h = container.clientHeight > 0 ? container.clientHeight : 620;

    this.gameScene = new THREE.Scene();
    this.gameScene.background = new THREE.Color(0x060911);
    this.gameScene.fog = new THREE.FogExp2(0x060911, 0.018);

    this.gameCamera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
    this.playerPos.set(0, this.PLAYER_HEIGHT, 18);
    this.yaw = 0;
    this.pitch = 0;
    this.gameCamera.position.copy(this.playerPos);

    this.gameRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.gameRenderer.setSize(w, h);
    this.gameRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.gameRenderer.shadowMap.enabled = true;
    this.gameRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Tactical Sun Directional Light with Shadows
    const amb = new THREE.AmbientLight(0xffffff, 0.65);
    this.gameScene.add(amb);

    const dirLight = new THREE.DirectionalLight(0xfde047, 1.3);
    dirLight.position.set(25, 45, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 80;
    dirLight.shadow.camera.left = -40;
    dirLight.shadow.camera.right = 40;
    dirLight.shadow.camera.top = 40;
    dirLight.shadow.camera.bottom = -40;
    this.gameScene.add(dirLight);

    this.muzzleLight = new THREE.PointLight(0x00f2fe, 0, 15);
    this.gameCamera.add(this.muzzleLight);
    this.gameScene.add(this.gameCamera);

    // Build 3D FPS Weapon held in hands
    this.build3DFpsGun();

    // Build Desert Urban Warfare Map (Dust II style)
    this.buildDesertUrbanMap();
  }

  private build3DFpsGun(): void {
    this.fpsGunGroup = new THREE.Group();

    // Receiver Body
    const bodyGeo = new THREE.BoxGeometry(0.12, 0.18, 0.85);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.85 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    this.fpsGunGroup.add(body);

    // Picatinny Rail & Scope Sight
    const railGeo = new THREE.BoxGeometry(0.06, 0.04, 0.5);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(0, 0.11, -0.1);
    this.fpsGunGroup.add(rail);

    const sightGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.16, 16);
    const sightMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.95 });
    const sight = new THREE.Mesh(sightGeo, sightMat);
    sight.rotation.x = Math.PI / 2;
    sight.position.set(0, 0.15, -0.1);
    this.fpsGunGroup.add(sight);

    // Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.65, 12);
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
    const barrel = new THREE.Mesh(barrelGeo, barrelMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.04, -0.65);
    this.fpsGunGroup.add(barrel);

    // Muzzle Flash Flame Cone Sprite Mesh
    const flameGeo = new THREE.ConeGeometry(0.12, 0.3, 8);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0 });
    this.muzzleFlashMesh = new THREE.Mesh(flameGeo, flameMat);
    this.muzzleFlashMesh.rotation.x = -Math.PI / 2;
    this.muzzleFlashMesh.position.set(0, 0.04, -1.05);
    this.fpsGunGroup.add(this.muzzleFlashMesh);

    // Magazine
    const magGeo = new THREE.BoxGeometry(0.08, 0.38, 0.14);
    const magMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const mag = new THREE.Mesh(magGeo, magMat);
    mag.position.set(0, -0.2, -0.1);
    this.fpsGunGroup.add(mag);

    // Attach to FPS Camera
    this.fpsGunGroup.position.set(0.28, -0.28, -0.6);
    this.gameCamera.add(this.fpsGunGroup);
  }

  private buildDesertUrbanMap(): void {
    // Sand Floor with Shadows
    const floorGeo = new THREE.PlaneGeometry(90, 90);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.9, metalness: 0.1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.gameScene.add(floor);

    // Grid details
    const grid = new THREE.GridHelper(90, 45, 0xb45309, 0x78350f);
    grid.position.y = 0.01;
    this.gameScene.add(grid);

    // Desert Sandstone Buildings (Dust II Compound)
    const bldgMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const bldgPositions = [
      { x: -18, z: 0, w: 12, h: 9, d: 16 },
      { x: 20, z: -10, w: 14, h: 11, d: 14 },
      { x: 0, z: -28, w: 24, h: 8, d: 10 },
      { x: -14, z: 18, w: 10, h: 7, d: 12 }
    ];

    for (let b of bldgPositions) {
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const mesh = new THREE.Mesh(geo, bldgMat);
      mesh.position.set(b.x, b.h / 2, b.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.gameScene.add(mesh);

      // Building Trim Wireframes
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xf59e0b }));
      mesh.add(line);
    }

    // Sandbag Barricades & Crates for Cover
    const crateGeo = new THREE.BoxGeometry(3, 3, 3);
    const crateMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5, metalness: 0.4 });
    const cratePositions = [
      { x: -8, z: 6 }, { x: 10, z: 4 }, { x: -4, z: -12 }, { x: 8, z: -16 }, { x: -14, z: -6 }
    ];

    for (let pos of cratePositions) {
      const crate = new THREE.Mesh(crateGeo, crateMat);
      crate.position.set(pos.x, 1.5, pos.z);
      crate.castShadow = true;
      crate.receiveShadow = true;
      this.gameScene.add(crate);

      const edges = new THREE.EdgesGeometry(crateGeo);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x38bdf8 }));
      crate.add(line);
    }
  }

  private createMilitarizedSoldierMesh(): THREE.Group {
    const group = new THREE.Group();

    // Torso (Vest & Camo Uniform)
    const torsoGeo = new THREE.BoxGeometry(0.85, 1.15, 0.55);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    group.add(torso);

    // Helmet & Head
    const headGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.95;
    head.castShadow = true;
    group.add(head);

    // Visor Goggles
    const visorGeo = new THREE.BoxGeometry(0.45, 0.12, 0.2);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 1.95, 0.22);
    group.add(visor);

    // Left & Right Arms
    const armGeo = new THREE.BoxGeometry(0.22, 0.9, 0.22);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x475569 });

    const armL = new THREE.Mesh(armGeo, armMat);
    armL.position.set(-0.55, 1.15, 0);
    group.add(armL);

    const armR = new THREE.Mesh(armGeo, armMat);
    armR.position.set(0.55, 1.15, 0);
    group.add(armR);

    // Left & Right Legs
    const legGeo = new THREE.BoxGeometry(0.26, 0.95, 0.26);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

    const legL = new THREE.Mesh(legGeo, legMat);
    legL.position.set(-0.25, 0.48, 0);
    group.add(legL);

    const legR = new THREE.Mesh(legGeo, legMat);
    legR.position.set(0.25, 0.48, 0);
    group.add(legR);

    // Held Assault Rifle
    const rifleGeo = new THREE.BoxGeometry(0.1, 0.12, 0.9);
    const rifleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
    const rifle = new THREE.Mesh(rifleGeo, rifleMat);
    rifle.position.set(0.35, 1.25, -0.45);
    group.add(rifle);

    return group;
  }

  private gameLoop(timestamp: number): void {
    if (this.currentScreen !== 'in-game') return;

    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    if (!this.isPaused && !this.isGameOver) {
      this.updateGame(dt, timestamp);
    }

    this.gameRenderer.render(this.gameScene, this.gameCamera);
    this.animFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
  }

  private stopGameLoop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private updateGame(dt: number, now: number): void {
    // 1. FPS Player Movement Relative to Camera Facing
    let speed = this.keys['ShiftLeft'] || this.keys['ShiftRight'] ? 22 : 14;
    let moveForward = 0;
    let moveRight = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) moveForward += 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) moveForward -= 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveRight -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) moveRight += 1;

    const cosY = Math.cos(this.yaw);
    const sinY = Math.sin(this.yaw);

    let dx = (-sinY * moveForward + cosY * moveRight);
    let dz = (-cosY * moveForward - sinY * moveRight);

    if (moveForward !== 0 && moveRight !== 0) {
      dx *= 0.7071;
      dz *= 0.7071;
    }

    this.playerPos.x += dx * speed * dt;
    this.playerPos.z += dz * speed * dt;

    this.playerPos.x = Math.max(-this.ARENA_LIMIT, Math.min(this.ARENA_LIMIT, this.playerPos.x));
    this.playerPos.z = Math.max(-this.ARENA_LIMIT, Math.min(this.ARENA_LIMIT, this.playerPos.z));

    // Jump Physics
    if (!this.isGrounded) {
      this.velocityY -= 35 * dt;
      this.playerPos.y += this.velocityY * dt;

      if (this.playerPos.y <= this.PLAYER_HEIGHT) {
        this.playerPos.y = this.PLAYER_HEIGHT;
        this.velocityY = 0;
        this.isGrounded = true;
      }
    }

    this.gameCamera.position.copy(this.playerPos);

    // Continuous Fire
    if (this.isMouseDown) {
      this.tryShoot(now);
    }

    // Gun Recoil Spring Interpolation
    this.gunRecoilZ = THREE.MathUtils.lerp(this.gunRecoilZ, 0, dt * 18);
    this.gunRecoilRotX = THREE.MathUtils.lerp(this.gunRecoilRotX, 0, dt * 18);

    if (this.fpsGunGroup) {
      const targetX = this.isAdsActive ? 0 : 0.28;
      const targetY = this.isAdsActive ? -0.14 : -0.28;
      const targetZ = -0.6 + this.gunRecoilZ;

      this.fpsGunGroup.position.x = THREE.MathUtils.lerp(this.fpsGunGroup.position.x, targetX, dt * 25);
      this.fpsGunGroup.position.y = THREE.MathUtils.lerp(this.fpsGunGroup.position.y, targetY, dt * 25);
      this.fpsGunGroup.position.z = THREE.MathUtils.lerp(this.fpsGunGroup.position.z, targetZ, dt * 25);
      this.fpsGunGroup.rotation.x = this.gunRecoilRotX;
    }

    // Decay Muzzle Light & Flame
    if (this.muzzleLight.intensity > 0) {
      this.muzzleLight.intensity = Math.max(0, this.muzzleLight.intensity - dt * 35);
    }
    if (this.muzzleFlashMesh) {
      (this.muzzleFlashMesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, (this.muzzleFlashMesh.material as THREE.MeshBasicMaterial).opacity - dt * 20);
    }

    // 2. Update Enemy Soldiers AI & Walking Animations
    for (let bot of this.enemies) {
      if (!bot.alive) continue;

      if (bot.dying) {
        bot.deathTimer -= dt;
        bot.group.rotation.x = THREE.MathUtils.lerp(bot.group.rotation.x, -Math.PI / 2, dt * 8); // Ragdoll fall backward
        bot.group.position.y = Math.max(0.1, bot.group.position.y - dt * 2);

        if (bot.deathTimer <= 0) {
          bot.alive = false;
          this.gameScene.remove(bot.group);
        }
        continue;
      }

      // Move toward player
      const toPlayer = new THREE.Vector3().subVectors(this.playerPos, bot.group.position);
      toPlayer.y = 0;
      const dist = toPlayer.length();

      if (dist > 2.0) {
        toPlayer.normalize();
        bot.group.position.x += toPlayer.x * bot.speed * dt;
        bot.group.position.z += toPlayer.z * bot.speed * dt;
        bot.group.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);

        // Walking Leg Animation Cycle
        bot.walkTimer += dt * 10;
        bot.leftLeg.rotation.x = Math.sin(bot.walkTimer) * 0.5;
        bot.rightLeg.rotation.x = -Math.sin(bot.walkTimer) * 0.5;
        bot.leftArm.rotation.x = -Math.sin(bot.walkTimer) * 0.4;
        bot.rightArm.rotation.x = Math.sin(bot.walkTimer) * 0.4;
      }

      // Enemy Shooting at Player
      bot.shootTimer += dt;
      if (bot.shootTimer > 1.6) {
        bot.shootTimer = 0;
        if (dist < 25) {
          this.damagePlayer(12);
          this.playSound('playerHurt');
        }
      }
    }

    this.enemies = this.enemies.filter(b => b.alive);

    // Wave Clear Check
    if (this.enemies.length === 0 && !this.isGameOver) {
      this.wave++;
      this.playSound('waveClear');
      this.triggerWaveBanner();
      this.spawnEnemies(this.wave);
    }
  }

  private tryShoot(now: number = performance.now()): void {
    if (now - this.lastShotTime < this.selectedWeapon.fireRate) return;
    if (this.currentAmmo <= 0) {
      this.reloadWeapon();
      return;
    }

    this.lastShotTime = now;
    this.currentAmmo--;

    // Gun Recoil Kickback
    this.gunRecoilZ = 0.12;
    this.gunRecoilRotX = 0.15;

    // Flash Muzzle Point Light & Flame Cone
    this.muzzleLight.intensity = 6.0;
    if (this.muzzleFlashMesh) {
      (this.muzzleFlashMesh.material as THREE.MeshBasicMaterial).opacity = 0.95;
    }

    // Raycast Shooting
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.gameCamera);
    const enemyGroups = this.enemies.filter(e => e.alive && !e.dying).map(e => e.group);
    const intersects = this.raycaster.intersectObjects(enemyGroups, true);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const isHead = hit.object === (hit.object.parent as any)?.headMesh;
      const dmg = isHead ? 100 : this.selectedWeapon.damage;

      let parent: THREE.Object3D | null = hit.object;
      while (parent && !parent.userData['botId']) {
        parent = parent.parent;
      }

      if (parent) {
        const botId = parent.userData['botId'];
        const hitBot = this.enemies.find(e => e.id === botId);

        if (hitBot && !hitBot.dying) {
          hitBot.hp -= dmg;
          this.triggerHitmarker(isHead);
          this.playSound('hit');

          if (hitBot.hp <= 0) {
            hitBot.dying = true;
            hitBot.deathTimer = 0.6;
            this.matchKills++;
            this.score += 15;
            this.playerCash += 100;
            if (typeof window !== 'undefined' && window.localStorage) {
              localStorage.setItem('fragen_player_cash', this.playerCash.toString());
            }

            this.killFeed.unshift(`PLAYER 🎯 SOLDIER #${hitBot.id} ${isHead ? '[HEADSHOT]' : ''}`);
            if (this.killFeed.length > 4) this.killFeed.pop();
            this.playSound('botExplode');
          }
        }
      }
    }

    this.playSound('shoot');
  }

  private reloadWeapon(): void {
    if (this.isReloading || this.reserveAmmo <= 0) return;
    this.isReloading = true;
    this.playSound('reload');

    setTimeout(() => {
      const needed = this.selectedWeapon.clipSize - this.currentAmmo;
      const loaded = Math.min(needed, this.reserveAmmo);
      this.currentAmmo += loaded;
      this.reserveAmmo -= loaded;
      this.isReloading = false;
    }, this.selectedWeapon.reloadTimeMs);
  }

  private spawnEnemies(waveNum: number): void {
    const count = 4 + (waveNum - 1) * 2;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 24 + Math.random() * 8;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist - 10;

      const group = this.createMilitarizedSoldierMesh();
      group.position.set(x, 0, z);
      group.userData['botId'] = this.nextBotId++;
      this.gameScene.add(group);

      this.enemies.push({
        id: group.userData['botId'],
        group,
        headMesh: group.children[1] as THREE.Mesh,
        bodyMesh: group.children[0] as THREE.Mesh,
        leftArm: group.children[3] as THREE.Mesh,
        rightArm: group.children[4] as THREE.Mesh,
        leftLeg: group.children[5] as THREE.Mesh,
        rightLeg: group.children[6] as THREE.Mesh,
        hp: 35,
        maxHp: 35,
        speed: 4.5 + Math.min(waveNum * 0.5, 5),
        alive: true,
        dying: false,
        deathTimer: 0,
        walkTimer: Math.random() * Math.PI,
        shootTimer: Math.random() * 1.5
      });
    }
  }

  private damagePlayer(amount: number): void {
    if (this.playerArmor > 0) {
      this.playerArmor = Math.max(0, this.playerArmor - amount * 0.6);
      this.playerHealth = Math.max(0, this.playerHealth - amount * 0.4);
    } else {
      this.playerHealth = Math.max(0, this.playerHealth - amount);
    }

    this.ngZone.run(() => {
      this.showDamageFlash = true;
      setTimeout(() => this.showDamageFlash = false, 300);
    });

    if (this.playerHealth <= 0) {
      this.isGameOver = true;
      this.playSound('gameOver');
      if (document.exitPointerLock) document.exitPointerLock();
    }
  }

  private triggerHitmarker(headshot: boolean): void {
    this.ngZone.run(() => {
      this.isHeadshot = headshot;
      this.showHitmarker = true;
      setTimeout(() => this.showHitmarker = false, 150);
    });
  }

  private triggerWaveBanner(): void {
    this.ngZone.run(() => {
      this.showWaveBanner = true;
      setTimeout(() => this.showWaveBanner = false, 2500);
    });
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
  }

  private initAudioContext(): void {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private playSound(type: string): void {
    if (this.isMuted || !this.audioCtx) return;
    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'shoot') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
      } else if (type === 'reload') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now); osc.stop(now + 0.2);
      } else if (type === 'hit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(280, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
      } else if (type === 'botExplode') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(40, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
      } else if (type === 'playerHurt') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
      }
    } catch (e) {}
  }
}
