# WebDev Academy — Complete Offline Frontend Development Curriculum

> **A 100% self-contained, offline-first, zero-dependency tutorial website for mastering HTML5, CSS3, and Modern Vanilla JavaScript from absolute beginner to senior frontend engineer.**

---

## 🌟 Golden Rule: 100% Offline & Zero External Dependencies

- **Zero Outside Links for Learning:** Learners never need to leave the site. All concepts, tags, methods, and terms are explained inside this site or within the built-in [HTML Reference](reference/html-tags-reference.html), [CSS Reference](reference/css-properties-reference.html), [JavaScript Standard Library Reference](reference/js-reference.html), and [A-Z Glossary](reference/glossary.html).
- **Zero CDNs:** No Google Fonts, no FontAwesome, no Bootstrap, no external icon libraries. The site uses system font stacks (`system-ui`, `-apple-system`, `Segoe UI`, `Roboto`, `Consolas`, `monospace`) and scalable inline SVG icons.
- **Zero Online APIs:** All network requests and weather/todo APIs run against self-contained in-memory mock REST engines with simulated network latency.
- **Double-Click Offline Operation:** Simply open `index.html` directly in any web browser (`file:///.../index.html`). No Node.js, npm, or local web server is required.

---

## 📂 Project Directory Structure

```text
/tutorial-site
│
├── index.html                             # Master Landing Page & Curriculum Hub
├── README.md                              # Technical Documentation & Extensibility Guide
├── PROGRESS.md                            # Complete Build Checklist (80 Pages Verified)
│
├── /getting-started                       # Absolute Zero Fundamentals
│   ├── 01-how-the-web-works.html          # Clients, Servers, DNS, HTTP/HTTPS
│   ├── 02-setup-editor-and-browser.html   # VS Code, Notepad, Browser setup
│   ├── 03-your-first-webpage.html         # Creating, saving, and launching .html files
│   └── 04-devtools-basics.html            # Elements panel, Console, Styles inspector
│
├── /html                                  # HTML5 Complete Course Track (14 Lessons)
│   ├── index.html                         # HTML Course Hub & 20-Question Final Exam
│   ├── 01-introduction-structure.html     # DOCTYPE, html, head, body, semantics
│   ├── 02-elements-attributes.html        # Opening/closing tags, void elements, core attributes
│   ├── 03-headings-paragraphs-text-formatting.html
│   ├── 04-links-and-navigation.html       # Absolute/relative paths, target, bookmarks
│   ├── 05-images-and-figures.html         # img, alt text, figure, figcaption, picture
│   ├── 06-lists.html                      # ul, ol, li, dl, dt, dd, nested lists
│   ├── 07-tables.html                     # table, thead, tbody, tr, th, td, colspan
│   ├── 08-forms-and-inputs.html           # form, input types, label, button, select
│   ├── 09-form-validation.html            # required, pattern, min/max, :valid, :invalid
│   ├── 10-semantic-html.html              # header, nav, main, section, article, aside, footer
│   ├── 11-audio-video-iframe.html         # Native media players and sandboxed iframes
│   ├── 12-meta-tags-seo.html              # viewport, charset, description, Open Graph
│   ├── 13-accessibility-aria.html         # A11y standards, ARIA roles, screen readers
│   └── 14-html-best-practices.html        # Performance, clean code, audit checklist
│
├── /css                                   # CSS3 Complete Course Track (16 Lessons)
│   ├── index.html                         # CSS Course Hub & 20-Question Final Exam
│   ├── 01-introduction-and-syntax.html    # Rules, selectors, properties, linking CSS
│   ├── 02-selectors-specificity.html      # Specificity hierarchy, cascade, inheritance
│   ├── 03-colors-units-backgrounds.html   # hex, rgb, hsl, px, rem, em, %, vh, vw, gradients
│   ├── 04-fonts-and-text.html             # System fonts, line-height, letter-spacing
│   ├── 05-box-model.html                  # Content, padding, border, margin, box-sizing
│   ├── 06-display-visibility-overflow.html# block, inline, inline-block, none, overflow
│   ├── 07-position-z-index.html           # static, relative, absolute, fixed, sticky, z-index
│   ├── 08-flexbox.html                    # flex-direction, justify-content, align-items, flex: 1
│   ├── 09-grid.html                       # grid-template-columns, fr, repeat, minmax, gap
│   ├── 10-responsive-design-media-queries.html # Mobile-first breakpoints, viewport meta
│   ├── 11-pseudo-classes-pseudo-elements.html  # :hover, :focus, :nth-child, ::before, ::after
│   ├── 12-transitions-transforms.html     # transition, transform: translate, rotate, scale
│   ├── 13-animations-keyframes.html       # @keyframes, animation-duration, timing
│   ├── 14-css-variables-calc-clamp.html   # --custom-props, var(), calc(), clamp()
│   ├── 15-modern-layout-patterns.html     # Sticky footer, Holy Grail, card grids
│   └── 16-css-best-practices-organization.html # BEM methodology, architecture
│
├── /javascript                            # Vanilla JavaScript Track (22 Lessons)
│   ├── index.html                         # JS Course Hub & 20-Question Final Exam
│   ├── 01-introduction-console.html       # JS runtime, script tags, console methods
│   ├── 02-variables-data-types.html       # let, const, var, primitives vs references
│   ├── 03-operators-type-conversion.html  # Arithmetic, strict equality ===, coercion
│   ├── 04-conditions.html                 # if-else, ternary operator, switch-case
│   ├── 05-loops.html                      # for, while, do-while, for...of, for...in
│   ├── 06-functions.html                  # Declarations, expressions, arrows, callbacks
│   ├── 07-scope-hoisting-closures.html    # Lexical scope, execution context, closures
│   ├── 08-arrays-and-array-methods.html   # map, filter, reduce, find, slice, splice
│   ├── 09-objects-and-this.html           # Literals, methods, this binding, prototypes
│   ├── 10-strings-numbers-math-date.html  # Template literals, Math object, Date timing
│   ├── 11-dom-selecting-changing.html     # querySelector, textContent, innerHTML, style
│   ├── 12-dom-creating-removing.html      # createElement, appendChild, remove
│   ├── 13-events-and-event-delegation.html# addEventListener, bubbling, delegation
│   ├── 14-forms-with-javascript.html      # submit event, preventDefault, live validation
│   ├── 15-es6-destructuring-spread-modules.html # Destructuring, spread/rest, modules
│   ├── 16-classes-and-oop.html            # Classes, constructors, extends, super, static
│   ├── 17-error-handling.html             # try...catch...finally, throw, custom errors
│   ├── 18-promises-async-await.html       # Event Loop, microtasks, Promises, async/await
│   ├── 19-fetch-api-and-json.html         # JSON parsing, HTTP verbs, response.ok
│   ├── 20-localstorage-sessionstorage.html# Web Storage API, quota handling, cross-tab
│   ├── 21-regex-basics.html               # RegExp, character classes, quantifiers, test
│   └── 22-debugging-and-best-practices.html # DevTools breakpoints, debounce, throttle
│
├── /reference                             # Built-in Technical Reference
│   ├── html-tags-reference.html           # All standard HTML5 tags with syntax and live test
│   ├── css-properties-reference.html      # Complete CSS3 property catalog with values
│   ├── js-reference.html                  # Standard library (Array, String, Object, Math, DOM)
│   ├── glossary.html                      # Complete A-Z Technical Dictionary with search
│   ├── cheatsheets.html                   # High-density printable reference cards
│   └── colors-and-entities.html           # Web colors palette & HTML character entities
│
├── /practice                              # Practice & Career Prep
│   ├── index.html                         # Filterable coding challenges with hidden solutions
│   ├── interview-questions.html           # 50+ detailed frontend interview questions & answers
│   └── typing-test.html                   # Developer Speed Typing Test (Live WPM, Accuracy, Code Snippets)
│
├── /projects                              # 9 Guided Step-by-Step Builds
│   ├── index.html                         # Project showcase hub with difficulty tiers
│   ├── 01-personal-portfolio.html         # Responsive Developer Portfolio
│   ├── 02-responsive-landing-page.html    # SaaS Product Landing Page with FAQ Accordion
│   ├── 03-todo-app.html                   # Task Manager with LocalStorage & Filtering
│   ├── 04-calculator.html                 # Interactive Scientific/Standard Calculator
│   ├── 05-quiz-app.html                   # Timed Quiz Application with Score Review
│   ├── 06-digital-clock-stopwatch.html    # Precision Digital Clock & Lap Stopwatch
│   ├── 07-image-gallery-lightbox.html     # Filterable Thumbnail Gallery & Modal Lightbox
│   ├── 08-weather-app-mock-data.html      # Multi-City Weather Dashboard (Mock API)
│   └── 09-expense-tracker.html            # Personal Budget & Expense Tracker
│
├── /playground                            # Live Triple-Pane Development IDE
│   └── index.html                         # HTML, CSS, JS panes, live iframe preview, console logger, export/import
│
├── /certificate                           # Graduation & Credential Generator
│   └── index.html                         # Printable, customized official Certificate of Completion
│
└── /assets
    ├── /css
    │   ├── theme.css                      # Design tokens, CSS variables, dark/light themes, ultra-slim 4px scrollbars
    │   ├── layout.css                     # 3-column responsive layout, sticky 260px sidebar, full height stretch
    │   └── components.css                 # Callout boxes, try-it editor cards, quiz UI, progress bars
    └── /js
        ├── highlighter.js                 # Zero-dependency regex syntax highlighter
        ├── editor.js                      # Sandboxed live runner engine (iframe.srcdoc)
        ├── quiz.js                        # Instant score calculation, feedback, and storage
        ├── progress.js                    # Completion tracking and localStorage progress sync
        ├── theme.js                       # Dark/Light toggle, English/Hinglish toggle, font scaling, notes
        ├── search-index.js                # Offline master search dictionary
        ├── search.js                      # Fuzzy search modal engine with keyboard shortcuts
        └── main.js                        # Shared shell injector (Navbar, Sidebar, TOC, Footer)
```

---

## 🚀 How to Run the Website (100% Offline)

1. Open your file explorer and navigate to `/tutorial-site`.
2. Double-click **`index.html`** to launch it in any modern browser (Chrome, Edge, Firefox, Safari, Brave, Opera).
3. The site runs completely from the `file:///` protocol without needing internet connectivity, servers, Node.js, or package managers.

---

## 🛠️ How to Add a New Lesson

Every lesson page shares a unified, semantic HTML shell. To add a new lesson:

1. Duplicate an existing lesson template (e.g. `tutorial-site/html/01-introduction-structure.html`).
2. Update the `<meta name="root-path" content="../">` tag based on directory depth.
3. Set the `data-course` and `data-current-lesson` attributes on the `<body>` tag:
   ```html
   <body data-course="javascript" data-current-lesson="23-new-topic.html">
   ```
4. Fill in the lesson content:
   - **Lesson Header:** Title, difficulty badge, and reading time.
   - **"What You Will Learn" box:** `<div class="callout callout-learn">`.
   - **Real-Life Analogy box:** `<div class="callout callout-analogy">`.
   - **Syntax-Highlighted Code Blocks:** `<pre class="code-block" data-lang="javascript"><code>...</code></pre>`.
   - **Interactive Try-It Sandbox:** Add an editor container using `<div class="try-it-container" id="editor-unique-id">`.
   - **Common Mistakes & Pro Tips:** `<div class="callout callout-mistake">` and `<div class="callout callout-tip">`.
   - **5-Question MCQ Quiz:** `<div class="quiz-container" id="quiz-unique-id">`.
   - **Navigation Buttons:** `<a href="prev.html" class="nav-btn prev-btn">` and `<a href="next.html" class="nav-btn next-btn">`.
5. Register the new lesson in `tutorial-site/assets/js/main.js` under the appropriate course object so it renders in the left navigation sidebar.

---

## ❓ How to Add an Interactive Quiz

Quizzes work instantly without external libraries. Place quiz markup anywhere on a page:

```html
<div class="quiz-container" id="quiz-sample">
  <div class="quiz-question-card" data-q="0">
    <p class="quiz-q-text">1. What does the display: flex property do?</p>
    <div class="quiz-options">
      <!-- Incorrect Option -->
      <button class="quiz-btn" onclick="checkAnswer(this, false, 'display: grid creates a grid layout, not flexbox.')">Creates a 2D grid</button>
      
      <!-- Correct Option -->
      <button class="quiz-btn" onclick="checkAnswer(this, true, 'Correct! display: flex turns an element into a flex container.')">Establishes a 1D flexbox formatting context</button>
    </div>
  </div>
</div>
```

The built-in engine in `assets/js/quiz.js` will automatically handle feedback styling, explanation display, scoring, and `localStorage` score persistence.

---

## 🔍 How to Update the Master Search Index

To make a new page or concept discoverable via the global offline search modal (press `/` key anywhere):

1. Open `tutorial-site/assets/js/search-index.js`.
2. Append a new object to the `window.SEARCH_INDEX` array:
   ```javascript
   {
     title: "Your Topic Title",
     course: "Course Name",
     url: "relative/path/to/page.html",
     keywords: ["keyword1", "keyword2", "synonym"],
     excerpt: "Brief 1-2 sentence description shown in search results."
   }
   ```
3. Save the file. The search modal will immediately index the new page across the entire offline site.

---

## 📊 Summary of Final Verification & Deliverables

- **Total Built Pages:** 80 standalone, fully populated HTML pages.
- **External Dependencies:** **0 (Zero)**. No CDNs, no external web fonts, no external icon packs, no npm modules.
- **External Learning Links:** **0 (Zero)**. No links to W3Schools, MDN, YouTube, Stack Overflow, or GeeksforGeeks.
- **Custom UI Features:**
  - Left sidebar width: **260px**, custom ultra-slim **4px** rounded scrollbar (`::-webkit-scrollbar { width: 4px; }`).
  - Layout height stretches down to the bottom of the page seamlessly (`min-height: calc(100vh - var(--nav-height))`).
  - Dark/Light mode variable swapping with `localStorage` persistence.
  - English/Hinglish dual text toggle for key educational explanations.
  - Interactive sandboxed "Try it Yourself" runners on every lesson.
  - Triple-pane live Web Playground with project export (`.html`) and import.
  - Customized, printable official Certificate of Completion.

---
*Built with care for learners worldwide — Learn by doing, 100% offline.*
