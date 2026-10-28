# TypePulse — Minimalist Offline Typing Speed Test

A complete, high-performance, distraction-free typing speed test and touch-typing training platform built **100% offline with zero external dependencies**. No frameworks, no build tools, no npm, no CDNs, no Google Fonts, and no external APIs.

---

## ⚡ Zero External Dependencies Guarantee

- **Fonts**: Uses system font stacks for both UI (`system-ui, -apple-system, Segoe UI, Roboto`) and the typing display (`ui-monospace, Cascadia Code, Consolas, Menlo, monospace`).
- **Icons**: Inline SVG icons embedded directly into HTML.
- **Audio**: Keystroke clicks, vintage typewriter sounds, and error buzzes synthesized in real-time via the browser's native **Web Audio API** (`AudioContext`, oscillators, biquad bandpass filters, gain envelopes). No audio files needed.
- **Charts & Graphs**: Rendered natively on HTML5 `<canvas>` elements using vanilla JavaScript.
- **Storage**: All personal bests, historical tests, daily goals, streaks, custom configurations, and touch-typing lesson progress are stored locally on your device in `localStorage`.
- **Offline / file:// Ready**: Open `index.html` directly in any modern browser without a local web server.

---

## 📁 Folder Structure

```
typing-speed-test/
├── index.html            # Main typing speed test interface
├── README.md             # Architecture & extensibility documentation
├── PROGRESS.md           # Implementation checklist & verification log
├── /learn
│   └── index.html        # 32 touch-typing lessons, virtual keyboard & 3 mini-games
├── /stats
│   └── index.html        # Historical analytics, WPM trend charts, keyboard heatmap & JSON backup
├── /leaderboard
│   └── index.html        # Local top-20 high scores by test mode with editable nicknames
├── /settings
│   └── index.html        # 8 color themes, sound synthesizer, fonts, carets, and behavior
├── /about
│   └── index.html        # Mathematical WPM formulas, standard word definition & FAQ
└── /assets
    ├── /css
    │   ├── theme.css     # 8 color themes via CSS variables, system font stacks, animations
    │   ├── layout.css    # Header, navigation, containers, responsive breakpoints
    │   └── components.css# Caret, word tokens, live stats, result card, modal dialogs, confetti
    └── /js
        ├── storage.js    # LocalStorage manager with safe in-memory fallback
        ├── theme.js      # Theme switcher, font sizes, caret styles
        ├── sound.js      # Web Audio synthesizer (Cherry MX click, typewriter, beep, buzz, fanfare)
        ├── words.js      # 1000+ English words (Easy/Med/Hard), 300+ Hinglish words, Code snippets
        ├── quotes.js     # 60+ original curated quotes across Short, Medium, Long
        ├── engine.js     # Pure typing test engine, millisecond keystroke audits, metrics calculation
        ├── chart.js      # Vanilla canvas line graph renderer & PNG share card generator
        ├── keyboard.js   # Interactive virtual keyboard & SVG hand guidance diagram
        ├── lessons.js    # 32 structured lessons from Home Row to 75 WPM Pro certification
        ├── stats.js      # History aggregations, streak ring, heatmap analysis, export/import
        └── main.js       # Main test page UI controller, auto-scrolling, anti-cheat, confetti
```

---

## 🚀 How to Run

1. Simply double-click `index.html` or drag it into any modern web browser (Chrome, Edge, Firefox, Safari).
2. Works completely disconnected from the internet (in airplane mode or offline).
3. All relative paths (`assets/...`, `learn/...`, `stats/...`, etc.) work natively over the `file://` protocol.

---

## 🎯 Test Modes & Configurations

1. **Time Mode**: 15s, 30s, 60s, 120s, or custom duration.
2. **Words Mode**: 10, 25, 50, or 100 words.
3. **Quote Mode**: Short (<100 chars), Medium (100–250 chars), Long (250+ chars) from a pool of 66 original curated literary and technical quotes.
4. **Zen Mode**: Freeform typing with no time limit.
5. **Custom Text Mode**: Paste your own paragraphs, code, or article.
6. **Difficulty Levels**:
   - **Easy**: Most frequent 200 English words.
   - **Medium**: 1000+ standard English vocabulary.
   - **Hard**: Rare, polysyllabic, sophisticated words.
   - **Code**: Real-world JavaScript, HTML, and CSS snippets.
7. **Languages**:
   - **English**: Over 1,000 words.
   - **Hinglish**: Over 300 popular Romanized Hindi terms (*namaste, shukriya, zindagi, safar, mehnat, kamyabi...*).
8. **Toggles**:
   - `@ punctuation`: Injects commas, periods, quotes, semicolons.
   - `# numbers`: Injects numeric sequences.
   - `Stop On Error`: Requires fixing the current typo before proceeding.
   - `Hard Mode (No Backspace)`: Backspacing disabled to enforce first-try precision.

---

## 🧮 Metric Formulas Explained

- **Standard Word Definition**: 1 word = 5 characters (including spaces and punctuation).
- **Gross WPM**:
  $$\text{Gross WPM} = \frac{\text{All Typed Characters} / 5}{\text{Time in Minutes}}$$
- **Net WPM**:
  $$\text{Net WPM} = \frac{\text{Correct Characters} / 5}{\text{Time in Minutes}}$$
- **Accuracy %**:
  $$\text{Accuracy} = \frac{\text{Correct Keystrokes}}{\text{Total Physical Keystrokes}} \times 100$$
- **Consistency %**:
  $$\text{Consistency} = \max\left(0, 100 \times \left(1 - \frac{\sigma}{\mu}\right)\right)$$
  *(where $\sigma$ is the standard deviation of per-second Net WPM and $\mu$ is the mean speed).*

---

## 🎨 Color Themes

Switch between 8 handcrafted themes instantly:
1. **Dark** (Default Tokyo Night slate charcoal with lilac/cyan accents)
2. **Light** (Crisp clean paper white with indigo/slate accents)
3. **Midnight** (Deep space navy with electric sky blue accents)
4. **Forest** (Earthy evergreen moss with sage and gold accents)
5. **Sunset** (Warm dusk plum with coral and rose accents)
6. **Ocean** (Deep nautical cyan with aquatic teal accents)
7. **Retro Terminal** (Phosphor green on CRT pitch black)
8. **High Contrast** (Pure black & white with vivid yellow accents for maximum accessibility)

---

## 🎮 Learn Section & Mini Games

- **32 Structured Lessons**: From home row key pairs (F and J), middle and ring fingers, top and bottom row reaches, number row, opposite shift keys, symbol rows, to speed drills up to 75 WPM.
- **Color-Coded Finger Guidance**: Interactive QWERTY keyboard with matching SVG hands illuminating the exact finger assigned to the next required character.
- **Mini Games**:
  1. *Falling Words Destroyer*: Words drop down the arena; type and press space to destroy them before losing your 3 lives.
  2. *Speed Race vs Ghost*: Live animated race track where you race against your personal best WPM.
  3. *Precision Master*: 100% accuracy trial where every mistake docks your score.

---

## 🔧 Extensibility Guide

### Adding New Words
Open `assets/js/words.js` and add your strings to `EASY_ENGLISH`, `MEDIUM_ENGLISH`, `HARD_ENGLISH`, or `HINGLISH_WORDS`.

### Adding New Quotes
Open `assets/js/quotes.js` and append your quote object:
```javascript
{
  id: "custom_id",
  category: "short", // or "medium" or "long"
  text: "Your quote text here.",
  author: "Author Name"
}
```

### Adding New Lessons
Open `assets/js/lessons.js` and add an entry with `stage`, `title`, `keysCovered`, `text`, `targetWpm`, `targetAccuracy`, `instructions`, and `fingerTips`.

### Adding New Themes
1. In `assets/css/theme.css`, add a new `[data-theme="mytheme"]` block specifying `--bg-color`, `--bg-surface`, `--text-main`, `--primary`, etc.
2. In `assets/js/theme.js`, add `'mytheme'` to the `THEMES` array.
3. In `settings/index.html`, add your swatch to the `THEMES` palette array.

---

## 🛡️ Anti-Cheat & Browser Protections
- Native `paste` and `drag-drop` into the typing prompt are blocked.
- Window blur triggers an automatic pause and focus prompt.
- Fast typing is handled without dropping keystrokes by updating the DOM in place rather than re-rendering the whole sentence.
