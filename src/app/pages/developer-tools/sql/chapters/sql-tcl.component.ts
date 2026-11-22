import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-tcl',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  templateUrl: './sql-tcl.component.html',
  styleUrls: ['./sql-tcl.component.css']
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
