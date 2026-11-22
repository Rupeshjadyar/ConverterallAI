import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-dql',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  templateUrl: './sql-dql.component.html',
  styleUrls: ['./sql-dql.component.css']
})
export class SqlDqlComponent {}
