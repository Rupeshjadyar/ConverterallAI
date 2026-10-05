import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

@Component({
  selector: 'app-ad-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ad-container" [ngClass]="adClass">
      <!-- Google AdSense Unit -->
      <ins class="adsbygoogle"
           [style.display]="'block'"
           [attr.data-ad-client]="adClient"
           [attr.data-ad-slot]="adSlot"
           [attr.data-ad-format]="adFormat"
           [attr.data-full-width-responsive]="responsive ? 'true' : 'false'">
      </ins>
      
      <!-- Fallback / Preview Badge when AdSense script is pending -->
      <div class="ad-fallback-badge">
        <span>ADVERTISEMENT</span>
      </div>
    </div>
  `,
  styles: [`
    .ad-container {
      position: relative;
      width: 100%;
      margin: 1.5rem 0;
      min-height: 90px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.02);
      border: 1px dashed rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      overflow: hidden;
    }

    .ad-fallback-badge {
      position: absolute;
      top: 4px;
      right: 8px;
      font-size: 0.65rem;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.3);
      letter-spacing: 0.05em;
      pointer-events: none;
    }

    :host-context([data-theme="light"]) .ad-container {
      background: rgba(0, 0, 0, 0.02);
      border-color: rgba(0, 0, 0, 0.08);
    }

    :host-context([data-theme="light"]) .ad-fallback-badge {
      color: rgba(0, 0, 0, 0.3);
    }
  `]
})
export class AdBannerComponent implements AfterViewInit {
  @Input() adClient: string = 'ca-pub-0000000000000000'; // Replace with actual Publisher ID
  @Input() adSlot: string = '0000000000';
  @Input() adFormat: string = 'auto';
  @Input() responsive: boolean = true;
  @Input() adClass: string = '';

  ngAfterViewInit() {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('AdSense script error or blocked:', e);
    }
  }
}
