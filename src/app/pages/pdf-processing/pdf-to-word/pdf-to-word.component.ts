import { Component } from '@angular/core';
import { PdfFileToolComponent } from '../pdf-file-tool.component';

@Component({
  selector: 'app-pdf-to-word',
  imports: [PdfFileToolComponent],
  template: '<app-pdf-file-tool kind="docx" />',
})
export class PdfToWordComponent {}
