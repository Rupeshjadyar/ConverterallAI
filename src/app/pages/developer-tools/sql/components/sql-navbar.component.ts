import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sql-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sql-navbar.component.html',
  styleUrls: ['./sql-navbar.component.css']
})
export class SqlNavbarComponent {}
