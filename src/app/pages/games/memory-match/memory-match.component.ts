import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface MemoryCard {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-memory-match',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="memory-container">
      
      <div class="game-header">
        <div class="header-left">
          <a routerLink="/games" class="back-link">← All Games</a>
          <h1 class="game-title">Memory Card Match 🧠</h1>
        </div>

        <div class="header-controls">
          <div class="mode-select">
            <label>Difficulty:</label>
            <select [ngModel]="difficulty()" (ngModelChange)="setDifficulty($event)">
              <option value="easy">Easy (3x4 Grid)</option>
              <option value="medium">Medium (4x4 Grid)</option>
              <option value="hard">Hard (6x6 Grid)</option>
            </select>
          </div>
          <button (click)="resetGame()" class="btn-top">🔄 Restart</button>
        </div>
      </div>

      <div class="memory-arena">
        
        <!-- Stats Bar -->
        <div class="stats-bar glass">
          <div class="stat-item">
            <span class="stat-label">MOVES</span>
            <span class="stat-val">{{ moves() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">MATCHED</span>
            <span class="stat-val text-green">{{ matchedPairs() }} / {{ totalPairs() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">TIME</span>
            <span class="stat-val">{{ formatTime(secondsElapsed()) }}</span>
          </div>
        </div>

        <!-- Cards Grid Frame -->
        <div class="cards-frame glass">
          <div class="cards-grid" [ngClass]="'grid-' + difficulty()">
            <div *ngFor="let card of cards" 
                 class="memory-card-wrap"
                 (click)="flipCard(card)">
              
              <div class="card-inner" [class.is-flipped]="card.isFlipped || card.isMatched">
                <!-- Card Back -->
                <div class="card-face card-back">
                  <span>🎮</span>
                </div>

                <!-- Card Front -->
                <div class="card-face card-front" [class.matched]="card.isMatched">
                  <span>{{ card.icon }}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Victory Modal -->
        <div *ngIf="isGameWon()" class="win-modal glass">
          <div class="win-content">
            <h2>🎉 Fantastic Memory!</h2>
            <div class="stars-row">⭐⭐⭐</div>
            <p>You matched all {{ totalPairs() }} pairs in <strong>{{ moves() }} moves</strong> and <strong>{{ formatTime(secondsElapsed()) }}</strong>!</p>
            <button (click)="resetGame()" class="btn-play-again">Play Again ➔</button>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .memory-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1.5rem;
      font-family: inherit;
    }

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

    .header-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .mode-select select {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: var(--text-color, #fff);
      padding: 0.4rem 0.75rem;
      border-radius: 10px;
      font-size: 0.85rem;
      outline: none;
    }

    .btn-top {
      padding: 0.45rem 1rem;
      border-radius: 10px;
      background: linear-gradient(135deg, #8b5cf6, #38bdf8);
      color: #fff;
      font-weight: 700;
      font-size: 0.85rem;
      border: none;
      cursor: pointer;
    }

    /* Stats Bar */
    .stats-bar {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0.75rem 1.5rem;
      border-radius: 16px;
      margin-bottom: 1.5rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-label {
      font-size: 0.7rem;
      color: #94a3b8;
      font-weight: 800;
      letter-spacing: 0.05em;
    }

    .stat-val {
      font-size: 1.25rem;
      font-weight: 900;
      color: #fff;
    }

    .text-green { color: #4ade80; }

    /* Cards Frame */
    .cards-frame {
      padding: 1.5rem;
      border-radius: 20px;
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5);
    }

    .cards-grid {
      display: grid;
      gap: 12px;
      margin: 0 auto;
    }

    .grid-easy {
      grid-template-columns: repeat(4, 1fr);
      max-width: 480px;
    }

    .grid-medium {
      grid-template-columns: repeat(4, 1fr);
      max-width: 520px;
    }

    .grid-hard {
      grid-template-columns: repeat(6, 1fr);
      max-width: 680px;
    }

    .memory-card-wrap {
      aspect-ratio: 1 / 1.1;
      perspective: 1000px;
      cursor: pointer;
      user-select: none;
    }

    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform-style: preserve-3d;
      border-radius: 14px;
    }

    .card-inner.is-flipped {
      transform: rotateY(180deg);
    }

    .card-face {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .card-back {
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      border: 2px solid rgba(139, 92, 246, 0.4);
      color: #a78bfa;
      font-size: 1.8rem;
    }

    .card-back:hover {
      border-color: #8b5cf6;
      box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
    }

    .card-front {
      background: #ffffff;
      color: #000;
      border: 2px solid #8b5cf6;
      transform: rotateY(180deg);
      font-size: clamp(1.6rem, 4vw, 2.5rem);
    }

    .card-front.matched {
      background: #ecfdf5;
      border-color: #10b981;
      animation: matchedBounce 0.3s ease;
    }

    @keyframes matchedBounce {
      0%, 100% { transform: rotateY(180deg) scale(1); }
      50% { transform: rotateY(180deg) scale(1.1); }
    }

    /* Win Modal */
    .win-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 2.5rem;
      border-radius: 24px;
      text-align: center;
      background: rgba(15, 23, 42, 0.96);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      z-index: 1000;
    }

    .win-content h2 {
      font-size: 2rem;
      font-weight: 900;
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .stars-row {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .win-content p {
      color: #94a3b8;
      margin-bottom: 1.5rem;
    }

    .btn-play-again {
      padding: 0.75rem 2rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #8b5cf6, #38bdf8);
      color: #fff;
      font-weight: 800;
      font-size: 1rem;
      border: none;
      cursor: pointer;
    }
  `]
})
export class MemoryMatchComponent implements OnInit, OnDestroy {
  cards: MemoryCard[] = [];
  difficulty = signal<'easy' | 'medium' | 'hard'>('easy');
  moves = signal<number>(0);
  matchedPairs = signal<number>(0);
  secondsElapsed = signal<number>(0);
  isGameWon = signal<boolean>(false);

  private flippedCards: MemoryCard[] = [];
  private isProcessing = false;
  private timer: any;

  private allIcons = ['🚀', '🍕', '💎', '🦄', '🎧', '🎯', '🔥', '⚡', '🏆', '🎸', '🕹️', '👑', '🌈', '🍦', '🔮', '⚽', '🚗', '🦁'];

  ngOnInit() {
    this.resetGame();
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  setDifficulty(d: 'easy' | 'medium' | 'hard') {
    this.difficulty.set(d);
    this.resetGame();
  }

  totalPairs(): number {
    if (this.difficulty() === 'easy') return 6;
    if (this.difficulty() === 'medium') return 8;
    return 18;
  }

  resetGame() {
    this.moves.set(0);
    this.matchedPairs.set(0);
    this.secondsElapsed.set(0);
    this.isGameWon.set(false);
    this.flippedCards = [];
    this.isProcessing = false;

    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.secondsElapsed.update(s => s + 1), 1000);

    const pairsCount = this.totalPairs();
    const chosenIcons = this.allIcons.slice(0, pairsCount);
    const cardDeck = [...chosenIcons, ...chosenIcons];

    // Shuffle
    for (let i = cardDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]];
    }

    this.cards = cardDeck.map((icon, idx) => ({
      id: idx,
      icon,
      isFlipped: false,
      isMatched: false
    }));
  }

  flipCard(card: MemoryCard) {
    if (this.isProcessing || card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.moves.update(m => m + 1);
      this.checkMatch();
    }
  }

  checkMatch() {
    const [c1, c2] = this.flippedCards;
    this.isProcessing = true;

    if (c1.icon === c2.icon) {
      c1.isMatched = true;
      c2.isMatched = true;
      this.matchedPairs.update(p => p + 1);
      this.flippedCards = [];
      this.isProcessing = false;

      if (this.matchedPairs() === this.totalPairs()) {
        this.isGameWon.set(true);
        if (this.timer) clearInterval(this.timer);
      }
    } else {
      setTimeout(() => {
        c1.isFlipped = false;
        c2.isFlipped = false;
        this.flippedCards = [];
        this.isProcessing = false;
      }, 700);
    }
  }

  formatTime(totalSec: number): string {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
