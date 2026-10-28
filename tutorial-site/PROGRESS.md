# WebDev Academy — Master Build Progress Checklist

This master checklist tracks the development of the 100% offline, zero-dependency HTML/CSS/JavaScript tutorial website.

---

## Batch 1: Shared Assets & Core Engines
- [x] `assets/css/theme.css` — Design tokens, light/dark themes, course color palettes
- [x] `assets/css/layout.css` — Grid/flex layouts, sticky navbar, sidebar, table of contents, responsive media queries
- [x] `assets/css/components.css` — Callouts, quizzes, try-it editor, badges, progress bars, exercises, modals
- [x] `assets/js/highlighter.js` — Vanilla regex-based syntax highlighter (HTML, CSS, JS)
- [x] `assets/js/editor.js` — Offline `iframe.srcdoc` live playground & try-it runner
- [x] `assets/js/quiz.js` — Interactive MCQ quiz system with explanations and score persistence
- [x] `assets/js/progress.js` — LocalStorage progress tracker, completion checkmarks, resume state
- [x] `assets/js/theme.js` — Dark mode, font scaling, English/Hinglish bilingual toggle, bookmarks, notes
- [x] `assets/js/search-index.js` — Complete offline search directory of all topics, tags, and lessons
- [x] `assets/js/search.js` — Fast client-side modal search with keyboard navigation (`/`)
- [x] `assets/js/main.js` — Dynamic header, sidebar, footer injection & automatic page wiring

---

## Batch 2: Home Page & Getting Started Course
- [x] `index.html` — Homepage with overall curriculum roadmap, learning stats, and continue prompt
- [x] `getting-started/01-how-the-web-works.html` — Servers, clients, HTTP, DNS, and IP addresses
- [x] `getting-started/02-setup-editor-and-browser.html` — VS Code/Notepad, browser setup, folder habits
- [x] `getting-started/03-your-first-webpage.html` — Building, saving, and double-clicking your first file
- [x] `getting-started/04-devtools-basics.html` — Elements panel, Console tab, inspecting styles live

---

## Batch 3: HTML5 Deep Dive (Complete Course)
- [x] `html/index.html` — HTML course hub, curriculum outline, certificate link, final exam
- [x] `html/01-introduction-structure.html` — Anatomy of an HTML document, DOCTYPE, head, body
- [x] `html/02-elements-attributes.html` — Tags vs elements, void elements, core attributes (id, class, title)
- [x] `html/03-headings-paragraphs-text-formatting.html` — h1-h6 hierarchy, p, strong, em, mark, code, blockquote
- [x] `html/04-links-and-navigation.html` — `<a>`, href, targets, relative vs absolute paths, anchor jumps
- [x] `html/05-images-and-figures.html` — `<img>`, src, alt, width/height, `<figure>`, `<figcaption>`
- [x] `html/06-lists.html` — Ordered (`<ol>`), unordered (`<ul>`), description lists (`<dl>`, `<dt>`, `<dd>`)
- [x] `html/07-tables.html` — `<table>`, `thead`, `tbody`, `tr`, `th`, `td`, colspan, rowspan
- [x] `html/08-forms-and-inputs.html` — `<form>`, input types, labels, buttons, textarea, select
- [x] `html/09-form-validation.html` — Required, min/max, pattern regex, constraint validation API
- [x] `html/10-semantic-html.html` — Header, nav, main, article, section, aside, footer benefits
- [x] `html/11-audio-video-iframe.html` — Multimedia tags, controls, sources, embed security with sandboxing
- [x] `html/12-meta-tags-seo.html` — Viewport, charset, Open Graph, description, SEO principles
- [x] `html/13-accessibility-aria.html` — Screen readers, semantic roles, aria-labels, keyboard navigation
- [x] `html/14-html-best-practices.html` — Clean structure, doctype rules, closing tags, maintainability

---

## Batch 4: Modern CSS3 Deep Dive (Complete Course)
- [x] `css/index.html` — CSS course hub, visual roadmap, final exam
- [x] `css/01-introduction-and-syntax.html` — Inline, internal, external CSS, selectors, declarations
- [x] `css/02-selectors-specificity.html` — Classes, IDs, attributes, combinators, specificity hierarchy
- [x] `css/03-colors-units-backgrounds.html` — Hex, RGB, HSL, px, rem, em, %, vh/vw, gradients
- [x] `css/04-fonts-and-text.html` — Typography, font-family, line-height, text-align, letter-spacing
- [x] `css/05-box-model.html` — Content, padding, border, margin, box-sizing: border-box
- [x] `css/06-display-visibility-overflow.html` — Block, inline, inline-block, none vs hidden, overflow handling
- [x] `css/07-position-z-index.html` — Static, relative, absolute, fixed, sticky, stacking context
- [x] `css/08-flexbox.html` — Main/cross axis, justify-content, align-items, flex-grow, flex-shrink
- [x] `css/09-grid.html` — Grid-template-columns, fr units, minmax, grid-template-areas, auto-fit
- [x] `css/10-responsive-design-media-queries.html` — Mobile-first design, breakpoints, responsive media
- [x] `css/11-pseudo-classes-pseudo-elements.html` — :hover, :focus, :nth-child, ::before, ::after
- [x] `css/12-transitions-transforms.html` — Transition duration/timing, translate, rotate, scale
- [x] `css/13-animations-keyframes.html` — @keyframes, animation-fill-mode, iteration, realistic motion
- [x] `css/14-css-variables-calc-clamp.html` — Custom properties, dynamic theming, calc(), clamp(), min(), max()
- [x] `css/15-modern-layout-patterns.html` — Holy Grail, responsive card grid, centered hero, sticky footer
- [x] `css/16-css-best-practices-organization.html` — BEM naming, utility classes, reset vs normalize

---

## Batch 5: Vanilla JavaScript Deep Dive (Complete Course)
- [x] `javascript/index.html` — JavaScript course hub, curriculum map, final exam
- [x] `javascript/01-introduction-console.html` — What is JS, script tags, console.log, debugging
- [x] `javascript/02-variables-data-types.html` — let, const, var, primitive vs reference types
- [x] `javascript/03-operators-type-conversion.html` — Arithmetic, comparison, strict equality, coercion
- [x] `javascript/04-conditions.html` — if-else, ternary operator, switch-case, truthy/falsy
- [x] `javascript/05-loops.html` — for, while, do-while, for...of, for...in, break, continue
- [x] `javascript/06-functions.html` — Declarations, expressions, arrow functions, default parameters, return
- [x] `javascript/07-scope-hoisting-closures.html` — Global, block, function scope, lexical environment, closures
- [x] `javascript/08-arrays-and-array-methods.html` — push, pop, slice, splice, map, filter, reduce, find
- [x] `javascript/09-objects-and-this.html` — Object literals, methods, dot vs bracket, this keyword binding
- [x] `javascript/10-strings-numbers-math-date.html` — String methods, template literals, Math object, Date handling
- [x] `javascript/11-dom-selecting-changing.html` — querySelector, getElementById, innerHTML, textContent, style
- [x] `javascript/12-dom-creating-removing.html` — createElement, appendChild, insertAdjacentHTML, remove
- [x] `javascript/13-events-and-event-delegation.html` — addEventListener, event object, bubbling, delegation
- [x] `javascript/14-forms-with-javascript.html` — submit events, preventDefault, reading inputs, live feedback
- [x] `javascript/15-es6-destructuring-spread-modules.html` — Destructuring, rest/spread, optional chaining
- [x] `javascript/16-classes-and-oop.html` — Constructor, methods, inheritance (extends, super), static
- [x] `javascript/17-error-handling.html` — try...catch...finally, throw, custom errors, debugging
- [x] `javascript/18-promises-async-await.html` — Asynchronous JS, event loop, Promise chaining, async/await
- [x] `javascript/19-fetch-api-and-json.html` — JSON.stringify, JSON.parse, fetch patterns, handling responses
- [x] `javascript/20-localstorage-sessionstorage.html` — setItem, getItem, removeItem, state persistence
- [x] `javascript/21-regex-basics.html` — RegExp patterns, test, match, replace, validation use cases
- [x] `javascript/22-debugging-and-best-practices.html` — Breakpoints, memory leaks, clean code conventions

---

## Batch 6: In-Depth Reference & Cheatsheets
- [x] `reference/html-tags-reference.html` — Encyclopedic HTML tag reference with inline examples & live test
- [x] `reference/css-properties-reference.html` — CSS property directory with syntax, values, and visual demos
- [x] `reference/js-reference.html` — JavaScript standard library reference (Array, String, Object, Math, DOM)
- [x] `reference/glossary.html` — Comprehensive A-Z terminology glossary with cross-links
- [x] `reference/cheatsheets.html` — High-density, printable HTML, CSS, and JS cheat sheets
- [x] `reference/colors-and-entities.html` — Named CSS colors, hex/rgb palettes, and HTML entity codes

---

## Batch 7: Practice Challenges & Interview Prep
- [x] `practice/index.html` — Filterable coding challenges (Easy, Medium, Hard) with hints and solutions
- [x] `practice/interview-questions.html` — 50+ detailed frontend interview questions and answers
- [x] `practice/typing-test.html` — Interactive Developer Speed Typing Test (Live WPM, Accuracy, JS/HTML/CSS code snippets, Timer, History)

---

## Batch 8: Step-by-Step Guided Projects
- [x] `projects/index.html` — Project showcase hub with difficulty tiers and skills breakdown
- [x] `projects/01-personal-portfolio.html` — Modern responsive portfolio with dark theme and contact form
- [x] `projects/02-responsive-landing-page.html` — High-converting product landing page with mobile menu
- [x] `projects/03-todo-app.html` — Full CRUD Todo app with filtering and localStorage sync
- [x] `projects/04-calculator.html` — Clean scientific/standard UI calculator with keyboard support
- [x] `projects/05-quiz-app.html` — Timed quiz application with score review and animated transitions
- [x] `projects/06-digital-clock-stopwatch.html` — Accurate multi-mode stopwatch with lap timer
- [x] `projects/07-image-gallery-lightbox.html` — Filterable image grid with modal lightbox & keyboard nav
- [x] `projects/08-weather-app-mock-data.html` — Realistic weather dashboard using self-contained mock JSON
- [x] `projects/09-expense-tracker.html` — Budget and expense tracker with history, balance, and chart

---

## Batch 9: Interactive Playground, Certificate Generator & Search Index
- [x] `playground/index.html` — Triple-pane live IDE (HTML, CSS, JS) with live preview, export & import
- [x] `certificate/index.html` — Printable, customized Certificate of Completion
- [x] `assets/js/search-index.js` — Complete search dictionary across all topics

---

## Batch 10: Quality Assurance & Documentation
- [x] Verification of 100% offline links (zero external CDNs or outside resources)
- [x] Verification of all Try-It live editors and quiz engines
- [x] Dark/Light mode and bilingual toggle validation
- [x] `README.md` — Guide for teachers, students, and offline deployment

---

## Batch 11: SQL & Relational Database Systems Track (Complete Course)
- [x] `sql/index.html` — SQL Course Hub, 4-Stage Roadmap, 20-Question Certification Exam
- [x] `sql/01-database-fundamentals-rdbms.html` — RDBMS, Tables, Primary/Foreign Keys, Codd's 12 Rules
- [x] `sql/02-ddl-create-alter-drop.html` — CREATE, ALTER, DROP, TRUNCATE vs DELETE, Constraints
- [x] `sql/03-dml-insert-update-delete.html` — Safe DML, WHERE filtering, ON CONFLICT UPSERT
- [x] `sql/04-dql-select-where-operators.html` — Logical Query Execution Order (FROM to SELECT), Filtering
- [x] `sql/05-aggregations-group-by-having.html` — COUNT, SUM, AVG, GROUP BY, HAVING vs WHERE
- [x] `sql/06-joins-in-depth.html` — INNER, LEFT, RIGHT, FULL, CROSS & SELF JOINs in depth
- [x] `sql/07-subqueries-and-ctes.html` — Correlated Subqueries, EXISTS vs IN, CTEs (WITH clause), Recursive CTEs
- [x] `sql/08-window-functions.html` — OVER, PARTITION BY, ROW_NUMBER, RANK, DENSE_RANK, LEAD & LAG
- [x] `sql/09-indexing-and-performance.html` — B-Tree indexes, Clustered vs Non-Clustered, EXPLAIN ANALYZE
- [x] `sql/10-transactions-acid-normalization.html` — ACID Properties, Isolation Levels, 1NF to BCNF Normalization
- [x] `sql/11-sql-interview-guide.html` — 🎯 Top 75 SQL Interview Questions & LeetCode Query Patterns

---

## Batch 12: Python 3 & AI Masterclass Track (Complete Course)
- [x] `python/index.html` — Python Course Hub, Roadmap, 20-Question Certification Exam
- [x] `python/01-introduction-setup.html` — CPython, Bytecode, PVM, PEP 8, Virtual Environments (venv)
- [x] `python/02-syntax-variables-datatypes.html` — Dynamic typing, PyObject memory, Small Integer Cache
- [x] `python/03-numbers-booleans-operators.html` — Precision, Walrus operator (:=), Bitwise logic
- [x] `python/04-strings-and-string-methods.html` — Immutability, Step Slicing, f-string interpolation
- [x] `python/05-lists-and-tuples.html` — Hierarchical Data Structures Tree: Dynamic Arrays, List Comprehensions, Tuples
- [x] `python/06-dictionaries-and-sets.html` — Hierarchical Data Structures Tree: Hash Tables, Collisions, Set Math
- [x] `python/07-conditionals-and-loops.html` — Pattern matching (match-case), Enumerate, Zip, Loop else
- [x] `python/08-functions-args-kwargs-lambda.html` — First-class functions, LEGB Scope, *args/**kwargs, Closures
- [x] `python/09-oop-classes-objects.html` — Classes, self, Dunder methods, @classmethod, @staticmethod, @property
- [x] `python/10-oop-inheritance-polymorphism.html` — Multiple Inheritance, C3 Linearization (MRO), ABCs, Duck Typing
- [x] `python/11-error-handling-and-files.html` — Try/except/else/finally, Custom Exceptions, Context Managers
- [x] `python/12-modules-packages-pip.html` — sys.path, __name__ == '__main__', Package structures, pip
- [x] `python/13-database-sqlite-postgres.html` — SQLite3, PostgreSQL (psycopg2), SQL Injection prevention
- [x] `python/14-flask-and-fastapi.html` — Modern REST APIs: WSGI vs ASGI, Pydantic, Async/Await
- [x] `python/15-django-fundamentals.html` — Full-Stack Django MVT, ORM, Migrations, Admin panel
- [x] `python/16-numpy-and-pandas.html` — High-performance vector ndarrays, Broadcasting, Pandas DataFrames
- [x] `python/17-data-visualization-matplotlib.html` — Publication-ready Matplotlib & Seaborn statistical charts
- [x] `python/18-machine-learning-scikit-learn.html` — Scikit-Learn pipelines, Regression, Random Forests, Metrics
- [x] `python/19-deep-learning-nlp-cv.html` — PyTorch Tensors, Backpropagation, CNNs for Vision, Transformers for NLP
- [x] `python/20-python-interview-guide.html` — 🎯 Top 100 Python & AI Interview Questions & Coding Patterns

---

## Batch 13: Enterprise Java & Spring Boot Track (Complete Course)
- [x] `java/index.html` — Java Course Hub, 4-Stage Enterprise Roadmap, 20-Question Certification Exam
- [x] `java/01-introduction-jvm-jdk-jre.html` — JVM Architecture, ClassLoader Subsystems, Bytecode, Stack vs Heap, JIT
- [x] `java/02-syntax-data-types-variables.html` — 8 Primitives, Wrappers, Autoboxing NPE Traps, Integer Cache (-128 to 127)
- [x] `java/03-operators-control-flow.html` — Short-circuit logic, Modern Java 14+ switch expressions with yield, Labeled breaks
- [x] `java/04-methods-arrays-strings.html` — Proof of Pass-by-Value, String Constant Pool (SCP), StringBuilder vs StringBuffer
- [x] `java/05-oop-classes-objects-constructors.html` — Blueprints, Constructor Chaining (this), Access Modifiers, Defensive Copying
- [x] `java/06-oop-inheritance-polymorphism.html` — Subclasses, super(), Dynamic Method Dispatch (vtables), Method Hiding
- [x] `java/07-oop-abstraction-interfaces.html` — Contracts vs Classes, Default/Static methods, Java 17 Sealed Classes (permits)
- [x] `java/08-exception-handling.html` — Throwable Hierarchy, Checked vs Unchecked, Try-with-resources with AutoCloseable
- [x] `java/09-collections-framework.html` — ArrayList vs LinkedList, HashMap Bucket Hashing & Treeify Threshold (Red-Black Trees)
- [x] `java/10-generics-and-comparators.html` — Generics Type Erasure, PECS Rule (? extends / ? super), Comparable vs Comparator
- [x] `java/11-multithreading-concurrency.html` — Thread States, synchronized Monitors, volatile Visibility, ExecutorService Pools
- [x] `java/12-java-8-streams-and-lambdas.html` — Functional Interfaces, Lazy Stream Pipelines, Optional Null-Safety, Collectors
- [x] `java/13-jdbc-and-database-connectivity.html` — JDBC Drivers, PreparedStatement (SQL Injection prevention), ACID Transactions, HikariCP
- [x] `java/14-spring-core-and-ioc.html` — Inversion of Control, Constructor Injection, Stereotypes (@Service/@Repository), Bean Scopes
- [x] `java/15-spring-boot-and-rest-apis.html` — Auto-Configuration, Starters, Embedded Tomcat, @RestController, @Valid DTOs, @RestControllerAdvice
- [x] `java/16-spring-data-jpa-hibernate.html` — ORM Entities, JpaRepository, Lazy Loading, Solving the N+1 Query Problem with JOIN FETCH
- [x] `java/17-microservices-architecture.html` — Spring Cloud Eureka Service Discovery, API Gateway Routing, OpenFeign, Resilience4j Circuit Breakers
- [x] `java/18-java-interview-guide.html` — 🎯 Top 100 Java, Spring Boot & Microservices Interview Questions (Memory, GC Tuning, Sagas)

