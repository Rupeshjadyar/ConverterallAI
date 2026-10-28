import { RichTutorialChapter, W3TopicItem } from './rich-tutorial.models';

export const ALL_RICH_HTML_CHAPTERS: RichTutorialChapter[] = [
  {
    "id": "html-overview",
    "chapterNumber": 1,
    "title": "1. HTML – Overview",
    "category": "Fundamentals",
    "shortDesc": "Learn what HTML is, how HyperText works, and the core document structure.",
    "overview": [
      "HTML stands for HyperText Markup Language, which is the most widely used language on the Web to develop web pages.",
      "HTML was created by Berners-Lee in late 1991, but \"HTML 2.0\" was the first standard HTML specification published in 1995. HTML 4.01 was a major version published in 1999, followed by the modern HTML5 standard.",
      "HyperText refers to the way in which Web pages (HTML documents) are linked together. Thus, any link on a web page is called HyperText.",
      "As its name suggests, HTML is a Markup Language which means you use HTML to simply \"mark-up\" a text document with tags that tell a web browser how to structure and display it."
    ],
    "sections": [
      {
        "title": "Basic HTML Document Skeleton",
        "theory": [
          "In its simplest form, every HTML document starts with a fundamental skeleton containing <html>, <head>, and <body> tags.",
          "The browser reads this file from top to bottom and parses each tag to render visual elements."
        ],
        "syntax": "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Page Title</title>\n  </head>\n  <body>\n    <!-- Content goes here -->\n  </body>\n</html>",
        "tips": [
          "Save your file with .html or .htm extension.",
          "Always use a plain text editor or modern IDE like VS Code."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <title>This is document title</title>\n</head>\n<body>\n  <h1>This is a heading</h1>\n  <p>Document content goes here.....</p>\n</body>\n</html>",
        "browserOutputDesc": "Displays a bold first-level heading followed by a standard text paragraph."
      },
      {
        "title": "HTML Tags & How They Work",
        "theory": [
          "HTML is a markup language and makes use of various tags to format the content. These tags are enclosed within angle braces <Tag Name>.",
          "Except for a few void tags, most tags have their corresponding closing tags. For example, <html> has its closing tag </html> and <body> tag has its closing tag </body>.",
          "World Wide Web Consortium (W3C) recommends to use lowercase tags starting from HTML 4."
        ],
        "table": [
          {
            "attribute": "<!DOCTYPE...>",
            "value": "Declaration",
            "description": "Defines the document type and tells the browser what HTML version is being used."
          },
          {
            "attribute": "<html>",
            "value": "Root container",
            "description": "Encloses the complete HTML document, containing head and body."
          },
          {
            "attribute": "<head>",
            "value": "Header container",
            "description": "Represents the document header which keeps title, link, style, and metadata."
          },
          {
            "attribute": "<title>",
            "value": "Page title",
            "description": "Mentioned inside head to specify the title visible in browser tab."
          },
          {
            "attribute": "<body>",
            "value": "Document body",
            "description": "Keeps other visible HTML tags like <h1>, <div>, <p>, tables, and images."
          },
          {
            "attribute": "<h1>",
            "value": "Heading 1",
            "description": "Represents top-level major heading."
          },
          {
            "attribute": "<p>",
            "value": "Paragraph",
            "description": "Represents a paragraph of text with automatic top and bottom margins."
          }
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Tags Demonstration</title>\n</head>\n<body>\n  <h1>Hello Web Developer</h1>\n  <p>HTML tags format and structure text content for web browsers.</p>\n</body>\n</html>"
      },
      {
        "title": "The <!DOCTYPE> Declaration",
        "theory": [
          "The <!DOCTYPE> declaration tag is used by the web browser to understand the version of the HTML used in the document.",
          "Current version is HTML5 and it makes use of the simple declaration: <!DOCTYPE html>.",
          "Notice that <!DOCTYPE> does not have an end tag."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p>The DOCTYPE declaration ensures browsers render pages in strict modern mode.</p>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-basic-tags",
    "chapterNumber": 2,
    "title": "2. HTML – Basic Tags",
    "category": "Fundamentals",
    "shortDesc": "Heading Tags (h1-h6), Paragraph Tag, Line Break, Centering, Horizontal Lines, Preserve Formatting, and Nonbreaking Spaces.",
    "overview": [
      "This chapter covers the most fundamental tags used in almost every web page.",
      "You will learn how to structure content using headings, paragraphs, line breaks, visual separators, and formatted text blocks."
    ],
    "sections": [
      {
        "title": "1. Heading Tags (<h1> to <h6>)",
        "theory": [
          "Any document starts with a heading. You can use different sizes for your headings.",
          "HTML has six levels of headings: <h1>, <h2>, <h3>, <h4>, <h5>, and <h6>.",
          "While displaying any heading, browser automatically adds one line before and one line after that heading."
        ],
        "tips": [
          "Use <h1> only once per web page for the main title to maximize SEO rankings."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Heading Example</title></head>\n<body>\n  <h1>This is heading 1</h1>\n  <h2>This is heading 2</h2>\n  <h3>This is heading 3</h3>\n  <h4>This is heading 4</h4>\n  <h5>This is heading 5</h5>\n  <h6>This is heading 6</h6>\n</body>\n</html>",
        "browserOutputDesc": "Renders six headings in decreasing font sizes from largest (h1) to smallest (h6)."
      },
      {
        "title": "2. Paragraph Tag (<p>)",
        "theory": [
          "The <p> tag offers a way to structure your text into different paragraphs.",
          "Each paragraph of text should go in between an opening <p> and a closing </p> tag.",
          "Browsers automatically insert empty vertical margins between adjacent paragraphs."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Paragraph Example</title></head>\n<body>\n  <p>Here is a first paragraph of text.</p>\n  <p>Here is a second paragraph of text.</p>\n  <p>Here is a third paragraph of text.</p>\n</body>\n</html>"
      },
      {
        "title": "3. Line Break Tag (<br />)",
        "theory": [
          "Whenever you use the <br /> element, anything following it starts from the next line.",
          "This tag is an example of an empty (void) element, where you do not need opening and closing tags, as there is nothing to go in between them.",
          "The <br /> tag has a space between characters \"br\" and the forward slash for XHTML compatibility."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Line Break Example</title></head>\n<body>\n  <p>\n    Hello<br />\n    You delivered your assignment on time.<br />\n    Thanks<br />\n    Mahnaz\n  </p>\n</body>\n</html>"
      },
      {
        "title": "4. Centering Content (<center>)",
        "theory": [
          "You can use the <center> tag to put any content in the center of the page or any table cell.",
          "Note: In modern HTML5, <center> is deprecated in favor of CSS \"text-align: center\", but it is widely found in legacy code."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Centering Content Example</title></head>\n<body>\n  <p>This text is not in the center.</p>\n  <center>\n    <p>This text is in the center.</p>\n  </center>\n</body>\n</html>"
      },
      {
        "title": "5. Horizontal Lines (<hr />)",
        "theory": [
          "Horizontal lines are used to visually break-up sections of a document.",
          "The <hr> tag creates a line from the current position in the document to the right margin and breaks the line accordingly.",
          "Like <br />, <hr /> is an empty element that does not require an end tag."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Horizontal Line Example</title></head>\n<body>\n  <p>This is paragraph one and should be on top</p>\n  <hr />\n  <p>This is paragraph two and should be at bottom</p>\n</body>\n</html>"
      },
      {
        "title": "6. Preserve Formatting with <pre>",
        "theory": [
          "Sometimes, you want your text to follow the exact format of how it is written in the HTML document.",
          "In these cases, you can use the preformatted tag <pre>.",
          "Any text between the opening <pre> and closing </pre> tag will preserve spaces, indentations, and line breaks exactly."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Preserve Formatting Example</title></head>\n<body>\n<pre>\nfunction testFunction( strText ){\n  alert (strText)\n}\n</pre>\n</body>\n</html>"
      },
      {
        "title": "7. Nonbreaking Spaces (&nbsp;)",
        "theory": [
          "Suppose you want to use the phrase \"12 Angry Men\". Here, you would not want a browser to split \"12, Angry\" and \"Men\" across two separate lines at the edge of the window.",
          "In cases where you do not want the browser to break text, use the nonbreaking space entity &nbsp; instead of a normal space."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Nonbreaking Spaces Example</title></head>\n<body>\n  <p>An example of this technique appears in the movie \"12&nbsp;Angry&nbsp;Men.\"</p>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-elements",
    "chapterNumber": 3,
    "title": "3. HTML – Elements",
    "category": "Core Concepts",
    "shortDesc": "Understand the difference between Tags and Elements, Void Elements, and Nested HTML elements.",
    "overview": [
      "An HTML element is defined by a starting tag. If the element contains other content, it ends with a closing tag, where the element name is preceded by a forward slash.",
      "HTML documents consist of a tree of these elements that specify how the document is built."
    ],
    "sections": [
      {
        "title": "HTML Tag vs. Element",
        "theory": [
          "An HTML element is defined by a starting tag. If the element contains other content, it ends with a closing tag.",
          "For example: <p> is starting tag of a paragraph and </p> is closing tag of the same paragraph, but <p>This is paragraph</p> is the complete paragraph element.",
          "Elements that do not need to be closed, such as <img ... />, <hr />, and <br />, are known as void elements."
        ],
        "table": [
          {
            "attribute": "<p>",
            "value": "Start Tag",
            "description": "Opening tag"
          },
          {
            "attribute": "This is paragraph content.",
            "value": "Content",
            "description": "Body of the element"
          },
          {
            "attribute": "</p>",
            "value": "End Tag",
            "description": "Closing tag with forward slash"
          }
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p>This is paragraph content.</p>\n  <h1>This is heading content.</h1>\n  <div>This is division content.</div>\n  <br /> <!-- Void element -->\n</body>\n</html>"
      },
      {
        "title": "Nested HTML Elements",
        "theory": [
          "It is very much allowed to keep one HTML element inside another HTML element.",
          "When nesting, the inner tag must always be closed before closing the outer container tag."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Nested Elements Example</title></head>\n<body>\n  <h1>This is <i>italic</i> heading</h1>\n  <p>This is <u>underlined</u> paragraph</p>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-attributes",
    "chapterNumber": 4,
    "title": "4. HTML – Attributes",
    "category": "Core Concepts",
    "shortDesc": "Core Attributes (id, title, class, style) and Internationalization Attributes (dir, lang, xml:lang).",
    "overview": [
      "An attribute is used to define the characteristics of an HTML element and is placed inside the element's opening tag.",
      "All attributes are made up of two parts: a name and a value (written as name=\"value\")."
    ],
    "sections": [
      {
        "title": "Attributes Syntax & Alignment",
        "theory": [
          "• The name is the property you want to set. For example, the paragraph <p> carries an attribute named align.",
          "• The value is what you want the property to be set to, always put within quotes. The three possible values of align are: left, center, and right."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Align Attribute Example</title></head>\n<body>\n  <p align=\"left\">This is left aligned</p>\n  <p align=\"center\">This is center aligned</p>\n  <p align=\"right\">This is right aligned</p>\n</body>\n</html>"
      },
      {
        "title": "The Four Core Attributes",
        "theory": [
          "The four core attributes that can be used on the majority of HTML elements are:",
          "1. Id: Uniquely identifies an element within an HTML page. Used to distinguish between two elements of the same name.",
          "2. Title: Gives a suggested title for the element. Displayed as a tooltip when the cursor hovers over the element.",
          "3. Class: Associates an element with a style sheet class.",
          "4. Style: Allows you to specify CSS rules directly within the element."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>The Title &amp; Style Attribute</title></head>\n<body>\n  <p id=\"html\">This para explains what is HTML</p>\n  <p id=\"css\">This para explains what is Cascading Style Sheet</p>\n  <h3 title=\"Hello HTML!\">Hover over this heading to see tooltip</h3>\n  <p style=\"font-family:arial; color:#FF0000;\">Some red colored text...</p>\n</body>\n</html>"
      },
      {
        "title": "Internationalization Attributes (dir, lang, xml:lang)",
        "theory": [
          "• dir: Indicates text flow direction. Values: \"ltr\" (Left to right, default) or \"rtl\" (Right to left for Arabic or Hebrew).",
          "• lang: Indicates the main language used in a document via ISO-639 standard two-character codes (e.g. \"en\").",
          "• xml:lang: The XHTML replacement for the lang attribute."
        ],
        "codeExample": "<!DOCTYPE html>\n<html dir=\"rtl\" lang=\"en\">\n<head><title>Display Directions</title></head>\n<body>\n  This is how right-to-left directed text renders on screen.\n</body>\n</html>"
      },
      {
        "title": "Generic Attributes Reference Table",
        "theory": [
          "Here is a list of other attributes readily usable across many HTML tags:"
        ],
        "table": [
          {
            "attribute": "align",
            "value": "right, left, center",
            "description": "Horizontally aligns tags"
          },
          {
            "attribute": "valign",
            "value": "top, middle, bottom",
            "description": "Vertically aligns tags within an HTML element"
          },
          {
            "attribute": "bgcolor",
            "value": "color name, hex, RGB",
            "description": "Places a background color behind an element"
          },
          {
            "attribute": "background",
            "value": "URL",
            "description": "Places a background image behind an element"
          },
          {
            "attribute": "id",
            "value": "User Defined",
            "description": "Names an element for use with Cascading Style Sheets & JS"
          },
          {
            "attribute": "class",
            "value": "User Defined",
            "description": "Classifies an element for CSS"
          },
          {
            "attribute": "width",
            "value": "Numeric value / %",
            "description": "Specifies width of tables, images, or cells"
          },
          {
            "attribute": "height",
            "value": "Numeric value / %",
            "description": "Specifies height of tables, images, or cells"
          },
          {
            "attribute": "title",
            "value": "User Defined text",
            "description": "Pop-up title tooltip of elements"
          }
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <table bgcolor=\"lime\" width=\"300\" height=\"80\" border=\"1\">\n    <tr>\n      <td align=\"center\" valign=\"middle\">Centered &amp; Middle Valigned</td>\n    </tr>\n  </table>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-formatting",
    "chapterNumber": 5,
    "title": "5. HTML – Formatting",
    "category": "Text Formatting",
    "shortDesc": "Bold, Italic, Underlined, Strike, Monospaced, Superscript, Subscript, Inserted, Deleted, Larger, Smaller text, and Grouping.",
    "overview": [
      "If you use a word processor, you must be familiar with the ability to make text bold, italicized, or underlined.",
      "These are part of the formatting options available to indicate how text appears in HTML."
    ],
    "sections": [
      {
        "title": "Bold, Italic, Underlined & Strike Text",
        "theory": [
          "• Bold Text: Anything that appears within <b>...</b> is displayed in bold typeface.",
          "• Italic Text: Anything that appears within <i>...</i> is displayed in italicized typeface.",
          "• Underlined Text: Anything that appears within <u>...</u> is displayed with an underline.",
          "• Strike Text: Anything that appears within <strike>...</strike> is displayed with strikethrough (thin line through text)."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Formatting Example</title></head>\n<body>\n  <p>The following word uses a <b>bold</b> typeface.</p>\n  <p>The following word uses an <i>italicized</i> typeface.</p>\n  <p>The following word uses an <u>underlined</u> typeface.</p>\n  <p>The following word uses a <strike>strikethrough</strike> typeface.</p>\n</body>\n</html>"
      },
      {
        "title": "Monospaced, Superscript & Subscript",
        "theory": [
          "• Monospaced Font: The content of <tt>...</tt> is written in monospaced font, where each letter has the exact same width.",
          "• Superscript: The content of <sup>...</sup> is displayed half a character's height above surrounding characters.",
          "• Subscript: The content of <sub>...</sub> is displayed half a character's height beneath surrounding characters."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p>The following word uses a <tt>monospaced</tt> typeface.</p>\n  <p>The following word uses a <sup>superscript</sup> typeface: 10<sup>2</sup> = 100.</p>\n  <p>The following word uses a <sub>subscript</sub> typeface: H<sub>2</sub>O.</p>\n</body>\n</html>"
      },
      {
        "title": "Inserted, Deleted, Larger & Smaller Text",
        "theory": [
          "• Inserted Text: <ins>...</ins> displays text as newly inserted.",
          "• Deleted Text: <del>...</del> displays text as deleted.",
          "• Larger Text: <big>...</big> displays text one font size larger than surrounding text.",
          "• Smaller Text: <small>...</small> displays text one font size smaller."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p>I want to drink <del>cola</del> <ins>wine</ins></p>\n  <p>The following word uses a <big>big</big> typeface.</p>\n  <p>The following word uses a <small>small</small> typeface.</p>\n</body>\n</html>"
      },
      {
        "title": "Grouping Content with <div> and <span>",
        "theory": [
          "The <div> and <span> elements allow you to group together several elements to create sections of a page.",
          "• <div> is a block-level container: used for major layout blocks like headers, menus, and article columns.",
          "• <span> is an inline element: used to style words or phrases within a sentence without breaking onto a new line."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Div and Span Example</title></head>\n<body>\n  <div id=\"menu\" align=\"middle\">\n    <a href=\"#home\">HOME</a> | <a href=\"#contact\">CONTACT</a> | <a href=\"#about\">ABOUT</a>\n  </div>\n  <div id=\"content\" style=\"background-color: #f1f5f9; padding: 15px; margin-top: 10px;\">\n    <h5>Content Articles</h5>\n    <p>This is an example of <span style=\"color:green; font-weight: bold;\">span tag</span> and the <span style=\"color:red; font-weight: bold;\">div tag</span> along with CSS.</p>\n  </div>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-phrase-tags",
    "chapterNumber": 6,
    "title": "6. HTML – Phrase Tags",
    "category": "Text Formatting",
    "shortDesc": "Emphasized, Marked, Strong, Abbreviation, Acronym, Text Direction (bdo), Special Terms, Quotes, Citations, Code, Keyboard, Variables, Output, and Address.",
    "overview": [
      "Phrase tags have been designed for specific structural purposes.",
      "Unlike purely visual tags (like b or i), phrase tags add semantic meaning to text fragments so search engines and screen readers can understand the intent."
    ],
    "sections": [
      {
        "title": "Emphasis, Strong & Marked Text",
        "theory": [
          "• Emphasized Text: <em>...</em> displays text as emphasized.",
          "• Strong Text: <strong>...</strong> displays text as having strong importance.",
          "• Marked Text: <mark>...</mark> displays text as marked with yellow highlighter ink."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p>The following word uses an <em>emphasized</em> typeface.</p>\n  <p>The following word uses a <strong>strong</strong> typeface.</p>\n  <p>The following word has been <mark>marked</mark> with yellow.</p>\n</body>\n</html>"
      },
      {
        "title": "Abbreviations, Acronyms & Text Direction",
        "theory": [
          "• <abbr title=\"Full text\">: Indicates an abbreviation. The full description must be in the title attribute.",
          "• <acronym>: Indicates an acronym (e.g. XHTML).",
          "• <bdo dir=\"rtl\">: Bi-Directional Override to force reverse text flow."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p>My best friend's name is <abbr title=\"Abhishek\">Abhy</abbr>.</p>\n  <p>This chapter covers marking up text in <acronym title=\"Extensible HTML\">XHTML</acronym>.</p>\n  <p>This text will go left to right.</p>\n  <p><bdo dir=\"rtl\">This text will go right to left.</bdo></p>\n</body>\n</html>"
      },
      {
        "title": "Special Terms, Quotes & Citations",
        "theory": [
          "• <dfn>: Definition element, used the first time a key special term is introduced in a text.",
          "• <blockquote>: Used when quoting a passage from another source. Indented from the left and right edges.",
          "• <q>: Short quotation within a sentence, rendered with quotation marks.",
          "• <cite>: Indicates reference to a source work or publication, rendered in italic."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p>The following word is a <dfn>special</dfn> term.</p>\n  <blockquote>\n    XHTML 1.0 is the W3C's first Recommendation for XHTML, following on from earlier work on HTML 4.01.\n  </blockquote>\n  <p>Amit is in Spain, <q>I think I am wrong</q>.</p>\n  <p>This HTML tutorial is derived from <cite>W3 Standard for HTML</cite>.</p>\n</body>\n</html>"
      },
      {
        "title": "Computer Code, Keyboard, Variables & Output",
        "theory": [
          "• <code>: Any programming code to appear on a web page, presented in a monospaced font.",
          "• <kbd>: Indicates keyboard input to be entered by the user.",
          "• <var>: Indicates a programming variable or parameter.",
          "• <samp>: Indicates sample program output.",
          "• <address>: Used to contain contact addresses."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p>Regular text. <code>console.log(\"This is code\");</code> Regular text.</p>\n  <p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save file.</p>\n  <p>Formula: <code>document.write(\"<var>user-name</var>\")</code></p>\n  <p>Result produced by the program is: <samp>Hello World!</samp></p>\n  <address>388A, Road No 22, Jubilee Hills - Hyderabad</address>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-meta-tags",
    "chapterNumber": 7,
    "title": "7. HTML – Meta Tags",
    "category": "Document Head",
    "shortDesc": "Adding Meta tags, Keywords, Descriptions, Revision Date, Refreshing, Redirection, Cookies, Author, and Character Sets.",
    "overview": [
      "HTML lets you specify metadata — additional important information about a document in a variety of ways.",
      "The <meta> tag is placed inside <head> and provides name/value pairs describing properties such as author, expiry date, keywords, and encoding."
    ],
    "sections": [
      {
        "title": "Keywords, Description & Author",
        "theory": [
          "• Specifying Keywords: Used by search engines when indexing your webpage for search results.",
          "• Document Description: Gives a short 1-2 sentence description shown in Google search snippets.",
          "• Setting Author: Mentions author credit for document creation."
        ],
        "table": [
          {
            "attribute": "name",
            "value": "keywords | description | author",
            "description": "Name of the metadata property."
          },
          {
            "attribute": "content",
            "value": "text",
            "description": "Value of the metadata property."
          },
          {
            "attribute": "http-equiv",
            "value": "refresh | content-type | cookie",
            "description": "Simulates HTTP response message headers."
          }
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Meta Tags Example</title>\n  <meta name=\"keywords\" content=\"HTML, Meta Tags, Metadata, Web Tutorials\" />\n  <meta name=\"description\" content=\"Learning about Meta Tags in HTML with full practical examples.\" />\n  <meta name=\"author\" content=\"Mahnaz Mohtashim\" />\n  <meta name=\"revised\" content=\"Tutorialspoint, 3/7/2014\" />\n</head>\n<body>\n  <p>Hello HTML5! Meta tags are embedded in the head section above.</p>\n</body>\n</html>"
      },
      {
        "title": "Document Refreshing & Page Redirection",
        "theory": [
          "• Document Refreshing: Using <meta http-equiv=\"refresh\" content=\"5\" /> automatically reloads the page every 5 seconds.",
          "• Page Redirection: Specifying a destination URL like <meta http-equiv=\"refresh\" content=\"5; url=http://example.com\" /> redirects the visitor to a new URL after 5 seconds."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Auto-Redirection Demo</title>\n  <!-- Redirects to destination URL after 5 seconds -->\n  <meta http-equiv=\"refresh\" content=\"5; url=http://www.tutorialspoint.com\" />\n</head>\n<body>\n  <h3>Redirecting in 5 Seconds...</h3>\n  <p>If you are not redirected automatically, please click <a href=\"http://www.tutorialspoint.com\">here</a>.</p>\n</body>\n</html>"
      },
      {
        "title": "Cookies & Character Encoding",
        "theory": [
          "• Setting Cookies: Using <meta http-equiv=\"cookie\" content=\"userid=xyz; expires=Wednesday, 08-Aug-25 23:59:59 GMT;\" /> stores client cookies.",
          "• Specifying Character Set: Specifies encoding like UTF-8 (covering universal characters) or Big5 (for traditional Chinese characters)."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Charset Encoding Example</title>\n  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\n</head>\n<body>\n  <p>This page is configured with standard UTF-8 character encoding.</p>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-comments",
    "chapterNumber": 8,
    "title": "8. HTML – Comments",
    "category": "Fundamentals",
    "shortDesc": "Valid vs Invalid comments, Multiline comments, Conditional comments for IE, and commenting JavaScript & CSS.",
    "overview": [
      "A comment is a piece of code which is ignored by any web browser.",
      "It is a good practice to add comments into your HTML code, especially in complex documents, to indicate sections and notes to anyone looking at the code."
    ],
    "sections": [
      {
        "title": "Valid vs. Invalid Comments",
        "theory": [
          "HTML comments are placed in between <!-- ... --> tags.",
          "Comments do NOT nest: you cannot put a comment inside another comment.",
          "The double-dash sequence \"--\" may not appear inside a comment except as part of the closing --> tag.",
          "There must be NO space between the left angle bracket and the exclamation mark (<!-- is valid, < !-- is invalid)."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head> \n  <!-- Document Header Starts -->\n  <title>Valid Comment Example</title>\n  <!-- Document Header Ends -->\n</head>\n<body>\n  <!-- This is a valid comment -->\n  <p>Document content goes here.....</p>\n</body>\n</html>"
      },
      {
        "title": "Multiline & Conditional Comments",
        "theory": [
          "• Multiline Comments: Can span through as many lines as you like between <!-- and -->.",
          "• Conditional Comments: Supported from Internet Explorer 5 onwards (<!--[if IE 6]> ... <![endif]-->) to give specific instructions to older IE browsers."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <!-- \n    This is a multiline comment and it can\n    span through as many lines as you like.\n  -->\n  <!--[if IE 6]>\n    <p>Special instructions for Internet Explorer 6 users here.</p>\n  <![endif]-->\n</head>\n<body>\n  <p>Notice the multiline comment in the source code.</p>\n</body>\n</html>"
      },
      {
        "title": "Commenting Scripts & Stylesheets",
        "theory": [
          "In older browsers that did not support JavaScript or CSS, scripts would get displayed as raw text on screen.",
          "To prevent this, developers wrapped scripts inside HTML comments so older browsers safely ignored them while modern browsers still executed them."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <style>\n  <!--\n    .example { border: 1px solid #4a7d49; }\n  //-->\n  </style>\n  <script>\n  <!--\n    document.write(\"Hello World from commented script!\");\n  //-->\n  </script>\n</head>\n<body>\n  <div class=\"example\">Styled container demo.</div>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-images",
    "chapterNumber": 9,
    "title": "9. HTML – Images",
    "category": "Media & Assets",
    "shortDesc": "Insert Image, Set Image Location, Width, Height, Border, Alignment, and Free Web Graphics.",
    "overview": [
      "Images are very important to beautify as well as to depict complex concepts in a simple way on your web page.",
      "Images are inserted using the empty <img> tag, which contains attributes only and has no closing tag."
    ],
    "sections": [
      {
        "title": "Inserting Images & alt Attribute",
        "theory": [
          "Syntax: <img src=\"Image URL\" alt=\"Description\" />",
          "• src: The file path or web URL where the image is stored. Image names are case-sensitive!",
          "• alt: Mandatory attribute which specifies alternate text if the image fails to load or for screen readers used by visually impaired visitors."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Using Image in Webpage</title></head>\n<body>\n  <p>Simple Image Insert:</p>\n  <img src=\"https://picsum.photos/350/180\" alt=\"Sample Landscape Photo\" />\n</body>\n</html>"
      },
      {
        "title": "Setting Dimensions, Borders & Alignment",
        "theory": [
          "• Width & Height: You can set image width and height using width and height attributes in terms of pixels or percentages.",
          "• Border: Adds a border around the picture in pixels (e.g. border=\"3\"). A value of 0 removes borders.",
          "• Align: By default images align at the left, but align=\"right\" or align=\"center\" wraps text alongside."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Setting Dimensions, Border and Alignment</h3>\n  <p>\n    <img src=\"https://picsum.photos/160/100\" alt=\"Thumb\" width=\"160\" height=\"100\" border=\"3\" align=\"right\" style=\"margin-left: 15px;\" />\n    This text will wrap around the right-aligned image. You can specify exact pixels for width, height, and border thickness.\n  </p>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-tables",
    "chapterNumber": 10,
    "title": "10. HTML – Tables",
    "category": "Data & Tables",
    "shortDesc": "Table Headings, Cellpadding & Cellspacing, Colspan & Rowspan, Backgrounds, Dimensions, Captions, Header/Body/Footer, and Nested Tables.",
    "overview": [
      "HTML tables allow web authors to arrange data like text, images, links, other tables into rows and columns of cells.",
      "HTML tables are created using <table> with <tr> for rows and <td> for data cells."
    ],
    "sections": [
      {
        "title": "Table Headings & Basic Structure",
        "theory": [
          "• Table Heading (<th>): Put in place of <td> to represent header columns. Displayed in bold and centered by default.",
          "• border: Attribute on <table> to put a border across all cells. Use border=\"0\" for no borders."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>HTML Table Header</title></head>\n<body>\n  <table border=\"1\" width=\"100%\">\n    <tr>\n      <th>Name</th>\n      <th>Salary</th>\n    </tr>\n    <tr>\n      <td>Ramesh Raman</td>\n      <td>5000</td>\n    </tr>\n    <tr>\n      <td>Shabbir Hussein</td>\n      <td>7000</td>\n    </tr>\n  </table>\n</body>\n</html>"
      },
      {
        "title": "Cellpadding and Cellspacing Attributes",
        "theory": [
          "• cellpadding: Defines the distance between cell borders and the content within a cell.",
          "• cellspacing: Defines the width of space and borders between individual cells."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>HTML Table Cellpadding</title></head>\n<body>\n  <table border=\"1\" cellpadding=\"8\" cellspacing=\"6\" width=\"100%\">\n    <tr>\n      <th>Name</th>\n      <th>Salary</th>\n    </tr>\n    <tr>\n      <td>Ramesh Raman</td>\n      <td>5000</td>\n    </tr>\n    <tr>\n      <td>Shabbir Hussein</td>\n      <td>7000</td>\n    </tr>\n  </table>\n</body>\n</html>"
      },
      {
        "title": "Colspan, Rowspan & Backgrounds",
        "theory": [
          "• colspan=\"n\": Merges two or more columns into a single column.",
          "• rowspan=\"n\": Merges two or more rows into a single row.",
          "• bgcolor: Sets background color for the whole table or individual <td> cells.",
          "• background: Sets a background image URL."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Colspan and Rowspan</title></head>\n<body>\n  <table border=\"1\" bordercolor=\"green\" bgcolor=\"#FFFDF0\" cellpadding=\"6\" width=\"100%\">\n    <tr>\n      <th>Column 1</th>\n      <th>Column 2</th>\n      <th>Column 3</th>\n    </tr>\n    <tr>\n      <td rowspan=\"2\" bgcolor=\"#E7E9EB\">Row 1 Cell 1 (rowspan=\"2\")</td>\n      <td>Row 1 Cell 2</td>\n      <td>Row 1 Cell 3</td>\n    </tr>\n    <tr>\n      <td>Row 2 Cell 2</td>\n      <td>Row 2 Cell 3</td>\n    </tr>\n    <tr>\n      <td colspan=\"3\" bgcolor=\"#D9EEE1\" align=\"center\">Row 3 Cell 1 (colspan=\"3\")</td>\n    </tr>\n  </table>\n</body>\n</html>"
      },
      {
        "title": "Caption, Header, Body, Footer & Nested Tables",
        "theory": [
          "• <caption>: Serves as a title/explanation showing at the top of the table.",
          "• <thead>, <tbody>, <tfoot>: Divides table into header, body, and footer sections.",
          "• Nested Tables: You can put an entire <table> inside any table data cell (<td>)."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <table border=\"1\" width=\"100%\">\n    <caption>Quarterly Financial Summary</caption>\n    <thead>\n      <tr bgcolor=\"#04AA6D\" style=\"color:white;\">\n        <th colspan=\"2\">Fiscal Year 2026</th>\n      </tr>\n    </thead>\n    <tfoot>\n      <tr bgcolor=\"#f1f5f9\">\n        <td colspan=\"2\">Footnote: Audited report</td>\n      </tr>\n    </tfoot>\n    <tbody>\n      <tr>\n        <td>Department A</td>\n        <td>\n          <!-- Nested Table inside cell -->\n          <table border=\"1\" width=\"100%\">\n            <tr><th>Q1</th><th>Q2</th></tr>\n            <tr><td>$12,000</td><td>$15,000</td></tr>\n          </table>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-lists",
    "chapterNumber": 11,
    "title": "11. HTML – Lists",
    "category": "Lists & Navigation",
    "shortDesc": "Unordered Lists (ul) with disc/circle/square, Ordered Lists (ol) with numbering schemes & start attributes, and Definition Lists (dl, dt, dd).",
    "overview": [
      "HTML offers web authors three ways for specifying lists of information: Unordered lists (<ul>), Ordered lists (<ol>), and Definition lists (<dl>)."
    ],
    "sections": [
      {
        "title": "HTML Unordered Lists & type Attribute",
        "theory": [
          "An unordered list is a collection of related items with bullets. Created using <ul> tag and <li> for list items.",
          "You can use the type attribute to specify bullet styles: type=\"square\", type=\"disc\" (default), or type=\"circle\"."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p>Square Bullets:</p>\n  <ul type=\"square\">\n    <li>Beetroot</li>\n    <li>Ginger</li>\n    <li>Potato</li>\n  </ul>\n\n  <p>Circle Bullets:</p>\n  <ul type=\"circle\">\n    <li>Coffee</li>\n    <li>Tea</li>\n    <li>Milk</li>\n  </ul>\n</body>\n</html>"
      },
      {
        "title": "HTML Ordered Lists & type / start Attributes",
        "theory": [
          "Ordered lists display numbered items using <ol>.",
          "Supported numbering schemes via type attribute:",
          "• type=\"1\" : Default numbers (1, 2, 3...)",
          "• type=\"I\" : Uppercase Roman numerals (I, II, III...)",
          "• type=\"i\" : Lowercase Roman numerals (i, ii, iii...)",
          "• type=\"A\" : Uppercase Letters (A, B, C...)",
          "• type=\"a\" : Lowercase Letters (a, b, c...)",
          "• start=\"n\" : Specifies the starting number index (e.g. start=\"4\" starts at 4 or IV or d)."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <h4>Roman Numerals starting at 4:</h4>\n  <ol type=\"i\" start=\"4\">\n    <li>Step Four (iv)</li>\n    <li>Step Five (v)</li>\n    <li>Step Six (vi)</li>\n  </ol>\n\n  <h4>Alphabetical Letters:</h4>\n  <ol type=\"A\">\n    <li>Primary Objective</li>\n    <li>Secondary Goal</li>\n  </ol>\n</body>\n</html>"
      },
      {
        "title": "HTML Definition Lists (<dl>, <dt>, <dd>)",
        "theory": [
          "Definition lists arrange items in the same way as a dictionary or glossary.",
          "• <dl>: Defines the start of the list.",
          "• <dt>: Defines the term to be defined.",
          "• <dd>: Defines the description or definition of that term."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Web Glossary</h3>\n  <dl>\n    <dt><b>HTML</b></dt>\n    <dd>This stands for Hyper Text Markup Language</dd>\n    <dt><b>HTTP</b></dt>\n    <dd>This stands for Hyper Text Transfer Protocol</dd>\n  </dl>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-text-links",
    "chapterNumber": 12,
    "title": "12. HTML – Text Links",
    "category": "Hyperlinks",
    "shortDesc": "Anchor tag (a), href, target (_blank, _self, _parent, _top), base path, linking to page sections (bookmarks), link colors, and file downloads.",
    "overview": [
      "A webpage can contain links (hyperlinks) that take you directly to other pages or specific sections of a page.",
      "Links are created using the anchor tag <a>."
    ],
    "sections": [
      {
        "title": "Anchor Tag & target Attribute",
        "theory": [
          "Syntax: <a href=\"Document URL\" target=\"...\">Link Text</a>",
          "target options include:",
          "• _blank: Opens the linked document in a brand new browser window or tab.",
          "• _self: Opens in the same window/frame where clicked (default).",
          "• _parent: Opens in parent frame.",
          "• _top: Opens in the full body of the window, breaking out of frames."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p><a href=\"http://www.tutorialspoint.com\" target=\"_blank\">Open Tutorials Point in New Tab</a></p>\n  <p><a href=\"http://www.tutorialspoint.com\" target=\"_self\">Open in Same Tab</a></p>\n</body>\n</html>"
      },
      {
        "title": "Base Path & Section Linking (Bookmarks)",
        "theory": [
          "• <base href=\"...\">: Put inside <head> to set a base path for all relative links on the page.",
          "• Linking to a Section: You can jump to a bookmark on the same page in two steps: create an anchor <a name=\"top\"></a>, then link to it with <a href=\"#top\">Go to the Top</a>."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <h1>HTML Text Links <a name=\"top\"></a></h1>\n  <p>Scroll down or click the jump link below.</p>\n  <div style=\"height: 120px;\">Spacer block</div>\n  <a href=\"#top\">▲ Go to the Top of the page</a>\n</body>\n</html>"
      },
      {
        "title": "Link Colors & Download Links",
        "theory": [
          "• Link colors can be configured on <body> tag: link (unvisited link color), alink (active clicked link color), and vlink (visited link color).",
          "• Download Links: Direct URL to a PDF, DOC, or ZIP file prompts the user to download the file."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body alink=\"#54A250\" link=\"#040404\" vlink=\"#F40633\">\n  <p><a href=\"http://www.tutorialspoint.com/page.pdf\">Download PDF File</a></p>\n</body>\n</html>"
      }
    ]
  },
  {
  "id": "html-image-maps",
  "chapterNumber": 10,
  "title": "HTML \u2013 Image Maps (<map> & <area>)",
  "category": "Graphics & Navigation",
  "shortDesc": "Create mouse-sensitive clickable regions on images using <map> and <area> with rect, circle, and poly shapes.",
  "overview": [
    "An HTML Image Map is an image with clickable areas (hotspots). Clicking on different parts of the single image navigates the user to different destinations or triggers actions.",
    "HTML supports both Client-Side Image Maps (enabled via usemap=\"#mapname\") and Server-Side Image Maps (enabled via ismap). Client-side image maps are the modern standard because coordinates are computed locally in the browser with instant tooltips and no extra server roundtrips.",
    "The <map> tag contains one or more <area> tags, each defining the geometric shape, coordinate boundaries, destination URL, and accessible alternative text."
  ],
  "sections": [
    {
      "title": "Client-Side Image Maps (<map> & <area>) Mechanics",
      "theory": [
        "To bind an image to a map, the <img> element must specify the usemap attribute matching the name attribute of the <map> prefixed with a hash: <img src=\"...\" usemap=\"#workmap\">.",
        "The <map name=\"workmap\"> element acts as the container for geometric hotspot areas.",
        "Shape 'rect' requires 4 coordinates: x1, y1 (upper-left corner) and x2, y2 (lower-right corner).",
        "Shape 'circle' requires 3 coordinates: center_x, center_y, and radius.",
        "Shape 'poly' requires 3 or more pairs of coordinates: x1, y1, x2, y2, x3, y3, ... defining polygon boundary vertices.",
        "Shape 'default' specifies the entire area not covered by any defined shape."
      ],
      "syntax": "<!-- Image binding to map -->\n<img src=\"workplace.jpg\" alt=\"Workplace\" usemap=\"#workmap\">\n\n<!-- Map definition with clickable hotspots -->\n<map name=\"workmap\">\n  <area shape=\"rect\" coords=\"34,44,270,350\" alt=\"Computer\" href=\"computer.html\">\n  <area shape=\"circle\" coords=\"337,300,44\" alt=\"Coffee Cup\" href=\"coffee.html\">\n  <area shape=\"poly\" coords=\"140,121,181,116,204,160,170,180\" alt=\"Smartphone\" href=\"phone.html\">\n  <area shape=\"default\" alt=\"Workplace Area\" href=\"office.html\">\n</map>",
      "tips": [
        "Always provide a meaningful 'alt' attribute on every <area> tag for accessibility and screen readers (WCAG compliance).",
        "Image maps are based on static pixel coordinates. For responsive layouts that scale with screen width, modern developers use inline SVG (<svg> with <path>) or CSS polygon clip-paths.",
        "Never omit the leading '#' in the <img> usemap attribute (e.g. usemap=\"#myMap\")."
      ],
      "table": [
        {
          "attribute": "<map name=\"name\">",
          "value": "Map Container",
          "description": "Names the image map referenced by <img> usemap=\"#name\"."
        },
        {
          "attribute": "shape=\"rect\"",
          "value": "coords=\"x1,y1,x2,y2\"",
          "description": "Rectangular hotspot. Upper-left (x1, y1) to lower-right (x2, y2)."
        },
        {
          "attribute": "shape=\"circle\"",
          "value": "coords=\"x,y,r\"",
          "description": "Circular hotspot. Center point (x, y) and radius r."
        },
        {
          "attribute": "shape=\"poly\"",
          "value": "coords=\"x1,y1,x2,y2...\"",
          "description": "Polygon hotspot. Sequential pairs of x, y vertices enclosing the region."
        },
        {
          "attribute": "shape=\"default\"",
          "value": "Entire remainder",
          "description": "Captures any clicks on the image not inside another defined area."
        },
        {
          "attribute": "href=\"url\"",
          "value": "Hyperlink URL",
          "description": "Target destination URL or page anchor (#id)."
        },
        {
          "attribute": "target=\"_blank\"",
          "value": "Window Target",
          "description": "Opens the link in a new tab (_blank), same frame (_self), or parent."
        },
        {
          "attribute": "alt=\"description\"",
          "value": "Accessibility Text",
          "description": "Required alternative text describing the hotspot for screen readers."
        }
      ],
      "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <title>HTML Client-Side Image Map Demo</title>\n</head>\n<body>\n  <h3>Interactive Office Blueprint (Client-Side Image Map)</h3>\n  <p>Hover and click the different areas (Laptop, Coffee, Phone) below:</p>\n\n  <!-- 100% Offline SVG graphic used as image source -->\n  <img \n    src=\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' style='background:%230f172a;font-family:sans-serif;'><rect x='30' y='30' width='140' height='100' rx='6' fill='%233b82f6'/><text x='100' y='85' fill='white' text-anchor='middle' font-size='14' font-weight='bold'>Laptop (Rect)</text><circle cx='240' cy='80' r='45' fill='%23ef4444'/><text x='240' y='85' fill='white' text-anchor='middle' font-size='13' font-weight='bold'>Coffee (Circle)</text><polygon points='310,140 370,110 390,160 330,190' fill='%2310b981'/><text x='350' y='155' fill='white' text-anchor='middle' font-size='11' font-weight='bold'>Phone</text></svg>\"\n    alt=\"Office Desk Blueprint\"\n    usemap=\"#officeMap\"\n    width=\"400\"\n    height=\"200\"\n    style=\"border: 2px solid #334155; border-radius: 8px; display: block;\"\n  />\n\n  <!-- Map definition linking to geometric coordinates -->\n  <map name=\"officeMap\">\n    <!-- Rectangle: Laptop area from (30,30) to (170,130) -->\n    <area shape=\"rect\" coords=\"30,30,170,130\" href=\"#laptop-specs\" alt=\"Laptop Computer Specs\" onclick=\"alert('Clicked Laptop Hotspot! (shape=rect coords=30,30,170,130)'); return false;\">\n\n    <!-- Circle: Coffee cup centered at (240, 80) with radius 45 -->\n    <area shape=\"circle\" coords=\"240,80,45\" href=\"#coffee-break\" alt=\"Coffee Station\" onclick=\"alert('Clicked Coffee Cup Hotspot! (shape=circle coords=240,80,45)'); return false;\">\n\n    <!-- Polygon: Smartphone vertices -->\n    <area shape=\"poly\" coords=\"310,140,370,110,390,160,330,190\" href=\"#mobile-notifications\" alt=\"Mobile Phone\" onclick=\"alert('Clicked Smartphone Hotspot! (shape=poly)'); return false;\">\n  </map>\n</body>\n</html>",
      "browserOutputDesc": "Displays an interactive diagram containing a clickable blue Laptop rectangle, red Coffee circle, and green Smartphone polygon. Clicking each region triggers its respective action."
    },
    {
      "title": "10th-Grade Analogy & Interview Point",
      "theory": [
        "Analogy: Think of a tourist museum map or an anatomy poster in a biology lab. Instead of printing 5 separate pictures of the heart, brain, lungs, and stomach, the museum hangs ONE big poster. When a visitor presses the heart, an audio guide explains the circulatory system; pressing the brain plays neuroscience notes! That's exactly how HTML <map> and <area> work on a single image!",
        "Interview Point: If asked 'What is the main limitation of HTML Image Maps today and what is the modern replacement?', answer: HTML Image Maps use static pixel coordinates, so if the image is resized responsively (e.g. `img { max-width: 100%; height: auto; }`), the clickable coordinate coordinates do NOT scale with the image and become misaligned! In modern responsive web design, developers replace image maps with inline SVG (`<svg>` with `<path>` elements and CSS `:hover`), which scale vectorially across all screen resolutions."
      ],
      "codeExample": "<!-- Server-Side vs Client-Side Map comparison -->\n<!-- 1. Client-Side Image Map (Recommended): Browser calculates click coordinates locally -->\n<img src=\"world-map.png\" usemap=\"#world\" alt=\"World Map\">\n\n<!-- 2. Server-Side Image Map (Legacy): Browser sends click (x, y) coordinates to server script -->\n<a href=\"/cgi-bin/map-handler.cgi\">\n  <img src=\"world-map.png\" ismap alt=\"World Map\">\n</a>",
      "browserOutputDesc": "Demonstrates the syntactic difference between client-side (usemap) and server-side (ismap) maps."
    }
  ]
},
  {
    "id": "html-image-links",
    "chapterNumber": 13,
    "title": "13. HTML – Image Links",
    "category": "Hyperlinks",
    "shortDesc": "Using images as clickable hyperlinks, Mouse-Sensitive Image Maps, Server-Side Maps (ismap), and Client-Side Maps (usemap, map, area, coords).",
    "overview": [
      "Just like text, images can be made into clickable hyperlinks.",
      "Furthermore, with Image Maps you can define multiple clickable hotspots on a single image based on geometric coordinates."
    ],
    "sections": [
      {
        "title": "Simple Image Hyperlinks",
        "theory": [
          "To make an image a link, simply place the <img> tag inside an <a> tag.",
          "Set border=\"0\" to remove default blue hyperlink borders in older browsers."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p>Click the image below to visit tutorial home:</p>\n  <a href=\"https://example.com\" target=\"_self\">\n    <img src=\"https://picsum.photos/250/100\" alt=\"Clickable Logo\" border=\"0\" />\n  </a>\n</body>\n</html>"
      },
      {
        "title": "Client-Side Image Maps (<map> & <area>)",
        "theory": [
          "Client-side image maps use the usemap=\"#mapname\" attribute on <img> paired with a <map name=\"mapname\"> containing <area> tags.",
          "Supported shapes and coordinates:",
          "• rect: coords=\"x1, y1, x2, y2\" (upper-left and lower-right corners)",
          "• circle: coords=\"xc, yc, radius\" (center x, center y, radius)",
          "• poly: coords=\"x1, y1, x2, y2, x3, y3...\" (polygon vertices)"
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p>Search and click the hotspot circle on the map:</p>\n  <img src=\"https://picsum.photos/300/150\" alt=\"HTML Map\" border=\"0\" usemap=\"#htmlmap\" />\n  \n  <map name=\"htmlmap\">\n    <area shape=\"circle\" coords=\"80,75,40\" href=\"#circle-target\" alt=\"Circle Topic\" target=\"_self\" />\n    <area shape=\"rect\" coords=\"160,30,280,120\" href=\"#rect-target\" alt=\"Rect Topic\" target=\"_self\" />\n  </map>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-email-links",
    "chapterNumber": 14,
    "title": "14. HTML – Email Links",
    "category": "Hyperlinks",
    "shortDesc": "HTML Email Tag (mailto:), Default Subject, Body parameters, and spam considerations.",
    "overview": [
      "HTML provides the mailto: scheme within anchor tags to launch the visitor's email client (Outlook, Mail, Thunderbird) with pre-filled recipient and subject fields."
    ],
    "sections": [
      {
        "title": "HTML Email Tag Syntax & Pre-filled Defaults",
        "theory": [
          "Syntax: <a href=\"mailto:abc@example.com\">Send Email</a>",
          "You can add default query parameters: ?subject=YourSubject&body=YourMessage.",
          "Note: If a visitor does not have a configured email client installed, mailto links may not work. For production websites, HTML forms with backend processing are often preferred."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Contact Us via Email</h3>\n  <a href=\"mailto:support@example.com?subject=Website%20Feedback&body=Hello%20Team,\">\n    Send Pre-filled Feedback Email\n  </a>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-frames",
    "chapterNumber": 15,
    "title": "15. HTML – Frames",
    "category": "Frames & Layout",
    "shortDesc": "HTML frames, frameset tag attributes (rows, cols, border), frame tag attributes (src, name, noresize), target frames, and browser support.",
    "overview": [
      "HTML frames were used in early web standards to divide the browser window into multiple sections, each loading a separate HTML document.",
      "A collection of frames in a window is known as a frameset."
    ],
    "sections": [
      {
        "title": "Creating Frames & Disadvantages",
        "theory": [
          "To use frames, <frameset> replaces the <body> tag. The rows attribute defines horizontal frames, and cols attribute defines vertical frames.",
          "Disadvantages of Frames: Smaller devices cannot cope with frames, bookmarks and browser back button fail, and modern HTML5 has completely obsolete them in favor of iframes and CSS."
        ],
        "codeExample": "<!-- Classic HTML Frameset Skeleton -->\n<!DOCTYPE html>\n<html>\n<head><title>HTML Frames</title></head>\n<frameset rows=\"20%, 80%\">\n  <frame name=\"top\" src=\"top.html\" />\n  <frame name=\"main\" src=\"main.html\" />\n  <noframes>\n    <body>\n      <p>Your browser does not support frames.</p>\n    </body>\n  </noframes>\n</frameset>\n</html>"
      },
      {
        "title": "Frameset & Frame Tag Attributes",
        "theory": [
          "Attributes for <frameset>: cols (pixels, %, or * wildcard), rows, border, frameborder (1 or 0), framespacing.",
          "Attributes for <frame>: src, name (target for links), marginwidth, marginheight, noresize (prevents resizing), scrolling (yes/no/auto)."
        ],
        "table": [
          {
            "attribute": "cols / rows",
            "value": "10%, 80%, 10% | 200, *",
            "description": "Divides window into columns or rows"
          },
          {
            "attribute": "name",
            "value": "frame_name",
            "description": "Names frame to target links via <a target=\"frame_name\">"
          },
          {
            "attribute": "noresize",
            "value": "noresize",
            "description": "Prevents user from dragging frame borders"
          },
          {
            "attribute": "scrolling",
            "value": "yes | no | auto",
            "description": "Controls visibility of scrollbars"
          }
        ],
        "codeExample": "<!-- Targeting Links to Frame -->\n<!-- In menu.html: -->\n<!-- <a href=\"page1.html\" target=\"main_page\">Load Page 1</a> -->"
      }
    ]
  },
  {
    "id": "html-iframes",
    "chapterNumber": 16,
    "title": "16. HTML – Iframes",
    "category": "Frames & Layout",
    "shortDesc": "Inline Frames: iframe src, width, height, frameborder, name, scrolling, and HTML5 sandbox.",
    "overview": [
      "An <iframe> (inline frame) defines a rectangular window inside your webpage in which the browser can display a completely separate document, including scrollbars and borders."
    ],
    "sections": [
      {
        "title": "Iframe Syntax & Attributes",
        "theory": [
          "Unlike <frameset>, an <iframe> can appear anywhere within the standard <body> of your document.",
          "Attributes include: src (URL to load), width, height, frameborder (0 or 1), scrolling, and the modern HTML5 sandbox attribute to prevent untrusted scripts from running."
        ],
        "table": [
          {
            "attribute": "src",
            "value": "URL",
            "description": "URL of the document to embed"
          },
          {
            "attribute": "width / height",
            "value": "Pixels or %",
            "description": "Dimensions of the inline frame"
          },
          {
            "attribute": "sandbox",
            "value": "allow-scripts, allow-same-origin",
            "description": "Applies security restrictions to the frame"
          }
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>HTML Iframes</title></head>\n<body>\n  <p>Document content above frame...</p>\n  <iframe src=\"https://example.com\" width=\"100%\" height=\"220\" frameborder=\"1\">\n    Sorry, your browser does not support inline frames.\n  </iframe>\n  <p>Document content below frame...</p>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-blocks",
    "chapterNumber": 17,
    "title": "17. HTML – Blocks",
    "category": "Layout & Grouping",
    "shortDesc": "Block-level elements vs Inline elements, <div> for structural grouping, and <span> for inline grouping.",
    "overview": [
      "All HTML elements are categorized into two fundamental display categories: (a) Block Level Elements and (b) Inline Elements."
    ],
    "sections": [
      {
        "title": "Block vs. Inline Elements",
        "theory": [
          "• Block Elements: Appear on the screen as if they have a line break before and after them. They start on their own new line and span full width. Examples: <p>, <h1>-<h6>, <ul>, <ol>, <pre>, <hr />, <blockquote>, <address>, <div>.",
          "• Inline Elements: Appear within sentences and do not force a new line. Examples: <b>, <i>, <u>, <em>, <strong>, <sup>, <sub>, <big>, <small>, <code>, <cite>, <span>."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <!-- Block element starts on fresh row -->\n  <div style=\"background-color: #e2e8f0; padding: 10px;\">\n    This is a block-level DIV container.\n  </div>\n  \n  <!-- Inline elements flow together on same line -->\n  <p>\n    This sentence contains an <span style=\"color:red;\">inline red span</span> and an <span style=\"color:green;\">inline green span</span>.\n  </p>\n</body>\n</html>"
      },
      {
        "title": "Grouping with <div> & CSS Styling",
        "theory": [
          "<div> is the most important block-level tag for grouping elements and applying CSS layout structures (columns, cards, headers, footers).",
          "By itself, <div> does not change the appearance, but becomes powerful when paired with CSS colors, width, and padding."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <div style=\"color: red; border: 1px solid red; padding: 10px; margin-bottom: 10px;\">\n    <h4>First Group (Vegetables)</h4>\n    <ul>\n      <li>Beetroot</li>\n      <li>Ginger</li>\n    </ul>\n  </div>\n  <div style=\"color: green; border: 1px solid green; padding: 10px;\">\n    <h4>Second Group (Fruits)</h4>\n    <ul>\n      <li>Apple</li>\n      <li>Mango</li>\n    </ul>\n  </div>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-backgrounds",
    "chapterNumber": 18,
    "title": "18. HTML – Backgrounds",
    "category": "Styling",
    "shortDesc": "HTML background with colors (bgcolor), background with images, patterned backgrounds, and transparency.",
    "overview": [
      "By default, webpage backgrounds are plain white. HTML provides two historical methods to decorate backgrounds: bgcolor (for colors) and background (for images)."
    ],
    "sections": [
      {
        "title": "Background with Colors (bgcolor)",
        "theory": [
          "The bgcolor attribute controls the background of <body> and <table> tags.",
          "Color formats accepted: Color name (e.g. \"lime\"), Hex value (e.g. \"#f1f1f1\"), or RGB (e.g. \"rgb(0,0,120)\")."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>HTML Background Colors</title></head>\n<body>\n  <table bgcolor=\"yellow\" width=\"100%\" cellpadding=\"10\">\n    <tr><td>This background is yellow</td></tr>\n  </table>\n  <br />\n  <table bgcolor=\"#6666FF\" width=\"100%\" cellpadding=\"10\" style=\"color: white;\">\n    <tr><td>This background is sky blue (#6666FF)</td></tr>\n  </table>\n</body>\n</html>"
      },
      {
        "title": "Background with Images & Patterns",
        "theory": [
          "The background attribute on <body> or <table> specifies an image URL that tiles across the element.",
          "Small 1x1 or patterned GIF/PNG images can be used to generate lightweight patterned wallpapers."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <table background=\"https://picsum.photos/100/100\" width=\"100%\" height=\"150\" border=\"1\">\n    <tr>\n      <td align=\"center\" style=\"color: white; font-weight: bold; background: rgba(0,0,0,0.5);\">\n        This table cell is filled with a tiled background image pattern.\n      </td>\n    </tr>\n  </table>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-colors",
    "chapterNumber": 19,
    "title": "19. HTML – Colors",
    "category": "Styling",
    "shortDesc": "Color Coding Methods: Color names (W3C standard 16 colors), Hex codes (#RRGGBB), RGB values, and the 216 Browser Safe Palette.",
    "overview": [
      "Colors are essential to give a good look and feel to your website.",
      "Colors can be specified using color names, hex codes, or RGB values."
    ],
    "sections": [
      {
        "title": "Color Coding Schemes & 16 W3C Colors",
        "theory": [
          "There are three different methods to set colors in HTML:",
          "1. Color Names: Predefined names like green, blue, red. W3C listed 16 basic standard colors: Black, Gray, Silver, White, Yellow, Lime, Aqua, Fuchsia, Red, Green, Blue, Purple, Maroon, Olive, Navy, Teal.",
          "2. Hex Codes: A six-digit code representing Red, Green, Blue in hex (#RRGGBB). Examples: #000000 (Black), #FF0000 (Red), #00FF00 (Green), #0000FF (Blue), #FFFFFF (White).",
          "3. RGB Values: Specified using rgb(red, green, blue) where each value is an integer from 0 to 255."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body bgcolor=\"#000000\" text=\"#FFFFFF\">\n  <h3 style=\"color: lime;\">1. Named Color: Lime</h3>\n  <h3 style=\"color: #00FFFF;\">2. Hex Color: Aqua (#00FFFF)</h3>\n  <h3 style=\"color: rgb(255, 0, 255);\">3. RGB Color: Fuchsia (255, 0, 255)</h3>\n</body>\n</html>"
      },
      {
        "title": "Browser Safe Colors (216 Palette)",
        "theory": [
          "The 216 colors palette contains colors supported across all computer monitors having a 256-color palette without dithering.",
          "Hex values in this palette are combinations of 00, 33, 66, 99, CC, and FF."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <div style=\"display: flex; gap: 8px;\">\n    <div style=\"background: #003366; color: white; padding: 10px;\">#003366</div>\n    <div style=\"background: #339966; color: white; padding: 10px;\">#339966</div>\n    <div style=\"background: #CC3300; color: white; padding: 10px;\">#CC3300</div>\n    <div style=\"background: #FFCC00; color: black; padding: 10px;\">#FFCC00</div>\n  </div>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-fonts",
    "chapterNumber": 20,
    "title": "20. HTML – Fonts",
    "category": "Typography",
    "shortDesc": "Set Font Size (1 to 7), Relative Font Size (+1/-1), Font Face, Font Color, and the <basefont> element.",
    "overview": [
      "Fonts play an important role in readability and visual presentation. Historically, the <font> and <basefont> tags customized font attributes before CSS became universal."
    ],
    "sections": [
      {
        "title": "Font Size & Relative Sizing",
        "theory": [
          "• size=\"1\" to \"7\": Accepted values range from 1 (smallest) to 7 (largest). The default font size is 3.",
          "• Relative size: Sizing relative to default using size=\"+n\" or size=\"-n\" (e.g. size=\"+2\" or size=\"-1\")."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head><title>Setting Font Size</title></head>\n<body>\n  <font size=\"1\">Font size=\"1\" (Smallest)</font><br />\n  <font size=\"3\">Font size=\"3\" (Default)</font><br />\n  <font size=\"5\">Font size=\"5\"</font><br />\n  <font size=\"7\">Font size=\"7\" (Largest)</font><br />\n  <font size=\"+2\" color=\"blue\">Relative font size=\"+2\"</font>\n</body>\n</html>"
      },
      {
        "title": "Font Face, Color & <basefont>",
        "theory": [
          "• face: Specifies font family (e.g. face=\"Times New Roman\", face=\"Verdana\", face=\"Arial\"). You can list comma-separated alternatives.",
          "• color: Sets text color by name or hex.",
          "• <basefont>: Sets default font size, face, and color for all text on the page."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <font face=\"Verdana\" size=\"4\" color=\"#04AA6D\">Verdana Green Text</font><br />\n  <font face=\"Courier New\" size=\"3\" color=\"#FF0000\">Courier New Red Text</font>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-forms",
    "chapterNumber": 21,
    "title": "21. HTML – Forms",
    "category": "Forms & User Input",
    "shortDesc": "Form attributes (action, method, enctype), Text Inputs, Password, Textarea, Checkbox, Radio, Select Dropdown, File Upload, Buttons, and Hidden controls.",
    "overview": [
      "HTML forms are required to collect data from site visitors (such as signups, login, feedback, file uploads).",
      "A form takes input from the visitor and posts it to a backend server script (PHP, CGI, Node.js, Python)."
    ],
    "sections": [
      {
        "title": "Form Syntax & Primary Attributes",
        "theory": [
          "Syntax: <form action=\"Script URL\" method=\"GET|POST\"> ... </form>",
          "• action: Backend script URL ready to process your submitted data.",
          "• method: GET (appends data into browser URL) or POST (sends data in request body, secure).",
          "• target: Target window where result script opens (_blank, _self).",
          "• enctype: \"multipart/form-data\" is mandatory when uploading files."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <form action=\"/login\" method=\"POST\">\n    First name: <input type=\"text\" name=\"first_name\" maxlength=\"50\" /><br /><br />\n    Last name: <input type=\"text\" name=\"last_name\" maxlength=\"50\" /><br /><br />\n    <input type=\"submit\" value=\"Submit\" />\n  </form>\n</body>\n</html>"
      },
      {
        "title": "Text Inputs, Passwords & Textareas",
        "theory": [
          "• Text input (<input type=\"text\">): Single line text input.",
          "• Password (<input type=\"password\">): Masks input characters as soon as typed.",
          "• Textarea (<textarea rows=\"5\" cols=\"40\">): Multi-line text area for comments and descriptions."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <form>\n    User ID: <input type=\"text\" name=\"user_id\" /><br /><br />\n    Password: <input type=\"password\" name=\"password\" /><br /><br />\n    Description:<br />\n    <textarea rows=\"4\" cols=\"30\" name=\"description\">Enter description here...</textarea>\n  </form>\n</body>\n</html>"
      },
      {
        "title": "Checkboxes, Radio Buttons, Select Menus & Files",
        "theory": [
          "• Checkbox (<input type=\"checkbox\">): Multiple choices allowed.",
          "• Radio Button (<input type=\"radio\">): Single choice only out of a group.",
          "• Dropdown Select (<select> with <option>): Space-efficient dropdown list.",
          "• File Upload (<input type=\"file\" accept=\"image/*\">): Lets user upload files.",
          "• Hidden Control (<input type=\"hidden\">): Stores hidden data passed to server."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <form action=\"/survey\" method=\"POST\" enctype=\"multipart/form-data\">\n    <p>Subjects: \n      <input type=\"checkbox\" name=\"sub\" value=\"maths\"> Maths\n      <input type=\"checkbox\" name=\"sub\" value=\"physics\"> Physics\n    </p>\n    <p>Select Gender:\n      <input type=\"radio\" name=\"gender\" value=\"m\"> Male\n      <input type=\"radio\" name=\"gender\" value=\"f\"> Female\n    </p>\n    <p>Choose Subject:\n      <select name=\"dropdown\">\n        <option value=\"Java\" selected>Java</option>\n        <option value=\"Python\">Python</option>\n      </select>\n    </p>\n    <p>Upload File: <input type=\"file\" name=\"doc\" /></p>\n    <input type=\"hidden\" name=\"pagename\" value=\"10\" />\n    <input type=\"submit\" value=\"Submit Form\" />\n    <input type=\"reset\" value=\"Reset\" />\n  </form>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-multimedia",
    "chapterNumber": 22,
    "title": "22. HTML – Embed Multimedia",
    "category": "Media & Assets",
    "shortDesc": "<embed> tag attributes (align, autostart, loop, hidden), supported video types, <noembed>, background audio (<bgsound>), and <object> with <param>.",
    "overview": [
      "Adding video and sound to your web pages using <embed>, <bgsound>, and <object> tags.",
      "<object> offers a generic standardized container for embedding documents, multimedia, applets, and audio."
    ],
    "sections": [
      {
        "title": "The <embed> Tag & <noembed>",
        "theory": [
          "Syntax: <embed src=\"file.mid\" width=\"100%\" height=\"60\"><noembed><img src=\"alt.gif\"></noembed></embed>",
          "<noembed> tag supplies fallback content for browsers that do not support <embed>."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Embedded Media Example</h3>\n  <embed src=\"https://www.w3schools.com/html/horse.mp3\" width=\"300\" height=\"60\">\n    <noembed><p>Audio not supported by your browser.</p></noembed>\n  </embed>\n</body>\n</html>"
      },
      {
        "title": "The <object> Tag with <param>",
        "theory": [
          "HTML 4 introduced the <object> element which offers an all-purpose solution to generic object inclusion.",
          "You can embed HTML files, PDF documents, or audio files using <param name=\"...\" value=\"...\"> to pass parameters."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Embed PDF via Object</h3>\n  <object data=\"sample.pdf\" type=\"application/pdf\" width=\"100%\" height=\"200\">\n    alt: <a href=\"sample.pdf\">sample.pdf</a>\n  </object>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-marquees",
    "chapterNumber": 23,
    "title": "23. HTML – Marquees",
    "category": "Interactive Effects",
    "shortDesc": "<marquee> tag attributes: width, height, direction (up, down, left, right), behavior (scroll, slide, alternate), scrollamount, scrolldelay, and loop.",
    "overview": [
      "An HTML marquee is a scrolling piece of text or graphics displayed horizontally or vertically across your webpage.",
      "Configured with direction, speed, and behavior."
    ],
    "sections": [
      {
        "title": "Marquee Attributes & Directions",
        "theory": [
          "• direction: up, down, left, right.",
          "• behavior: scroll (continuous loop), slide (slides and stops), alternate (bounces back and forth).",
          "• scrollamount: specifies the speed of marquee text jump in pixels."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>1. Basic Marquee:</h3>\n  <marquee>This is basic example of marquee scrolling left</marquee>\n\n  <h3>2. Right Direction with Alternate Bounce:</h3>\n  <marquee direction=\"right\" behavior=\"alternate\" bgcolor=\"#D9EEE1\" style=\"padding: 10px; color: #04AA6D; font-weight: bold;\">\n    This text bounces back and forth!\n  </marquee>\n\n  <h3>3. Upward Scrolling:</h3>\n  <marquee direction=\"up\" height=\"60\" style=\"background:#f1f5f9; text-align:center;\">\n    Line 1<br />Line 2<br />Line 3\n  </marquee>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-header",
    "chapterNumber": 24,
    "title": "24. HTML – Header",
    "category": "Document Head",
    "shortDesc": "The <head> container: <title>, <meta>, <base>, <link>, <style>, <script>, and <noscript>.",
    "overview": [
      "The <head> tag is a container of various important tags like <title>, <meta>, <link>, <base>, <style>, <script>, and <noscript> tags.",
      "Tags included inside head are not directly rendered in the viewport window."
    ],
    "sections": [
      {
        "title": "Head Section Components",
        "theory": [
          "• <title>: Specifies the title of the document visible in browser tab.",
          "• <meta>: Provides metadata (keywords, author, charset).",
          "• <base>: Specifies base URL for all relative URLs in the page.",
          "• <link>: Links external resources such as stylesheets.",
          "• <style>: Encloses internal CSS style rules.",
          "• <script>: Encloses internal or external JavaScript."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <title>Complete HTML Header</title>\n  <meta charset=\"UTF-8\">\n  <meta name=\"author\" content=\"Tutorials Point\">\n  <base href=\"https://example.com/\">\n  <style type=\"text/css\">\n    .myclass { background-color: #04AA6D; color: white; padding: 10px; border-radius: 6px; }\n  </style>\n  <script type=\"text/javascript\">\n    function showMsg() { alert(\"Hello from Head Script!\"); }\n  </script>\n</head>\n<body>\n  <div class=\"myclass\">Styled via Head &lt;style&gt; tag.</div>\n  <button onclick=\"showMsg()\" style=\"margin-top: 10px;\">Click Me</button>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-stylesheets",
    "chapterNumber": 25,
    "title": "25. HTML – Style Sheet",
    "category": "Styling",
    "shortDesc": "Cascading Style Sheets (CSS): External Style Sheet (.css file with <link>), Internal Style Sheet (<style>), and Inline Style Sheet (style=\"...\").",
    "overview": [
      "Cascading Style Sheets (CSS) describe how documents are presented on screens or in print.",
      "CSS can be added to HTML in three ways: External, Internal, and Inline."
    ],
    "sections": [
      {
        "title": "The Three Ways to Apply CSS",
        "theory": [
          "1. External Style Sheet: Define style rules in a separate .css file and link it via <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">.",
          "2. Internal Style Sheet: Define style rules in the header section using <style type=\"text/css\">.",
          "3. Inline Style Sheet: Define styles directly on specific elements using the style=\"...\" attribute.",
          "Priority Order: Inline styles override Internal styles, which override External styles."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <title>HTML CSS Integration</title>\n  <!-- Internal Style Sheet -->\n  <style type=\"text/css\">\n    .red { color: red; }\n    .thick { font-size: 20px; font-weight: bold; }\n    .green { color: #04AA6D; }\n  </style>\n</head>\n<body>\n  <!-- Classes from internal sheet -->\n  <p class=\"red\">This is red text</p>\n  <p class=\"thick green\">This is thick and green text</p>\n  \n  <!-- Inline style overrides -->\n  <p style=\"color: blue; font-size: 24px;\">This is blue and styled inline!</p>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-javascript",
    "chapterNumber": 26,
    "title": "26. HTML – JavaScript",
    "category": "Scripting",
    "shortDesc": "External JavaScript (.js), Internal Script, Event Handlers (onclick, onmouseover), hiding scripts from older browsers, and <noscript>.",
    "overview": [
      "A script is a small piece of code that adds dynamic interactivity to your website (e.g. alerts, dropdowns, form validation).",
      "JavaScript can be embedded directly or imported from external .js files."
    ],
    "sections": [
      {
        "title": "Script Integration & Event Handlers",
        "theory": [
          "• External Script: <script src=\"script.js\" type=\"text/javascript\"></script>",
          "• Internal Script: Placed directly in <head> or <body> between <script> tags.",
          "• Event Handlers: Functions called against mouse or keyboard actions (e.g. onclick, onmouseover).",
          "• <noscript>: Displays fallback message to visitors who have disabled JavaScript."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <script type=\"text/javascript\">\n    function eventHandler() {\n      alert(\"I am an event handler triggered by mouseover!\");\n    }\n  </script>\n</head>\n<body>\n  <p onmouseover=\"eventHandler();\" style=\"background:#e2e8f0; padding:10px; cursor:pointer;\">\n    Hover your mouse here to trigger alert!\n  </p>\n  <noscript><p>Your browser does not support JavaScript!</p></noscript>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-layouts",
    "chapterNumber": 27,
    "title": "27. HTML – Layouts",
    "category": "Layout & Grouping",
    "shortDesc": "HTML layouts using Tables (headers, columns, footers with colspan) vs Modern layouts using DIV and SPAN with CSS.",
    "overview": [
      "A webpage layout is very important to give a good look and feel to your website.",
      "This chapter compares historical table layouts against modern DIV and SPAN layouts."
    ],
    "sections": [
      {
        "title": "Layout Using Tables vs DIV/SPAN",
        "theory": [
          "• Table Layouts: Uses <table> with 3 rows and 2 columns where header and footer span both columns via colspan=\"2\". Tables were popular in early web design but are inflexible on mobile devices.",
          "• DIV/SPAN Layouts: Uses <div> containers styled with CSS float or flexbox, providing responsive, clean semantic separation."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <!-- Modern DIV Layout -->\n  <div style=\"width: 100%; border: 1px solid #ccc;\">\n    <div style=\"background-color: #04AA6D; color: white; padding: 15px;\">\n      <h2 style=\"margin:0;\">Web Page Main Title</h2>\n    </div>\n    <div style=\"display: flex;\">\n      <div style=\"background-color: #f1f5f9; width: 120px; padding: 10px;\">\n        <b>Main Menu</b><br />\n        HTML<br />CSS<br />JS\n      </div>\n      <div style=\"background-color: #ffffff; flex: 1; padding: 15px;\">\n        <h3>Technical Articles</h3>\n        <p>Main content area rendered with responsive DIV containers.</p>\n      </div>\n    </div>\n    <div style=\"background-color: #1e293b; color: white; text-align: center; padding: 10px;\">\n      Copyright &copy; 2026 Tutorial Website\n    </div>\n  </div>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-tag-reference",
    "chapterNumber": 28,
    "title": "28. HTML – Tag Reference",
    "category": "HTML Reference",
    "shortDesc": "Complete alphabetical dictionary of HTML and HTML5 tags from <!doctype> to <xmp> with descriptions and browser compatibility.",
    "overview": [
      "Complete dictionary of all tags introduced in older versions of HTML and new semantic elements introduced in modern HTML5."
    ],
    "sections": [
      {
        "title": "A-Z HTML & HTML5 Tag Dictionary",
        "theory": [
          "HTML5 introduced powerful semantic elements to replace generic divs:",
          "• <article>: Self-contained blog post or article.",
          "• <aside>: Sidebar or loosely related content.",
          "• <audio> & <video>: Native media playback without Flash plugins.",
          "• <canvas>: Scriptable graphics drawing canvas.",
          "• <details> & <summary>: Native expandable accordion widget.",
          "• <dialog>: Native modal dialog box.",
          "• <figure> & <figcaption>: Self-contained illustration with caption."
        ],
        "table": [
          {
            "attribute": "<article>",
            "value": "HTML5",
            "description": "Specifies self-contained composition (blog/forum post)"
          },
          {
            "attribute": "<aside>",
            "value": "HTML5",
            "description": "Specifies content aside from main page content"
          },
          {
            "attribute": "<audio>",
            "value": "HTML5",
            "description": "Specifies audio/sound content natively"
          },
          {
            "attribute": "<canvas>",
            "value": "HTML5",
            "description": "Container for script-drawn graphics"
          },
          {
            "attribute": "<dialog>",
            "value": "HTML5",
            "description": "Specifies a modal dialog box or popup window"
          },
          {
            "attribute": "<nav>",
            "value": "HTML5",
            "description": "Specifies a section containing only navigation links"
          },
          {
            "attribute": "<progress>",
            "value": "HTML5",
            "description": "Specifies completion progress bar of a task"
          },
          {
            "attribute": "<time>",
            "value": "HTML5",
            "description": "Specifies human and machine-readable date/time"
          }
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <article style=\"border: 1px solid #ccc; padding: 15px; border-radius: 6px;\">\n    <h2>HTML5 Semantic Elements</h2>\n    <p>Using native HTML5 progress bar:</p>\n    <progress value=\"60\" max=\"100\"></progress>\n    <details style=\"margin-top: 15px;\">\n      <summary>Click to reveal secret note</summary>\n      <p>HTML5 makes writing web pages much cleaner and semantic!</p>\n    </details>\n  </article>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-attribute-reference",
    "chapterNumber": 29,
    "title": "29. HTML – Attribute Reference",
    "category": "HTML Reference",
    "shortDesc": "Global Attributes (accesskey, class, contenteditable, draggable, hidden, id, spellcheck, style, tabindex) and Language attributes.",
    "overview": [
      "Global attributes are attributes common to all HTML elements and can be used on all of them."
    ],
    "sections": [
      {
        "title": "Global Attributes Directory",
        "theory": [
          "Global attributes can be attached to virtually any tag to add keyboard shortcuts, editable regions, or custom data hooks."
        ],
        "table": [
          {
            "attribute": "accesskey",
            "value": "character",
            "description": "Specifies a shortcut key to activate/focus the element"
          },
          {
            "attribute": "class",
            "value": "class name",
            "description": "The CSS class of the element"
          },
          {
            "attribute": "contenteditable",
            "value": "true | false",
            "description": "Specifies whether content is directly editable by visitor"
          },
          {
            "attribute": "data-*",
            "value": "custom data",
            "description": "Used to store custom private data attributes"
          },
          {
            "attribute": "draggable",
            "value": "true | false",
            "description": "Specifies whether the element can be dragged"
          },
          {
            "attribute": "hidden",
            "value": "hidden",
            "description": "Hides the element from the display"
          },
          {
            "attribute": "id",
            "value": "unique string",
            "description": "A unique id for the element on the page"
          },
          {
            "attribute": "spellcheck",
            "value": "true | false",
            "description": "Enables browser spellcheck on text"
          },
          {
            "attribute": "tabindex",
            "value": "number",
            "description": "Specifies the tabbing keyboard order of an element"
          }
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Interactive contenteditable:</h3>\n  <div contenteditable=\"true\" spellcheck=\"true\" style=\"padding: 12px; border: 2px dashed #04AA6D; border-radius: 6px;\">\n    Click anywhere inside this box to edit this text directly in your browser!\n  </div>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-events-reference",
    "chapterNumber": 30,
    "title": "30. HTML – Events Reference",
    "category": "HTML Reference",
    "shortDesc": "Window events, Form events (onblur, onchange, onfocus, oninput), Keyboard events (onkeydown, onkeyup), and Mouse events (onclick, onmouseover).",
    "overview": [
      "When users visit your website, actions like clicking links, hovering mouse over text, or typing in forms trigger Events.",
      "Event handlers connect HTML attributes directly to JavaScript functions."
    ],
    "sections": [
      {
        "title": "Window, Form & Mouse Events",
        "theory": [
          "• Window Events: onload, onunload, onresize, onoffline, ononline.",
          "• Form Events: oninput (live typing), onchange, onsubmit, onfocus, onblur, onreset.",
          "• Mouse Events: onclick, ondblclick, onmouseover, onmouseout, onmousedown, onmouseup."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Interactive Event Handlers</h3>\n  <input \n    type=\"text\" \n    placeholder=\"Type something...\" \n    oninput=\"document.getElementById('res').innerText = this.value\"\n    style=\"padding: 8px; width: 260px;\"\n  />\n  <p>Live Typing Output: <b id=\"res\" style=\"color: #04AA6D;\"></b></p>\n  <button onclick=\"alert('Button clicked!')\">Click Event</button>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-fonts-reference",
    "chapterNumber": 31,
    "title": "31. HTML – Fonts Reference",
    "category": "HTML Reference",
    "shortDesc": "Cross-platform font stacks for Microsoft Windows, Macintosh Apple systems, and Unix/Linux workstations.",
    "overview": [
      "Fonts are platform specific. Different computers running Windows, Mac OS, or Linux display different default typography.",
      "Using CSS font stacks ensures that if a user lacks a specific font, the browser smoothly falls back to a supported typeface."
    ],
    "sections": [
      {
        "title": "Platform Fonts & Fallback Stacks",
        "theory": [
          "• Windows Fonts: Arial, Comic Sans MS, Courier New, Georgia, Impact, Lucida Console, Tahoma, Times New Roman, Trebuchet MS, Verdana.",
          "• Macintosh Fonts: Apple Chancery, Baskerville, Courier New, Gill Sans, Helvetica, Monaco, Palatino, Times.",
          "• Recommended Stack: Specify specific font first, common alternative second, and generic family last (e.g. font-family: \"Segoe UI\", Arial, sans-serif;)."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p style=\"font-family: 'Segoe UI', Arial, sans-serif;\">\n    Sans-serif stack: Segoe UI, Arial, sans-serif\n  </p>\n  <p style=\"font-family: Georgia, 'Times New Roman', serif;\">\n    Serif stack: Georgia, Times New Roman, serif\n  </p>\n  <p style=\"font-family: 'Courier New', Courier, monospace;\">\n    Monospace stack: Courier New, monospace\n  </p>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-ascii-codes",
    "chapterNumber": 32,
    "title": "32. HTML – ASCII Table Lookup",
    "category": "Encoding & Tables",
    "shortDesc": "7-Bit ASCII Codes (0 to 127) and Extended ASCII Codes (128 to 255) with decimal, hex, binary, and HTML entity codes.",
    "overview": [
      "ASCII stands for American Standard Code for Information Interchange. There are 128 standard ASCII codes (0000000 to 1111111) and 128 Extended ASCII characters."
    ],
    "sections": [
      {
        "title": "ASCII Entity Codes in HTML",
        "theory": [
          "In HTML, characters can be represented using entity numbers: &#decimal; or &#xHex;.",
          "Examples:",
          "• &#32; : Space",
          "• &#38; : Ampersand (&)",
          "• &#60; : Less than (<)",
          "• &#62; : Greater than (>)",
          "• &#169; : Copyright symbol (©)",
          "• &#8364; : Euro symbol (€)"
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <h3>Rendered ASCII Entities:</h3>\n  <p>&#38; represents &amp;</p>\n  <p>&#60; represents &lt;</p>\n  <p>&#62; represents &gt;</p>\n  <p>&#169; represents &copy;</p>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-color-names",
    "chapterNumber": 33,
    "title": "33. HTML – Color Names",
    "category": "Styling",
    "shortDesc": "Full lookup table of standard W3C 16 colors and 140+ CSS named colors with hexadecimal values.",
    "overview": [
      "A complete reference of color names supported across all modern web browsers along with their corresponding hex values."
    ],
    "sections": [
      {
        "title": "Standard Color Names & Hex Codes",
        "theory": [
          "Aqua (#00FFFF), Black (#000000), Blue (#0000FF), Fuchsia (#FF00FF), Gray (#808080), Green (#008000), Lime (#00FF00), Maroon (#800000), Navy (#000080), Olive (#808000), Purple (#800080), Red (#FF0000), Silver (#C0C0C0), Teal (#008080), White (#FFFFFF), Yellow (#FFFF00)."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <div style=\"display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center; color: white;\">\n    <div style=\"background: red; padding: 15px;\">Red (#FF0000)</div>\n    <div style=\"background: green; padding: 15px;\">Green (#008000)</div>\n    <div style=\"background: blue; padding: 15px;\">Blue (#0000FF)</div>\n    <div style=\"background: teal; padding: 15px;\">Teal (#008080)</div>\n  </div>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-mime-types",
    "chapterNumber": 34,
    "title": "34. HTML – MIME Media Types",
    "category": "Web Standards",
    "shortDesc": "MIME types (Multipurpose Internet Mail Extensions): Main type and sub-type (text/html, image/png, audio/mpeg, video/mp4).",
    "overview": [
      "MIME types tell web browsers what type of content is being delivered so they can render it properly."
    ],
    "sections": [
      {
        "title": "Common Web MIME Types",
        "theory": [
          "MIME content types consist of two parts separated by a forward slash: type/subtype.",
          "• text/html: Standard HTML web documents.",
          "• text/css: Cascading Style Sheets.",
          "• text/javascript: JavaScript programming files.",
          "• image/png, image/jpeg, image/gif, image/webp: Web image graphics.",
          "• audio/mpeg: MP3 audio.",
          "• video/mp4: MP4 video files."
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n</head>\n<body>\n  <video controls width=\"320\">\n    <source src=\"movie.mp4\" type=\"video/mp4\">\n  </video>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-url-encoding",
    "chapterNumber": 35,
    "title": "35. HTML – URL Encoding",
    "category": "Web Standards",
    "shortDesc": "Practice of translating unprintable characters into percent-encoding (%20 for space, %24 for $, %26 for &).",
    "overview": [
      "URLs can only be sent over the Internet using the ASCII character set. Unsafe characters or spaces must be converted into %HEX format."
    ],
    "sections": [
      {
        "title": "URL Percent-Encoding Rules",
        "theory": [
          "A percent sign followed by two hexadecimal digits replaces the unsafe character:",
          "• Space &rarr; %20",
          "• & (ampersand) &rarr; %26",
          "• ? (question mark) &rarr; %3F",
          "• = (equals) &rarr; %3D",
          "• + (plus) &rarr; %2B"
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<body>\n  <p>URL with encoded spaces and queries:</p>\n  <a href=\"https://example.com/search?keyword=HTML5%20Tutorial%20%26%20Guide\">\n    Search for \"HTML5 Tutorial &amp; Guide\"\n  </a>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-language-codes",
    "chapterNumber": 36,
    "title": "36. HTML – Language ISO Codes",
    "category": "Web Standards",
    "shortDesc": "ISO 639 standard two-letter codes (en, hi, fr, es, de, zh, ja, ar, ru) for lang attribute.",
    "overview": [
      "The lang attribute indicates the primary human language of an HTML page, essential for search engine indexing and accessibility screen readers."
    ],
    "sections": [
      {
        "title": "ISO 639-1 Language Codes",
        "theory": [
          "Common two-letter codes:",
          "• en: English | hi: Hindi | es: Spanish | fr: French",
          "• de: German | zh: Chinese | ja: Japanese | ar: Arabic | ru: Russian"
        ],
        "codeExample": "<!DOCTYPE html>\n<html lang=\"en\">\n<body>\n  <p lang=\"en\">English language paragraph.</p>\n  <p lang=\"hi\">नमस्ते, यह हिंदी में लिखा गया पैराग्राफ है।</p>\n  <p lang=\"fr\">Paragraphe en français.</p>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-character-encodings",
    "chapterNumber": 37,
    "title": "37. HTML – Character Encodings",
    "category": "Web Standards",
    "shortDesc": "ASCII, ISO-8859-1 (Latin-1), UTF-8 (8-bit universal), UTF-16, and UTF-32 unicode encodings.",
    "overview": [
      "Character encoding is a method of converting bytes into characters so web browsers display text and symbols accurately."
    ],
    "sections": [
      {
        "title": "UTF-8 & Unicode Standard",
        "theory": [
          "• ASCII: Limited to 128 English characters (numbers, English letters, basic symbols).",
          "• ISO-8859-1 (Latin-1): Covers Western European languages.",
          "• UTF-8: Universal character encoding that covers every written human language, mathematical symbols, and emoji in 1 to 4 bytes."
        ],
        "codeExample": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>UTF-8 Unicode</title>\n</head>\n<body>\n  <p>Mathematical: &radic;16 = 4, &pi; &asymp; 3.14159, &infin;</p>\n  <p>Emojis: 🚀 💻 🌐 ✨</p>\n</body>\n</html>"
      }
    ]
  },
  {
    "id": "html-deprecated-tags",
    "chapterNumber": 38,
    "title": "38. HTML – Deprecated Tags",
    "category": "HTML Reference",
    "shortDesc": "List of obsolete HTML tags (<applet>, <basefont>, <center>, <dir>, <font>, <marquee>, <strike>, <u>) and their modern CSS replacements.",
    "overview": [
      "A complete list of deprecated HTML tags and attributes along with their modern CSS replacements."
    ],
    "sections": [
      {
        "title": "Deprecated Tags vs. Modern CSS Alternates",
        "theory": [
          "Tags removed in HTML5 and their modern replacements:",
          "• <center> &rarr; CSS text-align: center",
          "• <font> &rarr; CSS font-family, font-size, color",
          "• <strike> &rarr; <del> or CSS text-decoration: line-through",
          "• <u> &rarr; CSS text-decoration: underline",
          "• <marquee> &rarr; CSS @keyframes animation",
          "• <applet> & <embed> &rarr; <object> or native <video>/<audio>"
        ],
        "table": [
          {
            "attribute": "<center>",
            "value": "Deprecated",
            "description": "Replace with CSS: text-align: center;"
          },
          {
            "attribute": "<font>",
            "value": "Deprecated",
            "description": "Replace with CSS: font-family, font-size, color;"
          },
          {
            "attribute": "<strike>",
            "value": "Deprecated",
            "description": "Replace with <del> or CSS text-decoration: line-through;"
          },
          {
            "attribute": "<u>",
            "value": "Deprecated",
            "description": "Replace with CSS text-decoration: underline;"
          },
          {
            "attribute": "<applet>",
            "value": "Deprecated",
            "description": "Replace with <object>"
          }
        ],
        "codeExample": "<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    /* Modern CSS Replacements for Obsolete HTML Tags */\n    .centered-box { text-align: center; }\n    .strike-text { text-decoration: line-through; }\n    .custom-typography { font-family: Arial, sans-serif; color: #04AA6D; font-size: 20px; }\n  </style>\n</head>\n<body>\n  <div class=\"centered-box\">\n    <p class=\"custom-typography\">Modern CSS replacement for &lt;center&gt; and &lt;font&gt;</p>\n    <p class=\"strike-text\">Modern CSS replacement for &lt;strike&gt;</p>\n  </div>\n</body>\n</html>"
      }
    ]
  }
];


export const ALL_RICH_HTML_TOPICS: W3TopicItem[] = [
  {
    "id": "sec-basics",
    "name": "HTML5 Fundamentals",
    "isHeader": true,
    "chapterRefId": "html-overview"
  },
  {
    "id": "html-home",
    "name": "1. HTML Overview & History",
    "chapterRefId": "html-overview",
    "hasArrow": true
  },
  {
    "id": "html-basic",
    "name": "2. HTML Basic Tags & Skeleton",
    "chapterRefId": "html-basic-tags",
    "hasArrow": true
  },
  {
    "id": "html-elements",
    "name": "3. HTML Elements & Void Tags",
    "chapterRefId": "html-elements",
    "hasArrow": true
  },
  {
    "id": "html-attributes",
    "name": "4. HTML Global Attributes",
    "chapterRefId": "html-attributes",
    "hasArrow": true
  },
  {
    "id": "html-formatting",
    "name": "5. HTML Formatting & Phrase",
    "chapterRefId": "html-formatting",
    "hasArrow": true
  },
  {
    "id": "html-meta-tags",
    "name": "6. HTML Meta Tags & SEO",
    "chapterRefId": "html-meta-tags",
    "hasArrow": true
  },
  {
    "id": "sec-media",
    "name": "Graphics & Media",
    "isHeader": true,
    "chapterRefId": "html-images"
  },
  {
    "id": "html-images",
    "name": "7. HTML Images & Responsive",
    "chapterRefId": "html-images",
    "hasArrow": true
  },
  {
    "id": "html-image-maps-topic",
    "name": "8. HTML Image Maps (<map>)",
    "chapterRefId": "html-image-maps",
    "hasArrow": true
  },
  {
    "id": "html-multimedia",
    "name": "9. HTML Audio & Video",
    "chapterRefId": "html-multimedia",
    "hasArrow": true
  },
  {
    "id": "html-iframes",
    "name": "10. HTML Iframes & Embedding",
    "chapterRefId": "html-iframes",
    "hasArrow": true
  },
  {
    "id": "sec-tables-lists",
    "name": "Tables & Lists",
    "isHeader": true,
    "chapterRefId": "html-tables"
  },
  {
    "id": "html-tables",
    "name": "11. HTML Tables & Colspan",
    "chapterRefId": "html-tables",
    "hasArrow": true
  },
  {
    "id": "html-lists",
    "name": "12. HTML Lists (ol, ul, dl)",
    "chapterRefId": "html-lists",
    "hasArrow": true
  },
  {
    "id": "sec-links",
    "name": "Links & Navigation",
    "isHeader": true,
    "chapterRefId": "html-text-links"
  },
  {
    "id": "html-links",
    "name": "13. HTML Text Links & Targets",
    "chapterRefId": "html-text-links",
    "hasArrow": true
  },
  {
    "id": "html-image-links",
    "name": "14. HTML Image Links",
    "chapterRefId": "html-image-links",
    "hasArrow": true
  },
  {
    "id": "sec-forms",
    "name": "Forms & User Input",
    "isHeader": true,
    "chapterRefId": "html-forms"
  },
  {
    "id": "html-forms",
    "name": "15. HTML Forms & Controls",
    "chapterRefId": "html-forms",
    "hasArrow": true
  },
  {
    "id": "sec-layout",
    "name": "Layouts & Semantics",
    "isHeader": true,
    "chapterRefId": "html-blocks"
  },
  {
    "id": "html-blocks",
    "name": "16. HTML Block & Inline Elements",
    "chapterRefId": "html-blocks",
    "hasArrow": true
  },
  {
    "id": "html-layouts",
    "name": "17. HTML Semantic Layouts",
    "chapterRefId": "html-layouts",
    "hasArrow": true
  },
  {
    "id": "sec-ref",
    "name": "Reference & Standards",
    "isHeader": true,
    "chapterRefId": "html-tag-reference"
  },
  {
    "id": "html-tag-reference",
    "name": "18. HTML Tag Reference",
    "chapterRefId": "html-tag-reference",
    "hasArrow": true
  },
  {
    "id": "html-attribute-reference",
    "name": "19. HTML Attribute Reference",
    "chapterRefId": "html-attribute-reference",
    "hasArrow": true
  },
  {
    "id": "html-events-reference",
    "name": "20. HTML Events Reference",
    "chapterRefId": "html-events-reference",
    "hasArrow": true
  },
  {
    "id": "html-ascii-codes",
    "name": "21. HTML ASCII & Character Codes",
    "chapterRefId": "html-ascii-codes",
    "hasArrow": true
  }
];
