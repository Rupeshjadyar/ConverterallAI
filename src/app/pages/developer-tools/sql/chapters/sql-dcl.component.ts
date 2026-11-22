import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-dcl',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  templateUrl: './sql-dcl.component.html',
  styleUrls: ['./sql-dcl.component.css']
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
