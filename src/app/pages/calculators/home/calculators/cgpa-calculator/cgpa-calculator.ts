import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';

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
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.setupSeo();
  }

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
    let totalCredits = 0;
    let weightedPoints = 0;
    let simpleSum = 0;
    let simpleCount = 0;

    for (const sem of this.semesters) {
      if (sem.sgpa !== null && !isNaN(sem.sgpa) && sem.sgpa > 0) {
        if (sem.credits !== null && !isNaN(sem.credits) && sem.credits > 0) {
          weightedPoints += sem.sgpa * sem.credits;
          totalCredits += sem.credits;
        } else {
          simpleSum += sem.sgpa;
          simpleCount++;
        }
      }
    }

    if (totalCredits > 0) {
      // Use weighted CGPA
      this.cgpa = Number((weightedPoints / totalCredits).toFixed(2));
    } else if (simpleCount > 0) {
      // Fallback to simple average
      this.cgpa = Number((simpleSum / simpleCount).toFixed(2));
    } else {
      this.cgpa = null;
      this.percentage = null;
      return;
    }

    // Standard formula: CGPA * 9.5
    this.percentage = Number((this.cgpa * 9.5).toFixed(2));
  }

  private setupSeo(): void {
    this.title.setTitle('CGPA Calculator - Convert CGPA to Percentage Online');
    this.meta.updateTag({
      name: 'description',
      content: 'Calculate cumulative grade point average (CGPA) from semester SGPA/grades and convert it to percentage.'
    });
  }
}
