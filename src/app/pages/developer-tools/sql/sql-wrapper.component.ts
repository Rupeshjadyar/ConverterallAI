import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { SQL_TOPICS, SqlTopicItem } from './sql.models';
import { SqlNavbarComponent } from './components/sql-navbar.component';

@Component({
  selector: 'app-sql-wrapper',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SqlNavbarComponent],
  template: `
    <div class="sql-master-wrapper">
      <!-- Background Ambient Glow -->
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>

      <div class="sql-container">
        <!-- Top Breadcrumb Bar -->
        <div class="sql-breadcrumbs">
          <a routerLink="/" class="crumb-link">🏠 Home</a>
          <span class="crumb-separator">/</span>
          <a routerLink="/developer-tools" class="crumb-link">Developer Tools</a>
          <span class="crumb-separator">/</span>
          <span class="crumb-current">SQL</span>
        </div>

        <!-- SQL Internal Navbar (Introduction / Syntax / DDL / DML / DQL / DCL / TCL / Joins) -->
        <app-sql-navbar></app-sql-navbar>

        <!-- Master Two-Column Layout -->
        <div class="sql-layout">
          <!-- Sidebar Navigation -->
          <aside class="sql-sidebar glass" [class.mobile-expanded]="sidebarOpen()">
            <div class="sidebar-header">
              <div class="brand-row">
                <span class="sql-badge-icon">🗄️</span>
                <div>
                  <h3 class="sidebar-title">MySQL Masterclass</h3>
                  <span class="sidebar-subtitle">102 Slides • Complete Reference</span>
                </div>
              </div>
              <button class="mobile-toggle" (click)="toggleSidebar()">
                {{ sidebarOpen() ? '✕' : '☰ Menu' }}
              </button>
            </div>

            <!-- Search Topics Filter -->
            <div class="search-box">
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                placeholder="Search topics (e.g. JOIN, GROUP, CASCADE)..." 
                class="search-input"
              />
              <button *ngIf="searchQuery" (click)="searchQuery = ''" class="clear-search">✕</button>
            </div>

            <!-- Playground Quick Link -->
            <a 
              routerLink="/developer-tools/sql/playground" 
              routerLinkActive="active-playground" 
              class="playground-shortcut"
              (click)="closeSidebarOnMobile()"
            >
              <span class="shortcut-icon">💻</span>
              <div class="shortcut-text">
                <strong>Live SQL Playground</strong>
                <small>Run queries in browser</small>
              </div>
              <span class="shortcut-pill">RUN</span>
            </a>

            <!-- Chapter Navigation List -->
            <div class="chapters-nav">
              <div *ngFor="let cat of topicCategories" class="cat-group">
                <div class="cat-title">{{ cat }}</div>
                <div class="cat-items">
                  <a 
                    *ngFor="let topic of getTopicsByCat(cat)" 
                    [routerLink]="['/developer-tools/sql', topic.slug]" 
                    routerLinkActive="active-chapter" 
                    class="chapter-link"
                    (click)="closeSidebarOnMobile()"
                  >
                    <span class="topic-icon">{{ topic.icon }}</span>
                    <div class="topic-info">
                      <div class="topic-title">{{ topic.title }}</div>
                      <div class="topic-meta">
                        <span>{{ topic.slideRange }}</span>
                      </div>
                    </div>
                    <span *ngIf="topic.badge" class="topic-mini-badge" [ngClass]="topic.badge.toLowerCase()">
                      {{ topic.badge }}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </aside>

          <!-- Main Content Stage -->
          <main class="sql-main-stage">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--bg-color, #030303);
      color: var(--text-color, #e2e8f0);
    }
    .sql-master-wrapper {
      position: relative;
      min-height: 100vh;
      padding: 5rem 0 6rem 0;
      overflow-x: hidden;
    }
    .sql-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 1.5rem;
      position: relative;
      z-index: 2;
    }

    /* Ambient Glow Orbs */
    .glow-orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.18;
      pointer-events: none;
      z-index: 1;
    }
    .orb-1 {
      width: 500px;
      height: 500px;
      background: #7c3aed;
      top: 10%;
      left: -150px;
    }
    .orb-2 {
      width: 450px;
      height: 450px;
      background: #0284c7;
      bottom: 10%;
      right: -150px;
    }

    /* Breadcrumbs */
    .sql-breadcrumbs {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      margin-bottom: 1.5rem;
      color: #94a3b8;
    }
    .crumb-link {
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.2s;
    }
    .crumb-link:hover {
      color: #c084fc;
    }
    .crumb-separator {
      color: #475569;
    }
    .crumb-current {
      color: #ffffff;
      font-weight: 600;
    }

    /* Master Layout */
    .sql-layout {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 2rem;
      align-items: start;
    }
    @media (max-width: 1024px) {
      .sql-layout {
        grid-template-columns: 1fr;
      }
    }

    /* Sidebar */
    .sql-sidebar {
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 1.25rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      position: sticky;
      top: 80px;
      max-height: calc(100vh - 100px);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    @media (max-width: 1024px) {
      .sql-sidebar {
        position: static;
        max-height: none;
      }
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .sql-badge-icon {
      font-size: 1.8rem;
    }
    .sidebar-title {
      font-size: 1rem;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
    }
    .sidebar-subtitle {
      font-size: 0.72rem;
      color: #94a3b8;
    }
    .mobile-toggle {
      display: none;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.8rem;
      cursor: pointer;
    }
    @media (max-width: 1024px) {
      .mobile-toggle { display: block; }
      .chapters-nav, .search-box, .playground-shortcut {
        display: none;
      }
      .sql-sidebar.mobile-expanded .chapters-nav,
      .sql-sidebar.mobile-expanded .search-box,
      .sql-sidebar.mobile-expanded .playground-shortcut {
        display: flex;
      }
    }

    .search-box {
      position: relative;
    }
    .search-input {
      width: 100%;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 8px 30px 8px 12px;
      color: #f1f5f9;
      font-size: 0.82rem;
      outline: none;
      box-sizing: border-box;
      transition: all 0.2s;
    }
    .search-input:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 12px rgba(139, 92, 246, 0.35);
    }
    .clear-search {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
    }

    .playground-shortcut {
      display: flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(59, 130, 246, 0.25));
      border: 1px solid rgba(139, 92, 246, 0.4);
      padding: 0.75rem 1rem;
      border-radius: 12px;
      text-decoration: none;
      color: #ffffff;
      transition: all 0.25s;
    }
    .playground-shortcut:hover, .playground-shortcut.active-playground {
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.45), rgba(59, 130, 246, 0.45));
      border-color: #c084fc;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.3);
    }
    .shortcut-icon { font-size: 1.3rem; }
    .shortcut-text { flex-grow: 1; display: flex; flex-direction: column; }
    .shortcut-text strong { font-size: 0.88rem; }
    .shortcut-text small { font-size: 0.72rem; color: #94a3b8; }
    .shortcut-pill { background: #10b981; color: #000; font-weight: 800; font-size: 0.68rem; padding: 2px 7px; border-radius: 4px; }

    /* Chapters Nav */
    .chapters-nav {
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding-right: 4px;
    }
    .cat-title {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      font-weight: 700;
      margin-bottom: 6px;
      padding-left: 6px;
    }
    .cat-items {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .chapter-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 10px;
      border-radius: 10px;
      text-decoration: none;
      color: #cbd5e1;
      font-size: 0.82rem;
      transition: all 0.2s;
    }
    .chapter-link:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #ffffff;
      transform: translateX(3px);
    }
    .chapter-link.active-chapter {
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(59, 130, 246, 0.3));
      border: 1px solid rgba(139, 92, 246, 0.5);
      color: #ffffff;
      font-weight: 600;
    }
    .topic-icon { font-size: 1rem; }
    .topic-info { flex-grow: 1; display: flex; flex-direction: column; }
    .topic-title { font-size: 0.82rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 175px; }
    .topic-meta { font-size: 0.7rem; color: #64748b; font-family: monospace; }
    .topic-mini-badge {
      font-size: 0.65rem;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 600;
    }
    .topic-mini-badge.essential { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
    .topic-mini-badge.core { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }
    .topic-mini-badge.advanced { background: rgba(245, 158, 11, 0.2); color: #fcd34d; }
    .topic-mini-badge.interactive { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; }

    /* Main Stage */
    .sql-main-stage {
      min-width: 0;
    }
  `]
})
export class SqlWrapperComponent implements OnInit {
  topics = SQL_TOPICS;
  searchQuery = '';
  sidebarOpen = signal<boolean>(false);

  topicCategories: Array<SqlTopicItem['category']> = [
    'Fundamentals',
    'Data Types & Rules',
    'Commands (DDL & DML)',
    'Querying & Functions',
    'Advanced & Architecture'
  ];

  ngOnInit() {}

  get filteredTopics(): SqlTopicItem[] {
    if (!this.searchQuery) return this.topics;
    const q = this.searchQuery.toLowerCase();
    return this.topics.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.shortDesc.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q)
    );
  }

  getTopicsByCat(cat: SqlTopicItem['category']): SqlTopicItem[] {
    return this.filteredTopics.filter(t => t.category === cat);
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebarOnMobile() {
    this.sidebarOpen.set(false);
  }
}
