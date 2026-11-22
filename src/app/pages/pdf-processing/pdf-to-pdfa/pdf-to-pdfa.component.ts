import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pdf-to-pdfa',
  imports: [RouterLink],
  template: `
    <section class="container py-4">
      <a routerLink="/pdf-processing">← PDF Tools</a>
      <h1 class="mt-3">PDF to PDF/A</h1>
      <p>PDF/A conversion is currently unavailable.</p>
    </section>
  `,
})
export class PdfToPdfaComponent {}
