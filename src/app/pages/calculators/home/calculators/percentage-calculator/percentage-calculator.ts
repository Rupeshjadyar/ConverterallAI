// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-percentage-calculator',
//   imports: [],
//   templateUrl: './percentage-calculator.html',
//   styleUrl: './percentage-calculator.css',
// })
// export class PercentageCalculator {

// }






import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-percentage-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './percentage-calculator.html',
  styleUrl: './percentage-calculator.css'
})
export class PercentageCalculator implements OnInit {

  activeTab: 'find' | 'what' | 'change' = 'find';

  // Tab 1: What is X% of Y
  percentValue: number | null = 20;
  numberValue: number | null = 500;
  result1: number | null = null;

  // Tab 2: X is what % of Y
  partValue: number | null = 75;
  wholeValue: number | null = 300;
  result2: number | null = null;

  // Tab 3: Percentage Change
  oldValue: number | null = 100;
  newValue: number | null = 120;
  result3: number | null = null;

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.setupSeo();
    this.addFaqSchema();
    this.calculateAll();
  }

  switchTab(tab: 'find' | 'what' | 'change'): void {
    this.activeTab = tab;
  }

  calculateAll(): void {
    this.calculatePercentOf();
    this.calculateWhatPercent();
    this.calculatePercentChange();
  }

  // What is X% of Y
  calculatePercentOf(): void {
    if (
      this.percentValue === null ||
      this.numberValue === null ||
      isNaN(this.percentValue) ||
      isNaN(this.numberValue)
    ) {
      this.result1 = null;
      return;
    }

    this.result1 = this.round(
      (this.percentValue * this.numberValue) / 100
    );
  }

  // X is what % of Y
  calculateWhatPercent(): void {
    if (
      this.partValue === null ||
      this.wholeValue === null ||
      this.wholeValue === 0 ||
      isNaN(this.partValue) ||
      isNaN(this.wholeValue)
    ) {
      this.result2 = null;
      return;
    }

    this.result2 = this.round(
      (this.partValue / this.wholeValue) * 100
    );
  }

  // Percentage Increase / Decrease
  calculatePercentChange(): void {
    if (
      this.oldValue === null ||
      this.newValue === null ||
      this.oldValue === 0 ||
      isNaN(this.oldValue) ||
      isNaN(this.newValue)
    ) {
      this.result3 = null;
      return;
    }

    this.result3 = this.round(
      ((this.newValue - this.oldValue) / this.oldValue) * 100
    );
  }

  private round(value: number): number {
    return Number(value.toFixed(2));
  }

  private setupSeo(): void {
    this.title.setTitle(
      'Percentage Calculator - Calculate Percentages, Increase & Decrease Online'
    );

    this.meta.updateTag({
      name: 'description',
      content:
        'Free online percentage calculator to calculate percentages, percentage increase, percentage decrease, and percentage changes instantly. Fast, accurate and mobile friendly.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content:
        'percentage calculator, percentage increase calculator, percentage decrease calculator, percent of number calculator, online percentage calculator'
    });

    this.meta.updateTag({
      property: 'og:title',
      content:
        'Percentage Calculator - Calculate Percentages Online'
    });

    this.meta.updateTag({
      property: 'og:description',
      content:
        'Calculate percentages, percentage increases and decreases instantly.'
    });
  }

  private addFaqSchema(): void {

    const existingSchema =
      this.document.getElementById('percentage-faq-schema');

    if (existingSchema) {
      existingSchema.remove();
    }

    const script = this.document.createElement('script');

    script.id = 'percentage-faq-schema';
    script.type = 'application/ld+json';

    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do you calculate percentage?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Divide the part value by the whole value and multiply by 100.'
          }
        },
        {
          '@type': 'Question',
          name: 'What is 20 percent of 500?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '20 percent of 500 equals 100.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I calculate percentage increase?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Subtract the old value from the new value, divide by the old value, then multiply by 100.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I calculate percentage decrease?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Subtract the new value from the old value, divide by the old value, then multiply by 100.'
          }
        }
      ]
    });

    this.document.head.appendChild(script);
  }
}