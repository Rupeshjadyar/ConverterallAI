import { Component } from '@angular/core';
import { PdfFileToolComponent } from '../pdf-file-tool.component';

@Component({
  selector: 'app-remove-password',
  imports: [PdfFileToolComponent],
  template: '<app-pdf-file-tool kind="unlock" />',
})
export class RemovePasswordComponent {}
