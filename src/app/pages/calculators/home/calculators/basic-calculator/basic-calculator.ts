import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-basic-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './basic-calculator.html',
  styleUrl: './basic-calculator.css',
})
export class BasicCalculator {
   displayValue = '0';
  previousValue = '';
  operation = '';
  waitingForOperand = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const key = event.key;

    if (/[0-9]/.test(key)) {
      this.inputDigit(key);
    } else if (key === '.') {
      this.inputDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      this.performOperation(key);
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      this.calculateResult();
    } else if (key === 'Backspace') {
      event.preventDefault();
      this.backspace();
    } else if (key === 'Escape') {
      this.clear();
    } else if (key === '%') {
      this.getPercentage();
    }
  }

  inputDigit(digit: string) {
    if (this.displayValue === 'ERROR') this.clear();
    if (this.waitingForOperand) {
      this.displayValue = digit;
      this.waitingForOperand = false;
    } else {
      this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
    }
    this.limitDisplayLength();
  }

  inputDecimal() {
    if (this.displayValue === 'ERROR') this.clear();
    if (this.waitingForOperand) {
      this.displayValue = '0.';
      this.waitingForOperand = false;
    } else if (!this.displayValue.includes('.')) {
      this.displayValue += '.';
    }
  }

  performOperation(op: string) {
    if (this.displayValue === 'ERROR') this.clear();
    
    if (this.previousValue && this.operation && !this.waitingForOperand) {
      const result = this.calculate();
      if (result === 'ERROR') {
        this.displayValue = 'ERROR';
        this.previousValue = '';
        this.operation = '';
        this.waitingForOperand = true;
        return;
      }
      this.displayValue = String(result);
      this.previousValue = this.displayValue;
    } else {
      this.previousValue = this.displayValue;
    }
    
    this.operation = op;
    this.waitingForOperand = true;
  }

  calculate(): number | string {
    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.displayValue);
    
    if (isNaN(prev) || isNaN(current)) return 'ERROR';
    
    switch (this.operation) {
      case '+': 
        return this.roundResult(prev + current);
      case '-': 
        return this.roundResult(prev - current);
      case '*': 
        return this.roundResult(prev * current);
      case '/': 
        if (current === 0) return 'ERROR';
        return this.roundResult(prev / current);
      default: 
        return current;
    }
  }

  roundResult(value: number): number {
    return parseFloat(value.toFixed(10));
  }

  calculateResult() {
    if (this.displayValue === 'ERROR') {
      this.clear();
      return;
    }
    
    if (this.previousValue && this.operation) {
      const result = this.calculate();
      if (result === 'ERROR') {
        this.displayValue = 'ERROR';
        this.previousValue = '';
        this.operation = '';
        this.waitingForOperand = true;
        setTimeout(() => this.clear(), 1500);
        return;
      }
      this.displayValue = String(result);
      this.previousValue = '';
      this.operation = '';
      this.waitingForOperand = true;
    }
  }

  clear() {
    this.displayValue = '0';
    this.previousValue = '';
    this.operation = '';
    this.waitingForOperand = false;
  }

  backspace() {
    if (this.displayValue === 'ERROR') {
      this.clear();
      return;
    }
    if (this.waitingForOperand) return;
    
    if (this.displayValue.length > 1) {
      this.displayValue = this.displayValue.slice(0, -1);
    } else {
      this.displayValue = '0';
    }
  }

  toggleSign() {
    if (this.displayValue === 'ERROR') {
      this.clear();
      return;
    }
    const num = parseFloat(this.displayValue);
    if (!isNaN(num)) {
      this.displayValue = String(num * -1);
    }
  }

  getPercentage() {
    if (this.displayValue === 'ERROR') {
      this.clear();
      return;
    }
    const num = parseFloat(this.displayValue);
    if (!isNaN(num)) {
      this.displayValue = String(this.roundResult(num / 100));
    }
    this.waitingForOperand = false;
  }

  private limitDisplayLength() {
    if (this.displayValue.length > 20) {
      this.displayValue = this.displayValue.slice(0, 20);
    }
  }
}