import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-intro',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <!-- Chapter Header -->
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Fundamentals</span>
          <span class="badge-slides">PPT Slides 1 - 4</span>
        </div>
        <h1 class="chapter-title">1. Introduction to MySQL &amp; RDBMS</h1>
        <p class="chapter-subtitle">
          Master the building blocks of modern databases: Data, Database Systems, Relational Models, Tables, Columns, Records, and Structured Query Language.
        </p>
      </div>

      <!-- Section 1: Data, Database & DBMS -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">1.1</span> Core Concepts: Data, Database &amp; DBMS
        </h2>
        
        <div class="concepts-grid">
          <div class="concept-box">
            <div class="concept-icon">📊</div>
            <h3>1. Data</h3>
            <p>
              <strong>Data</strong> is defined as raw facts, figures, or information that is stored in or processed by a computer system.
            </p>
            <div class="example-tag">
              <strong>Examples:</strong> Information collected for a research paper, email text, student roll numbers, transaction logs.
            </div>
          </div>

          <div class="concept-box">
            <div class="concept-icon">🗄️</div>
            <h3>2. Database</h3>
            <p>
              A <strong>Database</strong> is an organized collection of structured data designed for effortless access, storage, retrieval, and management.
            </p>
            <div class="example-tag">
              <strong>Examples:</strong> School Management Database, Banking Customer Database, Hospital Records.
            </div>
          </div>

          <div class="concept-box">
            <div class="concept-icon">⚙️</div>
            <h3>3. DBMS</h3>
            <p>
              A <strong>Database Management System (DBMS)</strong> is software that controls the creation, maintenance, and secure querying of a database.
            </p>
            <div class="example-tag">
              <strong>Analogy:</strong> DBMS acts as an intelligent <em>File Manager</em> that manages data inside a database rather than raw operating system file systems.
            </div>
          </div>
        </div>
      </section>

      <!-- Section 2: RDBMS & Table Structure -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">1.2</span> Relational Database Management System (RDBMS)
        </h2>
        
        <p class="section-text">
          <strong>RDBMS</strong> stands for <em>Relational Database Management System</em>. Unlike primitive flat-file databases, an RDBMS organizes data into a collection of two-dimensional <strong>tables</strong> (relations), which are interconnected by common fields (keys) between columns.
        </p>

        <div class="info-alert">
          <span class="alert-icon">💡</span>
          <div>
            <strong>Popular RDBMS Engines:</strong> MySQL, MariaDB, Microsoft SQL Server, PostgreSQL, Oracle DB, SQLite.
          </div>
        </div>

        <h3 class="sub-heading">Tables, Fields (Columns) &amp; Records (Rows)</h3>
        <p class="section-text">
          A table represents a relational entity. It organizes information along vertical and horizontal dimensions:
        </p>

        <ul class="feature-list">
          <li><strong>Columns / Fields (Attributes):</strong> The vertical dimensions. A table has a fixed, specified number of columns, each assigned a definite name and data type.</li>
          <li><strong>Rows / Records (Tuples):</strong> The horizontal dimensions. A table can hold any number of records representing individual entity instances.</li>
        </ul>

        <!-- Visual Table Demonstration -->
        <div class="demo-table-wrapper">
          <div class="table-caption">
            <span>Example Table: <code>Employee</code> (Slide 3)</span>
          </div>
          <table class="visual-table">
            <thead>
              <tr>
                <th>Emp_ID (Field)</th>
                <th>Emp_Name (Field)</th>
                <th>Date_of_Birth (Field)</th>
                <th>City (Field)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="highlight-id">201456</span></td>
                <td>David Miller</td>
                <td>11/15/1960</td>
                <td>Chicago</td>
              </tr>
              <tr>
                <td><span class="highlight-id">201457</span></td>
                <td>Sarah Connor</td>
                <td>08/24/1985</td>
                <td>Los Angeles</td>
              </tr>
              <tr>
                <td><span class="highlight-id">201458</span></td>
                <td>Prachiti Rao</td>
                <td>05/12/1992</td>
                <td>Thane</td>
              </tr>
            </tbody>
          </table>
          <div class="table-footer-note">
            <span>Row / Record: [201456, David, 11/15/1960] represents one complete horizontal tuple.</span>
          </div>
        </div>
      </section>

      <!-- Section 3: What is SQL -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">1.3</span> What is SQL &amp; What Can It Do?
        </h2>

        <div class="sql-intro-grid">
          <div class="sql-facts">
            <h3>Key Facts about SQL:</h3>
            <ul class="styled-bullets">
              <li><strong>SQL</strong> stands for <strong>Structured Query Language</strong>.</li>
              <li>SQL was originally developed at IBM and was earlier known as <strong>SEQUEL</strong> (Structured English Query Language).</li>
              <li>It is the universal standard language used to communicate with relational databases (ANSI / ISO certified).</li>
              <li>It executes fundamental operations: <em>Retrieval</em>, <em>Insertion</em>, <em>Updation</em>, and <em>Deletion</em> (CRUD).</li>
            </ul>
          </div>

          <div class="sql-powers">
            <h3>What SQL Can Do:</h3>
            <div class="powers-grid">
              <div class="power-item">⚡ Execute queries against a database</div>
              <div class="power-item">📥 Retrieve data and generate reports</div>
              <div class="power-item">➕ Insert records into existing tables</div>
              <div class="power-item">✏️ Update existing records in a database</div>
              <div class="power-item">🗑️ Delete obsolete records from tables</div>
              <div class="power-item">🏛️ Create brand new databases</div>
              <div class="power-item">🏗️ Create new tables with custom schemas</div>
              <div class="power-item">🪟 Create views (virtual tables)</div>
              <div class="power-item">🔐 Set granular permissions on tables &amp; views</div>
            </div>
          </div>
        </div>

        <app-sql-code-box
          title="Sample SQL Query Demo"
          code="-- Querying the Employee table for active records
SELECT Emp_ID, Emp_Name, Date_of_Birth, City
FROM Employee
WHERE City = 'Thane';"
          output="+--------+--------------+---------------+-------+
| Emp_ID | Emp_Name     | Date_of_Birth | City  |
+--------+--------------+---------------+-------+
| 201458 | Prachiti Rao | 05/12/1992    | Thane |
+--------+--------------+---------------+-------+
1 row in set (0.001 sec)"
        ></app-sql-code-box>
      </section>

      <!-- Chapter Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools" class="nav-btn prev-btn">
          ← Back to Developer Tools
        </a>
        <a routerLink="/developer-tools/sql/commands" class="nav-btn next-btn">
          Next: 2. SQL Commands &amp; Architecture →
        </a>
      </div>
    </div>
  `,
  styles: [`
    .chapter-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .chapter-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 1.5rem;
    }
    .chapter-meta {
      display: flex;
      gap: 8px;
      margin-bottom: 0.75rem;
    }
    .badge-cat {
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.3);
      color: #c084fc;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-slides {
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: #38bdf8;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-family: monospace;
    }
    .chapter-title {
      font-size: 2.2rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }
    .chapter-subtitle {
      color: #94a3b8;
      font-size: 1.05rem;
      line-height: 1.6;
      margin: 0;
      max-width: 820px;
    }

    .content-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }
    .section-heading {
      font-size: 1.35rem;
      color: #ffffff;
      margin: 0 0 1.25rem 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .heading-num {
      color: #8b5cf6;
      font-family: monospace;
      font-weight: 700;
    }
    .section-text {
      color: #cbd5e1;
      font-size: 0.96rem;
      line-height: 1.7;
      margin-bottom: 1.25rem;
    }

    .concepts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.25rem;
      margin-top: 1rem;
    }
    .concept-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 14px;
      padding: 1.5rem;
      transition: all 0.25s;
    }
    .concept-box:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(139, 92, 246, 0.35);
      transform: translateY(-3px);
    }
    .concept-icon {
      font-size: 2rem;
      margin-bottom: 0.75rem;
    }
    .concept-box h3 {
      font-size: 1.1rem;
      color: #f1f5f9;
      margin: 0 0 0.5rem 0;
    }
    .concept-box p {
      color: #94a3b8;
      font-size: 0.9rem;
      line-height: 1.6;
      margin-bottom: 1rem;
    }
    .example-tag {
      background: rgba(0, 0, 0, 0.35);
      border-left: 3px solid #8b5cf6;
      padding: 0.5rem 0.75rem;
      font-size: 0.8rem;
      color: #cbd5e1;
      border-radius: 0 6px 6px 0;
    }

    .info-alert {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 12px;
      padding: 0.9rem 1.25rem;
      color: #bae6fd;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    .sub-heading {
      font-size: 1.15rem;
      color: #f1f5f9;
      margin: 1.5rem 0 0.75rem 0;
    }
    .feature-list {
      color: #cbd5e1;
      font-size: 0.95rem;
      line-height: 1.8;
      padding-left: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .feature-list strong {
      color: #ffffff;
    }

    /* Demo Table */
    .demo-table-wrapper {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      overflow: hidden;
      margin: 1.25rem 0;
    }
    .table-caption {
      padding: 0.6rem 1rem;
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 0.82rem;
      color: #94a3b8;
    }
    .table-caption code {
      color: #38bdf8;
      font-weight: 600;
    }
    .visual-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.88rem;
      text-align: left;
    }
    .visual-table th {
      padding: 10px 16px;
      background: rgba(255, 255, 255, 0.05);
      color: #c084fc;
      font-weight: 600;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .visual-table td {
      padding: 10px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: #f1f5f9;
    }
    .highlight-id {
      color: #38bdf8;
      font-family: monospace;
      font-weight: 600;
    }
    .table-footer-note {
      padding: 0.6rem 1rem;
      background: rgba(255, 255, 255, 0.02);
      font-size: 0.78rem;
      color: #64748b;
    }

    .sql-intro-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
    @media (max-width: 768px) {
      .sql-intro-grid {
        grid-template-columns: 1fr;
      }
    }
    .sql-facts h3, .sql-powers h3 {
      font-size: 1rem;
      color: #ffffff;
      margin: 0 0 0.75rem 0;
    }
    .styled-bullets {
      color: #cbd5e1;
      font-size: 0.92rem;
      line-height: 1.8;
      padding-left: 1.25rem;
      margin: 0;
    }
    .powers-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 6px;
    }
    .power-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 7px 12px;
      border-radius: 8px;
      font-size: 0.84rem;
      color: #e2e8f0;
    }

    .chapter-nav-footer {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }
    .nav-btn {
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }
    .prev-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
    }
    .prev-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }
    .next-btn {
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%);
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35);
    }
    .next-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55);
    }
  `]
})
export class SqlIntroComponent {}
