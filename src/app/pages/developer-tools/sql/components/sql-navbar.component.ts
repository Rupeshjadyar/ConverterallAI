import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sql-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="sql-navbar glass">
      <div class="navbar-wrapper">
        <!-- Brand / SQL Home Link -->
        <a 
          routerLink="/developer-tools/sql" 
          [routerLinkActiveOptions]="{ exact: true }" 
          routerLinkActive="active-home"
          class="sql-home-btn"
          title="SQL Home">
          <span class="home-icon">🗄️</span>
          <span class="home-title">SQL Home</span>
        </a>

        <div class="nav-divider"></div>

        <!-- Scrollable Navigation Tabs -->
        <div class="sql-tabs-track">
          <a routerLink="/developer-tools/sql/intro" routerLinkActive="active-tab" class="sql-tab" title="1. Introduction & RDBMS Basics">
            <span class="tab-icon">📚</span>
            <span class="tab-text">Introduction</span>
          </a>

          <a routerLink="/developer-tools/sql/syntax" routerLinkActive="active-tab" class="sql-tab" title="2. SQL Syntax & Commands">
            <span class="tab-icon">⚡</span>
            <span class="tab-text">SQL Syntax</span>
          </a>

          <a routerLink="/developer-tools/sql/ddl" routerLinkActive="active-tab" class="sql-tab" title="3. DDL (Data Definition Language)">
            <span class="tab-icon">🏗️</span>
            <span class="tab-text">DDL</span>
          </a>

          <a routerLink="/developer-tools/sql/dml" routerLinkActive="active-tab" class="sql-tab" title="4. DML (Data Manipulation Language)">
            <span class="tab-icon">✏️</span>
            <span class="tab-text">DML</span>
          </a>

          <a routerLink="/developer-tools/sql/dql" routerLinkActive="active-tab" class="sql-tab" title="5. DQL (Data Query Language)">
            <span class="tab-icon">🔍</span>
            <span class="tab-text">DQL</span>
          </a>

          <a routerLink="/developer-tools/sql/dcl" routerLinkActive="active-tab" class="sql-tab" title="6. DCL (Data Control Language)">
            <span class="tab-icon">🛡️</span>
            <span class="tab-text">DCL</span>
          </a>

          <a routerLink="/developer-tools/sql/tcl" routerLinkActive="active-tab" class="sql-tab" title="7. TCL (Transaction Control Language)">
            <span class="tab-icon">🔄</span>
            <span class="tab-text">TCL</span>
          </a>

          <a routerLink="/developer-tools/sql/joins" routerLinkActive="active-tab" class="sql-tab" title="8. SQL Joins & Venn Diagrams">
            <span class="tab-icon">🔀</span>
            <span class="tab-text">Joins</span>
          </a>

          <a routerLink="/developer-tools/sql/playground" routerLinkActive="active-tab" class="sql-tab playground-tab" title="Interactive SQL Playground">
            <span class="tab-icon">💻</span>
            <span class="tab-text">Playground</span>
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      position: sticky;
      top: 60px;
      z-index: 1020;
      margin-bottom: 1.5rem;
    }

    .glass {
      background: rgba(11, 15, 25, 0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: 14px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(139, 92, 246, 0.12);
    }

    .navbar-wrapper {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .navbar-wrapper::-webkit-scrollbar {
      display: none;
    }

    .sql-home-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.85rem;
      border-radius: 10px;
      text-decoration: none;
      color: #cbd5e1;
      font-size: 0.85rem;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.2s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .sql-home-btn:hover {
      background: rgba(139, 92, 246, 0.2);
      color: #ffffff;
      border-color: rgba(139, 92, 246, 0.4);
    }

    .sql-home-btn.active-home {
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      color: #ffffff;
      border-color: #8b5cf6;
      box-shadow: 0 2px 12px rgba(124, 58, 237, 0.4);
    }

    .home-icon {
      font-size: 1rem;
    }

    .nav-divider {
      width: 1px;
      height: 24px;
      background: rgba(255, 255, 255, 0.15);
      flex-shrink: 0;
    }

    .sql-tabs-track {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      flex: 1;
    }

    .sql-tab {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 0.85rem;
      border-radius: 10px;
      text-decoration: none;
      color: #94a3b8;
      font-size: 0.82rem;
      font-weight: 600;
      background: transparent;
      border: 1px solid transparent;
      transition: all 0.2s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .sql-tab:hover {
      color: #f1f5f9;
      background: rgba(255, 255, 255, 0.06);
    }

    .sql-tab.active-tab {
      color: #ffffff;
      background: rgba(139, 92, 246, 0.25);
      border-color: rgba(139, 92, 246, 0.5);
      box-shadow: 0 0 16px rgba(139, 92, 246, 0.25);
    }

    .sql-tab.active-tab .tab-text {
      color: #a78bfa;
      font-weight: 700;
    }

    .tab-icon {
      font-size: 0.95rem;
    }

    .playground-tab {
      margin-left: auto;
      background: rgba(6, 182, 212, 0.12);
      border-color: rgba(6, 182, 212, 0.25);
      color: #67e8f9;
    }

    .playground-tab:hover {
      background: rgba(6, 182, 212, 0.25);
      color: #ffffff;
    }

    .playground-tab.active-tab {
      background: linear-gradient(135deg, #0891b2, #06b6d4);
      border-color: #22d3ee;
      color: #ffffff;
      box-shadow: 0 2px 14px rgba(6, 182, 212, 0.4);
    }

    .playground-tab.active-tab .tab-text {
      color: #ffffff;
    }
  `]
})
export class SqlNavbarComponent {}
