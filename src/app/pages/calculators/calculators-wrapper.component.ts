import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-calculators-wrapper',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './calculators-wrapper.component.html',
  styleUrls: ['./calculators-wrapper.component.css']
})
export class CalculatorsWrapperComponent {
  private router = inject(Router);

  isSubPage(): boolean {
    const url = this.router.url.split('?')[0];
    return url !== '/calculators' && url !== '/calculators/';
  }
}
