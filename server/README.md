# Warfare 3000 - Backend Server

Real-time multiplayer server built with Node.js, Express, and Socket.IO for **Warfare 3000** 2D Tank Arena.

## Local Setup & Run

1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   or from the root folder:
   ```bash
   node server/server.js
   ```

The server runs on `http://localhost:3000` by default.

---

## Testing on Phone over WiFi

1. Make sure your computer and phone are connected to the same local Wi-Fi network.
2. Find your computer's local IP address (e.g., `192.168.1.15`):
   - **Windows**: Run `ipconfig` in Command Prompt and check `IPv4 Address`.
   - **Mac/Linux**: Run `ifconfig` or `ip a`.
3. Start the server on your computer.
4. On your phone, open the browser and navigate to: `http://<YOUR_LOCAL_IP>:4200` (Angular dev server) or test API at `http://<YOUR_LOCAL_IP>:3000`.

---

## Deployment to Render

1. Create a GitHub repository containing this codebase and push your code.
2. Log in to [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Set the following settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Deploy the web service. Render will automatically assign a `PORT` environment variable and provide a service URL (e.g. `https://warfare3000-server.onrender.com`).
7. Update `PRODUCTION_SERVER_URL` in `src/app/pages/games/warfare-3000/warfare-3000.component.ts` (or `warfare-3000.service.ts`) with your Render URL.
