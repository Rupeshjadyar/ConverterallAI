import { Component } from '@angular/core';
import { PdfFileToolComponent } from '../pdf-file-tool.component';

@Component({
  selector: 'app-ocr-pdf',
  imports: [PdfFileToolComponent],
  template: '<app-pdf-file-tool kind="ocr" />',
})
export class OcrPdfComponent {}
