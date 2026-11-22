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
  templateUrl: './sql-wrapper.component.html',
  styleUrls: ['./sql-wrapper.component.css']
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
