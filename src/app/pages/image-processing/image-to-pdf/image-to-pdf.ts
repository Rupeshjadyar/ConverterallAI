import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import jsPDF from 'jspdf';

interface SelectedImage {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-image-to-pdf',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-to-pdf.html',
  styleUrls: ['./image-to-pdf.css']
})
export class ImageToPdfComponent {
  selectedImages: SelectedImage[] = [];
  isProcessing: boolean = false;
  progressVal: number = 100;

  // Ultra Premium PDF Settings (Exact Reference Mockup UI & Theme Support)
  pageOrientation: 'portrait' | 'landscape' = 'portrait';
  pageSize: 'a4' | 'letter' | 'auto' = 'a4';
  marginMm: number = 12;
  qualityPercent: number = 90;
  optimizeForWeb: boolean = true;
  activePageIndex: number = 0;
  activeNavTab: string = 'image-to-pdf';
  draggedIndex: number | null = null;

  navTools = [
    { id: 'image-processing', name: 'All Image Tools', icon: '🖼️', route: '/image-processing' },
    { id: 'image-to-pdf', name: 'Image to PDF', icon: '📄', route: '/image-processing/image-to-pdf' },
    { id: 'editor', name: 'Pro Image Editor', icon: '🎨', route: '/image-processing/editor' },
    { id: 'bg-remover', name: 'BG Remover', icon: '🪄', route: '/image-processing/bg-remover' },
    { id: 'compressor', name: 'Compressor', icon: '🗜️', route: '/image-processing/compressor' },
    { id: 'format-converter', name: 'Format Converter', icon: '🔄', route: '/image-processing/format-converter' },
    { id: 'cropper', name: 'Image Cropper', icon: '✂️', route: '/image-processing/cropper' },
    { id: 'pdf-processing', name: 'PDF Toolkit', icon: '📚', route: '/pdf-processing' }
  ];

  constructor(private title: Title, private meta: Meta, private router: Router, public themeService: ThemeService) {
    this.title.setTitle('Create Ultra Premium PDF - Pro Image to PDF Converter');
    this.meta.updateTag({ name: 'description', content: 'Transform images into professional PDF documents — fast, secure, and elegant with 16-bit compression and multi-page reordering.' });
  }

  navigateTo(route: string, id: string) {
    this.activeNavTab = id;
    if (route && route !== '/image-processing/image-to-pdf') {
      this.router.navigate([route]);
    }
  }

  get estimatedSizeMb(): string {
    if (this.selectedImages.length === 0) return '0.0';
    let totalBytes = 0;
    for (const item of this.selectedImages) {
      totalBytes += item.file.size || 500000;
    }
    const qualityFactor = (this.qualityPercent / 100) * (this.optimizeForWeb ? 0.7 : 1.0);
    const est = (totalBytes * qualityFactor) / (1024 * 1024);
    return est.toFixed(1);
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.isProcessing = true;
      this.progressVal = 15;
      
      const filesArray = Array.from(input.files);
      let loadedCount = 0;

      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        this.selectedImages.push({
          file: file,
          previewUrl: URL.createObjectURL(file)
        });
        loadedCount++;
        this.progressVal = Math.round((loadedCount / filesArray.length) * 100);
      }
      
      if (this.selectedImages.length > 0 && this.activePageIndex >= this.selectedImages.length) {
        this.activePageIndex = 0;
      }
      setTimeout(() => {
        this.isProcessing = false;
        this.progressVal = 100;
      }, 400);
    }
    input.value = '';
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    if (this.activePageIndex >= this.selectedImages.length) {
      this.activePageIndex = Math.max(0, this.selectedImages.length - 1);
    }
  }

  deleteActivePage() {
    if (this.selectedImages.length > 0) {
      this.removeImage(this.activePageIndex);
    }
  }

  duplicateActivePage() {
    if (this.selectedImages.length > 0 && this.selectedImages[this.activePageIndex]) {
      const current = this.selectedImages[this.activePageIndex];
      this.selectedImages.splice(this.activePageIndex + 1, 0, {
        file: current.file,
        previewUrl: current.previewUrl
      });
      this.activePageIndex++;
    }
  }

  moveImageUp(index: number) {
    if (index > 0) {
      const temp = this.selectedImages[index];
      this.selectedImages[index] = this.selectedImages[index - 1];
      this.selectedImages[index - 1] = temp;
      this.activePageIndex = index - 1;
    }
  }

  moveImageDown(index: number) {
    if (index < this.selectedImages.length - 1) {
      const temp = this.selectedImages[index];
      this.selectedImages[index] = this.selectedImages[index + 1];
      this.selectedImages[index + 1] = temp;
      this.activePageIndex = index + 1;
    }
  }

  onDragStart(index: number) {
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
      const item = this.selectedImages.splice(this.draggedIndex, 1)[0];
      this.selectedImages.splice(dropIndex, 0, item);
      this.activePageIndex = dropIndex;
    }
    this.draggedIndex = null;
  }

  async generatePdf() {
    if (this.selectedImages.length === 0) return;
    this.isProcessing = true;
    this.progressVal = 20;

    try {
      let pdf: jsPDF | null = null;
      
      for (let i = 0; i < this.selectedImages.length; i++) {
        const imgData = this.selectedImages[i].previewUrl;
        const imgDimensions = await this.getImageDimensions(imgData);
        
        let currentFormat: string | number[] = this.pageSize === 'letter' ? 'letter' : 'a4';
        const orient = this.pageOrientation === 'portrait' ? 'p' : 'l';
        
        if (this.pageSize === 'auto') {
          const px2mm = 25.4 / 96; // assume 96dpi for auto size mapping
          const autoW = (imgDimensions.width * px2mm) + (this.marginMm * 2);
          const autoH = (imgDimensions.height * px2mm) + (this.marginMm * 2);
          currentFormat = [autoW, autoH];
        }

        if (i === 0) {
          pdf = new jsPDF({ orientation: orient, unit: 'mm', format: currentFormat });
        } else {
          pdf!.addPage(currentFormat, orient);
        }

        const pdfWidth = pdf!.internal.pageSize.getWidth();
        const pdfHeight = pdf!.internal.pageSize.getHeight();

        // Calculate dimensions accounting for user margins (in mm)
        const availWidth = Math.max(10, pdfWidth - (this.marginMm * 2));
        const availHeight = Math.max(10, pdfHeight - (this.marginMm * 2));
        
        const ratio = Math.min(availWidth / imgDimensions.width, availHeight / imgDimensions.height);
        
        const finalWidth = imgDimensions.width * ratio;
        const finalHeight = imgDimensions.height * ratio;
        
        const xOffset = this.marginMm + (availWidth - finalWidth) / 2;
        const yOffset = this.marginMm + (availHeight - finalHeight) / 2;

        pdf!.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
        this.progressVal = Math.round(((i + 1) / this.selectedImages.length) * 100);
        
        // Yield execution to unblock UI thread
        await new Promise(r => setTimeout(r, 0));
      }

      if (pdf) {
        pdf.save('Ultra-Premium-Document.pdf');
      }
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Error generating PDF.');
    } finally {
      this.isProcessing = false;
      this.progressVal = 100;
    }
  }

  private getImageDimensions(url: string): Promise<{width: number, height: number}> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = url;
    });
  }
}
