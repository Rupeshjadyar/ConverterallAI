// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-emi-calculator',
//   imports: [],
//   templateUrl: './emi-calculator.html',
//   styleUrl: './emi-calculator.css',
// })
// export class EmiCalculator {

// }

import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-emi-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emi-calculator.html',
  styleUrls: ['./emi-calculator.css']
})
export class EmiCalculator implements OnInit {

  // Inputs
  loanAmount: number | null = 500000;
  interestRate: number | null = 8.5;
  loanTenure: number | null = 5;

  // Results
  monthlyEMI: number | null = null;
  totalInterest: number | null = null;
  totalPayment: number | null = null;

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.setupSeo();
    this.addFaqSchema();
    this.calculateEMI();
  }

  calculateEMI(): void {

    if (
      this.loanAmount === null ||
      this.interestRate === null ||
      this.loanTenure === null ||
      this.loanAmount <= 0 ||
      this.interestRate <= 0 ||
      this.loanTenure <= 0
    ) {
      this.monthlyEMI = null;
      this.totalInterest = null;
      this.totalPayment = null;
      return;
    }

    const principal = this.loanAmount;

    const monthlyRate =
      this.interestRate / 12 / 100;

    const totalMonths =
      this.loanTenure * 12;

    const emi =
      principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, totalMonths) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment =
      emi * totalMonths;

    const totalInterest =
      totalPayment - principal;

    this.monthlyEMI =
      this.round(emi);

    this.totalPayment =
      this.round(totalPayment);

    this.totalInterest =
      this.round(totalInterest);
  }

  private round(value: number): number {
    return Number(value.toFixed(2));
  }

  private setupSeo(): void {

    this.title.setTitle(
      'EMI Calculator - Calculate Loan EMI Online Free'
    );

    this.meta.updateTag({
      name: 'description',
      content:
        'Free EMI Calculator to calculate monthly loan EMI, total interest payable, and total repayment amount for home loans, personal loans, car loans, and education loans.'
    });

    this.meta.updateTag({
      name: 'keywords',
      content:
        'emi calculator, loan emi calculator, home loan emi calculator, car loan emi calculator, personal loan emi calculator, monthly emi calculator'
    });

    this.meta.updateTag({
      property: 'og:title',
      content:
        'EMI Calculator - Calculate Monthly Loan EMI'
    });

    this.meta.updateTag({
      property: 'og:description',
      content:
        'Calculate EMI, total interest and total repayment amount instantly.'
    });
  }

  private addFaqSchema(): void {

    const existingSchema =
      this.document.getElementById(
        'emi-faq-schema'
      );

    if (existingSchema) {
      existingSchema.remove();
    }

    const script =
      this.document.createElement('script');

    script.id = 'emi-faq-schema';

    script.type = 'application/ld+json';

    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is EMI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'EMI stands for Equated Monthly Installment. It is a fixed monthly payment made towards loan repayment.'
          }
        },
        {
          '@type': 'Question',
          name: 'How is EMI calculated?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'EMI is calculated using the loan amount, interest rate, and repayment tenure.'
          }
        },
        {
          '@type': 'Question',
          name: 'Does increasing loan tenure reduce EMI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Yes. Increasing the loan tenure reduces monthly EMI but increases total interest payable.'
          }
        },
        {
          '@type': 'Question',
          name: 'Can I use this EMI calculator for home loans?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Yes. This calculator works for home loans, personal loans, car loans, education loans, and business loans.'
          }
        }
      ]
    });

    this.document.head.appendChild(script);
  }
}