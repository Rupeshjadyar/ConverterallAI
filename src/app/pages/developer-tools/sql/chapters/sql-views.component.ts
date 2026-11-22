import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-views',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  templateUrl: './sql-views.component.html',
  styleUrls: ['./sql-views.component.css']
})
export class SqlViewsComponent {}
