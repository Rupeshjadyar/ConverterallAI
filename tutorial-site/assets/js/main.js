/**
 * WebDev Academy - Master Architecture & Shell Coordinator
 * Injects unified Header, Sidebar, Table of Contents, and Footer across all pages.
 * 100% Offline Compatible (No fetch, pure JS template strings).
 */
(function(window) {
  'use strict';

  // Master Curriculum Registry
  const CURRICULUM = {
    'getting-started': {
      title: 'Getting Started',
      badgeColor: 'var(--accent-primary)',
      basePath: 'getting-started/',
      lessons: [
        { id: '01', slug: '01-how-the-web-works.html', title: '01. How the Web Works' },
        { id: '02', slug: '02-setup-editor-and-browser.html', title: '02. Setup Editor & Browser' },
        { id: '03', slug: '03-your-first-webpage.html', title: '03. Your First Webpage' },
        { id: '04', slug: '04-devtools-basics.html', title: '04. DevTools Basics' },
        { id: '05', slug: '05-developer-typing-test.html', title: '05. ⚡ Developer Typing Test' }
      ]
    },
    'html': {
      title: 'HTML5 Mastery',
      badgeColor: 'var(--c-html)',
      basePath: 'html/',
      lessons: [
        { id: '01', slug: '01-introduction-structure.html', title: '01. Intro & Document Structure' },
        { id: '02', slug: '02-elements-attributes.html', title: '02. Elements & Attributes' },
        { id: '03', slug: '03-headings-paragraphs-text-formatting.html', title: '03. Headings & Formatting' },
        { id: '04', slug: '04-links-and-navigation.html', title: '04. Links & Navigation' },
        { id: '05', slug: '05-images-and-figures.html', title: '05. Images & Figures' },
        { id: '06', slug: '06-lists.html', title: '06. Lists (ul, ol, dl)' },
        { id: '07', slug: '07-tables.html', title: '07. Tables & Data Grids' },
        { id: '08', slug: '08-forms-and-inputs.html', title: '08. Forms & Inputs' },
        { id: '09', slug: '09-form-validation.html', title: '09. Form Validation' },
        { id: '10', slug: '10-semantic-html.html', title: '10. Semantic HTML' },
        { id: '11', slug: '11-audio-video-iframe.html', title: '11. Audio, Video & Iframes' },
        { id: '12', slug: '12-meta-tags-seo.html', title: '12. Meta Tags & SEO' },
        { id: '13', slug: '13-accessibility-aria.html', title: '13. Accessibility & ARIA' },
        { id: '14', slug: '14-html-best-practices.html', title: '14. HTML Best Practices' }
      ]
    },
    'css': {
      title: 'Modern CSS3',
      badgeColor: 'var(--c-css)',
      basePath: 'css/',
      lessons: [
        { id: '01', slug: '01-introduction-and-syntax.html', title: '01. Intro & Syntax' },
        { id: '02', slug: '02-selectors-specificity.html', title: '02. Selectors & Specificity' },
        { id: '03', slug: '03-colors-units-backgrounds.html', title: '03. Colors, Units & Backgrounds' },
        { id: '04', slug: '04-fonts-and-text.html', title: '04. Fonts & Typography' },
        { id: '05', slug: '05-box-model.html', title: '05. The Box Model' },
        { id: '06', slug: '06-display-visibility-overflow.html', title: '06. Display & Overflow' },
        { id: '07', slug: '07-position-z-index.html', title: '07. Positioning & z-index' },
        { id: '08', slug: '08-flexbox.html', title: '08. Flexbox Layouts' },
        { id: '09', slug: '09-grid.html', title: '09. CSS Grid Layouts' },
        { id: '10', slug: '10-responsive-design-media-queries.html', title: '10. Responsive & Media Queries' },
        { id: '11', slug: '11-pseudo-classes-pseudo-elements.html', title: '11. Pseudo-Classes & Elements' },
        { id: '12', slug: '12-transitions-transforms.html', title: '12. Transitions & Transforms' },
        { id: '13', slug: '13-animations-keyframes.html', title: '13. Animations & Keyframes' },
        { id: '14', slug: '14-css-variables-calc-clamp.html', title: '14. Variables, Calc & Clamp' },
        { id: '15', slug: '15-modern-layout-patterns.html', title: '15. Modern Layout Patterns' },
        { id: '16', slug: '16-css-best-practices-organization.html', title: '16. Architecture & BEM' }
      ]
    },
    'javascript': {
      title: 'JavaScript Core & ES6+',
      badgeColor: 'var(--c-js)',
      basePath: 'javascript/',
      lessons: [
        { id: '01', slug: '01-introduction-console.html', title: '01. Intro & Console' },
        { id: '02', slug: '02-variables-data-types.html', title: '02. Variables & Data Types' },
        { id: '03', slug: '03-operators-type-conversion.html', title: '03. Operators & Coercion' },
        { id: '04', slug: '04-conditions.html', title: '04. Conditions & Branching' },
        { id: '05', slug: '05-loops.html', title: '05. Loops & Iteration' },
        { id: '06', slug: '06-functions.html', title: '06. Functions & Scope' },
        { id: '07', slug: '07-scope-hoisting-closures.html', title: '07. Hoisting & Closures' },
        { id: '08', slug: '08-arrays-and-array-methods.html', title: '08. Arrays & Modern Methods' },
        { id: '09', slug: '09-objects-and-this.html', title: '09. Objects & "this"' },
        { id: '10', slug: '10-strings-numbers-math-date.html', title: '10. Strings, Math & Date' },
        { id: '11', slug: '11-dom-selecting-changing.html', title: '11. DOM Selecting & Styling' },
        { id: '12', slug: '12-dom-creating-removing.html', title: '12. Creating & Removing DOM' },
        { id: '13', slug: '13-events-and-event-delegation.html', title: '13. Events & Delegation' },
        { id: '14', slug: '14-forms-with-javascript.html', title: '14. Forms & Live Validation' },
        { id: '15', slug: '15-es6-destructuring-spread-modules.html', title: '15. ES6+ Destructuring & Spread' },
        { id: '16', slug: '16-classes-and-oop.html', title: '16. Classes & OOP' },
        { id: '17', slug: '17-error-handling.html', title: '17. Error Handling (try/catch)' },
        { id: '18', slug: '18-promises-async-await.html', title: '18. Promises & Async/Await' },
        { id: '19', slug: '19-fetch-api-and-json.html', title: '19. Fetch API & JSON' },
        { id: '20', slug: '20-localstorage-sessionstorage.html', title: '20. LocalStorage Persistence' },
        { id: '21', slug: '21-regex-basics.html', title: '21. Regular Expressions' },
        { id: '22', slug: '22-debugging-and-best-practices.html', title: '22. Debugging & Best Practices' }
      ]
    },
    'projects': {
      title: 'Real-World Projects',
      badgeColor: 'var(--c-projects)',
      basePath: 'projects/',
      lessons: [
        { id: '01', slug: '01-personal-portfolio.html', title: '01. Personal Portfolio' },
        { id: '02', slug: '02-responsive-landing-page.html', title: '02. Responsive Landing Page' },
        { id: '03', slug: '03-todo-app.html', title: '03. Feature-Rich Todo App' },
        { id: '04', slug: '04-calculator.html', title: '04. Interactive Calculator' },
        { id: '05', slug: '05-quiz-app.html', title: '05. Timed Quiz Application' },
        { id: '06', slug: '06-digital-clock-stopwatch.html', title: '06. Clock & Lap Stopwatch' },
        { id: '07', slug: '07-image-gallery-lightbox.html', title: '07. Gallery & Lightbox' },
        { id: '08', slug: '08-weather-app-mock-data.html', title: '08. Offline Weather App' },
        { id: '09', slug: '09-expense-tracker.html', title: '09. Expense & Budget Tracker' }
      ]
    },
    'reference': {
      title: 'Developer Reference',
      badgeColor: 'var(--c-ref)',
      basePath: 'reference/',
      lessons: [
        { id: 'tags', slug: 'html-tags-reference.html', title: 'HTML Tags Encyclopedia' },
        { id: 'props', slug: 'css-properties-reference.html', title: 'CSS Properties Directory' },
        { id: 'js', slug: 'js-reference.html', title: 'JavaScript Methods Reference' },
        { id: 'glossary', slug: 'glossary.html', title: 'A-Z WebDev Glossary' },
        { id: 'cheatsheets', slug: 'cheatsheets.html', title: 'Printable Cheatsheets' },
        { id: 'colors', slug: 'colors-and-entities.html', title: 'CSS Colors & HTML Entities' }
      ]
    },
    'practice': {
      title: 'Practice & Prep',
      badgeColor: 'var(--c-practice)',
      basePath: 'practice/',
      lessons: [
        { id: 'challenges', slug: 'index.html', title: 'Coding Challenges Hub' },
        { id: 'interview', slug: 'interview-questions.html', title: '50+ Interview Questions' },
        { id: 'typing', slug: 'typing-test.html', title: '⚡ Speed Typing Test' }
      ]
    },
    'sql': {
      title: 'SQL & Database Systems',
      badgeColor: 'var(--c-sql)',
      basePath: 'sql/',
      lessons: [
        { id: '01', slug: '01-database-fundamentals-rdbms.html', title: '01. RDBMS & Database Fundamentals', section: 'Database Fundamentals' },
        { id: '02', slug: '02-ddl-create-alter-drop.html', title: '02. DDL: CREATE, ALTER, DROP, TRUNCATE', section: 'Data Definition & Manipulation' },
        { id: '03', slug: '03-dml-insert-update-delete.html', title: '03. DML: INSERT, UPDATE, DELETE', section: 'Data Definition & Manipulation' },
        { id: '04', slug: '04-dql-select-where-operators.html', title: '04. DQL: SELECT, WHERE, Filtering', section: 'Querying & Analysis' },
        { id: '05', slug: '05-aggregations-group-by-having.html', title: '05. Aggregations, GROUP BY & HAVING', section: 'Querying & Analysis' },
        { id: '06', slug: '06-joins-in-depth.html', title: '06. SQL Joins In-Depth', section: 'Relational Queries' },
        { id: '07', slug: '07-subqueries-and-ctes.html', title: '07. Subqueries & CTEs (WITH Clause)', section: 'Relational Queries' },
        { id: '08', slug: '08-window-functions.html', title: '08. Advanced Window Functions', section: 'Advanced SQL' },
        { id: '09', slug: '09-indexing-and-performance.html', title: '09. Indexes & Query Performance', section: 'Architecture & Optimization' },
        { id: '10', slug: '10-transactions-acid-normalization.html', title: '10. ACID, Transactions & Normalization', section: 'Architecture & Optimization' },
        { id: '11', slug: '11-sql-interview-guide.html', title: '11. 🎯 Top 75 SQL Interview Q&A', section: 'Interview Prep' }
      ]
    },
    'python': {
      title: 'Python 3 Masterclass',
      badgeColor: 'var(--c-python)',
      basePath: 'python/',
      lessons: [
        { id: '01', slug: '01-introduction-setup.html', title: '01. Intro, Setup & Virtual Envs', section: 'Core Python' },
        { id: '02', slug: '02-syntax-variables-datatypes.html', title: '02. Variables & Dynamic Typing', section: 'Core Python' },
        { id: '03', slug: '03-numbers-booleans-operators.html', title: '03. Numbers, Math & Operators', section: 'Core Python' },
        { id: '04', slug: '04-strings-and-string-methods.html', title: '04. Strings, Slicing & Methods', section: 'Core Python' },
        { id: '05', slug: '05-lists-and-tuples.html', title: '05. Lists & Tuples in Depth', section: 'Data Structures Tree', isSubItem: true },
        { id: '06', slug: '06-dictionaries-and-sets.html', title: '06. Dictionaries & Sets', section: 'Data Structures Tree', isSubItem: true },
        { id: '07', slug: '07-conditionals-and-loops.html', title: '07. Conditionals, Match-Case & Loops', section: 'Control Flow' },
        { id: '08', slug: '08-functions-args-kwargs-lambda.html', title: '08. Functions, *args, **kwargs & Lambdas', section: 'Functional Python' },
        { id: '09', slug: '09-oop-classes-objects.html', title: '09. Classes, Objects & self', section: 'OOP & Architecture' },
        { id: '10', slug: '10-oop-inheritance-polymorphism.html', title: '10. Inheritance & Polymorphism', section: 'OOP & Architecture' },
        { id: '11', slug: '11-error-handling-and-files.html', title: '11. Error Handling & File I/O', section: 'System & Persistence' },
        { id: '12', slug: '12-modules-packages-pip.html', title: '12. Modules, Packages & pip', section: 'System & Persistence' },
        { id: '13', slug: '13-database-sqlite-postgres.html', title: '13. Databases (SQLite & PostgreSQL)', section: 'System & Persistence' },
        { id: '14', slug: '14-flask-and-fastapi.html', title: '14. REST APIs: Flask & FastAPI', section: 'Web Frameworks' },
        { id: '15', slug: '15-django-fundamentals.html', title: '15. Django MVT & Full-Stack Apps', section: 'Web Frameworks' },
        { id: '16', slug: '16-numpy-and-pandas.html', title: '16. NumPy & Pandas DataFrames', section: 'Data Science & AI' },
        { id: '17', slug: '17-data-visualization-matplotlib.html', title: '17. Visualizations: Matplotlib & Seaborn', section: 'Data Science & AI' },
        { id: '18', slug: '18-machine-learning-scikit-learn.html', title: '18. Machine Learning (Scikit-Learn)', section: 'Data Science & AI' },
        { id: '19', slug: '19-deep-learning-nlp-cv.html', title: '19. Deep Learning, NLP & Computer Vision', section: 'Data Science & AI' },
        { id: '20', slug: '20-python-interview-guide.html', title: '20. 🎯 Top 100 Python Interview Q&A', section: 'Interview Prep' }
      ]
    },
    'java': {
      title: 'Java & Spring Boot',
      badgeColor: 'var(--c-java)',
      basePath: 'java/',
      lessons: [
        { id: '01', slug: '01-introduction-jvm-jdk-jre.html', title: '01. JVM Architecture & Memory Model', section: 'Java Fundamentals' },
        { id: '02', slug: '02-syntax-data-types-variables.html', title: '02. Data Types, Primitives & Literals', section: 'Java Fundamentals' },
        { id: '03', slug: '03-operators-control-flow.html', title: '03. Operators & Control Flow', section: 'Java Fundamentals' },
        { id: '04', slug: '04-methods-arrays-strings.html', title: '04. Methods, Arrays & String Pool', section: 'Java Fundamentals' },
        { id: '05', slug: '05-oop-classes-objects-constructors.html', title: '05. Classes, Objects & Encapsulation', section: 'Object-Oriented Programming' },
        { id: '06', slug: '06-oop-inheritance-polymorphism.html', title: '06. Inheritance & Polymorphism', section: 'Object-Oriented Programming' },
        { id: '07', slug: '07-oop-abstraction-interfaces.html', title: '07. Abstraction & Interfaces', section: 'Object-Oriented Programming' },
        { id: '08', slug: '08-exception-handling.html', title: '08. Exception Handling (Checked vs Unchecked)', section: 'Core Java Deep-Dive' },
        { id: '09', slug: '09-collections-framework.html', title: '09. Collections (List, Set, Map)', section: 'Core Java Deep-Dive' },
        { id: '10', slug: '10-generics-and-comparators.html', title: '10. Generics & Sorting (Comparable/Comparator)', section: 'Core Java Deep-Dive' },
        { id: '11', slug: '11-multithreading-concurrency.html', title: '11. Multithreading & Concurrency', section: 'Enterprise Java' },
        { id: '12', slug: '12-java-8-streams-and-lambdas.html', title: '12. Java 8+ Streams & Lambdas', section: 'Enterprise Java' },
        { id: '13', slug: '13-jdbc-and-database-connectivity.html', title: '13. JDBC & Database Persistence', section: 'Enterprise Java' },
        { id: '14', slug: '14-spring-core-and-ioc.html', title: '14. Spring Core, IoC & Dependency Injection', section: 'Spring Ecosystem' },
        { id: '15', slug: '15-spring-boot-and-rest-apis.html', title: '15. Spring Boot & RESTful APIs', section: 'Spring Ecosystem' },
        { id: '16', slug: '16-spring-data-jpa-hibernate.html', title: '16. Spring Data JPA & Hibernate ORM', section: 'Spring Ecosystem' },
        { id: '17', slug: '17-microservices-architecture.html', title: '17. Microservices Architecture & Cloud', section: 'Spring Ecosystem' },
        { id: '18', slug: '18-java-interview-guide.html', title: '18. 🎯 Top 100 Java & Spring Interview Q&A', section: 'Interview Prep' }
      ]
    }
  };

  const App = {
    getRootPath: function() {
      const meta = document.querySelector('meta[name="root-path"]');
      if (meta) return meta.getAttribute('content');
      // Fallback relative detection
      const path = window.location.pathname.replace(/\\/g, '/');
      if (path.includes('/getting-started/') || path.includes('/html/') || path.includes('/css/') ||
          path.includes('/javascript/') || path.includes('/python/') || path.includes('/java/') ||
          path.includes('/sql/') || path.includes('/projects/') || path.includes('/reference/') ||
          path.includes('/practice/') || path.includes('/playground/') || path.includes('/certificate/')) {
        return '../';
      }
      return './';
    },

    getCurrentCourse: function() {
      return document.body.getAttribute('data-course') || '';
    },

    getCurrentLessonSlug: function() {
      return window.location.pathname.split('/').pop() || 'index.html';
    },

    injectHeader: function() {
      const headerContainer = document.getElementById('app-header');
      if (!headerContainer) return;

      const root = this.getRootPath();
      const currentCourse = this.getCurrentCourse();

      headerContainer.className = 'site-header';
      headerContainer.innerHTML = `
        <div class="brand-group">
          <button class="sidebar-toggle-btn" aria-label="Toggle Navigation Sidebar">&#9776;</button>
          <a href="${root}index.html" class="site-logo">
            <svg class="logo-icon" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>WebDev<strong style="color:var(--accent-primary)">Academy</strong></span>
          </a>
        </div>

        <ul class="site-nav-links">
          <li><a href="${root}getting-started/01-how-the-web-works.html" class="nav-link ${currentCourse === 'getting-started' ? 'active' : ''}">Start</a></li>
          <li><a href="${root}html/index.html" class="nav-link ${currentCourse === 'html' ? 'active' : ''}">HTML</a></li>
          <li><a href="${root}css/index.html" class="nav-link ${currentCourse === 'css' ? 'active' : ''}">CSS</a></li>
          <li><a href="${root}javascript/index.html" class="nav-link ${currentCourse === 'javascript' ? 'active' : ''}">JS</a></li>
          <li><a href="${root}python/index.html" class="nav-link ${currentCourse === 'python' ? 'active' : ''}">Python</a></li>
          <li><a href="${root}java/index.html" class="nav-link ${currentCourse === 'java' ? 'active' : ''}">Java</a></li>
          <li><a href="${root}sql/index.html" class="nav-link ${currentCourse === 'sql' ? 'active' : ''}">SQL</a></li>
          <li><a href="${root}projects/index.html" class="nav-link ${currentCourse === 'projects' ? 'active' : ''}">Projects</a></li>
          <li><a href="${root}practice/index.html" class="nav-link ${currentCourse === 'practice' && !window.location.pathname.includes('typing-test') ? 'active' : ''}">Practice</a></li>
          <li><a href="${root}getting-started/05-developer-typing-test.html" class="nav-link ${window.location.pathname.includes('typing-test') ? 'active' : ''}" style="color:var(--accent-primary); font-weight:700;">⌨️ Typing</a></li>
          <li><a href="${root}reference/glossary.html" class="nav-link ${currentCourse === 'reference' ? 'active' : ''}">Ref</a></li>
          <li><a href="${root}playground/index.html" class="nav-link ${currentCourse === 'playground' ? 'active' : ''}">Playground</a></li>
        </ul>

        <div class="header-controls">
          <button class="search-trigger-btn" title="Search documentation">
            <span>&#128269; Search</span>
            <span class="kbd-shortcut">/</span>
          </button>
          <button class="icon-btn font-dec-btn" title="Decrease Font Size">A-</button>
          <button class="icon-btn font-inc-btn" title="Increase Font Size">A+</button>
          <button class="lang-switch-btn" title="Switch English / Hinglish">English</button>
          <button class="icon-btn theme-toggle-btn" title="Toggle Theme">&#9790;</button>
        </div>
      `;

      // Header event wiring
      headerContainer.querySelector('.theme-toggle-btn').addEventListener('click', () => window.Theme.toggleTheme());
      headerContainer.querySelector('.lang-switch-btn').addEventListener('click', () => window.Theme.toggleLang());
      headerContainer.querySelector('.font-inc-btn').addEventListener('click', () => window.Theme.increaseFont());
      headerContainer.querySelector('.font-dec-btn').addEventListener('click', () => window.Theme.decreaseFont());

      const toggleSidebarBtn = headerContainer.querySelector('.sidebar-toggle-btn');
      if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', () => {
          const sidebar = document.querySelector('.course-sidebar');
          const backdrop = document.querySelector('.sidebar-backdrop');
          if (sidebar) sidebar.classList.toggle('open');
          if (backdrop) backdrop.classList.toggle('active');
        });
      }
    },

    injectSidebar: function() {
      const sidebarContainer = document.getElementById('app-sidebar');
      if (!sidebarContainer) return;

      const courseKey = this.getCurrentCourse();
      const course = CURRICULUM[courseKey];
      if (!course) {
        sidebarContainer.style.display = 'none';
        return;
      }

      const root = this.getRootPath();
      const currentSlug = this.getCurrentLessonSlug();

      let sidebarItemsHtml = '';
      let currentSection = '';

      course.lessons.forEach(item => {
        if (item.section && item.section !== currentSection) {
          currentSection = item.section;
          sidebarItemsHtml += `<li class="sidebar-section-divider"><span>${currentSection}</span></li>`;
        }
        sidebarItemsHtml += `
          <li class="sidebar-item ${item.isSubItem ? 'sub-item' : ''} ${currentSlug === item.slug ? 'active' : ''}" data-lesson-id="${courseKey}-${item.id}">
            <a href="${root}${course.basePath}${item.slug}">
              <span>${item.title}</span>
              <span class="check-icon">&#10003;</span>
            </a>
          </li>
        `;
      });

      sidebarContainer.className = 'course-sidebar';
      sidebarContainer.innerHTML = `
        <div class="sidebar-header">
          <div class="course-badge-title">
            <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${course.badgeColor}"></span>
            <span>${course.title}</span>
          </div>
          <div class="sidebar-course-progress">
            <div class="progress-track-small">
              <div class="progress-fill-small"></div>
            </div>
            <div class="progress-text-small">
              <span>Progress</span>
              <span class="progress-num">0%</span>
            </div>
          </div>
        </div>

        <div class="sidebar-section-title">Lessons & Modules</div>
        <ul class="sidebar-menu">
          ${sidebarItemsHtml}
        </ul>
      `;

      // Insert mobile backdrop if not present
      if (!document.querySelector('.sidebar-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        backdrop.addEventListener('click', () => {
          const sidebar = document.querySelector('.course-sidebar');
          if (sidebar) sidebar.classList.remove('open');
          backdrop.classList.remove('active');
        });
        document.body.appendChild(backdrop);
      }
    },

    injectTOC: function() {
      const tocContainer = document.getElementById('app-toc');
      if (!tocContainer) return;

      const headings = document.querySelectorAll('.content-inner h2, .content-inner h3');
      if (headings.length === 0) {
        tocContainer.style.display = 'none';
        return;
      }

      tocContainer.className = 'toc-sidebar';
      let tocHtml = '<div class="toc-title">On this page</div><ul class="toc-list">';

      headings.forEach((h, index) => {
        let id = h.id;
        if (!id) {
          id = 'heading-' + index;
          h.id = id;
        }
        const isH3 = h.tagName.toLowerCase() === 'h3';
        tocHtml += `
          <li class="toc-item ${isH3 ? 'toc-sub' : ''}" data-target="${id}">
            <a href="#${id}" style="${isH3 ? 'padding-left: 1.5rem; font-size: 0.8rem;' : ''}">${h.textContent}</a>
          </li>
        `;
      });
      tocHtml += '</ul>';
      tocContainer.innerHTML = tocHtml;

      // Active scroll spy for TOC
      window.addEventListener('scroll', () => {
        let currentActive = null;
        headings.forEach(h => {
          const top = h.getBoundingClientRect().top;
          if (top <= 120) {
            currentActive = h.id;
          }
        });

        if (currentActive) {
          const items = tocContainer.querySelectorAll('.toc-item');
          items.forEach(item => {
            if (item.getAttribute('data-target') === currentActive) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    },

    injectFooter: function() {
      const footerContainer = document.getElementById('app-footer');
      if (!footerContainer) return;

      const root = this.getRootPath();
      footerContainer.className = 'site-footer';
      footerContainer.innerHTML = `
        <div class="footer-grid">
          <div class="footer-col">
            <h4 style="display:flex; align-items:center; gap:0.5rem;">
              <svg style="width:20px; height:20px; fill:var(--accent-primary);" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" fill="none"/>
              </svg>
              WebDev Academy
            </h4>
            <p style="font-size: 0.88rem; line-height: 1.6; margin-top: 0.5rem; color: var(--text-secondary);">
              A 100% self-contained, offline-first curriculum for learning HTML5, modern CSS3, and vanilla JavaScript from zero to production.
            </p>
            <div style="margin-top: 1rem; display:inline-flex; align-items:center; gap:0.4rem; padding:0.25rem 0.65rem; background:var(--state-success-bg); color:var(--state-success); border-radius:var(--radius-full); font-size:0.75rem; font-weight:700;">
              &#9679; 100% Offline Mode &bull; Zero External CDNs
            </div>
          </div>
          <div class="footer-col">
            <h4>Curriculum</h4>
            <ul class="footer-links">
              <li><a href="${root}getting-started/01-how-the-web-works.html">Getting Started</a></li>
              <li><a href="${root}html/index.html">HTML5 Course</a></li>
              <li><a href="${root}css/index.html">CSS3 Course</a></li>
              <li><a href="${root}javascript/index.html">JavaScript Course</a></li>
              <li><a href="${root}python/index.html">Python 3 Masterclass</a></li>
              <li><a href="${root}java/index.html">Java & Spring Boot</a></li>
              <li><a href="${root}sql/index.html">SQL & Databases</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Practice & Builds</h4>
            <ul class="footer-links">
              <li><a href="${root}projects/index.html">Hands-on Projects</a></li>
              <li><a href="${root}practice/index.html">Coding Challenges</a></li>
              <li><a href="${root}practice/interview-questions.html">Interview Q&A</a></li>
              <li><a href="${root}playground/index.html">Live Playground</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Reference Library</h4>
            <ul class="footer-links">
              <li><a href="${root}reference/html-tags-reference.html">HTML Tags Dictionary</a></li>
              <li><a href="${root}reference/css-properties-reference.html">CSS Properties</a></li>
              <li><a href="${root}reference/js-reference.html">JS Built-in Methods</a></li>
              <li><a href="${root}reference/glossary.html">WebDev Glossary</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Tools & Verification</h4>
            <ul class="footer-links">
              <li><a href="${root}reference/cheatsheets.html">Printable Cheatsheets</a></li>
              <li><a href="${root}reference/colors-and-entities.html">Colors & Entities</a></li>
              <li><a href="${root}certificate/index.html">Course Certificates</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; WebDev Academy &mdash; Designed for self-paced, offline mastery.</span>
          <span>No external trackers &bull; LocalStorage only &bull; Offline Ready</span>
        </div>
      `;
    },

    setupBackToTop: function() {
      const btn = document.createElement('button');
      btn.className = 'icon-btn';
      btn.style.cssText = 'position:fixed; bottom:24px; right:24px; background:var(--accent-primary); color:#fff; border-radius:50%; box-shadow:var(--shadow-lg); z-index:90; display:none; width:44px; height:44px; font-size:1.2rem;';
      btn.innerHTML = '&#8593;';
      btn.setAttribute('title', 'Back to top');
      document.body.appendChild(btn);

      btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          btn.style.display = 'inline-flex';
        } else {
          btn.style.display = 'none';
        }
      });
    },

    init: function() {
      this.injectHeader();
      this.injectSidebar();
      this.injectTOC();
      this.injectFooter();
      this.setupBackToTop();

      // Initialize all engines
      if (window.Highlighter) window.Highlighter.highlightAll();
      if (window.Editor) window.Editor.init();
      if (window.Quiz) window.Quiz.init();
      if (window.Progress) window.Progress.init();
      if (window.Theme) window.Theme.init();
      if (window.Search) window.Search.init(this.getRootPath());
    }
  };

  window.App = App;

  // Auto-run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
})(window);
