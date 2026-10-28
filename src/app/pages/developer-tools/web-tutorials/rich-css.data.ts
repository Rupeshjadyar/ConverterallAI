import { RichTutorialChapter, W3TopicItem } from './rich-tutorial.models';

export const ALL_RICH_CSS_CHAPTERS: RichTutorialChapter[] = [
  {
    "id": "css-overview",
    "chapterNumber": 1,
    "title": "CSS Overview, Syntax & The Cascade",
    "category": "CSS Fundamentals",
    "shortDesc": "Anatomy of CSS rules, Inline vs Internal vs External stylesheets, and the Cascade algorithm.",
    "overview": [
      "CSS (Cascading Style Sheets) is a stylesheet language used to describe the visual presentation and design of a document written in HTML or XML.",
      "The 'Cascading' algorithm determines how conflicts between competing style rules are resolved based on Origin, Specificity, and Source Order.",
      "CSS separates content (HTML structure) from presentation (layout, colors, typography, and motion)."
    ],
    "sections": [
      {
        "title": "Three Methods of CSS Inclusion Table",
        "theory": [
          "External Stylesheet (`<link rel=\"stylesheet\" href=\"style.css\">`): Industry standard. Cached by browser, re-usable across all pages.",
          "Internal Stylesheet (`<style>` in `<head>`): Scoped to a single HTML document.",
          "Inline Styles (`style=\"...\"` attribute): Attached directly to an HTML element. High specificity, violates separation of concerns.",
          "@import rule: Imports external stylesheet into another CSS file. Discouraged in production because it causes sequential blocking network requests."
        ],
        "table": [
          {
            "attribute": "External <link>",
            "value": "Recommended",
            "description": "Separate .css file. Cached across all pages. Clean separation of concerns."
          },
          {
            "attribute": "Internal <style>",
            "value": "Single Document",
            "description": "Placed in <head>. Affects current page only. Increases HTML payload."
          },
          {
            "attribute": "Inline style=\"...\"",
            "value": "Element Level",
            "description": "Highest specificity weight (1000). Impedes maintenance; avoid in production."
          },
          {
            "attribute": "@import url()",
            "value": "Sequential Load",
            "description": "Imports CSS from inside CSS. Blocks parallel browser resource downloads."
          }
        ],
        "codeExample": "/* CSS Rule Anatomy Demo */\n/* Selector { Property: Value; } */\nh1.hero-title {\n    color: #1e293b;\n    font-family: system-ui, -apple-system, sans-serif;\n    font-size: 2.5rem;\n    line-height: 1.2;\n    margin-bottom: 1rem;\n    text-align: center;\n}\n\n.btn-cta {\n    background-color: #04AA6D;\n    color: #ffffff;\n    padding: 12px 24px;\n    border-radius: 6px;\n    text-decoration: none;\n    display: inline-block;\n    font-weight: 600;\n}",
        "browserOutputDesc": "Displays a bold centered hero title followed by a green rounded call-to-action button."
      },
      {
        "title": "10th-Grade Analogy & Interview Point",
        "theory": [
          "Analogy: If HTML is the brick skeleton of a house, CSS is the interior decoration\u2014the paint colors, wallpaper, curtains, lighting, and furniture layout! The same brick house can look like a modern minimalist office or a cozy cottage just by swapping CSS styles!",
          "Interview Point: If asked 'How does the CSS Cascade resolve competing styles?', answer: In order of priority: 1) Importance (`!important`), 2) Origin (Author styles override User Agent default styles), 3) Specificity score (Inline 1000 > ID 100 > Class 10 > Element 1), 4) Source Order (The rule declared last in the stylesheet wins)."
        ],
        "codeExample": "/* Cascade & Source Order demonstration */\np.announcement {\n    color: #2563eb; /* Blue declared first */\n}\n\np.announcement {\n    color: #dc2626; /* Red declared last - WINS due to source order! */\n}",
        "browserOutputDesc": "Text displays in Red (#dc2626) because it was declared last with identical specificity."
      }
    ]
  },
  {
    "id": "css-selectors",
    "chapterNumber": 2,
    "title": "CSS Selectors, Combinators & Specificity Matrix",
    "category": "CSS Fundamentals",
    "shortDesc": "Universal, Type, Class, ID, Combinators (>, +, ~), and 4-column specificity calculations.",
    "overview": [
      "CSS selectors define which HTML elements a set of CSS rules will apply to.",
      "Specificity is a numerical weight assigned to a selector determining which style rule takes precedence when multiple rules target the same element."
    ],
    "sections": [
      {
        "title": "Combinators & Specificity Calculation Table",
        "theory": [
          "Descendant Combinator (`A B`): Targets any B element nested anywhere inside A.",
          "Child Combinator (`A > B`): Targets only direct children of A.",
          "Adjacent Sibling (`A + B`): Targets element B immediately following A.",
          "General Sibling (`A ~ B`): Targets all B elements following A sharing the same parent.",
          "Specificity Formula: `(Inline, ID, Class/Attr/Pseudo-class, Element/Pseudo-element)`."
        ],
        "table": [
          {
            "attribute": "Inline Style",
            "value": "(1, 0, 0, 0)",
            "description": "style=\"color: red\" on HTML tag. Weight = 1000."
          },
          {
            "attribute": "ID Selector (#id)",
            "value": "(0, 1, 0, 0)",
            "description": "#main-header. Weight = 100."
          },
          {
            "attribute": "Class / Attribute / :pseudo",
            "value": "(0, 0, 1, 0)",
            "description": ".btn, [type=\"text\"], :hover, :first-child. Weight = 10."
          },
          {
            "attribute": "Element / ::pseudo-element",
            "value": "(0, 0, 0, 1)",
            "description": "div, p, h1, ::before, ::after. Weight = 1."
          },
          {
            "attribute": "Universal (*)",
            "value": "(0, 0, 0, 0)",
            "description": "Universal selector, combinators (+, >, ~), and :where() have 0 specificity."
          }
        ],
        "codeExample": "/* Specificity Score Comparisons */\n/* (0, 0, 0, 1) = 1 */\np { color: black; }\n\n/* (0, 0, 1, 0) = 10 */\n.notice { color: blue; }\n\n/* (0, 0, 1, 1) = 11 (Wins over .notice!) */\np.notice { color: green; }\n\n/* (0, 1, 0, 0) = 100 (Wins over p.notice!) */\n#special-alert { color: purple; }\n\n/* Combinator Examples */\n/* Direct child only */\nul.nav-menu > li { display: inline-block; }\n\n/* Adjacent sibling paragraph following h2 */\nh2 + p { font-size: 1.15rem; color: #475569; }",
        "browserOutputDesc": "Elements apply purple color (#special-alert) over green (p.notice) and blue (.notice)."
      }
    ]
  },
  {
    "id": "css-box-model",
    "chapterNumber": 3,
    "title": "CSS Box Model & box-sizing: border-box",
    "category": "Layout & Box Model",
    "shortDesc": "Content, Padding, Border, Margin, box-sizing: content-box vs border-box, and Margin collapsing.",
    "overview": [
      "In CSS, every HTML element is treated as a rectangular box.",
      "The CSS Box Model consists of 4 layers from inside out: Content -> Padding -> Border -> Margin."
    ],
    "sections": [
      {
        "title": "content-box vs border-box Table",
        "theory": [
          "`content-box` (Default legacy): Width and height apply ONLY to content. Padding and border ADD to the total element width on screen (`Total = width + padding + border`). This breaks layouts!",
          "`border-box` (Modern standard): Width and height include content, padding, AND border. Element stays the exact width you specify (`Total = width`).",
          "Universal Box Sizing Reset: Always apply `*, *::before, *::after { box-sizing: border-box; }` at the root of every modern stylesheet.",
          "Margin Collapsing: Vertical margins between adjacent block elements collapse into a single margin equal to the largest of the two."
        ],
        "table": [
          {
            "attribute": "content-box",
            "value": "width + padding + border",
            "description": "Legacy default. Adding 20px padding expands overall element width."
          },
          {
            "attribute": "border-box",
            "value": "width = exact total",
            "description": "Modern reset. Padding and border shrink inner content; element never overflows."
          },
          {
            "attribute": "padding",
            "value": "Transparent Inner Gap",
            "description": "Space between content and border. Inherits background color."
          },
          {
            "attribute": "margin",
            "value": "External Spacing",
            "description": "Space outside border separating element from neighboring elements."
          }
        ],
        "codeExample": "/* Universal Modern Box Sizing Reset */\n*, *::before, *::after {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n}\n\n.card-container {\n    width: 300px;\n    padding: 24px;\n    border: 4px solid #04AA6D;\n    margin: 20px auto;\n    background-color: #f8fafc;\n    /* With border-box, total element width is guaranteed exactly 300px! */\n}",
        "browserOutputDesc": "Displays a card container whose outer edge measures exactly 300px wide including 24px padding and 4px border."
      }
    ]
  },
  {
    "id": "css-flexbox",
    "chapterNumber": 4,
    "title": "CSS Flexbox: Container & Item Properties",
    "category": "Modern Layouts",
    "shortDesc": "1D layout model, main axis vs cross axis, justify-content, align-items, flex-direction, gap, and flex-grow/shrink.",
    "overview": [
      "Flexible Box Layout (Flexbox) is a 1-dimensional CSS layout model designed to distribute space and align items along a single axis (either row or column).",
      "Flexbox eliminates fragile float hacks, provides trivial vertical centering, and dynamically expands/shrinks items based on available screen space."
    ],
    "sections": [
      {
        "title": "Flex Container & Item Properties Table",
        "theory": [
          "Main Axis: Dictated by `flex-direction: row` (horizontal, default) or `column` (vertical).",
          "Cross Axis: Perpendicular to Main Axis.",
          "`justify-content`: Controls item distribution along the Main Axis.",
          "`align-items`: Controls item alignment along the Cross Axis.",
          "`gap`: Sets gutter spacing between flex items without needing margin hacks."
        ],
        "table": [
          {
            "attribute": "display: flex",
            "value": "Container",
            "description": "Establishes flex context for direct child elements."
          },
          {
            "attribute": "flex-direction",
            "value": "row | column",
            "description": "Defines main axis direction (horizontal row or vertical column)."
          },
          {
            "attribute": "justify-content",
            "value": "flex-start | center | space-between",
            "description": "Distributes extra space along main axis."
          },
          {
            "attribute": "align-items",
            "value": "stretch | center | flex-start",
            "description": "Aligns items along cross axis (e.g. perfect vertical centering)."
          },
          {
            "attribute": "flex-grow",
            "value": "Item (number >= 0)",
            "description": "Determines proportional ability to absorb remaining container space."
          },
          {
            "attribute": "flex-shrink",
            "value": "Item (number >= 0)",
            "description": "Determines proportional ability to shrink when container space is insufficient."
          }
        ],
        "codeExample": "/* Modern Flexbox Navbar & Centering */\n.navbar {\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    padding: 1rem 2rem;\n    background-color: #0f172a;\n    color: #ffffff;\n}\n\n.nav-links {\n    display: flex;\n    gap: 1.5rem; /* Modern flex gap */\n    list-style: none;\n}\n\n/* Perfect Horizontal and Vertical Centering with Flexbox */\n.hero-center-box {\n    display: flex;\n    justify-content: center; /* Center horizontally */\n    align-items: center;     /* Center vertically */\n    min-height: 250px;\n    background-color: #f1f5f9;\n}",
        "browserOutputDesc": "Renders a clean responsive navbar with spaced logo and navigation links, followed by a vertically centered hero box."
      }
    ]
  },
  {
    "id": "css-grid",
    "chapterNumber": 5,
    "title": "CSS Grid: Container, Tracks & Template Areas",
    "category": "Modern Layouts",
    "shortDesc": "2D layout model, grid-template-columns, repeat(auto-fit, minmax()), grid-template-areas, and fractional units (fr).",
    "overview": [
      "CSS Grid Layout is a 2-dimensional layout system that handles both columns AND rows simultaneously.",
      "Grid excels at macro page layouts (header, sidebar, content, footer) and responsive auto-fitting card dashboards."
    ],
    "sections": [
      {
        "title": "Responsive Auto-Fit Grid Pattern without Media Queries",
        "theory": [
          "`repeat(auto-fit, minmax(280px, 1fr))`: Creates as many 280px columns as fit on screen, expanding them proportionally (`1fr`). Fully responsive without a single media query!",
          "`grid-template-areas`: Allows naming layout regions visually with ASCII-art syntax (`\"header header\" \"sidebar main\" \"footer footer\"`).",
          "Fractional Unit (`fr`): Represents a fraction of the available free space in the grid container."
        ],
        "table": [
          {
            "attribute": "display: grid",
            "value": "Container",
            "description": "Defines element as a grid container."
          },
          {
            "attribute": "grid-template-columns",
            "value": "Track Listing",
            "description": "Defines column widths (e.g. 200px 1fr 1fr or repeat(12, 1fr))."
          },
          {
            "attribute": "grid-template-rows",
            "value": "Track Listing",
            "description": "Defines row heights (e.g. auto 1fr auto)."
          },
          {
            "attribute": "gap",
            "value": "Row & Col Gutters",
            "description": "Defines spacing between grid cells without margin hacks."
          },
          {
            "attribute": "grid-column",
            "value": "Item: span n",
            "description": "Specifies item's start and end column tracks (e.g. 1 / -1 for full width)."
          }
        ],
        "codeExample": "/* Ultra-Responsive Auto-Fitting Grid Dashboard */\n.dashboard-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n    gap: 1.5rem;\n    padding: 1.5rem;\n}\n\n.dashboard-card {\n    background: #ffffff;\n    border: 1px solid #e2e8f0;\n    border-radius: 8px;\n    padding: 1.5rem;\n    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n}",
        "browserOutputDesc": "Displays responsive cards that wrap automatically from 4 columns on desktop down to 1 column on mobile."
      }
    ]
  },
  {
    "id": "css-responsive",
    "chapterNumber": 6,
    "title": "CSS Responsive Web Design & Media Queries",
    "category": "Responsive Design",
    "shortDesc": "Mobile-first philosophy, @media screen and (min-width), viewport meta tag, and fluid typography.",
    "overview": [
      "Responsive Web Design (RWD) ensures that web pages render smoothly across all device screen sizes (mobile phones, tablets, laptops, and ultra-wide desktops).",
      "The Mobile-First approach writes base CSS for small screens first, adding `min-width` media queries to progressively enhance the experience as screen real estate increases."
    ],
    "sections": [
      {
        "title": "Standard Responsive Breakpoints Table",
        "theory": [
          "Always include `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">` in HTML `<head>`.",
          "Mobile-First: Use `@media (min-width: 768px)` (enhancement). Avoid desktop-first `max-width` cascades where mobile styles must constantly override desktop rules.",
          "Fluid Typography: Use `clamp(min, preferred, max)` (e.g. `font-size: clamp(1.25rem, 2vw + 1rem, 2.5rem);`) for fluid text scaling without media query jumps."
        ],
        "table": [
          {
            "attribute": "< 640px",
            "value": "Mobile (Default)",
            "description": "Single-column stacked layouts, touch-friendly tap targets (min 44px)."
          },
          {
            "attribute": ">= 640px",
            "value": "sm: Tablets (Portrait)",
            "description": "@media (min-width: 640px) - 2-column grids."
          },
          {
            "attribute": ">= 768px",
            "value": "md: Tablets (Landscape)",
            "description": "@media (min-width: 768px) - Sidebars visible, horizontal navigation."
          },
          {
            "attribute": ">= 1024px",
            "value": "lg: Laptops / Desktop",
            "description": "@media (min-width: 1024px) - Multi-column layouts, sticky toolbars."
          },
          {
            "attribute": ">= 1280px",
            "value": "xl: Large Displays",
            "description": "@media (min-width: 1280px) - Max container width constraints (1200px)."
          }
        ],
        "codeExample": "/* Mobile-First Responsive Stylesheet Demo */\n.main-layout {\n    display: flex;\n    flex-direction: column; /* Stack vertically on mobile */\n    gap: 1rem;\n}\n\n/* Enhance to side-by-side on tablet/desktop */\n@media (min-width: 768px) {\n    .main-layout {\n        flex-direction: row; /* Horizontal columns on desktop */\n    }\n    \n    .sidebar {\n        width: 280px;\n        flex-shrink: 0;\n    }\n    \n    .content {\n        flex-grow: 1;\n    }\n}",
        "browserOutputDesc": "Stacked vertical layout on screens < 768px; turns into sidebar + content layout on screens >= 768px."
      }
    ]
  },
  {
    "id": "css-animations",
    "chapterNumber": 7,
    "title": "CSS Transitions, Transforms & @keyframes Animations",
    "category": "Motion & Interactivity",
    "shortDesc": "transition shorthand, 2D/3D transforms (translate, rotate, scale), GPU compositing, and @keyframes animations.",
    "overview": [
      "CSS enables smooth visual animations without JavaScript by leveraging GPU hardware acceleration.",
      "Transitions interpolate between two states on hover or focus, while Keyframe Animations create looping, multi-step choreographies."
    ],
    "sections": [
      {
        "title": "GPU Accelerated Properties Table",
        "theory": [
          "High Performance Animation Rule: Only animate `transform` and `opacity`. Animating `width`, `height`, `margin`, or `top/left` triggers expensive browser layout reflows and repaints, causing stutter (jank).",
          "`transform: translate3d(x, y, 0)` promotes the element to its own GPU compositor layer.",
          "`@keyframes`: Defines key stages (`from` / `to` or percentage checkpoints `0%`, `50%`, `100%`)."
        ],
        "table": [
          {
            "attribute": "transition",
            "value": "Shorthand",
            "description": "transition: property duration timing-function delay (e.g. all 0.3s ease)."
          },
          {
            "attribute": "transform: scale(n)",
            "value": "GPU Transform",
            "description": "Resizes element visually without affecting surrounding layout flow."
          },
          {
            "attribute": "transform: translate(x, y)",
            "value": "GPU Transform",
            "description": "Moves element on X/Y plane without triggering DOM reflow."
          },
          {
            "attribute": "@keyframes name",
            "value": "Animation Definition",
            "description": "Specifies keyframe stages from 0% to 100%."
          },
          {
            "attribute": "animation-fill-mode: forwards",
            "value": "State Persistence",
            "description": "Retains final keyframe styling when animation finishes."
          }
        ],
        "codeExample": "/* Smooth Button Hover & Keyframe Pulse Animation */\n.btn-interactive {\n    background-color: #2563eb;\n    color: #ffffff;\n    padding: 12px 28px;\n    border-radius: 8px;\n    border: none;\n    cursor: pointer;\n    /* Hardware-accelerated transition */\n    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease;\n}\n\n.btn-interactive:hover {\n    background-color: #1d4ed8;\n    transform: translateY(-2px) scale(1.02);\n}\n\n/* Infinite Pulse Keyframe */\n@keyframes pulseBadge {\n    0% { transform: scale(1); opacity: 1; }\n    50% { transform: scale(1.08); opacity: 0.85; }\n    100% { transform: scale(1); opacity: 1; }\n}\n\n.live-status-dot {\n    width: 12px;\n    height: 12px;\n    background-color: #22c55e;\n    border-radius: 50%;\n    display: inline-block;\n    animation: pulseBadge 2s infinite ease-in-out;\n}",
        "browserOutputDesc": "Displays an interactive button that lifts on hover, accompanied by a pulsing green live status indicator."
      }
    ]
  },
  {
    "id": "css-variables-calc",
    "chapterNumber": 8,
    "title": "CSS Custom Properties (Variables) & Math Functions",
    "category": "Modern Layouts",
    "shortDesc": "CSS variables (--primary-color), var() fallbacks, dynamic theming (Dark/Light mode), calc(), and clamp().",
    "overview": [
      "CSS Custom Properties (commonly known as CSS Variables) allow you to store and reuse values throughout your stylesheets.",
      "Unlike preprocessor variables (SASS/LESS), native CSS variables are dynamic, live in the browser DOM, inherit down the element tree, and can be modified in real-time with JavaScript."
    ],
    "sections": [
      {
        "title": "CSS Custom Properties & Math Functions Table",
        "theory": [
          "Declaration: Prefix property name with two dashes `--primary-color: #04AA6D;`.",
          "Usage: `color: var(--primary-color, #fallback);`.",
          "Theming: Define variables on `:root` for global scope. Override inside `[data-theme=\"dark\"]` for instant zero-JS dark mode switching!",
          "`calc()`: Allows arithmetic mixing different units (e.g. `width: calc(100% - 40px);`).",
          "`clamp(min, val, max)`: Restricts a value between an absolute minimum and maximum."
        ],
        "table": [
          {
            "attribute": "--var-name",
            "value": "Custom Property",
            "description": "Defines custom variable on selector or :root."
          },
          {
            "attribute": "var(--name, fallback)",
            "value": "Variable Accessor",
            "description": "Retrieves variable value with optional fallback."
          },
          {
            "attribute": "calc(a - b)",
            "value": "Math Calculation",
            "description": "Performs calculations mixing px, %, rem, and vh units."
          },
          {
            "attribute": "clamp(min, pref, max)",
            "value": "Bound Limiter",
            "description": "Restricts value between lower and upper boundaries fluidly."
          }
        ],
        "codeExample": "/* Dynamic Dark/Light Theme with Native CSS Variables */\n:root {\n    --bg-primary: #ffffff;\n    --text-primary: #0f172a;\n    --brand-accent: #04AA6D;\n}\n\n[data-theme=\"dark\"] {\n    --bg-primary: #0f172a;\n    --text-primary: #f8fafc;\n    --brand-accent: #10b981;\n}\n\nbody {\n    background-color: var(--bg-primary);\n    color: var(--text-primary);\n    font-size: clamp(1rem, 1vw + 0.5rem, 1.25rem); /* Fluid font */\n    transition: background-color 0.3s ease, color 0.3s ease;\n}",
        "browserOutputDesc": "Demonstrates fluid typography and seamless theme variable switching between light and dark backgrounds."
      }
    ]
  },
  {
    "id": "css-interviews",
    "chapterNumber": 9,
    "title": "Top 100 CSS Interview Questions & Architecture",
    "category": "Interview Preparation",
    "shortDesc": "Frequently asked CSS interview questions: BEM methodology, centering techniques, stacking contexts, and speaking points.",
    "overview": [
      "Front-end technical interviews rigorously test your grasp of CSS specificity, stacking contexts (z-index), responsive layouts, and clean architecture.",
      "Review these concise, high-impact answers before your technical design or UI interview."
    ],
    "sections": [
      {
        "title": "Core CSS Interview Q&A (Speaking Points)",
        "theory": [
          "Q1: What are all the ways to center an element horizontally and vertically in CSS?",
          "Speaking Point: Method 1 (Modern Flexbox): Parent `display: flex; justify-content: center; align-items: center;`. Method 2 (CSS Grid): Parent `display: grid; place-items: center;` (shortest one-liner). Method 3 (Absolute): Child `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`.",
          "----------------------------------------",
          "Q2: What creates a new Stacking Context in CSS?",
          "Speaking Point: A stacking context is created by: 1) Root `<html>`, 2) Positioned element (`relative/absolute/fixed/sticky`) with a `z-index` other than `auto`, 3) Element with `opacity` less than 1, 4) Element with `transform`, `filter`, or `perspective`, 5) Element with `isolation: isolate`.",
          "----------------------------------------",
          "Q3: What is the BEM methodology?",
          "Speaking Point: BEM stands for Block, Element, Modifier. It is a naming convention that creates modular, reusable styles with low specificity (all classes have specificity 10). Example: `.card` (Block), `.card__title` (Element), `.card--featured` (Modifier).",
          "----------------------------------------",
          "Q4: What is the difference between CSS Reset and CSS Normalize?",
          "Speaking Point: CSS Reset aggressively removes all browser default styles (clearing margins, paddings, list bullets). CSS Normalize preserves useful browser defaults (like heading font-weight and form styles) while fixing cross-browser inconsistencies and bugs."
        ],
        "codeExample": "/* BEM Methodology Example */\n/* Block */\n.pricing-card {\n    border: 1px solid #cbd5e1;\n    border-radius: 8px;\n    padding: 2rem;\n}\n\n/* Element */\n.pricing-card__title {\n    font-size: 1.5rem;\n    font-weight: 700;\n}\n\n/* Element */\n.pricing-card__price {\n    color: #04AA6D;\n    font-size: 2rem;\n}\n\n/* Modifier */\n.pricing-card--popular {\n    border: 2px solid #04AA6D;\n    box-shadow: 0 10px 15px -3px rgba(4, 170, 109, 0.2);\n}",
        "browserOutputDesc": "Displays a modular BEM-structured pricing card with clean modifier highlighting."
      }
    ]
  }
];

export const ALL_RICH_CSS_TOPICS: W3TopicItem[] = [
  {
    "id": "sec-fundamentals",
    "name": "CSS Fundamentals",
    "isHeader": true,
    "chapterRefId": "css-overview"
  },
  {
    "id": "css-overview-topic",
    "name": "1. CSS Overview & Cascade",
    "chapterRefId": "css-overview",
    "hasArrow": true
  },
  {
    "id": "css-selectors-topic",
    "name": "2. Selectors & Specificity Matrix",
    "chapterRefId": "css-selectors",
    "hasArrow": true
  },
  {
    "id": "sec-box-model",
    "name": "Box Model & Sizing",
    "isHeader": true,
    "chapterRefId": "css-box-model"
  },
  {
    "id": "css-box-topic",
    "name": "3. Box Model & border-box",
    "chapterRefId": "css-box-model",
    "hasArrow": true
  },
  {
    "id": "sec-layouts",
    "name": "Modern Layouts",
    "isHeader": true,
    "chapterRefId": "css-flexbox"
  },
  {
    "id": "css-flexbox-topic",
    "name": "4. Flexbox: Container & Items",
    "chapterRefId": "css-flexbox",
    "hasArrow": true
  },
  {
    "id": "css-grid-topic",
    "name": "5. CSS Grid & Auto-Fit",
    "chapterRefId": "css-grid",
    "hasArrow": true
  },
  {
    "id": "css-responsive-topic",
    "name": "6. Responsive Design & Queries",
    "chapterRefId": "css-responsive",
    "hasArrow": true
  },
  {
    "id": "sec-motion",
    "name": "Interactivity & Theming",
    "isHeader": true,
    "chapterRefId": "css-animations"
  },
  {
    "id": "css-animations-topic",
    "name": "7. Transitions, Transforms & Keyframes",
    "chapterRefId": "css-animations",
    "hasArrow": true
  },
  {
    "id": "css-vars-topic",
    "name": "8. Variables (--var) & clamp()",
    "chapterRefId": "css-variables-calc",
    "hasArrow": true
  },
  {
    "id": "sec-interview",
    "name": "Interview Preparation",
    "isHeader": true,
    "chapterRefId": "css-interviews"
  },
  {
    "id": "css-interview-topic",
    "name": "9. Top 100 CSS Q&A",
    "chapterRefId": "css-interviews",
    "hasArrow": true
  }
];
