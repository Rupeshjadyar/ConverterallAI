import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-constraints',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Data Integrity</span>
          <span class="badge-slides">PPT Slides 12 - 17</span>
        </div>
        <h1 class="chapter-title">4. Constraints in SQL</h1>
        <p class="chapter-subtitle">
          Master the rules of data integrity: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK, and DEFAULT constraints at column and table levels.
        </p>
      </div>

      <!-- Overview -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">4.1</span> What are SQL Constraints?
        </h2>
        <p class="section-text">
          <strong>Constraints</strong> are predefined conditions, business rules, and restrictions applied to columns or whole tables in a database. They prevent invalid or unauthorized data from ever being saved.
        </p>
        <div class="scope-grid">
          <div class="scope-card">
            <h4>Column-Level Constraints</h4>
            <p>Applied to a single, specific column during its definition (e.g. <code>age INT NOT NULL</code>).</p>
          </div>
          <div class="scope-card">
            <h4>Table-Level Constraints</h4>
            <p>Applied at the end of the table declaration, spanning one or multiple columns together (e.g. composite primary keys).</p>
          </div>
        </div>
      </section>

      <!-- 1. NOT NULL & UNIQUE -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">4.2</span> 1. NOT NULL &amp; 2. UNIQUE Constraints
        </h2>

        <div class="rule-box">
          <div class="rule-header">
            <span class="rule-badge">1. NOT NULL</span>
            <h3>Value Cannot Be Empty</h3>
          </div>
          <p class="rule-desc">
            <code>NULL</code> indicates missing or undefined data. When a column is marked <code>NOT NULL</code>, the database guarantees that every record must supply a valid value.
          </p>
          <app-sql-code-box
            title="NOT NULL Constraint Syntax & Example (Slide 12)"
            code="CREATE TABLE student (
  StudentID INT NOT NULL,
  Student_FirstName VARCHAR(20),
  Student_LastName VARCHAR(20)
);"
          ></app-sql-code-box>
        </div>

        <div class="rule-box">
          <div class="rule-header">
            <span class="rule-badge">2. UNIQUE</span>
            <h3>No Duplicate Values Permitted</h3>
          </div>
          <p class="rule-desc">
            Ensures all values in the column are distinct across rows. Unlike Primary Keys, a table can possess multiple <code>UNIQUE</code> constraints, and unique columns may permit NULLs (depending on SQL dialect).
          </p>
          <app-sql-code-box
            title="UNIQUE Constraint Syntax & Example (Slide 13)"
            code="CREATE TABLE student (
  StudentID INT UNIQUE,
  Student_FirstName VARCHAR(20),
  Student_LastName VARCHAR(20)
);"
          ></app-sql-code-box>
        </div>
      </section>

      <!-- 3. PRIMARY KEY & 4. FOREIGN KEY -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">4.3</span> 3. PRIMARY KEY &amp; 4. FOREIGN KEY
        </h2>

        <div class="rule-box">
          <div class="rule-header">
            <span class="rule-badge pk-badge">3. PRIMARY KEY</span>
            <h3>The Unique Entity Identifier</h3>
          </div>
          <p class="rule-desc">
            A <strong>PRIMARY KEY</strong> is mathematically equivalent to <code>NOT NULL + UNIQUE</code>. It unambiguously identifies each row in a table.
          </p>
          <ul class="styled-list">
            <li>Primary keys can <strong>never</strong> be NULL.</li>
            <li>A table can have <strong>only one</strong> PRIMARY KEY constraint (which may consist of single or composite columns).</li>
            <li>Primary keys are referenced by <strong>Foreign Keys</strong> in other tables to establish relational links.</li>
          </ul>
          <app-sql-code-box
            title="PRIMARY KEY Syntax & Example (Slide 14)"
            code="CREATE TABLE student (
  StudentID INT PRIMARY KEY,
  Student_FirstName VARCHAR(20),
  Student_LastName VARCHAR(20)
);"
          ></app-sql-code-box>
        </div>

        <div class="rule-box">
          <div class="rule-header">
            <span class="rule-badge fk-badge">4. FOREIGN KEY</span>
            <h3>Referential Integrity Link</h3>
          </div>
          <p class="rule-desc">
            A <strong>FOREIGN KEY</strong> in a child table points to a <strong>PRIMARY KEY</strong> in a parent table. It prevents actions that would destroy links between related tables.
          </p>
          <app-sql-code-box
            title="FOREIGN KEY Syntax & Example (Slide 15)"
            code="CREATE TABLE employee (
  Emp_ID INT NOT NULL PRIMARY KEY,
  Emp_Name VARCHAR(40),
  Emp_Salary VARCHAR(40)
);

CREATE TABLE department_assignments (
  Assign_ID INT PRIMARY KEY,
  Emp_ID INT,
  Dept_Name VARCHAR(50),
  FOREIGN KEY (Emp_ID) REFERENCES employee(Emp_ID)
);"
          ></app-sql-code-box>
        </div>
      </section>

      <!-- 5. CHECK & 6. DEFAULT -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">4.4</span> 5. CHECK &amp; 6. DEFAULT Constraints
        </h2>

        <div class="rule-box">
          <div class="rule-header">
            <span class="rule-badge">5. CHECK</span>
            <h3>Value Validation Predicate</h3>
          </div>
          <p class="rule-desc">
            Whenever an <code>INSERT</code> or <code>UPDATE</code> occurs, the database evaluates the condition in the <code>CHECK</code> clause. If it evaluates to FALSE, the operation is blocked.
          </p>
          <app-sql-code-box
            title="CHECK Constraint Example (Age <= 15) (Slide 16)"
            code="CREATE TABLE student (
  StudentID INT,
  Student_FirstName VARCHAR(20),
  Student_LastName VARCHAR(20),
  Student_PhoneNumber VARCHAR(20),
  Student_Email_ID VARCHAR(40),
  Age INT CHECK (Age <= 15)
);"
          ></app-sql-code-box>
        </div>

        <div class="rule-box">
          <div class="rule-header">
            <span class="rule-badge">6. DEFAULT</span>
            <h3>Automatic Fallback Value</h3>
          </div>
          <p class="rule-desc">
            If an insert statement does not specify a value for this column, the default literal is automatically supplied.
          </p>
          <app-sql-code-box
            title="DEFAULT Constraint Example (Slide 17)"
            code="CREATE TABLE student (
  StudentID INT,
  Student_FirstName VARCHAR(20),
  Student_LastName VARCHAR(20),
  Student_PhoneNumber VARCHAR(20),
  Student_Email_ID VARCHAR(40) DEFAULT 'xyz8@gmail.com'
);"
          ></app-sql-code-box>
        </div>
      </section>

      <!-- Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/data-types" class="nav-btn prev-btn">
          ← 3. Data Types in SQL
        </a>
        <a routerLink="/developer-tools/sql/ddl" class="nav-btn next-btn">
          Next: 5. DDL (Data Definition Language) →
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

    .scope-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-top: 1rem; }
    @media (max-width: 640px) { .scope-grid { grid-template-columns: 1fr; } }
    .scope-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 1.25rem; }
    .scope-card h4 { color: #38bdf8; margin: 0 0 0.5rem 0; font-size: 1rem; }
    .scope-card p { color: #94a3b8; font-size: 0.88rem; margin: 0; line-height: 1.6; }

    .rule-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem; }
    .rule-box:last-child { margin-bottom: 0; }
    .rule-header { display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem; }
    .rule-badge { background: rgba(139, 92, 246, 0.2); color: #c084fc; border: 1px solid rgba(139, 92, 246, 0.35); padding: 3px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; font-family: monospace; }
    .pk-badge { background: rgba(245, 158, 11, 0.2); color: #facc15; border-color: rgba(245, 158, 11, 0.4); }
    .fk-badge { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border-color: rgba(56, 189, 248, 0.4); }
    .rule-header h3 { color: #ffffff; font-size: 1.1rem; margin: 0; }
    .rule-desc { color: #94a3b8; font-size: 0.92rem; line-height: 1.6; margin: 0 0 1rem 0; }

    .styled-list { color: #cbd5e1; font-size: 0.92rem; line-height: 1.7; padding-left: 1.25rem; margin-bottom: 1rem; }
    .styled-list strong { color: #fff; }

    .chapter-nav-footer { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .nav-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .prev-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
    .prev-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .next-btn { background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55); }
  `]
})
export class SqlConstraintsComponent {}
