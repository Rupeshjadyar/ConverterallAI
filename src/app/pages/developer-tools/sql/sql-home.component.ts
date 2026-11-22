import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-sql-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sql-home.component.html',
  styleUrls: ['./sql-home.component.css']
})
export class SqlHomeComponent {}

