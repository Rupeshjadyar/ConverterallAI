import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-functions',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Functions &amp; Aggregates</span>
          <span class="badge-slides">PPT Slides 47 - 59</span>
        </div>
        <h1 class="chapter-title">8. Built-in SQL Functions</h1>
        <p class="chapter-subtitle">
          Master the complete catalog of MySQL built-in functions: String manipulations, Mathematical calculations, Date &amp; Time handlers, Group Aggregates, Scalar helpers, and Conditional Logic.
        </p>
      </div>

      <!-- Overview -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">8.1</span> Function Architecture &amp; Reusability (Slide 47)
        </h2>
        <p class="section-text">
          A <strong>function</strong> in SQL is a pre-compiled set of statements that takes zero or more inputs, computes a transformation, and returns a result. Functions eliminate redundant code and empower rapid calculations directly inside query engines.
        </p>

        <div class="fn-categories-grid">
          <div class="fn-cat-card"><span>🔤</span> <strong>String Functions</strong><br><small>Text processing &amp; formatting</small></div>
          <div class="fn-cat-card"><span>📐</span> <strong>Math Functions</strong><br><small>Trig, roots, rounding &amp; modulus</small></div>
          <div class="fn-cat-card"><span>📅</span> <strong>Date Functions</strong><br><small>Timestamps, formatting &amp; diffs</small></div>
          <div class="fn-cat-card"><span>📈</span> <strong>Aggregate Functions</strong><br><small>Multi-row summarization</small></div>
        </div>
      </section>

      <!-- 1. String Functions -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">8.2</span> 1. String Functions (Slides 48 - 50)
        </h2>

        <div class="functions-catalog">
          <div class="fn-item">
            <div class="fn-top">
              <code>CONCAT(s1, s2, ...)</code>
              <span class="fn-desc">Adds two or more strings together</span>
            </div>
            <app-sql-code-box code="SELECT CONCAT('Good', ' ', 'Morning') AS greeting;" title="CONCAT Demo"></app-sql-code-box>
          </div>

          <div class="fn-item">
            <div class="fn-top">
              <code>LOWER(text) / UPPER(text)</code>
              <span class="fn-desc">Converts characters to lower or upper case</span>
            </div>
            <app-sql-code-box code="SELECT LOWER('GOOD MORNING') AS lower_text, UPPER('hello world') AS upper_text;" title="LOWER & UPPER Demo"></app-sql-code-box>
          </div>

          <div class="fn-item">
            <div class="fn-top">
              <code>REPLACE(string, old, new)</code>
              <span class="fn-desc">Replaces all occurrences of substring with replacement</span>
            </div>
            <app-sql-code-box code="SELECT REPLACE('Good Morning', 'Morning', 'Evening') AS updated_greeting;" title="REPLACE Demo"></app-sql-code-box>
          </div>

          <div class="fn-item">
            <div class="fn-top">
              <code>REVERSE(string)</code>
              <span class="fn-desc">Reverses character sequence</span>
            </div>
            <app-sql-code-box code="SELECT REVERSE('ConverterallAI') AS rev_str;" title="REVERSE Demo"></app-sql-code-box>
          </div>

          <div class="fn-item">
            <div class="fn-top">
              <code>LENGTH(string)</code>
              <span class="fn-desc">Returns count of characters including trailing spaces</span>
            </div>
            <app-sql-code-box code="SELECT name, LENGTH(name) AS len FROM employees LIMIT 3;" title="LENGTH Demo"></app-sql-code-box>
          </div>

          <div class="fn-item">
            <div class="fn-top">
              <code>SUBSTRING(string, start, length)</code>
              <span class="fn-desc">Extracts substring from 1-based start index</span>
            </div>
            <app-sql-code-box code="SELECT SUBSTRING('Good morning', 1, 4) AS extract_str;" title="SUBSTRING Demo"></app-sql-code-box>
          </div>

          <div class="fn-item">
            <div class="fn-top">
              <code>LTRIM(string) / RTRIM(string)</code>
              <span class="fn-desc">Removes leading (left) or trailing (right) spaces</span>
            </div>
            <app-sql-code-box code="SELECT LTRIM('   Hello') AS left_trimmed, RTRIM('World   ') AS right_trimmed;" title="LTRIM & RTRIM Demo"></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- 2. Math Functions -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">8.3</span> 2. Mathematical Functions (Slides 51 - 52)
        </h2>

        <div class="grid-two">
          <div class="math-card">
            <h4><code>ABS(X)</code></h4>
            <p>Absolute (positive) value of a number.</p>
            <app-sql-code-box code="SELECT ABS(-6) AS abs_val;" title="ABS"></app-sql-code-box>
          </div>

          <div class="math-card">
            <h4><code>MOD(X, Y)</code></h4>
            <p>Remainder of X divided by Y.</p>
            <app-sql-code-box code="SELECT MOD(9, 5) AS remainder;" title="MOD"></app-sql-code-box>
          </div>

          <div class="math-card">
            <h4><code>FLOOR(X) &amp; CEILING(X)</code></h4>
            <p>Floor rounds down to nearest integer; Ceiling rounds up.</p>
            <app-sql-code-box code="SELECT FLOOR(25.75) AS flr, CEILING(25.75) AS ceil;" title="FLOOR & CEIL"></app-sql-code-box>
          </div>

          <div class="math-card">
            <h4><code>TRUNCATE(X, D)</code></h4>
            <p>Truncates number X to D decimal places without rounding.</p>
            <app-sql-code-box code="SELECT TRUNCATE(123.321, 2) AS tr_pos, TRUNCATE(123.321, -1) AS tr_neg;" title="TRUNCATE"></app-sql-code-box>
          </div>

          <div class="math-card">
            <h4><code>POWER(X, Y) &amp; SQRT(X)</code></h4>
            <p>X raised to the power Y; square root of X.</p>
            <app-sql-code-box code="SELECT POWER(4, 2) AS pow_val, SQRT(144) AS sqrt_val;" title="POWER & SQRT"></app-sql-code-box>
          </div>

          <div class="math-card">
            <h4><code>EXP(X)</code></h4>
            <p>Returns <em>e</em> raised to the power of X.</p>
            <app-sql-code-box code="SELECT EXP(2) AS exp_val;" title="EXP"></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- 3. Date & Time Functions -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">8.4</span> 3. Date &amp; Time Functions (Slides 53 - 55)
        </h2>

        <div class="table-responsive">
          <table class="styled-matrix-table">
            <thead>
              <tr>
                <th>Function</th>
                <th>Return Format / Purpose</th>
                <th>Example Query</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>CURDATE()</code></td>
                <td>Current system date in <code>YYYY-MM-DD</code></td>
                <td><code>SELECT CURDATE();</code></td>
              </tr>
              <tr>
                <td><code>NOW() / SYSDATE()</code></td>
                <td>Current system date &amp; time timestamp</td>
                <td><code>SELECT NOW(), SYSDATE();</code></td>
              </tr>
              <tr>
                <td><code>LAST_DAY(date)</code></td>
                <td>Last day of the month for given date</td>
                <td><code>SELECT LAST_DAY('2026-02-14');</code></td>
              </tr>
              <tr>
                <td><code>DATE_FORMAT(date, fmt)</code></td>
                <td>Formats date e.g. <code>%b %d %Y %h:%i %p</code></td>
                <td><code>SELECT DATE_FORMAT(NOW(), '%d %b %Y');</code></td>
              </tr>
              <tr>
                <td><code>DATEDIFF(d1, d2)</code></td>
                <td>Count of days between two dates</td>
                <td><code>SELECT DATEDIFF('2026-12-31', '2026-10-02');</code></td>
              </tr>
              <tr>
                <td><code>MONTH(date) / YEAR(date)</code></td>
                <td>Extracts month (1-12) or year (1000-9999)</td>
                <td><code>SELECT MONTH(NOW()) AS m, YEAR(NOW()) AS y;</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 4. Aggregate & Comparison Functions -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">8.5</span> 4. Aggregate &amp; Comparison Functions (Slides 56 - 59)
        </h2>
        <p class="section-text">
          <strong>Aggregate functions</strong> calculate multiple values across a table column and return a single summary metric:
        </p>

        <div class="agg-cards-grid">
          <div class="agg-card">
            <h4>AVG(col)</h4>
            <p>Calculates the mathematical mean of numerical values.</p>
            <code>SELECT AVG(salary) FROM employees;</code>
          </div>
          <div class="agg-card">
            <h4>COUNT(col / *)</h4>
            <p>Counts total number of rows matching criteria.</p>
            <code>SELECT COUNT(*) FROM employees;</code>
          </div>
          <div class="agg-card">
            <h4>MAX(col) &amp; MIN(col)</h4>
            <p>Finds the highest or lowest column value.</p>
            <code>SELECT MAX(salary), MIN(salary) FROM employees;</code>
          </div>
          <div class="agg-card">
            <h4>SUM(col)</h4>
            <p>Sums all numerical column values.</p>
            <code>SELECT SUM(salary) FROM employees;</code>
          </div>
        </div>

        <div class="sub-topic mt-4">
          <h3 class="topic-title">Comparison &amp; Flow Control (Slide 59)</h3>
          <ul class="styled-list">
            <li><code>ISNULL(expr)</code>: Returns 1 if expression is NULL, else 0.</li>
            <li><code>GREATEST(v1, v2, ...)</code> / <code>LEAST(v1, v2, ...)</code>: Returns largest or smallest among arguments.</li>
            <li><code>IF(expr1, expr2, expr3)</code>: Ternary evaluator. If <em>expr1</em> is TRUE returns <em>expr2</em>; otherwise returns <em>expr3</em>.</li>
          </ul>
          <app-sql-code-box
            code="SELECT IF(20 > 10, 'yes', 'no') AS comparison_test, GREATEST(12, 1, 45, 14) AS max_arg;"
            title="Conditional IF & GREATEST"
          ></app-sql-code-box>
        </div>
      </section>

      <!-- Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/dql" class="nav-btn prev-btn">
          ← 7. DQL, Filtering &amp; Sorting
        </a>
        <a routerLink="/developer-tools/sql/group-by" class="nav-btn next-btn">
          Next: 9. GROUP BY &amp; HAVING Clauses →
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

    .fn-categories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem; }
    .fn-cat-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 12px; padding: 1.25rem; text-align: center; }
    .fn-cat-card span { font-size: 1.8rem; display: block; margin-bottom: 0.5rem; }
    .fn-cat-card strong { color: #ffffff; font-size: 0.95rem; }
    .fn-cat-card small { color: #94a3b8; font-size: 0.8rem; }

    .functions-catalog { display: flex; flex-direction: column; gap: 1.25rem; }
    .fn-item { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .fn-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 8px; }
    .fn-top code { color: #38bdf8; font-size: 0.95rem; font-family: monospace; font-weight: 600; }
    .fn-desc { color: #94a3b8; font-size: 0.85rem; }

    .grid-two { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    @media (max-width: 768px) { .grid-two { grid-template-columns: 1fr; } }
    .math-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .math-card h4 { margin: 0 0 0.4rem 0; color: #38bdf8; font-size: 0.95rem; font-family: monospace; }
    .math-card p { color: #94a3b8; font-size: 0.85rem; margin: 0 0 0.75rem 0; }

    .table-responsive { overflow-x: auto; margin: 1rem 0; }
    .styled-matrix-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
    .styled-matrix-table th { background: rgba(255, 255, 255, 0.05); color: #c084fc; padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .styled-matrix-table td { padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #e2e8f0; }
    .styled-matrix-table code { color: #38bdf8; font-family: monospace; font-size: 0.88rem; }

    .agg-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin: 1rem 0; }
    .agg-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 12px; padding: 1.25rem; }
    .agg-card h4 { color: #facc15; margin: 0 0 0.4rem 0; font-family: monospace; }
    .agg-card p { color: #94a3b8; font-size: 0.85rem; margin: 0 0 0.75rem 0; }
    .agg-card code { background: rgba(0, 0, 0, 0.35); padding: 4px 8px; border-radius: 4px; font-size: 0.78rem; color: #c084fc; display: block; }

    .sub-topic { margin-top: 1.5rem; }
    .topic-title { font-size: 1.1rem; color: #ffffff; margin-bottom: 0.75rem; }
    .styled-list { color: #cbd5e1; font-size: 0.92rem; line-height: 1.8; padding-left: 1.25rem; margin-bottom: 1rem; }
    .styled-list code { color: #38bdf8; font-family: monospace; }

    .chapter-nav-footer { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .nav-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .prev-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
    .prev-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .next-btn { background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55); }
  `]
})
export class SqlFunctionsComponent {}
