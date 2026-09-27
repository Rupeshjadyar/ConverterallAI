import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14; // 14 = Ace

interface Card {
  suit: Suit;
  rank: Rank;
  label: string;
}

interface Player {
  id: number;
  name: string;
  avatar: string;
  chips: number;
  cards: Card[];
  isSeen: boolean;
  isFolded: boolean;
  isBot: boolean;
  lastAction: string;
  handRankName?: string;
  handScore?: number;
}

@Component({
  selector: 'app-teen-patti',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="teen-patti-container">
      
      <!-- Top Navigation -->
      <div class="game-header">
        <div class="header-left">
          <a routerLink="/games" class="back-link">← All Games</a>
          <h1 class="game-title">Teen Patti Royale (3-Patti) 🎴</h1>
        </div>

        <div class="header-right">
          <div class="wallet-badge">
            <span class="chip-icon">🪙</span>
            <span class="wallet-amt">₹{{ userChips().toLocaleString() }}</span>
          </div>
          <button (click)="startNewRound()" class="btn-top-action" [disabled]="roundInProgress() && !roundFinished()">
            🔄 Deal New Hand
          </button>
        </div>
      </div>

      <!-- Poker Table Arena -->
      <div class="poker-arena">
        <div class="poker-table">
          
          <!-- Table Center: Pot & Dealer Info -->
          <div class="table-center">
            <div class="pot-box">
              <span class="pot-label">TOTAL POT</span>
              <div class="pot-amount">
                <span class="chip-glow">🪙</span>
                <span>₹{{ pot().toLocaleString() }}</span>
              </div>
              <span class="boot-info">Boot: ₹{{ currentBoot }} | Stake: ₹{{ currentStake() }}</span>
            </div>

            <!-- Round Result Banner -->
            <div *ngIf="roundFinished()" class="winner-banner">
              <div class="winner-title">🏆 {{ winnerMessage() }}</div>
              <div class="winner-hand">{{ winnerHand() }}</div>
              <button (click)="startNewRound()" class="btn-next-hand">Play Next Hand ➔</button>
            </div>
          </div>

          <!-- BOT 1 (Top Center: Vikram) -->
          <div class="player-seat seat-top" [class.folded]="players[1].isFolded" [class.current-turn]="activeTurn() === 1 && !roundFinished()">
            <div class="player-card">
              <div class="avatar-box">
                <span>{{ players[1].avatar }}</span>
                <span *ngIf="activeTurn() === 1 && !roundFinished()" class="turn-dot"></span>
              </div>
              <div class="player-details">
                <span class="player-name">{{ players[1].name }}</span>
                <span class="player-chips">₹{{ players[1].chips.toLocaleString() }}</span>
                <span class="action-tag" [class.action-fold]="players[1].isFolded">{{ players[1].lastAction }}</span>
              </div>
            </div>
            <div class="cards-fan">
              <div *ngFor="let c of players[1].cards" class="card-back" [class.show-card]="roundFinished()">
                <ng-container *ngIf="roundFinished()">
                  <span class="card-val" [class.red-suit]="c.suit === '♥' || c.suit === '♦'">{{ c.label }}{{ c.suit }}</span>
                </ng-container>
                <span *ngIf="!roundFinished()">🎴</span>
              </div>
            </div>
          </div>

          <!-- BOT 2 (Left: Priya) -->
          <div class="player-seat seat-left" [class.folded]="players[2].isFolded" [class.current-turn]="activeTurn() === 2 && !roundFinished()">
            <div class="player-card">
              <div class="avatar-box">
                <span>{{ players[2].avatar }}</span>
                <span *ngIf="activeTurn() === 2 && !roundFinished()" class="turn-dot"></span>
              </div>
              <div class="player-details">
                <span class="player-name">{{ players[2].name }}</span>
                <span class="player-chips">₹{{ players[2].chips.toLocaleString() }}</span>
                <span class="action-tag" [class.action-fold]="players[2].isFolded">{{ players[2].lastAction }}</span>
              </div>
            </div>
            <div class="cards-fan">
              <div *ngFor="let c of players[2].cards" class="card-back" [class.show-card]="roundFinished()">
                <ng-container *ngIf="roundFinished()">
                  <span class="card-val" [class.red-suit]="c.suit === '♥' || c.suit === '♦'">{{ c.label }}{{ c.suit }}</span>
                </ng-container>
                <span *ngIf="!roundFinished()">🎴</span>
              </div>
            </div>
          </div>

          <!-- BOT 3 (Right: Aman) -->
          <div class="player-seat seat-right" [class.folded]="players[3].isFolded" [class.current-turn]="activeTurn() === 3 && !roundFinished()">
            <div class="player-card">
              <div class="avatar-box">
                <span>{{ players[3].avatar }}</span>
                <span *ngIf="activeTurn() === 3 && !roundFinished()" class="turn-dot"></span>
              </div>
              <div class="player-details">
                <span class="player-name">{{ players[3].name }}</span>
                <span class="player-chips">₹{{ players[3].chips.toLocaleString() }}</span>
                <span class="action-tag" [class.action-fold]="players[3].isFolded">{{ players[3].lastAction }}</span>
              </div>
            </div>
            <div class="cards-fan">
              <div *ngFor="let c of players[3].cards" class="card-back" [class.show-card]="roundFinished()">
                <ng-container *ngIf="roundFinished()">
                  <span class="card-val" [class.red-suit]="c.suit === '♥' || c.suit === '♦'">{{ c.label }}{{ c.suit }}</span>
                </ng-container>
                <span *ngIf="!roundFinished()">🎴</span>
              </div>
            </div>
          </div>

          <!-- YOU (Bottom Center: Player 0) -->
          <div class="player-seat seat-bottom" [class.folded]="players[0].isFolded" [class.current-turn]="activeTurn() === 0 && !roundFinished()">
            <div class="my-cards-wrapper">
              <div *ngFor="let c of players[0].cards" class="play-card" [class.card-revealed]="players[0].isSeen">
                <ng-container *ngIf="players[0].isSeen">
                  <div class="card-corner top-corner" [class.red-suit]="c.suit === '♥' || c.suit === '♦'">
                    <span>{{ c.label }}</span>
                    <span>{{ c.suit }}</span>
                  </div>
                  <div class="card-center-suit" [class.red-suit]="c.suit === '♥' || c.suit === '♦'">
                    {{ c.suit }}
                  </div>
                  <div class="card-corner bottom-corner" [class.red-suit]="c.suit === '♥' || c.suit === '♦'">
                    <span>{{ c.label }}</span>
                    <span>{{ c.suit }}</span>
                  </div>
                </ng-container>

                <ng-container *ngIf="!players[0].isSeen">
                  <div class="card-pattern">🎴</div>
                </ng-container>
              </div>
            </div>

            <div class="my-info-bar">
              <div class="my-meta">
                <span class="my-name">👤 You ({{ players[0].isSeen ? 'Seen' : 'Blind' }})</span>
                <span class="my-chips">₹{{ players[0].chips.toLocaleString() }}</span>
                <span *ngIf="players[0].isSeen && players[0].handRankName" class="hand-type-badge">
                  {{ players[0].handRankName }}
                </span>
              </div>

              <!-- Action Controls on Player Turn -->
              <div class="action-buttons-row" *ngIf="activeTurn() === 0 && !roundFinished() && !players[0].isFolded">
                <button *ngIf="!players[0].isSeen" (click)="seeCards()" class="btn-action btn-see">
                  👁️ See Cards
                </button>

                <button (click)="fold()" class="btn-action btn-pack">
                  ❌ Pack / Fold
                </button>

                <button (click)="playChaal(false)" class="btn-action btn-chaal">
                  🪙 {{ players[0].isSeen ? 'Chaal' : 'Blind' }} (₹{{ getBetCost(false) }})
                </button>

                <button (click)="playChaal(true)" class="btn-action btn-double">
                  ⚡ 2x Double (₹{{ getBetCost(true) }})
                </button>

                <button *ngIf="canShow()" (click)="requestShow()" class="btn-action btn-show">
                  👀 Show Cards (₹{{ getBetCost(false) }})
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- TEEN PATTI RULES & HAND RANKINGS GUIDE -->
      <section class="guide-section glass">
        <h3>🎴 Hand Rankings Guide (Highest to Lowest)</h3>
        <div class="rankings-grid">
          <div class="rank-item">
            <span class="rank-badge gold">1</span>
            <div>
              <strong>Trail / Trio / Set</strong>
              <span>Three cards of the same rank (e.g., A-A-A, K-K-K)</span>
            </div>
          </div>
          <div class="rank-item">
            <span class="rank-badge purple">2</span>
            <div>
              <strong>Pure Sequence (Straight Flush)</strong>
              <span>Three consecutive cards of the same suit (e.g., A-2-3 or K-Q-J of ♠)</span>
            </div>
          </div>
          <div class="rank-item">
            <span class="rank-badge blue">3</span>
            <div>
              <strong>Sequence (Normal Run)</strong>
              <span>Three consecutive cards not of the same suit (e.g., 9-8-7)</span>
            </div>
          </div>
          <div class="rank-item">
            <span class="rank-badge cyan">4</span>
            <div>
              <strong>Color (Flush)</strong>
              <span>Any three cards of the same suit in non-consecutive order</span>
            </div>
          </div>
          <div class="rank-item">
            <span class="rank-badge emerald">5</span>
            <div>
              <strong>Pair</strong>
              <span>Two cards of the same rank (e.g., K-K-5)</span>
            </div>
          </div>
          <div class="rank-item">
            <span class="rank-badge gray">6</span>
            <div>
              <strong>High Card</strong>
              <span>Highest card decides the winner when no combinations are formed</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .teen-patti-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1.5rem;
      font-family: inherit;
    }

    /* Header */
    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .back-link {
      font-size: 0.85rem;
      color: #a78bfa;
      text-decoration: none;
      font-weight: 700;
      margin-bottom: 0.25rem;
      display: inline-block;
    }

    .game-title {
      font-size: 1.8rem;
      font-weight: 900;
      color: var(--text-color, #fff);
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .wallet-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 1rem;
      border-radius: 99px;
      background: rgba(234, 179, 8, 0.15);
      border: 1px solid rgba(234, 179, 8, 0.35);
      font-weight: 800;
      color: #fde047;
      font-size: 0.95rem;
    }

    .btn-top-action {
      padding: 0.5rem 1.1rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #8b5cf6, #38bdf8);
      color: #fff;
      font-weight: 700;
      font-size: 0.88rem;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .btn-top-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Poker Table Arena */
    .poker-arena {
      margin-bottom: 2.5rem;
      display: flex;
      justify-content: center;
    }

    .poker-table {
      position: relative;
      width: 100%;
      max-width: 960px;
      height: 560px;
      border-radius: 200px;
      background: radial-gradient(ellipse at center, #15803d 0%, #166534 50%, #052e16 100%);
      border: 14px solid #78350f;
      box-shadow: 
        inset 0 0 40px rgba(0, 0, 0, 0.8),
        0 15px 50px rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .poker-table {
        height: 620px;
        border-radius: 100px;
        border-width: 10px;
      }
    }

    /* Table Center Pot */
    .table-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      z-index: 10;
    }

    .pot-box {
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(234, 179, 8, 0.4);
      padding: 0.8rem 1.5rem;
      border-radius: 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
    }

    .pot-label {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #94a3b8;
      display: block;
    }

    .pot-amount {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      font-size: 1.8rem;
      font-weight: 900;
      color: #fde047;
      text-shadow: 0 0 10px rgba(234, 179, 8, 0.5);
    }

    .boot-info {
      font-size: 0.75rem;
      color: #cbd5e1;
      display: block;
      margin-top: 0.2rem;
    }

    .winner-banner {
      margin-top: 0.8rem;
      background: linear-gradient(135deg, rgba(234, 179, 8, 0.95), rgba(245, 158, 11, 0.95));
      color: #000;
      padding: 0.8rem 1.5rem;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes popIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .winner-title {
      font-size: 1.1rem;
      font-weight: 900;
    }

    .winner-hand {
      font-size: 0.85rem;
      font-weight: 700;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .btn-next-hand {
      padding: 0.4rem 1rem;
      border-radius: 99px;
      background: #0f172a;
      color: #fff;
      font-weight: 800;
      font-size: 0.8rem;
      border: none;
      cursor: pointer;
    }

    /* Player Seats */
    .player-seat {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all 0.3s ease;
    }

    .player-seat.folded {
      opacity: 0.4;
      filter: grayscale(0.8);
    }

    .player-seat.current-turn .player-card {
      border-color: #fde047;
      box-shadow: 0 0 20px rgba(234, 179, 8, 0.6);
    }

    .seat-top { top: 15px; }
    .seat-left { left: 20px; top: 38%; transform: translateY(-50%); }
    .seat-right { right: 20px; top: 38%; transform: translateY(-50%); }
    .seat-bottom { bottom: 15px; }

    .player-card {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 0.4rem 0.8rem;
      border-radius: 14px;
      backdrop-filter: blur(8px);
    }

    .avatar-box {
      position: relative;
      font-size: 1.6rem;
    }

    .turn-dot {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 8px #34d399;
      animation: pulse 1s infinite;
    }

    .player-name {
      font-size: 0.82rem;
      font-weight: 800;
      color: #fff;
      display: block;
    }

    .player-chips {
      font-size: 0.75rem;
      color: #fde047;
      font-weight: 700;
      display: block;
    }

    .action-tag {
      font-size: 0.65rem;
      font-weight: 800;
      color: #a78bfa;
      text-transform: uppercase;
    }

    .action-fold {
      color: #f87171;
    }

    /* Cards Fan */
    .cards-fan {
      display: flex;
      gap: 4px;
      margin-top: 5px;
    }

    .card-back {
      width: 32px;
      height: 46px;
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    }

    .card-back.show-card {
      background: #ffffff;
      color: #000;
    }

    .card-val {
      font-size: 0.7rem;
      font-weight: 800;
    }

    .red-suit {
      color: #dc2626 !important;
    }

    /* Bottom Player (You) */
    .my-cards-wrapper {
      display: flex;
      gap: 0.6rem;
      margin-bottom: 0.6rem;
    }

    .play-card {
      position: relative;
      width: 72px;
      height: 105px;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 4px;
      user-select: none;
      transition: transform 0.2s;
    }

    .play-card:not(.card-revealed) {
      background: linear-gradient(135deg, #4338ca, #1e1b4b);
      border: 2px solid rgba(255, 255, 255, 0.4);
      align-items: center;
      justify-content: center;
    }

    .card-pattern {
      font-size: 2.2rem;
    }

    .card-corner {
      display: flex;
      flex-direction: column;
      align-items: center;
      line-height: 1;
      font-weight: 900;
      font-size: 0.85rem;
      color: #0f172a;
    }

    .bottom-corner {
      transform: rotate(180deg);
    }

    .card-center-suit {
      font-size: 1.6rem;
      text-align: center;
      color: #0f172a;
    }

    .my-info-bar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      background: rgba(15, 23, 42, 0.95);
      border: 1.5px solid rgba(255, 255, 255, 0.2);
      padding: 0.6rem 1.2rem;
      border-radius: 18px;
      backdrop-filter: blur(14px);
    }

    .my-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .my-name {
      font-size: 0.95rem;
      font-weight: 800;
      color: #fff;
    }

    .my-chips {
      font-size: 0.95rem;
      font-weight: 800;
      color: #fde047;
    }

    .hand-type-badge {
      padding: 0.15rem 0.65rem;
      border-radius: 99px;
      background: rgba(139, 92, 246, 0.3);
      border: 1px solid #8b5cf6;
      color: #c4b5fd;
      font-size: 0.75rem;
      font-weight: 800;
    }

    .action-buttons-row {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn-action {
      padding: 0.45rem 0.85rem;
      border-radius: 10px;
      font-weight: 800;
      font-size: 0.82rem;
      border: none;
      cursor: pointer;
      transition: transform 0.15s, box-shadow 0.15s;
    }

    .btn-action:hover {
      transform: translateY(-2px);
    }

    .btn-see { background: #3b82f6; color: #fff; }
    .btn-pack { background: #ef4444; color: #fff; }
    .btn-chaal { background: #22c55e; color: #000; }
    .btn-double { background: #eab308; color: #000; }
    .btn-show { background: #a855f7; color: #fff; }

    /* Guide Section */
    .guide-section {
      padding: 1.5rem;
      border-radius: 18px;
    }

    .guide-section h3 {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      margin-bottom: 1.25rem;
    }

    .rankings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }

    .rank-item {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.75rem;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
    }

    .rank-badge {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 0.85rem;
      flex-shrink: 0;
    }

    .rank-badge.gold { background: #eab308; color: #000; }
    .rank-badge.purple { background: #a855f7; color: #fff; }
    .rank-badge.blue { background: #3b82f6; color: #fff; }
    .rank-badge.cyan { background: #06b6d4; color: #000; }
    .rank-badge.emerald { background: #10b981; color: #fff; }
    .rank-badge.gray { background: #64748b; color: #fff; }

    .rank-item strong {
      display: block;
      font-size: 0.9rem;
      color: var(--text-color, #fff);
    }

    .rank-item span {
      font-size: 0.75rem;
      color: #94a3b8;
    }
  `]
})
export class TeenPattiComponent implements OnInit {
  currentBoot = 50;
  currentStake = signal<number>(50);
  pot = signal<number>(0);
  roundInProgress = signal<boolean>(false);
  roundFinished = signal<boolean>(false);
  activeTurn = signal<number>(0); // 0=You, 1=Vikram, 2=Priya, 3=Aman
  winnerMessage = signal<string>('');
  winnerHand = signal<string>('');

  players: Player[] = [
    { id: 0, name: 'You', avatar: '👤', chips: 10000, cards: [], isSeen: false, isFolded: false, isBot: false, lastAction: 'Waiting' },
    { id: 1, name: 'Vikram', avatar: '🧔', chips: 10000, cards: [], isSeen: false, isFolded: false, isBot: true, lastAction: 'Waiting' },
    { id: 2, name: 'Priya', avatar: '👩', chips: 10000, cards: [], isSeen: false, isFolded: false, isBot: true, lastAction: 'Waiting' },
    { id: 3, name: 'Aman', avatar: '🧑', chips: 10000, cards: [], isSeen: false, isFolded: false, isBot: true, lastAction: 'Waiting' }
  ];

  userChips = computed(() => this.players[0].chips);

  ngOnInit() {
    this.startNewRound();
  }

  startNewRound() {
    this.pot.set(0);
    this.currentStake.set(this.currentBoot);
    this.roundInProgress.set(true);
    this.roundFinished.set(false);
    this.winnerMessage.set('');
    this.winnerHand.set('');

    const deck = this.createShuffledDeck();

    // Reset players & deal 3 cards each
    this.players.forEach((p, idx) => {
      p.cards = [deck.pop()!, deck.pop()!, deck.pop()!];
      p.isSeen = false;
      p.isFolded = false;
      p.lastAction = 'In Game';
      
      // Deduct Boot
      const boot = Math.min(p.chips, this.currentBoot);
      p.chips -= boot;
      this.pot.update(v => v + boot);

      // Evaluate Hand
      const evaluated = this.evaluateHand(p.cards);
      p.handRankName = evaluated.rankName;
      p.handScore = evaluated.score;
    });

    this.activeTurn.set(0);
  }

  createShuffledDeck(): Card[] {
    const suits: Suit[] = ['♠', '♥', '♦', '♣'];
    const ranks: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    const labels: Record<number, string> = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' };

    const deck: Card[] = [];
    for (const s of suits) {
      for (const r of ranks) {
        deck.push({ suit: s, rank: r, label: labels[r] || r.toString() });
      }
    }

    // Fisher-Yates Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  evaluateHand(cards: Card[]): { rankName: string; score: number } {
    const sorted = [...cards].sort((a, b) => b.rank - a.rank);
    const r1 = sorted[0].rank, r2 = sorted[1].rank, r3 = sorted[2].rank;
    const isSameSuit = sorted[0].suit === sorted[1].suit && sorted[1].suit === sorted[2].suit;
    
    // Check Sequence (including A-2-3 -> 14,3,2)
    const isNormalSeq = (r1 - r2 === 1 && r2 - r3 === 1) || (r1 === 14 && r2 === 3 && r3 === 2);

    // 1. Trail / Trio
    if (r1 === r2 && r2 === r3) {
      return { rankName: `Trail of ${sorted[0].label}s (Trio)`, score: 6000000 + r1 * 1000 };
    }
    // 2. Pure Sequence
    if (isSameSuit && isNormalSeq) {
      const highRank = (r1 === 14 && r2 === 3 && r3 === 2) ? 3 : r1;
      return { rankName: 'Pure Sequence (Straight Flush)', score: 5000000 + highRank * 1000 };
    }
    // 3. Sequence / Run
    if (isNormalSeq) {
      const highRank = (r1 === 14 && r2 === 3 && r3 === 2) ? 3 : r1;
      return { rankName: 'Sequence (Straight)', score: 4000000 + highRank * 1000 };
    }
    // 4. Color / Flush
    if (isSameSuit) {
      return { rankName: 'Color (Flush)', score: 3000000 + r1 * 100 + r2 * 10 + r3 };
    }
    // 5. Pair
    if (r1 === r2 || r2 === r3 || r1 === r3) {
      const pairRank = (r1 === r2 || r1 === r3) ? r1 : r2;
      const kicker = (r1 === r2) ? r3 : ((r2 === r3) ? r1 : r2);
      return { rankName: `Pair of ${pairRank === 14 ? 'A' : (pairRank === 13 ? 'K' : (pairRank === 12 ? 'Q' : (pairRank === 11 ? 'J' : pairRank)))}s`, score: 2000000 + pairRank * 100 + kicker };
    }
    // 6. High Card
    return { rankName: `High Card (${sorted[0].label})`, score: 1000000 + r1 * 100 + r2 * 10 + r3 };
  }

  getBetCost(isDouble: boolean): number {
    const p = this.players[0];
    let stake = this.currentStake();
    if (isDouble) stake *= 2;
    return p.isSeen ? stake * 2 : stake;
  }

  seeCards() {
    this.players[0].isSeen = true;
  }

  playChaal(isDouble: boolean) {
    if (isDouble) {
      this.currentStake.update(s => s * 2);
    }
    const cost = this.getBetCost(false);
    const p = this.players[0];

    const bet = Math.min(p.chips, cost);
    p.chips -= bet;
    this.pot.update(v => v + bet);
    p.lastAction = (p.isSeen ? 'Chaal' : 'Blind') + ` ₹${bet}`;

    this.advanceTurn();
  }

  fold() {
    const p = this.players[0];
    p.isFolded = true;
    p.lastAction = 'Packed';
    this.checkActivePlayers();
    if (!this.roundFinished()) {
      this.advanceTurn();
    }
  }

  canShow(): boolean {
    const active = this.players.filter(p => !p.isFolded);
    return active.length === 2;
  }

  requestShow() {
    const cost = this.getBetCost(false);
    const p = this.players[0];
    const bet = Math.min(p.chips, cost);
    p.chips -= bet;
    this.pot.update(v => v + bet);
    p.lastAction = 'Show Request';

    this.resolveShowdown();
  }

  advanceTurn() {
    let next = (this.activeTurn() + 1) % 4;
    let loopCount = 0;
    while (this.players[next].isFolded && loopCount < 4) {
      next = (next + 1) % 4;
      loopCount++;
    }

    this.activeTurn.set(next);

    if (this.players[next].isBot && !this.roundFinished()) {
      setTimeout(() => this.executeBotTurn(next), 700);
    }
  }

  executeBotTurn(botIndex: number) {
    const bot = this.players[botIndex];
    if (bot.isFolded || this.roundFinished()) return;

    const score = bot.handScore || 0;
    const isGoodHand = score >= 2000000; // Pair or better

    // Decision logic
    if (!bot.isSeen && Math.random() > 0.6) {
      bot.isSeen = true; // Bot decides to see cards
    }

    const activePlayers = this.players.filter(p => !p.isFolded);

    // If 2 players left & high confidence -> Show
    if (activePlayers.length === 2 && isGoodHand && Math.random() > 0.4) {
      const cost = bot.isSeen ? this.currentStake() * 2 : this.currentStake();
      const bet = Math.min(bot.chips, cost);
      bot.chips -= bet;
      this.pot.update(v => v + bet);
      bot.lastAction = 'Show!';
      this.resolveShowdown();
      return;
    }

    // Fold if bad hand and high stake
    if (bot.isSeen && !isGoodHand && this.currentStake() > this.currentBoot * 2 && Math.random() > 0.4) {
      bot.isFolded = true;
      bot.lastAction = 'Packed';
      this.checkActivePlayers();
      if (!this.roundFinished()) this.advanceTurn();
      return;
    }

    // Otherwise Chaal / Blind
    const cost = bot.isSeen ? this.currentStake() * 2 : this.currentStake();
    const bet = Math.min(bot.chips, cost);
    bot.chips -= bet;
    this.pot.update(v => v + bet);
    bot.lastAction = (bot.isSeen ? 'Chaal' : 'Blind') + ` ₹${bet}`;

    this.advanceTurn();
  }

  checkActivePlayers() {
    const active = this.players.filter(p => !p.isFolded);
    if (active.length === 1) {
      const winner = active[0];
      winner.chips += this.pot();
      this.roundFinished.set(true);
      this.winnerMessage.set(`${winner.name} Wins the Pot of ₹${this.pot().toLocaleString()}!`);
      this.winnerHand.set('All other players packed');
    }
  }

  resolveShowdown() {
    const active = this.players.filter(p => !p.isFolded);
    active.sort((a, b) => (b.handScore || 0) - (a.handScore || 0));

    const winner = active[0];
    winner.chips += this.pot();
    this.roundFinished.set(true);
    this.winnerMessage.set(`${winner.name} Wins the Showdown! (₹${this.pot().toLocaleString()})`);
    this.winnerHand.set(winner.handRankName || 'High Card');
  }
}
