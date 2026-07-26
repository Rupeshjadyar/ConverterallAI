import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-calculators-wrapper',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="calculators-page-wrapper">
      <div class="container" *ngIf="isSubPage(); else hubView">
        <div class="back-navigation">
          <a routerLink="/calculators" class="back-link">
            <span>←</span> Back to Calculators Hub
          </a>
        </div>
        <div class="calculator-shell glass">
          <router-outlet></router-outlet>
        </div>
      </div>
      
      <ng-template #hubView>
        <router-outlet></router-outlet>
      </ng-template>
    </div>
  `,
  styles: [`
    .calculators-page-wrapper {
      position: relative;
      min-height: 100vh;
      padding-bottom: 5rem;
      z-index: 5;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .back-navigation {
      margin: 2.5rem auto 1.5rem auto;
    }
    .calculator-shell {
      border-radius: 24px;
      background: var(--glass-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow);
      padding: 2.5rem 2rem;
      overflow: hidden;
      transition: var(--transition);
    }
    @media (max-width: 640px) {
      .calculator-shell {
        padding: 1.5rem 1rem;
        border-radius: 16px;
      }
    }
  `]
})
export class CalculatorsWrapperComponent {
  private router = inject(Router);

  isSubPage(): boolean {
    const url = this.router.url.split('?')[0];
    return url !== '/calculators' && url !== '/calculators/';
  }
}
