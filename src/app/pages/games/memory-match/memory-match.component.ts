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
  templateUrl: './memory-match.component.html',
  styleUrls: ['./memory-match.component.css']
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
