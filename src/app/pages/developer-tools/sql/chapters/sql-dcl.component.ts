import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-dcl',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <!-- Chapter Header -->
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Security &amp; Permissions</span>
          <span class="badge-slides">SQL Commands • DCL</span>
        </div>
        <h1 class="chapter-title">6. DCL (Data Control Language)</h1>
        <p class="chapter-subtitle">
          Manage database permissions, user access rights, and security policies using GRANT and REVOKE commands.
        </p>
      </div>

      <!-- Section 1: What is DCL? -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">6.1</span> Understanding DCL Commands
        </h2>
        <p class="section-p">
          <strong>Data Control Language (DCL)</strong> consists of commands used to grant and revoke access permissions to database users. DCL commands prevent unauthorized access and maintain strict security compliance in enterprise database management systems.
        </p>

        <div class="comparison-grid">
          <div class="comp-box">
            <div class="comp-icon">🔑</div>
            <h3>1. GRANT</h3>
            <p>Provides specific privileges (such as SELECT, INSERT, UPDATE, DELETE) to database users or roles.</p>
          </div>
          <div class="comp-box">
            <div class="comp-icon">🚫</div>
            <h3>2. REVOKE</h3>
            <p>Withdraws previously granted privileges from users or roles, immediately restricting access.</p>
          </div>
        </div>
      </section>

      <!-- Section 2: GRANT Command -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">6.2</span> The GRANT Statement
        </h2>
        <p class="section-p">
          Use <code>GRANT</code> to provide read, write, or administrative access to a user on specific databases or tables:
        </p>

        <app-sql-code-box
          title="GRANT Syntax &amp; Examples"
          [code]="grantCode"
          tableHint="Grants SELECT &amp; INSERT permissions on students table"
        ></app-sql-code-box>
      </section>

      <!-- Section 3: REVOKE Command -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">6.3</span> The REVOKE Statement
        </h2>
        <p class="section-p">
          Use <code>REVOKE</code> to remove privileges when a user's role changes or access needs to be revoked:
        </p>

        <app-sql-code-box
          title="REVOKE Syntax &amp; Examples"
          [code]="revokeCode"
          tableHint="Removes INSERT access from developer_user"
        ></app-sql-code-box>
      </section>

      <!-- Navigation Footer -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/dql" class="nav-btn prev">
          <span>← 5. DQL (Query Language)</span>
        </a>
        <a routerLink="/developer-tools/sql/tcl" class="nav-btn next">
          <span>7. TCL (Transactions) →</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .chapter-content {
      width: 100%;
    }
    .glass {
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
    }
    .chapter-header {
      margin-bottom: 2rem;
    }
    .chapter-meta {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .badge-cat {
      background: rgba(139, 92, 246, 0.2);
      color: #c4b5fd;
      border: 1px solid rgba(139, 92, 246, 0.35);
      padding: 0.2rem 0.6rem;
      border-radius: 99px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .badge-slides {
      background: rgba(6, 182, 212, 0.15);
      color: #67e8f9;
      border: 1px solid rgba(6, 182, 212, 0.3);
      padding: 0.2rem 0.6rem;
      border-radius: 99px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .chapter-title {
      font-size: 2rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
    }
    .chapter-subtitle {
      font-size: 1rem;
      color: #94a3b8;
      line-height: 1.6;
      margin: 0;
    }
    .content-card {
      padding: 1.75rem;
      margin-bottom: 1.5rem;
    }
    .section-heading {
      font-size: 1.3rem;
      font-weight: 700;
      color: #f1f5f9;
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .heading-num {
      color: #8b5cf6;
      font-family: monospace;
    }
    .section-p {
      color: #cbd5e1;
      font-size: 0.95rem;
      line-height: 1.7;
      margin-bottom: 1.25rem;
    }
    code {
      background: rgba(0, 0, 0, 0.3);
      color: #a78bfa;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
    }
    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .comp-box {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 1.25rem;
    }
    .comp-icon {
      font-size: 1.6rem;
      margin-bottom: 0.5rem;
    }
    .comp-box h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.4rem 0;
    }
    .comp-box p {
      color: #94a3b8;
      font-size: 0.88rem;
      line-height: 1.5;
      margin: 0;
    }
    .chapter-nav-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .nav-btn {
      padding: 0.65rem 1.25rem;
      border-radius: 10px;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
      transition: all 0.2s;
    }
    .nav-btn:hover {
      background: rgba(139, 92, 246, 0.25);
      border-color: rgba(139, 92, 246, 0.4);
      color: #ffffff;
    }
    @media (max-width: 768px) {
      .comparison-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SqlDclComponent {
  grantCode = `-- 1. Grant SELECT privilege on students table to a specific user
GRANT SELECT ON school.students TO 'report_user'@'localhost';

-- 2. Grant multiple privileges on a table
GRANT SELECT, INSERT, UPDATE ON school.students TO 'app_user'@'%';

-- 3. Grant ALL privileges on an entire database
GRANT ALL PRIVILEGES ON school.* TO 'admin_user'@'localhost';

-- Apply changes immediately
FLUSH PRIVILEGES;`;

  revokeCode = `-- 1. Revoke INSERT privilege from app_user
REVOKE INSERT ON school.students FROM 'app_user'@'%';

-- 2. Revoke all privileges on a database
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'admin_user'@'localhost';

-- Apply changes immediately
FLUSH PRIVILEGES;`;
}
