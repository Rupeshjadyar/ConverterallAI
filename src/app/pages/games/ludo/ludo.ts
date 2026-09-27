import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type TokenState = 'home' | 'active' | 'finished';

interface Token {
  id: number;
  player: number;
  position: number; // 0=home, 1-56=track, 57=finished
  state: TokenState;
}

const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'];
const PLAYER_NAMES = ['You', 'Bot 1', 'Bot 2', 'Bot 3'];
const SAFE_SQUARES = [1, 9, 14, 22, 27, 35, 40, 48];

@Component({
  selector: 'app-ludo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ludo.html',
  styleUrl: './ludo.css',
})
export class Ludo implements OnInit {
  numPlayers = signal(2);
  tokens = signal<Token[]>([]);
  currentPlayer = signal(0);
  diceValue = signal(0);
  diceRolled = signal(false);
  isRolling = signal(false);
  diceAnim = signal(0);
  gameLog = signal<string[]>([]);
  gameOver = signal(false);
  winner = signal<string>('');
  movableTokens = signal<number[]>([]);

  playerColors = PLAYER_COLORS;
  playerNames = PLAYER_NAMES;

  ngOnInit() {
    this.initGame();
  }

  initGame() {
    const tokens: Token[] = [];
    let id = 0;
    for (let p = 0; p < this.numPlayers(); p++) {
      for (let t = 0; t < 4; t++) {
        tokens.push({ id: id++, player: p, position: 0, state: 'home' });
      }
    }
    this.tokens.set(tokens);
    this.currentPlayer.set(0);
    this.diceValue.set(0);
    this.diceRolled.set(false);
    this.gameOver.set(false);
    this.winner.set('');
    this.gameLog.set(['Game started! Roll the dice.']);
    this.movableTokens.set([]);
  }

  rollDice() {
    if (this.isRolling() || this.diceRolled() || this.gameOver()) return;
    if (this.currentPlayer() !== 0) return; // Only player can click roll

    this.isRolling.set(true);
    let count = 0;
    const interval = setInterval(() => {
      this.diceAnim.set(Math.ceil(Math.random() * 6));
      count++;
      if (count > 8) {
        clearInterval(interval);
        const roll = Math.ceil(Math.random() * 6);
        this.diceValue.set(roll);
        this.diceAnim.set(roll);
        this.isRolling.set(false);
        this.diceRolled.set(true);
        this.calculateMovable(0, roll);
      }
    }, 80);
  }

  calculateMovable(player: number, roll: number) {
    const playerTokens = this.tokens().filter(t => t.player === player);
    const movable: number[] = [];

    for (const token of playerTokens) {
      if (token.state === 'finished') continue;
      if (token.state === 'home' && roll === 6) {
        movable.push(token.id);
      } else if (token.state === 'active') {
        const newPos = token.position + roll;
        if (newPos <= 57) movable.push(token.id);
      }
    }

    this.movableTokens.set(movable);

    if (movable.length === 0) {
      this.addLog(`${PLAYER_NAMES[player]} rolled ${roll} — no moves!`);
      this.endTurn(roll);
    } else if (player !== 0) {
      // Bot auto-picks
      setTimeout(() => this.botMove(player, roll, movable), 600);
    }
  }

  moveToken(tokenId: number) {
    if (!this.movableTokens().includes(tokenId)) return;
    const roll = this.diceValue();
    this.applyMove(tokenId, roll);
  }

  botMove(player: number, roll: number, movable: number[]) {
    // Prefer active tokens, else bring from home
    const activeMovable = movable.filter(id => {
      const t = this.tokens().find(tok => tok.id === id);
      return t?.state === 'active';
    });
    const pick = activeMovable.length ? activeMovable[0] : movable[0];
    this.applyMove(pick, roll);
  }

  applyMove(tokenId: number, roll: number) {
    const tokens = this.tokens().map(t => ({ ...t }));
    const token = tokens.find(t => t.id === tokenId)!;
    const player = token.player;

    if (token.state === 'home') {
      token.state = 'active';
      token.position = 1;
      this.addLog(`${PLAYER_NAMES[player]}'s token leaves home!`);
    } else {
      const newPos = token.position + roll;
      token.position = newPos;
      this.addLog(`${PLAYER_NAMES[player]} moves to ${newPos}`);
      if (newPos >= 57) {
        token.state = 'finished';
        token.position = 57;
        this.addLog(`🎉 ${PLAYER_NAMES[player]}'s token reached home!`);
      }
    }

    this.tokens.set(tokens);
    this.movableTokens.set([]);

    // Check win
    const playerTokens = tokens.filter(t => t.player === player);
    if (playerTokens.every(t => t.state === 'finished')) {
      this.gameOver.set(true);
      this.winner.set(PLAYER_NAMES[player]);
      this.addLog(`🏆 ${PLAYER_NAMES[player]} WINS!`);
      return;
    }

    this.endTurn(roll);
  }

  endTurn(roll: number) {
    this.diceRolled.set(false);
    this.diceValue.set(0);

    if (roll === 6) {
      this.addLog(`${PLAYER_NAMES[this.currentPlayer()]} gets another turn (rolled 6)!`);
      if (this.currentPlayer() !== 0) {
        setTimeout(() => this.botTurn(this.currentPlayer()), 700);
      }
      return;
    }

    let next = (this.currentPlayer() + 1) % this.numPlayers();
    this.currentPlayer.set(next);

    if (next !== 0) {
      setTimeout(() => this.botTurn(next), 700);
    } else {
      this.addLog("Your turn! Roll the dice.");
    }
  }

  botTurn(player: number) {
    if (this.gameOver()) return;
    this.isRolling.set(true);
    let count = 0;
    const interval = setInterval(() => {
      this.diceAnim.set(Math.ceil(Math.random() * 6));
      count++;
      if (count > 6) {
        clearInterval(interval);
        const roll = Math.ceil(Math.random() * 6);
        this.diceValue.set(roll);
        this.diceAnim.set(roll);
        this.isRolling.set(false);
        this.diceRolled.set(true);
        this.addLog(`${PLAYER_NAMES[player]} rolled ${roll}`);
        this.calculateMovable(player, roll);
      }
    }, 80);
  }

  addLog(msg: string) {
    this.gameLog.update(l => [msg, ...l.slice(0, 11)]);
  }

  getPlayerTokens(player: number): Token[] {
    return this.tokens().filter(t => t.player === player);
  }

  getDiceFace(val: number): string {
    const faces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return faces[val] || '🎲';
  }

  isMovable(tokenId: number): boolean {
    return this.movableTokens().includes(tokenId);
  }
}
