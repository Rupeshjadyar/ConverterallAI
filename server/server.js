const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

// Basic health check route for cloud hosts like Render
app.get('/', (req, res) => {
  res.send({ status: 'ok', server: 'Warfare 3000 Real-Time Game Server' });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// CONSTANTS & GAME SETTINGS
const ARENA_WIDTH = 1600;
const ARENA_HEIGHT = 1000;
const TANK_RADIUS = 22; // collision radius
const TANK_SPEED = 220; // px/sec
const BULLET_SPEED = 620; // px/sec
const BULLET_LIFE = 1.2; // seconds
const BULLET_DAMAGE = 20;
const BULLET_RADIUS = 5;
const FIRE_COOLDOWN = 300; // ms (0.3s)
const TICK_RATE = 30; // 30 Hz
const TICK_INTERVAL = 1000 / TICK_RATE;

// COLOR PALETTE FOR TANKS
const TANK_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Emerald Green
  '#f59e0b', // Amber/Gold
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#84cc16', // Lime
  '#d946ef', // Fuchsia
  '#14b8a6', // Teal
  '#eab308'  // Yellow
];

// GAME STATE
const players = {};
let bullets = [];
let colorIndex = 0;
let bulletIdCounter = 0;

function getRandomSpawn() {
  const margin = 100;
  return {
    x: Math.floor(margin + Math.random() * (ARENA_WIDTH - margin * 2)),
    y: Math.floor(margin + Math.random() * (ARENA_HEIGHT - margin * 2))
  };
}

function getNextColor() {
  const color = TANK_COLORS[colorIndex % TANK_COLORS.length];
  colorIndex++;
  return color;
}

// SOCKET CONNECTIONS
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('join', (data) => {
    let name = 'Tanker';
    if (data && typeof data.name === 'string') {
      const sanitized = data.name.trim().substring(0, 12);
      if (sanitized.length > 0) {
        name = sanitized;
      }
    }

    const spawn = getRandomSpawn();
    players[socket.id] = {
      id: socket.id,
      name: name,
      color: getNextColor(),
      x: spawn.x,
      y: spawn.y,
      angle: 0,
      hp: 100,
      score: 0,
      lastFireTime: 0,
      input: { mx: 0, my: 0, a: 0, f: false }
    };

    // Send init config back to player
    socket.emit('init', {
      id: socket.id,
      arena: { width: ARENA_WIDTH, height: ARENA_HEIGHT },
      player: players[socket.id]
    });

    console.log(`Player "${name}" (${socket.id}) joined arena.`);
  });

  socket.on('playerInput', (input) => {
    const p = players[socket.id];
    if (!p) return;

    // Validate and clamp input strictly
    let mx = 0;
    let my = 0;
    let a = p.angle;
    let f = false;

    if (input && typeof input === 'object') {
      if (typeof input.mx === 'number' && !isNaN(input.mx)) {
        mx = Math.max(-1, Math.min(1, input.mx));
      }
      if (typeof input.my === 'number' && !isNaN(input.my)) {
        my = Math.max(-1, Math.min(1, input.my));
      }

      // If diagonal movement vector length > 1, normalize to max 1
      const mag = Math.hypot(mx, my);
      if (mag > 1) {
        mx /= mag;
        my /= mag;
      }

      if (typeof input.a === 'number' && !isNaN(input.a)) {
        a = input.a;
      }

      if (typeof input.f === 'boolean') {
        f = input.f;
      }
    }

    p.input = { mx, my, a, f };
    p.angle = a;
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    delete players[socket.id];
    // Remove bullets owned by disconnected player if needed, or let them expire naturally
  });
});

// MAIN GAME LOOP (30 Hz)
let lastTickTime = Date.now();

setInterval(() => {
  const now = Date.now();
  const dt = (now - lastTickTime) / 1000; // Delta time in seconds
  lastTickTime = now;

  // 1. UPDATE PLAYERS
  for (const id in players) {
    const p = players[id];

    // Movement
    if (p.input.mx !== 0 || p.input.my !== 0) {
      p.x += p.input.mx * TANK_SPEED * dt;
      p.y += p.input.my * TANK_SPEED * dt;

      // Clamp within arena boundaries
      p.x = Math.max(TANK_RADIUS, Math.min(ARENA_WIDTH - TANK_RADIUS, p.x));
      p.y = Math.max(TANK_RADIUS, Math.min(ARENA_HEIGHT - TANK_RADIUS, p.y));
    }

    // Firing
    if (p.input.f && (now - p.lastFireTime) >= FIRE_COOLDOWN) {
      p.lastFireTime = now;

      // Spawn bullet at barrel tip (~28px from tank center)
      const barrelLength = 28;
      const bx = p.x + Math.cos(p.angle) * barrelLength;
      const by = p.y + Math.sin(p.angle) * barrelLength;

      bulletIdCounter++;
      bullets.push({
        id: `${p.id}-${bulletIdCounter}`,
        ownerId: p.id,
        x: bx,
        y: by,
        vx: Math.cos(p.angle) * BULLET_SPEED,
        vy: Math.sin(p.angle) * BULLET_SPEED,
        life: BULLET_LIFE
      });
    }
  }

  // 2. UPDATE BULLETS & CHECK COLLISIONS
  const nextBullets = [];

  for (let i = 0; i < bullets.length; i++) {
    const b = bullets[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;

    // Check arena bounds
    if (b.x < 0 || b.x > ARENA_WIDTH || b.y < 0 || b.y > ARENA_HEIGHT || b.life <= 0) {
      continue; // Bullet disappears
    }

    let hit = false;

    // Check collision with players
    for (const id in players) {
      const p = players[id];

      // Friendly fire: bullet doesn't hit its shooter
      if (b.ownerId === p.id) continue;

      const dist = Math.hypot(b.x - p.x, b.y - p.y);
      if (dist < (TANK_RADIUS + BULLET_RADIUS)) {
        hit = true;
        p.hp -= BULLET_DAMAGE;

        // Check death
        if (p.hp <= 0) {
          // Reward killer
          const killer = players[b.ownerId];
          if (killer) {
            killer.score += 1;
          }

          // Respawn victim (keep score, reset HP & position)
          const spawn = getRandomSpawn();
          p.hp = 100;
          p.x = spawn.x;
          p.y = spawn.y;

          // Notify kill event to clients
          io.emit('playerKilled', {
            victimId: p.id,
            victimName: p.name,
            killerId: b.ownerId,
            killerName: killer ? killer.name : 'Unknown'
          });
        }
        break;
      }
    }

    if (!hit) {
      nextBullets.push(b);
    }
  }

  bullets = nextBullets;

  // 3. BROADCAST GAME STATE Snapshot TO ALL CLIENTS
  const stateSnapshot = {
    t: now,
    players: Object.values(players).map(p => ({
      id: p.id,
      name: p.name,
      color: p.color,
      x: Math.round(p.x * 10) / 10,
      y: Math.round(p.y * 10) / 10,
      a: Math.round(p.angle * 1000) / 1000,
      hp: p.hp,
      score: p.score
    })),
    bullets: bullets.map(b => ({
      id: b.id,
      x: Math.round(b.x * 10) / 10,
      y: Math.round(b.y * 10) / 10,
      ownerId: b.ownerId
    }))
  };

  io.emit('gameState', stateSnapshot);

}, TICK_INTERVAL);

// START SERVER
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(` Warfare 3000 Server running on port ${PORT}`);
  console.log(` Game Arena: ${ARENA_WIDTH}x${ARENA_HEIGHT}`);
  console.log(` Tick Rate: ${TICK_RATE} Hz (${TICK_INTERVAL.toFixed(2)}ms)`);
  console.log(`==========================================`);
});
