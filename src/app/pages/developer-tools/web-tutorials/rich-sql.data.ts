import { RichTutorialChapter, W3TopicItem } from './rich-tutorial.models';

export const ALL_RICH_SQL_CHAPTERS: RichTutorialChapter[] = [
  {
    "id": "sql-overview",
    "chapterNumber": 1,
    "title": "SQL Overview & Relational Database Architecture",
    "category": "Database Fundamentals",
    "shortDesc": "RDBMS concepts, Codd's 12 rules, tables, rows, columns, primary and foreign keys.",
    "overview": [
      "SQL (Structured Query Language) is the ANSI/ISO standard declarative domain-specific language for managing data held in Relational Database Management Systems (RDBMS).",
      "Conceived in the 1970s at IBM by Edgar F. Codd and Donald D. Chamberlin, SQL is organized into DDL (Definition), DML (Manipulation), DCL (Control), and TCL (Transactions).",
      "Relational databases enforce data integrity via Primary Keys, Foreign Keys, Unique constraints, and ACID transactional guarantees."
    ],
    "sections": [
      {
        "title": "Relational Model & Key Constraints Table",
        "theory": [
          "Primary Key: A column (or set of columns) that uniquely identifies each row in a table. Cannot be NULL and must be unique.",
          "Foreign Key: A column that references the Primary Key of another table, establishing a referential integrity constraint.",
          "Candidate Key: Any column or combination of columns that could serve as a Primary Key.",
          "Composite Key: A primary key consisting of two or more columns."
        ],
        "table": [
          {
            "attribute": "PRIMARY KEY",
            "value": "Unique Identifier",
            "description": "Uniquely identifies each record. Enforces NOT NULL + UNIQUE. Auto-creates B-Tree index."
          },
          {
            "attribute": "FOREIGN KEY",
            "value": "Referential Link",
            "description": "Points to Primary Key in parent table. Enforces referential integrity (ON DELETE CASCADE)."
          },
          {
            "attribute": "UNIQUE",
            "value": "Uniqueness Check",
            "description": "Ensures all values in column are distinct. Allows single NULL in many engines."
          },
          {
            "attribute": "CHECK",
            "value": "Domain Constraint",
            "description": "Enforces a boolean condition on column values (e.g. CHECK (salary > 0))."
          },
          {
            "attribute": "NOT NULL",
            "value": "Mandatory Column",
            "description": "Prohibits insertion of NULL values into the column."
          }
        ],
        "codeExample": "-- Table Schema Definition with Constraints\nCREATE TABLE departments (\n    dept_id INTEGER PRIMARY KEY,\n    dept_name VARCHAR(50) NOT NULL UNIQUE\n);\n\nCREATE TABLE employees (\n    emp_id INTEGER PRIMARY KEY,\n    full_name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL,\n    salary DECIMAL(10, 2) CHECK (salary >= 20000.00),\n    dept_id INTEGER NOT NULL,\n    hire_date DATE DEFAULT CURRENT_DATE,\n    FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE CASCADE\n);\n\nINSERT INTO departments (dept_id, dept_name) VALUES (1, 'Engineering');\nINSERT INTO employees (emp_id, full_name, email, salary, dept_id) \nVALUES (101, 'Alice Johnson', 'alice@converterallai.com', 95000.00, 1);\n\nSELECT * FROM employees;",
        "browserOutputDesc": "emp_id | full_name     | email                    | salary   | dept_id | hire_date\n-------+---------------+--------------------------+----------+---------+------------\n101    | Alice Johnson | alice@converterallai.com | 95000.00 | 1       | 2026-10-27"
      },
      {
        "title": "10th-Grade Analogy & Interview Point",
        "theory": [
          "Analogy: Think of a relational database as a school registrar office. The 'Students' spreadsheet has a unique Roll Number (Primary Key). The 'Library Books' spreadsheet records which Roll Number borrowed which book (Foreign Key). If someone enters an invalid student number, the registrar rejects it!",
          "Interview Point: If asked 'What is the difference between TRUNCATE and DELETE?', answer: 1) DELETE is DML; it deletes rows one-by-one, can have a WHERE clause, logs each row deletion, fires triggers, and can be rolled back. 2) TRUNCATE is DDL; it deallocates the entire data pages, cannot have a WHERE clause, does not fire row triggers, resets auto-increment sequences, and is much faster."
        ],
        "codeExample": "-- Demonstrating Declarative Filtering\nSELECT emp_id, full_name, salary \nFROM employees \nWHERE salary >= 50000.00 \nORDER BY salary DESC;",
        "browserOutputDesc": "emp_id | full_name     | salary\n-------+---------------+---------\n101    | Alice Johnson | 95000.00"
      }
    ]
  },
  {
    "id": "sql-ddl-dml",
    "chapterNumber": 2,
    "title": "SQL DDL & DML: CREATE, ALTER, INSERT, UPDATE, DELETE",
    "category": "Database Fundamentals",
    "shortDesc": "Schema definition (DDL) vs data manipulation (DML), TRUNCATE vs DELETE, and safe update patterns.",
    "overview": [
      "DDL (Data Definition Language) commands define and alter the database schema structure (CREATE, ALTER, DROP, TRUNCATE).",
      "DML (Data Manipulation Language) commands insert, retrieve, update, and remove data rows (INSERT, SELECT, UPDATE, DELETE)."
    ],
    "sections": [
      {
        "title": "TRUNCATE vs DELETE Comparison Matrix",
        "theory": [
          "Always include a `WHERE` clause when executing `UPDATE` or `DELETE`! Omitting `WHERE` updates or deletes EVERY row in the entire table.",
          "`INSERT INTO ... VALUES (...)` supports inserting multiple rows in a single atomic network roundtrip.",
          "`ALTER TABLE` allows adding, modifying, or dropping columns on existing production tables."
        ],
        "table": [
          {
            "attribute": "DELETE FROM table",
            "value": "DML",
            "description": "Deletes filtered rows. Logs row-by-row in redo log. Fires triggers. Slower."
          },
          {
            "attribute": "TRUNCATE TABLE",
            "value": "DDL",
            "description": "Deallocates entire page blocks. Resets identity counters. Ultra-fast."
          },
          {
            "attribute": "DROP TABLE",
            "value": "DDL",
            "description": "Removes both table data AND schema structure completely from database."
          },
          {
            "attribute": "ALTER TABLE ADD",
            "value": "DDL",
            "description": "Appends a new column definition to existing table schema."
          }
        ],
        "codeExample": "-- DDL & DML Operations\nCREATE TABLE products (\n    product_id INTEGER PRIMARY KEY,\n    title VARCHAR(80) NOT NULL,\n    price DECIMAL(8, 2) NOT NULL,\n    stock INTEGER DEFAULT 0\n);\n\n-- Multi-row batch insert\nINSERT INTO products (product_id, title, price, stock) VALUES\n(1, 'Ergonomic Desk', 299.99, 15),\n(2, 'Mechanical Keyboard', 89.95, 40),\n(3, '4K Monitor', 449.00, 8);\n\n-- Safe UPDATE with WHERE clause\nUPDATE products \nSET stock = stock + 10, price = price * 0.95 \nWHERE product_id = 2;\n\nSELECT * FROM products WHERE product_id = 2;",
        "browserOutputDesc": "product_id | title               | price | stock\n-----------+---------------------+-------+------\n2          | Mechanical Keyboard | 85.45 | 50"
      }
    ]
  },
  {
    "id": "sql-queries",
    "chapterNumber": 3,
    "title": "SQL Querying: SELECT, WHERE, ORDER BY, LIMIT",
    "category": "Querying & Filtering",
    "shortDesc": "SELECT projection, WHERE filtering, comparison operators, ORDER BY sorting, and LIMIT/OFFSET pagination.",
    "overview": [
      "The `SELECT` statement retrieves data from one or more tables.",
      "SQL Query Execution Order: `FROM` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT` -> `DISTINCT` -> `ORDER BY` -> `LIMIT`. Understanding this order explains why you cannot use column aliases in the `WHERE` clause!"
    ],
    "sections": [
      {
        "title": "Logical Execution Order & Operators Table",
        "theory": [
          "`WHERE`: Filters raw rows BEFORE any grouping occurs.",
          "`ORDER BY col ASC/DESC`: Sorts results. Default is ascending.",
          "`LIMIT n OFFSET m`: Pagination pattern (e.g. page 2 with 10 rows: `LIMIT 10 OFFSET 10`).",
          "Three-Valued Logic: In SQL, comparing anything to NULL with `=` (`WHERE col = NULL`) returns UNKNOWN, which evaluates to false! Always use `IS NULL` or `IS NOT NULL`."
        ],
        "table": [
          {
            "attribute": "WHERE col = val",
            "value": "Equality",
            "description": "Exact match filter."
          },
          {
            "attribute": "WHERE col <> val / !=",
            "value": "Inequality",
            "description": "Matches rows not equal to val."
          },
          {
            "attribute": "WHERE col IN (...)",
            "value": "Discrete Set",
            "description": "Matches rows whose value is present in specified set of constants or subquery."
          },
          {
            "attribute": "WHERE col BETWEEN a AND b",
            "value": "Inclusive Range",
            "description": "Equivalent to: col >= a AND col <= b."
          },
          {
            "attribute": "WHERE col LIKE 'pattern%'",
            "value": "Wildcard Search",
            "description": "% matches zero or more chars; _ matches exactly one char."
          },
          {
            "attribute": "WHERE col IS NULL",
            "value": "Null Check",
            "description": "The only valid syntax to check for missing/null values."
          }
        ],
        "codeExample": "-- Comprehensive Querying with Filtering and Pagination\nSELECT \n    emp_id,\n    full_name,\n    salary,\n    salary * 1.10 AS projected_salary\nFROM employees\nWHERE salary BETWEEN 50000.00 AND 120000.00\n  AND email LIKE '%@converterallai.com'\nORDER BY salary DESC\nLIMIT 5 OFFSET 0;",
        "browserOutputDesc": "emp_id | full_name     | salary   | projected_salary\n-------+---------------+----------+------------------\n101    | Alice Johnson | 95000.00 | 104500.00"
      }
    ]
  },
  {
    "id": "sql-aggregates",
    "chapterNumber": 4,
    "title": "SQL Aggregate Functions: GROUP BY & HAVING",
    "category": "Querying & Filtering",
    "shortDesc": "COUNT, SUM, AVG, MIN, MAX, GROUP BY multi-column, and HAVING vs WHERE comparison table.",
    "overview": [
      "Aggregate functions compute a single summary result from a set of input rows.",
      "`GROUP BY` groups rows sharing identical values in summary rows, while `HAVING` filters the resulting aggregate groups."
    ],
    "sections": [
      {
        "title": "HAVING vs WHERE Comparison Matrix",
        "theory": [
          "`WHERE` filters individual rows BEFORE aggregate calculation.",
          "`HAVING` filters groups AFTER aggregate calculation (e.g. `HAVING COUNT(*) > 5`).",
          "`COUNT(*)` counts all rows including NULLs; `COUNT(column)` counts only rows where column is NOT NULL."
        ],
        "table": [
          {
            "attribute": "WHERE",
            "value": "Row Filter",
            "description": "Filters before aggregation. Cannot reference aggregate functions like SUM() or COUNT()."
          },
          {
            "attribute": "HAVING",
            "value": "Group Filter",
            "description": "Filters after aggregation. Applied specifically to aggregate metrics like AVG() >= 50."
          },
          {
            "attribute": "COUNT(*)",
            "value": "Total Row Count",
            "description": "Returns total number of rows in the table/group including NULLs."
          },
          {
            "attribute": "AVG(column)",
            "value": "Arithmetic Mean",
            "description": "Calculates mean of non-null values. Ignores NULLs automatically."
          }
        ],
        "codeExample": "-- Department Salary Aggregations Demo\nSELECT \n    dept_id,\n    COUNT(*) AS total_employees,\n    MIN(salary) AS min_salary,\n    MAX(salary) AS max_salary,\n    ROUND(AVG(salary), 2) AS avg_salary,\n    SUM(salary) AS total_payroll\nFROM employees\nGROUP BY dept_id\nHAVING COUNT(*) >= 1 AND AVG(salary) > 60000.00\nORDER BY total_payroll DESC;",
        "browserOutputDesc": "dept_id | total_employees | min_salary | max_salary | avg_salary | total_payroll\n--------+-----------------+------------+------------+------------+--------------\n1       | 1               | 95000.00   | 95000.00   | 95000.00   | 95000.00"
      }
    ]
  },
  {
    "id": "sql-joins",
    "chapterNumber": 5,
    "title": "SQL Relational Joins: INNER, LEFT, RIGHT & FULL",
    "category": "Relational Joins",
    "shortDesc": "INNER JOIN, LEFT OUTER JOIN, RIGHT OUTER JOIN, FULL OUTER JOIN, CROSS JOIN, and SELF JOIN.",
    "overview": [
      "A JOIN clause combines rows from two or more tables based on a related common column between them.",
      "Mastering joins is the fundamental core of relational database querying."
    ],
    "sections": [
      {
        "title": "Complete Joins Matrix & Venn Diagram Logic",
        "theory": [
          "INNER JOIN: Returns rows when there is a match in BOTH tables.",
          "LEFT OUTER JOIN: Returns ALL rows from the left table, and matched rows from the right table. Unmatched right columns return NULL.",
          "RIGHT OUTER JOIN: Returns ALL rows from right table, and matched rows from left table.",
          "FULL OUTER JOIN: Returns all rows when there is a match in ONE of the tables.",
          "SELF JOIN: A table joined with itself (useful for employee/manager hierarchies or parent/child categories)."
        ],
        "table": [
          {
            "attribute": "INNER JOIN",
            "value": "Intersection (A \u2229 B)",
            "description": "Keeps only rows with matching join keys in both tables."
          },
          {
            "attribute": "LEFT JOIN",
            "value": "All A + Matched B",
            "description": "Preserves all rows from Left table. Missing right data filled with NULL."
          },
          {
            "attribute": "RIGHT JOIN",
            "value": "All B + Matched A",
            "description": "Preserves all rows from Right table. Missing left data filled with NULL."
          },
          {
            "attribute": "FULL JOIN",
            "value": "Union (A \u222a B)",
            "description": "Retains all rows from both tables. Unmatched rows padded with NULLs."
          },
          {
            "attribute": "CROSS JOIN",
            "value": "Cartesian Product",
            "description": "Combines every row of table A with every row of table B (M * N rows)."
          }
        ],
        "codeExample": "-- Demonstrating INNER JOIN and LEFT JOIN for Orphan Detection\n-- 1. INNER JOIN (Only departments with active staff)\nSELECT e.emp_id, e.full_name, d.dept_name, e.salary\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.dept_id;\n\n-- 2. LEFT JOIN to find departments with ZERO employees (Orphans)\nSELECT d.dept_id, d.dept_name\nFROM departments d\nLEFT JOIN employees e ON d.dept_id = e.dept_id\nWHERE e.emp_id IS NULL;",
        "browserOutputDesc": "emp_id | full_name     | dept_name   | salary\n-------+---------------+-------------+---------\n101    | Alice Johnson | Engineering | 95000.00\n\n(0 rows returned for orphans - Engineering has active staff)"
      }
    ]
  },
  {
    "id": "sql-subqueries-ctes",
    "chapterNumber": 6,
    "title": "SQL Subqueries & Common Table Expressions (WITH cte)",
    "category": "Advanced SQL",
    "shortDesc": "Scalar subqueries, correlated subqueries, EXISTS vs IN, and modern CTEs (WITH clause).",
    "overview": [
      "A subquery is a SQL query nested inside a larger query (such as `SELECT`, `FROM`, or `WHERE`).",
      "Common Table Expressions (CTEs), declared with the `WITH` keyword, define temporary named result sets that make complex queries readable and reusable."
    ],
    "sections": [
      {
        "title": "Correlated Subqueries vs CTEs",
        "theory": [
          "Correlated Subquery: A subquery that references columns from the outer query. It executes once for EVERY candidate row processed by the outer query.",
          "`EXISTS`: Returns `true` as soon as the first matching row is found (short-circuits). Much faster than `IN` for large datasets.",
          "CTEs (`WITH cte AS (...)`): Modern standard for breaking down monolithic multi-join queries into modular steps."
        ],
        "codeExample": "-- Modern CTE: Finding Employees Earning Above Department Average\nWITH DeptAverageSalary AS (\n    SELECT \n        dept_id, \n        AVG(salary) AS avg_dept_salary\n    FROM employees\n    GROUP BY dept_id\n)\nSELECT \n    e.emp_id,\n    e.full_name,\n    e.salary,\n    ROUND(d.avg_dept_salary, 2) AS dept_avg,\n    ROUND(e.salary - d.avg_dept_salary, 2) AS diff_from_avg\nFROM employees e\nJOIN DeptAverageSalary d ON e.dept_id = d.dept_id\nWHERE e.salary >= d.avg_dept_salary;",
        "browserOutputDesc": "emp_id | full_name     | salary   | dept_avg | diff_from_avg\n-------+---------------+----------+----------+--------------\n101    | Alice Johnson | 95000.00 | 95000.00 | 0.00"
      }
    ]
  },
  {
    "id": "sql-views-indexes",
    "chapterNumber": 7,
    "title": "SQL Views, Indexes & Performance Tuning",
    "category": "Advanced SQL",
    "shortDesc": "CREATE VIEW, B-Tree index architecture, clustered vs non-clustered indexes, and EXPLAIN query plan.",
    "overview": [
      "A View is a virtual table based on the result-set of a SQL statement. It contains no data of its own on disk.",
      "An Index is an on-disk data structure (most commonly a balanced B-Tree) that improves data retrieval speed at the cost of slower writes."
    ],
    "sections": [
      {
        "title": "B-Tree Indexing & Clustered vs Non-Clustered Table",
        "theory": [
          "Clustered Index: Dictates the physical sort order of data rows on disk. Only ONE clustered index can exist per table (automatically created on Primary Key).",
          "Non-Clustered Index: A separate B-Tree structure containing indexed column values paired with row pointers (Row IDs) pointing to actual data pages.",
          "`EXPLAIN / EXPLAIN ANALYZE`: Displays the database query execution plan (Full Table Scan vs Index Scan/Seek)."
        ],
        "table": [
          {
            "attribute": "Clustered Index",
            "value": "1 per table",
            "description": "Sorts actual data rows physically on disk. Leaf nodes are data pages."
          },
          {
            "attribute": "Non-Clustered Index",
            "value": "Multiple per table",
            "description": "Separate B-Tree. Leaf nodes contain column value + pointer to data row."
          },
          {
            "attribute": "Full Table Scan",
            "value": "O(n) Disk I/O",
            "description": "Reads every single database page on disk. Slow on large tables."
          },
          {
            "attribute": "Index Seek",
            "value": "O(log n) B-Tree",
            "description": "Traverses B-Tree root to leaf in log(n) steps. High performance."
          }
        ],
        "codeExample": "-- Creating Virtual View & Secondary B-Tree Index\nCREATE VIEW v_active_engineering_staff AS\nSELECT emp_id, full_name, email, salary\nFROM employees\nWHERE dept_id = 1;\n\n-- Create B-Tree index on email column for instant O(log n) lookups\nCREATE INDEX idx_employees_email ON employees(email);\n\n-- Query the View\nSELECT * FROM v_active_engineering_staff;",
        "browserOutputDesc": "emp_id | full_name     | email                    | salary\n-------+---------------+--------------------------+---------\n101    | Alice Johnson | alice@converterallai.com | 95000.00"
      }
    ]
  },
  {
    "id": "sql-transactions",
    "chapterNumber": 8,
    "title": "SQL Transactions, ACID & Isolation Levels",
    "category": "Persistence & Architecture",
    "shortDesc": "BEGIN, COMMIT, ROLLBACK, SAVEPOINT, ACID properties, and ANSI transaction isolation levels.",
    "overview": [
      "A transaction is a single logical unit of work consisting of one or more SQL operations.",
      "Transactions guarantee database reliability through ACID properties: Atomicity, Consistency, Isolation, and Durability."
    ],
    "sections": [
      {
        "title": "ACID Properties & Isolation Levels Table",
        "theory": [
          "Atomicity: All-or-nothing. If any operation fails, the entire transaction rolls back.",
          "Consistency: Database transitions only between valid states satisfying all schema constraints.",
          "Isolation: Concurrent transactions execute without cross-transaction interference.",
          "Durability: Once committed, data persists permanently on non-volatile disk storage even during power failure."
        ],
        "table": [
          {
            "attribute": "Read Uncommitted",
            "value": "Lowest Isolation",
            "description": "Allows Dirty Reads (reading uncommitted changes of other transactions)."
          },
          {
            "attribute": "Read Committed",
            "value": "Standard Default",
            "description": "Prevents dirty reads. Only reads committed data. Allows Non-Repeatable Reads."
          },
          {
            "attribute": "Repeatable Read",
            "value": "Snapshot Guarantee",
            "description": "Guarantees re-reading a row yields identical values. Prevents non-repeatable reads."
          },
          {
            "attribute": "Serializable",
            "value": "Strict Serial",
            "description": "Highest isolation. Transactions execute as if sequentially ordered. Prevents Phantoms."
          }
        ],
        "codeExample": "-- Financial Transfer Transaction Demo\nBEGIN TRANSACTION;\n\n-- 1. Deduct $500 from Account A\nUPDATE accounts \nSET balance = balance - 500.00 \nWHERE account_id = 'ACC_1001';\n\n-- 2. Credit $500 to Account B\nUPDATE accounts \nSET balance = balance + 500.00 \nWHERE account_id = 'ACC_2002';\n\n-- 3. If both succeed, commit atomically:\nCOMMIT;\n-- (If any error occurred: ROLLBACK;)",
        "browserOutputDesc": "Transaction committed: $500 transferred from ACC_1001 to ACC_2002 atomically."
      }
    ]
  },
  {
    "id": "sql-interviews",
    "chapterNumber": 9,
    "title": "Top 100 SQL Interview Questions & Query Problems",
    "category": "Interview Preparation",
    "shortDesc": "Frequently asked SQL interview queries: Nth highest salary, delete duplicate records, window functions, and speaking points.",
    "overview": [
      "SQL interviews test your ability to write clean, performant queries for complex analytical questions.",
      "Review these classic interview query patterns and theoretical speaking points before your technical interview."
    ],
    "sections": [
      {
        "title": "Classic Interview Query Patterns & Speaking Points",
        "theory": [
          "Q1: How do you find the Nth highest salary in SQL?",
          "Speaking Point: In modern SQL, use the `DENSE_RANK()` window function partitioned or ordered by salary descending, or use `LIMIT 1 OFFSET (N-1)`.",
          "----------------------------------------",
          "Q2: How do you delete duplicate records from a table while keeping the lowest ID?",
          "Speaking Point: Join the table with itself (`t1.email = t2.email AND t1.id > t2.id`) and delete `t1`, or use a CTE with `ROW_NUMBER() OVER(PARTITION BY email ORDER BY id)` and delete where `row_num > 1`."
        ],
        "codeExample": "-- 1. Finding 2nd Highest Salary using Subquery\nSELECT MAX(salary) AS second_highest_salary\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);\n\n-- 2. Modern Window Function: DENSE_RANK()\nWITH RankedSalaries AS (\n    SELECT \n        emp_id,\n        full_name,\n        salary,\n        DENSE_RANK() OVER (ORDER BY salary DESC) AS salary_rank\n    FROM employees\n)\nSELECT emp_id, full_name, salary \nFROM RankedSalaries \nWHERE salary_rank = 2;",
        "browserOutputDesc": "second_highest_salary: 95000.00\nemp_id | full_name | salary | salary_rank\n-------+-----------+--------+------------\n(Ranked salary result displayed)"
      }
    ]
  }
];

export const ALL_RICH_SQL_TOPICS: W3TopicItem[] = [
  {
    "id": "sec-fundamentals",
    "name": "Database Fundamentals",
    "isHeader": true,
    "chapterRefId": "sql-overview"
  },
  {
    "id": "sql-overview-topic",
    "name": "1. SQL Overview & RDBMS",
    "chapterRefId": "sql-overview",
    "hasArrow": true
  },
  {
    "id": "sql-ddl-topic",
    "name": "2. DDL & DML Operations",
    "chapterRefId": "sql-ddl-dml",
    "hasArrow": true
  },
  {
    "id": "sec-querying",
    "name": "Querying & Filtering",
    "isHeader": true,
    "chapterRefId": "sql-queries"
  },
  {
    "id": "sql-queries-topic",
    "name": "3. SELECT, WHERE, ORDER & LIMIT",
    "chapterRefId": "sql-queries",
    "hasArrow": true
  },
  {
    "id": "sql-aggregates-topic",
    "name": "4. Aggregates: GROUP BY & HAVING",
    "chapterRefId": "sql-aggregates",
    "hasArrow": true
  },
  {
    "id": "sec-joins",
    "name": "Relational Joins",
    "isHeader": true,
    "chapterRefId": "sql-joins"
  },
  {
    "id": "sql-joins-topic",
    "name": "5. Relational Joins (INNER, LEFT, FULL)",
    "chapterRefId": "sql-joins",
    "hasArrow": true
  },
  {
    "id": "sec-advanced",
    "name": "Advanced SQL & Tuning",
    "isHeader": true,
    "chapterRefId": "sql-subqueries-ctes"
  },
  {
    "id": "sql-subqueries-topic",
    "name": "6. Subqueries & CTEs (WITH)",
    "chapterRefId": "sql-subqueries-ctes",
    "hasArrow": true
  },
  {
    "id": "sql-views-topic",
    "name": "7. Views & B-Tree Indexing",
    "chapterRefId": "sql-views-indexes",
    "hasArrow": true
  },
  {
    "id": "sec-architecture",
    "name": "Transactions & ACID",
    "isHeader": true,
    "chapterRefId": "sql-transactions"
  },
  {
    "id": "sql-trans-topic",
    "name": "8. Transactions & Isolation Levels",
    "chapterRefId": "sql-transactions",
    "hasArrow": true
  },
  {
    "id": "sec-interview",
    "name": "Interview Preparation",
    "isHeader": true,
    "chapterRefId": "sql-interviews"
  },
  {
    "id": "sql-interview-topic",
    "name": "9. Top 100 SQL Interview Q&A",
    "chapterRefId": "sql-interviews",
    "hasArrow": true
  }
];
