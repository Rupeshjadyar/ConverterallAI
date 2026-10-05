import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-group-by',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Querying &amp; Aggregates</span>
          <span class="badge-slides">PPT Slides 60 - 65</span>
        </div>
        <h1 class="chapter-title">9. GROUP BY &amp; HAVING Clauses</h1>
        <p class="chapter-subtitle">
          Master data aggregation and group filtering: GROUP BY rules, single and multi-column grouping, aggregate functions (COUNT, SUM, MIN, MAX), and the critical difference between WHERE and HAVING.
        </p>
      </div>

      <!-- Section 1: GROUP BY Concept & Placement Rules -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">9.1</span> The GROUP BY Statement (Slide 60)
        </h2>
        <p class="section-text">
          The <code>GROUP BY</code> statement collates individual rows with matching values across specified columns into summary rows (e.g. "find total salary by department" or "count of employees per city").
        </p>

        <div class="rules-card">
          <h4>3 Golden Rules of Query Clause Order:</h4>
          <ol class="ordered-rules">
            <li><strong>SELECT with GROUP BY:</strong> The columns listed in SELECT must either appear in the GROUP BY clause or be enclosed inside an aggregate function.</li>
            <li><strong>WHERE before GROUP BY:</strong> The <code>WHERE</code> clause is always placed <em>before</em> <code>GROUP BY</code> to filter out raw rows prior to aggregation.</li>
            <li><strong>ORDER BY after GROUP BY:</strong> The <code>ORDER BY</code> clause is always placed <em>after</em> <code>GROUP BY</code> (and after <code>HAVING</code>) to sort the aggregated output.</li>
          </ol>
        </div>

        <div class="syntax-banner">
          <code>SELECT column1, aggregate_function(column2)<br>FROM table_name<br>WHERE condition<br>GROUP BY column1, column2<br>ORDER BY column_name [ASC|DESC];</code>
        </div>
      </section>

      <!-- Section 2: Group By Examples -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">9.2</span> Group By with Aggregate Functions (Slides 61 - 63)
        </h2>

        <div class="examples-grid">
          <!-- Count -->
          <div class="example-item">
            <h4>1. GROUP BY with COUNT() (Slide 61)</h4>
            <p>Counts total employees located in each distinct city.</p>
            <app-sql-code-box
              title="GROUP BY with COUNT()"
              code="SELECT city, COUNT(name) AS total_employees
FROM employees
GROUP BY city;"
              output="+-----------+-----------------+
| city      | total_employees |
+-----------+-----------------+
| Thane     |               2 |
| Pune      |               2 |
| Nagpur    |               2 |
| Mumbai    |               3 |
| Delhi     |               2 |
| Bangalore |               1 |
+-----------+-----------------+
6 rows in set (0.001 sec)"
            ></app-sql-code-box>
          </div>

          <!-- Sum -->
          <div class="example-item">
            <h4>2. GROUP BY with SUM() (Slide 61)</h4>
            <p>Calculates the combined payroll expenditure per city.</p>
            <app-sql-code-box
              title="GROUP BY with SUM()"
              code="SELECT city, SUM(salary) AS total_payroll
FROM emp_info
GROUP BY city;"
              output="+--------+---------------+
| city   | total_payroll |
+--------+---------------+
| Thane  |         15000 |
| Pune   |         44000 |
| Mumbai |         25000 |
| Nagpur |          7000 |
| Jaipur |         10000 |
+--------+---------------+
5 rows in set (0.001 sec)"
            ></app-sql-code-box>
          </div>

          <!-- Multiple columns -->
          <div class="example-item full-width">
            <h4>3. GROUP BY Multiple Columns (Slide 62)</h4>
            <p>
              Grouping by <code>age, city</code> treats a row as unique if either age or city differs. If both age and city match, they are merged into one group.
            </p>
            <app-sql-code-box
              title="Multi-column GROUP BY"
              code="SELECT age, city, COUNT(*) AS count
FROM emp_info
GROUP BY age, city;"
              output="+-----+--------+-------+
| age | city   | count |
+-----+--------+-------+
|  24 | Pune   |     1 |
|  24 | Jaipur |     1 |
|  25 | Thane  |     2 |
|  27 | Mumbai |     1 |
|  28 | Nagpur |     1 |
|  28 | Pune   |     1 |
|  28 | Mumbai |     1 |
+-----+--------+-------+
7 rows in set (0.001 sec)"
            ></app-sql-code-box>
          </div>

          <!-- MIN and MAX -->
          <div class="example-item">
            <h4>4. GROUP BY with MIN() (Slide 63)</h4>
            <app-sql-code-box
              code="SELECT dept_no, MIN(salary) AS min_sal FROM employees GROUP BY dept_no;"
              title="MIN() by Dept"
            ></app-sql-code-box>
          </div>

          <div class="example-item">
            <h4>5. GROUP BY with MAX() (Slide 63)</h4>
            <app-sql-code-box
              code="SELECT dept_no, MAX(salary) AS max_sal FROM employees GROUP BY dept_no;"
              title="MAX() by Dept"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Section 3: HAVING Clause -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">9.3</span> The HAVING Clause vs. WHERE (Slides 64 - 65)
        </h2>
        <p class="section-text">
          Because aggregate functions (<code>SUM</code>, <code>AVG</code>, <code>COUNT</code>, etc.) cannot be evaluated in the <code>WHERE</code> clause, SQL provides the <strong>HAVING</strong> clause to filter groups after aggregation has completed.
        </p>

        <div class="diff-card">
          <div class="diff-side">
            <h4><code>WHERE</code> Clause</h4>
            <p>Filters raw individual rows <strong>before</strong> any grouping takes place. Cannot contain aggregate functions.</p>
          </div>
          <div class="diff-divider">VS</div>
          <div class="diff-side">
            <h4><code>HAVING</code> Clause</h4>
            <p>Filters summary groups <strong>after</strong> aggregation takes place. Designed specifically for aggregate conditions.</p>
          </div>
        </div>

        <h3 class="sub-heading mt-4">Practical HAVING Queries from Slide 65:</h3>
        <div class="having-grid">
          <div class="having-box">
            <h4>HAVING SUM(salary) &gt; 10000</h4>
            <app-sql-code-box
              code="SELECT designation, SUM(salary) AS total_sal
FROM emp_info
GROUP BY designation
HAVING SUM(salary) > 10000;"
            ></app-sql-code-box>
          </div>

          <div class="having-box">
            <h4>WHERE + HAVING COUNT(*) &gt; 2</h4>
            <app-sql-code-box
              code="SELECT designation, COUNT(*) AS emp_count
FROM emp_info
WHERE salary > 2000
GROUP BY designation
HAVING COUNT(*) >= 2;"
            ></app-sql-code-box>
          </div>

          <div class="having-box">
            <h4>HAVING MIN(salary) &gt; 5000</h4>
            <app-sql-code-box
              code="SELECT designation, MIN(salary) AS min_sal
FROM emp_info
GROUP BY designation
HAVING MIN(salary) > 5000;"
            ></app-sql-code-box>
          </div>

          <div class="having-box">
            <h4>HAVING MAX(salary) &gt; 5000</h4>
            <app-sql-code-box
              code="SELECT designation, MAX(salary) AS max_sal
FROM emp_info
GROUP BY designation
HAVING MAX(salary) > 5000;"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/functions" class="nav-btn prev-btn">
          ← 8. Built-in SQL Functions
        </a>
        <a routerLink="/developer-tools/sql/subqueries" class="nav-btn next-btn">
          Next: 10. Subqueries &amp; Nested Queries →
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

    .rules-card { background: rgba(255, 255, 255, 0.03); border-left: 4px solid #8b5cf6; padding: 1.25rem 1.5rem; border-radius: 0 12px 12px 0; margin-bottom: 1.25rem; }
    .rules-card h4 { color: #ffffff; margin: 0 0 0.75rem 0; font-size: 1rem; }
    .ordered-rules { color: #cbd5e1; font-size: 0.92rem; line-height: 1.8; margin: 0; padding-left: 1.25rem; }
    .ordered-rules strong { color: #38bdf8; }

    .syntax-banner { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 1rem 1.25rem; font-family: monospace; font-size: 0.88rem; color: #c084fc; line-height: 1.6; }

    .examples-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    @media (max-width: 860px) { .examples-grid { grid-template-columns: 1fr; } }
    .example-item { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .example-item.full-width { grid-column: 1 / -1; }
    .example-item h4 { color: #38bdf8; margin: 0 0 0.5rem 0; font-size: 1rem; }
    .example-item p { color: #94a3b8; font-size: 0.88rem; margin: 0 0 0.75rem 0; }

    .diff-card { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1.5rem; align-items: center; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 14px; padding: 1.5rem; margin: 1rem 0; }
    @media (max-width: 640px) { .diff-card { grid-template-columns: 1fr; } .diff-divider { margin: 0.5rem auto; } }
    .diff-side h4 { color: #facc15; margin: 0 0 0.5rem 0; font-size: 1rem; }
    .diff-side p { color: #cbd5e1; font-size: 0.88rem; line-height: 1.6; margin: 0; }
    .diff-divider { font-weight: 800; font-size: 1.1rem; color: #8b5cf6; background: rgba(139, 92, 246, 0.15); padding: 6px 12px; border-radius: 999px; }

    .sub-heading { color: #ffffff; font-size: 1.1rem; margin: 1.5rem 0 0.75rem 0; }
    .having-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    @media (max-width: 860px) { .having-grid { grid-template-columns: 1fr; } }
    .having-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .having-box h4 { color: #ffffff; margin: 0 0 0.5rem 0; font-size: 0.95rem; font-family: monospace; }

    .chapter-nav-footer { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .nav-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .prev-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
    .prev-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .next-btn { background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55); }
  `]
})
export class SqlGroupByComponent {}
