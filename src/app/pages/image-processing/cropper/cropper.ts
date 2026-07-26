import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { ImageCropperComponent, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-cropper',
  standalone: true,
  imports: [CommonModule, FormsModule, ImageCropperComponent],
  templateUrl: './cropper.html',
  styleUrls: ['./cropper.css']
})
export class CropperComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  aspectRatio: number = 4 / 3;

  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Image Cropper - Crop Photos Online');
    this.meta.updateTag({ name: 'description', content: 'Crop, rotate, and resize your images perfectly.' });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl || event.base64;
  }
  
  imageLoaded() {}
  cropperReady() {}
  loadImageFailed() {}

  downloadImage() {
    if (this.croppedImage) {
      const link = document.createElement('a');
      link.href = this.croppedImage;
      link.download = 'cropped-image.png';
      link.click();
    }
  }

  setRatio(ratio: number) {
    this.aspectRatio = ratio;
  }
}
