import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

export interface AppTool {
  id: string;
  name: string;
  description: string;
  category: 'Calculators' | 'Image Tools' | 'PDF Tools' | 'Games' | string;
  route: string;
  icon: string;
  tag?: string;
}

@Component({
  selector: 'app-spotlight-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './spotlight-search.component.html',
  styleUrls: ['./spotlight-search.component.css']
})
export class SpotlightSearchComponent {
  isOpen = signal(false);
  searchQuery = '';
  selectedCategory: 'ALL' | 'Calculators' | 'Image Tools' | 'PDF Tools' | 'Games' = 'ALL';
  selectedIndex = 0;

  allTools: AppTool[] = [
    // Calculators
    { id: 'basic', name: 'Basic Scientific Calculator', description: 'Quick math, percentages, square roots & scientific operations', category: 'Calculators', route: '/calculators/basic', icon: '🧮', tag: 'Fast' },
    { id: 'emi', name: 'Loan EMI Calculator', description: 'Calculate monthly EMI, interest payable & complete loan schedule', category: 'Calculators', route: '/calculators/emi', icon: '💰', tag: 'Popular' },
    { id: 'bmi', name: 'BMI & Fitness Calculator', description: 'Check Body Mass Index, health range & weight target recommendations', category: 'Calculators', route: '/calculators/bmi', icon: '⚖️', tag: 'Health' },
    { id: 'percentage', name: 'Percentage Calculator', description: 'Calculate percentage changes, discounts & tips instantly', category: 'Calculators', route: '/calculators/percentage', icon: '📊' },
    { id: 'age', name: 'Precise Age Calculator', description: 'Calculate exact age in years, months, days & next birthday countdown', category: 'Calculators', route: '/calculators/age', icon: '🎂' },
    { id: 'gst', name: 'GST Tax Calculator', description: 'Calculate inclusive/exclusive GST for India tax slabs (5%, 12%, 18%, 28%)', category: 'Calculators', route: '/calculators/gst', icon: '🏛️', tag: 'India' },
    { id: 'discount', name: 'Discount & Savings Calculator', description: 'Compute final sales price after markdown and coupon savings', category: 'Calculators', route: '/calculators/discount', icon: '🏷️' },
    { id: 'sip', name: 'Mutual Fund SIP Calculator', description: 'Estimate future wealth and returns from Systematic Investment Plans', category: 'Calculators', route: '/calculators/sip', icon: '📈', tag: 'Finance' },
    { id: 'cgpa', name: 'CGPA & GPA Calculator', description: 'Convert semester grades & marks into CGPA/Percentage accurately', category: 'Calculators', route: '/calculators/cgpa', icon: '🎓' },
    { id: 'loan', name: 'Advanced Loan Eligibility & Amortization', description: 'Compare loan tenures, interest rates and repayment plans', category: 'Calculators', route: '/calculators/loan', icon: '🏦' },
    { id: 'date', name: 'Date Difference Calculator', description: 'Add/subtract days or find duration between any two dates', category: 'Calculators', route: '/calculators/date', icon: '📅' },

    // Image Tools
    { id: 'compressor', name: 'AI Image Compressor', description: 'Compress PNG, JPG, WEBP up to 90% smaller with zero visible quality loss', category: 'Image Tools', route: '/image-processing/compressor', icon: '🗜️', tag: 'Popular' },
    { id: 'bg-remover', name: 'AI Background Remover', description: 'Remove backgrounds instantly for product shots & portraits', category: 'Image Tools', route: '/image-processing/bg-remover', icon: '🪄', tag: 'AI Powered' },
    { id: 'format-converter', name: 'Image Format Converter', description: 'Convert between JPG, PNG, WEBP, GIF with batch support', category: 'Image Tools', route: '/image-processing/format-converter', icon: '🔄' },
    { id: 'cropper', name: 'Image Cropper & Rotator', description: 'Crop to exact aspect ratios (16:9, 4:3, 1:1) for social media', category: 'Image Tools', route: '/image-processing/cropper', icon: '✂️' },
    { id: 'image-to-pdf', name: 'Image to PDF Converter', description: 'Merge photos and scans into a single high-definition PDF document', category: 'Image Tools', route: '/image-processing/image-to-pdf', icon: '📑', tag: 'Top Rated' },
    { id: 'editor', name: 'Pro Image Editor & Filters', description: 'Adjust brightness, contrast, filters, watermarks and transformations', category: 'Image Tools', route: '/image-processing/editor', icon: '🎨' },

    // PDF Tools
    { id: 'merge-pdf', name: 'Merge PDF Files', description: 'Combine multiple PDFs into one unified document in custom order', category: 'PDF Tools', route: '/pdf-processing/merge-pdf', icon: '📑', tag: 'Popular' },
    { id: 'split-pdf', name: 'Split PDF Pages', description: 'Extract pages or split large PDF files into separate documents', category: 'PDF Tools', route: '/pdf-processing/split-pdf', icon: '✂️' },
    { id: 'compress-pdf', name: 'Compress PDF Size', description: 'Reduce PDF file size for email attachment while retaining quality', category: 'PDF Tools', route: '/pdf-processing/compress-pdf', icon: '📦', tag: 'Fast' },
    { id: 'pdf-to-word', name: 'PDF to DOCX Word', description: 'Convert PDF files into editable Microsoft Word documents', category: 'PDF Tools', route: '/pdf-processing/pdf-to-word', icon: '📝' },
    { id: 'word-to-pdf', name: 'Word to PDF Converter', description: 'Convert DOC & DOCX files to secure universal PDF documents', category: 'PDF Tools', route: '/pdf-processing/word-to-pdf', icon: '📘' },
    { id: 'pdf-to-jpg', name: 'PDF to High-Res JPG', description: 'Convert each PDF page into crisp image files', category: 'PDF Tools', route: '/pdf-processing/pdf-to-jpg', icon: '🖼️' },
    { id: 'jpg-to-pdf', name: 'JPG to PDF Builder', description: 'Combine JPG images into a clean multi-page PDF document', category: 'PDF Tools', route: '/pdf-processing/jpg-to-pdf', icon: '📂' },
    { id: 'sign-pdf', name: 'Sign & e-Signature PDF', description: 'Add your digital signature or draw signatures on PDF documents', category: 'PDF Tools', route: '/pdf-processing/sign-pdf', icon: '✍️' },
    { id: 'add-watermark', name: 'Add Watermark to PDF', description: 'Stamp text or image watermarks for copyright and branding protection', category: 'PDF Tools', route: '/pdf-processing/add-watermark', icon: '🛡️' },
    { id: 'add-password', name: 'Protect PDF with Password', description: 'Encrypt sensitive PDF files with strong AES encryption', category: 'PDF Tools', route: '/pdf-processing/add-password', icon: '🔒' },
    { id: 'remove-password', name: 'Unlock PDF Password', description: 'Remove password restrictions from PDF files you own', category: 'PDF Tools', route: '/pdf-processing/remove-password', icon: '🔓' },

    // Free In-Browser Games
    { id: 'games-hub', name: 'Games Hub & Arcade', description: 'Browse all 12 free client-side mini games and puzzles', category: 'Games', route: '/games', icon: '🎮', tag: 'New' },
    { id: 'chess', name: 'Grandmaster Chess', description: 'Play Chess against AI Bot or 2-Player local battle with move notation', category: 'Games', route: '/games/chess', icon: '♟️', tag: 'Popular' },
    { id: 'teen-patti', name: 'Indian Teen Patti (3 Patti)', description: 'Classic Indian 3-card poker game with blind, chaal and sidepot bot AI', category: 'Games', route: '/games/teen-patti', icon: '🎴', tag: 'Hot' },
    { id: 'connect4', name: 'Connect 4 in a Row', description: 'Drop discs and connect 4 in a line vs smart AI or 2-Player local', category: 'Games', route: '/games/connect4', icon: '🔴', tag: 'Classic' },
    { id: 'sudoku', name: 'Sudoku Master Puzzle', description: '9x9 Sudoku puzzles with pencil notes, hints and mistake checker', category: 'Games', route: '/games/sudoku', icon: '🔢', tag: 'Logic' },
    { id: 'minesweeper', name: 'Classic Minesweeper', description: 'Sweep the minefield with safe first click and fast flag placement', category: 'Games', route: '/games/minesweeper', icon: '💣', tag: 'Retro' },
    { id: 'game-2048', name: '2048 Number Puzzle', description: 'Slide numbers and merge tiles to reach the legendary 2048 tile', category: 'Games', route: '/games/2048', icon: '🧩', tag: 'Viral' },
    { id: 'snake', name: 'Retro Snake Arcade', description: '60fps arcade snake game with bonus apples and speed multipliers', category: 'Games', route: '/games/snake', icon: '🐍', tag: 'Arcade' },
    { id: 'memory-match', name: 'Memory Card Match', description: '3D card flip memory matching game to boost brain recall power', category: 'Games', route: '/games/memory-match', icon: '🧠', tag: 'Brain' },
    { id: 'tic-tac-toe', name: 'Cyber Tic-Tac-Toe', description: 'Glow neon 3x3 grid with unbeatable Minimax AI & 2-Player mode', category: 'Games', route: '/games/tic-tac-toe', icon: '❌', tag: 'Quick' },
    { id: 'typing-master', name: 'Typing Master Pro Academy', description: 'Touch-typing lessons, mechanical sounds, QWERTY keyboard & speed tests like typingtest.com', category: 'Special Tools', route: '/typing-master', icon: '⌨️', tag: 'Typing' },
    { id: 'brick-breaker', name: 'Neon Brick Breaker', description: 'Break glowing brick walls with paddle bounces and dynamic powerups', category: 'Games', route: '/games/brick-breaker', icon: '🧱', tag: 'Arcade' },
    { id: 'pong', name: 'Neon Cyber Pong', description: 'Retro 2-player and AI table tennis pong with responsive physics', category: 'Games', route: '/games/pong', icon: '🏓', tag: 'Retro' },
    { id: 'battle-royale', name: 'Cyber Battlegrounds (PUBG 2D)', description: '30-player top-down Battle Royale with loot rifles, shrinking storm zone and Chicken Dinner', category: 'Games', route: '/games/battle-royale', icon: '🪂', tag: 'Hot' }
  ];

  constructor(private router: Router) {}

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.toggleSpotlight();
    } else if (event.key === 'Escape' && this.isOpen()) {
      this.closeSpotlight();
    }
  }

  toggleSpotlight() {
    this.isOpen.set(!this.isOpen());
    this.selectedIndex = 0;
  }

  openSpotlight() {
    this.isOpen.set(true);
    this.selectedIndex = 0;
  }

  closeSpotlight() {
    this.isOpen.set(false);
  }

  selectCategory(category: 'ALL' | 'Calculators' | 'Image Tools' | 'PDF Tools' | 'Games') {
    this.selectedCategory = category;
    this.selectedIndex = 0;
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedIndex = 0;
  }

  onSearchChange() {
    this.selectedIndex = 0;
  }

  filteredTools(): AppTool[] {
    const q = this.searchQuery.toLowerCase().trim();
    return this.allTools.filter(t => {
      const matchCat = this.selectedCategory === 'ALL' || t.category === this.selectedCategory;
      const matchQuery = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }

  onKeydown(event: KeyboardEvent) {
    const list = this.filteredTools();
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectedIndex = (this.selectedIndex + 1) % (list.length || 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectedIndex = (this.selectedIndex - 1 + list.length) % (list.length || 1);
    } else if (event.key === 'Enter' && list.length > 0) {
      event.preventDefault();
      this.navigate(list[this.selectedIndex]);
    }
  }

  navigate(tool: AppTool) {
    this.closeSpotlight();
    this.router.navigate([tool.route]);
  }
}
