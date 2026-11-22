import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

@Component({
  selector: 'app-teen-do-paanch',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './teen-do-paanch.html',
  styleUrl: './teen-do-paanch.css',
})
export class TeenDoPaanch implements OnInit, OnDestroy {
  playerNames = ['Guest (You)', 'Emma (Bot)', 'Kinsley (Bot)'];
  targets = [5, 2, 3]; // tricks required: You=5, Middle=2, Dealer=3
  tricks = signal<number[]>([0, 0, 0]);
  scores = signal<number[]>([0, 0, 0]);
  hands = signal<Card[][]>([[], [], []]);
  currentTrick = signal<{ card: Card; player: number }[]>([]);
  trumpSuit = signal<Suit>('♠');
  currentLeader = signal<number>(0);
  gamePhase = signal<'deal' | 'play' | 'result'>('deal');
  trickWinner = signal<string>('');
  roundWinner = signal<string>('');
  message = signal<string>('Deal cards to start!');

  // Local game state
  playerChips = 9500;
  currentPot = 1500;
  currentRound = 1;
  isMuted = false;

  private roundTimer?: ReturnType<typeof setTimeout>;
  private audioCtx: AudioContext | null = null;

  suits: Suit[] = ['♠', '♥', '♦', '♣'];
  ranks: Rank[] = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  rankValues: Record<Rank, number> = {
    '7': 1, '8': 2, '9': 3, '10': 4,
    'J': 5, 'Q': 6, 'K': 7, 'A': 8
  };

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedChips = localStorage.getItem('tdp_chips');
      if (savedChips) {
        this.playerChips = parseInt(savedChips, 10) || 9500;
      }
    }

  }

  ngOnDestroy(): void {
    clearTimeout(this.roundTimer);
    if (this.audioCtx) void this.audioCtx.close().catch(() => {});
  }

  isRedSuit(suit: Suit): boolean {
    return suit === '♥' || suit === '♦';
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
  }

  tipHostess(): void {
    if (this.playerChips >= 100) {
      this.playerChips -= 100;
      this.currentPot += 100;
      this.playSound('chip');
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('tdp_chips', this.playerChips.toString());
      }
    }
  }

  // 3-2-5 Deck & Gameplay Logic
  buildDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of this.suits) {
      for (const rank of this.ranks) {
        // In 3-2-5, only ♠7 and ♥7 are included to make 30 cards total
        if (rank === '7' && (suit === '♦' || suit === '♣')) continue;
        deck.push({ suit, rank, value: this.rankValues[rank] });
      }
    }
    return deck;
  }

  shuffle(deck: Card[]): Card[] {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  deal(): void {
    clearTimeout(this.roundTimer);
    this.initAudioContext();
    this.playSound('cardPlay');
    const deck = this.shuffle(this.buildDeck());

    const hands: Card[][] = [
      deck.slice(0, 10),
      deck.slice(10, 20),
      deck.slice(20, 30),
    ];
    this.hands.set(hands);
    this.tricks.set([0, 0, 0]);
    this.currentTrick.set([]);
    this.trumpSuit.set(this.suits[Math.floor(Math.random() * 4)]);
    this.currentLeader.set(0);
    this.gamePhase.set('play');
    this.trickWinner.set('');
    this.roundWinner.set('');
    this.message.set(`Trump is ${this.trumpSuit()}. Your turn! Select a card.`);
  }

  playCard(card: Card): void {
    if (this.gamePhase() !== 'play') return;
    const trick = this.currentTrick();
    if (trick.some(t => t.player === 0)) return;

    this.playSound('cardPlay');
    const newTrick = [...trick, { card, player: 0 }];
    const newHands = this.hands().map((h, i) => i === 0 ? h.filter(c => c !== card) : h);
    this.hands.set(newHands);
    this.currentTrick.set(newTrick);


    // Bot Auto Play for Seat 1 & Seat 2
    this.botPlay(1, newTrick, newHands, (t2, h2) => {
      this.botPlay(2, t2, h2, (t3, h3) => {
        this.hands.set(h3);
        this.resolveTrick(t3);
      });
    });
  }

  private botPlay(playerIndex: number, currentTrick: { card: Card; player: number }[], currentHands: Card[][], callback: (t: any[], h: Card[][]) => void): void {
    this.roundTimer = setTimeout(() => {
      const hand = currentHands[playerIndex];
      if (hand.length === 0) {
        callback(currentTrick, currentHands);
        return;
      }

      // Basic Suit Following / Trump Card Choice
      let chosenCard = hand[0];
      if (currentTrick.length > 0) {
        const leadSuit = currentTrick[0].card.suit;
        const matchingSuitCards = hand.filter(c => c.suit === leadSuit);
        if (matchingSuitCards.length > 0) {
          chosenCard = matchingSuitCards[Math.floor(Math.random() * matchingSuitCards.length)];
        } else {
          const trumpCards = hand.filter(c => c.suit === this.trumpSuit());
          if (trumpCards.length > 0) {
            chosenCard = trumpCards[0];
          } else {
            chosenCard = hand[Math.floor(Math.random() * hand.length)];
          }
        }
      }

      this.playSound('cardPlay');
      const updatedTrick = [...currentTrick, { card: chosenCard, player: playerIndex }];
      const updatedHands = currentHands.map((h, i) => i === playerIndex ? h.filter(c => c !== chosenCard) : h);

      callback(updatedTrick, updatedHands);
    }, 400);
  }

  private resolveTrick(trick: { card: Card; player: number }[]): void {
    if (trick.length < 3) return;

    const leadSuit = trick[0].card.suit;
    let winningItem = trick[0];

    for (let i = 1; i < trick.length; i++) {
      const item = trick[i];
      const winIsTrump = winningItem.card.suit === this.trumpSuit();
      const itemIsTrump = item.card.suit === this.trumpSuit();

      if (itemIsTrump && !winIsTrump) {
        winningItem = item;
      } else if (itemIsTrump && winIsTrump) {
        if (item.card.value > winningItem.card.value) {
          winningItem = item;
        }
      } else if (!winIsTrump && item.card.suit === leadSuit) {
        if (item.card.value > winningItem.card.value) {
          winningItem = item;
        }
      }
    }

    const winnerIndex = winningItem.player;
    const newTricks = [...this.tricks()];
    newTricks[winnerIndex]++;
    this.tricks.set(newTricks);
    this.trickWinner.set(this.playerNames[winnerIndex]);

    this.roundTimer = setTimeout(() => {
      this.currentTrick.set([]);
      this.trickWinner.set('');

      if (this.hands()[0].length === 0) {
        this.gamePhase.set('result');
        this.playSound('win');
        this.playerChips += 500;
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('tdp_chips', this.playerChips.toString());
        }
      }
    }, 1200);
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

  private playSound(type: 'cardPlay' | 'chip' | 'win'): void {
    if (this.isMuted || !this.audioCtx) return;
    try {
      const ctx = this.audioCtx;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'cardPlay') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
      } else if (type === 'chip') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
      } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.1);
        osc.frequency.setValueAtTime(784, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
      }
    } catch (e) {}
  }
}
