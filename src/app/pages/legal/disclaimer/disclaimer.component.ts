import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.css']
})
export class DisclaimerComponent {}
