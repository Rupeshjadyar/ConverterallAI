import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-joins',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Relational Operations</span>
          <span class="badge-slides">PPT Slides 88 - 96</span>
        </div>
        <h1 class="chapter-title">12. SQL Joins with Venn Visualizers</h1>
        <p class="chapter-subtitle">
          Master the mechanics of multi-table joins: INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN (via UNION in MySQL), CROSS JOIN (Cartesian Product), and hierarchical SELF JOIN.
        </p>
      </div>

      <!-- Section 1: Joins Overview & Setup Tables -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">12.1</span> The Concept of Joins &amp; Reference Datasets (Slides 88 - 90)
        </h2>
        <p class="section-text">
          A <strong>SQL JOIN</strong> statement combines rows from two or more tables based on a related column between them.
        </p>

        <!-- Base Tables Demo -->
        <div class="tables-compare-grid">
          <div class="compare-table-box">
            <h4>Table 1: <code>student1</code> (Slide 89)</h4>
            <div class="mini-table-scroll">
              <table class="mini-table">
                <thead><tr><th>roll_no (PK)</th><th>name</th><th>address</th><th>age</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>Harsh</td><td>Delhi</td><td>18</td></tr>
                  <tr><td>2</td><td>Pratik</td><td>Bihar</td><td>19</td></tr>
                  <tr><td>3</td><td>Priyanka</td><td>Siliguri</td><td>20</td></tr>
                  <tr><td>4</td><td>Deep</td><td>Ramnagar</td><td>18</td></tr>
                  <tr><td>5</td><td>Saptrahi</td><td>Kolkata</td><td>19</td></tr>
                  <tr><td>6</td><td>Dhanraj</td><td>Barabajar</td><td>20</td></tr>
                  <tr><td>7</td><td>Rohit</td><td>Balurghat</td><td>18</td></tr>
                  <tr><td>8</td><td>Niraj</td><td>Alipur</td><td>19</td></tr>
                  <tr><td>9</td><td>NULL</td><td>NULL</td><td>NULL</td></tr>
                  <tr><td>10</td><td>NULL</td><td>NULL</td><td>NULL</td></tr>
                  <tr><td>11</td><td>NULL</td><td>NULL</td><td>NULL</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="compare-table-box">
            <h4>Table 2: <code>course</code> (Slide 90)</h4>
            <div class="mini-table-scroll">
              <table class="mini-table">
                <thead><tr><th>course_id</th><th>roll_no (FK)</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>1</td></tr>
                  <tr><td>2</td><td>2</td></tr>
                  <tr><td>2</td><td>3</td></tr>
                  <tr><td>3</td><td>4</td></tr>
                  <tr><td>1</td><td>5</td></tr>
                  <tr><td>4</td><td>9</td></tr>
                  <tr><td>5</td><td>10</td></tr>
                  <tr><td>4</td><td>11</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: INNER JOIN -->
      <section class="content-card glass">
        <div class="join-header-flex">
          <div>
            <h2 class="section-heading">
              <span class="heading-num">12.2</span> 1. INNER JOIN (Slide 91)
            </h2>
            <p class="section-text">
              Selects all rows from both tables as long as the join condition is satisfied (the intersection of Table A and Table B). Unmatched records in either table are excluded.
            </p>
          </div>
          <!-- Venn Diagram: Intersection -->
          <div class="venn-box">
            <svg width="180" height="110" viewBox="0 0 200 120">
              <circle cx="70" cy="60" r="50" fill="rgba(255,255,255,0.06)" stroke="#8b5cf6" stroke-width="2"/>
              <circle cx="130" cy="60" r="50" fill="rgba(255,255,255,0.06)" stroke="#38bdf8" stroke-width="2"/>
              <!-- Intersection Clip -->
              <path d="M 100 19.5 A 50 50 0 0 1 100 100.5 A 50 50 0 0 1 100 19.5" fill="#38bdf8" opacity="0.8"/>
              <text x="45" y="65" fill="#94a3b8" font-size="12" font-family="sans-serif">Table A</text>
              <text x="125" y="65" fill="#94a3b8" font-size="12" font-family="sans-serif">Table B</text>
            </svg>
            <span class="venn-caption">Matching rows only</span>
          </div>
        </div>

        <app-sql-code-box
          title="INNER JOIN Query & Output (Slide 91)"
          code="SELECT student1.roll_no, course.course_id, student1.name, student1.age
FROM student1
INNER JOIN course ON student1.roll_no = course.roll_no;"
          output="+---------+-----------+----------+-----+
| roll_no | course_id | name     | age |
+---------+-----------+----------+-----+
|       1 |         1 | Harsh    |  18 |
|       2 |         2 | Pratik   |  19 |
|       3 |         2 | Priyanka |  20 |
|       4 |         3 | Deep     |  18 |
|       5 |         1 | Saptrahi |  19 |
|       9 |         4 | NULL     | NULL|
|      10 |         5 | NULL     | NULL|
|      11 |         4 | NULL     | NULL|
+---------+-----------+----------+-----+
8 rows in set (0.000 sec)"
        ></app-sql-code-box>
      </section>

      <!-- Section 3: LEFT JOIN -->
      <section class="content-card glass">
        <div class="join-header-flex">
          <div>
            <h2 class="section-heading">
              <span class="heading-num">12.3</span> 2. LEFT JOIN (LEFT OUTER JOIN) (Slide 92)
            </h2>
            <p class="section-text">
              Returns all rows from the <strong>left</strong> table (Table A), along with matched rows from the right table (Table B). If no match exists on the right, columns from Table B contain <code>NULL</code>.
            </p>
          </div>
          <!-- Venn Diagram: Left Full + Intersection -->
          <div class="venn-box">
            <svg width="180" height="110" viewBox="0 0 200 120">
              <circle cx="70" cy="60" r="50" fill="#8b5cf6" opacity="0.8" stroke="#8b5cf6" stroke-width="2"/>
              <circle cx="130" cy="60" r="50" fill="rgba(255,255,255,0.06)" stroke="#38bdf8" stroke-width="2"/>
              <text x="45" y="65" fill="#ffffff" font-size="12" font-family="sans-serif">Table A</text>
              <text x="125" y="65" fill="#94a3b8" font-size="12" font-family="sans-serif">Table B</text>
            </svg>
            <span class="venn-caption">All Table A + matching B</span>
          </div>
        </div>

        <app-sql-code-box
          title="LEFT JOIN Query & Output (Slide 92)"
          code="SELECT student1.roll_no, course.course_id, student1.name, student1.age
FROM student1
LEFT JOIN course ON student1.roll_no = course.roll_no;"
          output="+---------+-----------+----------+------+
| roll_no | course_id | name     | age  |
+---------+-----------+----------+------+
|       1 |         1 | Harsh    |   18 |
|       2 |         2 | Pratik   |   19 |
|       3 |         2 | Priyanka |   20 |
|       4 |         3 | Deep     |   18 |
|       5 |         1 | Saptrahi |   19 |
|       6 |      NULL | Dhanraj  |   20 |
|       7 |      NULL | Rohit    |   18 |
|       8 |      NULL | Niraj    |   19 |
|       9 |         4 | NULL     | NULL |
|      10 |         5 | NULL     | NULL |
|      11 |         4 | NULL     | NULL |
+---------+-----------+----------+------+
11 rows in set (0.001 sec)"
        ></app-sql-code-box>
      </section>

      <!-- Section 4: RIGHT JOIN -->
      <section class="content-card glass">
        <div class="join-header-flex">
          <div>
            <h2 class="section-heading">
              <span class="heading-num">12.4</span> 3. RIGHT JOIN (RIGHT OUTER JOIN) (Slide 93)
            </h2>
            <p class="section-text">
              Returns all rows from the <strong>right</strong> table (Table B), along with matched rows from the left table. If no match exists on the left side, the left columns yield <code>NULL</code>.
            </p>
          </div>
          <!-- Venn Diagram: Right Full + Intersection -->
          <div class="venn-box">
            <svg width="180" height="110" viewBox="0 0 200 120">
              <circle cx="70" cy="60" r="50" fill="rgba(255,255,255,0.06)" stroke="#8b5cf6" stroke-width="2"/>
              <circle cx="130" cy="60" r="50" fill="#38bdf8" opacity="0.8" stroke="#38bdf8" stroke-width="2"/>
              <text x="45" y="65" fill="#94a3b8" font-size="12" font-family="sans-serif">Table A</text>
              <text x="125" y="65" fill="#ffffff" font-size="12" font-family="sans-serif">Table B</text>
            </svg>
            <span class="venn-caption">All Table B + matching A</span>
          </div>
        </div>

        <app-sql-code-box
          title="RIGHT JOIN Query & Output (Slide 93)"
          code="SELECT student1.roll_no, course.course_id, student1.name, student1.age
FROM student1
RIGHT JOIN course ON student1.roll_no = course.roll_no;"
          output="+---------+-----------+----------+------+
| roll_no | course_id | name     | age  |
+---------+-----------+----------+------+
|       1 |         1 | Harsh    |   18 |
|       2 |         2 | Pratik   |   19 |
|       3 |         2 | Priyanka |   20 |
|       4 |         3 | Deep     |   18 |
|       5 |         1 | Saptrahi |   19 |
|       9 |         4 | NULL     | NULL |
|      10 |         5 | NULL     | NULL |
|      11 |         4 | NULL     | NULL |
+---------+-----------+----------+------+
8 rows in set (0.000 sec)"
        ></app-sql-code-box>
      </section>

      <!-- Section 5: FULL JOIN -->
      <section class="content-card glass">
        <div class="join-header-flex">
          <div>
            <h2 class="section-heading">
              <span class="heading-num">12.5</span> 4. FULL JOIN in MySQL using UNION (Slide 94)
            </h2>
            <p class="section-text">
              The <strong>FULL OUTER JOIN</strong> returns all rows from both tables, filling unmatched columns with NULLs. Because MySQL does not offer a native <code>FULL OUTER JOIN</code> keyword, it is implemented by taking the <code>UNION</code> of a <code>LEFT JOIN</code> and a <code>RIGHT JOIN</code>.
            </p>
          </div>
          <!-- Venn Diagram: Both Full -->
          <div class="venn-box">
            <svg width="180" height="110" viewBox="0 0 200 120">
              <circle cx="70" cy="60" r="50" fill="#8b5cf6" opacity="0.65" stroke="#8b5cf6" stroke-width="2"/>
              <circle cx="130" cy="60" r="50" fill="#38bdf8" opacity="0.65" stroke="#38bdf8" stroke-width="2"/>
              <text x="45" y="65" fill="#ffffff" font-size="12" font-family="sans-serif">Table A</text>
              <text x="125" y="65" fill="#ffffff" font-size="12" font-family="sans-serif">Table B</text>
            </svg>
            <span class="venn-caption">Union of Left &amp; Right</span>
          </div>
        </div>

        <app-sql-code-box
          title="FULL JOIN Emulation with UNION (Slide 94)"
          code="SELECT student1.roll_no, course.course_id, student1.name, student1.age
FROM student1
LEFT JOIN course ON student1.roll_no = course.roll_no
UNION
SELECT student1.roll_no, course.course_id, student1.name, student1.age
FROM student1
RIGHT JOIN course ON student1.roll_no = course.roll_no;"
          output="+---------+-----------+----------+------+
| roll_no | course_id | name     | age  |
+---------+-----------+----------+------+
|       1 |         1 | Harsh    |   18 |
|       2 |         2 | Pratik   |   19 |
|       3 |         2 | Priyanka |   20 |
|       4 |         3 | Deep     |   18 |
|       5 |         1 | Saptrahi |   19 |
|       6 |      NULL | Dhanraj  |   20 |
|       7 |      NULL | Rohit    |   18 |
|       8 |      NULL | Niraj    |   19 |
|       9 |         4 | NULL     | NULL |
|      10 |         5 | NULL     | NULL |
|      11 |         4 | NULL     | NULL |
+---------+-----------+----------+------+
11 rows in set (0.001 sec)"
        ></app-sql-code-box>
      </section>

      <!-- Section 6: CROSS JOIN & SELF JOIN -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">12.6</span> 5. CROSS JOIN &amp; 6. SELF JOIN (Slides 95 - 96)
        </h2>

        <div class="two-col-grid">
          <!-- CROSS JOIN -->
          <div class="feature-box">
            <h4>5. CROSS JOIN (Cartesian Product) (Slide 95)</h4>
            <p>
              Combines each row of the first table with <strong>every row</strong> of the second table. Total rows returned = <code>Rows(Table 1) × Rows(Table 2)</code>.
            </p>
            <app-sql-code-box
              code="SELECT course.course_id, student1.name, student1.age
FROM student1
CROSS JOIN course;"
              title="CROSS JOIN Syntax"
            ></app-sql-code-box>
          </div>

          <!-- SELF JOIN -->
          <div class="feature-box">
            <h4>6. SELF JOIN (Slide 96)</h4>
            <p>
              Joins a table to itself using <strong>table aliases</strong> (e.g. <code>e1</code> and <code>e2</code>). Perfect for hierarchical trees like employees and their managers.
            </p>
            <app-sql-code-box
              code="SELECT e1.name AS manager, e2.name AS employees
FROM employee e1
JOIN employee e2 ON e1.emp_id = e2.manager_id;"
              title="SELF JOIN Hierarchy"
              output="+---------+-----------+
| manager | employees |
+---------+-----------+
| riya    | raj       |
| riya    | aditi     |
| sejal   | riya      |
| anuj    | sejal     |
| ram     | anuj      |
| ram     | vijay     |
+---------+-----------+
6 rows in set (0.001 sec)"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/foreign-keys" class="nav-btn prev-btn">
          ← 11. Foreign Keys &amp; Integrity
        </a>
        <a routerLink="/developer-tools/sql/views" class="nav-btn next-btn">
          Next: 13. Views in SQL →
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

    .tables-compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1rem; }
    @media (max-width: 768px) { .tables-compare-grid { grid-template-columns: 1fr; } }
    .compare-table-box { background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 1rem; }
    .compare-table-box h4 { color: #38bdf8; margin: 0 0 0.75rem 0; font-size: 0.95rem; }
    .mini-table-scroll { max-height: 220px; overflow-y: auto; }
    .mini-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; font-family: monospace; text-align: left; }
    .mini-table th { padding: 6px 10px; background: rgba(255, 255, 255, 0.05); color: #c084fc; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .mini-table td { padding: 5px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); color: #f1f5f9; }

    .join-header-flex { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
    .venn-box { background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 0.75rem 1.25rem; text-align: center; }
    .venn-caption { display: block; font-size: 0.75rem; color: #94a3b8; margin-top: 4px; font-weight: 500; }

    .two-col-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    @media (max-width: 860px) { .two-col-grid { grid-template-columns: 1fr; } }
    .feature-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .feature-box h4 { color: #38bdf8; margin: 0 0 0.5rem 0; font-size: 1rem; }
    .feature-box p { color: #94a3b8; font-size: 0.88rem; margin: 0 0 0.75rem 0; }

    .chapter-nav-footer { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .nav-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .prev-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
    .prev-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .next-btn { background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55); }
  `]
})
export class SqlJoinsComponent {}
