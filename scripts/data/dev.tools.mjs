export const devTools = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    slug: '/developer-tools/json-formatter',
    categoryId: 'developer-tools',
    shortDesc: 'Format, validate, minify, and repair JSON in your browser. Inspect nested data in a collapsible tree.',
    fullDesc: 'Format API responses and files, find syntax errors by line and column, and preserve large numbers and duplicate keys when formatting JSON.',
    icon: '{ }',
    badge: 'POPULAR',
    isPopular: true,
    isLatest: false,
    isAI: false,
    seoTitle: 'JSON Formatter & Validator Online | ConverterAllAI',
    seoDescription: 'Beautify, minify, and validate JSON online. Find errors by line and column, repair common syntax issues, and explore a collapsible JSON tree in your browser.',
    keywords: 'json formatter, json validator, beautify json, minify json, json repair, json tree viewer',
    h1: 'How to Format and Validate JSON Online',
    intro: 'Make an API response or JSON file easier to read by adding indentation. Use the tree viewer to inspect nested values, or minify valid JSON to remove extra whitespace before saving it.',
    howToSteps: [
      'Paste JSON, open a UTF-8 file, or fetch a public URL that allows cross-origin requests.',
      'Choose Format for indented JSON, Minify for compact output, or Validate to check syntax.',
      'If validation fails, use Go to error to find the issue. Choose Repair to review a possible correction.',
      'Switch to Tree to inspect nested values, then copy or download the output.'
    ],
    features: [
      'Line and column diagnostics with a shortcut to the error',
      'Formatting with two, three, or four spaces, tabs, or compact output',
      'Side-by-side editors with syntax highlighting and a collapsible JSON tree viewer',
      'Exact number text and duplicate keys preserved when formatting, minifying, or sorting',
      'Browser-based repair with a separate output for reviewing changes'
    ],
    faqs: [
      { q: 'Can I fix trailing commas or unquoted keys in JSON?', a: 'Choose Repair to generate a possible correction for common issues such as trailing commas, single quotes, and unquoted keys. Review the suggested output before using it.' },
      { q: 'Does formatting JSON change large numbers or duplicate keys?', a: 'Format, Minify, and Sort keys preserve the exact digits, exponent notation, and duplicate entries in valid JSON. The editor flags duplicate keys because applications can interpret them differently.' },
      { q: 'What is the maximum JSON file size?', a: 'The input limit is 2 MiB of UTF-8 text. The formatter also limits nesting to 100 levels and reports when a document exceeds its processing limits.' },
      { q: 'Why is my JSON URL import failing?', a: 'The browser can only read a public URL when the source allows cross-origin access through CORS. If the source blocks access, save the JSON as a file and open it locally.' },
      { q: 'Does the formatter upload my JSON?', a: 'Pasted text and local files are processed in your browser. URL import sends a request to the address you enter, and the response is formatted locally.' }
    ],
    relatedToolPaths: ['/developer-tools/sql', '/developer-tools/web-tutorials', '/pdf-processing/pdf-to-text'],
    privacyNote: 'Pasted JSON and local files stay in your browser. URL import contacts the source you enter.'
  },
  {
    id: 'sql-masterclass',
    name: 'SQL Masterclass Studio',
    slug: '/developer-tools/sql',
    categoryId: 'developer-tools',
    shortDesc: 'Complete 102-slide MySQL tutorial with live in-browser query execution engine.',
    fullDesc: 'Interactive SQL course covering RDBMS, DDL, DML, DQL, Joins, Constraints, and Subqueries with live engine.',
    icon: '💾',
    badge: 'HOT',
    isPopular: true,
    isLatest: true,
    isAI: false,
    seoTitle: 'Learn SQL Online Free - MySQL Masterclass | ConverterAllAI',
    seoDescription: 'Master relational SQL and MySQL online for free. Comprehensive 14-chapter course with live in-browser query execution sandbox, Venn joins, and zero signup.',
    keywords: 'learn sql online free, mysql tutorial, sql playground, interactive sql queries, sql joins tutorial, rdbms course',
    h1: 'Complete MySQL & RDBMS Masterclass with Live Query Engine',
    intro: 'Master relational database management systems and SQL from ground up. Explore all 14 course chapters covering DDL, DML, complex SELECT filtering, subqueries, and foreign keys with a live in-browser database sandbox.',
    howToSteps: [
      'Select a tutorial chapter from the sidebar (DDL, Joins, Group By, Subqueries).',
      'Read slide concepts and study practical schema examples.',
      'Launch the live SQL playground to write and test queries in real time.',
      'Inspect instant tabular result sets and query execution diagnostics.'
    ],
    features: [
      'Comprehensive 14-chapter curriculum covering 102 comprehensive slides',
      'Live in-browser SQL query execution engine with pre-seeded datasets',
      'Visual Venn diagram explanations for INNER, LEFT, RIGHT, and FULL joins',
      'Hands-on playground supporting custom CREATE, INSERT, and SELECT commands'
    ],
    faqs: [
      { q: 'Do I need to install MySQL or SQLite on my computer to practice?', a: 'No, our in-browser relational query engine runs completely client-side in your web browser with pre-loaded demo tables.' },
      { q: 'Which SQL dialects are covered in this tutorial?', a: 'The course focuses on standard ANSI SQL and MySQL syntax, which transfers directly to PostgreSQL, SQLite, and Oracle.' },
      { q: 'Can I write custom SQL queries on my own table schemas?', a: 'Yes, the interactive playground lets you CREATE custom tables, INSERT test records, and practice joins freely.' },
      { q: 'Is this SQL course completely free for students and developers?', a: 'Yes, all 14 chapters, diagrams, slides, and the interactive query engine are 100% free with no paywalls.' }
    ],
    relatedToolPaths: ['/developer-tools/json-formatter', '/typing-master', '/calculators/basic'],
    privacyNote: 'SQL queries execute in-memory on your local device.'
  },
  {
    id: 'resume-builder',
    name: 'AI Resume & CV Builder',
    slug: '/resume-builder',
    categoryId: 'resume-tools',
    shortDesc: 'Build professional, ATS-optimized resumes with 21 modern templates for free.',
    fullDesc: 'Design print-ready, ATS-friendly curriculum vitae with live preview, section reordering, and PDF export.',
    icon: '📝',
    badge: 'ALL-IN-1',
    isPopular: true,
    isLatest: false,
    isAI: true,
    seoTitle: 'Create Resume Online Free - ATS CV Maker | ConverterAllAI',
    seoDescription: 'Build professional ATS-friendly resumes and CVs online for free. Choose modern templates, preview live, and download high-resolution PDF with zero signup.',
    keywords: 'free resume builder, online cv maker, ats resume generator, create resume free, professional cv templates',
    h1: 'Professional ATS-Friendly Online Resume & CV Builder',
    intro: 'Land your dream job with an interview-winning resume. Choose from recruiter-approved ATS templates, input your work experience and education with helpful prompts, preview your layout in real time, and export clean PDFs for free.',
    howToSteps: [
      'Choose a clean, modern ATS-friendly resume template from the gallery.',
      'Fill in your contact information, work experience, education, and skills.',
      'Review your real-time formatted resume in the live preview panel.',
      'Click Download PDF to export your print-ready curriculum vitae.'
    ],
    features: [
      'Recruiter-approved ATS-friendly templates designed for automated parsing',
      'Live side-by-side interactive preview updating instantly as you type',
      'Customizable sections: Work Experience, Education, Skills, Projects, and Certifications',
      '100% free PDF download without watermarks, paywalls, or hidden charges'
    ],
    faqs: [
      { q: 'Are the resumes created here ATS (Applicant Tracking System) friendly?', a: 'Yes, our templates use clean single-column and clear dual-column structures with standard header tags that ATS robots parse accurately.' },
      { q: 'Can I download my resume as a PDF without paying anything?', a: 'Yes! Unlike many online builders, our resume export is 100% free with no watermarks and no credit card required.' },
      { q: 'Is my personal employment and contact data stored on your servers?', a: 'No, all resume data is stored locally in your browser storage (localStorage) so you retain complete privacy.' },
      { q: 'Can I return later and edit my saved resume?', a: 'Yes, your resume content is automatically remembered on your device so you can update skills and download new versions anytime.' }
    ],
    relatedToolPaths: ['/pdf-processing/merge-pdf', '/typing-master', '/developer-tools/json-formatter'],
    privacyNote: 'Your resume data is stored locally in your browser and never uploaded to any remote server.'
  },
  {
    "id": "typing-master",
    "name": "Touch Typing Lessons",
    "slug": "/typing-master",
    "categoryId": "developer-tools",
    "shortDesc": "Learn touch typing with guided finger placement, key drills, and progress saved in your browser.",
    "fullDesc": "A seven-module touch typing course covering the home row, new letter pairs, capitalization, and punctuation with keyboard and finger guides.",
    "icon": "⌨️",
    "badge": "POPULAR",
    "isPopular": true,
    "isLatest": false,
    "isAI": false,
    "seoTitle": "Free Touch Typing Lessons Online | ConverterAllAI",
    "seoDescription": "Learn touch typing with seven free modules. Practice the home row, finger placement, new keys, and punctuation, and save lesson progress in your browser.",
    "keywords": "touch typing lessons, learn to type, home row practice, typing tutor, keyboard finger placement",
    "h1": "Learn to Touch Type Step by Step",
    "intro": "Start with the home row, learn which fingers reach each key, and practice short passages. The course groups new keys into seven modules so you can focus on one skill at a time.",
    "howToSteps": [
      "Choose a module. Start with The Home Row if you are learning to type by touch.",
      "Open an activity and follow the on-screen finger placement or key prompts.",
      "Type the practice passage and review your WPM, accuracy, and mistakes.",
      "Return to the lesson list to see completed activities or take the separate timed typing test."
    ],
    "features": [
      "Seven modules from home-row basics through capitalization and punctuation",
      "Highlighted QWERTY keyboard and finger guides",
      "Key drills and practice passages with WPM and accuracy feedback",
      "Completed activities saved in your browser"
    ],
    "faqs": [
      {
        "q": "Which typing lesson should a beginner start with?",
        "a": "Open The Home Row in Module 1. It introduces the starting position and includes exercises for A, S, D, F, J, K, L, and semicolon."
      },
      {
        "q": "Can I practice touch typing on a phone?",
        "a": "The lessons accept a phone keyboard. Use a physical QWERTY keyboard to practice the finger placement and reach shown in the course."
      },
      {
        "q": "How is lesson progress saved?",
        "a": "The course saves completed activity IDs in this browser. You can return on the same device and browser to see your progress."
      },
      {
        "q": "How can I check my typing speed after practicing?",
        "a": "Open the Typing Speed Test from the course and choose the one-minute option. Repeat with the same settings to compare your WPM and accuracy over time."
      }
    ],
    "relatedToolPaths": [
      "/typing-speed-test",
      "/games/spelling-bee",
      "/developer-tools/web-tutorials"
    ],
    "privacyNote": "Exercises process text locally. The course stores completed activity IDs in your browser."
  },
  {
    "id": "typing-speed-test",
    "name": "Typing Speed Test (WPM)",
    "slug": "/typing-speed-test",
    "categoryId": "developer-tools",
    "shortDesc": "Measure typing speed and accuracy with a 1-minute test, word-count challenges, or your own passage.",
    "fullDesc": "Free browser-based WPM test with 15-second to 5-minute rounds, quote and custom text practice, accuracy results, and a downloadable PNG scorecard.",
    "icon": "⚡",
    "badge": "HOT",
    "isPopular": true,
    "isLatest": true,
    "isAI": false,
    "seoTitle": "1-Minute Typing Speed Test & WPM | ConverterAllAI",
    "seoDescription": "Take a free 1-minute typing speed test and check your WPM and accuracy. Choose timed rounds, word counts, quotes, or custom text and download a scorecard.",
    "keywords": "typing speed test, 1 minute typing test, free WPM test, words per minute, typing accuracy",
    "h1": "Measure WPM and Typing Accuracy",
    "intro": "Choose a 60-second typing test to measure your speed, or practice with a word count, a quote, or your own text. Use the result to see your net WPM and how accurately you typed.",
    "howToSteps": [
      "Choose a timed round from 15 seconds to 5 minutes, or select a word count, quote, or custom text.",
      "Focus the typing box and type the highlighted word. The clock starts with your first typed character.",
      "Press Space between words and use Backspace to correct mistakes.",
      "Review WPM, accuracy, and speed over time, then copy your result or download the PNG scorecard."
    ],
    "features": [
      "15-second, 30-second, 1-minute, 2-minute, and 5-minute timed tests",
      "Word-count challenges, quotes, custom passages, and untimed practice",
      "English and Hinglish words plus code snippets",
      "Net WPM, raw WPM, accuracy, and a downloadable PNG scorecard"
    ],
    "faqs": [
      {
        "q": "How do I take a one-minute typing test?",
        "a": "Select Time and 60 seconds, then type the first highlighted word. The test ends after a minute and shows your WPM and accuracy."
      },
      {
        "q": "How does the test calculate WPM?",
        "a": "Five characters count as one standard word. The test divides the number of correctly typed characters by five and by the elapsed minutes. Raw WPM also counts incorrect and extra characters in the typed text."
      },
      {
        "q": "Does Backspace remove a mistake from accuracy?",
        "a": "Accuracy includes your original typing attempts, so Backspace does not count as a new keystroke or erase an earlier mistake from your accuracy. A correction can still improve your net WPM."
      },
      {
        "q": "Can I use my own text or practice code?",
        "a": "Yes. Select Custom to load your passage, or choose Code from the language options to practice with code snippets."
      },
      {
        "q": "What does the PNG scorecard include?",
        "a": "The downloadable scorecard includes your session WPM, raw WPM, accuracy, consistency, and test mode."
      }
    ],
    "relatedToolPaths": [
      "/typing-master",
      "/games/spelling-bee",
      "/developer-tools/json-formatter"
    ],
    "privacyNote": "Typing and scoring run in your browser. Your personal best is saved on this device."
  }
];
