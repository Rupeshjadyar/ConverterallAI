import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

export interface AppTool {
  id: string;
  name: string;
  description: string;
  category: 'Calculators' | 'Image Tools' | 'PDF Tools';
  route: string;
  icon: string;
  tag?: string;
}

@Component({
  selector: 'app-spotlight-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Trigger Button -->
    <button class="spotlight-trigger glass" (click)="openSpotlight()" title="Search all tools (Ctrl+K)">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <span class="trigger-label">Search AI tools...</span>
      <kbd class="shortcut-kbd">Ctrl K</kbd>
    </button>

    <!-- Modal Backdrop -->
    <div class="spotlight-backdrop" *ngIf="isOpen()" (click)="closeSpotlight()">
      <!-- Modal Box -->
      <div class="spotlight-modal glass" (click)="$event.stopPropagation()">
        
        <!-- Header / Search input -->
        <div class="spotlight-header">
          <svg class="header-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            #searchInput
            type="text"
            class="spotlight-input"
            [(ngModel)]="searchQuery"
            (input)="onSearchChange()"
            (keydown)="onKeydown($event)"
            placeholder="Type to search 40+ Calculators, Image & PDF Tools..."
            autofocus
          />
          <button class="clear-btn" *ngIf="searchQuery" (click)="clearSearch()">✕</button>
          <button class="close-btn" (click)="closeSpotlight()">ESC</button>
        </div>

        <!-- Category Tabs -->
        <div class="category-tabs">
          <button
            class="tab-btn"
            [class.active]="selectedCategory === 'ALL'"
            (click)="selectCategory('ALL')">
            ✨ All Tools ({{ allTools.length }})
          </button>
          <button
            class="tab-btn"
            [class.active]="selectedCategory === 'Calculators'"
            (click)="selectCategory('Calculators')">
            🧮 Calculators
          </button>
          <button
            class="tab-btn"
            [class.active]="selectedCategory === 'Image Tools'"
            (click)="selectCategory('Image Tools')">
            🖼️ Image Tools
          </button>
          <button
            class="tab-btn"
            [class.active]="selectedCategory === 'PDF Tools'"
            (click)="selectCategory('PDF Tools')">
            📄 PDF Tools
          </button>
        </div>

        <!-- Tool List -->
        <div class="spotlight-results">
          <div
            *ngFor="let tool of filteredTools(); let i = index"
            class="tool-item"
            [class.selected]="i === selectedIndex"
            (mouseenter)="selectedIndex = i"
            (click)="navigate(tool)">
            <div class="item-icon">
              <span>{{ tool.icon }}</span>
            </div>
            <div class="item-content">
              <div class="item-header">
                <span class="item-title">{{ tool.name }}</span>
                <span class="item-tag" *ngIf="tool.tag">{{ tool.tag }}</span>
              </div>
              <p class="item-desc">{{ tool.description }}</p>
            </div>
            <div class="item-category-badge">
              <span>{{ tool.category }}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>

          <div class="no-results" *ngIf="filteredTools().length === 0">
            <span class="no-results-icon">💫</span>
            <p>No tools matched "<strong>{{ searchQuery }}</strong>"</p>
            <span>Try searching keywords like "EMI", "Compress", "PDF", "Background" or "BMI"</span>
          </div>
        </div>

        <!-- Footer shortcut legend -->
        <div class="spotlight-footer">
          <div class="legend-item"><kbd>↑</kbd><kbd>↓</kbd> to navigate</div>
          <div class="legend-item"><kbd>Enter</kbd> to open</div>
          <div class="legend-item"><kbd>Esc</kbd> to close</div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .spotlight-trigger {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.85rem;
      border-radius: 99px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: var(--text-color, #e2e8f0);
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s ease;
    }
    .spotlight-trigger:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(99, 102, 241, 0.5);
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
    }
    .search-icon {
      color: #818cf8;
    }
    .trigger-label {
      font-weight: 500;
    }
    .shortcut-kbd {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0.1rem 0.45rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 600;
      color: #a5b4fc;
    }

    .spotlight-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(10, 15, 30, 0.75);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      padding-top: 10vh;
      animation: fadeIn 0.15s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .spotlight-modal {
      width: 100%;
      max-width: 680px;
      margin: 0 1rem;
      border-radius: 20px;
      background: rgba(18, 24, 43, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(99, 102, 241, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 78vh;
      animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes scaleIn {
      from { transform: scale(0.96) translateY(-10px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }

    .spotlight-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .header-icon {
      color: #818cf8;
      flex-shrink: 0;
    }
    .spotlight-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-size: 1.05rem;
      color: #fff;
    }
    .spotlight-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }
    .clear-btn {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: #fff;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
    .close-btn {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      cursor: pointer;
    }

    .category-tabs {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      overflow-x: auto;
      background: rgba(0, 0, 0, 0.15);
    }
    .tab-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.7);
      padding: 0.35rem 0.8rem;
      border-radius: 99px;
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .tab-btn.active, .tab-btn:hover {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3));
      border-color: rgba(168, 85, 247, 0.5);
      color: #fff;
    }

    .spotlight-results {
      overflow-y: auto;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      flex: 1;
    }

    .tool-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid transparent;
    }
    .tool-item.selected, .tool-item:hover {
      background: rgba(99, 102, 241, 0.15);
      border-color: rgba(99, 102, 241, 0.4);
      transform: translateX(4px);
    }
    .item-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      flex-shrink: 0;
    }
    .item-content {
      flex: 1;
      min-width: 0;
    }
    .item-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .item-title {
      font-weight: 600;
      color: #fff;
      font-size: 0.95rem;
    }
    .item-tag {
      font-size: 0.68rem;
      padding: 0.15rem 0.45rem;
      border-radius: 99px;
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      font-weight: 600;
    }
    .item-desc {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.55);
      margin: 0.15rem 0 0 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-category-badge {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: #a5b4fc;
      background: rgba(99, 102, 241, 0.15);
      padding: 0.3rem 0.6rem;
      border-radius: 8px;
    }

    .no-results {
      padding: 3rem 1.5rem;
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
    }
    .no-results-icon {
      font-size: 2.5rem;
      display: block;
      margin-bottom: 0.75rem;
    }

    .spotlight-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      padding: 0.65rem 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.25);
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    kbd {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      padding: 0.1rem 0.35rem;
      font-size: 0.7rem;
    }
  `]
})
export class SpotlightSearchComponent {
  isOpen = signal(false);
  searchQuery = '';
  selectedCategory: 'ALL' | 'Calculators' | 'Image Tools' | 'PDF Tools' = 'ALL';
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
    { id: 'rotate-pdf', name: 'Rotate PDF Orientation', description: 'Rotate PDF pages 90, 180 or 270 degrees instantly', category: 'PDF Tools', route: '/pdf-processing/rotate-pdf', icon: '🔄' },
    { id: 'add-password', name: 'Protect PDF with Password', description: 'Encrypt sensitive PDF files with strong AES encryption', category: 'PDF Tools', route: '/pdf-processing/add-password', icon: '🔒' },
    { id: 'remove-password', name: 'Unlock PDF Password', description: 'Remove password restrictions from PDF files you own', category: 'PDF Tools', route: '/pdf-processing/remove-password', icon: '🔓' }
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

  selectCategory(category: 'ALL' | 'Calculators' | 'Image Tools' | 'PDF Tools') {
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
