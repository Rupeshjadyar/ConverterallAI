import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-ddl',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Commands (DDL &amp; DML)</span>
          <span class="badge-slides">PPT Slides 18 - 25</span>
        </div>
        <h1 class="chapter-title">5. Data Definition Language (DDL)</h1>
        <p class="chapter-subtitle">
          Learn how to manage schema structures: CREATE, SHOW, USE, DROP databases; CREATE &amp; ALTER tables (ADD, MODIFY, CHANGE, DROP columns); RENAME TABLE; and TRUNCATE vs. DROP.
        </p>
      </div>

      <!-- DDL Overview -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">5.1</span> DDL Command Summary (Slide 18)
        </h2>
        <p class="section-text">
          <strong>DDL (Data Definition Language)</strong> consists of SQL statements that define and manage the database schema. DDL commands build, restructure, or remove database objects (databases, tables, views, indexes) without altering the row contents directly.
        </p>

        <div class="table-responsive">
          <table class="styled-matrix-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>DDL Command</th>
                <th>Description</th>
                <th>Sample Query</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.</td>
                <td><code>CREATE</code></td>
                <td>Used to create tables, databases, or views.</td>
                <td><code>CREATE TABLE student (id INT);</code></td>
              </tr>
              <tr>
                <td>2.</td>
                <td><code>ALTER</code></td>
                <td>Modifies column definitions or constraints in existing tables.</td>
                <td><code>ALTER TABLE student ADD roll_no INT;</code></td>
              </tr>
              <tr>
                <td>3.</td>
                <td><code>RENAME</code></td>
                <td>Renames an existing table or database schema object.</td>
                <td><code>RENAME TABLE student TO student_details;</code></td>
              </tr>
              <tr>
                <td>4.</td>
                <td><code>DROP</code></td>
                <td>Permanently deletes table structure and its data.</td>
                <td><code>DROP TABLE student_details;</code></td>
              </tr>
              <tr>
                <td>5.</td>
                <td><code>TRUNCATE</code></td>
                <td>Empties all rows from a table while preserving schema structure.</td>
                <td><code>TRUNCATE TABLE student_details;</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Database Management -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">5.2</span> Database Level Operations (Slide 19)
        </h2>

        <div class="ddl-subgrid">
          <div class="sub-item">
            <h4>Creating a Database</h4>
            <div class="syntax-line">Syntax: <code>CREATE DATABASE Database_Name;</code></div>
            <app-sql-code-box
              code="CREATE DATABASE Student;"
              title="Create Database"
            ></app-sql-code-box>
          </div>

          <div class="sub-item">
            <h4>Listing All Databases</h4>
            <div class="syntax-line">Syntax: <code>SHOW DATABASES;</code></div>
            <app-sql-code-box
              code="SHOW DATABASES;"
              title="Show Databases"
              output="+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| Student            |
+--------------------+
4 rows in set (0.001 sec)"
            ></app-sql-code-box>
          </div>

          <div class="sub-item">
            <h4>Selecting Active Database</h4>
            <div class="syntax-line">Syntax: <code>USE database_name;</code></div>
            <app-sql-code-box
              code="USE Student;"
              title="Switch Database"
              output="Database changed"
            ></app-sql-code-box>
          </div>

          <div class="sub-item">
            <h4>Removing / Deleting Database</h4>
            <div class="syntax-line">Syntax: <code>DROP DATABASE database_name;</code></div>
            <app-sql-code-box
              code="DROP DATABASE Student;"
              title="Drop Database"
              output="Query OK, 0 rows affected (0.02 sec)"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Table Definition -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">5.3</span> Creating Tables (Slides 20 - 21)
        </h2>
        <p class="section-text">
          A table is a structured collection of data organized in rows and columns. In formal relational terminology, a table is called a <strong>relation</strong>, columns are <strong>fields / attributes</strong>, and rows are <strong>records / tuples</strong>.
        </p>

        <app-sql-code-box
          title="CREATE TABLE Statement (Slide 21)"
          code="CREATE TABLE STUDENTS (
  ID INT NOT NULL,
  NAME VARCHAR(20) NOT NULL,
  AGE INT NOT NULL,
  ADDRESS CHAR(25),
  PRIMARY KEY (ID)
);"
          output="Query OK, 0 rows affected (0.04 sec)"
        ></app-sql-code-box>
      </section>

      <!-- ALTER TABLE -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">5.4</span> The ALTER TABLE Command (Slides 22 - 23)
        </h2>
        <p class="section-text">
          <code>ALTER TABLE</code> allows adding, modifying, renaming, and deleting columns on existing tables, as well as applying or removing constraints without recreating the table.
        </p>

        <div class="alter-cases">
          <div class="alter-case">
            <h4>1. ALTER TABLE ADD Column</h4>
            <div class="syntax-line">Syntax: <code>ALTER TABLE table_name ADD column_name column-definition;</code></div>
            <app-sql-code-box
              title="ADD Single & Multiple Columns (Slide 22)"
              code="-- Adding a single column
ALTER TABLE student ADD marks INT;

-- Adding multiple columns
ALTER TABLE student ADD email VARCHAR(50), ADD phone_number VARCHAR(15);"
            ></app-sql-code-box>
          </div>

          <div class="alter-case">
            <h4>2. ALTER TABLE MODIFY Column</h4>
            <div class="syntax-line">Syntax: <code>ALTER TABLE table_name MODIFY column_name column-definition;</code></div>
            <app-sql-code-box
              title="MODIFY Column Data Type / Size (Slide 22)"
              code="ALTER TABLE student MODIFY NAME VARCHAR(40);"
            ></app-sql-code-box>
          </div>

          <div class="alter-case">
            <h4>3. ALTER TABLE RENAME / CHANGE Column</h4>
            <div class="syntax-line">Syntax: <code>ALTER TABLE table_name CHANGE COLUMN old_name new_name datatype;</code></div>
            <app-sql-code-box
              title="CHANGE Column Name & Type (Slide 23)"
              code="ALTER TABLE STUDENTS CHANGE COLUMN First_NAME Stud_Name VARCHAR(20);"
            ></app-sql-code-box>
          </div>

          <div class="alter-case">
            <h4>4. ALTER TABLE DROP Column</h4>
            <div class="syntax-line">Syntax: <code>ALTER TABLE table_name DROP column_name;</code></div>
            <app-sql-code-box
              title="DROP Column(s) (Slide 23)"
              code="-- Dropping single column
ALTER TABLE students DROP ADDRESS;

-- Dropping multiple columns
ALTER TABLE students DROP marks, DROP phone_number;"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- RENAME, TRUNCATE & DROP -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">5.5</span> RENAME, TRUNCATE &amp; DROP Table (Slides 24 - 25)
        </h2>

        <div class="destruct-grid">
          <div class="destruct-box">
            <h4>Rename Table Command (Slide 24)</h4>
            <p>Changes the official name of the table schema in the database.</p>
            <app-sql-code-box
              code="ALTER TABLE STUDENTS RENAME TO STUDENT_DETAILS;"
              title="Rename Table"
            ></app-sql-code-box>
          </div>

          <div class="destruct-box">
            <h4>TRUNCATE TABLE Command (Slide 25)</h4>
            <p>Removes all rows (clears complete data) while keeping the structure intact. Faster than <code>DELETE</code> with less resource overhead.</p>
            <app-sql-code-box
              code="TRUNCATE TABLE STUDENTS;"
              title="Truncate Table"
            ></app-sql-code-box>
          </div>

          <div class="destruct-box">
            <h4>DROP TABLE Command (Slide 25)</h4>
            <p>Permanently deletes the entire table definition, constraints, and all data.</p>
            <app-sql-code-box
              code="DROP TABLE STUDENTS;"
              title="Drop Table"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/constraints" class="nav-btn prev-btn">
          ← 4. Constraints in SQL
        </a>
        <a routerLink="/developer-tools/sql/dml" class="nav-btn next-btn">
          Next: 6. DML (Data Manipulation Language) →
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

    .syntax-line { background: rgba(0, 0, 0, 0.35); padding: 5px 10px; border-radius: 6px; font-size: 0.82rem; color: #94a3b8; margin-bottom: 0.5rem; }
    .syntax-line code { color: #c084fc; }

    .ddl-subgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    @media (max-width: 768px) { .ddl-subgrid { grid-template-columns: 1fr; } }
    .sub-item h4 { color: #ffffff; margin: 0 0 0.5rem 0; font-size: 1.05rem; }

    .alter-cases { display: flex; flex-direction: column; gap: 1.25rem; }
    .alter-case { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .alter-case h4 { color: #38bdf8; margin: 0 0 0.5rem 0; }

    .destruct-grid { display: flex; flex-direction: column; gap: 1.25rem; }
    .destruct-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .destruct-box h4 { color: #f43f5e; margin: 0 0 0.4rem 0; }
    .destruct-box p { color: #94a3b8; font-size: 0.88rem; margin: 0 0 0.75rem 0; }

    .chapter-nav-footer { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .nav-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .prev-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
    .prev-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .next-btn { background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55); }
  `]
})
export class SqlDdlComponent {}
