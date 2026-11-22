import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SqlRunnerService, SqlQueryResult, TableSchema } from '../services/sql-runner.service';

@Component({
  selector: 'app-sql-playground',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sql-playground.component.html',
  styleUrls: ['./sql-playground.component.css']
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
