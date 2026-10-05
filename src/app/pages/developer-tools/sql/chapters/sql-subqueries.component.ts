import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-subqueries',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Advanced Querying</span>
          <span class="badge-slides">PPT Slides 66 - 82</span>
        </div>
        <h1 class="chapter-title">10. Subqueries &amp; Nested Queries</h1>
        <p class="chapter-subtitle">
          Master nested SQL logic: Subquery execution flow, guidelines, Single-Row Subqueries, Multiple-Row Subqueries (IN, ANY, ALL), Multiple-Column Subqueries, and DML with subqueries (INSERT, UPDATE, DELETE).
        </p>
      </div>

      <!-- Section 1: Subquery Rules & Execution -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">10.1</span> Subquery Concepts &amp; Core Guidelines (Slide 66)
        </h2>
        <p class="section-text">
          A <strong>subquery</strong> (also known as an <em>inner query</em> or <em>nested SELECT</em>) is a <code>SELECT</code> statement embedded within another SQL statement. The inner query executes first, and its result is supplied as dynamic input to the outer query.
        </p>

        <div class="guidelines-card">
          <h4>6 Golden Guidelines for Writing Subqueries (Slide 66):</h4>
          <ul class="guidelines-list">
            <li><strong>1. Enclose in Parentheses:</strong> Always enclose subqueries inside <code>( ... )</code>.</li>
            <li><strong>2. Position on Right:</strong> Place subqueries on the right side of the comparison operator.</li>
            <li><strong>3. No ORDER BY:</strong> Do not place an <code>ORDER BY</code> clause inside the subquery (unless using TOP/LIMIT).</li>
            <li><strong>4. Single-Row Operators:</strong> Use <code>=</code>, <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code>, <code>&lt;&gt;</code> with queries returning one row.</li>
            <li><strong>5. Multi-Row Operators:</strong> Use <code>IN</code>, <code>ANY</code>, <code>ALL</code> when the subquery can return multiple records.</li>
            <li><strong>6. Nesting Depth:</strong> Subqueries can be nested inside other subqueries without issue.</li>
          </ul>
        </div>
      </section>

      <!-- Section 2: Single-Row Subqueries with Practical Problems -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">10.2</span> Single-Row Subqueries (Slides 67 - 71)
        </h2>
        <p class="section-text">
          Returns exactly one row (single value) from the inner SELECT statement.
        </p>

        <div class="problems-stack">
          <!-- Problem 0 -->
          <div class="problem-box">
            <h4>Example: Employees in the Same Office as George (Slide 68)</h4>
            <app-sql-code-box
              code="SELECT firstName, lastName FROM employees
WHERE officeCode = (
  SELECT officeCode FROM employees
  WHERE firstname = 'George'
);"
              title="Office Code Match Subquery"
            ></app-sql-code-box>
          </div>

          <!-- Problem 1 -->
          <div class="problem-box">
            <span class="prob-tag">Practice 1 (Slide 69)</span>
            <h4>Find salary of employees whose salary is greater than employee ID 100</h4>
            <app-sql-code-box
              code="SELECT EMPLOYEE_ID, SALARY
FROM EMPLOYEES
WHERE SALARY > (
  SELECT SALARY
  FROM EMPLOYEES
  WHERE EMPLOYEE_ID = 100
);"
              title="Salary Comparison Subquery"
            ></app-sql-code-box>
          </div>

          <!-- Problem 2 -->
          <div class="problem-box">
            <span class="prob-tag">Practice 2 (Slide 70)</span>
            <h4>Find the employees earning the highest salary</h4>
            <app-sql-code-box
              code="SELECT EMPLOYEE_ID, SALARY
FROM EMPLOYEES
WHERE SALARY = (
  SELECT MAX(SALARY)
  FROM EMPLOYEES
);"
              title="Max Salary Subquery"
            ></app-sql-code-box>
          </div>

          <!-- Problem 3 -->
          <div class="problem-box">
            <span class="prob-tag">Practice 3 (Slide 71)</span>
            <h4>Departments where minimum salary is greater than the highest salary in dept 200</h4>
            <app-sql-code-box
              code="SELECT DEPARTMENT_ID, MIN(SALARY)
FROM EMPLOYEES
GROUP BY DEPARTMENT_ID
HAVING MIN(SALARY) > (
  SELECT MAX(SALARY)
  FROM EMPLOYEES
  WHERE DEPARTMENT_ID = 200
);"
              title="HAVING with Subquery"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Section 3: Multiple-Row Subqueries (IN, ANY, ALL) -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">10.3</span> Multiple-Row Subqueries: IN, ANY, ALL (Slides 72 - 78)
        </h2>
        <p class="section-text">
          When an inner query produces a list of multiple rows, standard equality (<code>=</code>) will throw an error. You must handle the candidate set using <code>IN</code>, <code>ANY</code>, or <code>ALL</code>.
        </p>

        <div class="operators-explain">
          <div class="exp-card">
            <h4><code>IN</code> Operator</h4>
            <p>Matches any value equal to at least one member in the subquery result set.</p>
            <app-sql-code-box
              code="SELECT firstName, lastName FROM employees
WHERE officeCode IN (
  SELECT officeCode FROM employees
  WHERE firstName IN ('Tom', 'Martin')
);"
              title="Subquery with IN (Slide 73)"
            ></app-sql-code-box>
          </div>

          <div class="exp-card">
            <h4><code>ANY</code> Operator</h4>
            <p>Compares value against each item. Returns true if true for at least one item.</p>
            <ul class="rule-bullets">
              <li><code>&gt; ANY</code>: Greater than the <strong>minimum</strong> value returned.</li>
              <li><code>&lt; ANY</code>: Less than the <strong>maximum</strong> value returned.</li>
            </ul>
            <app-sql-code-box
              code="-- Finds employees earning more than the minimum salary in Dept 5
SELECT name, salary FROM employees
WHERE salary > ANY (
  SELECT salary FROM employees WHERE dept_no = 5
);"
              title="Subquery with ANY (Slide 74)"
            ></app-sql-code-box>
          </div>

          <div class="exp-card">
            <h4><code>ALL</code> Operator</h4>
            <p>Compares value against all items. Returns true only if true for every single item.</p>
            <ul class="rule-bullets">
              <li><code>&gt; ALL</code>: Greater than the <strong>maximum</strong> value returned.</li>
              <li><code>&lt; ALL</code>: Less than the <strong>minimum</strong> value returned.</li>
            </ul>
            <app-sql-code-box
              code="-- Finds employees earning less than the minimum salary in Dept 100
SELECT EMPLOYEE_ID, SALARY FROM EMPLOYEES
WHERE SALARY < ALL (
  SELECT SALARY FROM EMPLOYEES WHERE DEPARTMENT_ID = 100
);"
              title="Subquery with ALL (Slide 75, 78)"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Section 4: Multiple-Column Subqueries & DML -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">10.4</span> Multiple-Column Subqueries &amp; DML (Slides 79 - 82)
        </h2>

        <div class="multi-col-box">
          <h4>Multiple-Column Subquery (Slide 79 - 80)</h4>
          <p class="section-text">
            Returns multiple columns simultaneously, matched pair-wise using tuples <code>(col1, col2) IN (...)</code>:
          </p>
          <app-sql-code-box
            code="SELECT EMPLOYEE_ID, MANAGER_ID, DEPARTMENT_ID
FROM EMPLOYEES
WHERE (MANAGER_ID, DEPARTMENT_ID) IN (
  SELECT MANAGER_ID, DEPARTMENT_ID
  FROM EMPLOYEES
  WHERE EMPLOYEE_ID IN (20, 30)
);"
            title="Multi-column Subquery (Slide 80)"
          ></app-sql-code-box>
        </div>

        <h3 class="sub-heading mt-4">DML with Subqueries (Slides 81 - 82)</h3>
        <p class="section-text">Subqueries can populate, update, and prune tables based on external tables:</p>

        <div class="dml-sub-grid">
          <div class="dml-sub-card">
            <h4>Subquery with INSERT</h4>
            <app-sql-code-box
              code="INSERT INTO EMPLOYEE_BKP
SELECT * FROM EMPLOYEE
WHERE ID IN (SELECT ID FROM EMPLOYEE);"
            ></app-sql-code-box>
          </div>

          <div class="dml-sub-card">
            <h4>Subquery with UPDATE</h4>
            <app-sql-code-box
              code="UPDATE EMPLOYEE
SET SALARY = SALARY * 0.25
WHERE AGE IN (SELECT AGE FROM CUSTOMERS_BKP WHERE AGE >= 29);"
            ></app-sql-code-box>
          </div>

          <div class="dml-sub-card">
            <h4>Subquery with DELETE</h4>
            <app-sql-code-box
              code="DELETE FROM EMPLOYEE
WHERE AGE IN (SELECT AGE FROM EMPLOYEE_BKP WHERE AGE >= 29);"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/group-by" class="nav-btn prev-btn">
          ← 9. GROUP BY &amp; HAVING Clauses
        </a>
        <a routerLink="/developer-tools/sql/foreign-keys" class="nav-btn next-btn">
          Next: 11. Foreign Keys &amp; Integrity →
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

    .guidelines-card { background: rgba(255, 255, 255, 0.02); border-left: 4px solid #38bdf8; padding: 1.25rem 1.5rem; border-radius: 0 12px 12px 0; margin-top: 1rem; }
    .guidelines-card h4 { color: #ffffff; margin: 0 0 0.75rem 0; font-size: 1rem; }
    .guidelines-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; color: #cbd5e1; font-size: 0.92rem; }
    .guidelines-list strong { color: #38bdf8; }

    .problems-stack { display: flex; flex-direction: column; gap: 1.5rem; }
    .problem-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .prob-tag { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; font-weight: 600; display: inline-block; margin-bottom: 0.5rem; }
    .problem-box h4 { color: #ffffff; margin: 0 0 0.75rem 0; font-size: 1rem; }

    .operators-explain { display: flex; flex-direction: column; gap: 1.5rem; }
    .exp-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .exp-card h4 { color: #c084fc; font-family: monospace; font-size: 1.1rem; margin: 0 0 0.5rem 0; }
    .exp-card p { color: #94a3b8; font-size: 0.88rem; margin: 0 0 0.5rem 0; }
    .rule-bullets { color: #cbd5e1; font-size: 0.88rem; margin: 0 0 0.75rem 0; padding-left: 1.25rem; line-height: 1.6; }
    .rule-bullets code { color: #38bdf8; }

    .multi-col-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .multi-col-box h4 { color: #38bdf8; margin: 0 0 0.5rem 0; }

    .dml-sub-grid { display: flex; flex-direction: column; gap: 1.25rem; }
    .dml-sub-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1rem; }
    .dml-sub-card h4 { color: #e2e8f0; margin: 0 0 0.5rem 0; font-size: 0.95rem; }

    .sub-heading { color: #ffffff; font-size: 1.1rem; margin: 1.5rem 0 0.75rem 0; }

    .chapter-nav-footer { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .nav-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .prev-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
    .prev-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .next-btn { background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55); }
  `]
})
export class SqlSubqueriesComponent {}
