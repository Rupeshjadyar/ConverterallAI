export interface TutorialTopic {
  id: string;
  title: string;
  category: string;
  summary: string;
  explanation: string;
  codeSnippet: string;
}

export interface LanguageModule {
  id: 'html' | 'css' | 'js';
  name: string;
  icon: string;
  accentColor: string;
  description: string;
  topics: TutorialTopic[];
}

export const HTML_TOPICS: TutorialTopic[] = [
  {
    "id": "html-overview",
    "title": "1. HTML – Overview",
    "category": "Fundamentals",
    "summary": "HTML stands for Hypertext Markup Language, used worldwide to write Web pages.",
    "explanation": "Hypertext refers to the way in which Web pages are linked together via hyperlinks. HTML is a Markup Language which simply marks up text documents with tags that instruct web browsers on how to structure and display content.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head>\n  <title>This is document title</title>\n</head>\n<body>\n  <h1>This is a heading</h1>\n  <p>Document content goes here.....</p>\n</body>\n</html>"
  },
  {
    "id": "html-basic-tags",
    "title": "2. HTML – Basic Tags",
    "category": "Fundamentals",
    "summary": "Headings (h1-h6), Paragraphs (p), Line breaks (br), Horizontal lines (hr), and pre.",
    "explanation": "Headings start with <h1> to <h6>. Paragraphs use <p>. Line breaks use empty element <br /> without closing tags. <hr /> draws horizontal separator rules, and <pre> preserves raw spaces and line indentations.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head><title>Basic Tags Example</title></head>\n<body>\n  <h1>Main Heading</h1>\n  <p>Here is a paragraph of text.<br />Now continuing on a brand new line.</p>\n  <hr />\n  <pre>\n    Code or ASCII Art\n      Indented block of text\n  </pre>\n</body>\n</html>"
  },
  {
    "id": "html-elements",
    "title": "3. HTML – Elements",
    "category": "Core Concepts",
    "summary": "Tags vs Elements, Void Elements, and Nested Elements hierarchy.",
    "explanation": "An HTML Element is defined by a start tag, content, and an end tag (<p>Content</p>). Elements without closing tags like <img />, <hr />, <br /> are void elements. Elements can be nested inside one another to construct tree hierarchies.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head><title>Nested Elements</title></head>\n<body>\n  <h1>This is <i>italic</i> heading</h1>\n  <p>This is <u>underlined</u> paragraph with <b>bold</b> accents.</p>\n</body>\n</html>"
  },
  {
    "id": "html-attributes",
    "title": "4. HTML – Attributes",
    "category": "Core Concepts",
    "summary": "Core Attributes (id, title, class, style) and Internationalization (dir, lang).",
    "explanation": "Attributes define characteristics of HTML elements with name=\"value\" pairs in opening tags. The 4 core attributes are id (unique identifier), class (CSS style selector), title (hover tooltip), and style (inline CSS). \"dir\" sets text direction (ltr/rtl) and \"lang\" sets language.",
    "codeSnippet": "<!DOCTYPE html>\n<html lang=\"en\" dir=\"ltr\">\n<head><title>Attributes Example</title></head>\n<body>\n  <h2 id=\"main-title\" title=\"Hover Tooltip Example\" style=\"color: #04AA6D;\">Titled Heading</h2>\n  <p class=\"intro-text\" align=\"center\">Centered paragraph using alignment attribute.</p>\n</body>\n</html>"
  },
  {
    "id": "html-formatting",
    "title": "5. HTML – Formatting",
    "category": "Text Formatting",
    "summary": "Bold, Italic, Underlined, Strike, Monospaced (tt), Subscript, Superscript, Ins, Del, Small, Big.",
    "explanation": "Visual text formatting tags include <b> (bold), <i> (italic), <u> (underline), <strike> (strikethrough), <tt> (monospace), <sup> (superscript), <sub> (subscript), <ins> (inserted), <del> (deleted text), and <small>/<big>.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <p>Formatting showcase:</p>\n  <p><b>Bold</b>, <i>Italic</i>, <u>Underline</u>, <strike>Strikethrough</strike></p>\n  <p>Water formula: H<sub>2</sub>O and Math: 5<sup>2</sup> = 25</p>\n  <p>Price: <del>$99</del> <ins>$49</ins></p>\n  <p><big>Larger font</big> vs <small>Smaller note</small></p>\n</body>\n</html>"
  },
  {
    "id": "html-phrase-tags",
    "title": "6. HTML – Phrase Tags",
    "category": "Text Formatting",
    "summary": "Semantic tags: em, strong, mark, abbr, acronym, bdo, dfn, blockquote, q, cite, code, kbd, var, samp, address.",
    "explanation": "Phrase tags convey structural meaning: <em> (emphasized), <strong> (important), <mark> (yellow highlight), <abbr> (abbreviation with title), <bdo> (bi-directional override), <code> (computer code), <kbd> (keyboard key), <samp> (output), <var> (variable), and <address>.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <p><strong>Warning:</strong> Always validate <mark>user input</mark>.</p>\n  <p>Organization: <abbr title=\"World Health Organization\">WHO</abbr></p>\n  <p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.</p>\n  <p>Formula: <var>x</var> + <var>y</var> = <code>result</code></p>\n  <address>Written by Antigravity Dev Team, Silicon Valley.</address>\n</body>\n</html>"
  },
  {
    "id": "html-meta-tags",
    "title": "7. HTML – Meta Tags",
    "category": "Document Head",
    "summary": "Metadata: keywords, description, author, revision date, refresh, redirection, charset, and cookies.",
    "explanation": "<meta> tags reside inside the <head> element and provide document information to search engines and browsers. Attributes include name, content, http-equiv (refresh, cookies, redirection), and charset.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"keywords\" content=\"HTML, CSS, JavaScript, Web Tutorial\">\n  <meta name=\"description\" content=\"Master HTML with live code examples.\">\n  <meta name=\"author\" content=\"Tutorial Team\">\n  <meta http-equiv=\"refresh\" content=\"30\">\n  <title>Document Metadata Demo</title>\n</head>\n<body>\n  <h1>Meta Tags In Action</h1>\n  <p>Inspect page source to see search engine indexing tags.</p>\n</body>\n</html>"
  },
  {
    "id": "html-comments",
    "title": "8. HTML – Comments",
    "category": "Fundamentals",
    "summary": "Single-line, Multiline, Conditional comments, and commenting scripts/stylesheets.",
    "explanation": "HTML comments use <!-- ... --> to add developer documentation. Browsers do not display comment text. Also used to hide JavaScript and CSS in legacy browsers without breakage.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head>\n  <!-- Document Header Starts -->\n  <title>Comments Demonstration</title>\n</head>\n<body>\n  <!-- This is a single line comment -->\n  <p>Visible content on screen.</p>\n  <!--\n    Multiline comment block:\n    Author: Web Master\n    Version: 2.0\n  -->\n</body>\n</html>"
  },
  {
    "id": "html-images",
    "title": "9. HTML – Images",
    "category": "Media & Assets",
    "summary": "img tag: src, alt, width, height, border, alignment, and directory paths.",
    "explanation": "Images are inserted via the empty <img> tag. The \"src\" attribute specifies URL/path, \"alt\" gives fallback text for accessibility, \"width\" and \"height\" constrain sizing, and \"align\" controls inline text flow.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head><title>Images Example</title></head>\n<body>\n  <h2>Inserting Responsive Image</h2>\n  <img \n    src=\"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80\" \n    alt=\"Developer workspace laptop\" \n    width=\"380\" \n    style=\"border-radius: 8px; border: 2px solid #04AA6D;\"\n  />\n</body>\n</html>"
  },
  {
    "id": "html-tables",
    "title": "10. HTML – Tables",
    "category": "Data & Tables",
    "summary": "table, tr, td, th, caption, thead, tbody, tfoot, colspan, rowspan, cellpadding, cellspacing.",
    "explanation": "HTML tables organize tabular data into rows (<tr>), headings (<th>), and data cells (<td>). Attributes include border, cellpadding, cellspacing, colspan (span columns), and rowspan (span rows). Modern tables partition with <thead>, <tbody>, and <tfoot>.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head><title>HTML Table</title></head>\n<body>\n  <table border=\"1\" cellpadding=\"8\" cellspacing=\"0\" style=\"width: 100%; border-collapse: collapse;\">\n    <thead>\n      <tr bgcolor=\"#04AA6D\" style=\"color: white;\">\n        <th>Language</th>\n        <th>Role</th>\n        <th>Standard</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr><td>HTML5</td><td>Structure</td><td>W3C / WHATWG</td></tr>\n      <tr><td>CSS3</td><td>Presentation</td><td>W3C</td></tr>\n      <tr><td>JavaScript</td><td>Interactivity</td><td>ECMAScript</td></tr>\n    </tbody>\n  </table>\n</body>\n</html>"
  },
  {
    "id": "html-lists",
    "title": "11. HTML – Lists",
    "category": "Lists & Navigation",
    "summary": "Unordered lists (ul), Ordered lists (ol), Definition lists (dl, dt, dd), type and start attributes.",
    "explanation": "HTML provides 3 list formats: <ul> (bulleted with type=\"disc|circle|square\"), <ol> (numbered with type=\"1|a|A|i|I\" and start=\"number\"), and <dl> (definition lists with <dt> terms and <dd> definitions).",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Ordered Roman Numerals</h3>\n  <ol type=\"I\" start=\"3\">\n    <li>HTML Overview</li>\n    <li>HTML Formatting</li>\n    <li>HTML Tables</li>\n  </ol>\n\n  <h3>Definition List</h3>\n  <dl>\n    <dt><b>HTML</b></dt>\n    <dd>HyperText Markup Language</dd>\n    <dt><b>DOM</b></dt>\n    <dd>Document Object Model</dd>\n  </dl>\n</body>\n</html>"
  },
  {
    "id": "html-text-links",
    "title": "12. HTML – Text Links",
    "category": "Hyperlinks",
    "summary": "Anchor tag (a), href, target (_blank, _self, _parent, _top), base URL, bookmarks, download links.",
    "explanation": "Hyperlinks are created using <a href=\"url\">. The \"target\" attribute specifies where the link opens: _blank (new tab), _self (same tab). Use <a name=\"bookmark\"> or href=\"#id\" to jump to page sections, and download attribute for file downloads.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <h2>Hyperlinks Exploration</h2>\n  <p><a href=\"https://www.w3.org\" target=\"_blank\" rel=\"noopener\">Open W3C in New Tab (_blank)</a></p>\n  <p><a href=\"#footer-section\">Jump to Footer Bookmark</a></p>\n  <p><a href=\"sample.pdf\" download=\"manual.pdf\">Download PDF Document</a></p>\n  <div style=\"margin-top: 100px;\" id=\"footer-section\">\n    <h4>Footer Destination Bookmark</h4>\n  </div>\n</body>\n</html>"
  },
  {
    "id": "html-image-links",
    "title": "13. HTML – Image Links",
    "category": "Hyperlinks",
    "summary": "Clickable images, Server-Side Image Maps (ismap), and Client-Side Image Maps (usemap, map, area).",
    "explanation": "Wrap an <img> inside <a> to make it a clickable button/link. Client-side image maps (<map name=\"...\"> with <area shape=\"rect|circle|poly\" coords=\"...\">) let you define multiple interactive click zones inside a single image.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Clickable Linked Image</h3>\n  <a href=\"https://wikipedia.org\" target=\"_blank\">\n    <img src=\"https://picsum.photos/300/120\" alt=\"Clickable banner\" style=\"border-radius: 6px;\">\n  </a>\n\n  <!-- Image Map Coordinates -->\n  <map name=\"samplemap\">\n    <area shape=\"rect\" coords=\"0,0,150,120\" href=\"#left\" alt=\"Left Side\">\n    <area shape=\"rect\" coords=\"151,0,300,120\" href=\"#right\" alt=\"Right Side\">\n  </map>\n</body>\n</html>"
  },
  {
    "id": "html-email-links",
    "title": "14. HTML – Email Links",
    "category": "Hyperlinks",
    "summary": "mailto: protocol, default subject, body parameters, and cc/bcc.",
    "explanation": "HTML <a> tag creates email hyperlinks using the mailto: scheme. You can pre-fill subject and body queries: <a href=\"mailto:name@mail.com?subject=Inquiry&body=Hello\">.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <h2>Send Email via HTML Mailto</h2>\n  <a href=\"mailto:support@example.com?subject=Help%20Request&body=Hi%20Support%20Team,\">\n    📧 Click here to Contact Support (Pre-filled Subject)\n  </a>\n</body>\n</html>"
  },
  {
    "id": "html-frames",
    "title": "15. HTML – Frames",
    "category": "Frames & Layout",
    "summary": "frameset, frame, noframes, rows, cols, frame targeting, and drawbacks.",
    "explanation": "Legacy HTML divided browser windows into multiple independent HTML document windows using <frameset rows=\"%,%\"> and <frame src=\"...\">. <noframes> provided fallback for unsupported browsers. Deprecated in modern HTML5 in favor of iframes/CSS grid.",
    "codeSnippet": "<!-- Note: Classic HTML 4.01 frameset skeleton -->\n<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Frameset//EN\">\n<html>\n<head><title>HTML Frameset Example</title></head>\n<frameset cols=\"20%,80%\">\n  <frame src=\"menu.html\" name=\"menu_frame\">\n  <frame src=\"content.html\" name=\"main_frame\">\n  <noframes>\n    <body><p>Your browser does not support frames.</p></body>\n  </noframes>\n</frameset>\n</html>"
  },
  {
    "id": "html-iframes",
    "title": "16. HTML – Iframes",
    "category": "Frames & Layout",
    "summary": "Inline frames: iframe src, width, height, frameborder, name, scrolling, sandbox, seamless.",
    "explanation": "An inline frame (<iframe>) embeds an external document directly into an HTML page without replacing the body. HTML5 adds the \"sandbox\" attribute to enforce strict security restrictions against embedded scripts.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <h2>Modern HTML5 Iframe</h2>\n  <iframe \n    src=\"https://example.com\" \n    width=\"100%\" \n    height=\"240\" \n    style=\"border: 1px solid #ccc; border-radius: 8px;\"\n    sandbox=\"allow-scripts allow-same-origin\"\n    title=\"Example Embedded Document\"\n  ></iframe>\n</body>\n</html>"
  },
  {
    "id": "html-blocks",
    "title": "17. HTML – Blocks",
    "category": "Layout & Grouping",
    "summary": "Block-level vs Inline elements, <div> layout containers, and <span> inline grouping.",
    "explanation": "Block-level elements (div, p, h1-h6, table, ul) always start on a new line and stretch the full width available. Inline elements (span, b, i, a, img) flow within text lines and only take up the width of their content.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <!-- Block container -->\n  <div style=\"background: #f1f5f9; padding: 16px; border-left: 4px solid #04AA6D;\">\n    <h3>Block Element Container (&lt;div&gt;)</h3>\n    <p>This is paragraph text with <span style=\"color: red; font-weight: bold;\">inline colored text</span> using &lt;span&gt;.</p>\n  </div>\n</body>\n</html>"
  },
  {
    "id": "html-backgrounds",
    "title": "18. HTML – Backgrounds",
    "category": "Styling",
    "summary": "bgcolor attribute, background image URLs, tiled patterns, and transparent backgrounds.",
    "explanation": "HTML allows backgrounds via the \"bgcolor\" attribute (color name, HEX, or RGB) or the \"background\" attribute (image URL pattern). In modern web standards, CSS background-color and background-image are preferred.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head><title>Backgrounds Demo</title></head>\n<body bgcolor=\"#F4F6F8\">\n  <div style=\"background-color: #04AA6D; color: white; padding: 20px; border-radius: 6px;\">\n    <h2>Colored Background Container</h2>\n    <p>Controlled via background color hex (#04AA6D).</p>\n  </div>\n</body>\n</html>"
  },
  {
    "id": "html-colors",
    "title": "19. HTML – Colors",
    "category": "Styling",
    "summary": "Color Names (16 W3C standards), Hex Codes (#RRGGBB), RGB values rgb(r,g,b), and browser safe palette.",
    "explanation": "Colors are defined by predefined color names (Aqua, Lime, Teal, Maroon, etc.), 6-digit Hexadecimal codes (#000000 to #FFFFFF), or decimal RGB rgb(red, green, blue). The 216 browser-safe palette guarantees cross-device fidelity.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <h3 style=\"color: Teal;\">1. Named Color: Teal</h3>\n  <h3 style=\"color: #04AA6D;\">2. Hex Color: #04AA6D (W3 Green)</h3>\n  <h3 style=\"color: rgb(37, 99, 235);\">3. RGB Color: rgb(37, 99, 235) (Blue)</h3>\n</body>\n</html>"
  },
  {
    "id": "html-fonts",
    "title": "20. HTML – Fonts",
    "category": "Typography",
    "summary": "font tag, basefont, font size (1 to 7), relative size (+1/-1), font face, and font color.",
    "explanation": "Legacy HTML manipulated typography with <font size=\"1-7\" color=\"...\" face=\"...\"> and <basefont>. While deprecated in HTML5 in favor of CSS font properties, understanding them is essential for legacy codebase maintenance.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <!-- Legacy font syntax demo -->\n  <p><font face=\"Verdana\" size=\"4\" color=\"#04AA6D\">Styled with font tag</font></p>\n  <p><font size=\"+2\" color=\"blue\">Relative font size (+2 larger)</font></p>\n</body>\n</html>"
  },
  {
    "id": "html-forms",
    "title": "21. HTML – Forms",
    "category": "Forms & User Input",
    "summary": "form tag, action, method (GET/POST), text inputs, password, textarea, checkbox, radio, select, upload, buttons.",
    "explanation": "Forms collect user input and submit it to server endpoints. Controls include <input type=\"text|password|checkbox|radio|file|submit\">, multi-line <textarea rows cols>, and dropdown <select> with <option>. Attributes include action, method, enctype, and name.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <form action=\"/submit\" method=\"POST\">\n    <p>Username: <input type=\"text\" name=\"user\" required></p>\n    <p>Password: <input type=\"password\" name=\"pwd\" required></p>\n    <p>Skills: \n      <input type=\"checkbox\" id=\"h\" name=\"skills\" value=\"html\"><label for=\"h\"> HTML</label>\n      <input type=\"checkbox\" id=\"c\" name=\"skills\" value=\"css\"><label for=\"c\"> CSS</label>\n    </p>\n    <p>Gender:\n      <input type=\"radio\" id=\"m\" name=\"gen\" value=\"m\"><label for=\"m\"> Male</label>\n      <input type=\"radio\" id=\"f\" name=\"gen\" value=\"f\"><label for=\"f\"> Female</label>\n    </p>\n    <p><input type=\"submit\" value=\"Register Now\"></p>\n  </form>\n</body>\n</html>"
  },
  {
    "id": "html-multimedia",
    "title": "22. HTML – Embed Multimedia",
    "category": "Media & Assets",
    "summary": "embed tag, attributes (src, autostart, loop), noembed, bgsound, object tag, and param.",
    "explanation": "<embed> embeds multimedia plugins (audio/video/flash), with <noembed> supplying fallback image/text. <bgsound> plays background audio in Internet Explorer, while <object> with <param> offers standardized multimedia container embedding.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Embedding Multimedia Objects</h3>\n  <object data=\"sample.pdf\" type=\"application/pdf\" width=\"100%\" height=\"220\">\n    <p>Your browser does not support PDF embedding. <a href=\"sample.pdf\">Download File</a></p>\n  </object>\n</body>\n</html>"
  },
  {
    "id": "html-marquees",
    "title": "23. HTML – Marquees",
    "category": "Interactive Effects",
    "summary": "marquee tag: direction (up, down, left, right), behavior (scroll, slide, alternate), scrollamount, loop.",
    "explanation": "The <marquee> tag generates scrolling tickers of text or graphics across the screen. Configured with direction (left/right/up/down), behavior (scroll/slide/alternate), scrolldelay, and scrollamount.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Scrolling Marquee Ticker</h3>\n  <marquee behavior=\"alternate\" direction=\"right\" scrollamount=\"8\" bgcolor=\"#D9EEE1\" style=\"padding: 10px; color: #04AA6D; font-weight: bold;\">\n    🚀 Welcome to ConverterAllAI Developer Masterclass!\n  </marquee>\n</body>\n</html>"
  },
  {
    "id": "html-header",
    "title": "24. HTML – Header",
    "category": "Document Head",
    "summary": "head container: title, meta, base, link, style, script, noscript.",
    "explanation": "The <head> element contains critical document headers not rendered in the viewport: <title> (window title bar), <meta> (metadata/charset), <base> (prefix for relative paths), <link> (external stylesheets/fonts), and <style>/<script>.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Complete Document Header</title>\n  <meta charset=\"utf-8\">\n  <base href=\"https://example.com/\">\n  <link rel=\"stylesheet\" href=\"style.css\">\n  <style>body { font-family: sans-serif; }</style>\n</head>\n<body>\n  <h1>Header Tags Working</h1>\n</body>\n</html>"
  },
  {
    "id": "html-stylesheets",
    "title": "25. HTML – Style Sheet",
    "category": "Styling",
    "summary": "3 CSS integration methods: External style sheet (link), Internal style sheet (style), Inline styles (style=\"...\").",
    "explanation": "CSS describes how HTML elements render. In External CSS, rules are housed in .css files and linked with <link rel=\"stylesheet\">. Internal CSS sits inside <style> in <head>. Inline CSS uses the style=\"...\" attribute on specific tags.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head>\n  <!-- Internal CSS -->\n  <style>\n    .highlight-card {\n      background: #e6fffa;\n      border: 1px solid #04AA6D;\n      padding: 16px;\n      border-radius: 6px;\n    }\n  </style>\n</head>\n<body>\n  <div class=\"highlight-card\">\n    <!-- Inline CSS -->\n    <h3 style=\"color: #04AA6D; margin: 0;\">Styled with Internal &amp; Inline CSS</h3>\n  </div>\n</body>\n</html>"
  },
  {
    "id": "html-javascript",
    "title": "26. HTML – JavaScript",
    "category": "Scripting",
    "summary": "script tag, external .js, internal script, event handlers (onclick, onmouseover), noscript fallback.",
    "explanation": "JavaScript adds interactivity to HTML pages. Use <script src=\"app.js\"> for external files or inline script blocks. Event handlers like onclick or onmouseover trigger custom JavaScript functions, and <noscript> supports users without scripts enabled.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head>\n  <title>JS Integration Demo</title>\n</head>\n<body>\n  <h3>Interactive Button</h3>\n  <button onclick=\"alert('Hello from HTML JavaScript!')\" style=\"padding: 8px 16px; background: #04AA6D; color: white; border: none; border-radius: 4px; cursor: pointer;\">\n    Click Me!\n  </button>\n  <noscript><p>Please enable JavaScript to use this web application.</p></noscript>\n</body>\n</html>"
  },
  {
    "id": "html-layouts",
    "title": "27. HTML – Layouts",
    "category": "Layout & Grouping",
    "summary": "Multi-column layouts: Table-based layout (tr, td, colspan), DIV & SPAN layout with CSS float/flex.",
    "explanation": "Historic layouts relied on <table> elements with multi-row and multi-column colspan/rowspan. Modern layouts use semantic HTML5 containers (<header>, <nav>, <main>, <aside>, <footer>) structured with CSS Flexbox and Grid.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <!-- Modern 3-Section Layout Structure -->\n  <div style=\"display: flex; flex-direction: column; min-height: 180px; gap: 8px;\">\n    <header style=\"background: #04AA6D; color: white; padding: 10px;\">Header Banner</header>\n    <div style=\"display: flex; flex: 1; gap: 8px;\">\n      <nav style=\"background: #e2e8f0; width: 30%; padding: 10px;\">Left Nav Menu</nav>\n      <main style=\"background: #f8fafc; flex: 1; padding: 10px;\">Main Content Area</main>\n    </div>\n    <footer style=\"background: #1e293b; color: white; padding: 10px; text-align: center;\">Footer Copyright</footer>\n  </div>\n</body>\n</html>"
  },
  {
    "id": "html-tag-reference",
    "title": "28. HTML – Tag Reference",
    "category": "HTML Reference",
    "summary": "Complete alphabetical list of all standard and HTML5 tags from <a> to <xmp>.",
    "explanation": "Comprehensive catalog of HTML tags: <a>, <abbr>, <address>, <article>, <aside>, <audio>, <b>, <blockquote>, <body>, <button>, <canvas>, <caption>, <code>, <col>, <datalist>, <details>, <dialog>, <div>, <em>, <figure>, <footer>, <form>, <h1>-<h6>, <header>, <iframe>, <img>, <input>, <main>, <nav>, <ol>, <p>, <section>, <select>, <table>, <video>, and more.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <h2>Sample HTML5 Tag Elements</h2>\n  <details>\n    <summary>Click to view Tag Definitions</summary>\n    <p>&lt;article&gt;, &lt;section&gt;, &lt;aside&gt;, &lt;nav&gt;, &lt;footer&gt;</p>\n  </details>\n  <progress value=\"75\" max=\"100\" style=\"margin-top: 15px;\"></progress>\n</body>\n</html>"
  },
  {
    "id": "html-attribute-reference",
    "title": "29. HTML – Attribute Reference",
    "category": "HTML Reference",
    "summary": "Global Attributes (class, id, title, style, hidden, draggable, contenteditable) and Language attributes.",
    "explanation": "Global attributes apply to virtually every HTML element: accesskey, class, contenteditable, data-*, dir, draggable, hidden, id, spellcheck, style, tabindex, and translate. Language attributes include dir (ltr/rtl) and lang (ISO code).",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <!-- Global Attributes in action -->\n  <div id=\"editable-box\" contenteditable=\"true\" spellcheck=\"true\" style=\"border: 2px dashed #04AA6D; padding: 15px; border-radius: 6px;\">\n    ✏️ This box is <b>contenteditable</b>! Click inside here and edit this text right in your browser.\n  </div>\n</body>\n</html>"
  },
  {
    "id": "html-events-reference",
    "title": "30. HTML – Events Reference",
    "category": "HTML Reference",
    "summary": "Window events, Form events (onchange, onsubmit), Keyboard events (onkeydown), Mouse events (onclick, onmouseover), Media events.",
    "explanation": "HTML event attributes connect DOM elements to JavaScript handlers. Categories include Window events (onload, onresize), Form events (onfocus, onblur, onsubmit), Keyboard events (onkeydown, onkeyup), and Mouse events (onclick, ondrag, onmouseover).",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>HTML Form &amp; Mouse Events</h3>\n  <input \n    type=\"text\" \n    placeholder=\"Type something here...\" \n    oninput=\"document.getElementById('live-preview').innerText = this.value\"\n    style=\"padding: 8px; width: 250px;\"\n  >\n  <p>Live Event Text: <span id=\"live-preview\" style=\"color: #04AA6D; font-weight: bold;\"></span></p>\n</body>\n</html>"
  },
  {
    "id": "html-fonts-reference",
    "title": "31. HTML – Fonts Reference",
    "category": "HTML Reference",
    "summary": "Font stacks across Windows, Macintosh, and Unix/Linux platforms.",
    "explanation": "System font compatibility matrices for cross-platform web typography: Microsoft Windows fonts (Arial, Times New Roman, Verdana, Trebuchet MS, Tahoma), Macintosh fonts (Helvetica, Georgia, Monaco), and Unix/X11 fallbacks.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <p style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\">\n    Modern System Font Stack: Segoe UI, Tahoma, Verdana\n  </p>\n  <p style=\"font-family: Georgia, 'Times New Roman', serif;\">\n    Classic Serif Font Stack: Georgia, Times New Roman\n  </p>\n  <p style=\"font-family: 'Courier New', Courier, monospace;\">\n    Monospace Font Stack: Courier New, Courier\n  </p>\n</body>\n</html>"
  },
  {
    "id": "html-ascii-codes",
    "title": "32. HTML – ASCII Table Lookup",
    "category": "Encoding & Tables",
    "summary": "7-Bit ASCII Codes (0 to 127) and Extended ASCII characters (128 to 255) with HTML entities.",
    "explanation": "ASCII standards define numeric values (000 to 127) for standard keyboard characters and control symbols. Extended ASCII encompasses values 128 to 255. In HTML, each character can be referenced by numeric entity (&#38; = &amp;, &#60; = &lt;).",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Rendered ASCII Entity Codes</h3>\n  <p>Ampersand (&amp;): &amp;#38; or &amp;amp;</p>\n  <p>Less Than (&lt;): &amp;#60; or &amp;lt;</p>\n  <p>Greater Than (&gt;): &amp;#62; or &amp;gt;</p>\n  <p>Copyright Symbol: &amp;#169; or &amp;copy; &copy; 2026</p>\n</body>\n</html>"
  },
  {
    "id": "html-color-names",
    "title": "33. HTML – Color Names",
    "category": "Styling",
    "summary": "W3C 16 standard colors, Extended 140+ CSS Color Names with Hexadecimal equivalents.",
    "explanation": "Full catalog of standard web color names and their hexadecimal triplets: Black (#000000), White (#FFFFFF), Red (#FF0000), Lime (#00FF00), Blue (#0000FF), Aqua (#00FFFF), Fuchsia (#FF00FF), Yellow (#FFFF00), Teal (#008080), and Olive (#808000).",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <div style=\"display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; color: white; text-align: center; font-weight: bold;\">\n    <div style=\"background: #04AA6D; padding: 20px;\">#04AA6D (Green)</div>\n    <div style=\"background: #1572B6; padding: 20px;\">#1572B6 (Blue)</div>\n    <div style=\"background: #E34F26; padding: 20px;\">#E34F26 (Orange)</div>\n  </div>\n</body>\n</html>"
  },
  {
    "id": "html-mime-types",
    "title": "34. HTML – MIME Media Types",
    "category": "Web Standards",
    "summary": "Multipurpose Internet Mail Extensions: text, image, audio, video, application, multipart.",
    "explanation": "MIME types define data formatting for servers and browsers. Structured as type/subtype: text/html, text/css, text/javascript, image/png, image/jpeg, image/svg+xml, audio/mpeg, video/mp4, and application/json.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head>\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n</head>\n<body>\n  <h3>MIME Types in HTML Tags</h3>\n  <video controls width=\"320\">\n    <source src=\"movie.mp4\" type=\"video/mp4\">\n  </video>\n</body>\n</html>"
  },
  {
    "id": "html-url-encoding",
    "title": "35. HTML – URL Encoding",
    "category": "Web Standards",
    "summary": "Percent-encoding (%20 for space), reserved characters, and unsafe characters lookup.",
    "explanation": "URL encoding converts non-ASCII or reserved characters into a safe %HEX representation. For instance, spaces become %20, ampersands become %26, question marks become %3F, and slashes become %2F.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>URL Encoding Demonstration</h3>\n  <p>Search query with spaces and symbols:</p>\n  <a href=\"https://www.google.com/search?q=HTML5%20%26%20CSS3%20Tutorial\" target=\"_blank\">\n    Search for \"HTML5 &amp; CSS3 Tutorial\" (Encoded: %20 &amp; %26)\n  </a>\n</body>\n</html>"
  },
  {
    "id": "html-language-codes",
    "title": "36. HTML – Language ISO Codes",
    "category": "Web Standards",
    "summary": "ISO 639-1 two-letter language codes for HTML lang and xml:lang attributes.",
    "explanation": "ISO 639-1 language codes identify spoken/written languages for web documents and search crawlers: en (English), hi (Hindi), fr (French), es (Spanish), de (German), zh (Chinese), ja (Japanese), ar (Arabic), and ru (Russian).",
    "codeSnippet": "<!DOCTYPE html>\n<html lang=\"en\">\n<head><title>Multi-language Document</title></head>\n<body>\n  <p lang=\"en\">Hello, welcome to Web Tutorials.</p>\n  <p lang=\"hi\">नमस्ते, वेब ट्यूटोरियल में आपका स्वागत है।</p>\n  <p lang=\"es\">Hola, bienvenido a los tutoriales web.</p>\n</body>\n</html>"
  },
  {
    "id": "html-character-encodings",
    "title": "37. HTML – Character Encodings",
    "category": "Web Standards",
    "summary": "ASCII, ISO-8859-1 (Latin-1), UTF-8, UTF-16, and UTF-32 unicode transformations.",
    "explanation": "Character encodings convert binary bytes into human-readable text characters. UTF-8 is the universal standard for modern web pages, covering over 140,000 characters from all languages and emoji.",
    "codeSnippet": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <!-- Standard UTF-8 declaration for universal character support -->\n  <meta charset=\"UTF-8\">\n  <title>UTF-8 Unicode Characters</title>\n</head>\n<body>\n  <p>Mathematical Symbols: &radic;25 = 5, &infin;, &pi; &asymp; 3.14159</p>\n  <p>Global Emojis: 🚀 💻 🌐 ⚡ 🔥</p>\n</body>\n</html>"
  },
  {
    "id": "html-deprecated-tags",
    "title": "38. HTML – Deprecated Tags",
    "category": "HTML Reference",
    "summary": "Obsolete tags: applet, basefont, center, dir, font, isindex, marquee, strike, u, and their modern CSS replacements.",
    "explanation": "Tags removed or obsolete in modern HTML5 standards: <center> &rarr; CSS text-align: center; <font> &rarr; CSS font-family/color; <strike> &rarr; <del> or text-decoration: line-through; <marquee> &rarr; CSS @keyframes animations.",
    "codeSnippet": "<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    /* Modern CSS Replacements for Deprecated HTML Tags */\n    .centered-text { text-align: center; }\n    .strike-text { text-decoration: line-through; }\n    .custom-font { font-family: 'Roboto', sans-serif; color: #04AA6D; font-size: 20px; }\n  </style>\n</head>\n<body>\n  <div class=\"centered-text\">\n    <p class=\"custom-font\">Modern replacement for &lt;center&gt; and &lt;font&gt;</p>\n    <p class=\"strike-text\">Modern replacement for &lt;strike&gt;</p>\n  </div>\n</body>\n</html>"
  }
];

export const CSS_TOPICS: TutorialTopic[] = [
  {
    id: 'css-home',
    title: 'CSS HOME',
    category: 'CSS Basics',
    summary: 'CSS is the language we use to style an HTML document.',
    explanation: 'CSS describes how HTML elements should be displayed on screen, paper, or in other media. It saves huge amounts of work by controlling the layout of multiple web pages at once.',
    codeSnippet: `body {
  background-color: #f4f6f8;
  font-family: Arial, sans-serif;
  color: #333333;
}

h1 {
  color: #04AA6D;
  text-align: center;
}`
  },
  { id: 'css-intro', title: 'CSS Introduction', category: 'CSS Basics', summary: 'What is CSS and how it transforms plain HTML.', explanation: 'CSS stands for Cascading Style Sheets. It controls colors, fonts, margins, positions, and animations on web pages.', codeSnippet: `p {\n  color: red;\n  text-align: center;\n}` },
  { id: 'css-syntax', title: 'CSS Syntax', category: 'CSS Basics', summary: 'Selector, property, value, declaration blocks.', explanation: 'A CSS rule consists of a selector and a declaration block. Each declaration includes a CSS property name and a value separated by a colon.', codeSnippet: `/* selector { property: value; } */\nh1 {\n  color: blue;\n  font-size: 24px;\n}` },
  { id: 'css-selectors', title: 'CSS Selectors', category: 'CSS Basics', summary: 'Element, ID (#), Class (.), Attribute, and Pseudo selectors.', explanation: 'CSS selectors are used to "find" (or select) the HTML elements you want to style.', codeSnippet: `/* Element Selector */\np { line-height: 1.6; }\n\n/* Class Selector */\n.btn-primary { background: #04AA6D; color: white; }\n\n/* ID Selector */\n#mainHeader { position: sticky; }` },
  { id: 'css-how-to', title: 'CSS How To', category: 'CSS Integration', summary: 'External CSS, Internal CSS, Inline CSS priority.', explanation: 'External styles are defined within the <link> element, inside the <head> section of an HTML page.', codeSnippet: `<!-- Recommended: External CSS file -->\n<head>\n  <link rel="stylesheet" href="mystyle.css">\n</head>` },
  { id: 'css-comments', title: 'CSS Comments', category: 'CSS Basics', summary: 'Writing comments inside CSS rules.', explanation: 'CSS comments start with /* and end with */. Comments can span multiple lines.', codeSnippet: `/* Main Navigation Styles */\n.nav {\n  display: flex;\n  /* gap: 1rem; */\n}` },
  { id: 'css-colors', title: 'CSS Colors', category: 'CSS Colors', summary: 'HEX, RGB, RGBA, HSL, and modern color functions.', explanation: 'Colors are defined using HEX (#04AA6D), RGB rgb(4, 170, 109), or HSL hsl(158, 95%, 34%).', codeSnippet: `:root {\n  --brand: #04AA6D;\n  --transparent-brand: rgba(4, 170, 109, 0.15);\n}` },
  { id: 'css-background', title: 'CSS Background', category: 'CSS Box Model', summary: 'background-color, image, repeat, size, position, gradient.', explanation: 'The CSS background properties are used to add background effects for elements.', codeSnippet: `.hero-banner {\n  background: linear-gradient(135deg, #04AA6D, #026b44);\n  color: white;\n  padding: 40px;\n}` },
  { id: 'css-border', title: 'CSS Border', category: 'CSS Box Model', summary: 'border-width, border-style, border-color, border-radius.', explanation: 'The CSS border properties allow you to specify the style, width, and color of an element\'s border.', codeSnippet: `.card {\n  border: 1px solid #e1e4e8;\n  border-radius: 8px;\n}` },
  { id: 'css-margin', title: 'CSS Margin', category: 'CSS Box Model', summary: 'Clearing space outside the element border.', explanation: 'Margins are used to create space around elements, outside of any defined borders.', codeSnippet: `.container {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  margin-left: auto; /* Center block */\n  margin-right: auto;\n}` },
  { id: 'css-padding', title: 'CSS Padding', category: 'CSS Box Model', summary: 'Generating space around element content inside border.', explanation: 'Padding is used to create space around an element\'s content, inside of any defined borders.', codeSnippet: `.button {\n  padding: 10px 20px; /* vertical | horizontal */\n}` },
  { id: 'css-height-width', title: 'CSS Height/Width', category: 'CSS Box Model', summary: 'Setting dimensional bounds, min/max dimensions.', explanation: 'The height and width properties set the height and width of an element. The max-width property prevents overflow.', codeSnippet: `.modal {\n  width: 90%;\n  max-width: 600px;\n  min-height: 300px;\n}` },
  { id: 'css-text', title: 'CSS Text', category: 'CSS Typography', summary: 'text-align, text-decoration, text-transform, letter-spacing.', explanation: 'CSS text formatting controls text alignment, letter and word spacing, transformations, and decoration.', codeSnippet: `h1 {\n  text-align: center;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}` },
  { id: 'css-fonts', title: 'CSS Fonts', category: 'CSS Typography', summary: 'font-family, font-size, font-weight, Google Web Fonts.', explanation: 'Selecting the right font and weight has a huge impact on user experience and readability.', codeSnippet: `body {\n  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;\n  font-size: 16px;\n  font-weight: 400;\n}` },
  { id: 'css-icons', title: 'CSS Icons', category: 'CSS Assets', summary: 'Font Awesome, Google Material Icons, and SVG sprites.', explanation: 'The simplest way to add an icon to your HTML page is with an icon library such as Font Awesome.', codeSnippet: `<!-- Include FontAwesome, then: -->\n<i class="fa-solid fa-code"></i>\n<i class="fa-solid fa-check" style="color: #04AA6D;"></i>` },
  { id: 'css-links', title: 'CSS Links', category: 'CSS Interactivity', summary: 'Styling link states: a:link, a:visited, a:hover, a:active.', explanation: 'Links can be styled with any CSS property and conditioned with pseudo-classes.', codeSnippet: `a {\n  color: #04AA6D;\n  text-decoration: none;\n  transition: color 0.2s ease;\n}\na:hover {\n  text-decoration: underline;\n}` },
  { id: 'css-lists', title: 'CSS Lists', category: 'CSS Content', summary: 'list-style-type, list-style-image, custom counters.', explanation: 'The CSS list properties allow you to set different list item markers for ordered and unordered lists.', codeSnippet: `ul.custom-list {\n  list-style: none;\n  padding-left: 0;\n}\nul.custom-list li::before {\n  content: "✓ ";\n  color: #04AA6D;\n}` },
  { id: 'css-tables', title: 'CSS Tables', category: 'CSS Data', summary: 'border-collapse, zebra-striping, hoverable rows.', explanation: 'CSS drastically improves HTML table readability with padding, borders, and alternating row colors.', codeSnippet: `tr:nth-child(even) {\n  background-color: #f2f2f2;\n}\ntr:hover {\n  background-color: #ddd;\n}` },
  { id: 'css-display', title: 'CSS Display', category: 'CSS Layout', summary: 'block, inline, inline-block, none, flex, grid.', explanation: 'The display property is the most important CSS property for controlling layout. It specifies how an element is shown.', codeSnippet: `.hidden { display: none; }\n.nav-item { display: inline-block; }\n.card-row { display: flex; }` },
  { id: 'css-position', title: 'CSS Position', category: 'CSS Layout', summary: 'static, relative, absolute, fixed, and sticky.', explanation: 'The position property specifies the type of positioning method used for an element (relative to document or parent).', codeSnippet: `.sticky-nav {\n  position: sticky;\n  top: 0;\n  z-index: 100;\n}\n.badge {\n  position: absolute;\n  top: -5px;\n  right: -5px;\n}` },
  { id: 'css-z-index', title: 'CSS Z-index', category: 'CSS Layout', summary: 'Controlling 3D stack ordering of positioned elements.', explanation: 'The z-index property specifies the stack order of an element. An element with greater stack order is always in front of one with lower stack order.', codeSnippet: `.overlay {\n  position: fixed;\n  z-index: 9999;\n}` },
  { id: 'css-overflow', title: 'CSS Overflow', category: 'CSS Layout', summary: 'visible, hidden, scroll, and auto overflow controls.', explanation: 'The CSS overflow property controls what happens to content that is too big to fit into an area.', codeSnippet: `.code-container {\n  max-height: 300px;\n  overflow-y: auto;\n}` },
  { id: 'css-float', title: 'CSS Float', category: 'CSS Layout', summary: 'Legacy float and clear layout techniques.', explanation: 'The CSS float property specifies how an element should float (wrap text around images). Modern layouts use Flexbox/Grid instead.', codeSnippet: `img.float-right {\n  float: right;\n  margin-left: 15px;\n}` },
  { id: 'css-flexbox', title: 'CSS Flexbox', category: 'CSS Modern Layout', summary: 'Flexible Box layout module (1D horizontal or vertical).', explanation: 'Flexbox makes it easier to design flexible responsive layout structures without using float or positioning.', codeSnippet: `.flex-container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n}` },
  { id: 'css-grid', title: 'CSS Grid', category: 'CSS Modern Layout', summary: 'Grid layout system (2D rows and columns).', explanation: 'CSS Grid Layout offers a grid-based layout system, with rows and columns, making it easier to design web pages without having to use floats and positioning.', codeSnippet: `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n}` },
  { id: 'css-media-queries', title: 'CSS Media Queries', category: 'CSS Responsive', summary: 'Responsive design with @media rules for mobile, tablet, desktop.', explanation: 'Media queries are used to apply different styles for different media types or devices (screen width, orientation, resolution).', codeSnippet: `@media (max-width: 768px) {\n  .sidebar { display: none; }\n  .main-content { width: 100%; }\n}` },
  { id: 'css-variables', title: 'CSS Variables', category: 'CSS Advanced', summary: 'Custom properties (--variable-name) and var() function.', explanation: 'CSS variables have access to the DOM, which means you can create variables with local or global scope, and change them with JavaScript for theme toggles.', codeSnippet: `:root {\n  --primary: #04AA6D;\n  --radius: 6px;\n}\n.button {\n  background: var(--primary);\n  border-radius: var(--radius);\n}` },
  { id: 'css-transitions', title: 'CSS Transitions', category: 'CSS Animation', summary: 'Smooth attribute changes over time.', explanation: 'CSS transitions allow you to change property values smoothly, over a given duration.', codeSnippet: `.card {\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 16px rgba(0,0,0,0.1);\n}` },
  { id: 'css-animations', title: 'CSS Animations', category: 'CSS Animation', summary: '@keyframes rules, animation-name, duration, iteration.', explanation: 'An animation lets an element gradually change from one style to another without JavaScript.', codeSnippet: `@keyframes pulse {\n  0% { transform: scale(1); }\n  50% { transform: scale(1.05); }\n  100% { transform: scale(1); }\n}\n.badge-live {\n  animation: pulse 2s infinite ease-in-out;\n}` }
];

export const JS_TOPICS: TutorialTopic[] = [
  {
    id: 'js-home',
    title: 'JS HOME',
    category: 'JavaScript Basics',
    summary: 'JavaScript is the world\'s most popular programming language.',
    explanation: 'JavaScript is the programming language of the Web. JavaScript is easy to learn and powers modern web applications, servers (Node.js), and mobile apps.',
    codeSnippet: `// Welcome to JavaScript
function greetUser(name) {
  return "Hello, " + name + "! Welcome to ConverterAllAI.";
}

console.log(greetUser("Developer"));`
  },
  { id: 'js-intro', title: 'JS Introduction', category: 'JavaScript Basics', summary: 'What JavaScript can do: modify DOM, react to events, validate forms.', explanation: 'JavaScript can change HTML content, attribute values, CSS styles, and hide/show elements dynamically.', codeSnippet: `// Change HTML text\ndocument.getElementById("demo").innerHTML = "Hello JavaScript!";` },
  { id: 'js-where-to', title: 'JS Where To', category: 'JavaScript Basics', summary: 'Script tag in head, body, or external .js files.', explanation: 'Scripts can be placed in the <body>, or in the <head> section of an HTML page, or in external files.', codeSnippet: `<script src="assets/js/main.js"></script>` },
  { id: 'js-output', title: 'JS Output', category: 'JavaScript Basics', summary: 'innerHTML, document.write(), window.alert(), console.log().', explanation: 'JavaScript can "display" data in different ways: writing into an HTML element, writing into an alert box, or console logging.', codeSnippet: `console.log("Debugging information");\nalert("Warning message");` },
  { id: 'js-syntax', title: 'JS Syntax', category: 'JavaScript Basics', summary: 'Values, variables, operators, expressions, keywords, comments.', explanation: 'JavaScript syntax is the set of rules, how JavaScript programs are constructed.', codeSnippet: `let x = 10;\nlet y = 20;\nlet z = x + y;\nconsole.log(z); // 30` },
  { id: 'js-variables', title: 'JS Variables', category: 'JavaScript Core', summary: 'let, const, and var variable declarations.', explanation: 'Always declare variables with const if the value should not be changed; use let when the value may reassign; avoid var in modern code.', codeSnippet: `const PI = 3.14159;\nlet score = 0;\nscore += 10;` },
  { id: 'js-operators', title: 'JS Operators', category: 'JavaScript Core', summary: 'Arithmetic, Assignment, Comparison, Logical, Ternary operators.', explanation: 'Operators perform actions on variables and values (+, -, *, /, ===, !==, &&, ||).', codeSnippet: `const isAdult = age >= 18 ? "Eligible" : "Minor";` },
  { id: 'js-data-types', title: 'JS Data Types', category: 'JavaScript Core', summary: 'String, Number, BigInt, Boolean, Undefined, Null, Symbol, Object.', explanation: 'JavaScript has 8 Datatypes. JavaScript has dynamic types: the same variable can be used to hold different data types.', codeSnippet: `let str = "John";       // String\nlet age = 30;           // Number\nlet active = true;      // Boolean\nlet user = { name: "A" }; // Object` },
  { id: 'js-functions', title: 'JS Functions', category: 'JavaScript Core', summary: 'Function declaration, parameters, return, arrow functions.', explanation: 'A JavaScript function is a block of code designed to perform a particular task, executed when invoked.', codeSnippet: `// Arrow function syntax\nconst add = (a, b) => a + b;\nconsole.log(add(5, 7)); // 12` },
  { id: 'js-objects', title: 'JS Objects', category: 'JavaScript Core', summary: 'Properties, methods, this keyword, object literals.', explanation: 'Objects are containers for named values called properties and methods.', codeSnippet: `const car = {\n  brand: "Tesla",\n  model: "Model 3",\n  start() {\n    return "Engine started!";\n  }\n};` },
  { id: 'js-events', title: 'JS Events', category: 'JavaScript Interactivity', summary: 'onclick, onchange, onmouseover, addEventListener.', explanation: 'HTML events are "things" that happen to HTML elements. When JavaScript is used in HTML pages, JavaScript can "react" on these events.', codeSnippet: `const btn = document.querySelector("#myBtn");\nbtn.addEventListener("click", () => {\n  console.log("Button was clicked!");\n});` },
  { id: 'js-strings', title: 'JS Strings', category: 'JavaScript Methods', summary: 'Template literals, slice, replace, split, indexOf.', explanation: 'Strings are for storing text. Template literals (${}) allow multi-line strings and interpolation.', codeSnippet: `const user = "Alex";\nconsole.log(\`Hello \${user}, welcome back!\`);` },
  { id: 'js-numbers', title: 'JS Numbers', category: 'JavaScript Methods', summary: 'Integers, floats, toFixed(), parseInt(), Number().', explanation: 'JavaScript has only one type of number. Numbers can be written with, or without, decimals.', codeSnippet: `let price = 19.999;\nconsole.log(price.toFixed(2)); // "20.00"` },
  { id: 'js-math', title: 'JS Math', category: 'JavaScript Methods', summary: 'Math.PI, round, ceil, floor, random, max, min.', explanation: 'The JavaScript Math object allows you to perform mathematical tasks on numbers.', codeSnippet: `// Random number between 1 and 100\nconst randomNum = Math.floor(Math.random() * 100) + 1;` },
  { id: 'js-dates', title: 'JS Dates', category: 'JavaScript Methods', summary: 'new Date(), getFullYear(), ISO string formatting.', explanation: 'JavaScript Date objects let us work with dates: timestamps, month, day, year, and timezone conversions.', codeSnippet: `const now = new Date();\nconsole.log(now.toISOString());` },
  { id: 'js-arrays', title: 'JS Arrays', category: 'JavaScript Collections', summary: 'map, filter, reduce, forEach, push, pop, slice.', explanation: 'An array is a special variable that can hold more than one value. Modern JS array methods make data processing declarative.', codeSnippet: `const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconst evens = numbers.filter(n => n % 2 === 0);` },
  { id: 'js-if-else', title: 'JS If Else', category: 'JavaScript Control Flow', summary: 'Conditional statements if, else if, else.', explanation: 'Conditional statements are used to perform different actions based on different conditions.', codeSnippet: `const score = 85;\nif (score >= 90) {\n  console.log("Grade A");\n} else if (score >= 80) {\n  console.log("Grade B");\n} else {\n  console.log("Pass");\n}` },
  { id: 'js-switch', title: 'JS Switch', category: 'JavaScript Control Flow', summary: 'Selecting one of many code blocks to execute.', explanation: 'Use the switch statement to select one of many code blocks to be executed based on matching an expression.', codeSnippet: `switch (day) {\n  case 0: text = "Sunday"; break;\n  case 6: text = "Saturday"; break;\n  default: text = "Weekday";\n}` },
  { id: 'js-loops', title: 'JS Loops', category: 'JavaScript Control Flow', summary: 'for, for...of, for...in, while, do...while.', explanation: 'Loops can execute a block of code a number of times as long as a specified condition is true.', codeSnippet: `const items = ["Apple", "Orange", "Banana"];\nfor (const item of items) {\n  console.log(item);\n}` },
  { id: 'js-break', title: 'JS Break', category: 'JavaScript Control Flow', summary: 'break and continue in loop execution.', explanation: 'The break statement jumps out of a loop. The continue statement breaks one iteration in the loop.', codeSnippet: `for (let i = 0; i < 10; i++) {\n  if (i === 3) continue; // skip 3\n  if (i === 7) break;    // stop at 7\n  console.log(i);\n}` },
  { id: 'js-errors', title: 'JS Errors', category: 'JavaScript Debugging', summary: 'try, catch, finally, and throw statements.', explanation: 'The try statement defines a code block to run (to try). The catch statement defines a code block to handle any error.', codeSnippet: `try {\n  JSON.parse("invalid-json");\n} catch (err) {\n  console.error("Parse failed:", err.message);\n} finally {\n  console.log("Completed execution.");\n}` },
  { id: 'js-dom', title: 'JS DOM', category: 'JavaScript Web APIs', summary: 'Document Object Model, querySelector, manipulating HTML nodes.', explanation: 'When a web page is loaded, the browser creates a Document Object Model of the page. JS can add, remove, and alter HTML nodes and attributes.', codeSnippet: `const el = document.querySelector(".header-title");\nel.style.color = "#04AA6D";\nel.textContent = "Updated via DOM!";` },
  { id: 'js-bom', title: 'JS BOM', category: 'JavaScript Web APIs', summary: 'Browser Object Model (window, screen, location, history, navigator).', explanation: 'The Browser Object Model allows JavaScript to "talk to" the browser (fetch window width, redirect URL, read user agent).', codeSnippet: `console.log("Current URL:", window.location.href);\nconsole.log("Screen width:", window.screen.width);` },
  { id: 'js-ajax', title: 'JS AJAX', category: 'JavaScript Async', summary: 'Asynchronous JavaScript And XML with fetch() API.', explanation: 'AJAX allows web pages to be updated asynchronously by exchanging data with a web server behind the scenes.', codeSnippet: `fetch("https://jsonplaceholder.typicode.com/posts/1")\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));` },
  { id: 'js-json', title: 'JS JSON', category: 'JavaScript Data', summary: 'JSON.stringify() and JSON.parse() serialization.', explanation: 'JSON (JavaScript Object Notation) is a format for storing and transporting data, universally used in REST and GraphQL APIs.', codeSnippet: `const obj = { name: "Alex", role: "Dev" };\nconst jsonString = JSON.stringify(obj);\nconst parsed = JSON.parse(jsonString);` },
  { id: 'js-promises', title: 'JS Promises', category: 'JavaScript Async', summary: 'Pending, Fulfilled, Rejected states and chaining.', explanation: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation.', codeSnippet: `const checkStatus = new Promise((resolve, reject) => {\n  const ok = true;\n  ok ? resolve("Operation succeeded!") : reject("Error!");\n});\ncheckStatus.then(msg => console.log(msg));` },
  { id: 'js-async-await', title: 'JS Async/Await', category: 'JavaScript Async', summary: 'Modern cleaner syntax for handling Promises.', explanation: 'async makes a function return a Promise. await makes an async function wait for a Promise.', codeSnippet: `async function fetchUserData() {\n  try {\n    const response = await fetch("https://api.github.com");\n    const data = await response.json();\n    console.log("Fetched:", data);\n  } catch (error) {\n    console.error("Failed:", error);\n  }\n}\nfetchUserData();` }
];

export const MODULES: LanguageModule[] = [
  {
    id: 'html',
    name: 'HTML',
    icon: 'fa-brands fa-html5',
    accentColor: '#E34F26',
    description: 'The standard markup language for building web structures.',
    topics: HTML_TOPICS
  },
  {
    id: 'css',
    name: 'CSS',
    icon: 'fa-brands fa-css3-alt',
    accentColor: '#1572B6',
    description: 'The styling language for responsive, beautiful layouts.',
    topics: CSS_TOPICS
  },
  {
    id: 'js',
    name: 'JavaScript',
    icon: 'fa-brands fa-js',
    accentColor: '#F7DF1E',
    description: 'The dynamic programming language that powers interactive web apps.',
    topics: JS_TOPICS
  }
];
