import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  discountError: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.calculateDiscount();
  }

  calculateDiscount(): void {
    if (this.discountPercent !== null && this.discountPercent > 100) {
      this.discountError = 'Discount cannot exceed 100%';
    } else if (this.discountPercent !== null && this.discountPercent < 0) {
      this.discountError = 'Discount cannot be negative';
    } else {
      this.discountError = '';
    }

    if (this.originalPrice === null || isNaN(this.originalPrice) || this.originalPrice <= 0) {
      this.savingAmount = null;
      this.finalPrice = null;
      return;
    }

    const price = this.originalPrice;
    const rawDiscount = this.discountPercent !== null && !isNaN(this.discountPercent) ? this.discountPercent : 0;
    const discount = Math.min(100, Math.max(0, rawDiscount));
    const rawTax = this.additionalTaxPercent !== null && !isNaN(this.additionalTaxPercent) ? this.additionalTaxPercent : 0;
    const tax = Math.max(0, rawTax);

    const discountValue = (price * discount) / 100;
    const priceAfterDiscount = Math.max(0, price - discountValue);
    const taxValue = (priceAfterDiscount * tax) / 100;

    this.savingAmount = Number(discountValue.toFixed(2));
    this.finalPrice = Number((priceAfterDiscount + taxValue).toFixed(2));
  }
}
