import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-calculator.html',
  styleUrls: ['./date-calculator.css']
})
export class DateCalculator implements OnInit {
  startDate: string = '';
  endDate: string = '';

  daysDiff: number | null = null;
  weeksDiff: number | null = null;
  monthsDiff: number | null = null;
  yearsDiff: number | null = null;
  dateNote: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.startDate = today.toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    this.endDate = nextWeek.toISOString().split('T')[0];
    this.calculateDifference();
  }

  calculateDifference(): void {
    if (!this.startDate || !this.endDate) {
      this.resetResults();
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (end.getTime() < start.getTime()) {
      this.dateNote = 'End date is earlier than start date';
    } else if (start.getTime() < end.getTime()) {
      this.dateNote = 'Start date is earlier than end date';
    } else {
      this.dateNote = 'Both dates are identical';
    }

    this.daysDiff = diffDays;
    this.weeksDiff = Number((diffDays / 7).toFixed(1));
    this.monthsDiff = Number((diffDays / 30.4375).toFixed(1));
    this.yearsDiff = Number((diffDays / 365.25).toFixed(2));
  }

  private resetResults(): void {
    this.daysDiff = null;
    this.weeksDiff = null;
    this.monthsDiff = null;
    this.yearsDiff = null;
    this.dateNote = '';
  }
}
