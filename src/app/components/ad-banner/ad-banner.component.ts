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
  templateUrl: './ad-banner.component.html',
  styleUrls: ['./ad-banner.component.css']
})
export class AdBannerComponent implements AfterViewInit {
  @Input() adClient: string = 'ca-pub-9707682105347147';
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
