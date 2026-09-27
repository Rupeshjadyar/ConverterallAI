import { Component, signal, computed, ElementRef, ViewChild, OnInit, OnDestroy, inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface SubLesson {
  id: string;
  name: string;
  duration: string;
  type: 'intro-only' | 'full-flow' | 'typing-only';
  introText?: string;
  leftHandKeys?: string[];
  rightHandKeys?: string[];
  drillSequence?: string[];
  text?: string;
}

interface MainLesson {
  id: number;
  title: string;
  subLessons: SubLesson[];
}

interface KeyInfo {
  key: string;
  display: string;
  finger: string;
  width?: string;
  class?: string;
}

@Component({
  selector: 'app-typing-master',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './typing-master.component.html',
  styleUrls: ['./typing-master.component.css']
})
export class TypingMasterComponent implements OnInit, OnDestroy {
  @ViewChild('typingInput') typingInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('textDisplayArea') textDisplayAreaRef!: ElementRef<HTMLDivElement>;

  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);

  // State Machine
  lessonPhase = signal<'overview' | 'intro' | 'finger-left' | 'finger-right' | 'drill' | 'typing'>('overview');
  currentMainLesson = signal<number>(1);
  currentSubLesson: SubLesson | null = null;
  
  // Drill state
  drillIndex = 0;
  drillTimeLeft = signal<number>(300);
  progressBars: number[] = [20, 30, 40, 50, 60, 70, 80, 90, 100];
  private drillTimer: any = null;

  // Finger data
  leftFingers = [
    { id: 'L-Pinky', height: '50px' },
    { id: 'L-Ring', height: '60px' },
    { id: 'L-Middle', height: '68px' },
    { id: 'L-Index', height: '62px' },
    { id: 'Thumb', height: '40px' }
  ];
  rightFingers = [
    { id: 'Thumb', height: '40px' },
    { id: 'R-Index', height: '62px' },
    { id: 'R-Middle', height: '68px' },
    { id: 'R-Ring', height: '60px' },
    { id: 'R-Pinky', height: '50px' }
  ];

  // Lessons Data
  mainLessons: MainLesson[] = [
    {
      id: 1, title: 'The Home Row',
      subLessons: [
        { id: '1.1', name: 'Touch typing basics', duration: '3 min.', type: 'intro-only',
          introText: 'Touch typing means typing without looking at the keyboard. You will learn to place your fingers on the home row keys.'
        },
        { id: '1.2', name: 'New keys: Home row', duration: '3 - 5 min.', type: 'full-flow',
          introText: 'In this lesson you will learn the home row:\nA S D F and J K L ;',
          leftHandKeys: ['a','s','d','f'],
          rightHandKeys: ['j','k','l',';'],
          drillSequence: ['a',' ','a',' ','s',' ','s',' ','d',' ','d',' ','f',' ','f',' '],
          text: 'asdf jkl; asdf jkl; fjdk slka asdf jkl; fj dk sl a; flak dads asks fall'
        },
        { id: '1.3', name: 'Understanding results', duration: '3 min.', type: 'intro-only',
          introText: 'Great job! Your WPM (Words Per Minute) shows your typing speed. Aim for accuracy first, speed comes naturally with practice.'
        },
        { id: '1.4', name: 'Key drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'as dad flask fall salad glad ask all lad salsa alas fads flak dads falls'
        },
        { id: '1.5', name: 'Tip: Typing tests (Online)', duration: '3 min.', type: 'intro-only',
          introText: 'You can take online typing tests to measure your progress and compare with others.'
        },
        { id: '1.6', name: 'Word drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'add all ask fall flask glad lad salad alas fads dad asks dads falls flak'
        },
        { id: '1.7', name: 'Paragraph drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'ask a sad lad; fall glad; a flash flask; dad asks a fall; sad lads ask;'
        }
      ]
    },
    {
      id: 2, title: 'Keys E and I',
      subLessons: [
        { id: '2.1', name: 'New keys: E I', duration: '3 - 5 min.', type: 'full-flow',
          introText: 'In this lesson you will learn:\nE (left middle finger reaches up)\nI (right middle finger reaches up)',
          leftHandKeys: ['e'],
          rightHandKeys: ['i'],
          drillSequence: ['e',' ','e',' ','i',' ','i',' ','e','i',' ','i','e',' '],
          text: 'de ki ed ik deed kid feed like side idle seek life file slide desk silk'
        },
        { id: '2.2', name: 'Word drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'fire side true year type duty lure reside tired turkey rustle united style'
        }
      ]
    },
    {
      id: 3, title: 'Keys R and U',
      subLessons: [
        { id: '3.1', name: 'New keys: R U', duration: '3 - 5 min.', type: 'full-flow',
          introText: 'In this lesson you will learn:\nR (left index finger reaches up)\nU (right index finger reaches up)',
          leftHandKeys: ['r'],
          rightHandKeys: ['u'],
          drillSequence: ['r',' ','r',' ','u',' ','u',' ','r','u',' ','u','r',' '],
          text: 'fr ju rf uj fur red jar lure user pure rush ruler sure fire rude just true'
        },
        { id: '3.2', name: 'Word drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'fire side true year type duty lure reside tired turkey rustle united style'
        },
        { id: '3.3', name: 'Ergonomics', duration: '3 min.', type: 'intro-only',
          introText: 'Maintain a good posture. Keep your wrists straight and floating above the keyboard. Place your feet flat on the floor.'
        },
        { id: '3.4', name: 'Sentence drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'He is sure of his rule. The red jar is full. A true leader is fair.'
        },
        { id: '3.5', name: 'Paragraph drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'A user must ensure that the rules are followed. Life is full of surprises. The fire is hot and red.'
        },
        { id: '3.6', name: 'Tip: Typing games', duration: '1 min.', type: 'intro-only',
          introText: 'Typing games are a fun way to practice your skills.'
        },
        { id: '3.7', name: 'Text drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'He read the full file. The red jar is required.'
        }
      ]
    },
    {
      id: 4, title: 'Keys T and O',
      subLessons: [
        { id: '4.1', name: 'New keys: T O', duration: '3 - 5 min.', type: 'full-flow',
          introText: 'In this lesson you will learn:\nT (left index stretches across)\nO (right ring stretches across)',
          leftHandKeys: ['t'],
          rightHandKeys: ['o'],
          drillSequence: ['t',' ','t',' ','o',' ','o',' '],
          text: 'ft jy tf yj fit yet tray trust style test try tasty duty style stay city'
        },
        { id: '4.2', name: 'Word drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'too out top pot to do fort told cold fold hold mold sold gold root boot'
        },
        { id: '4.3', name: 'Sentence drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'Take the top off the pot. He told her to do it. The fort is too old.'
        },
        { id: '4.4', name: 'Tip: Progress reports', duration: '1 min.', type: 'intro-only',
          introText: 'Check your progress reports to see your typing speed and accuracy improvements.'
        },
        { id: '4.5', name: 'Paragraph drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'Today is a good day to practice typing. The quick brown fox jumps over the lazy dog.'
        },
        { id: '4.6', name: 'Text drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'To be or not to be, that is the question.'
        }
      ]
    },
    {
      id: 5, title: 'Capital letters and period',
      subLessons: [
        { id: '5.1', name: 'New keys: Shift', duration: '3 - 5 min.', type: 'full-flow',
          introText: 'In this lesson you will learn:\nShift (use the pinky of the opposite hand to type a capital letter)',
          leftHandKeys: ['ShiftLeft'],
          rightHandKeys: ['ShiftRight'],
          drillSequence: ['ShiftLeft','a',' ','ShiftRight','j',' '],
          text: 'Apple Banana Cherry Date Elderberry Fig Grape'
        },
        { id: '5.2', name: 'Word drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'John Mary London Paris Tokyo Google Microsoft Apple Amazon Angular'
        },
        { id: '5.3', name: 'New key: Period', duration: '1 - 3 min.', type: 'full-flow',
          introText: 'In this lesson you will learn:\nPeriod . (right ring finger drops down)',
          leftHandKeys: [],
          rightHandKeys: ['.'],
          drillSequence: ['.',' ','.',' '],
          text: 'end. start. stop. wait. go. yes. no.'
        },
        { id: '5.4', name: 'Sentence drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'This is a sentence. It ends with a period. Capitalize the first letter.'
        },
        { id: '5.5', name: 'Tip: Typing rhythm', duration: '1 min.', type: 'intro-only',
          introText: 'Try to maintain an even rhythm while typing. It will help you type faster and more accurately.'
        },
        { id: '5.6', name: 'Paragraph drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'This is a paragraph. It contains multiple sentences. You must use capital letters and periods.'
        },
        { id: '5.7', name: 'Text drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'A long text to practice capital letters and periods.'
        }
      ]
    },
    {
      id: 6, title: 'Keys C and comma',
      subLessons: [
        { id: '6.1', name: 'New keys: C ,', duration: '3 - 5 min.', type: 'full-flow',
          introText: 'In this lesson you will learn:\nC (left middle finger drops down)\n, (right middle finger drops down)',
          leftHandKeys: ['c'],
          rightHandKeys: [','],
          drillSequence: ['c',' ','c',' ',',',' ',',',' '],
          text: 'dc k, cd ,k cat car face clock rock deck cold call fact luck lock ice'
        },
        { id: '6.2', name: 'Word drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'can, could, come, care, clear, close, cut, copy, paste, code, color, '
        },
        { id: '6.3', name: 'Sentence drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'Come here, please. I can do it, but I need time. The car is clean, shiny and fast.'
        },
        { id: '6.4', name: 'Paragraph drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'Cats, dogs, and birds are common pets. I like coffee, tea, and milk.'
        },
        { id: '6.5', name: 'Tip: Check your posture', duration: '1 min.', type: 'intro-only',
          introText: 'Check your posture regularly. Make sure your back is straight and your feet are flat on the floor.'
        },
        { id: '6.6', name: 'Text drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'Clear the table, clean the car, and cut the grass.'
        }
      ]
    },
    {
      id: 7, title: 'Keys G H and apostrophe',
      subLessons: [
        { id: '7.1', name: 'New keys: G H', duration: '3 - 5 min.', type: 'full-flow',
          introText: 'In this lesson you will learn:\nG (left index reaches right)\nH (right index reaches left)',
          leftHandKeys: ['g'],
          rightHandKeys: ['h'],
          drillSequence: ['g',' ','g',' ','h',' ','h',' '],
          text: 'fg jh gf hj go he got had get has gave have good high girl huge glad'
        },
        { id: '7.2', name: 'New keys: \' \"', duration: '1 - 3 min.', type: 'full-flow',
          introText: 'In this lesson you will learn:\nApostrophe \' (right pinky reaches right)',
          leftHandKeys: [],
          rightHandKeys: ["'"],
          drillSequence: ["'"," ","'"," "],
          text: "it's don't can't won't haven't hasn't didn't isn't aren't"
        },
        { id: '7.3', name: 'Word drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'ghost high light night thought brought right fight might tight sight'
        },
        { id: '7.4', name: 'Sentence drill', duration: '3 - 5 min.', type: 'typing-only',
          text: "I haven't got a ghost of a chance. It's a good night for a fight."
        },
        { id: '7.5', name: 'Tip: Take breaks', duration: '1 min.', type: 'intro-only',
          introText: 'Take breaks regularly to avoid fatigue and RSI (Repetitive Strain Injury).'
        },
        { id: '7.6', name: 'Paragraph drill', duration: '3 - 5 min.', type: 'typing-only',
          text: 'He said, "I can\'t do it." She replied, "You haven\'t even tried!"'
        },
        { id: '7.7', name: 'Text drill', duration: '3 - 5 min.', type: 'typing-only',
          text: "The ghost vanished into the night. It's a high and mighty thought."
        }
      ]
    }
  ];

  // Live Metrics for typing phase
  targetText = '';
  targetChars: string[] = [];
  userInput = '';
  
  liveWPM = signal<number>(0);
  finalWPM = signal<number>(0);
  accuracy = signal<number>(100);
  rawCPM = signal<number>(0);
  errorCount = signal<number>(0);
  streak = signal<number>(0);
  bestStreak = signal<number>(0);
  timeLeft = signal<number>(60);
  elapsedSeconds = signal<number>(0);
  
  // Status Flags for typing phase
  isStarted = false;
  isFinished = signal<boolean>(false);
  startTime = 0;
  private timerInterval: any = null;
  mistakeMap: { [key: string]: number } = {};

  // Audio Context for synthetic mechanical keyboard clicks
  private audioCtx: AudioContext | null = null;
  soundMode = signal<'clicky' | 'thock' | 'typewriter' | 'mute'>('clicky');

  // Virtual Keyboard Data Structure (QWERTY layout)
  keyboardRows: KeyInfo[][] = [
    // Row 1: Number Row
    [
      { key: '`', display: '~ `', finger: 'L-Pinky' },
      { key: '1', display: '! 1', finger: 'L-Pinky' },
      { key: '2', display: '@ 2', finger: 'L-Ring' },
      { key: '3', display: '# 3', finger: 'L-Middle' },
      { key: '4', display: '$ 4', finger: 'L-Index' },
      { key: '5', display: '% 5', finger: 'L-Index' },
      { key: '6', display: '^ 6', finger: 'R-Index' },
      { key: '7', display: '& 7', finger: 'R-Index' },
      { key: '8', display: '* 8', finger: 'R-Middle' },
      { key: '9', display: '( 9', finger: 'R-Ring' },
      { key: '0', display: ') 0', finger: 'R-Pinky' },
      { key: '-', display: '_ -', finger: 'R-Pinky' },
      { key: '=', display: '+ =', finger: 'R-Pinky' },
      { key: 'Backspace', display: '? Back', finger: 'R-Pinky', width: '1.5fr', class: 'key-special' }
    ],
    // Row 2: Top Row (QWERTY)
    [
      { key: 'Tab', display: 'Tab ?', finger: 'L-Pinky', width: '1.4fr', class: 'key-special' },
      { key: 'q', display: 'Q', finger: 'L-Pinky' },
      { key: 'w', display: 'W', finger: 'L-Ring' },
      { key: 'e', display: 'E', finger: 'L-Middle' },
      { key: 'r', display: 'R', finger: 'L-Index' },
      { key: 't', display: 'T', finger: 'L-Index' },
      { key: 'y', display: 'Y', finger: 'R-Index' },
      { key: 'u', display: 'U', finger: 'R-Index' },
      { key: 'i', display: 'I', finger: 'R-Middle' },
      { key: 'o', display: 'O', finger: 'R-Ring' },
      { key: 'p', display: 'P', finger: 'R-Pinky' },
      { key: '[', display: '{ [', finger: 'R-Pinky' },
      { key: ']', display: '} ]', finger: 'R-Pinky' },
      { key: '\\\\', display: '| \\\\', finger: 'R-Pinky', width: '1fr' }
    ],
    // Row 3: Home Row (ASDF JKL;)
    [
      { key: 'CapsLock', display: 'Caps ?', finger: 'L-Pinky', width: '1.7fr', class: 'key-special' },
      { key: 'a', display: 'A', finger: 'L-Pinky' },
      { key: 's', display: 'S', finger: 'L-Ring' },
      { key: 'd', display: 'D', finger: 'L-Middle' },
      { key: 'f', display: 'F', finger: 'L-Index', class: 'home-bump' },
      { key: 'g', display: 'G', finger: 'L-Index' },
      { key: 'h', display: 'H', finger: 'R-Index' },
      { key: 'j', display: 'J', finger: 'R-Index', class: 'home-bump' },
      { key: 'k', display: 'K', finger: 'R-Middle' },
      { key: 'l', display: 'L', finger: 'R-Ring' },
      { key: ';', display: ': ;', finger: 'R-Pinky' },
      { key: "'", display: '" \' ', finger: 'R-Pinky' },
      { key: 'Enter', display: 'Enter ?', finger: 'R-Pinky', width: '1.9fr', class: 'key-special' }
    ],
    // Row 4: Bottom Row (ZXCV BNM)
    [
      { key: 'ShiftLeft', display: '? Shift', finger: 'L-Pinky', width: '2.1fr', class: 'key-special' },
      { key: 'z', display: 'Z', finger: 'L-Pinky' },
      { key: 'x', display: 'X', finger: 'L-Ring' },
      { key: 'c', display: 'C', finger: 'L-Middle' },
      { key: 'v', display: 'V', finger: 'L-Index' },
      { key: 'b', display: 'B', finger: 'L-Index' },
      { key: 'n', display: 'N', finger: 'R-Index' },
      { key: 'm', display: 'M', finger: 'R-Index' },
      { key: ',', display: '< ,', finger: 'R-Middle' },
      { key: '.', display: '> .', finger: 'R-Ring' },
      { key: '/', display: '? /', finger: 'R-Pinky' },
      { key: 'ShiftRight', display: '? Shift', finger: 'R-Pinky', width: '2.4fr', class: 'key-special' }
    ],
    // Row 5: Spacebar Row
    [
      { key: 'Ctrl', display: 'Ctrl', finger: 'L-Pinky', width: '1.3fr', class: 'key-special' },
      { key: 'Alt', display: 'Alt', finger: 'Thumb', width: '1.2fr', class: 'key-special' },
      { key: ' ', display: 'Spacebar', finger: 'Thumb', width: '6.5fr', class: 'key-spacebar' },
      { key: 'Alt', display: 'Alt', finger: 'Thumb', width: '1.2fr', class: 'key-special' },
      { key: 'Ctrl', display: 'Ctrl', finger: 'R-Pinky', width: '1.3fr', class: 'key-special' }
    ]
  ];

  activePhysicalKey = signal<string>('');

  ngOnInit() {
    this.initAudioContext();
  }

  ngOnDestroy() {
    this.stopTimer();
    this.stopDrillTimer();
    if (this.audioCtx) {
      try { this.audioCtx.close(); } catch (_) {}
    }
  }

  private initAudioContext() {
    if (!this.isBrowser) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    } catch (_) {}
  }

  playKeySound(isError = false) {
    if (!this.isBrowser || this.soundMode() === 'mute' || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    if (isError) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
      return;
    }
    const mode = this.soundMode();
    if (mode === 'clicky' || mode === 'thock' || mode === 'typewriter') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = mode === 'clicky' ? 'sine' : (mode === 'thock' ? 'triangle' : 'square');
      osc.frequency.setValueAtTime(mode === 'clicky' ? (1800 + Math.random() * 400) : (mode === 'thock' ? (280 + Math.random() * 50) : (800 + Math.random() * 200)), now);
      osc.frequency.exponentialRampToValueAtTime(mode === 'clicky' ? 400 : (mode === 'thock' ? 80 : 300), now + (mode === 'clicky' ? 0.04 : (mode === 'thock' ? 0.06 : 0.05)));
      gain.gain.setValueAtTime(mode === 'clicky' ? 0.25 : (mode === 'thock' ? 0.35 : 0.15), now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + (mode === 'clicky' ? 0.04 : (mode === 'thock' ? 0.06 : 0.05)));
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + (mode === 'clicky' ? 0.04 : (mode === 'thock' ? 0.06 : 0.05)));
    }
  }

  // --- OVERVIEW AND COURSE LOGIC ---
  selectMainLesson(id: number) {
    this.currentMainLesson.set(id);
  }

  getMainLesson(): MainLesson {
    return this.mainLessons.find(l => l.id === this.currentMainLesson()) || this.mainLessons[0];
  }

  getTotalDuration(): string {
    return '4:24 h';
  }

  getCourseProgress(): number {
    return 10;
  }

  startSubLesson(sub: SubLesson) {
    this.currentSubLesson = sub;
    if (sub.type === 'intro-only') {
      this.lessonPhase.set('intro');
    } else if (sub.type === 'full-flow') {
      this.lessonPhase.set('intro');
    } else {
      this.initTypingFromSub(sub);
      this.lessonPhase.set('typing');
    }
  }

  nextPhase() {
    const sub = this.currentSubLesson;
    if (!sub) return;
    const phase = this.lessonPhase();
    if (phase === 'intro') {
      if (sub.type === 'intro-only') {
        this.goToOverview(); return;
      }
      if (sub.leftHandKeys && sub.leftHandKeys.length > 0) {
        this.lessonPhase.set('finger-left');
      } else if (sub.rightHandKeys && sub.rightHandKeys.length > 0) {
        this.lessonPhase.set('finger-right');
      } else {
        this.startDrill();
      }
    } else if (phase === 'finger-left') {
      if (sub.rightHandKeys && sub.rightHandKeys.length > 0) {
        this.lessonPhase.set('finger-right');
      } else {
        this.startDrill();
      }
    } else if (phase === 'finger-right') {
      this.startDrill();
    } else if (phase === 'drill') {
      this.stopDrillTimer();
      this.initTypingFromSub(sub);
      this.lessonPhase.set('typing');
    }
  }

  goToOverview() {
    this.lessonPhase.set('overview');
    this.currentSubLesson = null;
    this.stopDrillTimer();
    this.stopTimer();
  }

  // --- KEYBOARD & HAND VISUALS ---
  getLeftHandLabel(): string {
    if (!this.currentSubLesson || !this.currentSubLesson.leftHandKeys) return '';
    return this.currentSubLesson.leftHandKeys.map(k => k === 'ShiftLeft' ? 'Shift' : k.toUpperCase()).join(', ');
  }

  getRightHandLabel(): string {
    if (!this.currentSubLesson || !this.currentSubLesson.rightHandKeys) return '';
    return this.currentSubLesson.rightHandKeys.map(k => {
      if (k === ';') return 'semicolon';
      if (k === 'ShiftRight') return 'Shift';
      return k.toUpperCase();
    }).join(', ');
  }

  getFingerColor(finger: string): string {
    const colors: Record<string, string> = {
      'L-Pinky': '#b879f9', 'R-Pinky': '#b879f9', // purple
      'L-Ring': '#60a5fa', 'R-Ring': '#60a5fa',   // blue
      'L-Middle': '#f43f5e', 'R-Middle': '#f43f5e', // red
      'L-Index': '#4ade80', 'R-Index': '#4ade80', // green
      'Thumb': '#fcd34d' // yellow
    };
    return colors[finger] || '#888';
  }

  getKeyClasses(k: KeyInfo): string {
    let classes = '';
    const phase = this.lessonPhase();
    const sub = this.currentSubLesson;
    
    if (sub && (phase === 'finger-left' || phase === 'finger-right' || phase === 'drill')) {
      if (sub.leftHandKeys?.includes(k.key.toLowerCase()) || sub.leftHandKeys?.includes(k.key)) {
        classes += ' key-highlighted key-' + k.finger.toLowerCase();
      }
      if (sub.rightHandKeys?.includes(k.key.toLowerCase()) || sub.rightHandKeys?.includes(k.key)) {
        classes += ' key-highlighted key-' + k.finger.toLowerCase();
      }
    }
    
    if (phase === 'drill' && sub && sub.drillSequence) {
      let expected = sub.drillSequence[this.drillIndex];
      if (expected === ' ') expected = ' ';
      if (k.key.toLowerCase() === expected || k.key === expected) {
        classes += ' key-target-active';
      }
    }
    
    if (phase === 'typing') {
       if (this.targetChars[this.userInput.length] && this.targetChars[this.userInput.length].toLowerCase() === k.key.toLowerCase()) {
           classes += ' key-target-active';
       }
    }

    if (this.activePhysicalKey() && this.activePhysicalKey().toLowerCase() === k.key.toLowerCase()) {
      classes += ' key-physical-pressed';
    }

    if (k.class) {
      classes += ' ' + k.class;
    }
    return classes;
  }
  
  getKeyColor(k: KeyInfo): string {
    const classes = this.getKeyClasses(k);
    if (classes.includes('key-highlighted') || classes.includes('key-target-active')) {
       return this.getFingerColor(k.finger);
    }
    return '';
  }

  isLeftFingerActive(fingerId: string): boolean {
    const phase = this.lessonPhase();
    const sub = this.currentSubLesson;
    if (!sub) return false;
    
    if (phase === 'finger-left') {
      return sub.leftHandKeys?.some(k => this.getFingerForKey(k) === fingerId) || false;
    } else if (phase === 'drill' || phase === 'typing') {
      const nextKey = phase === 'drill' ? sub.drillSequence?.[this.drillIndex] : this.targetChars[this.userInput.length];
      return this.getFingerForKey(nextKey || '') === fingerId;
    }
    return false;
  }

  isRightFingerActive(fingerId: string): boolean {
    const phase = this.lessonPhase();
    const sub = this.currentSubLesson;
    if (!sub) return false;
    
    if (phase === 'finger-right') {
      return sub.rightHandKeys?.some(k => this.getFingerForKey(k) === fingerId) || false;
    } else if (phase === 'drill' || phase === 'typing') {
      const nextKey = phase === 'drill' ? sub.drillSequence?.[this.drillIndex] : this.targetChars[this.userInput.length];
      return this.getFingerForKey(nextKey || '') === fingerId;
    }
    return false;
  }
  
  getFingerForKey(key: string): string {
      if (!key) return '';
      if (key === ' ') return 'Thumb';
      for (const row of this.keyboardRows) {
          for (const k of row) {
              if (k.key.toLowerCase() === key.toLowerCase() || k.key === key) return k.finger;
          }
      }
      return '';
  }

  // --- DRILL LOGIC ---
  startDrill() {
    this.drillIndex = 0;
    this.drillTimeLeft.set(300);
    this.lessonPhase.set('drill');
    if (this.isBrowser) {
        this.drillTimer = setInterval(() => {
            const current = this.drillTimeLeft();
            if (current > 0) {
                this.drillTimeLeft.set(current - 1);
            } else {
                this.nextPhase();
            }
        }, 1000);
    }
  }

  stopDrillTimer() {
    if (this.drillTimer) clearInterval(this.drillTimer);
  }

  getDrillPairs() {
    const sub = this.currentSubLesson;
    if (!sub || !sub.drillSequence) return [];
    
    const pairs = [];
    let tempPair = [];
    for (let i = 0; i < sub.drillSequence.length; i++) {
        const k = sub.drillSequence[i];
        if (k === ' ') {
            if (tempPair.length > 0) {
                pairs.push({ keys: tempPair, display: tempPair.map(t => t.toUpperCase()) });
                tempPair = [];
            }
        } else {
            tempPair.push(k);
        }
    }
    if (tempPair.length > 0) pairs.push({ keys: tempPair, display: tempPair.map(t => t.toUpperCase()) });
    return pairs.slice(0, 4);
  }

  isDrillKeyActive(key: string): boolean {
    const sub = this.currentSubLesson;
    if (!sub || !sub.drillSequence) return false;
    
    // Check if this box corresponds to the current drill index
    let expected = sub.drillSequence[this.drillIndex];
    return !!(expected && expected.toLowerCase() === key.toLowerCase());
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // --- TYPING PHASE LOGIC ---
  initTypingFromSub(sub: SubLesson) {
    this.targetText = sub.text || '';
    this.targetChars = this.targetText.split('');
    this.userInput = '';
    this.isStarted = false;
    this.isFinished.set(false);
    this.liveWPM.set(0);
    this.accuracy.set(100);
    this.errorCount.set(0);
    this.streak.set(0);
    this.bestStreak.set(0);
    this.elapsedSeconds.set(0);
    this.mistakeMap = {};
    setTimeout(() => this.focusInput(), 100);
  }

  focusInput() {
    if (this.typingInputRef && this.typingInputRef.nativeElement) {
      this.typingInputRef.nativeElement.focus();
    }
  }

  onInput() {
    if (this.isFinished()) return;
    if (!this.isStarted && this.userInput.length > 0) {
      this.isStarted = true;
      this.startTime = Date.now();
      this.startTimer();
    }

    const currentIndex = this.userInput.length - 1;
    if (currentIndex >= 0 && currentIndex < this.targetChars.length) {
      const expectedChar = this.targetChars[currentIndex];
      const typedChar = this.userInput[currentIndex];
      
      if (typedChar === expectedChar) {
        this.streak.set(this.streak() + 1);
        if (this.streak() > this.bestStreak()) {
          this.bestStreak.set(this.streak());
        }
        this.playKeySound(false);
      } else {
        this.streak.set(0);
        this.errorCount.set(this.errorCount() + 1);
        this.mistakeMap[expectedChar] = (this.mistakeMap[expectedChar] || 0) + 1;
        this.playKeySound(true);
      }
    }

    this.calculateLiveStats();
    
    if (this.userInput.length >= this.targetChars.length) {
      this.finishTyping();
    }
  }

  onKeyDown(e: KeyboardEvent) {
    this.activePhysicalKey.set(e.key);
    setTimeout(() => {
      if (this.activePhysicalKey() === e.key) {
        this.activePhysicalKey.set('');
      }
    }, 150);
  }

  @HostListener('window:keydown', ['$event'])
  onWindowKeyDown(e: KeyboardEvent) {
    const phase = this.lessonPhase();
    if (phase === 'intro' || phase === 'finger-left' || phase === 'finger-right') {
      if (e.code === 'Space') {
        e.preventDefault();
        this.nextPhase();
      }
    } else if (phase === 'drill') {
      const seq = this.currentSubLesson?.drillSequence || [];
      if (this.drillIndex < seq.length) {
        let expected = seq[this.drillIndex];
        if (expected === ' ') expected = ' ';
        const key = e.key === ' ' ? ' ' : e.key.toLowerCase();
        
        if (key === expected || (expected !== ' ' && e.key.length === 1)) {
            if (key === expected) {
               this.playKeySound();
            } else {
               this.playKeySound(true);
            }
            this.drillIndex++;
            this.activePhysicalKey.set(e.key);
            setTimeout(() => this.activePhysicalKey.set(''), 100);
            
            if (this.drillIndex >= seq.length) {
                this.nextPhase();
            }
        }
      }
    }
  }

  private startTimer() {
    if (this.isBrowser) {
      this.timerInterval = setInterval(() => {
        this.elapsedSeconds.set(Math.floor((Date.now() - this.startTime) / 1000));
        this.calculateLiveStats();
      }, 1000);
    }
  }

  private stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  private calculateLiveStats() {
    if (!this.isStarted || this.elapsedSeconds() === 0) return;
    
    const minutes = this.elapsedSeconds() / 60;
    const typedLength = this.userInput.length;
    let correctChars = 0;
    
    for (let i = 0; i < typedLength; i++) {
      if (this.userInput[i] === this.targetChars[i]) correctChars++;
    }
    
    const cpm = Math.round(correctChars / minutes);
    this.rawCPM.set(cpm);
    this.liveWPM.set(Math.round(cpm / 5));
    
    const totalTyped = typedLength;
    if (totalTyped > 0) {
      this.accuracy.set(Math.round((correctChars / totalTyped) * 100));
    }
  }

  finishTyping() {
    this.isFinished.set(true);
    this.stopTimer();
    this.calculateLiveStats();
    this.finalWPM.set(this.liveWPM());
  }

  getCharClass(index: number): string {
    if (index < this.userInput.length) {
      return this.userInput[index] === this.targetChars[index] ? 'char-correct' : 'char-wrong';
    } else if (index === this.userInput.length && !this.isFinished()) {
      return 'char-active-cursor';
    }
    return 'char-upcoming';
  }

  restartCurrent() {
    if (this.lessonPhase() === 'typing') {
        if (this.currentSubLesson) this.initTypingFromSub(this.currentSubLesson);
    }
  }
}
