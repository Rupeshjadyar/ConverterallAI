import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Semester {
  sgpa: number | null;
  credits: number | null;
}

@Component({
  selector: 'app-cgpa-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cgpa-calculator.html',
  styleUrls: ['./cgpa-calculator.css']
})
export class CgpaCalculator implements OnInit {
  semesters: Semester[] = [
    { sgpa: null, credits: null },
    { sgpa: null, credits: null }
  ];

  cgpa: number | null = null;
  percentage: number | null = null;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {}

  addSemester(): void {
    this.semesters.push({ sgpa: null, credits: null });
  }

  removeSemester(index: number): void {
    if (this.semesters.length > 1) {
      this.semesters.splice(index, 1);
      this.calculateCgpa();
    }
  }

  calculateCgpa(): void {
    const validSemesters = this.semesters.filter(
      sem => sem.sgpa !== null && !isNaN(sem.sgpa) && sem.sgpa >= 0
    );

    if (validSemesters.length === 0) {
      this.cgpa = null;
      this.percentage = null;
      return;
    }

    const hasAnyCredits = validSemesters.some(
      sem => sem.credits !== null && !isNaN(sem.credits) && sem.credits > 0
    );

    if (hasAnyCredits) {
      // Use weighted CGPA, defaulting missing semester credits to 1
      let totalCredits = 0;
      let weightedPoints = 0;
      for (const sem of validSemesters) {
        const credit = (sem.credits !== null && !isNaN(sem.credits) && sem.credits > 0) ? sem.credits : 1;
        weightedPoints += sem.sgpa! * credit;
        totalCredits += credit;
      }
      this.cgpa = Number((weightedPoints / totalCredits).toFixed(2));
    } else {
      // Fallback to simple average
      const sum = validSemesters.reduce((acc, sem) => acc + sem.sgpa!, 0);
      this.cgpa = Number((sum / validSemesters.length).toFixed(2));
    }

    // Standard formula: CGPA * 9.5
    this.percentage = Number((this.cgpa * 9.5).toFixed(2));
  }
}
