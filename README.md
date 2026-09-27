# Warfare 3000 - Real-Time Multiplayer Tank Arena Game

"Warfare 3000" is a top-down 2D real-time free-for-all multiplayer tank arena shooter built with Angular 17+ (Client-side HTML5 Canvas) and Node.js + Socket.IO (Server-authoritative engine).

---

## 🎮 Game Features & Mechanics

- **Shared Live Arena**: Everyone joins one shared `1600x1000` arena.
- **Player Stats**: Each tank starts with `100 HP`. Bullets deal `20 HP` damage.
- **Kills & Respawn**: When a tank dies, the killer gets `+1 score` and the victim respawns at a random position with their score preserved.
- **Physics**: Fire cooldown `0.3s`, bullet life `1.2s`, tank speed `220 px/s`, bullet speed `620 px/s`.
- **Top 5 Leaderboard**: Live real-time top-5 leaderboard in the top-right corner.
- **Cross-Platform Controls**:
  - **Laptop/Desktop**: `WASD` or Arrow Keys to move, Mouse to aim barrel, Left Click / Space to shoot.
  - **Phone/Tablet**: Twin-stick touch controls using HTML5 Pointer Events. Left screen half = movement joystick, right screen half = aiming joystick (auto-fires while pushed).

---

## 🚀 How to Run Locally

### 1. Start the Backend Game Server (Node.js + Socket.IO)

Open terminal 1:
```bash
# Navigate to server folder
cd server

# Install dependencies (express, socket.io, cors)
npm install

# Start the game server
npm start
```
The server starts on `http://localhost:3000` (runs at 30 Hz server-authoritative tick rate).

### 2. Start the Frontend Application (Angular 17+)

Open terminal 2:
```bash
# In the root folder:
npm install

# Start Angular development server accessible on local network
npx ng serve --host 0.0.0.0 --port 4200
```
Open your browser and navigate to:
`http://localhost:4200/games/warfare-3000`

---

## 📱 Testing on Phone over local WiFi

To play and test on your mobile phone over the same Wi-Fi network:

1. Connect both your computer and phone to the same Wi-Fi router.
2. Find your computer's local LAN IP address:
   - **Windows**: Open Command Prompt and type `ipconfig` (look for `IPv4 Address`, e.g., `192.168.1.15`).
   - **Mac/Linux**: Run `ifconfig` or `ip a`.
3. Start both the server (`node server/server.js`) and Angular (`npx ng serve --host 0.0.0.0 --port 4200`).
4. On your phone's browser, enter: `http://<YOUR_LOCAL_IP>:4200/games/warfare-3000`.
   - The game client automatically detects LAN host IP and connects to `http://<YOUR_LOCAL_IP>:3000`!

---

## 🌐 Deployment Instructions

### 1. Deploy Server to Render

1. Push your repository to GitHub.
2. Sign in to [Render](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Select your GitHub repository.
4. Configure settings:
   - **Name**: `warfare3000-server`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Render will automatically expose `PORT` env variable. Copy your deployed web service URL (e.g., `https://warfare3000-server.onrender.com`).
6. Update `PRODUCTION_SERVER_URL` in `src/app/pages/games/warfare-3000/warfare-3000.component.ts`.

### 2. Deploy Angular Client to Netlify

1. Build production static bundle:
   ```bash
   npm run build
   ```
2. Output directory is generated at `dist/converterallai/browser`.
3. Sign in to [Netlify](https://app.netlify.com/).
4. Click **Add new site** -> **Deploy manually** (or connect GitHub repository).
5. Drag and drop the `dist/converterallai/browser` folder or configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/converterallai/browser`
6. Add a `_redirects` file in `public/_redirects` for SPA routing support if needed:
   ```text
   /*    /index.html   200
   ```
