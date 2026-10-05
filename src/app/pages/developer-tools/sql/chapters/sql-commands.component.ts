import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-commands',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <!-- Header -->
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Architecture</span>
          <span class="badge-slides">PPT Slides 5 - 8</span>
        </div>
        <h1 class="chapter-title">2. SQL Commands, Operators &amp; Expressions</h1>
        <p class="chapter-subtitle">
          Understand the 5 primary SQL command classifications (DDL, DML, DQL, DCL, TCL), SQL operators (Arithmetic, Comparison, Logical), and SQL Expression types.
        </p>
      </div>

      <!-- Section 1: Types of SQL Commands -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">2.1</span> The 5 Types of SQL Commands
        </h2>
        <p class="section-text">
          SQL categorizes its commands based on the functional operations they perform on the database schema and storage:
        </p>

        <div class="table-responsive">
          <table class="styled-matrix-table">
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Core Statements</th>
                <th>Primary Purpose &amp; Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span class="group-badge ddl-badge">DDL</span>
                  <strong>Data Definition Language</strong>
                </td>
                <td><code>CREATE</code>, <code>ALTER</code>, <code>DROP</code>, <code>TRUNCATE</code></td>
                <td>Defines database schema structures. Creates, alters, or drops physical tables and indexes (no data rows).</td>
              </tr>
              <tr>
                <td>
                  <span class="group-badge dml-badge">DML</span>
                  <strong>Data Manipulation Language</strong>
                </td>
                <td><code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code></td>
                <td>Modifies the actual data stored inside tables. Can be committed or rolled back in transactions.</td>
              </tr>
              <tr>
                <td>
                  <span class="group-badge dql-badge">DQL</span>
                  <strong>Data Query Language</strong>
                </td>
                <td><code>SELECT</code>, <code>SHOW</code>, <code>HELP</code></td>
                <td>Retrieves data and extracts insight from tables based on predicates, filters, and projections.</td>
              </tr>
              <tr>
                <td>
                  <span class="group-badge dcl-badge">DCL</span>
                  <strong>Data Control Language</strong>
                </td>
                <td><code>GRANT</code>, <code>REVOKE</code></td>
                <td>Controls user access rights, privileges, and table authorization policies across databases.</td>
              </tr>
              <tr>
                <td>
                  <span class="group-badge tcl-badge">TCL</span>
                  <strong>Transaction Control Language</strong>
                </td>
                <td><code>COMMIT</code>, <code>ROLLBACK</code>, <code>SAVEPOINT</code></td>
                <td>Manages transaction safety and durability (ACID principles), committing or reversing DML updates.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Section 2: Operators in SQL -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">2.2</span> Operators in SQL (Slide 6)
        </h2>
        <p class="section-text">
          An <strong>operator</strong> is a reserved character or keyword used in SQL statements to evaluate predicates. They are predominantly utilized inside the <code>WHERE</code> clause to formulate filtering criteria.
        </p>

        <div class="operators-grid">
          <!-- Arithmetic -->
          <div class="op-card">
            <div class="op-card-header">
              <span class="op-type-icon">➕</span>
              <h3>1. Arithmetic Operators</h3>
            </div>
            <div class="op-symbols"><code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code></div>
            <p>Performs mathematical operations on numerical columns or literal expressions.</p>
            <app-sql-code-box
              code="SELECT (salary * 0.10) AS bonus_amount, (salary + 500) AS incremented_salary FROM employees;"
              title="Arithmetic Operators in SELECT"
            ></app-sql-code-box>
          </div>

          <!-- Comparison -->
          <div class="op-card">
            <div class="op-card-header">
              <span class="op-type-icon">⚖️</span>
              <h3>2. Comparison Operators</h3>
            </div>
            <div class="op-symbols"><code>&lt;</code>, <code>&gt;</code>, <code>=</code>, <code>!=</code>, <code>&lt;=</code>, <code>&gt;=</code>, <code>&lt;&gt;</code></div>
            <p>Compares two expressions. Returns boolean <code>TRUE</code>, <code>FALSE</code>, or <code>UNKNOWN</code> (NULL).</p>
            <app-sql-code-box
              code="SELECT name, salary FROM employees WHERE salary >= 30000;"
              title="Comparison Operator Demo"
            ></app-sql-code-box>
          </div>

          <!-- Logical -->
          <div class="op-card">
            <div class="op-card-header">
              <span class="op-type-icon">🔀</span>
              <h3>3. Logical Operators</h3>
            </div>
            <div class="op-symbols">
              <code>AND</code>, <code>OR</code>, <code>NOT</code>, <code>BETWEEN</code>, <code>IN</code>, <code>ANY</code>, <code>ALL</code>, <code>LIKE</code>
            </div>
            <p>Combines multiple conditions or tests for range, set membership, or pattern matching.</p>
            <app-sql-code-box
              code="SELECT name, city FROM employees WHERE city = 'Mumbai' AND salary > 20000;"
              title="Logical AND Operator Demo"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Section 3: Expressions in SQL -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">2.3</span> Expressions in SQL (Slides 7 - 8)
        </h2>
        <p class="section-text">
          An <strong>expression</strong> is a combination of one or more values, operators, and SQL functions evaluated by the database engine. SQL expressions resemble mathematical formulas:
        </p>

        <div class="expression-types">
          <!-- 1. Boolean Expression -->
          <div class="expr-box">
            <h3>1. Boolean Expression</h3>
            <p>Fetches data based on matching a condition or comparing a single value.</p>
            <div class="syntax-badge">Syntax: <code>SELECT columns FROM table_name WHERE SINGLE_VALUE_EXPRESSION;</code></div>
            <app-sql-code-box
              title="Boolean Expression Example (Slide 7)"
              code="SELECT * FROM employees WHERE salary = 40000;"
              output="+----+------+------+--------+---------+-------------+
| id | name | city | salary | dept_no | designation |
+----+------+------+--------+---------+-------------+
|  2 | John | Pune |  40000 |       5 | HR          |
+----+------+------+--------+---------+-------------+
1 row in set (0.001 sec)"
            ></app-sql-code-box>
          </div>

          <!-- 2. Numeric Expression -->
          <div class="expr-box">
            <h3>2. Numeric Expression</h3>
            <p>Performs mathematical operations on numbers or fields within any SQL query.</p>
            <div class="syntax-badge">Syntax: <code>SELECT numerical_expression AS OPERATION_NAME [FROM table_name WHERE condition];</code></div>
            <app-sql-code-box
              title="Numeric Expression Example (Slide 7)"
              code="SELECT (15 + 6) AS ADDITION;"
              output="+----------+
| ADDITION |
+----------+
|       21 |
+----------+
1 row in set (0.000 sec)"
            ></app-sql-code-box>
          </div>

          <!-- 3. Date Expression -->
          <div class="expr-box">
            <h3>3. Date Expression</h3>
            <p>Returns system date, time values, and timestamps dynamically.</p>
            <div class="syntax-badge">Syntax: <code>SELECT CURRENT_TIMESTAMP;</code></div>
            <app-sql-code-box
              title="Date Expression Example (Slide 8)"
              code="SELECT CURRENT_TIMESTAMP AS current_time_val;"
              output="MariaDB [customer]> select current_timestamp;
+---------------------+
| current_timestamp   |
+---------------------+
| 2026-10-02 15:45:54 |
+---------------------+
1 row in set (0.007 sec)"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/intro" class="nav-btn prev-btn">
          ← 1. Introduction &amp; RDBMS Basics
        </a>
        <a routerLink="/developer-tools/sql/data-types" class="nav-btn next-btn">
          Next: 3. Data Types in SQL →
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
    .group-badge { display: inline-block; padding: 2px 8px; border-radius: 6px; font-weight: 700; font-size: 0.78rem; margin-right: 8px; font-family: monospace; }
    .ddl-badge { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); }
    .dml-badge { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); }
    .dql-badge { background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); }
    .dcl-badge { background: rgba(236, 72, 153, 0.2); color: #f472b6; border: 1px solid rgba(236, 72, 153, 0.4); }
    .tcl-badge { background: rgba(139, 92, 246, 0.2); color: #c084fc; border: 1px solid rgba(139, 92, 246, 0.4); }

    .operators-grid { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem; }
    .op-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 14px; padding: 1.5rem; }
    .op-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem; }
    .op-type-icon { font-size: 1.4rem; }
    .op-card h3 { font-size: 1.1rem; color: #ffffff; margin: 0; }
    .op-symbols { margin-bottom: 0.75rem; }
    .op-symbols code { background: rgba(0, 0, 0, 0.4); color: #38bdf8; padding: 3px 8px; border-radius: 6px; font-size: 0.85rem; font-family: monospace; }
    .op-card p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.75rem; }

    .expression-types { display: flex; flex-direction: column; gap: 1.5rem; }
    .expr-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px; padding: 1.5rem; }
    .expr-box h3 { color: #f1f5f9; font-size: 1.1rem; margin: 0 0 0.5rem 0; }
    .expr-box p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.75rem; }
    .syntax-badge { background: rgba(124, 58, 237, 0.1); border: 1px solid rgba(124, 58, 237, 0.25); border-radius: 8px; padding: 6px 12px; font-size: 0.82rem; color: #c084fc; margin-bottom: 0.75rem; display: inline-block; font-family: monospace; }

    .chapter-nav-footer { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .nav-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .prev-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
    .prev-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .next-btn { background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55); }
  `]
})
export class SqlCommandsComponent {}
