import { Component } from '@angular/core';
import { PdfFileToolComponent } from '../pdf-file-tool.component';

@Component({
  selector: 'app-pdf-to-excel',
  imports: [PdfFileToolComponent],
  template: '<app-pdf-file-tool kind="xlsx" />',
})
export class PdfToExcelComponent {}
