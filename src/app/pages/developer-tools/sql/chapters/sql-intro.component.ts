import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SqlCodeBoxComponent } from '../components/sql-code-box.component';

@Component({
  selector: 'app-sql-intro',
  standalone: true,
  imports: [CommonModule, RouterModule, SqlCodeBoxComponent],
  templateUrl: './sql-intro.component.html',
  styleUrls: ['./sql-intro.component.css']
})
export class SqlIntroComponent {}
