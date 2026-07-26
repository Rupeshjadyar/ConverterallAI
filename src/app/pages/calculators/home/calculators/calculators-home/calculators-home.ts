// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-calculators-home',
//   imports: [],
//   templateUrl: './calculators-home.html',
//   styleUrl: './calculators-home.css',
// })
// export class CalculatorsHome {

// }





import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Calculator {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  categoryIcon: string;
  gradient: string;
  route: string;
}

@Component({
  selector: 'app-calculators-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculators-home.html',
  styleUrl: './calculators-home.css',
})
export class CalculatorsHome {
  searchTerm = '';
  selectedCategory = 'all';
  totalCalculations = 1528437;
  activeUsers = 2847;

  categories = [
    { id: 'all', name: 'All', icon: '🎯' },
    { id: 'basic', name: 'Basic', icon: '🧮' },
    { id: 'financial', name: 'Financial', icon: '💰' },
    { id: 'health', name: 'Health', icon: '💪' },
    { id: 'academic', name: 'Academic', icon: '📚' }
  ];

  calculators: Calculator[] = [
    { 
      id: 'basic', name: 'Basic Calculator', 
      description: 'Simple arithmetic operations - Add, Subtract, Multiply, Divide',
      icon: '🧮', category: 'basic', categoryIcon: '🧮',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/calculators/basic'
    },
    { 
      id: 'bmi', name: 'BMI Calculator', 
      description: 'Calculate Body Mass Index & ideal weight range',
      icon: '💪', category: 'health', categoryIcon: '💪',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      route: '/calculators/bmi'
    },
    { 
      id: 'percentage', name: 'Percentage Calculator', 
      description: 'Find percentages, percentage change & more',
      icon: '📊', category: 'basic', categoryIcon: '🧮',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      route: '/calculators/percentage'
    },
    { 
      id: 'emi', name: 'EMI Calculator', 
      description: 'Calculate loan EMIs, interest & total payment',
      icon: '🏦', category: 'financial', categoryIcon: '💰',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      route: '/calculators/emi'
    },
    { 
      id: 'age', name: 'Age Calculator', 
      description: 'Calculate exact age in years, months & days',
      icon: '🎂', category: 'basic', categoryIcon: '🧮',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      route: '/calculators/age'
    },
    { 
      id: 'gst', name: 'GST Calculator', 
      description: 'Calculate GST inclusive & exclusive amounts',
      icon: '💰', category: 'financial', categoryIcon: '💰',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      route: '/calculators/gst'
    },
    { 
      id: 'discount', name: 'Discount Calculator', 
      description: 'Calculate savings & final price after discount',
      icon: '🏷️', category: 'financial', categoryIcon: '💰',
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      route: '/calculators/discount'
    },
    { 
      id: 'sip', name: 'SIP Calculator', 
      description: 'Calculate mutual fund SIP returns',
      icon: '📈', category: 'financial', categoryIcon: '💰',
      gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      route: '/calculators/sip'
    },
    { 
      id: 'cgpa', name: 'CGPA Calculator', 
      description: 'Calculate CGPA & percentage from grades',
      icon: '🎓', category: 'academic', categoryIcon: '📚',
      gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      route: '/calculators/cgpa'
    },
    { 
      id: 'loan', name: 'Loan Calculator', 
      description: 'Calculate home loan, car loan payments',
      icon: '🏠', category: 'financial', categoryIcon: '💰',
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      route: '/calculators/loan'
    },
    { 
      id: 'date', name: 'Date Calculator', 
      description: 'Calculate days between two dates',
      icon: '📅', category: 'basic', categoryIcon: '🧮',
      gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      route: '/calculators/date'
    }
  ];

  filteredCalculators = [...this.calculators];
  calculatorsCount = this.calculators.length;

  constructor(private router: Router) {}

  filterCalculators() {
    this.filteredCalculators = this.calculators.filter(calc => {
      const matchesSearch = calc.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           calc.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || calc.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  filterByCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.filterCalculators();
  }

  openCalculator(calculator: Calculator) {
    this.router.navigate([calculator.route]);
  }
}