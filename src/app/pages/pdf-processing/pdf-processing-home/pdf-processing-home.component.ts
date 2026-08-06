import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface DocumentTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  popular: boolean;
  category: string;
  local: boolean;
}

@Component({
  selector: 'app-pdf-processing-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pdf-processing-home.component.html',
  styleUrls: ['./pdf-processing-home.component.css']
})
export class PdfProcessingHomeComponent implements OnInit {
  searchTerm = '';
  selectedCategory = 'all';

  categories = [
    { id: 'all', name: 'All Tools', icon: '🎯' },
    { id: 'convert-to', name: 'Convert to PDF', icon: '📥' },
    { id: 'convert-from', name: 'Convert from PDF', icon: '📤' },
    { id: 'edit', name: 'Edit & Organize', icon: '✂️' },
    { id: 'optimize', name: 'Optimize & Repair', icon: '🗜️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'ai', name: 'AI Utilities', icon: '🤖' }
  ];

  documentTools: DocumentTool[] = [
    {
      id: 'resume-builder',
      name: 'Resume Builder',
      description: 'Build stunning resumes with 21 free templates and export as PDF.',
      icon: '📝',
      color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      route: '/resume-builder',
      popular: true,
      category: 'edit',
      local: true
    },
    {
      id: 'merge-pdf',
      name: 'Merge PDF',
      description: 'Combine multiple PDF files into one document in your preferred order.',
      icon: '🔗',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      route: '/pdf-processing/merge-pdf',
      popular: true,
      category: 'edit',
      local: true
    },
    {
      id: 'split-pdf',
      name: 'Split PDF',
      description: 'Extract specific pages or split PDF pages into multiple documents.',
      icon: '✂️',
      color: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      route: '/pdf-processing/split-pdf',
      popular: false,
      category: 'edit',
      local: true
    },
    {
      id: 'compress-pdf',
      name: 'Compress PDF',
      description: 'Reduce PDF file size while maintaining the original layout quality.',
      icon: '🗜️',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/pdf-processing/compress-pdf',
      popular: true,
      category: 'optimize',
      local: false
    },
    {
      id: 'pdf-to-word',
      name: 'PDF to Word',
      description: 'Convert PDF files to editable Microsoft Word documents with high accuracy.',
      icon: '📄',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      route: '/pdf-processing/pdf-to-word',
      popular: true,
      category: 'convert-from',
      local: false
    },
    {
      id: 'pdf-to-ppt',
      name: 'PDF to PPT',
      description: 'Convert PDF presentation slides back into editable PowerPoint files.',
      icon: '📉',
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      route: '/pdf-processing/pdf-to-ppt',
      popular: false,
      category: 'convert-from',
      local: false
    },
    {
      id: 'pdf-to-excel',
      name: 'PDF to Excel',
      description: 'Extract tables from PDF documents to Excel spreadsheets instantly.',
      icon: '📊',
      color: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      route: '/pdf-processing/pdf-to-excel',
      popular: false,
      category: 'convert-from',
      local: false
    },
    {
      id: 'word-to-pdf',
      name: 'Word to PDF',
      description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
      icon: '📝',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      route: '/pdf-processing/word-to-pdf',
      popular: true,
      category: 'convert-to',
      local: false
    },
    {
      id: 'ppt-to-pdf',
      name: 'PPT to PDF',
      description: 'Convert PPT and PPTX slideshows into portable PDF files.',
      icon: '🖥️',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      route: '/pdf-processing/ppt-to-pdf',
      popular: false,
      category: 'convert-to',
      local: false
    },
    {
      id: 'excel-to-pdf',
      name: 'Excel to PDF',
      description: 'Convert XLS and XLSX spreadsheets to clean PDF documents.',
      icon: '📈',
      color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      route: '/pdf-processing/excel-to-pdf',
      popular: false,
      category: 'convert-to',
      local: false
    },
    {
      id: 'edit-pdf',
      name: 'Edit PDF',
      description: 'Edit text, images, and shapes directly inside your PDF document.',
      icon: '✏️',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      route: '/pdf-processing/edit-pdf',
      popular: true,
      category: 'edit',
      local: false
    },
    {
      id: 'pdf-to-jpg',
      name: 'PDF to JPG',
      description: 'Convert PDF document pages into high-resolution JPG images.',
      icon: '🖼️',
      color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      route: '/pdf-processing/pdf-to-jpg',
      popular: false,
      category: 'convert-from',
      local: false
    },
    {
      id: 'jpg-to-pdf',
      name: 'JPG to PDF',
      description: 'Convert and merge JPG, PNG, and GIF images into one PDF.',
      icon: '📸',
      color: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      route: '/pdf-processing/jpg-to-pdf',
      popular: true,
      category: 'convert-to',
      local: true
    },
    {
      id: 'sign-pdf',
      name: 'Sign PDF',
      description: 'Sign documents digitally and request electronic signatures from others.',
      icon: '✍️',
      color: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      route: '/pdf-processing/sign-pdf',
      popular: true,
      category: 'security',
      local: true
    },
    {
      id: 'add-watermark',
      name: 'Add Watermark',
      description: 'Protect document intellectual property with image or text watermarks.',
      icon: '🏷️',
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      route: '/pdf-processing/add-watermark',
      popular: false,
      category: 'edit',
      local: true
    },
    {
      id: 'rotate-pdf',
      name: 'Rotate PDF',
      description: 'Rotate single or multiple pages in your PDF document easily.',
      icon: '🔄',
      color: 'linear-gradient(135deg, #fda085 0%, #f6d365 100%)',
      route: '/pdf-processing/rotate-pdf',
      popular: false,
      category: 'edit',
      local: true
    },
    {
      id: 'html-to-pdf',
      name: 'HTML to PDF',
      description: 'Convert web page files or code snippets into clean PDFs.',
      icon: '🌐',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      route: '/pdf-processing/html-to-pdf',
      popular: false,
      category: 'convert-to',
      local: false
    },
    {
      id: 'remove-password',
      name: 'Remove Password',
      description: 'Unlock password-protected PDFs and disable security constraints.',
      icon: '🔓',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      route: '/pdf-processing/remove-password',
      popular: false,
      category: 'security',
      local: true
    },
    {
      id: 'add-password',
      name: 'Add Password',
      description: 'Secure your PDF files with high-strength user access passwords.',
      icon: '🔒',
      color: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      route: '/pdf-processing/add-password',
      popular: true,
      category: 'security',
      local: true
    },
    {
      id: 'organize-pdf',
      name: 'Organize PDF',
      description: 'Reorder, delete, and insert pages in your PDF document.',
      icon: '🗂️',
      color: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      route: '/pdf-processing/organize-pdf',
      popular: false,
      category: 'edit',
      local: true
    },
    {
      id: 'pdf-to-pdfa',
      name: 'PDF to PDF/A',
      description: 'Convert PDFs to PDF/A for long-term archiving and compliance.',
      icon: '📜',
      color: 'linear-gradient(135deg, #3a7bd5 0%, #3a6073 100%)',
      route: '/pdf-processing/pdf-to-pdfa',
      popular: false,
      category: 'optimize',
      local: false
    },
    {
      id: 'repair-pdf',
      name: 'Repair PDF',
      description: 'Fix damaged or corrupted PDF files and recover data.',
      icon: '🔧',
      color: 'linear-gradient(135deg, #135058 0%, #f107a3 100%)',
      route: '/pdf-processing/repair-pdf',
      popular: false,
      category: 'optimize',
      local: false
    },
    {
      id: 'add-page-numbers',
      name: 'Add Page Numbers',
      description: 'Number the pages of your PDF document automatically.',
      icon: '🔢',
      color: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)',
      route: '/pdf-processing/add-page-numbers',
      popular: false,
      category: 'edit',
      local: true
    },
    {
      id: 'scan-to-pdf',
      name: 'Scan to PDF',
      description: 'Convert scanner output or images to a clean, searchable PDF document.',
      icon: '🖨️',
      color: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
      route: '/pdf-processing/scan-to-pdf',
      popular: false,
      category: 'convert-to',
      local: true
    },
    {
      id: 'ocr-pdf',
      name: 'OCR PDF',
      description: 'Extract searchable text from scanned PDF documents using AI OCR.',
      icon: '🔍',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/pdf-processing/ocr-pdf',
      popular: true,
      category: 'ai',
      local: false
    },
    {
      id: 'compare-pdf',
      name: 'Compare PDF',
      description: 'Compare two PDFs side-by-side to highlight differences in text and layout.',
      icon: '⚖️',
      color: 'linear-gradient(135deg, #43c6ac 0%, #191654 100%)',
      route: '/pdf-processing/compare-pdf',
      popular: false,
      category: 'edit',
      local: false
    },
    {
      id: 'redact-pdf',
      name: 'Redact PDF',
      description: 'Permanently black out sensitive information and text from PDFs.',
      icon: '⬛',
      color: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
      route: '/pdf-processing/redact-pdf',
      popular: false,
      category: 'security',
      local: true
    },
    {
      id: 'crop-pdf',
      name: 'Crop PDF',
      description: 'Crop margins and adjust page dimensions of your PDF.',
      icon: '📐',
      color: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
      route: '/pdf-processing/crop-pdf',
      popular: false,
      category: 'edit',
      local: true
    },
    {
      id: 'pdf-forms',
      name: 'PDF Forms',
      description: 'Fill out interactive PDF forms or create new fillable forms.',
      icon: '📋',
      color: 'linear-gradient(135deg, #30e8bf 0%, #ff8235 100%)',
      route: '/pdf-processing/pdf-forms',
      popular: false,
      category: 'edit',
      local: true
    },
    {
      id: 'ai-summarizer',
      name: 'AI Summarizer',
      description: 'Summarize long PDF documents and answer questions using AI.',
      icon: '🤖',
      color: 'linear-gradient(135deg, #7f00ff 0%, #e100ff 100%)',
      route: '/pdf-processing/ai-summarizer',
      popular: true,
      category: 'ai',
      local: false
    },
    {
      id: 'translate-pdf',
      name: 'Translate PDF',
      description: 'Translate your PDF documents into other languages using AI.',
      icon: '🗣️',
      color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      route: '/pdf-processing/translate-pdf',
      popular: false,
      category: 'ai',
      local: false
    },
    {
      id: 'pdf-to-text',
      name: 'PDF to Text',
      description: 'Extract clean plain text from PDF files directly in your browser.',
      icon: '🔤',
      color: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
      route: '/pdf-processing/pdf-to-text',
      popular: false,
      category: 'convert-from',
      local: true
    },
    {
      id: 'text-to-pdf',
      name: 'Text to PDF',
      description: 'Convert simple text files (.txt) or snippets into a clean PDF.',
      icon: '✍️',
      color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      route: '/pdf-processing/text-to-pdf',
      popular: false,
      category: 'convert-to',
      local: true
    }
  ];

  filteredTools = [...this.documentTools];
  popularTools = this.documentTools.filter(tool => tool.popular);

  constructor(private router: Router) {}

  ngOnInit(): void {}

  filterTools(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTools = this.documentTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(term) || 
                           tool.description.toLowerCase().includes(term);
      const matchesCategory = this.selectedCategory === 'all' || tool.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterTools();
  }

  openTool(tool: DocumentTool): void {
    this.router.navigate([tool.route]);
  }

  trackByToolId(_index: number, tool: DocumentTool): string {
    return tool.id;
  }
}
