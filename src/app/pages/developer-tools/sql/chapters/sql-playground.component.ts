import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SqlRunnerService, SqlQueryResult, TableSchema } from '../services/sql-runner.service';

@Component({
  selector: 'app-sql-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="playground-container">
      <div class="playground-header">
        <div class="header-text">
          <div class="badge-pill">
            <span class="live-dot"></span> In-Browser SQL Engine
          </div>
          <h1 class="playground-title">SQL Interactive <span class="gradient-text">Playground & Sandbox</span></h1>
          <p class="playground-desc">
            Execute queries directly in your browser against pre-seeded relational tables from the PPT course slides.
          </p>
        </div>
        <div class="preset-wrapper">
          <label class="preset-label">Load Query Preset:</label>
          <select [(ngModel)]="selectedPreset" (change)="loadPreset()" class="preset-select">
            <option value="">-- Choose Example Query from PPT --</option>
            <option *ngFor="let p of presets" [value]="p.query">{{ p.name }}</option>
          </select>
        </div>
      </div>

      <div class="playground-layout">
        <!-- Main Editor & Results -->
        <div class="main-column">
          <!-- Editor card -->
          <div class="editor-card glass">
            <div class="editor-bar">
              <div class="window-dots">
                <span class="dot dot-red"></span>
                <span class="dot dot-yellow"></span>
                <span class="dot dot-green"></span>
                <span class="bar-title">MySQL Query Terminal</span>
              </div>
              <div class="editor-actions">
                <button class="tool-btn reset-btn" (click)="resetDb()" title="Reset tables to default">
                  🔄 Reset DB
                </button>
                <button class="tool-btn clear-btn" (click)="queryText = ''" title="Clear input">
                  ✕ Clear
                </button>
                <button class="run-btn" (click)="runQuery()">
                  ▶ Execute Query (Ctrl+Enter)
                </button>
              </div>
            </div>

            <div class="editor-textarea-wrapper">
              <textarea 
                [(ngModel)]="queryText" 
                (keydown.control.enter)="runQuery()"
                (keydown.meta.enter)="runQuery()"
                placeholder="-- Type your SQL query here e.g.&#10;SELECT * FROM students WHERE age >= 19;&#10;SELECT city, COUNT(name) FROM employees GROUP BY city;"
                class="sql-input"
                rows="6"
              ></textarea>
            </div>
          </div>

          <!-- Result Area -->
          <div class="results-card glass">
            <div class="results-header">
              <div class="results-title-row">
                <span class="res-title">Query Results</span>
                <span *ngIf="lastResult?.executionTimeMs !== undefined" class="res-badge">
                  ⏱️ {{ lastResult?.executionTimeMs }} ms • {{ lastResult?.rowCount }} rows
                </span>
              </div>
              <div *ngIf="lastResult?.message" class="status-msg">
                {{ lastResult?.message }}
              </div>
            </div>

            <!-- Error banner -->
            <div *ngIf="lastResult?.error" class="error-banner">
              <span class="error-icon">⚠️</span>
              <div class="error-text">
                <div class="error-head">SQL Execution Error</div>
                <div class="error-body">{{ lastResult?.error }}</div>
              </div>
            </div>

            <!-- Table View -->
            <div *ngIf="lastResult && !lastResult.error" class="table-scroll-container">
              <table *ngIf="lastResult.columns.length > 0" class="sql-table">
                <thead>
                  <tr>
                    <th *ngFor="let col of lastResult.columns">{{ col }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let row of lastResult.rows; let rIdx = index" [class.even-row]="rIdx % 2 === 0">
                    <td *ngFor="let cell of row">
                      <span *ngIf="cell === null" class="null-tag">NULL</span>
                      <span *ngIf="cell !== null">{{ cell }}</span>
                    </td>
                  </tr>
                  <tr *ngIf="lastResult.rows.length === 0">
                    <td [attr.colspan]="lastResult.columns.length" class="empty-set">
                      Empty set (0 rows returned)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div *ngIf="!lastResult" class="placeholder-state">
              <div class="placeholder-icon">💻</div>
              <p>Type an SQL query above or choose a preset to view live execution results.</p>
            </div>
          </div>
        </div>

        <!-- Sidebar: Table Schema Explorer -->
        <div class="schema-sidebar glass">
          <div class="schema-header">
            <h3>🗄️ Available Database Tables</h3>
            <span class="schema-hint">Click a table to inspect or query</span>
          </div>

          <div class="tables-list">
            <div *ngFor="let table of tables" class="table-card">
              <div class="table-head-row" (click)="selectTable(table.name)">
                <span class="table-icon">📄</span>
                <span class="table-name">{{ table.name }}</span>
                <span class="table-rows-tag">{{ table.rowCount }} rows</span>
              </div>
              <div class="columns-chips">
                <span *ngFor="let col of table.columns" class="col-chip" [class.pri-col]="col.key === 'PRI'">
                  {{ col.name }} <small *ngIf="col.key === 'PRI'">🔑</small>
                </span>
              </div>
            </div>
          </div>

          <div class="help-box">
            <div class="help-title">💡 Supported SQL Syntax:</div>
            <ul class="help-list">
              <li><code>SELECT ... FROM ... [WHERE ...]</code></li>
              <li><code>[INNER | LEFT | RIGHT] JOIN ... ON ...</code></li>
              <li><code>GROUP BY ... [HAVING ...]</code></li>
              <li><code>ORDER BY ... [ASC | DESC]</code></li>
              <li><code>LIMIT [offset,] count</code></li>
              <li><code>INSERT INTO ... VALUES (...)</code></li>
              <li><code>UPDATE ... SET ... WHERE ...</code></li>
              <li><code>DELETE FROM ... WHERE ...</code></li>
              <li><code>SHOW TABLES / DESCRIBE table</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .playground-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .playground-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: rgba(124, 58, 237, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.3);
      border-radius: 999px;
      font-size: 0.8rem;
      color: #c084fc;
      margin-bottom: 0.75rem;
      font-weight: 500;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
    .playground-title {
      font-size: 2.1rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }
    .gradient-text {
      background: linear-gradient(135deg, #c084fc 0%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .playground-desc {
      color: #94a3b8;
      font-size: 0.95rem;
      margin: 0;
      max-width: 650px;
    }
    .preset-wrapper {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.85rem 1.25rem;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .preset-label {
      font-size: 0.8rem;
      color: #cbd5e1;
      font-weight: 600;
    }
    .preset-select {
      background: #0b0f1a;
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: #f1f5f9;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      outline: none;
      min-width: 280px;
      cursor: pointer;
    }
    .preset-select:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
    }

    .playground-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 1.5rem;
      align-items: start;
    }
    @media (max-width: 980px) {
      .playground-layout {
        grid-template-columns: 1fr;
      }
    }

    .main-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .editor-card, .results-card, .schema-sidebar {
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }

    .editor-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.25rem;
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-wrap: wrap;
      gap: 8px;
    }
    .window-dots {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }
    .bar-title {
      font-size: 0.82rem;
      color: #94a3b8;
      margin-left: 8px;
      font-family: monospace;
    }
    .editor-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tool-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
      padding: 5px 12px;
      border-radius: 8px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tool-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }
    .run-btn {
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
      border: none;
      color: #fff;
      font-weight: 600;
      padding: 6px 16px;
      border-radius: 8px;
      font-size: 0.82rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
      transition: all 0.2s;
    }
    .run-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.6);
    }

    .editor-textarea-wrapper {
      padding: 1rem 1.25rem;
      background: rgba(3, 7, 18, 0.8);
    }
    .sql-input {
      width: 100%;
      background: transparent;
      border: none;
      color: #38bdf8;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.95rem;
      line-height: 1.6;
      resize: vertical;
      outline: none;
    }
    .sql-input::placeholder {
      color: #475569;
    }

    /* Results */
    .results-card {
      min-height: 280px;
    }
    .results-header {
      padding: 0.85rem 1.25rem;
      background: rgba(0, 0, 0, 0.25);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
    .results-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .res-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #e2e8f0;
    }
    .res-badge {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 6px;
      font-family: monospace;
    }
    .status-msg {
      font-size: 0.8rem;
      color: #38bdf8;
      font-family: monospace;
    }

    .error-banner {
      margin: 1rem 1.25rem;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 10px;
      padding: 0.85rem 1rem;
      display: flex;
      gap: 12px;
      align-items: flex-start;
      color: #fca5a5;
    }
    .error-head {
      font-weight: 600;
      font-size: 0.85rem;
    }
    .error-body {
      font-size: 0.82rem;
      font-family: monospace;
      margin-top: 2px;
    }

    .table-scroll-container {
      overflow-x: auto;
      max-height: 480px;
      overflow-y: auto;
    }
    .sql-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      text-align: left;
    }
    .sql-table th {
      background: rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
      padding: 10px 14px;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .sql-table td {
      padding: 9px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: #f1f5f9;
    }
    .even-row {
      background: rgba(255, 255, 255, 0.015);
    }
    .null-tag {
      color: #f59e0b;
      font-style: italic;
      background: rgba(245, 158, 11, 0.15);
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .empty-set {
      text-align: center;
      color: #64748b;
      padding: 2.5rem !important;
      font-style: italic;
    }

    .placeholder-state {
      padding: 3rem 1.5rem;
      text-align: center;
      color: #64748b;
    }
    .placeholder-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      opacity: 0.5;
    }

    /* Schema sidebar */
    .schema-sidebar {
      padding: 1.25rem;
    }
    .schema-header h3 {
      font-size: 0.95rem;
      margin: 0 0 4px 0;
      color: #ffffff;
    }
    .schema-hint {
      font-size: 0.75rem;
      color: #64748b;
      display: block;
      margin-bottom: 1rem;
    }
    .tables-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 1.5rem;
    }
    .table-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 10px;
      padding: 0.65rem 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .table-card:hover {
      background: rgba(255, 255, 255, 0.07);
      border-color: rgba(139, 92, 246, 0.4);
    }
    .table-head-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .table-name {
      font-weight: 600;
      font-size: 0.85rem;
      color: #38bdf8;
      font-family: monospace;
      margin-left: 6px;
      flex-grow: 1;
    }
    .table-rows-tag {
      font-size: 0.72rem;
      color: #94a3b8;
      background: rgba(255, 255, 255, 0.06);
      padding: 1px 6px;
      border-radius: 4px;
    }
    .columns-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .col-chip {
      font-size: 0.7rem;
      background: rgba(0, 0, 0, 0.4);
      color: #94a3b8;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    .col-chip.pri-col {
      color: #facc15;
      border: 1px solid rgba(250, 204, 21, 0.3);
    }

    .help-box {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 1rem;
    }
    .help-title {
      font-size: 0.8rem;
      color: #cbd5e1;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .help-list {
      margin: 0;
      padding-left: 1.25rem;
      font-size: 0.75rem;
      color: #94a3b8;
      line-height: 1.7;
    }
    .help-list code {
      color: #c084fc;
      background: rgba(0, 0, 0, 0.3);
      padding: 1px 4px;
      border-radius: 3px;
    }
  `]
})
export class SqlPlaygroundComponent implements OnInit {
  private sqlRunner = inject(SqlRunnerService);
  private route = inject(ActivatedRoute);

  queryText = 'SELECT * FROM students;';
  selectedPreset = '';
  lastResult: SqlQueryResult | null = null;
  tables: TableSchema[] = [];

  presets = [
    { name: '1. Select All Students', query: 'SELECT * FROM students;' },
    { name: '2. Select Specific Columns (Name, Age)', query: 'SELECT name, age FROM students;' },
    { name: '3. SELECT DISTINCT Cities', query: 'SELECT DISTINCT city FROM employees;' },
    { name: '4. Filter with WHERE (Age >= 20)', query: 'SELECT * FROM students WHERE age >= 20;' },
    { name: '5. Logical AND (Age >= 18 AND Marks > 85)', query: 'SELECT * FROM students WHERE age >= 18 AND marks > 85;' },
    { name: '6. Logical OR (City = "Delhi" OR City = "Bihar")', query: 'SELECT name, address FROM students WHERE address = "Delhi" OR address = "Bihar";' },
    { name: '7. Range with BETWEEN (Marks 80 to 90)', query: 'SELECT * FROM students WHERE marks BETWEEN 80 AND 90;' },
    { name: '8. Membership with IN (Dept 4 or 5)', query: 'SELECT name, salary, dept_no FROM employees WHERE dept_no IN (4, 5);' },
    { name: '9. Pattern Match with LIKE ("A%")', query: 'SELECT * FROM employees WHERE name LIKE "A%";' },
    { name: '10. Aggregate COUNT and AVG Salary', query: 'SELECT COUNT(*), AVG(salary) FROM employees;' },
    { name: '11. GROUP BY City with COUNT', query: 'SELECT city, COUNT(name) FROM employees GROUP BY city;' },
    { name: '12. GROUP BY City with SUM & HAVING > 30000', query: 'SELECT city, SUM(salary) FROM employees GROUP BY city HAVING SUM(salary) > 30000;' },
    { name: '13. INNER JOIN students & course', query: 'SELECT students.roll_no, course.course_id, students.name FROM students INNER JOIN course ON students.roll_no = course.roll_no;' },
    { name: '14. LEFT JOIN students & course', query: 'SELECT students.roll_no, course.course_id, students.name FROM students LEFT JOIN course ON students.roll_no = course.roll_no;' },
    { name: '15. ORDER BY Salary DESC with LIMIT 5', query: 'SELECT name, salary, designation FROM employees ORDER BY salary DESC LIMIT 5;' },
    { name: '16. String Functions (CONCAT, LOWER, UPPER)', query: 'SELECT CONCAT("Hello", " ", "World") AS greeting;' },
    { name: '17. Math Functions (MOD, POWER, SQRT)', query: 'SELECT MOD(9, 5) AS remainder, POWER(4, 2) AS power, SQRT(144) AS root;' },
    { name: '18. Date Functions (NOW, CURDATE)', query: 'SELECT NOW() AS current_dt, CURDATE() AS current_date;' }
  ];

  ngOnInit() {
    this.refreshTables();
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.queryText = params['q'];
        this.runQuery();
      } else {
        this.runQuery();
      }
    });
  }

  refreshTables() {
    this.tables = this.sqlRunner.getTableSchemas();
  }

  runQuery() {
    this.lastResult = this.sqlRunner.execute(this.queryText);
    this.refreshTables();
  }

  loadPreset() {
    if (this.selectedPreset) {
      this.queryText = this.selectedPreset;
      this.runQuery();
    }
  }

  selectTable(tableName: string) {
    this.queryText = `SELECT * FROM ${tableName};`;
    this.runQuery();
  }

  resetDb() {
    this.sqlRunner.resetDatabase();
    this.refreshTables();
    this.runQuery();
  }
}
