import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type Suit = '♠' | '♥' | '♦' | '♣';
type Rank = '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

type PlayerRole = 'dealer' | 'middle' | 'non-dealer';

@Component({
  selector: 'app-teen-do-paanch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teen-do-paanch.html',
  styleUrl: './teen-do-paanch.css',
})
export class TeenDoPaanch implements OnInit {
  // Players: 0=You (5 tricks), 1=Middle (2 tricks), 2=Dealer (3 tricks)
  playerNames = ['You', 'Bot 1', 'Bot 2'];
  targets = [5, 2, 3]; // tricks each must win
  tricks = signal([0, 0, 0]);
  scores = signal([0, 0, 0]);
  hands = signal<Card[][]>([[], [], []]);
  currentTrick = signal<{ card: Card; player: number }[]>([]);
  trumpSuit = signal<Suit>('♠');
  currentLeader = signal(0);
  gamePhase = signal<'deal' | 'play' | 'result'>('deal');
  trickWinner = signal<string>('');
  roundWinner = signal<string>('');
  message = signal('Deal cards to start!');
  selectedCard = signal<Card | null>(null);

  suits: Suit[] = ['♠', '♥', '♦', '♣'];
  ranks: Rank[] = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  rankValues: Record<Rank, number> = {
    '7': 1, '8': 2, '9': 3, '10': 4,
    'J': 5, 'Q': 6, 'K': 7, 'A': 8
  };

  ngOnInit() {}

  buildDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of this.suits) {
      for (const rank of this.ranks) {
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

  deal() {
    const deck = this.shuffle(this.buildDeck());
    // Deal 5 to non-dealer (you=index 0), 5 to middle, 5 to dealer, then rest in sequence
    // 3-2-5: non-dealer gets 5, dealer gets 3, middle gets 2 initially then fill to 10 each
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
    this.message.set(`Trump is ${this.trumpSuit()}. You go first! Pick a card.`);
  }

  playCard(card: Card) {
    if (this.gamePhase() !== 'play') return;
    const trick = this.currentTrick();
    if (trick.some(t => t.player === 0)) return; // already played

    const newTrick = [...trick, { card, player: 0 }];
    const newHands = this.hands().map((h, i) => i === 0 ? h.filter(c => c !== card) : h);
    this.hands.set(newHands);
    this.currentTrick.set(newTrick);

    // Bot plays
    this.botPlay(1, newTrick, newHands, (t2, h2) => {
      this.botPlay(2, t2, h2, (t3, h3) => {
        this.hands.set(h3);
        this.resolveTrick(t3);
      });
    });
  }

  botPlay(
    botIdx: number,
    trick: { card: Card; player: number }[],
    hands: Card[][],
    callback: (t: { card: Card; player: number }[], h: Card[][]) => void
  ) {
    const hand = hands[botIdx];
    if (!hand.length) { callback(trick, hands); return; }
    // Simple: play highest card of led suit or trump
    const ledSuit = trick[0]?.card.suit;
    let playCard: Card;
    const suitCards = hand.filter(c => c.suit === ledSuit);
    if (suitCards.length) {
      playCard = suitCards.reduce((a, b) => a.value > b.value ? a : b);
    } else {
      const trumpCards = hand.filter(c => c.suit === this.trumpSuit());
      if (trumpCards.length) {
        playCard = trumpCards[0];
      } else {
        playCard = hand[0];
      }
    }
    const newHands = hands.map((h, i) => i === botIdx ? h.filter(c => c !== playCard) : h);
    callback([...trick, { card: playCard, player: botIdx }], newHands);
  }

  resolveTrick(trick: { card: Card; player: number }[]) {
    const ledSuit = trick[0].card.suit;
    const trump = this.trumpSuit();

    let winner = trick[0];
    for (const play of trick.slice(1)) {
      const w = winner.card;
      const c = play.card;
      if (w.suit !== trump && c.suit === trump) {
        winner = play;
      } else if (w.suit === c.suit && c.value > w.value) {
        winner = play;
      }
    }

    const newTricks = [...this.tricks()];
    newTricks[winner.player]++;
    this.tricks.set(newTricks);
    this.trickWinner.set(this.playerNames[winner.player]);
    this.currentTrick.set([]);
    this.currentLeader.set(winner.player);

    // Check if round over
    const handsEmpty = this.hands().every(h => h.length === 0);
    if (handsEmpty) {
      this.endRound();
    } else {
      this.message.set(`${this.playerNames[winner.player]} won the trick! Score: You=${newTricks[0]}, Bot1=${newTricks[1]}, Bot2=${newTricks[2]}`);
      // If bot leads next
      if (winner.player !== 0) {
        setTimeout(() => this.botLeadPlay(), 700);
      } else {
        this.message.set(`You lead! Pick a card. (Need ${this.targets[0]} tricks)`);
      }
    }
  }

  botLeadPlay() {
    // Bot leads - play its first card then trigger next player
    const leader = this.currentLeader();
    const hand = this.hands()[leader];
    if (!hand.length) return;
    const card = hand[0];
    const newHands = this.hands().map((h, i) => i === leader ? h.filter(c => c !== card) : h);
    const trick = [{ card, player: leader }];

    // Other bot plays
    const otherBot = leader === 1 ? 2 : 1;
    this.botPlay(otherBot, trick, newHands, (t2, h2) => {
      this.hands.set(h2);
      this.currentTrick.set(t2);
      this.message.set(`${this.playerNames[leader]} leads with ${card.rank}${card.suit}. Your turn! Pick a card.`);
    });
  }

  endRound() {
    const tricks = this.tricks();
    const newScores = this.scores().map((s, i) => s + (tricks[i] >= this.targets[i] ? 1 : 0));
    this.scores.set(newScores);

    const winners = this.playerNames.filter((_, i) => tricks[i] >= this.targets[i]);
    this.roundWinner.set(winners.join(' & '));
    this.gamePhase.set('result');
    this.message.set(`Round over! Tricks - You:${tricks[0]}/${this.targets[0]}, Bot1:${tricks[1]}/${this.targets[1]}, Bot2:${tricks[2]}/${this.targets[2]}`);
  }

  getTrickCard(playerIdx: number): Card | undefined {
    return this.currentTrick().find(t => t.player === playerIdx)?.card;
  }

  isRedSuit(suit: Suit): boolean {
    return suit === '♥' || suit === '♦';
  }
}
