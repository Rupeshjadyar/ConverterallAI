import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-joins',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  templateUrl: './sql-joins.component.html',
  styleUrls: ['./sql-joins.component.css']
})
export class SqlJoinsComponent {}
