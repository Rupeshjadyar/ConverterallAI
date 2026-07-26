import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
interface ImageTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  popular: boolean;
  category: string;
}
@Component({
  selector: 'app-image-processing-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-processing-home.html',
  styleUrls: ['./image-processing-home.css'],
})
export class ImageProcessingHome {
  searchTerm = '';
  selectedCategory = 'all';
  categories = [
    { id: 'all', name: 'All Tools', icon: '🎯' },
    { id: 'compress', name: 'Compress', icon: '🗜️' },
    { id: 'resize', name: 'Resize', icon: '📏' },
    { id: 'convert', name: 'Convert', icon: '🔄' },
    { id: 'edit', name: 'Edit', icon: '✂️' },
    { id: 'format', name: 'Format', icon: '📁' },
  ];
  imageTools: ImageTool[] = [
    {
      id: 'compressor',
      name: 'Image Compressor',
      description: 'Reduce image size while maintaining quality. Perfect for web & social media.',
      icon: '🗜️',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/image-processing/compressor',
      popular: true,
      category: 'compress',
    },
    {
      id: 'bg-remover',
      name: 'Background Remover',
      description: 'Remove image backgrounds instantly for free using AI.',
      icon: '🪄',
      color: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      route: '/image-processing/bg-remover',
      popular: true,
      category: 'edit',
    },
    {
      id: 'editor',
      name: 'Advanced Image Editor',
      description: 'Edit, filter, transform, and add watermarks to your images.',
      icon: '🎨',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      route: '/image-processing/editor',
      popular: true,
      category: 'edit',
    },
    {
      id: 'cropper',
      name: 'Image Cropper',
      description: 'Crop images to exact dimensions and rotate them.',
      icon: '✂️',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      route: '/image-processing/cropper',
      popular: false,
      category: 'edit',
    },
    {
      id: 'format-converter',
      name: 'Format Converter',
      description: 'Convert between JPG, PNG, WEBP instantly.',
      icon: '🔄',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      route: '/image-processing/format-converter',
      popular: true,
      category: 'convert',
    },
    {
      id: 'image-to-pdf',
      name: 'Image to PDF',
      description: 'Convert multiple images to PDF. Merge and organize pages.',
      icon: '📄',
      color: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      route: '/image-processing/image-to-pdf',
      popular: true,
      category: 'format',
    },
  ];
  filteredTools = [...this.imageTools];
  popularTools = this.imageTools.filter((tool) => tool.popular);
  constructor(private router: Router) {}
  filterTools(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTools = this.imageTools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(term) ||
        tool.description.toLowerCase().includes(term);
      const matchesCategory =
        this.selectedCategory === 'all' ||
        tool.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }
  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterTools();
  }
  openTool(tool: ImageTool): void {
    this.router.navigate([tool.route]);
  }
  trackByToolId(_index: number, tool: ImageTool): string {
    return tool.id;
  }
}
