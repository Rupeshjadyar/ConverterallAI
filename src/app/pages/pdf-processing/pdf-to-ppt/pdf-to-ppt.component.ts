import { Component } from '@angular/core';
import { PdfFileToolComponent } from '../pdf-file-tool.component';

@Component({
  selector: 'app-pdf-to-ppt',
  imports: [PdfFileToolComponent],
  template: '<app-pdf-file-tool kind="pptx" />',
})
export class PdfToPptComponent {}
