import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Player {
  id: number;
  name: string;
  position: number;
  color: string;
  isBot: boolean;
}

interface SnakeLadder {
  from: number;
  to: number;
  type: 'snake' | 'ladder';
}

@Component({
  selector: 'app-snakes-ladders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snakes-ladders.html',
  styleUrl: './snakes-ladders.css',
})
export class SnakesLadders implements OnInit {
  players = signal<Player[]>([
    { id: 1, name: 'You', position: 0, color: '#ef4444', isBot: false },
    { id: 2, name: 'Bot', position: 0, color: '#3b82f6', isBot: true },
  ]);

  currentPlayerIndex = signal(0);
  diceValue = signal(0);
  gameLog = signal<string[]>([]);
  gameOver = signal(false);
  winner = signal<Player | null>(null);
  isRolling = signal(false);
  diceAnimFrame = signal(0);

  snakesAndLadders: SnakeLadder[] = [
    // Ladders (from -> to, to > from)
    { from: 4, to: 14, type: 'ladder' },
    { from: 9, to: 31, type: 'ladder' },
    { from: 20, to: 38, type: 'ladder' },
    { from: 28, to: 84, type: 'ladder' },
    { from: 40, to: 59, type: 'ladder' },
    { from: 51, to: 67, type: 'ladder' },
    { from: 63, to: 81, type: 'ladder' },
    { from: 71, to: 91, type: 'ladder' },
    // Snakes (from -> to, to < from)
    { from: 17, to: 7, type: 'snake' },
    { from: 54, to: 34, type: 'snake' },
    { from: 62, to: 19, type: 'snake' },
    { from: 64, to: 60, type: 'snake' },
    { from: 87, to: 24, type: 'snake' },
    { from: 93, to: 73, type: 'snake' },
    { from: 95, to: 75, type: 'snake' },
    { from: 99, to: 78, type: 'snake' },
  ];

  board = computed(() => {
    const cells: number[] = [];
    for (let row = 9; row >= 0; row--) {
      const isEvenRow = (9 - row) % 2 === 0;
      for (let col = 0; col < 10; col++) {
        const num = isEvenRow
          ? row * 10 + col + 1
          : row * 10 + (9 - col) + 1;
        cells.push(num);
      }
    }
    return cells;
  });

  ngOnInit() {
    this.addLog('Game started! Roll the dice to begin.');
  }

  get currentPlayer(): Player {
    return this.players()[this.currentPlayerIndex()];
  }

  getPlayersOnCell(cell: number): Player[] {
    return this.players().filter(p => p.position === cell);
  }

  getCellType(cell: number): string {
    const sl = this.snakesAndLadders.find(s => s.from === cell);
    if (sl) return sl.type;
    return '';
  }

  rollDice() {
    if (this.isRolling() || this.gameOver() || this.currentPlayer.isBot) return;
    this.performRoll();
  }

  performRoll() {
    this.isRolling.set(true);
    let animCount = 0;
    const animInterval = setInterval(() => {
      this.diceAnimFrame.set(Math.ceil(Math.random() * 6));
      animCount++;
      if (animCount > 8) {
        clearInterval(animInterval);
        const roll = Math.ceil(Math.random() * 6);
        this.diceValue.set(roll);
        this.diceAnimFrame.set(roll);
        this.isRolling.set(false);
        this.movePlayer(roll);
      }
    }, 80);
  }

  movePlayer(roll: number) {
    const players = [...this.players()];
    const idx = this.currentPlayerIndex();
    const player = { ...players[idx] };

    this.addLog(`${player.name} rolled a ${roll}`);

    let newPos = player.position + roll;
    if (newPos > 100) {
      this.addLog(`${player.name} needs ${100 - player.position} to win. Stay!`);
      this.nextTurn();
      return;
    }

    player.position = newPos;

    const sl = this.snakesAndLadders.find(s => s.from === newPos);
    if (sl) {
      if (sl.type === 'ladder') {
        this.addLog(`🪜 ${player.name} climbed a LADDER! ${sl.from} → ${sl.to}`);
      } else {
        this.addLog(`🐍 ${player.name} got bitten by a SNAKE! ${sl.from} → ${sl.to}`);
      }
      player.position = sl.to;
    }

    players[idx] = player;
    this.players.set(players);

    if (player.position >= 100) {
      this.winner.set(player);
      this.gameOver.set(true);
      this.addLog(`🎉 ${player.name} WINS! Congratulations!`);
      return;
    }

    this.nextTurn();
  }

  nextTurn() {
    const next = (this.currentPlayerIndex() + 1) % this.players().length;
    this.currentPlayerIndex.set(next);

    // Bot turn
    if (this.players()[next].isBot && !this.gameOver()) {
      setTimeout(() => this.performRoll(), 1000);
    }
  }

  addLog(msg: string) {
    this.gameLog.update(log => [msg, ...log.slice(0, 9)]);
  }

  resetGame() {
    this.players.set([
      { id: 1, name: 'You', position: 0, color: '#ef4444', isBot: false },
      { id: 2, name: 'Bot', position: 0, color: '#3b82f6', isBot: true },
    ]);
    this.currentPlayerIndex.set(0);
    this.diceValue.set(0);
    this.gameLog.set([]);
    this.gameOver.set(false);
    this.winner.set(null);
    this.isRolling.set(false);
    this.addLog('New game started! Roll the dice to begin.');
  }

  getDiceFace(val: number): string {
    const faces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return faces[val] || '🎲';
  }

  getSnakeLadderInfo(cell: number): string {
    const sl = this.snakesAndLadders.find(s => s.from === cell);
    if (!sl) return '';
    return sl.type === 'ladder' ? `🪜→${sl.to}` : `🐍→${sl.to}`;
  }
}
