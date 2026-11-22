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
  templateUrl: './teen-patti.component.html',
  styleUrls: ['./teen-patti.component.css']
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
