import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-foreign-keys',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Database Relationships</span>
          <span class="badge-slides">PPT Slides 83 - 87</span>
        </div>
        <h1 class="chapter-title">11. Foreign Keys &amp; Referential Integrity</h1>
        <p class="chapter-subtitle">
          Master relational table linkage: Parent-Child relations, Referential Actions (CASCADE, RESTRICT, SET NULL, NO ACTION), multi-table cascading foreign keys, and ALTER TABLE constraint management.
        </p>
      </div>

      <!-- Section 1: Foreign Key Definition -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">11.1</span> Foreign Key Architecture (Slide 83)
        </h2>
        <p class="section-text">
          A <strong>FOREIGN KEY</strong> (referencing key) is a column or set of columns in one table that references the <strong>PRIMARY KEY</strong> in another table. It establishes a binding link that enforces <strong>referential integrity</strong> across the database.
        </p>

        <div class="rel-diagram-box">
          <div class="table-box parent-box">
            <div class="t-badge">Parent Table</div>
            <div class="t-name"><code>Person</code> / <code>Departments</code></div>
            <div class="t-key">🔑 PRIMARY KEY (id)</div>
          </div>
          <div class="rel-arrow">
            <span class="arrow-line">──────────────────────▶</span>
            <span class="arrow-label">Referenced By Foreign Key</span>
          </div>
          <div class="table-box child-box">
            <div class="t-badge">Child Table</div>
            <div class="t-name"><code>Contact</code> / <code>Employees</code></div>
            <div class="t-key">🔗 FOREIGN KEY (person_id)</div>
          </div>
        </div>

        <ul class="styled-points">
          <li>The <strong>Parent Table</strong> holds the authoritative original key values.</li>
          <li>The <strong>Child Table</strong> contains the foreign key referencing the parent table's primary key.</li>
          <li>MySQL allows defining foreign keys either during initial <code>CREATE TABLE</code> or dynamically via <code>ALTER TABLE</code>.</li>
        </ul>
      </section>

      <!-- Section 2: Referential Options -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">11.2</span> The 4 Referential Action Options (Slide 84)
        </h2>
        <p class="section-text">
          When a row in the parent table is deleted or updated, what should happen to matching rows in child tables? MySQL provides four <code>ON DELETE</code> and <code>ON UPDATE</code> clauses:
        </p>

        <div class="options-matrix">
          <div class="option-card cascade">
            <div class="opt-head">
              <span class="opt-badge">CASCADE</span>
              <h4>Automatic Cascade</h4>
            </div>
            <p>
              When a row is deleted or updated in the parent table, all matching rows in child tables are <strong>automatically deleted or updated</strong> synchronously.
            </p>
          </div>

          <div class="option-card restrict">
            <div class="opt-head">
              <span class="opt-badge">RESTRICT</span>
              <h4>Strict Prohibition</h4>
            </div>
            <p>
              MySQL strictly <strong>prohibits</strong> deleting or modifying a row in the parent table as long as any child table possesses a referencing row.
            </p>
          </div>

          <div class="option-card setnull">
            <div class="opt-head">
              <span class="opt-badge">SET NULL</span>
              <h4>Nullify Foreign Key</h4>
            </div>
            <p>
              If the parent row is deleted or modified, matching foreign key column values in the child table are safely reset to <code>NULL</code> (requires foreign key column to permit NULLs).
            </p>
          </div>

          <div class="option-card noaction">
            <div class="opt-head">
              <span class="opt-badge">NO ACTION</span>
              <h4>Standard SQL Reject</h4>
            </div>
            <p>
              Similar to RESTRICT. If dependent child records exist, the parent delete or update statement will fail and throw a referential integrity constraint error.
            </p>
          </div>
        </div>
      </section>

      <!-- Section 3: Multi-Table Setup & ALTER TABLE -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">11.3</span> Practical Foreign Key Implementation (Slides 85 - 87)
        </h2>

        <h3 class="sub-heading">1. Multi-Table Cascading Schema (Slide 85)</h3>
        <p class="section-text">
          A real-world relational schema demonstrating <code>demo1</code> (parent) &rarr; <code>emp</code> (child of demo1) &rarr; <code>stud</code> (child referencing both demo1 and emp):
        </p>

        <app-sql-code-box
          title="Multi-Table Foreign Key Script (Slide 85)"
          code="-- 1. Create Parent Table demo1
CREATE TABLE demo1 (
  id INT,
  name VARCHAR(66),
  PRIMARY KEY (id)
);
INSERT INTO demo1 VALUES (1, 'Aditi'), (2, 'Simran');

-- 2. Create Child Table emp referencing demo1
CREATE TABLE emp (
  e_id INT,
  name VARCHAR(88),
  id INT,
  PRIMARY KEY (e_id),
  FOREIGN KEY (id) REFERENCES demo1(id)
);
INSERT INTO emp VALUES (11, 'xyz', 1), (13, 'pqr', 2);

-- 3. Create Child Table stud referencing both demo1 and emp
CREATE TABLE stud (
  s_id INT,
  s_name VARCHAR(88),
  age INT,
  id INT,
  e_id INT,
  PRIMARY KEY (s_id),
  FOREIGN KEY (id) REFERENCES demo1(id),
  FOREIGN KEY (e_id) REFERENCES emp(e_id)
);
INSERT INTO stud VALUES (111, 'Amit', 9, 1, 11), (112, 'Riya', 9, 1, 11);"
        ></app-sql-code-box>

        <h3 class="sub-heading mt-4">2. Adding Foreign Keys via ALTER TABLE (Slide 86)</h3>
        <p class="section-text">
          You can append foreign key constraints to existing populated tables using <code>ALTER TABLE ADD CONSTRAINT</code>:
        </p>

        <app-sql-code-box
          title="ALTER TABLE ADD CONSTRAINT (Slide 86)"
          code="ALTER TABLE Contact
ADD CONSTRAINT fk_person
FOREIGN KEY (Person_Id) REFERENCES Person (ID)
ON DELETE CASCADE
ON UPDATE RESTRICT;"
        ></app-sql-code-box>

        <h3 class="sub-heading mt-4">3. Dropping a Foreign Key (Slide 87)</h3>
        <div class="syntax-line">Syntax: <code>ALTER TABLE table_name DROP FOREIGN KEY fk_constraint_name;</code></div>
        <app-sql-code-box
          title="DROP FOREIGN KEY (Slide 87)"
          code="ALTER TABLE contact
DROP FOREIGN KEY fk_customer;"
        ></app-sql-code-box>
      </section>

      <!-- Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/subqueries" class="nav-btn prev-btn">
          ← 10. Subqueries &amp; Nested Queries
        </a>
        <a routerLink="/developer-tools/sql/joins" class="nav-btn next-btn">
          Next: 12. SQL Joins (Venn &amp; Visualizers) →
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

    .rel-diagram-box { display: flex; align-items: center; justify-content: center; gap: 1.5rem; background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 1.5rem; margin: 1.25rem 0; flex-wrap: wrap; }
    .table-box { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 1rem 1.25rem; text-align: center; }
    .parent-box { border-color: rgba(245, 158, 11, 0.4); }
    .child-box { border-color: rgba(56, 189, 248, 0.4); }
    .t-badge { font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: #94a3b8; margin-bottom: 4px; }
    .t-name code { color: #ffffff; font-size: 1rem; font-weight: 700; }
    .t-key { font-size: 0.82rem; font-family: monospace; color: #facc15; margin-top: 6px; }
    .child-box .t-key { color: #38bdf8; }
    .rel-arrow { display: flex; flex-direction: column; align-items: center; color: #8b5cf6; font-size: 0.85rem; font-family: monospace; }
    .arrow-label { font-size: 0.75rem; color: #94a3b8; margin-top: 4px; }

    .styled-points { color: #cbd5e1; font-size: 0.92rem; line-height: 1.8; padding-left: 1.25rem; }
    .styled-points strong { color: #ffffff; }

    .options-matrix { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-top: 1rem; }
    .option-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 14px; padding: 1.25rem; }
    .opt-head { display: flex; align-items: center; gap: 8px; margin-bottom: 0.75rem; }
    .opt-badge { font-family: monospace; font-size: 0.75rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; }
    .cascade .opt-badge { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .restrict .opt-badge { background: rgba(239, 68, 68, 0.2); color: #f87171; }
    .setnull .opt-badge { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .noaction .opt-badge { background: rgba(139, 92, 246, 0.2); color: #c084fc; }
    .opt-head h4 { margin: 0; color: #ffffff; font-size: 0.95rem; }
    .option-card p { color: #94a3b8; font-size: 0.88rem; line-height: 1.6; margin: 0; }

    .sub-heading { color: #ffffff; font-size: 1.1rem; margin: 1.5rem 0 0.75rem 0; }
    .syntax-line { background: rgba(0, 0, 0, 0.35); padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; color: #94a3b8; margin-bottom: 0.5rem; display: inline-block; }
    .syntax-line code { color: #c084fc; font-family: monospace; }

    .chapter-nav-footer { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .nav-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .prev-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
    .prev-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .next-btn { background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55); }
  `]
})
export class SqlForeignKeysComponent {}
