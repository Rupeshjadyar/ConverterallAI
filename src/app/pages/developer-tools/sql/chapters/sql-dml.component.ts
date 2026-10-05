import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-dml',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Commands (DDL &amp; DML)</span>
          <span class="badge-slides">PPT Slides 26 - 30</span>
        </div>
        <h1 class="chapter-title">6. Data Modification Language (DML)</h1>
        <p class="chapter-subtitle">
          Manipulate row-level data in MySQL: INSERT INTO (explicit columns vs value list), UPDATE (bulk vs WHERE condition), DELETE (selective vs full), and the definitive DELETE vs TRUNCATE comparison.
        </p>
      </div>

      <!-- Overview -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">6.1</span> DML Command Overview (Slide 26)
        </h2>
        <p class="section-text">
          Once tables and database schemas are established using DDL statements, all data insertion, row adjustments, and record pruning are conducted via <strong>DML (Data Modification Language)</strong>.
        </p>

        <div class="table-responsive">
          <table class="styled-matrix-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>DML Command</th>
                <th>Description</th>
                <th>Sample Query</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.</td>
                <td><code>INSERT</code></td>
                <td>Inserts brand new rows into tables.</td>
                <td><code>INSERT INTO student(roll_no, name) VALUES (1, 'Anoop');</code></td>
              </tr>
              <tr>
                <td>2.</td>
                <td><code>UPDATE</code></td>
                <td>Modifies column values of existing rows in tables.</td>
                <td><code>UPDATE students SET s_name = 'Anurag' WHERE s_name = 'Anoop';</code></td>
              </tr>
              <tr>
                <td>3.</td>
                <td><code>DELETE</code></td>
                <td>Deletes specific rows or all rows from a table.</td>
                <td><code>DELETE FROM student WHERE roll_no = 1;</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- INSERT COMMAND -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">6.2</span> The INSERT INTO Command (Slide 27)
        </h2>
        <p class="section-text">
          <code>INSERT INTO</code> adds one or more tuples into an existing table. There are two primary syntaxes:
        </p>

        <div class="syntax-two-col">
          <div class="syntax-card">
            <h4>Syntax 1: Explicit Column Specification (Recommended)</h4>
            <p>Lists the target columns explicitly. The values must match the column order declared.</p>
            <div class="syntax-block">
              <code>INSERT INTO table_name (col1, col2, ... colN)<br>VALUES (val1, val2, ... valN);</code>
            </div>
            <app-sql-code-box
              title="INSERT with Columns (Slide 27)"
              code="INSERT INTO STUDENTS (ID, NAME, AGE, ADDRESS)
VALUES (101, 'PRACHITI', 25, 'THANE');"
              output="Query OK, 1 row affected (0.01 sec)"
            ></app-sql-code-box>
          </div>

          <div class="syntax-card">
            <h4>Syntax 2: Direct Values (Positional)</h4>
            <p>Omit column names when providing values for <em>all</em> columns in exact schema order.</p>
            <div class="syntax-block">
              <code>INSERT INTO table_name<br>VALUES (val1, val2, ... valN);</code>
            </div>
            <app-sql-code-box
              title="INSERT Direct Values (Slide 27)"
              code="INSERT INTO STUDENTS
VALUES (102, 'PRACHITI', 25, 'THANE');"
              output="Query OK, 1 row affected (0.01 sec)"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- UPDATE COMMAND -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">6.3</span> The UPDATE Command (Slide 28)
        </h2>
        <p class="section-text">
          The <code>UPDATE</code> statement modifies existing row values in a table. Be mindful of the <code>WHERE</code> clause: omitting it updates <strong>every row</strong> in the table!
        </p>

        <div class="update-grid">
          <div class="update-box">
            <h4>Case 1: Update All Rows (No WHERE Clause)</h4>
            <div class="syntax-block">
              <code>UPDATE table_name<br>SET col1 = expr1, col2 = expr2;</code>
            </div>
            <app-sql-code-box
              title="Update All Rows Example (Slide 28)"
              code="UPDATE STUDENTS
SET CITY = 'THANE';"
              output="Query OK, 8 rows affected (0.02 sec)
Rows matched: 8  Changed: 8  Warnings: 0"
            ></app-sql-code-box>
          </div>

          <div class="update-box">
            <h4>Case 2: Update a Particular Row (With WHERE Clause)</h4>
            <div class="syntax-block">
              <code>UPDATE table_name<br>SET col1 = expr1, col2 = expr2<br>WHERE condition;</code>
            </div>
            <app-sql-code-box
              title="Update with WHERE Example (Slide 28)"
              code="UPDATE STUDENTS
SET MARKS = 50
WHERE ID = 104;"
              output="Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- DELETE COMMAND -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">6.4</span> The DELETE Command (Slide 29)
        </h2>
        <p class="section-text">
          The <code>DELETE</code> statement removes rows from a table. Just like <code>UPDATE</code>, using it without a <code>WHERE</code> condition removes all records.
        </p>

        <app-sql-code-box
          title="DELETE Specific Row with WHERE (Slide 29)"
          code="-- Deleting a specific student record
DELETE FROM students
WHERE ID = 101;

-- Deleting all records from table
DELETE FROM students;"
          output="Query OK, 1 row affected (0.01 sec)"
        ></app-sql-code-box>
      </section>

      <!-- DELETE vs TRUNCATE -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">6.5</span> In-Depth Comparison: DELETE vs. TRUNCATE (Slide 30)
        </h2>
        <p class="section-text">
          A classic database engineering interview question: what differentiates <code>DELETE</code> from <code>TRUNCATE</code>?
        </p>

        <div class="table-responsive">
          <table class="styled-matrix-table">
            <thead>
              <tr>
                <th>Feature / Property</th>
                <th><code>DELETE</code> Statement</th>
                <th><code>TRUNCATE</code> Statement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>SQL Category</strong></td>
                <td><strong>DML</strong> (Data Manipulation Language)</td>
                <td><strong>DDL</strong> (Data Definition Language)</td>
              </tr>
              <tr>
                <td><strong>Row Filtering</strong></td>
                <td>Supports <code>WHERE</code> clause to selectively delete specific rows.</td>
                <td>Does <strong>not</strong> support <code>WHERE</code>; unconditionally wipes all rows.</td>
              </tr>
              <tr>
                <td><strong>Disk Space</strong></td>
                <td><strong>Does NOT</strong> immediately free the storage space occupied by the table.</td>
                <td><strong>Frees / deallocates</strong> the storage space back to the operating system or tablespace.</td>
              </tr>
              <tr>
                <td><strong>Auto-Increment</strong></td>
                <td>Does not reset auto-increment counter (next ID resumes after deleted IDs).</td>
                <td>Resets the auto-increment seed counter back to 1.</td>
              </tr>
              <tr>
                <td><strong>Performance &amp; Speed</strong></td>
                <td>Slower on large tables because it logs each individual row deletion in the undo log.</td>
                <td>Much faster; drops and recreates internal data pages with minimal transaction logging.</td>
              </tr>
              <tr>
                <td><strong>Transaction Rollback</strong></td>
                <td>Can be safely rolled back in an active transaction block (<code>ROLLBACK;</code>).</td>
                <td>Cannot be rolled back easily in MySQL/MariaDB (implicit commit).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/ddl" class="nav-btn prev-btn">
          ← 5. DDL (Data Definition Language)
        </a>
        <a routerLink="/developer-tools/sql/dql" class="nav-btn next-btn">
          Next: 7. DQL, Filtering &amp; Sorting →
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

    .table-responsive { overflow-x: auto; margin: 1rem 0; }
    .styled-matrix-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
    .styled-matrix-table th { background: rgba(255, 255, 255, 0.05); color: #c084fc; padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .styled-matrix-table td { padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #e2e8f0; }
    .styled-matrix-table code { color: #38bdf8; font-family: monospace; font-size: 0.88rem; }

    .syntax-two-col, .update-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    @media (max-width: 860px) { .syntax-two-col, .update-grid { grid-template-columns: 1fr; } }

    .syntax-card, .update-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .syntax-card h4, .update-box h4 { color: #ffffff; margin: 0 0 0.5rem 0; font-size: 1rem; }
    .syntax-card p, .update-box p { color: #94a3b8; font-size: 0.88rem; margin: 0 0 0.75rem 0; }
    .syntax-block { background: rgba(0, 0, 0, 0.4); padding: 8px 12px; border-radius: 8px; font-family: monospace; font-size: 0.82rem; color: #c084fc; margin-bottom: 0.75rem; border-left: 3px solid #8b5cf6; }

    .chapter-nav-footer { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .nav-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .prev-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
    .prev-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .next-btn { background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55); }
  `]
})
export class SqlDmlComponent {}
