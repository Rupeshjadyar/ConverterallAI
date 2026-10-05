import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-sql-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sql-home-container">
      <!-- Hero Header -->
      <header class="sql-hero glass">
        <div class="hero-badge-pill">
          <span class="badge-dot"></span>
          <span>MySQL &amp; RDBMS Masterclass • 102 Slides</span>
        </div>
        
        <h1 class="hero-title">Interactive SQL Learning Engine</h1>
        <p class="hero-subtitle">
          Master Relational Databases from ground up. Explore syntax rules, data definition, manipulations, security, transactions, and Venn diagram joins with real in-browser query execution.
        </p>

        <div class="hero-cta-row">
          <a routerLink="/developer-tools/sql/intro" class="hero-btn primary">
            <span>📚</span> Start Introduction
          </a>
          <a routerLink="/developer-tools/sql/playground" class="hero-btn secondary">
            <span>💻</span> Open Query Sandbox
          </a>
        </div>
      </header>

      <!-- Section Title -->
      <div class="section-header-row">
        <div>
          <h2 class="section-title">Core Learning Modules</h2>
          <p class="section-sub">Select any topic below or use the top internal navbar to navigate the curriculum.</p>
        </div>
      </div>

      <!-- Core Modules Grid (The 8 requested navbar sections + sandbox) -->
      <div class="modules-grid">
        <!-- 1. Introduction -->
        <a routerLink="/developer-tools/sql/intro" class="module-card glass">
          <div class="card-head">
            <span class="card-icon">📚</span>
            <span class="card-tag tag-essential">Essential</span>
          </div>
          <h3 class="card-title">1. Introduction</h3>
          <p class="card-desc">
            Core fundamentals: Data, Database, DBMS vs RDBMS, tables, columns, rows, and relational architecture.
          </p>
          <div class="card-footer">
            <span class="card-range">Slides 1 - 4</span>
            <span class="card-arrow">Open →</span>
          </div>
        </a>

        <!-- 2. SQL Syntax -->
        <a routerLink="/developer-tools/sql/syntax" class="module-card glass">
          <div class="card-head">
            <span class="card-icon">⚡</span>
            <span class="card-tag tag-core">Core</span>
          </div>
          <h3 class="card-title">2. SQL Syntax &amp; Commands</h3>
          <p class="card-desc">
            5 command categories (DDL, DML, DQL, DCL, TCL), SQL syntax rules, expressions, and logical operators.
          </p>
          <div class="card-footer">
            <span class="card-range">Slides 5 - 8</span>
            <span class="card-arrow">Open →</span>
          </div>
        </a>

        <!-- 3. DDL -->
        <a routerLink="/developer-tools/sql/ddl" class="module-card glass">
          <div class="card-head">
            <span class="card-icon">🏗️</span>
            <span class="card-tag tag-core">Core</span>
          </div>
          <h3 class="card-title">3. DDL (Data Definition)</h3>
          <p class="card-desc">
            CREATE TABLE, ALTER (ADD, MODIFY, DROP, RENAME), TRUNCATE vs DROP TABLE, and schema modifications.
          </p>
          <div class="card-footer">
            <span class="card-range">Slides 18 - 25</span>
            <span class="card-arrow">Open →</span>
          </div>
        </a>

        <!-- 4. DML -->
        <a routerLink="/developer-tools/sql/dml" class="module-card glass">
          <div class="card-head">
            <span class="card-icon">✏️</span>
            <span class="card-tag tag-core">Core</span>
          </div>
          <h3 class="card-title">4. DML (Data Manipulation)</h3>
          <p class="card-desc">
            INSERT INTO multi-row syntax, UPDATE with conditions, DELETE statements, and data safety precautions.
          </p>
          <div class="card-footer">
            <span class="card-range">Slides 26 - 30</span>
            <span class="card-arrow">Open →</span>
          </div>
        </a>

        <!-- 5. DQL -->
        <a routerLink="/developer-tools/sql/dql" class="module-card glass">
          <div class="card-head">
            <span class="card-icon">🔍</span>
            <span class="card-tag tag-essential">Essential</span>
          </div>
          <h3 class="card-title">5. DQL (Data Query Language)</h3>
          <p class="card-desc">
            SELECT, WHERE filtering, LIKE wildcards, BETWEEN, IN, ORDER BY, GROUP BY, HAVING, and Subqueries.
          </p>
          <div class="card-footer">
            <span class="card-range">Slides 31 - 46</span>
            <span class="card-arrow">Open →</span>
          </div>
        </a>

        <!-- 6. DCL -->
        <a routerLink="/developer-tools/sql/dcl" class="module-card glass">
          <div class="card-head">
            <span class="card-icon">🛡️</span>
            <span class="card-tag tag-core">Security</span>
          </div>
          <h3 class="card-title">6. DCL (Data Control Language)</h3>
          <p class="card-desc">
            Database access control &amp; security: GRANT privileges, REVOKE permissions, and user role management.
          </p>
          <div class="card-footer">
            <span class="card-range">Security Reference</span>
            <span class="card-arrow">Open →</span>
          </div>
        </a>

        <!-- 7. TCL -->
        <a routerLink="/developer-tools/sql/tcl" class="module-card glass">
          <div class="card-head">
            <span class="card-icon">🔄</span>
            <span class="card-tag tag-advanced">Transactions</span>
          </div>
          <h3 class="card-title">7. TCL (Transaction Control)</h3>
          <p class="card-desc">
            ACID properties, BEGIN TRANSACTION, COMMIT, ROLLBACK, and SAVEPOINT with practical rollback examples.
          </p>
          <div class="card-footer">
            <span class="card-range">ACID &amp; Recovery</span>
            <span class="card-arrow">Open →</span>
          </div>
        </a>

        <!-- 8. Joins -->
        <a routerLink="/developer-tools/sql/joins" class="module-card glass">
          <div class="card-head">
            <span class="card-icon">🔀</span>
            <span class="card-tag tag-essential">Essential</span>
          </div>
          <h3 class="card-title">8. SQL Joins &amp; Venn Diagrams</h3>
          <p class="card-desc">
            INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN with interactive visual set-theory Venn diagrams.
          </p>
          <div class="card-footer">
            <span class="card-range">Slides 76 - 93</span>
            <span class="card-arrow">Open →</span>
          </div>
        </a>

        <!-- 9. Interactive SQL Playground -->
        <a routerLink="/developer-tools/sql/playground" class="module-card glass playground-card">
          <div class="card-head">
            <span class="card-icon">💻</span>
            <span class="card-tag tag-interactive">Live Runner</span>
          </div>
          <h3 class="card-title">Live SQL Playground</h3>
          <p class="card-desc">
            Execute real queries against pre-seeded tables in your browser with zero database installation.
          </p>
          <div class="card-footer">
            <span class="card-range">18+ Query Templates</span>
            <span class="card-arrow">Launch Sandbox →</span>
          </div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .sql-home-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }

    .glass {
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
    }

    .sql-hero {
      padding: 2.5rem 2rem;
      border: 1px solid rgba(139, 92, 246, 0.25);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
      margin-bottom: 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero-badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      border-radius: 99px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.35);
      color: #c4b5fd;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #06b6d4;
      box-shadow: 0 0 8px #06b6d4;
    }

    .hero-title {
      font-size: 2.2rem;
      font-weight: 800;
      margin: 0 0 0.75rem 0;
      background: linear-gradient(135deg, #ffffff 40%, #c4b5fd 80%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 1.05rem;
      color: #94a3b8;
      max-width: 780px;
      margin: 0 auto 1.75rem auto;
      line-height: 1.6;
    }

    .hero-cta-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .hero-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      text-decoration: none;
      font-size: 0.92rem;
      font-weight: 700;
      transition: all 0.25s ease;
    }

    .hero-btn.primary {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: #ffffff;
      border: 1px solid #8b5cf6;
      box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
    }

    .hero-btn.primary:hover {
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(124, 58, 237, 0.6);
    }

    .hero-btn.secondary {
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.35);
      color: #67e8f9;
    }

    .hero-btn.secondary:hover {
      background: rgba(6, 182, 212, 0.25);
      color: #ffffff;
      transform: translateY(-2px);
    }

    .section-header-row {
      margin-bottom: 1.25rem;
    }

    .section-title {
      font-size: 1.4rem;
      font-weight: 800;
      color: #f1f5f9;
      margin: 0 0 0.25rem 0;
    }

    .section-sub {
      font-size: 0.88rem;
      color: #94a3b8;
      margin: 0;
    }

    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }

    .module-card {
      padding: 1.5rem;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .module-card:hover {
      background: rgba(139, 92, 246, 0.12);
      border-color: rgba(139, 92, 246, 0.4);
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(139, 92, 246, 0.15);
    }

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.85rem;
    }

    .card-icon {
      font-size: 1.75rem;
    }

    .card-tag {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 0.15rem 0.5rem;
      border-radius: 99px;
    }

    .tag-essential {
      background: rgba(16, 185, 129, 0.18);
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.35);
    }

    .tag-core {
      background: rgba(59, 130, 246, 0.18);
      color: #93c5fd;
      border: 1px solid rgba(59, 130, 246, 0.35);
    }

    .tag-advanced {
      background: rgba(236, 72, 153, 0.18);
      color: #f472b6;
      border: 1px solid rgba(236, 72, 153, 0.35);
    }

    .tag-interactive {
      background: rgba(245, 158, 11, 0.18);
      color: #fcd34d;
      border: 1px solid rgba(245, 158, 11, 0.35);
    }

    .card-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
    }

    .card-desc {
      font-size: 0.85rem;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0 0 1.25rem 0;
      flex: 1;
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.85rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 0.8rem;
    }

    .card-range {
      color: #64748b;
      font-weight: 500;
    }

    .card-arrow {
      color: #a78bfa;
      font-weight: 700;
      transition: transform 0.2s;
    }

    .module-card:hover .card-arrow {
      transform: translateX(4px);
      color: #67e8f9;
    }

    .playground-card {
      border-color: rgba(6, 182, 212, 0.3);
      background: rgba(6, 182, 212, 0.06);
    }

    .playground-card:hover {
      border-color: rgba(6, 182, 212, 0.6);
      background: rgba(6, 182, 212, 0.14);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 25px rgba(6, 182, 212, 0.25);
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 1.6rem;
      }
      .sql-hero {
        padding: 1.75rem 1.25rem;
      }
      .modules-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SqlHomeComponent implements OnInit {
  private seo = inject(SeoService);

  ngOnInit() {
    this.seo.updateTags({
      title: 'SQL Masterclass Home – Introduction, Syntax, DDL, DML, DQL, DCL, TCL & Joins',
      description: 'Comprehensive MySQL & SQL curriculum covering all 102 slides. Interactive internal navigation across Introduction, Syntax, DDL, DML, DQL, DCL, TCL, and Joins.',
      keywords: 'sql learn, mysql masterclass, sql syntax, ddl, dml, dql, dcl, tcl, sql joins, sql course online',
      canonicalUrl: 'https://converterallai.com/developer-tools/sql'
    });
  }
}
