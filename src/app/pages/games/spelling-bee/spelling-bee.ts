import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

const WORDS = [
  { word: 'MANGO', hint: 'A sweet tropical fruit 🥭' },
  { word: 'TIGER', hint: 'National animal of India 🐯' },
  { word: 'DIWALI', hint: 'Festival of lights 🪔' },
  { word: 'CRICKET', hint: 'India\'s favourite sport 🏏' },
  { word: 'PALACE', hint: 'Where kings and queens live 🏰' },
  { word: 'JUNGLE', hint: 'A dense forest 🌿' },
  { word: 'RUPEE', hint: 'Indian currency 💰' },
  { word: 'TEMPLE', hint: 'A place of worship ⛩️' },
  { word: 'RIVER', hint: 'Flows towards the sea 🌊' },
  { word: 'LAPTOP', hint: 'Portable computer 💻' },
  { word: 'MIRROR', hint: 'You see yourself in it 🪞' },
  { word: 'PUZZLE', hint: 'A brain teaser 🧩' },
  { word: 'GUITAR', hint: 'A string musical instrument 🎸' },
  { word: 'BANANA', hint: 'A yellow fruit 🍌' },
  { word: 'SCHOOL', hint: 'Where students learn 🏫' },
  { word: 'FLOWER', hint: 'Beautiful plant blooms 🌸' },
  { word: 'DRAGON', hint: 'Mythical fire-breathing creature 🐉' },
  { word: 'BRIDGE', hint: 'Connects two sides over water 🌉' },
  { word: 'PENCIL', hint: 'Used for writing ✏️' },
  { word: 'PARROT', hint: 'A bird that talks 🦜' },
];

@Component({
  selector: 'app-spelling-bee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spelling-bee.html',
  styleUrl: './spelling-bee.css',
})
export class SpellingBee {
  maxWrong = 6;

  currentWordObj = signal(this.pickWord());
  guessedLetters = signal<Set<string>>(new Set());
  gameState = signal<'playing' | 'won' | 'lost'>('playing');
  score = signal(0);
  streak = signal(0);

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  word = computed(() => this.currentWordObj().word);
  hint = computed(() => this.currentWordObj().hint);

  displayWord = computed(() =>
    this.word().split('').map(ch => this.guessedLetters().has(ch) ? ch : '_').join(' ')
  );

  wrongGuesses = computed(() =>
    [...this.guessedLetters()].filter(l => !this.word().includes(l))
  );

  correctGuesses = computed(() =>
    [...this.guessedLetters()].filter(l => this.word().includes(l))
  );

  isLetterGuessed(letter: string): boolean {
    return this.guessedLetters().has(letter);
  }

  isLetterWrong(letter: string): boolean {
    return this.guessedLetters().has(letter) && !this.word().includes(letter);
  }

  isLetterCorrect(letter: string): boolean {
    return this.guessedLetters().has(letter) && this.word().includes(letter);
  }

  guessLetter(letter: string) {
    if (this.gameState() !== 'playing' || this.guessedLetters().has(letter)) return;

    const newSet = new Set(this.guessedLetters());
    newSet.add(letter);
    this.guessedLetters.set(newSet);

    const wrong = [...newSet].filter(l => !this.word().includes(l));
    const allCorrect = this.word().split('').every(ch => newSet.has(ch));

    if (allCorrect) {
      this.gameState.set('won');
      this.score.update(s => s + 10 + (this.maxWrong - wrong.length) * 5);
      this.streak.update(s => s + 1);
    } else if (wrong.length >= this.maxWrong) {
      this.gameState.set('lost');
      this.streak.set(0);
    }
  }

  nextWord() {
    this.currentWordObj.set(this.pickWord());
    this.guessedLetters.set(new Set());
    this.gameState.set('playing');
  }

  pickWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }

  hangmanParts = computed(() => this.wrongGuesses().length);

  getHangmanSvg(): string {
    const parts = this.hangmanParts();
    return `${parts}`;
  }
}
