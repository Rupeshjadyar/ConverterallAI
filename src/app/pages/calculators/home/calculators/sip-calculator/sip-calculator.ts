import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sip-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sip-calculator.html',
  styleUrls: ['./sip-calculator.css']
})
export class SipCalculator implements OnInit {
  monthlyInvestment: number | null = 5000;
  expectedReturnRate: number | null = 12;
  timePeriod: number | null = 10;

  investedAmount: number | null = null;
  estReturns: number | null = null;
  totalValue: number | null = null;

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.setupSeo();
    this.calculateSip();
  }

  calculateSip(): void {
    if (
      this.monthlyInvestment === null || isNaN(this.monthlyInvestment) || this.monthlyInvestment <= 0 ||
      this.expectedReturnRate === null || isNaN(this.expectedReturnRate) || this.expectedReturnRate <= 0 ||
      this.timePeriod === null || isNaN(this.timePeriod) || this.timePeriod <= 0
    ) {
      this.investedAmount = null;
      this.estReturns = null;
      this.totalValue = null;
      return;
    }

    const P = this.monthlyInvestment;
    const i = (this.expectedReturnRate / 100) / 12;
    const n = this.timePeriod * 12;

    const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const invested = P * n;

    this.investedAmount = Math.round(invested);
    this.totalValue = Math.round(futureValue);
    this.estReturns = Math.round(futureValue - invested);
  }

  private setupSeo(): void {
    this.title.setTitle('SIP Calculator - Calculate Mutual Fund SIP Returns');
    this.meta.updateTag({
      name: 'description',
      content: 'Calculate the future value of your Mutual Fund SIP investments easily with our free online SIP calculator.'
    });
  }
}
