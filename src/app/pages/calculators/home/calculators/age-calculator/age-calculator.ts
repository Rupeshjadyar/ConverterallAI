import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-age-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './age-calculator.html',
  styleUrls: ['./age-calculator.css']
})
export class AgeCalculator implements OnInit {
  birthDate: string = '';
  referenceDate: string = new Date().toISOString().split('T')[0];

  years: number | null = null;
  months: number | null = null;
  days: number | null = null;
  nextBirthdayMonths: number | null = null;
  nextBirthdayDays: number | null = null;
  totalMonths: number | null = null;
  totalWeeks: number | null = null;
  totalDays: number | null = null;
  totalHours: number | null = null;
  totalMinutes: number | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Set default birthdate to 25 years ago
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 25);
    this.birthDate = defaultDate.toISOString().split('T')[0];
    this.calculateAge();
  }

  calculateAge(): void {
    if (!this.birthDate || !this.referenceDate) {
      this.resetResults();
      return;
    }

    const birth = new Date(this.birthDate);
    const ref = new Date(this.referenceDate);

    if (birth > ref) {
      this.resetResults();
      return;
    }

    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();
    let days = ref.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      // Get days in preceding month
      const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    this.years = years;
    this.months = months;
    this.days = days;

    // Total metrics
    const diffTime = Math.abs(ref.getTime() - birth.getTime());
    this.totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    this.totalMonths = (years * 12) + months;
    this.totalWeeks = Math.floor(this.totalDays / 7);
    this.totalHours = this.totalDays * 24;
    this.totalMinutes = this.totalHours * 60;

    // Next Birthday calculation
    const nextBday = new Date(birth);
    nextBday.setFullYear(ref.getFullYear());
    if (nextBday < ref) {
      nextBday.setFullYear(ref.getFullYear() + 1);
    }

    let diffBday = nextBday.getTime() - ref.getTime();
    let bdayDays = Math.ceil(diffBday / (1000 * 60 * 60 * 24));
    
    this.nextBirthdayMonths = Math.floor(bdayDays / 30.4375);
    this.nextBirthdayDays = Math.ceil(bdayDays % 30.4375);
  }

  private resetResults(): void {
    this.years = null;
    this.months = null;
    this.days = null;
    this.nextBirthdayMonths = null;
    this.nextBirthdayDays = null;
    this.totalMonths = null;
    this.totalWeeks = null;
    this.totalDays = null;
    this.totalHours = null;
    this.totalMinutes = null;
  }
}
