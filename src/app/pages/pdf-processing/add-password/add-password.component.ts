import { Component } from '@angular/core';
import { PdfFileToolComponent } from '../pdf-file-tool.component';

@Component({
  selector: 'app-add-password',
  imports: [PdfFileToolComponent],
  template: '<app-pdf-file-tool kind="protect" />',
})
export class AddPasswordComponent {}
