import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-calculator.html',
  styleUrls: ['./loan-calculator.css']
})
export class LoanCalculator implements OnInit {
  loanAmount: number | null = 1000000;
  interestRate: number | null = 8.5;
  loanTenure: number | null = 15;

  monthlyEmi: number | null = null;
  totalInterest: number | null = null;
  totalPayment: number | null = null;

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.setupSeo();
    this.calculateLoan();
  }

  calculateLoan(): void {
    if (
      this.loanAmount === null || isNaN(this.loanAmount) || this.loanAmount <= 0 ||
      this.interestRate === null || isNaN(this.interestRate) || this.interestRate <= 0 ||
      this.loanTenure === null || isNaN(this.loanTenure) || this.loanTenure <= 0
    ) {
      this.monthlyEmi = null;
      this.totalInterest = null;
      this.totalPayment = null;
      return;
    }

    const principal = this.loanAmount;
    const r = (this.interestRate / 12) / 100;
    const n = this.loanTenure * 12;

    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const payment = emi * n;

    this.monthlyEmi = Math.round(emi);
    this.totalPayment = Math.round(payment);
    this.totalInterest = Math.round(payment - principal);
  }

  private setupSeo(): void {
    this.title.setTitle('Loan Calculator - Advanced Loan Details');
    this.meta.updateTag({
      name: 'description',
      content: 'Calculate home loans, auto loans, personal loans and compare monthly repayments, total interest and final amounts.'
    });
  }
}
