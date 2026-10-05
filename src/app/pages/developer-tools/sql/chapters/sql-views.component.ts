import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-views',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Database Virtualization</span>
          <span class="badge-slides">PPT Slides 97 - 102</span>
        </div>
        <h1 class="chapter-title">13. Views in SQL</h1>
        <p class="chapter-subtitle">
          Understand virtual tables: CREATE VIEW from single and multiple tables, updating underlying data through views, deleting from views, and dropping views.
        </p>
      </div>

      <!-- Section 1: What is a View -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">13.1</span> What is an SQL View? (Slide 97)
        </h2>
        <p class="section-text">
          A <strong>VIEW</strong> in SQL is a <strong>virtual table</strong> based on the result-set of an SQL query.
        </p>

        <div class="benefits-grid">
          <div class="benefit-item">
            <span class="b-icon">🪟</span>
            <h4>Rows &amp; Columns</h4>
            <p>A view contains rows and columns just like a real database table, but does not store data on disk itself.</p>
          </div>
          <div class="benefit-item">
            <span class="b-icon">🛡️</span>
            <h4>Security &amp; Privacy</h4>
            <p>Hides sensitive columns (e.g. passwords, SSN, bank accounts) by exposing only non-confidential fields to users.</p>
          </div>
          <div class="benefit-item">
            <span class="b-icon">⚡</span>
            <h4>Query Simplification</h4>
            <p>Abstracts monstrous, complex multi-table joins into a simple <code>SELECT * FROM view_name</code> query.</p>
          </div>
        </div>
      </section>

      <!-- Section 2: Creating Views -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">13.2</span> Creating Views (Slides 98 - 100)
        </h2>

        <div class="views-creation-grid">
          <!-- Single table view -->
          <div class="view-create-box">
            <h4>1. Creating View from a Single Table (Slide 99)</h4>
            <p>Exposes only <code>name</code> and <code>manager_id</code> for employees whose <code>emp_id &lt; 4</code>:</p>
            <app-sql-code-box
              title="CREATE VIEW (Single Table)"
              code="CREATE VIEW emp_view AS
SELECT name, manager_id
FROM employee
WHERE emp_id < 4;"
              output="Query OK, 0 rows affected (0.01 sec)"
            ></app-sql-code-box>
          </div>

          <!-- Multiple table view -->
          <div class="view-create-box">
            <h4>2. Creating View from Multiple Tables (Slide 100)</h4>
            <p>Pre-joins <code>employee</code> and <code>emp_details</code> into a unified virtual entity:</p>
            <app-sql-code-box
              title="CREATE VIEW (Multiple Tables)"
              code="CREATE VIEW empview AS
SELECT employee.manager_id, employee.name, emp_details.city, emp_details.age
FROM employee, emp_details
WHERE employee.name = emp_details.name;"
              output="Query OK, 0 rows affected (0.01 sec)"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Section 3: Updating, Deleting & Dropping Views -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">13.3</span> Updating, Deleting &amp; Dropping Views (Slides 101 - 102)
        </h2>

        <div class="ops-stack">
          <!-- Update -->
          <div class="op-box">
            <h4>1. Updating Data Through a View (Slide 101)</h4>
            <p>
              When a view is updatable (derived from a single table without aggregations), modifying rows through the view updates the underlying physical table!
            </p>
            <app-sql-code-box
              title="UPDATE View"
              code="UPDATE emp_view
SET name = 'prachi'
WHERE manager_id = 4;"
              output="Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0"
            ></app-sql-code-box>
          </div>

          <!-- Delete -->
          <div class="op-box">
            <h4>2. Deleting Data from a View (Slide 102)</h4>
            <p>Removes matching records from the base table via the view interface:</p>
            <app-sql-code-box
              title="DELETE from View"
              code="DELETE FROM view1
WHERE name = 'nisha';"
              output="Query OK, 1 row affected (0.01 sec)"
            ></app-sql-code-box>
          </div>

          <!-- Drop -->
          <div class="op-box">
            <h4>3. Dropping a View (Slide 102)</h4>
            <p>Deletes the virtual view definition without harming any data in the original base tables:</p>
            <app-sql-code-box
              title="DROP VIEW Syntax"
              code="DROP VIEW IF EXISTS emp_view;"
              output="Query OK, 0 rows affected (0.01 sec)"
            ></app-sql-code-box>
          </div>
        </div>
      </section>

      <!-- Interactive Playground CTA -->
      <section class="playground-cta glass">
        <div class="cta-content">
          <span class="cta-badge">🎉 Course Complete!</span>
          <h2>Ready to test your MySQL knowledge live?</h2>
          <p>
            Launch the interactive SQL Sandbox loaded with all tables and datasets from the 102 course slides.
          </p>
          <a routerLink="/developer-tools/sql/playground" class="cta-launch-btn">
            💻 Launch Live SQL Playground →
          </a>
        </div>
      </section>

      <!-- Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/joins" class="nav-btn prev-btn">
          ← 12. SQL Joins
        </a>
        <a routerLink="/developer-tools/sql/playground" class="nav-btn next-btn">
          Next: 14. Interactive SQL Playground →
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

    .benefits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-top: 1rem; }
    .benefit-item { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .b-icon { font-size: 1.8rem; display: block; margin-bottom: 0.5rem; }
    .benefit-item h4 { color: #ffffff; margin: 0 0 0.4rem 0; font-size: 1rem; }
    .benefit-item p { color: #94a3b8; font-size: 0.88rem; line-height: 1.6; margin: 0; }

    .views-creation-grid { display: flex; flex-direction: column; gap: 1.5rem; }
    .view-create-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .view-create-box h4 { color: #38bdf8; margin: 0 0 0.5rem 0; font-size: 1rem; }
    .view-create-box p { color: #94a3b8; font-size: 0.88rem; margin: 0 0 0.75rem 0; }

    .ops-stack { display: flex; flex-direction: column; gap: 1.25rem; }
    .op-box { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 1.25rem; }
    .op-box h4 { color: #ffffff; margin: 0 0 0.5rem 0; font-size: 1rem; }
    .op-box p { color: #94a3b8; font-size: 0.88rem; margin: 0 0 0.75rem 0; }

    .playground-cta { background: linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(59, 130, 246, 0.15)); border: 1px solid rgba(139, 92, 246, 0.35); border-radius: 20px; padding: 2.5rem 2rem; text-align: center; }
    .cta-badge { background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-size: 0.8rem; font-weight: 700; padding: 4px 12px; border-radius: 999px; display: inline-block; margin-bottom: 0.75rem; }
    .cta-content h2 { color: #ffffff; font-size: 1.8rem; margin: 0 0 0.5rem 0; }
    .cta-content p { color: #94a3b8; font-size: 1rem; margin: 0 auto 1.5rem auto; max-width: 600px; }
    .cta-launch-btn { display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 1rem; text-decoration: none; box-shadow: 0 4px 20px rgba(124, 58, 237, 0.5); transition: all 0.2s; }
    .cta-launch-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 26px rgba(124, 58, 237, 0.7); }

    .chapter-nav-footer { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .nav-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .prev-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
    .prev-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .next-btn { background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55); }
  `]
})
export class SqlViewsComponent {}
