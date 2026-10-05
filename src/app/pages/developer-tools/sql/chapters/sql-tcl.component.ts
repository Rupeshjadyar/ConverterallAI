import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-tcl',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <!-- Chapter Header -->
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Transactions &amp; ACID</span>
          <span class="badge-slides">SQL Commands • TCL</span>
        </div>
        <h1 class="chapter-title">7. TCL (Transaction Control Language)</h1>
        <p class="chapter-subtitle">
          Ensure database consistency and transaction integrity with COMMIT, ROLLBACK, and SAVEPOINT commands.
        </p>
      </div>

      <!-- Section 1: What is a Transaction & ACID? -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">7.1</span> What is a Transaction?
        </h2>
        <p class="section-p">
          A <strong>Transaction</strong> is a sequence of one or more SQL operations treated as a single, indivisible logical unit of work. Either all operations succeed (COMMIT), or if any fails, all changes are undone (ROLLBACK).
        </p>

        <!-- ACID Properties -->
        <div class="acid-grid">
          <div class="acid-card">
            <span class="acid-letter">A</span>
            <h4>Atomicity</h4>
            <p>All-or-nothing execution. Partial execution never commits.</p>
          </div>
          <div class="acid-card">
            <span class="acid-letter">C</span>
            <h4>Consistency</h4>
            <p>Database transitions strictly from one valid state to another.</p>
          </div>
          <div class="acid-card">
            <span class="acid-letter">I</span>
            <h4>Isolation</h4>
            <p>Concurrent transactions do not interfere with each other.</p>
          </div>
          <div class="acid-card">
            <span class="acid-letter">D</span>
            <h4>Durability</h4>
            <p>Committed changes survive system crashes and power failures.</p>
          </div>
        </div>
      </section>

      <!-- Section 2: Core TCL Commands -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">7.2</span> Core TCL Commands
        </h2>
        
        <div class="tcl-commands-list">
          <div class="tcl-item">
            <span class="tcl-badge">COMMIT</span>
            <p>Permanently saves all changes made during the current transaction to the database disk.</p>
          </div>
          <div class="tcl-item">
            <span class="tcl-badge">ROLLBACK</span>
            <p>Undoes all uncommitted changes, returning the database to the state of the last COMMIT or SAVEPOINT.</p>
          </div>
          <div class="tcl-item">
            <span class="tcl-badge">SAVEPOINT</span>
            <p>Creates an intermediate checkpoint within a transaction that can be rolled back to selectively.</p>
          </div>
        </div>
      </section>

      <!-- Section 3: Practical Transaction Example -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">7.3</span> Practical Bank Transfer Transaction
        </h2>
        <p class="section-p">
          Classic financial ledger transaction transferring $500 from Account 101 to Account 102 with safety checks:
        </p>

        <app-sql-code-box
          title="Bank Transfer with COMMIT &amp; ROLLBACK"
          [code]="tclCode"
          tableHint="Simulates atomic bank transfer across two accounts"
        ></app-sql-code-box>
      </section>

      <!-- Navigation Footer -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/dcl" class="nav-btn prev">
          <span>← 6. DCL (Permissions)</span>
        </a>
        <a routerLink="/developer-tools/sql/joins" class="nav-btn next">
          <span>8. SQL Joins &amp; Venn Diagrams →</span>
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
    .acid-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-top: 1rem;
    }
    .acid-card {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 1.25rem;
      text-align: center;
    }
    .acid-letter {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #8b5cf6, #06b6d4);
      color: #ffffff;
      font-weight: 800;
      font-size: 1.1rem;
      margin-bottom: 0.5rem;
    }
    .acid-card h4 {
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 0.35rem 0;
    }
    .acid-card p {
      font-size: 0.8rem;
      color: #94a3b8;
      margin: 0;
      line-height: 1.4;
    }
    .tcl-commands-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .tcl-item {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 0.85rem 1.25rem;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
    }
    .tcl-badge {
      font-family: monospace;
      font-weight: 800;
      font-size: 0.95rem;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      background: rgba(139, 92, 246, 0.2);
      color: #c4b5fd;
      border: 1px solid rgba(139, 92, 246, 0.35);
      min-width: 90px;
      text-align: center;
    }
    .tcl-item p {
      margin: 0;
      color: #cbd5e1;
      font-size: 0.9rem;
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
    @media (max-width: 860px) {
      .acid-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 520px) {
      .acid-grid { grid-template-columns: 1fr; }
      .tcl-item { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class SqlTclComponent {
  tclCode = `-- 1. Begin atomic transaction
START TRANSACTION;

-- Step A: Deduct $500 from Account 101
UPDATE accounts 
SET balance = balance - 500 
WHERE account_id = 101;

-- Create checkpoint
SAVEPOINT after_deduct;

-- Step B: Credit $500 to Account 102
UPDATE accounts 
SET balance = balance + 500 
WHERE account_id = 102;

-- If any error occurs:
-- ROLLBACK TO after_deduct; -- (or full ROLLBACK;)

-- If all steps succeeded, commit permanently:
COMMIT;`;
}
