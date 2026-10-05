export interface SqlTopicItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  icon: string;
  slideRange: string;
  category: 'Fundamentals' | 'Data Types & Rules' | 'Commands (DDL & DML)' | 'Querying & Functions' | 'Advanced & Architecture';
  badge?: 'Essential' | 'Core' | 'Advanced' | 'Interactive';
}

export const SQL_TOPICS: SqlTopicItem[] = [
  {
    id: 'intro',
    slug: 'intro',
    title: '1. Introduction & RDBMS Basics',
    shortDesc: 'Data, Database, DBMS vs RDBMS, Tables, Columns, Rows, and what SQL can do.',
    icon: '📚',
    slideRange: 'Slides 1 - 4',
    category: 'Fundamentals',
    badge: 'Essential'
  },
  {
    id: 'commands',
    slug: 'commands',
    title: '2. SQL Commands & Expressions',
    shortDesc: '5 Types of SQL Commands (DDL, DML, DQL, DCL, TCL), Operators & Expressions.',
    icon: '⚡',
    slideRange: 'Slides 5 - 8',
    category: 'Fundamentals',
    badge: 'Core'
  },
  {
    id: 'data-types',
    slug: 'data-types',
    title: '3. Data Types in SQL',
    shortDesc: 'Numeric, Date & Time, and String data types with memory allocations and limits.',
    icon: '🔢',
    slideRange: 'Slides 9 - 11',
    category: 'Data Types & Rules',
    badge: 'Core'
  },
  {
    id: 'constraints',
    slug: 'constraints',
    title: '4. Constraints in SQL',
    shortDesc: 'NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, and DEFAULT rules.',
    icon: '🛡️',
    slideRange: 'Slides 12 - 17',
    category: 'Data Types & Rules',
    badge: 'Essential'
  },
  {
    id: 'ddl',
    slug: 'ddl',
    title: '5. DDL (Data Definition Language)',
    shortDesc: 'CREATE, ALTER (ADD/MODIFY/RENAME/DROP), RENAME TABLE, TRUNCATE vs DROP.',
    icon: '🏗️',
    slideRange: 'Slides 18 - 25',
    category: 'Commands (DDL & DML)',
    badge: 'Core'
  },
  {
    id: 'dml',
    slug: 'dml',
    title: '6. DML (Data Manipulation Language)',
    shortDesc: 'INSERT INTO syntaxes, UPDATE statements, DELETE commands, DELETE vs TRUNCATE.',
    icon: '✏️',
    slideRange: 'Slides 26 - 30',
    category: 'Commands (DDL & DML)',
    badge: 'Core'
  },
  {
    id: 'dcl',
    slug: 'dcl',
    title: 'DCL (Data Control Language)',
    shortDesc: 'Database security and user access control: GRANT and REVOKE privileges.',
    icon: '🛡️',
    slideRange: 'Security & Access',
    category: 'Commands (DDL & DML)',
    badge: 'Core'
  },
  {
    id: 'tcl',
    slug: 'tcl',
    title: 'TCL (Transaction Control Language)',
    shortDesc: 'COMMIT, ROLLBACK, SAVEPOINT, and ACID transaction guarantees.',
    icon: '🔄',
    slideRange: 'Transactions & ACID',
    category: 'Commands (DDL & DML)',
    badge: 'Advanced'
  },
  {
    id: 'dql',
    slug: 'dql',
    title: '7. DQL, Filtering & Sorting',
    shortDesc: 'SELECT, DISTINCT, WHERE, AND/OR/NOT, BETWEEN, IN, LIKE wildcards, IS NULL, LIMIT, ORDER BY, Aliases.',
    icon: '🔍',
    slideRange: 'Slides 31 - 46',
    category: 'Querying & Functions',
    badge: 'Essential'
  },
  {
    id: 'functions',
    slug: 'functions',
    title: '8. Built-in SQL Functions',
    shortDesc: 'String, Math, Date/Time, Aggregate, Scalar, and Comparison functions with examples.',
    icon: '⚙️',
    slideRange: 'Slides 47 - 59',
    category: 'Querying & Functions',
    badge: 'Core'
  },
  {
    id: 'group-by',
    slug: 'group-by',
    title: '9. GROUP BY & HAVING Clauses',
    shortDesc: 'Aggregate grouping, multi-column group by, WHERE vs HAVING clauses & rules.',
    icon: '📊',
    slideRange: 'Slides 60 - 65',
    category: 'Querying & Functions',
    badge: 'Advanced'
  },
  {
    id: 'subqueries',
    slug: 'subqueries',
    title: '10. Subqueries & Nested Queries',
    shortDesc: 'Single-Row, Multiple-Row (IN, ANY, ALL), Multi-Column, DML with subqueries.',
    icon: '🔄',
    slideRange: 'Slides 66 - 82',
    category: 'Advanced & Architecture',
    badge: 'Advanced'
  },
  {
    id: 'foreign-keys',
    slug: 'foreign-keys',
    title: '11. Foreign Keys & Integrity',
    shortDesc: 'Referential integrity, CASCADE, RESTRICT, SET NULL, NO ACTION, parent-child setups.',
    icon: '🔗',
    slideRange: 'Slides 83 - 87',
    category: 'Advanced & Architecture',
    badge: 'Core'
  },
  {
    id: 'joins',
    slug: 'joins',
    title: '12. SQL Joins (Venn & Tables)',
    shortDesc: 'INNER, LEFT, RIGHT, FULL (UNION), CROSS, and SELF JOIN with Venn visualizers.',
    icon: '🔀',
    slideRange: 'Slides 88 - 96',
    category: 'Advanced & Architecture',
    badge: 'Essential'
  },
  {
    id: 'views',
    slug: 'views',
    title: '13. Views in SQL',
    shortDesc: 'Virtual tables, CREATE VIEW from single/multiple tables, updating, deleting & dropping views.',
    icon: '🪟',
    slideRange: 'Slides 97 - 102',
    category: 'Advanced & Architecture',
    badge: 'Core'
  },
  {
    id: 'playground',
    slug: 'playground',
    title: '14. Interactive SQL Playground',
    shortDesc: 'Test SQL queries live in your browser against pre-seeded tables from the PPT.',
    icon: '💻',
    slideRange: 'Interactive Engine',
    category: 'Advanced & Architecture',
    badge: 'Interactive'
  }
];
