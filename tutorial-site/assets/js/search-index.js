/**
 * WebDev Academy - Offline Master Search Index
 * Contains searchable topics, tags, methods, and concepts across all courses.
 */
window.SEARCH_INDEX = [
  // Getting Started
  {
    title: "How the Web Works (Clients, Servers, DNS & HTTP)",
    course: "Getting Started",
    url: "getting-started/01-how-the-web-works.html",
    keywords: ["internet", "server", "client", "dns", "http", "ip address", "protocol", "packets"],
    excerpt: "Understand what happens under the hood when you enter a website URL in your browser."
  },
  {
    title: "Setting Up Your Code Editor and Browser",
    course: "Getting Started",
    url: "getting-started/02-setup-editor-and-browser.html",
    keywords: ["vs code", "notepad", "browser", "installation", "extensions", "editor", "folder"],
    excerpt: "Step-by-step setup guide for beginners to write and test code on your local computer."
  },
  {
    title: "Building and Opening Your Very First Webpage",
    course: "Getting Started",
    url: "getting-started/03-your-first-webpage.html",
    keywords: ["first page", "html file", "save", "double click", "browser", "hello world"],
    excerpt: "Create your first .html file from scratch without any complex tools."
  },
  {
    title: "Browser Developer Tools (DevTools) Essentials",
    course: "Getting Started",
    url: "getting-started/04-devtools-basics.html",
    keywords: ["devtools", "inspect", "console", "elements", "debug", "f12", "styles"],
    excerpt: "Learn how professional developers inspect live elements and debug errors using Chrome/Edge/Firefox DevTools."
  },

  // HTML Course
  {
    title: "HTML Introduction & Anatomy of a Webpage",
    course: "HTML",
    url: "html/01-introduction-structure.html",
    keywords: ["doctype", "html", "head", "body", "title", "meta", "structure", "boilerplate"],
    excerpt: "Explore the core skeleton of every HTML5 page: doctype, head, and body tags."
  },
  {
    title: "HTML Elements, Tags and Core Attributes",
    course: "HTML",
    url: "html/02-elements-attributes.html",
    keywords: ["tag", "element", "attributes", "id", "class", "void elements", "self-closing"],
    excerpt: "Understand opening tags, closing tags, void elements, and universal attributes like id and class."
  },
  {
    title: "Headings, Paragraphs and Text Formatting",
    course: "HTML",
    url: "html/03-headings-paragraphs-text-formatting.html",
    keywords: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "strong", "em", "mark", "code", "blockquote", "formatting"],
    excerpt: "Master text hierarchy and semantic typography with headings, emphasis, quotes, and code snippets."
  },
  {
    title: "Links and Navigation (Hyperlinks & Paths)",
    course: "HTML",
    url: "html/04-links-and-navigation.html",
    keywords: ["anchor", "a tag", "href", "target", "relative path", "absolute path", "bookmarks", "download"],
    excerpt: "Connect the web using anchor tags, relative file links, anchor jumps, and download attributes."
  },
  {
    title: "Images, Figures and Captions",
    course: "HTML",
    url: "html/05-images-and-figures.html",
    keywords: ["img", "src", "alt", "figure", "figcaption", "aspect ratio", "svg", "responsive image"],
    excerpt: "Embedding images correctly with accessible alt descriptions and semantic figure elements."
  },
  {
    title: "HTML Lists: Ordered, Unordered & Description",
    course: "HTML",
    url: "html/06-lists.html",
    keywords: ["ul", "ol", "li", "dl", "dt", "dd", "bullet points", "numbered list", "nested lists"],
    excerpt: "Organize items cleanly using bulleted lists, numbered sequences, and glossary description lists."
  },
  {
    title: "Tables: Organizing Tabular Data",
    course: "HTML",
    url: "html/07-tables.html",
    keywords: ["table", "thead", "tbody", "tr", "th", "td", "colspan", "rowspan", "caption"],
    excerpt: "Build structured tables for data grids, understanding rowspans, colspans, and accessible headers."
  },
  {
    title: "Forms and User Input Fields",
    course: "HTML",
    url: "html/08-forms-and-inputs.html",
    keywords: ["form", "input", "label", "text", "password", "email", "textarea", "select", "radio", "checkbox"],
    excerpt: "Create interactive forms that gather data with input fields, select menus, and submit buttons."
  },
  {
    title: "Form Validation (HTML5 Client-Side Rules)",
    course: "HTML",
    url: "html/09-form-validation.html",
    keywords: ["validation", "required", "min", "max", "pattern", "type mismatch", "constraint validation"],
    excerpt: "Validate user input natively before submission using pattern regex, required flags, and number limits."
  },
  {
    title: "Semantic HTML: Meaningful Structure",
    course: "HTML",
    url: "html/10-semantic-html.html",
    keywords: ["semantic", "header", "nav", "main", "article", "section", "aside", "footer", "accessibility"],
    excerpt: "Why divs are not enough: building readable, SEO-optimized structures with modern semantic tags."
  },
  {
    title: "Audio, Video and Embedded Iframes",
    course: "HTML",
    url: "html/11-audio-video-iframe.html",
    keywords: ["audio", "video", "iframe", "controls", "autoplay", "source", "sandbox", "multimedia"],
    excerpt: "Embedding multimedia and external widgets safely with modern HTML5 media tags and sandboxed iframes."
  },
  {
    title: "Meta Tags, Document Metadata & SEO",
    course: "HTML",
    url: "html/12-meta-tags-seo.html",
    keywords: ["meta", "seo", "viewport", "charset", "description", "open graph", "social sharing"],
    excerpt: "How search engines and social platforms read your site using viewport, description, and OpenGraph tags."
  },
  {
    title: "Accessibility (a11y) & ARIA Fundamentals",
    course: "HTML",
    url: "html/13-accessibility-aria.html",
    keywords: ["accessibility", "aria", "a11y", "screen reader", "aria-label", "role", "keyboard navigation"],
    excerpt: "Make your websites usable for everyone, including users relying on screen readers and keyboards."
  },
  {
    title: "HTML Best Practices, Clean Code & Validation",
    course: "HTML",
    url: "html/14-html-best-practices.html",
    keywords: ["best practices", "clean code", "closing tags", "naming conventions", "html validator"],
    excerpt: "Senior-level guidelines for writing maintainable, production-ready, error-free HTML."
  },

  // CSS Course
  {
    title: "CSS Introduction, Syntax and Where to Write It",
    course: "CSS",
    url: "css/01-introduction-and-syntax.html",
    keywords: ["css", "styling", "inline", "internal", "external", "style tag", "link tag", "declaration"],
    excerpt: "Understand how CSS styles HTML elements, rulesets, selectors, properties, and values."
  },
  {
    title: "CSS Selectors and Specificity Hierarchy",
    course: "CSS",
    url: "css/02-selectors-specificity.html",
    keywords: ["selectors", "class", "id", "specificity", "cascade", "combinators", "attribute selector", "!important"],
    excerpt: "Master how CSS resolves conflicts using the specificity formula: inline > id > class > element."
  },
  {
    title: "Colors, Units and Background Styling",
    course: "CSS",
    url: "css/03-colors-units-backgrounds.html",
    keywords: ["hex", "rgb", "hsl", "px", "rem", "em", "vh", "vw", "%", "background-image", "linear-gradient"],
    excerpt: "Working with color models, modern gradients, and relative units like rem, em, and viewport percentages."
  },
  {
    title: "Typography and Text Styling",
    course: "CSS",
    url: "css/04-fonts-and-text.html",
    keywords: ["font-family", "font-size", "line-height", "font-weight", "text-align", "letter-spacing", "text-transform"],
    excerpt: "Create beautiful, readable text using system font stacks, line-heights, and typographic styling."
  },
  {
    title: "The CSS Box Model: Margin, Border, Padding & Content",
    course: "CSS",
    url: "css/05-box-model.html",
    keywords: ["box model", "margin", "padding", "border", "box-sizing", "border-box", "content-box"],
    excerpt: "The single most important layout concept in CSS: sizing elements accurately with border-box."
  },
  {
    title: "Display, Visibility and Overflow Management",
    course: "CSS",
    url: "css/06-display-visibility-overflow.html",
    keywords: ["display", "block", "inline", "inline-block", "none", "visibility", "overflow", "scroll"],
    excerpt: "Understand element flow, hiding elements properly, and containing overflowing content."
  },
  {
    title: "Positioning and the Stacking Context (z-index)",
    course: "CSS",
    url: "css/07-position-z-index.html",
    keywords: ["position", "static", "relative", "absolute", "fixed", "sticky", "z-index", "stacking context"],
    excerpt: "Pin headers, build modals, create floating badges, and master how 3D layering works with z-index."
  },
  {
    title: "CSS Flexbox: 1-Dimensional Modern Layouts",
    course: "CSS",
    url: "css/08-flexbox.html",
    keywords: ["flexbox", "justify-content", "align-items", "flex-direction", "flex-wrap", "flex-grow", "flex-shrink", "gap"],
    excerpt: "Align items along main and cross axes effortlessly with modern flexbox."
  },
  {
    title: "CSS Grid: 2-Dimensional Layout Mastery",
    course: "CSS",
    url: "css/09-grid.html",
    keywords: ["grid", "grid-template-columns", "fr units", "minmax", "repeat", "auto-fit", "grid-area"],
    excerpt: "Build complete page layouts and responsive photo galleries with powerful 2D CSS Grid."
  },
  {
    title: "Responsive Web Design and Media Queries",
    course: "CSS",
    url: "css/10-responsive-design-media-queries.html",
    keywords: ["responsive", "media queries", "mobile-first", "breakpoints", "max-width", "min-width"],
    excerpt: "Ensure your website looks stunning on smartphones, tablets, laptops, and ultra-wide desktop monitors."
  },
  {
    title: "Pseudo-Classes and Pseudo-Elements",
    course: "CSS",
    url: "css/11-pseudo-classes-pseudo-elements.html",
    keywords: [":hover", ":focus", ":active", ":nth-child", "::before", "::after", "pseudo-element"],
    excerpt: "Style interactive states and insert decorative elements without extra HTML markup."
  },
  {
    title: "CSS Transitions and 2D/3D Transforms",
    course: "CSS",
    url: "css/12-transitions-transforms.html",
    keywords: ["transition", "transform", "translate", "rotate", "scale", "skew", "cubic-bezier", "smooth"],
    excerpt: "Create fluid button hovers, card flips, and micro-interactions with hardware-accelerated transforms."
  },
  {
    title: "CSS Animations and Keyframes",
    course: "CSS",
    url: "css/13-animations-keyframes.html",
    keywords: ["animations", "@keyframes", "animation-duration", "animation-iteration-count", "fill-mode"],
    excerpt: "Bring pages to life with multi-step continuous animations, pulsing badges, and loading spinners."
  },
  {
    title: "CSS Variables (Custom Properties), Calc and Clamp",
    course: "CSS",
    url: "css/14-css-variables-calc-clamp.html",
    keywords: ["variables", "--custom-prop", "calc()", "clamp()", "min()", "max()", "fluid typography", "theming"],
    excerpt: "Build dynamic dark/light themes and fluid responsive typography using native CSS variables and math functions."
  },
  {
    title: "Modern Layout Patterns (Holy Grail, Card Grids, Sticky Footers)",
    course: "CSS",
    url: "css/15-modern-layout-patterns.html",
    keywords: ["layout patterns", "holy grail", "card grid", "sticky footer", "centered hero", "sidebar layout"],
    excerpt: "Battle-tested real-world layout templates you will use on every production website."
  },
  {
    title: "CSS Architecture, BEM & Best Practices",
    course: "CSS",
    url: "css/16-css-best-practices-organization.html",
    keywords: ["bem", "css architecture", "clean css", "maintainability", "reset", "normalize"],
    excerpt: "Keep large stylesheets maintainable, prevent selector conflicts, and write organized CSS."
  },

  // JavaScript Course
  {
    title: "JavaScript Introduction, Script Tags and Dev Console",
    course: "JavaScript",
    url: "javascript/01-introduction-console.html",
    keywords: ["javascript", "js", "console.log", "script tag", "interpreter", "debugging", "syntax"],
    excerpt: "Write your first JavaScript statements and inspect real-time outputs in the browser console."
  },
  {
    title: "Variables and Data Types (Primitive vs Reference)",
    course: "JavaScript",
    url: "javascript/02-variables-data-types.html",
    keywords: ["let", "const", "var", "string", "number", "boolean", "null", "undefined", "symbol", "bigint"],
    excerpt: "Storing data properly: the critical differences between let, const, var, and primitive values."
  },
  {
    title: "Operators, Expressions & Type Coercion",
    course: "JavaScript",
    url: "javascript/03-operators-type-conversion.html",
    keywords: ["operators", "arithmetic", "comparison", "===", "==", "logical", "coercion", "typeof"],
    excerpt: "Mathematical calculations, logical operators, and why you should always use strict equality (===)."
  },
  {
    title: "Conditionals: Making Decisions in Code",
    course: "JavaScript",
    url: "javascript/04-conditions.html",
    keywords: ["if", "else", "else if", "switch", "ternary operator", "truthy", "falsy"],
    excerpt: "Control flow: evaluating conditions, truthy vs falsy values, and concise ternary operators."
  },
  {
    title: "Loops: Repeating Code Efficiently",
    course: "JavaScript",
    url: "javascript/05-loops.html",
    keywords: ["loops", "for", "while", "do-while", "for...of", "for...in", "break", "continue"],
    excerpt: "Iterate over collections, arrays, and repeat algorithmic logic without writing duplicate code."
  },
  {
    title: "Functions: Declarations, Expressions & Arrow Functions",
    course: "JavaScript",
    url: "javascript/06-functions.html",
    keywords: ["functions", "arrow functions", "parameters", "arguments", "return", "default values"],
    excerpt: "Write reusable logic blocks, understand parameters vs arguments, and modern ES6 arrow syntax."
  },
  {
    title: "Scope, Hoisting and Closures Explained",
    course: "JavaScript",
    url: "javascript/07-scope-hoisting-closures.html",
    keywords: ["scope", "global", "block", "function scope", "hoisting", "closures", "lexical environment"],
    excerpt: "Demystify JavaScript's most tested interview concepts: variable lifetime, hoisting, and closures."
  },
  {
    title: "Arrays and Modern Array Methods (map, filter, reduce)",
    course: "JavaScript",
    url: "javascript/08-arrays-and-array-methods.html",
    keywords: ["arrays", "push", "pop", "slice", "splice", "map", "filter", "reduce", "find", "forEach"],
    excerpt: "Work with lists of data using powerful functional methods like map, filter, and reduce."
  },
  {
    title: "Objects and the 'this' Keyword in Depth",
    course: "JavaScript",
    url: "javascript/09-objects-and-this.html",
    keywords: ["objects", "key-value", "methods", "this", "binding", "object.keys", "object.values"],
    excerpt: "Model real-world entities with objects, and understand how the dynamic 'this' keyword works."
  },
  {
    title: "Strings, Numbers, Math & Date Built-ins",
    course: "JavaScript",
    url: "javascript/10-strings-numbers-math-date.html",
    keywords: ["strings", "template literals", "math.random", "math.round", "date", "timestamp", "parsing"],
    excerpt: "Formatting strings, generating random numbers, performing math calculations, and handling dates."
  },
  {
    title: "DOM Manipulation: Selecting and Changing Elements",
    course: "JavaScript",
    url: "javascript/11-dom-selecting-changing.html",
    keywords: ["dom", "document", "queryselector", "queryselectorall", "innerhtml", "textcontent", "classlist"],
    excerpt: "Bridge JS and HTML: find elements on the page, alter text, change styles, and toggle CSS classes."
  },
  {
    title: "DOM Manipulation: Creating and Removing Elements",
    course: "JavaScript",
    url: "javascript/12-dom-creating-removing.html",
    keywords: ["createelement", "appendchild", "insertadjacenthtml", "remove", "documentfragment"],
    excerpt: "Dynamically generate UI components, add items to lists, and remove elements efficiently."
  },
  {
    title: "Events, Event Listeners and Event Delegation",
    course: "JavaScript",
    url: "javascript/13-events-and-event-delegation.html",
    keywords: ["events", "addeventlistener", "click", "keydown", "event object", "bubbling", "delegation"],
    excerpt: "Handle clicks, keyboard inputs, and optimize performance with event bubbling and delegation."
  },
  {
    title: "Forms with JavaScript: Handling User Submissions",
    course: "JavaScript",
    url: "javascript/14-forms-with-javascript.html",
    keywords: ["form submit", "preventdefault", "formdata", "input validation", "live feedback"],
    excerpt: "Intercept form submits, read inputs cleanly, validate emails, and show live inline errors."
  },
  {
    title: "Modern ES6+: Destructuring, Spread/Rest & Modules",
    course: "JavaScript",
    url: "javascript/15-es6-destructuring-spread-modules.html",
    keywords: ["destructuring", "spread operator", "rest parameter", "optional chaining", "nullish coalescing"],
    excerpt: "Write concise modern JavaScript using unpacking syntax, rest/spread operators, and optional chaining."
  },
  {
    title: "Object-Oriented Programming (Classes & Inheritance)",
    course: "JavaScript",
    url: "javascript/16-classes-and-oop.html",
    keywords: ["classes", "constructor", "methods", "inheritance", "extends", "super", "static", "encapsulation"],
    excerpt: "Structure applications with ES6 classes, inheritance, constructors, and encapsulation."
  },
  {
    title: "Error Handling (try, catch, finally & Custom Errors)",
    course: "JavaScript",
    url: "javascript/17-error-handling.html",
    keywords: ["try catch", "error", "throw", "finally", "custom error", "robust code"],
    excerpt: "Prevent crashes: catch exceptions gracefully, throw custom errors, and clean up resources."
  },
  {
    title: "Asynchronous JavaScript: Promises and Async/Await",
    course: "JavaScript",
    url: "javascript/18-promises-async-await.html",
    keywords: ["promises", "async await", "asynchronous", "event loop", "microtasks", "settimeout"],
    excerpt: "Understand how the JS single-threaded event loop handles non-blocking asynchronous operations."
  },
  {
    title: "Working with JSON and the Fetch API",
    course: "JavaScript",
    url: "javascript/19-fetch-api-and-json.html",
    keywords: ["json", "json.parse", "json.stringify", "fetch", "api", "get", "post", "http response"],
    excerpt: "Serialize and parse JSON data and make network requests using the native Fetch API."
  },
  {
    title: "Client-Side Storage: LocalStorage and SessionStorage",
    course: "JavaScript",
    url: "javascript/20-localstorage-sessionstorage.html",
    keywords: ["localstorage", "sessionstorage", "setitem", "getitem", "persistence", "web storage"],
    excerpt: "Save user settings, high scores, and persistent app state inside the browser without a database."
  },
  {
    title: "Regular Expressions (RegEx) for Web Developers",
    course: "JavaScript",
    url: "javascript/21-regex-basics.html",
    keywords: ["regex", "regexp", "patterns", "test", "match", "replace", "email validation"],
    excerpt: "Pattern matching fundamentals: validate phone numbers, sanitize strings, and test inputs."
  },
  {
    title: "Debugging Techniques & Clean Code Guidelines",
    course: "JavaScript",
    url: "javascript/22-debugging-and-best-practices.html",
    keywords: ["debugging", "breakpoints", "performance", "memory leak", "clean code", "senior tips"],
    excerpt: "Debug like a pro with DevTools breakpoints, avoid memory leaks, and write clean, readable code."
  },

  // Reference Pages
  {
    title: "HTML Tags Complete Encyclopedia Reference",
    course: "Reference",
    url: "reference/html-tags-reference.html",
    keywords: ["html reference", "tags list", "attributes", "elements dictionary", "all tags"],
    excerpt: "Offline dictionary of HTML tags with syntax, purpose, attributes, and live try-it examples."
  },
  {
    title: "CSS Properties Complete Encyclopedia Reference",
    course: "Reference",
    url: "reference/css-properties-reference.html",
    keywords: ["css reference", "properties list", "values", "css dictionary", "all properties"],
    excerpt: "Offline dictionary of CSS properties with syntax, accepted values, and visual demos."
  },
  {
    title: "JavaScript Methods & Standard Library Reference",
    course: "Reference",
    url: "reference/js-reference.html",
    keywords: ["js reference", "methods", "array methods", "string methods", "dom methods", "math methods"],
    excerpt: "Offline dictionary of core JavaScript methods across Strings, Arrays, Objects, Math, and DOM."
  },
  {
    title: "A-Z Web Development Glossary",
    course: "Reference",
    url: "reference/glossary.html",
    keywords: ["glossary", "dictionary", "terminology", "definitions", "acronyms", "jargon"],
    excerpt: "A-Z definitions of every web development term, acronym, and technical concept."
  },
  {
    title: "Printable HTML, CSS and JavaScript Cheatsheets",
    course: "Reference",
    url: "reference/cheatsheets.html",
    keywords: ["cheatsheets", "quick reference", "printable", "summary cards", "syntax cheat sheet"],
    excerpt: "Dense, printable, high-value quick reference sheets for HTML, CSS, and JS."
  },
  {
    title: "Named CSS Colors and HTML Entities Directory",
    course: "Reference",
    url: "reference/colors-and-entities.html",
    keywords: ["colors", "color codes", "hex", "html entities", "special characters", "symbols"],
    excerpt: "Directory of all 140+ CSS named colors with hex values and essential HTML character entities."
  },

  // Practice & Projects
  {
    title: "Interactive Coding Challenges (Easy, Medium, Hard)",
    course: "Practice",
    url: "practice/index.html",
    keywords: ["challenges", "exercises", "problems", "practice", "algorithms", "frontend tests"],
    excerpt: "Sharpen your skills with categorized HTML/CSS/JS coding exercises with hints and solutions."
  },
  {
    title: "50+ Frontend Interview Questions and Comprehensive Answers",
    course: "Practice",
    url: "practice/interview-questions.html",
    keywords: ["interview questions", "q&a", "job prep", "technical interview", "frontend questions"],
    excerpt: "Deep, complete answers to real-world frontend job interview questions."
  },
  {
    title: "Developer Speed Typing Test",
    course: "Practice",
    url: "practice/typing-test.html",
    keywords: ["typing test", "speed test", "wpm", "words per minute", "developer typing", "coding velocity", "accuracy"],
    excerpt: "Interactive speed typing test for developers with live JavaScript, HTML/CSS, and technical vocabulary."
  },
  {
    title: "Live Interactive Playground",
    course: "Playground",
    url: "playground/index.html",
    keywords: ["playground", "editor", "sandbox", "scratchpad", "live html css js", "export"],
    excerpt: "Triple-pane live web IDE to build, test, save, and export your HTML/CSS/JS experiments."
  },

  // Projects Track
  {
    title: "Guided Projects Showcase Hub",
    course: "Projects",
    url: "projects/index.html",
    keywords: ["projects", "guided builds", "portfolio projects", "applications", "real world"],
    excerpt: "Showcase of 9 step-by-step portfolio projects from beginner to advanced."
  },
  {
    title: "Project 01: Personal Developer Portfolio",
    course: "Projects",
    url: "projects/01-personal-portfolio.html",
    keywords: ["portfolio", "project 1", "developer site", "contact form", "responsive layout"],
    excerpt: "Build a responsive personal developer portfolio with dark theme and contact form."
  },
  {
    title: "Project 02: Responsive Product Landing Page",
    course: "Projects",
    url: "projects/02-responsive-landing-page.html",
    keywords: ["landing page", "project 2", "saas", "pricing toggle", "faq accordion", "hamburger menu"],
    excerpt: "Build a high-converting SaaS landing page with pricing toggle and FAQ accordion."
  },
  {
    title: "Project 03: Feature-Rich Todo Application",
    course: "Projects",
    url: "projects/03-todo-app.html",
    keywords: ["todo app", "project 3", "crud", "localstorage", "filtering", "tasks"],
    excerpt: "Build a complete CRUD task manager with filtering and local storage synchronization."
  },
  {
    title: "Project 04: Interactive Scientific Calculator",
    course: "Projects",
    url: "projects/04-calculator.html",
    keywords: ["calculator", "project 4", "math", "keyboard shortcuts", "grid keypad"],
    excerpt: "Build a precision calculator with floating-point safety and full keyboard support."
  },
  {
    title: "Project 05: Timed Quiz & Assessment Engine",
    course: "Projects",
    url: "projects/05-quiz-app.html",
    keywords: ["quiz app", "project 5", "timer", "assessment", "score screen", "mcq"],
    excerpt: "Build an interactive timed assessment engine with countdown timer and score review."
  },
  {
    title: "Project 06: Digital Clock & High-Precision Stopwatch",
    course: "Projects",
    url: "projects/06-digital-clock-stopwatch.html",
    keywords: ["clock", "stopwatch", "project 6", "lap timer", "drift-free", "date object"],
    excerpt: "Build an accurate digital clock and millisecond stopwatch with lap split history."
  },
  {
    title: "Project 07: Filterable Image Gallery & Lightbox",
    course: "Projects",
    url: "projects/07-image-gallery-lightbox.html",
    keywords: ["gallery", "lightbox", "project 7", "modal viewer", "keyboard nav", "image filters"],
    excerpt: "Build a responsive thumbnail gallery with modal lightbox viewer and keyboard arrows."
  },
  {
    title: "Project 08: Offline Weather Dashboard (Mock API)",
    course: "Projects",
    url: "projects/08-weather-app-mock-data.html",
    keywords: ["weather app", "project 8", "mock api", "forecast", "celsius fahrenheit", "offline"],
    excerpt: "Build a multi-city weather dashboard with temperature toggle and 5-day forecast."
  },
  {
    title: "Project 09: Personal Expense & Budget Tracker",
    course: "Projects",
    url: "projects/09-expense-tracker.html",
    keywords: ["expense tracker", "project 9", "budget", "finance", "income", "balance"],
    excerpt: "Build a complete financial budget tracker with income/expense calculations."
  },

  // Graduation & Certificate
  {
    title: "Certificate of Completion Generator",
    course: "Certificate",
    url: "certificate/index.html",
    keywords: ["certificate", "graduation", "diploma", "credential", "completion", "pdf print"],
    excerpt: "Generate, customize, and print your verified official Certificate of Completion."
  }

  // =================== SQL TRACK ===================
  {
    title: "SQL 01: Database Fundamentals, RDBMS & Codd's Rules",
    course: "SQL",
    url: "sql/01-database-fundamentals-rdbms.html",
    keywords: ["sql", "rdbms", "database", "tables", "primary key", "foreign key", "relational model", "codd rules"],
    excerpt: "Understand relational databases, primary/foreign keys, referential integrity, and Codd's 12 rules."
  },
  {
    title: "SQL 02: DDL Statements: CREATE, ALTER, DROP & TRUNCATE",
    course: "SQL",
    url: "sql/02-ddl-create-alter-drop.html",
    keywords: ["ddl", "create table", "alter table", "drop table", "truncate", "constraints", "check constraint"],
    excerpt: "Master data definition language, table schemas, column data types, constraints, and TRUNCATE vs DELETE."
  },
  {
    title: "SQL 03: DML Operations: INSERT, UPDATE, DELETE & Upsert",
    course: "SQL",
    url: "sql/03-dml-insert-update-delete.html",
    keywords: ["dml", "insert into", "update", "delete", "upsert", "on conflict", "merge"],
    excerpt: "Insert, modify, and delete rows safely with WHERE filters and atomic ON CONFLICT UPSERTs."
  },
  {
    title: "SQL 04: DQL Querying: SELECT, WHERE, Operators & Execution Order",
    course: "SQL",
    url: "sql/04-dql-select-where-operators.html",
    keywords: ["dql", "select", "where", "like", "in", "between", "order by", "limit", "offset", "execution order"],
    excerpt: "Master the 6-stage SQL logical execution order (FROM to SELECT) and pattern filtering."
  },
  {
    title: "SQL 05: Aggregations: COUNT, SUM, AVG, GROUP BY & HAVING",
    course: "SQL",
    url: "sql/05-aggregations-group-by-having.html",
    keywords: ["aggregations", "group by", "having", "count", "sum", "avg", "min", "max", "having vs where"],
    excerpt: "Group table rows into statistical summaries and filter grouped buckets using HAVING."
  },
  {
    title: "SQL 06: Relational Joins In-Depth: INNER, LEFT, RIGHT, FULL, CROSS & SELF",
    course: "SQL",
    url: "sql/06-joins-in-depth.html",
    keywords: ["joins", "inner join", "left join", "right join", "full outer join", "cross join", "self join"],
    excerpt: "Venn diagram mechanics and execution performance of relational SQL joins."
  },
  {
    title: "SQL 07: Subqueries, Correlated Subqueries & CTEs (WITH Clause)",
    course: "SQL",
    url: "sql/07-subqueries-and-ctes.html",
    keywords: ["subquery", "nested query", "correlated subquery", "exists", "cte", "with clause", "recursive cte"],
    excerpt: "Write modular queries using Common Table Expressions (CTEs), recursive CTEs, and EXISTS."
  },
  {
    title: "SQL 08: Advanced Window Functions: OVER, PARTITION BY, RANK & LEAD/LAG",
    course: "SQL",
    url: "sql/08-window-functions.html",
    keywords: ["window functions", "over", "partition by", "row_number", "rank", "dense_rank", "lead", "lag"],
    excerpt: "Perform running totals, ranking, and period-over-period analytics without collapsing rows."
  },
  {
    title: "SQL 09: Database Indexing, B-Trees & Query Optimization",
    course: "SQL",
    url: "sql/09-indexing-and-performance.html",
    keywords: ["indexing", "b-tree", "clustered index", "non-clustered index", "explain analyze", "performance"],
    excerpt: "Accelerate query performance with B-Tree indexes, composite keys, and EXPLAIN execution plans."
  },
  {
    title: "SQL 10: Transactions, ACID Properties & Normalization (1NF to BCNF)",
    course: "SQL",
    url: "sql/10-transactions-acid-normalization.html",
    keywords: ["acid", "transactions", "atomicity", "isolation levels", "dirty read", "normalization", "1nf", "2nf", "3nf", "bcnf"],
    excerpt: "Master ACID transaction consistency, transaction isolation levels, and database normalization."
  },
  {
    title: "SQL 11: Top 75 SQL Interview Questions & LeetCode Query Patterns",
    course: "SQL",
    url: "sql/11-sql-interview-guide.html",
    keywords: ["sql interview", "top 75 sql", "leetcode sql", "nth highest salary", "duplicate rows", "interview cheat sheet"],
    excerpt: "Ace FAANG and technical interviews with point-wise answers to the top 75 SQL questions."
  },
  {
    title: "SQL Course Hub & 20-Question Certification Exam",
    course: "SQL",
    url: "sql/index.html",
    keywords: ["sql course", "sql certification", "sql exam", "sql roadmap", "rdbms hub"],
    excerpt: "Complete overview of the SQL curriculum with a 20-question certification assessment."
  },

  // =================== PYTHON TRACK ===================
  {
    title: "Python 01: Introduction, Architecture & Virtual Environments",
    course: "Python",
    url: "python/01-introduction-setup.html",
    keywords: ["python", "cpython", "bytecode", "pvm", "pep 8", "virtual environment", "venv", "pip"],
    excerpt: "Understand how CPython compiles to bytecode, virtual environments, and PEP 8 standards."
  },
  {
    title: "Python 02: Syntax, Variables & Dynamic Typing Internals",
    course: "Python",
    url: "python/02-syntax-variables-datatypes.html",
    keywords: ["python variables", "dynamic typing", "id", "type casting", "small int cache", "everything is an object"],
    excerpt: "Understand variable references, PyObject heap allocation, and type casting in Python."
  },
  {
    title: "Python 03: Numbers, Booleans, Math & Advanced Operators",
    course: "Python",
    url: "python/03-numbers-booleans-operators.html",
    keywords: ["python numbers", "float precision", "walrus operator", "bitwise operators", "math module"],
    excerpt: "Explore integer precision, float rounding, the Walrus operator (:=), and bitwise logic."
  },
  {
    title: "Python 04: Strings, String Formatting & Slicing Mastery",
    course: "Python",
    url: "python/04-strings-and-string-methods.html",
    keywords: ["python strings", "string slicing", "f-strings", "string methods", "split", "join", "immutability"],
    excerpt: "Master Python string immutability, step slicing [start:stop:step], and f-string interpolation."
  },
  {
    title: "Python 05: Data Types Tree: Lists & Tuples In-Depth",
    course: "Python",
    url: "python/05-lists-and-tuples.html",
    keywords: ["python lists", "tuples", "list comprehension", "unpacking", "mutability", "over-allocation"],
    excerpt: "Hierarchical exploration of dynamic array list growth, list comprehensions, and immutable tuples."
  },
  {
    title: "Python 06: Data Types Tree: Dictionaries & Sets In-Depth",
    course: "Python",
    url: "python/06-dictionaries-and-sets.html",
    keywords: ["python dictionaries", "sets", "hash table", "hash collision", "dict comprehension", "set operations"],
    excerpt: "Explore compact hash table dictionaries, hash collisions, and set intersection/union operations."
  },
  {
    title: "Python 07: Conditionals, Match-Case & Loop Constructs",
    course: "Python",
    url: "python/07-conditionals-and-loops.html",
    keywords: ["python conditionals", "match case", "for loop", "while loop", "enumerate", "zip", "loop else"],
    excerpt: "Master pattern matching (match-case), enumerate, zip, and the unique for-else construct."
  },
  {
    title: "Python 08: Functions, Scope, *args, **kwargs & Lambdas",
    course: "Python",
    url: "python/08-functions-args-kwargs-lambda.html",
    keywords: ["python functions", "args kwargs", "lambda", "closures", "legb scope", "mutable default trap"],
    excerpt: "Master first-class functions, LEGB scope resolution, *args/**kwargs, closures, and decorators."
  },
  {
    title: "Python 09: OOP: Classes, Objects, __init__ & Dunder Methods",
    course: "Python",
    url: "python/09-oop-classes-objects.html",
    keywords: ["python oop", "classes", "self", "dunder methods", "classmethod", "staticmethod", "property"],
    excerpt: "Build object-oriented software with classes, self, @classmethod, @staticmethod, and @property."
  },
  {
    title: "Python 10: OOP: Inheritance, MRO, Polymorphism & ABCs",
    course: "Python",
    url: "python/10-oop-inheritance-polymorphism.html",
    keywords: ["python inheritance", "multiple inheritance", "mro", "c3 linearization", "super", "abcs", "duck typing"],
    excerpt: "Multiple inheritance, C3 linearization (MRO), duck typing, and Abstract Base Classes (ABCs)."
  },
  {
    title: "Python 11: Error Handling, Custom Exceptions & File I/O",
    course: "Python",
    url: "python/11-error-handling-and-files.html",
    keywords: ["try except", "finally", "custom exceptions", "file io", "context manager", "with statement"],
    excerpt: "Write crash-resilient code with try/except/else/finally, custom exceptions, and context managers."
  },
  {
    title: "Python 12: Modules, Packages, Imports & pip Package Manager",
    course: "Python",
    url: "python/12-modules-packages-pip.html",
    keywords: ["python modules", "packages", "sys path", "if name == main", "init py", "pip", "requirements txt"],
    excerpt: "Structure large Python applications into clean modules, packages, and managed pip dependencies."
  },
  {
    title: "Python 13: Database Connectivity: SQLite3 & PostgreSQL (psycopg2)",
    course: "Python",
    url: "python/13-database-sqlite-postgres.html",
    keywords: ["python database", "sqlite3", "psycopg2", "postgresql", "sql injection python", "sqlalchemy"],
    excerpt: "Connect Python to SQLite and PostgreSQL using parameter binding, transactions, and connection pools."
  },
  {
    title: "Python 14: REST APIs: Flask & FastAPI with Asynchronous Async/Await",
    course: "Python",
    url: "python/14-flask-and-fastapi.html",
    keywords: ["flask", "fastapi", "asgi wsgi", "async await", "pydantic", "swagger", "rest api python"],
    excerpt: "Build lightning-fast asynchronous REST APIs with FastAPI, Pydantic type validation, and Flask."
  },
  {
    title: "Python 15: Full-Stack Web Development with Django & MVT Pattern",
    course: "Python",
    url: "python/15-django-fundamentals.html",
    keywords: ["django", "mvt", "django orm", "django migrations", "django admin", "drf", "rest framework"],
    excerpt: "Build batteries-included web applications with Django ORM, migrations, views, and Admin panel."
  },
  {
    title: "Python 16: Data Science: NumPy Arrays & Pandas DataFrames",
    course: "Python",
    url: "python/16-numpy-and-pandas.html",
    keywords: ["numpy", "pandas", "data science", "dataframes", "broadcasting", "loc iloc", "groupby"],
    excerpt: "High-performance vector mathematics with NumPy ndarrays and tabular data manipulation with Pandas."
  },
  {
    title: "Python 17: Data Visualization: Matplotlib & Seaborn Analytics",
    course: "Python",
    url: "python/17-data-visualization-matplotlib.html",
    keywords: ["matplotlib", "seaborn", "data visualization", "charts", "plots", "histograms", "heatmaps"],
    excerpt: "Generate publication-quality line charts, bar plots, scatter graphs, and statistical heatmaps."
  },
  {
    title: "Python 18: Machine Learning Fundamentals with Scikit-Learn",
    course: "Python",
    url: "python/18-machine-learning-scikit-learn.html",
    keywords: ["machine learning", "scikit-learn", "linear regression", "random forest", "train test split", "confusion matrix"],
    excerpt: "Train, evaluate, and deploy machine learning models for regression, classification, and clustering."
  },
  {
    title: "Python 19: Deep Learning, NLP & Computer Vision (PyTorch, Transformers & OpenCV)",
    course: "Python",
    url: "python/19-deep-learning-nlp-cv.html",
    keywords: ["deep learning", "nlp", "computer vision", "pytorch", "tensors", "transformers", "opencv", "cnn"],
    excerpt: "Artificial Neural Networks, backpropagation, CNNs for computer vision, and Transformer NLP pipelines."
  },
  {
    title: "Python 20: Top 100 Python & AI Interview Questions & Coding Patterns",
    course: "Python",
    url: "python/20-python-interview-guide.html",
    keywords: ["python interview", "top 100 python", "python cheat sheet", "gil", "generator vs iterator", "interview questions"],
    excerpt: "Master the top 100 Python, Data Science, and Machine Learning technical interview questions."
  },
  {
    title: "Python 3 Masterclass Hub & 20-Question Certification Exam",
    course: "Python",
    url: "python/index.html",
    keywords: ["python course", "python certification", "python exam", "python roadmap", "ai track"],
    excerpt: "Complete overview of the Python curriculum with a 20-question certification assessment."
  },

  // =================== JAVA TRACK ===================
  {
    title: "Java 01: JVM Architecture, Bytecode & Java Memory Model",
    course: "Java",
    url: "java/01-introduction-jvm-jdk-jre.html",
    keywords: ["java", "jvm", "jdk vs jre", "classloader", "jit compiler", "bytecode", "heap vs stack", "metaspace"],
    excerpt: "Explore the internals of the Java Virtual Machine, ClassLoader subsystems, and JIT compilation."
  },
  {
    title: "Java 02: Data Types, Primitives, Wrappers & Type Casting",
    course: "Java",
    url: "java/02-syntax-data-types-variables.html",
    keywords: ["java primitives", "wrapper classes", "autoboxing", "unboxing", "integer cache", "type casting", "var"],
    excerpt: "8 primitive types, wrapper overhead, autoboxing NPE traps, and the Integer Cache (-128 to 127)."
  },
  {
    title: "Java 03: Operators, Modern Switch Expressions & Loops",
    course: "Java",
    url: "java/03-operators-control-flow.html",
    keywords: ["java operators", "short circuit", "switch expressions", "yield", "arrow switch", "labeled break"],
    excerpt: "Short-circuit evaluation, Java 14+ switch expressions with yield, and labeled loop breaks."
  },
  {
    title: "Java 04: Methods, Arrays, String Immutability & String Pool",
    course: "Java",
    url: "java/04-methods-arrays-strings.html",
    keywords: ["pass by value", "string pool scp", "string immutability", "stringbuilder", "stringbuffer", "arrays"],
    excerpt: "Proof of pass-by-value, String Constant Pool memory saving, and StringBuilder performance."
  },
  {
    title: "Java 05: OOP Foundations: Classes, Objects, Constructors & Encapsulation",
    course: "Java",
    url: "java/05-oop-classes-objects-constructors.html",
    keywords: ["java oop", "classes objects", "constructors", "this keyword", "access modifiers", "encapsulation", "defensive copy"],
    excerpt: "Classes, objects in heap, constructor chaining, 4 access modifiers, and defensive encapsulation."
  },
  {
    title: "Java 06: Inheritance, Polymorphism & Dynamic Method Dispatch",
    course: "Java",
    url: "java/06-oop-inheritance-polymorphism.html",
    keywords: ["java inheritance", "polymorphism", "method overriding vs overloading", "dynamic dispatch", "super", "vtable"],
    excerpt: "Subclasses, super(), dynamic runtime method dispatch via vtables, and method hiding."
  },
  {
    title: "Java 07: Abstraction, Interfaces & Modern Sealed Classes",
    course: "Java",
    url: "java/07-oop-abstraction-interfaces.html",
    keywords: ["abstract classes", "interfaces", "default methods", "functional interface", "sealed classes", "permits"],
    excerpt: "Contracts vs shared state, default methods, functional interfaces, and Java 17 sealed classes."
  },
  {
    title: "Java 08: Robust Exception Handling & Resource Management",
    course: "Java",
    url: "java/08-exception-handling.html",
    keywords: ["java exceptions", "checked vs unchecked", "try with resources", "autocloseable", "custom exceptions"],
    excerpt: "Throwable hierarchy, checked vs unchecked exceptions, and leak-free try-with-resources."
  },
  {
    title: "Java 09: Collections Framework: Lists, Sets & HashMap Internals",
    course: "Java",
    url: "java/09-collections-framework.html",
    keywords: ["collections framework", "arraylist vs linkedlist", "hashmap internals", "hash collision", "treeify", "concurrenthashmap"],
    excerpt: "Under the hood of HashMap: bucket hashing, collision resolution, and red-black tree conversion."
  },
  {
    title: "Java 10: Generics, Bounded Wildcards (PECS) & Sorting",
    course: "Java",
    url: "java/10-generics-and-comparators.html",
    keywords: ["java generics", "pecs rule", "type erasure", "comparable vs comparator", "sorting in java"],
    excerpt: "Compile-time type safety, Producer Extends Consumer Super (PECS), and Comparable vs Comparator."
  },
  {
    title: "Java 11: Multithreading, Concurrency & Thread Pools",
    course: "Java",
    url: "java/11-multithreading-concurrency.html",
    keywords: ["multithreading", "concurrency", "synchronized", "volatile", "executorservice", "thread pool", "deadlock"],
    excerpt: "Thread lifecycle, memory visibility with volatile, synchronized monitors, and ExecutorService."
  },
  {
    title: "Java 12: Functional Programming: Lambdas, Streams API & Optional",
    course: "Java",
    url: "java/12-java-8-streams-and-lambdas.html",
    keywords: ["streams api", "java lambdas", "optional", "filter map reduce", "collectors groupingby", "method references"],
    excerpt: "Declarative collection processing, lazy evaluation, Collectors aggregations, and Optional null-safety."
  },
  {
    title: "Java 13: JDBC Persistence, PreparedStatements & Connection Pooling",
    course: "Java",
    url: "java/13-jdbc-and-database-connectivity.html",
    keywords: ["jdbc", "preparedstatement", "sql injection java", "resultset", "transactions commit rollback", "hikaricp"],
    excerpt: "Database connectivity, stopping SQL injection cold with PreparedStatement, and HikariCP pooling."
  },
  {
    title: "Java 14: Spring Core: Inversion of Control (IoC) & Dependency Injection",
    course: "Java",
    url: "java/14-spring-core-and-ioc.html",
    keywords: ["spring core", "ioc container", "dependency injection", "constructor injection", "bean scopes", "postconstruct"],
    excerpt: "Eliminating hardcoded dependencies with Spring IoC, Constructor Injection, and Bean lifecycles."
  },
  {
    title: "Java 15: Spring Boot & Production RESTful APIs",
    course: "Java",
    url: "java/15-spring-boot-and-rest-apis.html",
    keywords: ["spring boot 3", "rest api", "restcontroller", "restcontrolleradvice", "valid validation", "dto pattern"],
    excerpt: "Zero-XML auto-configuration, embedded Tomcat, REST endpoints, DTO validation, and error envelopes."
  },
  {
    title: "Java 16: Spring Data JPA, Hibernate ORM & Entity Relationships",
    course: "Java",
    url: "java/16-spring-data-jpa-hibernate.html",
    keywords: ["spring data jpa", "hibernate orm", "jparepository", "jpql", "entity relationships", "n+1 problem", "join fetch"],
    excerpt: "Object-Relational Mapping, Spring Data JpaRepository, Lazy loading, and solving the N+1 problem."
  },
  {
    title: "Java 17: Microservices Architecture: Spring Cloud, Gateways & Circuit Breakers",
    course: "Java",
    url: "java/17-microservices-architecture.html",
    keywords: ["microservices", "spring cloud", "eureka service discovery", "api gateway", "openfeign", "resilience4j circuit breaker"],
    excerpt: "Distributed systems architecture: Service discovery, API gateway routing, and Resilience4j fault tolerance."
  },
  {
    title: "Java 18: Master Java & Spring Boot Interview Guide (Top 100 Q&A)",
    course: "Java",
    url: "java/18-java-interview-guide.html",
    keywords: ["java interview questions", "spring boot interview", "jvm tuning", "top 100 java", "java cheat sheet"],
    excerpt: "Ace senior technical interviews with point-wise answers to the top 100 Java and Spring Boot questions."
  },
  {
    title: "Java & Spring Boot Track Hub & 20-Question Certification Exam",
    course: "Java",
    url: "java/index.html",
    keywords: ["java course", "java certification", "spring boot exam", "java roadmap", "enterprise java hub"],
    excerpt: "Complete overview of the Java curriculum with a 20-question certification assessment."
  }

];
