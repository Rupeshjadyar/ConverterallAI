import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-gst-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gst-calculator.html',
  styleUrls: ['./gst-calculator.css']
})
export class GstCalculator implements OnInit {
  amount: number | null = 1000;
  gstRate: number = 18;
  gstType: 'exclusive' | 'inclusive' = 'exclusive';

  cgst: number | null = null;
  sgst: number | null = null;
  totalGst: number | null = null;
  netAmount: number | null = null;
  totalAmount: number | null = null;

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.setupSeo();
    this.calculateGst();
  }

  calculateGst(): void {
    if (this.amount === null || isNaN(this.amount) || this.amount <= 0) {
      this.resetResults();
      return;
    }

    const rate = this.gstRate;
    
    if (this.gstType === 'exclusive') {
      this.netAmount = this.amount;
      this.totalGst = (this.amount * rate) / 100;
      this.totalAmount = this.amount + this.totalGst;
    } else {
      this.totalAmount = this.amount;
      this.netAmount = this.amount / (1 + rate / 100);
      this.totalGst = this.amount - this.netAmount;
    }

    this.cgst = this.totalGst / 2;
    this.sgst = this.totalGst / 2;

    this.roundResults();
  }

  private roundResults(): void {
    if (this.cgst !== null) this.cgst = Number(this.cgst.toFixed(2));
    if (this.sgst !== null) this.sgst = Number(this.sgst.toFixed(2));
    if (this.totalGst !== null) this.totalGst = Number(this.totalGst.toFixed(2));
    if (this.netAmount !== null) this.netAmount = Number(this.netAmount.toFixed(2));
    if (this.totalAmount !== null) this.totalAmount = Number(this.totalAmount.toFixed(2));
  }

  private resetResults(): void {
    this.cgst = null;
    this.sgst = null;
    this.totalGst = null;
    this.netAmount = null;
    this.totalAmount = null;
  }

  private setupSeo(): void {
    this.title.setTitle('GST Calculator - Calculate GST Online');
    this.meta.updateTag({
      name: 'description',
      content: 'Calculate Goods and Services Tax (GST) easily. Supports GST inclusive and exclusive calculations with details of CGST and SGST.'
    });
  }
}
