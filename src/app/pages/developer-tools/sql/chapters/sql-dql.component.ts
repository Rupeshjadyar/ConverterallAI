import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-dql',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Querying &amp; Filtering</span>
          <span class="badge-slides">PPT Slides 31 - 46</span>
        </div>
        <h1 class="chapter-title">7. Data Query Language (DQL), Filtering &amp; Sorting</h1>
        <p class="chapter-subtitle">
          Master the full spectrum of SQL data retrieval: SELECT, DISTINCT, WHERE filtering with Arithmetic, Comparison, AND/OR/NOT, BETWEEN, IN, LIKE wildcards (% and _), NULL tests, LIMIT, ORDER BY, and Column Aliases.
        </p>
      </div>

      <!-- 1. SELECT & DISTINCT -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">7.1</span> The SELECT Statement &amp; DISTINCT (Slides 31 - 32)
        </h2>
        <p class="section-text">
          <strong>DQL (Data Query Language)</strong> relies on the <code>SELECT</code> command to retrieve records. The returned dataset is stored in a temporary structure termed the <strong>result-set table</strong>.
        </p>

        <div class="two-col-grid">
          <div class="feature-box">
            <h4>Select All Columns (<code>*</code>)</h4>
            <div class="syntax-badge">Syntax: <code>SELECT * FROM table_name;</code></div>
            <app-sql-code-box
              code="SELECT * FROM students;"
              title="Select All"
            ></app-sql-code-box>
          </div>

          <div class="feature-box">
            <h4>Select Specific Attributes (Columns)</h4>
            <div class="syntax-badge">Syntax: <code>SELECT col1, col2 FROM table_name;</code></div>
            <app-sql-code-box
              code="SELECT name, age FROM students;"
              title="Select Specific Attributes"
            ></app-sql-code-box>
          </div>
        </div>

        <div class="sub-topic mt-4">
          <h3 class="topic-title">The <code>SELECT DISTINCT</code> Command (Slide 32)</h3>
          <p class="section-text">
            Returns only unique values by eliminating duplicate entries in the result set.
          </p>
          <app-sql-code-box
            title="SELECT DISTINCT Example (Slide 32)"
            code="SELECT DISTINCT city FROM employees;"
            output="+-----------+
| city      |
+-----------+
| Thane     |
| Pune      |
| Nagpur    |
| Mumbai    |
| Delhi     |
| Bangalore |
+-----------+
6 rows in set (0.001 sec)"
          ></app-sql-code-box>
        </div>
      </section>

      <!-- 2. WHERE Clause & Operators -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">7.2</span> The WHERE Clause &amp; Comparison Operators (Slides 33 - 34)
        </h2>
        <p class="section-text">
          The <code>WHERE</code> clause extracts only those rows that fulfill a specified predicate. It can be used in <code>SELECT</code>, <code>UPDATE</code>, and <code>DELETE</code>.
        </p>

        <app-sql-code-box
          title="WHERE Clause with Comparison (Slide 33)"
          code="SELECT id, name, salary FROM employees WHERE salary > 20000;"
        ></app-sql-code-box>

        <div class="operators-table-grid">
          <div class="table-wrap">
            <h4>Where Clause with Arithmetic Operators</h4>
            <table class="simple-table">
              <thead><tr><th>Operator</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>+</code></td><td>Addition</td></tr>
                <tr><td><code>-</code></td><td>Subtraction</td></tr>
                <tr><td><code>*</code></td><td>Multiply</td></tr>
                <tr><td><code>/</code></td><td>Division</td></tr>
                <tr><td><code>%</code></td><td>Modulo (Remainder)</td></tr>
              </tbody>
            </table>
          </div>

          <div class="table-wrap">
            <h4>Where Clause with Comparison Operators</h4>
            <table class="simple-table">
              <thead><tr><th>Operator</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><code>&lt;</code></td><td>Less Than</td></tr>
                <tr><td><code>&gt;</code></td><td>Greater Than</td></tr>
                <tr><td><code>=</code></td><td>Equal To</td></tr>
                <tr><td><code>&lt;=</code></td><td>Less Than Or Equal To</td></tr>
                <tr><td><code>&gt;=</code></td><td>Greater Than Or Equal To</td></tr>
                <tr><td><code>!=</code> or <code>&lt;&gt;</code></td><td>Not Equal To</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- 3. Logical Operators: AND, OR, NOT -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">7.3</span> Logical Operators: AND, OR, NOT (Slides 35 - 38)
        </h2>

        <div class="logical-cards">
          <!-- AND -->
          <div class="log-card">
            <h4>1. AND Operator (Slide 36)</h4>
            <p>Returns <code>TRUE</code> only when <strong>both</strong> conditions evaluate to TRUE; returns FALSE if either condition is FALSE.</p>
            <app-sql-code-box
              title="AND Operator Example (Slide 36)"
              code="SELECT name, city, age
FROM employees
WHERE age >= 24 AND age <= 28;"
            ></app-sql-code-box>
          </div>

          <!-- OR -->
          <div class="log-card">
            <h4>2. OR Operator (Slide 37)</h4>
            <p>Returns <code>TRUE</code> if <strong>either</strong> condition is TRUE; returns FALSE only when both are FALSE.</p>
            <app-sql-code-box
              title="OR Operator Example (Slide 37)"
              code="SELECT name, city, designation
FROM employees
WHERE city = 'Pune' OR city = 'Mumbai';"
            ></app-sql-code-box>
          </div>

          <!-- NOT -->
          <div class="log-card">
            <h4>3. NOT Operator (Slide 38)</h4>
            <p>Inverts the result of a boolean expression (reverses truth value).</p>
            <app-sql-code-box
              title="NOT Operator Example (Slide 38)"
              code="SELECT name, city
FROM employees
WHERE NOT city = 'Mumbai';"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- 4. BETWEEN & IN Operators -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">7.4</span> Range (BETWEEN) &amp; Membership (IN) (Slides 39 - 40)
        </h2>

        <div class="two-col-grid">
          <div class="feature-box">
            <h4>BETWEEN &amp; NOT BETWEEN (Slide 39)</h4>
            <p>Tests whether a value falls within an inclusive numerical, date, or text range.</p>
            <app-sql-code-box
              title="BETWEEN and NOT BETWEEN Examples"
              code="-- Inclusive range between 25000 and 40000
SELECT * FROM employees WHERE salary BETWEEN 25000 AND 40000;

-- Outside range
SELECT * FROM employees WHERE salary NOT BETWEEN 25000 AND 40000;"
            ></app-sql-code-box>
          </div>

          <div class="feature-box">
            <h4>IN &amp; NOT IN (Slide 40)</h4>
            <p>Checks whether a value matches any candidate in a list. Functionally equivalent to chained <code>OR</code> conditions.</p>
            <app-sql-code-box
              title="IN and NOT IN Examples"
              code="-- Matches age in list (24, 25, 27)
SELECT * FROM employees WHERE age IN (24, 25, 27);

-- Excludes values
SELECT * FROM employees WHERE age NOT IN (24, 25, 27);"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- 5. LIKE & Wildcards -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">7.5</span> LIKE Operator &amp; Wildcards (Slides 41 - 42)
        </h2>
        <p class="section-text">
          The <code>LIKE</code> operator searches for a specified pattern in a column. Two wildcard characters are used:
        </p>
        <ul class="wildcard-list">
          <li><code>%</code> (Percent sign): Represents zero, one, or multiple arbitrary characters.</li>
          <li><code>_</code> (Underscore): Represents exactly one single character or number.</li>
        </ul>

        <div class="table-responsive">
          <table class="styled-matrix-table">
            <thead>
              <tr>
                <th>LIKE Pattern Clause</th>
                <th>Matching Logic &amp; Description (Slide 41)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>WHERE name LIKE 'a%'</code></td><td>Finds any values that <strong>start with "a"</strong></td></tr>
              <tr><td><code>WHERE name LIKE '%a'</code></td><td>Finds any values that <strong>end with "a"</strong></td></tr>
              <tr><td><code>WHERE name LIKE '%or%'</code></td><td>Finds any values that have <strong>"or" in any position</strong></td></tr>
              <tr><td><code>WHERE name LIKE '_r%'</code></td><td>Finds any values that have <strong>"r" in the second position</strong></td></tr>
              <tr><td><code>WHERE name LIKE 'a_%'</code></td><td>Starts with "a" and is <strong>at least 2 characters</strong> long</td></tr>
              <tr><td><code>WHERE name LIKE 'a__%'</code></td><td>Starts with "a" and is <strong>at least 3 characters</strong> long</td></tr>
              <tr><td><code>WHERE name LIKE 'a%o'</code></td><td>Starts with "a" and <strong>ends with "o"</strong></td></tr>
              <tr><td><code>WHERE name NOT LIKE 'a%'</code></td><td><strong>NOT LIKE:</strong> Values that do <em>not</em> start with "a" (Slide 42)</td></tr>
            </tbody>
          </table>
        </div>

        <app-sql-code-box
          title="LIKE & NOT LIKE Example (Slide 41-42)"
          code="SELECT id, name, city FROM employees WHERE name LIKE 'A%';"
          output="+----+-------+-------+
| id | name  | city  |
+----+-------+-------+
|  1 | Aditi | Thane |
| 100| Ankit | Delhi |
+----+-------+-------+
2 rows in set (0.001 sec)"
        ></app-sql-code-box>
      </section>

      <!-- 6. NULL, LIMIT, ORDER BY & ALIASES -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">7.6</span> NULL Values, LIMIT, ORDER BY &amp; Aliases (Slides 43 - 46)
        </h2>

        <div class="quad-grid">
          <!-- NULL -->
          <div class="quad-card">
            <h4>SQL NULL Values (Slide 43)</h4>
            <p>NULL signifies no value. Cannot be compared with <code>=</code> or <code>!=</code>. Must use <code>IS NULL</code> or <code>IS NOT NULL</code>.</p>
            <app-sql-code-box
              code="SELECT * FROM employees WHERE manager_id IS NULL;"
              title="IS NULL Check"
            ></app-sql-code-box>
          </div>

          <!-- LIMIT -->
          <div class="quad-card">
            <h4>LIMIT Command (Slide 44)</h4>
            <p>Limits number of records returned. Essential for pagination on massive tables.</p>
            <app-sql-code-box
              code="-- LIMIT offset, count (skip 3, return next 7)
SELECT * FROM employees LIMIT 3, 7;"
              title="LIMIT Offset, Count"
            ></app-sql-code-box>
          </div>

          <!-- ORDER BY -->
          <div class="quad-card">
            <h4>ORDER BY Clause (Slide 45)</h4>
            <p>Sorts result sets in ascending order (<code>ASC</code>, default) or descending (<code>DESC</code>).</p>
            <app-sql-code-box
              code="SELECT * FROM employees ORDER BY salary DESC;"
              title="ORDER BY DESC"
            ></app-sql-code-box>
          </div>

          <!-- Aliases -->
          <div class="quad-card">
            <h4>SQL Aliases (AS) (Slide 46)</h4>
            <p>Assigns temporary, readable labels to columns or tables during query execution.</p>
            <app-sql-code-box
              code="SELECT id AS emp_ID, name AS emp_name, salary AS monthly_pay FROM employees;"
              title="Column Aliases with AS"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/dml" class="nav-btn prev-btn">
          ← 6. DML (Data Manipulation Language)
        </a>
        <a routerLink="/developer-tools/sql/functions" class="nav-btn next-btn">
          Next: 8. Built-in SQL Functions →
        </a>
      </div>
    </div>
  `,
  styles: [`
    .chapter-content { display: flex; flex-direction: column; gap: 2rem; }
    .chapter-header { border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 1.5rem; }
    .chapter-meta { display: flex; gap: 8px; margin-bottom: 0.75rem; }
    .badge-cat { background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.3); color: #c084fc; padding: 3px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
    .badge-slides { background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; padding: 3px 10px; border-radius: 999px; font-size: 0.75rem; font-family: monospace; }
    .chapter-title { font-size: 2.2rem; font-weight: 800; color: #ffffff; margin: 0 0 0.5rem 0; letter-spacing: -0.02em; }
    .chapter-subtitle { color: #94a3b8; font-size: 1.05rem; line-height: 1.6; margin: 0; max-width: 820px; }

    .content-card { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 2rem; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25); }
    .section-heading { font-size: 1.35rem; color: #ffffff; margin: 0 0 1.25rem 0; display: flex; align-items: center; gap: 10px; }
    .heading-num { color: #8b5cf6; font-family: monospace; font-weight: 700; }
    .section-text { color: #cbd5e1; font-size: 0.96rem; line-height: 1.7; margin-bottom: 1.25rem; }

    .two-col-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    @media (max-width: 800px) { .two-col-grid { grid-template-columns: 1fr; } }
    .feature-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .feature-box h4 { color: #ffffff; margin: 0 0 0.5rem 0; font-size: 1rem; }
    .feature-box p { color: #94a3b8; font-size: 0.88rem; margin: 0 0 0.75rem 0; }
    .syntax-badge { background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.25); border-radius: 6px; padding: 4px 8px; font-size: 0.8rem; color: #c084fc; font-family: monospace; margin-bottom: 0.5rem; display: inline-block; }

    .operators-table-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-top: 1.25rem; }
    @media (max-width: 768px) { .operators-table-grid { grid-template-columns: 1fr; } }
    .table-wrap { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1rem; }
    .table-wrap h4 { color: #38bdf8; margin: 0 0 0.75rem 0; font-size: 0.95rem; }
    .simple-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left; }
    .simple-table th { background: rgba(255, 255, 255, 0.05); color: #c084fc; padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .simple-table td { padding: 8px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); color: #e2e8f0; }
    .simple-table code { color: #facc15; font-family: monospace; font-size: 0.9rem; }

    .logical-cards { display: flex; flex-direction: column; gap: 1.25rem; }
    .log-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .log-card h4 { color: #38bdf8; margin: 0 0 0.5rem 0; font-size: 1rem; }
    .log-card p { color: #94a3b8; font-size: 0.88rem; margin: 0 0 0.75rem 0; }

    .wildcard-list { color: #cbd5e1; font-size: 0.92rem; line-height: 1.7; padding-left: 1.5rem; margin-bottom: 1.25rem; }
    .wildcard-list code { color: #f43f5e; font-weight: 700; font-family: monospace; }

    .styled-matrix-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
    .styled-matrix-table th { background: rgba(255, 255, 255, 0.05); color: #c084fc; padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .styled-matrix-table td { padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #e2e8f0; }
    .styled-matrix-table code { color: #38bdf8; font-family: monospace; font-size: 0.88rem; }

    .quad-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    @media (max-width: 860px) { .quad-grid { grid-template-columns: 1fr; } }
    .quad-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .quad-card h4 { color: #ffffff; margin: 0 0 0.4rem 0; font-size: 1rem; }
    .quad-card p { color: #94a3b8; font-size: 0.85rem; margin: 0 0 0.75rem 0; line-height: 1.5; }

    .chapter-nav-footer { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .nav-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .prev-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
    .prev-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .next-btn { background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55); }
  `]
})
export class SqlDqlComponent {}
