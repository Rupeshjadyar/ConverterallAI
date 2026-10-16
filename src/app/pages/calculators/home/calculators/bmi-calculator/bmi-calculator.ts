// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-bmi-calculator',
//   imports: [],
//   templateUrl: './bmi-calculator.html',
//   styleUrl: './bmi-calculator.css',
// })
// export class BmiCalculator {

// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bmi-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bmi-calculator.html',
  styleUrl: './bmi-calculator.css',
})
export class BmiCalculator {
  unit: 'metric' | 'imperial' = 'metric';
  weight = 70;
  height = 170;
  bmi: number | null = null;
  category = '';
  categoryClass = '';

  constructor() {
    this.calculate();
  }

  setUnit(selectedUnit: 'metric' | 'imperial') {
    if (this.unit === selectedUnit) return;
    this.unit = selectedUnit;
    
    // Automatically convert or set defaults to keep UI looking sleek on toggle
    if (selectedUnit === 'metric') {
      this.weight = 70;
      this.height = 170;
    } else {
      this.weight = 154;
      this.height = 67;
    }
    this.calculate();
  }

  calculate() {
    // Prevent mathematical crashes if inputs are wiped clean by user
    if (!this.weight || !this.height || this.weight <= 0 || this.height <= 0) {
      this.bmi = null;
      return;
    }

    let bmiValue: number;
    if (this.unit === 'metric') {
      bmiValue = this.weight / ((this.height / 100) ** 2);
    } else {
      bmiValue = (this.weight * 703) / (this.height ** 2);
    }
    this.bmi = Math.round(bmiValue * 10) / 10;
    
    if (this.bmi < 18.5) {
      this.category = 'Underweight';
      this.categoryClass = 'underweight';
    } else if (this.bmi < 25) {
      this.category = 'Normal weight';
      this.categoryClass = 'normal';
    } else if (this.bmi < 30) {
      this.category = 'Overweight';
      this.categoryClass = 'overweight';
    } else {
      this.category = 'Obese';
      this.categoryClass = 'obese';
    }
  }

  get markerPosition(): string {
    if (!this.bmi) return '0%';
    if (this.bmi < 18.5) return `${(this.bmi / 18.5) * 46.25}%`;
    if (this.bmi < 25) return `${46.25 + ((this.bmi - 18.5) / 6.5) * 16.25}%`;
    if (this.bmi < 30) return `${62.5 + ((this.bmi - 25) / 5) * 12.5}%`;
    return `${75 + Math.min(((this.bmi - 30) / 10) * 25, 25)}%`;
  }

  getAdvice(): string {
    if (!this.bmi) return '';
    if (this.bmi < 18.5) return 'You may need to gain some weight. Consider a balanced diet with healthy calories.';
    if (this.bmi < 25) return 'Great! You\'re in the healthy weight range. Maintain with regular exercise.';
    if (this.bmi < 30) return 'Consider lifestyle changes. Regular exercise and balanced diet can help.';
    return 'Consult a healthcare provider for personalized advice on weight management.';
  }
}