export const devTools = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    slug: '/developer-tools/json-formatter',
    categoryId: 'developer-tools',
    shortDesc: 'Format, beautify, minify, and validate JSON data with syntax error detection.',
    fullDesc: 'Client-side JSON beautifier and validator with collapsible tree view, syntax linting, and line indicators.',
    icon: '{ }',
    badge: 'POPULAR',
    isPopular: true,
    isLatest: false,
    isAI: false,
    seoTitle: 'Format JSON Online Free - Beautify & Lint | ConverterAllAI',
    seoDescription: 'Clean, beautify, minify, and validate JSON data online for free. Real-time syntax error line detection and collapsible tree view with zero server uploads.',
    keywords: 'json formatter, beautify json, validate json online, json minifier, format json free, json tree viewer',
    h1: 'JSON Formatter, Validator & Collapsible Tree Viewer',
    intro: 'Debug and clean raw JSON payloads instantly in your browser. Beautify messy API responses with customizable tab indentation, minify production code, and locate syntax errors with exact line and column indicators.',
    howToSteps: [
      'Paste your raw JSON string or API response into the editor window.',
      'Click Beautify to apply clean indentation (2 spaces or 4 spaces).',
      'Inspect any highlighted syntax errors or missing commas.',
      'Copy the cleaned JSON to clipboard or switch to the interactive tree view.'
    ],
    features: [
      'Instant JSON syntax validation with precise line and character error markers',
      'Configurable indentation spacing: 2 spaces, 4 spaces, or compact minify mode',
      'Collapsible interactive tree inspector for deeply nested objects and arrays',
      '100% private in-browser parsing ensuring confidential API payloads stay safe'
    ],
    faqs: [
      { q: 'Can this tool fix trailing commas and unquoted keys in JSON?', a: 'The syntax linter highlights exact positions of trailing commas and missing quotes, helping you fix syntax errors quickly.' },
      { q: 'Is there a payload size limit for formatting JSON?', a: 'Because parsing runs client-side in V8 JavaScript, large payloads up to 25MB format smoothly without browser freezing.' },
      { q: 'What is the advantage of the tree view inspector?', a: 'The tree view lets you expand and collapse specific nested nodes, making complex API responses easy to explore.' },
      { q: 'Are my private API keys or database tokens logged on any server?', a: 'Never. All JSON parsing and formatting executes 100% locally inside your web browser.' }
    ],
    relatedToolPaths: ['/developer-tools/sql', '/typing-master', '/pdf-processing/pdf-to-text'],
    privacyNote: 'Payloads are parsed locally in your browser and never transmitted to any server.'
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
    id: 'typing-master',
    name: 'Typing Master Pro',
    slug: '/typing-master',
    categoryId: 'developer-tools',
    shortDesc: 'Test and train your typing speed (WPM) and accuracy with interactive drills.',
    fullDesc: 'Interactive touch-typing speed trainer and WPM test with real-time error tracking and speed metrics.',
    icon: '⌨️',
    badge: 'POPULAR',
    isPopular: true,
    isLatest: false,
    isAI: false,
    seoTitle: 'Test Typing Speed Online Free - WPM Test | ConverterAllAI',
    seoDescription: 'Test and improve typing speed and accuracy online for free. Real-time words-per-minute (WPM) calculations, error diagnostics, and speed drills with no signup.',
    keywords: 'typing master, typing test online free, wpm speed test, touch typing tutor, keyboard speed test',
    h1: 'Online Touch Typing Speed Test & WPM Trainer',
    intro: 'Measure and boost your keyboard typing speed and precision. Practice touch typing drills with live WPM (Words Per Minute) measurement, CPM accuracy percentages, and real-time error diagnostics.',
    howToSteps: [
      'Select a test duration (1 minute, 3 minutes, or 5 minutes) and text difficulty.',
      'Begin typing the highlighted words as accurately as possible.',
      'Watch your real-time WPM speed and accuracy graph update live.',
      'Review your comprehensive post-test report detailing error keys and net WPM.'
    ],
    features: [
      'Real-time calculation of Gross WPM, Net WPM, and accuracy percentage',
      'Live color-coded visual feedback highlighting correct and incorrect keystrokes',
      'Multiple practice modes ranging from standard prose to coding syntax drills',
      'Detailed diagnostic report identifying your most frequent mistake keys'
    ],
    faqs: [
      { q: 'How is Words Per Minute (WPM) calculated?', a: 'WPM is standardized as (Total Characters Typed / 5) divided by Elapsed Minutes, adjusted for uncorrected typographical errors.' },
      { q: 'What is considered a good typing speed for professionals?', a: 'The average typist writes around 40 WPM; competitive professionals and software engineers often type between 65 and 90 WPM.' },
      { q: 'Can daily practice with this tool improve touch typing?', a: 'Yes, practicing for 10-15 minutes daily builds muscle memory, allowing you to type swiftly without glancing at the physical keyboard.' },
      { q: 'Does this typing trainer require an account to track speed?', a: 'No, you can take tests and track speed metrics freely without signing up.' }
    ],
    relatedToolPaths: ['/developer-tools/sql', '/developer-tools/json-formatter', '/resume-builder', '/games/spelling-bee'],
    privacyNote: 'Typing keystrokes and metrics are calculated locally inside your browser.'
  }
];
