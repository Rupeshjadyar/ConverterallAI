import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngIf="showBanner()" class="cookie-banner-wrapper">
      <div class="cookie-banner glass">
        <div class="cookie-content">
          <div class="cookie-icon">🍪</div>
          <div class="cookie-text">
            <h4>We value your privacy</h4>
            <p>
              ConverterAll AI uses cookies, local storage, and third-party advertising partners (like Google AdSense) to deliver personalized ads, analyze site traffic, and maintain 100% free client-side tools.
              Learn more in our <a routerLink="/privacy-policy" (click)="closeModal()">Privacy Policy</a> and <a routerLink="/cookie-policy" (click)="closeModal()">Cookie Policy</a>.
            </p>
          </div>
        </div>
        <div class="cookie-actions">
          <button class="btn-decline" (click)="declineCookies()">Essential Only</button>
          <button class="btn-accept" (click)="acceptCookies()">Accept All Cookies</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cookie-banner-wrapper {
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 2rem);
      max-width: 900px;
      z-index: 999999;
      animation: slideUp 0.4s ease-out forwards;
    }

    @keyframes slideUp {
      from { transform: translate(-50%, 100%); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }

    .cookie-banner {
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }

    :host-context([data-theme="light"]) .cookie-banner {
      background: rgba(255, 255, 255, 0.96);
      border-color: rgba(0, 0, 0, 0.12);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.15);
    }

    .cookie-content {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .cookie-icon {
      font-size: 2rem;
      line-height: 1;
    }

    .cookie-text h4 {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      margin: 0 0 0.25rem 0;
    }

    :host-context([data-theme="light"]) .cookie-text h4 {
      color: #0f172a;
    }

    .cookie-text p {
      font-size: 0.85rem;
      color: #94a3b8;
      margin: 0;
      line-height: 1.5;
    }

    :host-context([data-theme="light"]) .cookie-text p {
      color: #475569;
    }

    .cookie-text a {
      color: #818cf8;
      text-decoration: underline;
    }

    .cookie-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .btn-decline {
      padding: 0.6rem 1.1rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.08);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.15);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    :host-context([data-theme="light"]) .btn-decline {
      background: rgba(0, 0, 0, 0.05);
      color: #475569;
      border-color: rgba(0, 0, 0, 0.15);
    }

    .btn-decline:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }

    .btn-accept {
      padding: 0.6rem 1.25rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #fff;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
      transition: all 0.2s ease;
    }

    .btn-accept:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5);
    }

    @media (max-width: 768px) {
      .cookie-banner {
        flex-direction: column;
        align-items: stretch;
      }
      .cookie-actions {
        justify-content: flex-end;
      }
    }
  `]
})
export class CookieConsentComponent implements OnInit {
  showBanner = signal<boolean>(false);

  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const consent = localStorage.getItem('converterall_cookie_consent');
      if (!consent) {
        this.showBanner.set(true);
      }
    }
  }

  acceptCookies() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('converterall_cookie_consent', 'accepted');
    }
    this.showBanner.set(false);
  }

  declineCookies() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('converterall_cookie_consent', 'declined');
    }
    this.showBanner.set(false);
  }

  closeModal() {
    // Keep banner visible or let user continue browsing
  }
}
