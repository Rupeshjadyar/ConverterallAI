import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-format-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './format-converter.html',
  styleUrls: ['./format-converter.css']
})
export class FormatConverterComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  targetFormat: string = 'image/jpeg';
  convertedUrl: string | null = null;
  isDragging: boolean = false;

  formats = [
    { value: 'image/jpeg', label: 'JPG' },
    { value: 'image/png', label: 'PNG' },
    { value: 'image/webp', label: 'WEBP' }
  ];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.processFile(file);
      }
    }
  }

  processFile(file: File) {
    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(this.selectedFile);
    this.convertedUrl = null;
  }

  resetImage() {
    this.selectedFile = null;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
    this.convertedUrl = null;
  }

  convertImage() {
    if (!this.selectedFile) return;

    const img = new Image();
    img.src = this.previewUrl!;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Fill white background in case converting transparent PNG to JPG
        if (this.targetFormat === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        this.convertedUrl = canvas.toDataURL(this.targetFormat, 0.9);
      }
    };
  }

  downloadImage() {
    if (this.convertedUrl && this.selectedFile) {
      const link = document.createElement('a');
      link.href = this.convertedUrl;
      const extMap: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp'
      };
      const extension = extMap[this.targetFormat] || 'jpg';
      const originalName = this.selectedFile.name.replace(/\.[^/.]+$/, '');
      link.download = `${originalName}-converted.${extension}`;
      link.click();
    }
  }
}
