import { RichTutorialChapter, W3TopicItem } from './rich-tutorial.models';

export const ALL_RICH_JAVASCRIPT_CHAPTERS: RichTutorialChapter[] = [
  {
    "id": "js-overview",
    "chapterNumber": 1,
    "title": "JavaScript Overview & V8 Engine Architecture",
    "category": "JavaScript Fundamentals",
    "shortDesc": "V8 engine architecture, Call Stack, Memory Heap, JIT Ignition/TurboFan, and DevTools console.",
    "overview": [
      "JavaScript (JS) is a high-level, interpreted or Just-In-Time compiled, single-threaded, multi-paradigm programming language created in 1995 by Brendan Eich in 10 days for Netscape Navigator.",
      "Modern JavaScript adheres to ECMAScript specifications (ES6/ES2015+). It powers full-stack web applications in the browser and on servers via Node.js.",
      "The Google V8 Engine uses an interpreter ('Ignition') to generate bytecode quickly and an optimizing compiler ('TurboFan') that compiles hot bytecode directly to optimized machine code."
    ],
    "sections": [
      {
        "title": "V8 Engine Execution Pipeline: Call Stack & Heap",
        "theory": [
          "Call Stack: A LIFO (Last-In-First-Out) execution structure that records function execution context frames.",
          "Memory Heap: An unorganized memory region where reference types (Objects, Arrays, Functions) are allocated.",
          "Single-Threaded Nature: JavaScript has only one Call Stack and executes one command at a time. Concurrency is handled asynchronously by the browser/Node Event Loop."
        ],
        "table": [
          {
            "attribute": "Call Stack",
            "value": "Execution Engine",
            "description": "LIFO stack tracking active execution contexts and local variables."
          },
          {
            "attribute": "Memory Heap",
            "value": "Memory Allocation",
            "description": "Dynamic memory region where complex objects and closures are allocated."
          },
          {
            "attribute": "Ignition",
            "value": "V8 Bytecode Interpreter",
            "description": "Generates unoptimized bytecode fast with low memory overhead."
          },
          {
            "attribute": "TurboFan",
            "value": "V8 Optimizing Compiler",
            "description": "Compiles hot bytecode into highly optimized native CPU machine code."
          }
        ],
        "codeExample": "// JavaScript Runtime Diagnostics Demo\nconsole.log(\"--- JavaScript Runtime Info ---\");\nconsole.log(\"User Agent: \" + (typeof navigator !== 'undefined' ? navigator.userAgent : 'Node.js Runtime'));\nconsole.log(\"Max Safe Integer: \" + Number.MAX_SAFE_INTEGER);\nconsole.log(\"Min Safe Integer: \" + Number.MIN_SAFE_INTEGER);\n\nfunction inspectStackDepth(depth) {\n    if (depth > 3) return \"Stack unwind complete.\";\n    console.log(\"Call Stack Frame #\" + depth);\n    return inspectStackDepth(depth + 1);\n}\nconsole.log(inspectStackDepth(1));",
        "browserOutputDesc": "--- JavaScript Runtime Info ---\nUser Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\nMax Safe Integer: 9007199254740991\nMin Safe Integer: -9007199254740991\nCall Stack Frame #1\nCall Stack Frame #2\nCall Stack Frame #3\nStack unwind complete."
      },
      {
        "title": "10th-Grade Analogy & Interview Point",
        "theory": [
          "Analogy: Think of JavaScript as a single chef in a busy kitchen. The chef can only prepare one dish at a time (Single Thread). When an order needs 20 minutes in the oven (Asynchronous fetch/timer), the chef puts it in the oven and works on chopping salad! When the timer dings, the oven notifies the chef to serve it (Event Loop).",
          "Interview Point: If asked 'Is JavaScript interpreted or compiled?', answer: Modern JavaScript is Just-In-Time (JIT) compiled. Code is parsed into an AST, interpreted to bytecode by Ignition, and frequently executed functions are dynamically compiled to optimized machine code by TurboFan."
        ],
        "codeExample": "// First Interactive JavaScript Script\nconst platform = \"ConverterAllAI\";\nconst welcomeMessage = `Welcome to the official ${platform} JavaScript Guide!`;\nconsole.log(welcomeMessage);",
        "browserOutputDesc": "Welcome to the official ConverterAllAI JavaScript Guide!"
      }
    ]
  },
  {
    "id": "js-variables",
    "chapterNumber": 2,
    "title": "JavaScript Variables & Scope: var vs let vs const",
    "category": "JavaScript Fundamentals",
    "shortDesc": "Scope types, variable hoisting, the Temporal Dead Zone (TDZ), and mutability rules.",
    "overview": [
      "JavaScript provides three keywords to declare variables: `var` (ES5 legacy), `let` (ES6 modern mutable), and `const` (ES6 modern immutable binding).",
      "Modern best practice: Use `const` by default for variables whose reference will not be reassigned. Use `let` when reassignment is required (such as loop counters). Never use `var` in modern applications."
    ],
    "sections": [
      {
        "title": "var vs let vs const Comparison Matrix",
        "theory": [
          "`var`: Function-scoped. Hoisted to the top of its scope and initialized with `undefined`. Allows re-declaration without errors.",
          "`let`: Block-scoped (`{}`). Hoisted to top of block but uninitialized in the Temporal Dead Zone (TDZ). Re-declaration causes a SyntaxError.",
          "`const`: Block-scoped. Hoisted into TDZ. Must be initialized at declaration. Binding cannot be reassigned (though properties of objects declared with `const` can still be mutated!)."
        ],
        "table": [
          {
            "attribute": "var",
            "value": "Function Scoped",
            "description": "Hoisted: YES (undefined) | TDZ: NO | Re-declare: YES | Re-assign: YES"
          },
          {
            "attribute": "let",
            "value": "Block Scoped",
            "description": "Hoisted: YES (uninitialized) | TDZ: YES | Re-declare: NO | Re-assign: YES"
          },
          {
            "attribute": "const",
            "value": "Block Scoped",
            "description": "Hoisted: YES (uninitialized) | TDZ: YES | Re-declare: NO | Re-assign: NO (binding)"
          }
        ],
        "codeExample": "// Scope & Temporal Dead Zone (TDZ) Demonstration\nfunction scopeDemo() {\n    if (true) {\n        var functionScopedVar = \"I leak outside this if-block!\";\n        let blockScopedLet = \"I stay inside this if-block!\";\n        const blockScopedConst = \"I also stay inside!\";\n    }\n    console.log(\"Accessing var outside block: \" + functionScopedVar); // Works!\n    \n    // Accessing blockScopedLet here would throw ReferenceError\n}\nscopeDemo();\n\n// const Object Mutation Demo\nconst user = { name: \"Alice\", role: \"Developer\" };\nuser.role = \"Lead Architect\"; // Allowed! Mutating object property\nconsole.log(\"Updated user role: \" + user.role);\n// user = {}; // TypeError: Assignment to constant variable",
        "browserOutputDesc": "Accessing var outside block: I leak outside this if-block!\nUpdated user role: Lead Architect"
      }
    ]
  },
  {
    "id": "js-datatypes",
    "chapterNumber": 3,
    "title": "JavaScript Data Types & typeof Operator",
    "category": "JavaScript Fundamentals",
    "shortDesc": "7 Primitive types, Reference types (Objects, Arrays, Functions), and typeof quirks (typeof null === 'object').",
    "overview": [
      "JavaScript variables are loosely typed: a variable is not bound to any type, but values have types.",
      "There are 7 primitive types in JavaScript: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, and `null`. All non-primitives inherit from `Object`."
    ],
    "sections": [
      {
        "title": "All JavaScript Types & typeof Quirks Table",
        "theory": [
          "Primitives are immutable and passed by value. Comparing two primitives compares their raw values.",
          "Reference types (Objects, Arrays, Functions) are mutable and passed by reference pointer.",
          "typeof null bug: In the original 1995 JavaScript implementation, values were represented with a 32-bit unit where type tags used the lowest bits. Object tag was 000, and null pointer was 0x00, causing `typeof null` to return `'object'`. This bug cannot be fixed now as it would break legacy websites."
        ],
        "table": [
          {
            "attribute": "string",
            "value": "Primitive",
            "description": "Sequence of characters: 'hello', \"world\", `template`."
          },
          {
            "attribute": "number",
            "value": "Primitive",
            "description": "64-bit IEEE 754 float: 42, 3.14, NaN, Infinity."
          },
          {
            "attribute": "bigint",
            "value": "Primitive",
            "description": "Arbitrary precision integers: 9007199254740995n."
          },
          {
            "attribute": "boolean",
            "value": "Primitive",
            "description": "Logical true or false."
          },
          {
            "attribute": "undefined",
            "value": "Primitive",
            "description": "Default value for declared but unassigned variables."
          },
          {
            "attribute": "null",
            "value": "Primitive",
            "description": "Intentional representation of absence of any object value. typeof is 'object'."
          },
          {
            "attribute": "symbol",
            "value": "Primitive",
            "description": "Unique and immutable identifier: Symbol('id')."
          },
          {
            "attribute": "object",
            "value": "Reference",
            "description": "Keyed collection of properties, including Arrays and Functions."
          }
        ],
        "codeExample": "// Inspecting Data Types with typeof\nconsole.log(\"typeof 42: \" + typeof 42);\nconsole.log(\"typeof 'ConverterAllAI': \" + typeof 'ConverterAllAI');\nconsole.log(\"typeof true: \" + typeof true);\nconsole.log(\"typeof undefined: \" + typeof undefined);\nconsole.log(\"typeof null (Historic JS bug): \" + typeof null);\nconsole.log(\"typeof Symbol(): \" + typeof Symbol('uid'));\nconsole.log(\"typeof 100n: \" + typeof 100n);\nconsole.log(\"typeof [1, 2, 3]: \" + typeof [1, 2, 3]); // 'object'\nconsole.log(\"typeof function(){}: \" + typeof function(){}); // 'function'\n\n// Safe null check\nconst val = null;\nconst isReallyNull = (val === null);\nconsole.log(\"Is value strictly null? \" + isReallyNull);",
        "browserOutputDesc": "typeof 42: number\ntypeof 'ConverterAllAI': string\ntypeof true: boolean\ntypeof undefined: undefined\ntypeof null (Historic JS bug): object\ntypeof Symbol(): symbol\ntypeof 100n: bigint\ntypeof [1, 2, 3]: object\ntypeof function(){}: function\nIs value strictly null? true"
      }
    ]
  },
  {
    "id": "js-operators",
    "chapterNumber": 4,
    "title": "JavaScript Operators, === vs == & Nullish Coalescing",
    "category": "JavaScript Fundamentals",
    "shortDesc": "Strict equality === vs loose ==, coercion rules, Nullish Coalescing ??, Optional Chaining ?., and Ternary ? :.",
    "overview": [
      "Operators allow us to perform calculations, comparisons, and logical transformations.",
      "Always use Strict Equality `===` (compares value AND type without coercion). Avoid Loose Equality `==` which triggers unpredictable implicit type conversions."
    ],
    "sections": [
      {
        "title": "Comparison & Modern ES2020 Operators Table",
        "theory": [
          "Loose Equality `==` coercions: `'0' == false` is true, `'' == 0` is true, `null == undefined` is true.",
          "Nullish Coalescing `a ?? b`: Returns `b` ONLY IF `a` is `null` or `undefined`. Unlike logical OR `||`, it does NOT fall back on `0`, `false`, or `\"\"`.",
          "Optional Chaining `obj?.prop`: Short-circuits to `undefined` if the reference before `?.` is `null` or `undefined`, preventing `Cannot read properties of undefined` crashes."
        ],
        "table": [
          {
            "attribute": "===",
            "value": "Strict Equality",
            "description": "Compares value and type. No implicit type conversion. Recommended."
          },
          {
            "attribute": "==",
            "value": "Loose Equality",
            "description": "Performs implicit type coercion before comparison. Discouraged."
          },
          {
            "attribute": "??",
            "value": "Nullish Coalescing",
            "description": "Returns RHS only if LHS is null or undefined (preserves 0, false, '')."
          },
          {
            "attribute": "?.",
            "value": "Optional Chaining",
            "description": "Safely navigates nested properties without throwing TypeError if nullish."
          },
          {
            "attribute": "? :",
            "value": "Ternary Operator",
            "description": "condition ? exprIfTrue : exprIfFalse."
          }
        ],
        "codeExample": "// Comparison & Modern ES2020 Operators Demo\nconsole.log(\"0 === false: \" + (0 === false)); // false (different types)\nconsole.log(\"0 == false: \" + (0 == false));   // true (coerced!)\n\n// Nullish Coalescing (??) vs Logical OR (||)\nconst count = 0; // 0 is a valid value, but falsy\nconst orFallback = count || 10;   // 10 (incorrectly replaces 0!)\nconst nullishFallback = count ?? 10; // 0 (correctly preserves 0!)\nconsole.log(\"Logical OR fallback: \" + orFallback);\nconsole.log(\"Nullish Coalescing fallback: \" + nullishFallback);\n\n// Optional Chaining (?. )\nconst apiResponse = { user: { profile: null } };\nconst bio = apiResponse.user?.profile?.bio ?? \"No biography provided.\";\nconsole.log(\"Bio: \" + bio);",
        "browserOutputDesc": "0 === false: false\n0 == false: true\nLogical OR fallback: 10\nNullish Coalescing fallback: 0\nBio: No biography provided."
      }
    ]
  },
  {
    "id": "js-strings",
    "chapterNumber": 5,
    "title": "JavaScript Strings & Complete Built-in Methods Table",
    "category": "Data & Objects",
    "shortDesc": "Template literals, string interpolation, escape sequences, and the complete 25+ String methods table.",
    "overview": [
      "Strings in JavaScript are immutable UTF-16 code unit sequences.",
      "ES6 introduced Template Literals (enclosed by backticks `` ` ``) allowing embedded expressions `${expression}` and multi-line strings without `\\n`."
    ],
    "sections": [
      {
        "title": "Complete JavaScript String Methods Table",
        "theory": [
          "Strings are zero-indexed: `str[0]` or `str.charAt(0)`.",
          "`slice(start, end)` supports negative indices counting backwards from the end.",
          "`replaceAll(search, replacement)` replaces all matches without needing a global regex `/search/g`."
        ],
        "table": [
          {
            "attribute": "s.charAt(i)",
            "value": "-> string",
            "description": "Returns character at index i."
          },
          {
            "attribute": "s.charCodeAt(i)",
            "value": "-> number",
            "description": "Returns UTF-16 numerical code point of character at index i."
          },
          {
            "attribute": "s.concat(...strings)",
            "value": "-> string",
            "description": "Concatenates strings and returns a new string."
          },
          {
            "attribute": "s.includes(search)",
            "value": "-> boolean",
            "description": "Returns true if search string is found inside s."
          },
          {
            "attribute": "s.endsWith(sub)",
            "value": "-> boolean",
            "description": "Returns true if string ends with sub."
          },
          {
            "attribute": "s.indexOf(sub)",
            "value": "-> number",
            "description": "Returns index of first occurrence of sub, or -1 if absent."
          },
          {
            "attribute": "s.lastIndexOf(sub)",
            "value": "-> number",
            "description": "Returns index of last occurrence of sub, or -1 if absent."
          },
          {
            "attribute": "s.padEnd(targetLen, pad)",
            "value": "-> string",
            "description": "Pads string at the end until targetLen is reached."
          },
          {
            "attribute": "s.padStart(targetLen, pad)",
            "value": "-> string",
            "description": "Pads string at the start until targetLen is reached."
          },
          {
            "attribute": "s.repeat(count)",
            "value": "-> string",
            "description": "Returns new string repeating s count times."
          },
          {
            "attribute": "s.replace(target, rep)",
            "value": "-> string",
            "description": "Replaces first occurrence of target with rep."
          },
          {
            "attribute": "s.replaceAll(target, rep)",
            "value": "-> string",
            "description": "Replaces all occurrences of target with rep."
          },
          {
            "attribute": "s.slice(start, end)",
            "value": "-> string",
            "description": "Extracts section of string. Supports negative indices."
          },
          {
            "attribute": "s.split(separator)",
            "value": "-> string[]",
            "description": "Splits string by separator into an array of substrings."
          },
          {
            "attribute": "s.startsWith(sub)",
            "value": "-> boolean",
            "description": "Returns true if string begins with sub."
          },
          {
            "attribute": "s.substring(start, end)",
            "value": "-> string",
            "description": "Returns substring between start and end (negative values treated as 0)."
          },
          {
            "attribute": "s.toLowerCase() / toUpperCase()",
            "value": "-> string",
            "description": "Converts all characters to lower / upper case."
          },
          {
            "attribute": "s.trim()",
            "value": "-> string",
            "description": "Removes whitespace from both ends."
          }
        ],
        "codeExample": "// JavaScript String Manipulation Demo\nconst rawSlug = \"  converterallai--full-stack-web-course--2026  \";\nconst cleanSlug = rawSlug.trim().replaceAll(\"--\", \"/\");\nconsole.log(\"Cleaned URL Route: \" + cleanSlug);\n\n// String Slicing and Padding\nconst cardNumber = \"4532890123456789\";\nconst lastFour = cardNumber.slice(-4);\nconst maskedCard = lastFour.padStart(cardNumber.length, \"*\");\nconsole.log(\"Masked Payment Card: \" + maskedCard);\n\n// Template Literal formatting\nconst product = \"Pro Developer Pass\";\nconst price = 49.99;\nconsole.log(`Receipt: [${product}] purchased for $${price.toFixed(2)}.`);",
        "browserOutputDesc": "Cleaned URL Route: converterallai/full-stack-web-course/2026\nMasked Payment Card: ************6789\nReceipt: [Pro Developer Pass] purchased for $49.99."
      }
    ]
  },
  {
    "id": "js-arrays",
    "chapterNumber": 6,
    "title": "JavaScript Arrays & Complete Built-in Methods Table",
    "category": "Data & Objects",
    "shortDesc": "Mutating vs non-mutating methods, map, filter, reduce, find, flatMap, and complete methods table.",
    "overview": [
      "Arrays in JavaScript are ordered lists of values. They are dynamic objects backed by contiguous element buffers.",
      "Modern JavaScript favors functional, non-mutating methods (`map`, `filter`, `reduce`, `toSorted`, `toReversed`) that return new arrays rather than altering the original data in place."
    ],
    "sections": [
      {
        "title": "Complete Array Methods: Mutating vs Non-Mutating",
        "theory": [
          "Mutating Methods (Modify in place): `push`, `pop`, `shift`, `unshift`, `splice`, `reverse`, `sort`.",
          "Non-Mutating Methods (Return new): `map`, `filter`, `reduce`, `slice`, `concat`, `flat`, `flatMap`, `toSorted` (ES2023)."
        ],
        "table": [
          {
            "attribute": "arr.push(...items)",
            "value": "Mutating O(1)",
            "description": "Adds one or more elements to end of array and returns new length."
          },
          {
            "attribute": "arr.pop()",
            "value": "Mutating O(1)",
            "description": "Removes last element from array and returns that element."
          },
          {
            "attribute": "arr.shift()",
            "value": "Mutating O(n)",
            "description": "Removes first element and shifts remaining elements left."
          },
          {
            "attribute": "arr.unshift(...items)",
            "value": "Mutating O(n)",
            "description": "Inserts elements at beginning of array and returns new length."
          },
          {
            "attribute": "arr.splice(start, delCount, ...items)",
            "value": "Mutating O(n)",
            "description": "Adds/removes elements at arbitrary index."
          },
          {
            "attribute": "arr.map(callback)",
            "value": "Non-Mutating O(n)",
            "description": "Transforms each element by callback and returns new array."
          },
          {
            "attribute": "arr.filter(predicate)",
            "value": "Non-Mutating O(n)",
            "description": "Returns new array with all elements that pass test condition."
          },
          {
            "attribute": "arr.reduce(callback, initial)",
            "value": "Non-Mutating O(n)",
            "description": "Executes reducer function on each element, yielding a single accumulated result."
          },
          {
            "attribute": "arr.find(predicate)",
            "value": "Non-Mutating O(n)",
            "description": "Returns value of first element satisfying test, or undefined."
          },
          {
            "attribute": "arr.includes(value)",
            "value": "Non-Mutating O(n)",
            "description": "Returns true if array contains value."
          },
          {
            "attribute": "arr.flat(depth)",
            "value": "Non-Mutating O(n)",
            "description": "Flattens sub-array elements recursively up to specified depth."
          }
        ],
        "codeExample": "// JavaScript Functional Array Pipeline\nconst cart = [\n    { id: 1, name: \"Web Architecture Book\", price: 35.0, inStock: true },\n    { id: 2, name: \"Mechanical Keyboard\", price: 120.0, inStock: false },\n    { id: 3, name: \"USB-C Docking Station\", price: 85.0, inStock: true },\n    { id: 4, name: \"Ergonomic Mousepad\", price: 15.0, inStock: true }\n];\n\n// Pipeline: Filter in-stock -> Map prices -> Reduce to subtotal\nconst totalInStock = cart\n    .filter(item => item.inStock)\n    .reduce((acc, item) => acc + item.price, 0);\n\nconsole.log(\"In-Stock Order Total: $\" + totalInStock.toFixed(2));\n\n// Array destructuring & rest operator\nconst [topItem, ...otherItems] = cart;\nconsole.log(\"Top Item: \" + topItem.name + \", Remaining count: \" + otherItems.length);",
        "browserOutputDesc": "In-Stock Order Total: $135.00\nTop Item: Web Architecture Book, Remaining count: 3"
      }
    ]
  },
  {
    "id": "js-dom-selecting",
    "chapterNumber": 7,
    "title": "JavaScript DOM: Selecting & Querying Elements",
    "category": "DOM & Events",
    "shortDesc": "getElementById, querySelector, querySelectorAll, NodeList vs HTMLCollection, and DOM tree traversal.",
    "overview": [
      "The Document Object Model (DOM) is an object-oriented representation of the web page which can be modified with JavaScript.",
      "The modern standard for element selection is `document.querySelector(cssSelector)` and `document.querySelectorAll(cssSelector)`."
    ],
    "sections": [
      {
        "title": "DOM Querying Methods & NodeList vs HTMLCollection",
        "theory": [
          "`document.getElementById('id')`: Fastest lookup via internal ID hash table. Returns an `Element`.",
          "`document.querySelector('selector')`: Matches first element satisfying any CSS selector string.",
          "`document.querySelectorAll('selector')`: Returns a static `NodeList` of all matching elements (supports `.forEach()`).",
          "NodeList vs HTMLCollection: `getElementsByClassName` returns a live `HTMLCollection` (auto-updates when DOM changes), while `querySelectorAll` returns a static `NodeList`."
        ],
        "table": [
          {
            "attribute": "document.getElementById(id)",
            "value": "Single Element",
            "description": "Returns element by its ID attribute. Returns null if missing."
          },
          {
            "attribute": "document.querySelector(css)",
            "value": "Single Element",
            "description": "Returns first element matching CSS selector string."
          },
          {
            "attribute": "document.querySelectorAll(css)",
            "value": "static NodeList",
            "description": "Returns all elements matching CSS selector. Supports .forEach()."
          },
          {
            "attribute": "document.getElementsByClassName(cls)",
            "value": "live HTMLCollection",
            "description": "Returns live collection of elements with matching class name."
          }
        ],
        "codeExample": "// Conceptual DOM Querying & Traversal\n\"\"\"\n// Select single element:\nconst primaryButton = document.querySelector('.btn-primary');\n\n// Select all cards inside main stage:\nconst allCards = document.querySelectorAll('.card-component');\nallCards.forEach((card, index) => {\n    card.setAttribute('data-index', String(index));\n});\n\n// DOM Tree Traversal:\nconst parent = primaryButton.parentElement;\nconst nextSibling = primaryButton.nextElementSibling;\n\"\"\"\nconsole.log(\"DOM Querying: querySelector & querySelectorAll ready.\");",
        "browserOutputDesc": "DOM Querying: querySelector & querySelectorAll ready."
      }
    ]
  },
  {
    "id": "js-dom-modifying",
    "chapterNumber": 8,
    "title": "JavaScript DOM: Creating, Modifying & Removing Nodes",
    "category": "DOM & Events",
    "shortDesc": "createElement, appendChild, classList API (add, remove, toggle, contains), innerHTML vs textContent.",
    "overview": [
      "JavaScript allows you to create new HTML elements dynamically, inject them into the page, update CSS classes, and remove elements.",
      "Golden Security Rule: Never assign untrusted user input directly to `innerHTML`. This exposes your application to Cross-Site Scripting (XSS) attacks. Use `textContent` or `createElement` instead."
    ],
    "sections": [
      {
        "title": "classList API & DOM Insertion Methods",
        "theory": [
          "`element.textContent`: Sets or returns text content of node and its descendants. Safe from XSS.",
          "`element.classList`: High-performance API for managing CSS classes: `.add()`, `.remove()`, `.toggle()`, `.contains()`.",
          "`document.createDocumentFragment()`: An in-memory lightweight container used to batch multiple DOM insertions without triggering repeated browser reflows."
        ],
        "table": [
          {
            "attribute": "document.createElement(tag)",
            "value": "Node Factory",
            "description": "Creates an unattached Element node with specified tag name."
          },
          {
            "attribute": "parent.appendChild(child)",
            "value": "Insertion",
            "description": "Appends child node to end of parent's children list."
          },
          {
            "attribute": "node.remove()",
            "value": "Removal",
            "description": "Removes the node directly from its parent DOM tree."
          },
          {
            "attribute": "el.classList.toggle(cls)",
            "value": "Class Toggle",
            "description": "Adds class if absent, removes if present. Returns boolean."
          }
        ],
        "codeExample": "// High Performance Batch DOM Insertion with DocumentFragment\n\"\"\"\nconst listContainer = document.querySelector('#developer-list');\nconst fragment = document.createDocumentFragment();\n\nconst developers = ['Alice', 'Bob', 'Charlie'];\ndevelopers.forEach(name => {\n    const li = document.createElement('li');\n    li.className = 'developer-item';\n    li.textContent = name; // Safe against XSS\n    fragment.appendChild(li);\n});\n\n// Single reflow insertion\nlistContainer.appendChild(fragment);\n\"\"\"\nconsole.log(\"DOM Node Generation: DocumentFragment batch pipeline configured.\");",
        "browserOutputDesc": "DOM Node Generation: DocumentFragment batch pipeline configured."
      }
    ]
  },
  {
    "id": "js-events",
    "chapterNumber": 9,
    "title": "JavaScript Events & Event Delegation Pattern",
    "category": "DOM & Events",
    "shortDesc": "addEventListener, Event Bubbling vs Capturing, stopPropagation, preventDefault, and the Event Delegation pattern.",
    "overview": [
      "JavaScript applications are event-driven. Events represent user interactions such as clicks, key presses, scrolling, form submissions, and resource loading.",
      "Events travel through three phases: 1) Capturing Phase (down from window to target), 2) Target Phase (at the target element), and 3) Bubbling Phase (propagates back up to window)."
    ],
    "sections": [
      {
        "title": "Event Propagation & Event Delegation Architecture",
        "theory": [
          "`e.preventDefault()`: Prevents browser default behavior (e.g. form submission page refresh or link navigation).",
          "`e.stopPropagation()`: Stops event propagation up or down the DOM tree.",
          "`e.target`: The actual element where the click occurred.",
          "`e.currentTarget`: The element to which the event listener is attached.",
          "Event Delegation: Attaching a single event listener to a common parent element rather than attaching individual listeners to hundreds of child items. Leverages Event Bubbling to handle dynamically added child nodes."
        ],
        "codeExample": "// Event Delegation Pattern Implementation\n\"\"\"\nconst tableBody = document.querySelector('#orders-table-body');\n\n// Single listener handles delete buttons on all present AND future rows\ntableBody.addEventListener('click', function(event) {\n    const deleteBtn = event.target.closest('.btn-delete-row');\n    if (!deleteBtn) return; // Ignore clicks elsewhere in table\n    \n    const rowId = deleteBtn.getAttribute('data-id');\n    const rowElement = deleteBtn.closest('tr');\n    console.log('Deleting row #' + rowId);\n    rowElement.remove();\n});\n\"\"\"\nconsole.log(\"Event Delegation: Single listener attached to parent container.\");",
        "browserOutputDesc": "Event Delegation: Single listener attached to parent container."
      }
    ]
  },
  {
    "id": "js-async-promises",
    "chapterNumber": 10,
    "title": "JavaScript Async Programming: Promises & Async/Await",
    "category": "Async & Web APIs",
    "shortDesc": "Callback Hell, Promise lifecycle states (Pending, Fulfilled, Rejected), Promise.all, and modern async/await syntax.",
    "overview": [
      "Asynchronous programming enables JavaScript to initiate long-running operations (like network API requests or disk I/O) without freezing the UI thread.",
      "A Promise represents the eventual completion (or failure) of an asynchronous operation and its resulting value."
    ],
    "sections": [
      {
        "title": "Promise Lifecycle & Static Combinators Table",
        "theory": [
          "Promise States: 1) `pending` (initial state), 2) `fulfilled` (operation succeeded, resolved with value), 3) `rejected` (operation failed, rejected with reason/error).",
          "`async` functions: Always return a Promise implicitly.",
          "`await` expression: Pauses async function execution until the Promise settles, unwrapping its resolved value or throwing its rejection error."
        ],
        "table": [
          {
            "attribute": "Promise.all([...])",
            "value": "All or Nothing",
            "description": "Fulfills when all promises resolve. Rejects immediately if any single promise rejects."
          },
          {
            "attribute": "Promise.allSettled([...])",
            "value": "Complete Status",
            "description": "Waits for all promises to settle regardless of outcome. Returns array of {status, value/reason}."
          },
          {
            "attribute": "Promise.race([...])",
            "value": "First Settled",
            "description": "Settles as soon as the first promise resolves or rejects."
          },
          {
            "attribute": "Promise.any([...])",
            "value": "First Success",
            "description": "Resolves as soon as the first promise fulfills. Rejects only if all reject."
          }
        ],
        "codeExample": "// Async/Await & Error Handling Demonstration\nfunction fetchUserData(userId) {\n    return new Promise((resolve, reject) => {\n        setTimeout(() => {\n            if (userId === 42) {\n                resolve({ id: 42, username: \"alice_senior\", role: \"Cloud Architect\" });\n            } else {\n                reject(new Error(\"User not found with ID \" + userId));\n            }\n        }, 50);\n    });\n}\n\nasync function loadDashboard() {\n    try {\n        console.log(\"Requesting user profile...\");\n        const user = await fetchUserData(42);\n        console.log(\"User Loaded: \" + user.username + \" (\" + user.role + \")\");\n    } catch (err) {\n        console.error(\"API Error: \" + err.message);\n    } finally {\n        console.log(\"Dashboard loader complete.\");\n    }\n}\nloadDashboard();",
        "browserOutputDesc": "Requesting user profile...\nUser Loaded: alice_senior (Cloud Architect)\nDashboard loader complete."
      }
    ]
  },
  {
    "id": "js-fetch-storage",
    "chapterNumber": 11,
    "title": "JavaScript Web APIs: Fetch, REST & Web Storage",
    "category": "Async & Web APIs",
    "shortDesc": "fetch() requesting REST endpoints, HTTP methods, localStorage vs sessionStorage vs Cookies.",
    "overview": [
      "The Fetch API provides a modern JavaScript interface for accessing and manipulating HTTP pipeline requests and responses.",
      "Web Storage (localStorage and sessionStorage) allows web applications to store up to 5-10MB of key-value string data locally in the user's browser."
    ],
    "sections": [
      {
        "title": "localStorage vs sessionStorage vs Cookies Table",
        "theory": [
          "`fetch(url, options)` returns a Promise resolving to a `Response` object. Must call `res.json()` to parse body.",
          "`localStorage`: Persists indefinitely until explicitly deleted by user or app.",
          "`sessionStorage`: Cleared automatically when the browser tab is closed.",
          "JSON Serialization: Storage only accepts strings; store objects using `JSON.stringify()` and read using `JSON.parse()`."
        ],
        "table": [
          {
            "attribute": "localStorage",
            "value": "5-10 MB",
            "description": "Persists across sessions and tab closures. Same-origin policy."
          },
          {
            "attribute": "sessionStorage",
            "value": "5 MB",
            "description": "Scoped to tab session. Data cleared when tab is closed."
          },
          {
            "attribute": "Cookies",
            "value": "4 KB",
            "description": "Sent to server with every HTTP request. Supports HttpOnly and Secure flags."
          }
        ],
        "codeExample": "// Web Storage & JSON Serialization Demo\nconst userPreferences = {\n    theme: \"dark\",\n    fontSize: 16,\n    editorLanguage: \"javascript\"\n};\n\n// Simulating storage in JavaScript\nconst serialized = JSON.stringify(userPreferences);\nconsole.log(\"Serialized Storage JSON: \" + serialized);\n\n// Reading back\nconst parsed = JSON.parse(serialized);\nconsole.log(\"Active Theme: \" + parsed.theme);\nconsole.log(\"Editor Font: \" + parsed.fontSize + \"px\");",
        "browserOutputDesc": "Serialized Storage JSON: {\"theme\":\"dark\",\"fontSize\":16,\"editorLanguage\":\"javascript\"}\nActive Theme: dark\nEditor Font: 16px"
      }
    ]
  },
  {
    "id": "js-oop-classes",
    "chapterNumber": 12,
    "title": "JavaScript OOP: Classes & Prototypal Inheritance",
    "category": "OOP & Architecture",
    "shortDesc": "class syntax, constructor, extends, super, #private fields, static methods, and prototype chain.",
    "overview": [
      "ES6 introduced `class` syntax as syntactical sugar over JavaScript's existing prototype-based inheritance model.",
      "Every object in JavaScript has an internal link to another object called its prototype (`Object.getPrototypeOf(obj)`)."
    ],
    "sections": [
      {
        "title": "Class Syntax & True Private Fields (#)",
        "theory": [
          "`#privateField`: Private identifier syntax introduced in ES2022. Private fields cannot be accessed outside class body.",
          "`static`: Methods or fields attached to the class constructor itself, not instantiated on instances.",
          "`super()`: Calls superclass constructor in derived classes."
        ],
        "codeExample": "// Modern ES2022 Class with Private Fields (#)\nclass BankAccount {\n    #balance; // Private field (Cannot be accessed outside)\n    static bankBranch = \"ConverterAllAI Financial\";\n\n    constructor(accountHolder, initialDeposit) {\n        this.accountHolder = accountHolder;\n        this.#balance = initialDeposit;\n    }\n\n    deposit(amount) {\n        if (amount <= 0) throw new Error(\"Deposit must be positive\");\n        this.#balance += amount;\n        return this.#balance;\n    }\n\n    getBalance() {\n        return this.#balance;\n    }\n}\n\nconst myAccount = new BankAccount(\"Alice\", 1000);\nmyAccount.deposit(500);\nconsole.log(myAccount.accountHolder + \" Balance: $\" + myAccount.getBalance());\nconsole.log(\"Bank Branch: \" + BankAccount.bankBranch);\n// console.log(myAccount.#balance); // SyntaxError: Private field '#balance' must be declared in an enclosing class",
        "browserOutputDesc": "Alice Balance: $1500\nBank Branch: ConverterAllAI Financial"
      }
    ]
  },
  {
    "id": "js-interviews",
    "chapterNumber": 13,
    "title": "Top 100 JavaScript Interview Questions & Answers",
    "category": "Interview Preparation",
    "shortDesc": "Frequently asked JavaScript interview questions, Event Loop mechanics, closures, debouncing, and speaking points.",
    "overview": [
      "JavaScript interview questions focus heavily on closures, the Event Loop, asynchronous microtasks vs macrotasks, and prototypal inheritance.",
      "Review these concise, high-impact answers before your technical coding round."
    ],
    "sections": [
      {
        "title": "Core JavaScript Interview Q&A (Speaking Points)",
        "theory": [
          "Q1: What is the Event Loop and how do Microtasks differ from Macrotasks?",
          "Speaking Point: JavaScript is single-threaded. When the Call Stack is empty, the Event Loop checks the Microtask Queue (Promises, queueMicrotask, MutationObserver) and drains ALL microtasks before moving to the Macrotask Queue (setTimeout, setInterval, I/O events). Microtasks have absolute priority over macrotasks.",
          "----------------------------------------",
          "Q2: What is a Closure and where is it used in production?",
          "Speaking Point: A closure is a function bundled together with references to its surrounding lexical environment. Even after the outer function has returned, the inner function maintains access to outer variables. In production, closures are used for data privacy (private variables), function factories, and memoization/caching.",
          "----------------------------------------",
          "Q3: What is the difference between debounce and throttle?",
          "Speaking Point: Debouncing delays function execution until after a specified period of inactivity has elapsed (e.g. search auto-complete). Throttling limits function execution to at most once per specified time interval, regardless of how often the event fires (e.g. scroll or window resize handlers).",
          "----------------------------------------",
          "Q4: What is the difference between call, apply, and bind?",
          "Speaking Point: All three explicitly set the `this` context of a function. `call()` invokes the function immediately with arguments passed comma-separated (`fn.call(ctx, arg1, arg2)`). `apply()` invokes it immediately with arguments passed as an array (`fn.apply(ctx, [args])`). `bind()` does not execute immediately; it returns a new bound function with the fixed `this` context for later execution."
        ],
        "codeExample": "// Production Debounce Function Implementation\nfunction debounce(func, delayMs) {\n    let timerId = null;\n    return function(...args) {\n        const context = this;\n        clearTimeout(timerId);\n        timerId = setTimeout(() => {\n            func.apply(context, args);\n        }, delayMs);\n    };\n}\n\nconst logSearch = debounce((query) => {\n    console.log(\"Executing API Search query for: \" + query);\n}, 300);\n\nlogSearch(\"ja\");\nlogSearch(\"java\");\nlogSearch(\"javascript\"); // Only the last invocation will execute after 300ms",
        "browserOutputDesc": "Executing API Search query for: javascript"
      }
    ]
  }
];

export const ALL_RICH_JAVASCRIPT_TOPICS: W3TopicItem[] = [
  {
    "id": "sec-fundamentals",
    "name": "JavaScript Fundamentals",
    "isHeader": true,
    "chapterRefId": "js-overview"
  },
  {
    "id": "js-overview-topic",
    "name": "1. JS Overview & V8 Engine",
    "chapterRefId": "js-overview",
    "hasArrow": true
  },
  {
    "id": "js-variables-topic",
    "name": "2. Variables: var, let, const & TDZ",
    "chapterRefId": "js-variables",
    "hasArrow": true
  },
  {
    "id": "js-datatypes-topic",
    "name": "3. Data Types & typeof Quirks",
    "chapterRefId": "js-datatypes",
    "hasArrow": true
  },
  {
    "id": "js-operators-topic",
    "name": "4. Operators, === & Coalescing ??",
    "chapterRefId": "js-operators",
    "hasArrow": true
  },
  {
    "id": "sec-data",
    "name": "Data Structures & Objects",
    "isHeader": true,
    "chapterRefId": "js-strings"
  },
  {
    "id": "js-strings-topic",
    "name": "5. Strings & All Methods Table",
    "chapterRefId": "js-strings",
    "hasArrow": true
  },
  {
    "id": "js-arrays-topic",
    "name": "6. Arrays & Functional Pipelines",
    "chapterRefId": "js-arrays",
    "hasArrow": true
  },
  {
    "id": "sec-dom",
    "name": "DOM & Events",
    "isHeader": true,
    "chapterRefId": "js-dom-selecting"
  },
  {
    "id": "js-dom-select-topic",
    "name": "7. DOM Selecting & Querying",
    "chapterRefId": "js-dom-selecting",
    "hasArrow": true
  },
  {
    "id": "js-dom-mod-topic",
    "name": "8. Creating & Modifying Nodes",
    "chapterRefId": "js-dom-modifying",
    "hasArrow": true
  },
  {
    "id": "js-events-topic",
    "name": "9. Events & Event Delegation",
    "chapterRefId": "js-events",
    "hasArrow": true
  },
  {
    "id": "sec-async",
    "name": "Async & Web APIs",
    "isHeader": true,
    "chapterRefId": "js-async-promises"
  },
  {
    "id": "js-async-topic",
    "name": "10. Promises & Async/Await",
    "chapterRefId": "js-async-promises",
    "hasArrow": true
  },
  {
    "id": "js-storage-topic",
    "name": "11. Fetch REST & Web Storage",
    "chapterRefId": "js-fetch-storage",
    "hasArrow": true
  },
  {
    "id": "sec-oop",
    "name": "OOP & Architecture",
    "isHeader": true,
    "chapterRefId": "js-oop-classes"
  },
  {
    "id": "js-classes-topic",
    "name": "12. Classes & Private Fields (#)",
    "chapterRefId": "js-oop-classes",
    "hasArrow": true
  },
  {
    "id": "sec-interview",
    "name": "Interview Preparation",
    "isHeader": true,
    "chapterRefId": "js-interviews"
  },
  {
    "id": "js-interview-topic",
    "name": "13. Top 100 JavaScript Q&A",
    "chapterRefId": "js-interviews",
    "hasArrow": true
  }
];
