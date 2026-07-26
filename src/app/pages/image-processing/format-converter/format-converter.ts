import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

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

  formats = [
    { value: 'image/jpeg', label: 'JPG' },
    { value: 'image/png', label: 'PNG' },
    { value: 'image/webp', label: 'WEBP' },
    { value: 'image/bmp', label: 'BMP' },
    { value: 'image/gif', label: 'GIF' },
    { value: 'image/x-icon', label: 'ICO' },
    { value: 'image/tiff', label: 'TIFF' }
  ];

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Image Format Converter - Free Online Tool');
    this.meta.updateTag({ name: 'description', content: 'Convert images to JPG, PNG, WEBP for free online. No API needed, fast and secure.' });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
      this.convertedUrl = null;
    }
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
    if (this.convertedUrl) {
      const link = document.createElement('a');
      link.href = this.convertedUrl;
      const extension = this.targetFormat.split('/')[1];
      const originalName = this.selectedFile!.name.split('.')[0];
      link.download = `${originalName}-converted.${extension}`;
      link.click();
    }
  }
}
