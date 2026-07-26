import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-discount-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discount-calculator.html',
  styleUrls: ['./discount-calculator.css']
})
export class DiscountCalculator implements OnInit {
  originalPrice: number | null = 100;
  discountPercent: number | null = 20;
  additionalTaxPercent: number | null = 0;

  savingAmount: number | null = null;
  finalPrice: number | null = null;

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.setupSeo();
    this.calculateDiscount();
  }

  calculateDiscount(): void {
    if (this.originalPrice === null || isNaN(this.originalPrice) || this.originalPrice <= 0) {
      this.savingAmount = null;
      this.finalPrice = null;
      return;
    }

    const price = this.originalPrice;
    const discount = this.discountPercent !== null && !isNaN(this.discountPercent) ? this.discountPercent : 0;
    const tax = this.additionalTaxPercent !== null && !isNaN(this.additionalTaxPercent) ? this.additionalTaxPercent : 0;

    const discountValue = (price * discount) / 100;
    const priceAfterDiscount = price - discountValue;
    const taxValue = (priceAfterDiscount * tax) / 100;

    this.savingAmount = Number(discountValue.toFixed(2));
    this.finalPrice = Number((priceAfterDiscount + taxValue).toFixed(2));
  }

  private setupSeo(): void {
    this.title.setTitle('Discount Calculator - Save Money Calculation');
    this.meta.updateTag({
      name: 'description',
      content: 'Calculate final prices after discounts and taxes. Find exactly how much you save.'
    });
  }
}
