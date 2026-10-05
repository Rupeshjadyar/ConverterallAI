import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-data-types',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  template: `
    <div class="chapter-content">
      <div class="chapter-header">
        <div class="chapter-meta">
          <span class="badge-cat">Data Types &amp; Rules</span>
          <span class="badge-slides">PPT Slides 9 - 11</span>
        </div>
        <h1 class="chapter-title">3. Data Types in SQL</h1>
        <p class="chapter-subtitle">
          Explore MySQL data types for numbers, dates, times, and strings — including storage sizes, ranges, and optimal column schema selection.
        </p>
      </div>

      <!-- Overview -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">3.1</span> Why Data Types Matter
        </h2>
        <p class="section-text">
          Data types represent the nature of information that can be stored in each table column. When defining a table, every column must have a distinct name and an appropriate data type to guarantee storage efficiency, indexing speed, and domain constraints.
        </p>
        <div class="tip-card">
          <span class="tip-icon">💡</span>
          <div>
            <strong>Rule of Thumb:</strong> Always choose the smallest data type that can safely hold all present and future values to optimize memory cache and disk I/O.
          </div>
        </div>
      </section>

      <!-- 1. Numeric Data Types -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">3.2</span> 1. Numeric Data Types (Slide 9)
        </h2>
        <div class="table-responsive">
          <table class="styled-matrix-table">
            <thead>
              <tr>
                <th>Datatype</th>
                <th>Storage Size</th>
                <th>Description &amp; Range</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>INT</code></td>
                <td><span class="size-pill">4 Bytes</span></td>
                <td>Standard integer (-2,147,483,648 to 2,147,483,647 or 0 to 4,294,967,295 unsigned). Default choice for primary keys.</td>
              </tr>
              <tr>
                <td><code>TINYINT</code></td>
                <td><span class="size-pill">1 Byte</span></td>
                <td>Very small integer (-128 to 127 or 0 to 255 unsigned). Often used for booleans or status flags (0/1).</td>
              </tr>
              <tr>
                <td><code>SMALLINT</code></td>
                <td><span class="size-pill">2 Bytes</span></td>
                <td>Small integer (-32,768 to 32,767 or 0 to 65,535 unsigned). Ideal for year counts or small quantities.</td>
              </tr>
              <tr>
                <td><code>MEDIUMINT</code></td>
                <td><span class="size-pill">3 Bytes</span></td>
                <td>Medium-sized integer (-8,388,608 to 8,388,607 or 0 to 16,777,215 unsigned).</td>
              </tr>
              <tr>
                <td><code>BIGINT</code></td>
                <td><span class="size-pill">8 Bytes</span></td>
                <td>Large integer for immense counts (e.g. global transactions, timestamps in microseconds).</td>
              </tr>
              <tr>
                <td><code>FLOAT(m, d)</code></td>
                <td><span class="size-pill">4 Bytes</span></td>
                <td>Single-precision floating-point number. <em>m</em> is total digits, <em>d</em> is decimals after decimal point.</td>
              </tr>
              <tr>
                <td><code>DOUBLE(m, d)</code></td>
                <td><span class="size-pill">8 Bytes</span></td>
                <td>Double-precision floating-point number for high scientific accuracy calculations.</td>
              </tr>
              <tr>
                <td><code>DECIMAL(m, d)</code></td>
                <td><span class="size-pill">Length + 1 Byte</span></td>
                <td>Unpacked exact fixed-point number. Essential for monetary and financial values (avoids rounding inaccuracies).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 2. Date & Time Data Types -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">3.3</span> 2. Date &amp; Time Data Types (Slide 10)
        </h2>
        <div class="table-responsive">
          <table class="styled-matrix-table">
            <thead>
              <tr>
                <th>Datatype</th>
                <th>Storage Size</th>
                <th>Format &amp; Permitted Range</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>DATE</code></td>
                <td><span class="size-pill">3 Bytes</span></td>
                <td><code>YYYY-MM-DD</code> format. Supported range: <code>1000-01-01</code> to <code>9999-12-31</code>.</td>
              </tr>
              <tr>
                <td><code>DATETIME</code></td>
                <td><span class="size-pill">8 Bytes</span></td>
                <td><code>YYYY-MM-DD HH:MM:SS</code> format. Range: <code>1000-01-01 00:00:00</code> to <code>9999-12-31 23:59:59</code>.</td>
              </tr>
              <tr>
                <td><code>TIMESTAMP</code></td>
                <td><span class="size-pill">4 Bytes</span></td>
                <td>UTC timestamp stored as seconds since Unix epoch: midnight Jan 1, 1970 to Jan 19, 2038. Converts automatically to current timezone.</td>
              </tr>
              <tr>
                <td><code>TIME</code></td>
                <td><span class="size-pill">3 Bytes</span></td>
                <td><code>HH:MM:SS</code> format for elapsed durations or times of day (-838:59:59 to 838:59:59).</td>
              </tr>
              <tr>
                <td><code>YEAR(m)</code></td>
                <td><span class="size-pill">2 Bytes</span></td>
                <td>Stores a year in 2-digit (70 to 69) or 4-digit (1901 to 2155) format.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 3. String Data Types -->
      <section class="content-card glass">
        <h2 class="section-heading">
          <span class="heading-num">3.4</span> 3. String &amp; Text Data Types (Slide 11)
        </h2>
        <div class="table-responsive">
          <table class="styled-matrix-table">
            <thead>
              <tr>
                <th>Datatype</th>
                <th>Storage Rule</th>
                <th>Characteristics &amp; Max Length</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>CHAR(m)</code></td>
                <td>Length <em>m</em> bytes</td>
                <td><strong>Fixed-length</strong> string between 1 and 255 characters. Right-padded with spaces when stored. E.g. <code>CHAR(5)</code> always consumes 5 bytes.</td>
              </tr>
              <tr>
                <td><code>VARCHAR(m)</code></td>
                <td>Length + 1 or 2 bytes</td>
                <td><strong>Variable-length</strong> string. Only occupies actual string length plus length prefix. Best for names, addresses, emails.</td>
              </tr>
              <tr>
                <td><code>BLOB / TEXT</code></td>
                <td>Length + 2 bytes</td>
                <td>Holds long textual data or binary files with maximum length of <strong>65,535 characters</strong> (64 KB).</td>
              </tr>
              <tr>
                <td><code>TINYBLOB / TINYTEXT</code></td>
                <td>Length + 1 byte</td>
                <td>Short BLOB or TEXT column with maximum length of <strong>255 characters</strong>. No length parameter required.</td>
              </tr>
              <tr>
                <td><code>MEDIUMBLOB / MEDIUMTEXT</code></td>
                <td>Length + 3 bytes</td>
                <td>Stores large text documents up to <strong>16,777,215 characters</strong> (~16 MB).</td>
              </tr>
              <tr>
                <td><code>LONGBLOB / LONGTEXT</code></td>
                <td>Length + 4 bytes</td>
                <td>Immense data storage for media / big books up to <strong>4,294,967,295 characters</strong> (~4 GB).</td>
              </tr>
            </tbody>
          </table>
        </div>

        <app-sql-code-box
          title="Creating a Table with Varied Data Types"
          code="CREATE TABLE students (
  roll_no INT,
  name VARCHAR(50),
  marks DECIMAL(5,2),
  date_of_birth DATE,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bio TEXT
);"
        ></app-sql-code-box>
      </section>

      <!-- Footer Navigation -->
      <div class="chapter-nav-footer">
        <a routerLink="/developer-tools/sql/commands" class="nav-btn prev-btn">
          ← 2. SQL Commands &amp; Expressions
        </a>
        <a routerLink="/developer-tools/sql/constraints" class="nav-btn next-btn">
          Next: 4. Constraints in SQL →
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

    .tip-card { display: flex; align-items: center; gap: 12px; background: rgba(139, 92, 246, 0.12); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 12px; padding: 0.9rem 1.25rem; color: #e9d5ff; font-size: 0.9rem; }
    .tip-icon { font-size: 1.3rem; }

    .table-responsive { overflow-x: auto; margin: 1rem 0; }
    .styled-matrix-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
    .styled-matrix-table th { background: rgba(255, 255, 255, 0.05); color: #c084fc; padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
    .styled-matrix-table td { padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #e2e8f0; }
    .styled-matrix-table code { color: #38bdf8; font-family: monospace; font-size: 0.9rem; }
    .size-pill { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.14); padding: 2px 8px; border-radius: 6px; font-size: 0.8rem; font-family: monospace; color: #fbbf24; }

    .chapter-nav-footer { display: flex; justify-content: space-between; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; }
    .nav-btn { padding: 10px 20px; border-radius: 10px; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.2s; }
    .prev-btn { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #94a3b8; }
    .prev-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
    .next-btn { background: linear-gradient(135deg, #7c3aed 0%, #2563eb 100%); color: #ffffff; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35); }
    .next-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(124, 58, 237, 0.55); }
  `]
})
export class SqlDataTypesComponent {}
