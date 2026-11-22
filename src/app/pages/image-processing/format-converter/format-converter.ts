import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-format-converter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './format-converter.html',
  styleUrls: ['./format-converter.css']
})
export class FormatConverterComponent implements OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);

  selectedFile: File | null = null;
  previewUrl: string | null = null;
  targetFormat: string = 'image/jpeg';
  convertedUrl: string | null = null;
  isDragging: boolean = false;
  isConverting = false;
  errorMessage = '';

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
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  processFile(file: File) {
    this.resetImage();
    if (file.type && !file.type.startsWith('image/')) {
      this.errorMessage = 'Choose a valid image file.';
      return;
    }
    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(file);
  }

  resetImage() {
    this.selectedFile = null;
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
    this.convertedUrl = null;
    this.isConverting = false;
    this.errorMessage = '';
  }

  ngOnDestroy() {
    this.resetImage();
  }

  async convertImage() {
    const previewUrl = this.previewUrl;
    if (!previewUrl || this.isConverting) return;

    const targetFormat = this.targetFormat;
    this.convertedUrl = null;
    this.errorMessage = '';
    this.isConverting = true;

    try {
      const img = new Image();
      img.src = previewUrl;
      await img.decode();
      if (this.previewUrl !== previewUrl) return;

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');

      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);
      const result = canvas.toDataURL(targetFormat, 0.9);
      if (!result.startsWith(`data:${targetFormat};`)) {
        this.errorMessage = 'This browser could not export the image in the selected format.';
        return;
      }
      this.convertedUrl = result;
    } catch {
      if (this.previewUrl === previewUrl) {
        this.errorMessage = 'Could not convert this image. Try a valid PNG, JPG, or WebP file.';
      }
    } finally {
      if (this.previewUrl === previewUrl) {
        this.isConverting = false;
        this.cdr.markForCheck();
      }
    }
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
      const outputType = this.convertedUrl.slice(5, this.convertedUrl.indexOf(';'));
      const extension = extMap[outputType];
      if (!extension) return;
      const originalName = this.selectedFile.name.replace(/\.[^/.]+$/, '');
      link.download = `${originalName}-converted.${extension}`;
      link.click();
    }
  }
}
