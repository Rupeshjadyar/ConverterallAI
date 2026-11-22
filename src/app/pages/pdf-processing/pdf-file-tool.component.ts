import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { downloadPdfToolOutput } from './pdf-browser';
import { processPdfInWorker } from './pdf-engine';
import { exportPdfToOffice } from './pdf-office';

const tools = {
  protect: {
    title: 'Password Protect PDF',
    description: 'Encrypt a PDF with AES-256. Keep the password somewhere safe so you can reopen the file.',
    suffix: '-protected.pdf',
  },
  unlock: {
    title: 'Remove PDF Password',
    description: 'Enter the current password to make an unlocked copy of a PDF you have access to.',
    suffix: '-unlocked.pdf',
  },
  docx: {
    title: 'PDF to Word',
    description: 'Export selectable PDF text to an editable DOCX. Page layouts and images are omitted.',
    suffix: '.docx',
  },
  xlsx: {
    title: 'PDF to Excel',
    description: 'Group selectable PDF text into worksheet rows and cells. Check the result against the source if its columns are complex.',
    suffix: '.xlsx',
  },
  pptx: {
    title: 'PDF to PowerPoint',
    description: 'Create a PPTX with one image slide for each PDF page.',
    suffix: '.pptx',
  },
  ocr: {
    title: 'Make a Searchable PDF',
    description: 'Recognize English text in a scanned PDF and add a searchable text layer. Clear scans give the best results.',
    suffix: '-searchable.pdf',
  },
} as const;

@Component({
  selector: 'app-pdf-file-tool',
  imports: [FormsModule, RouterLink],
  templateUrl: './pdf-file-tool.component.html',
  styleUrl: './pdf-file-tool.component.css',
})
export class PdfFileToolComponent {
  readonly kind = input.required<keyof typeof tools>();
  readonly tool = computed(() => tools[this.kind()]);
  readonly needsPassword = computed(() => this.kind() === 'protect' || this.kind() === 'unlock');
  readonly file = signal<File | null>(null);
  readonly output = signal<Blob | null>(null);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly status = signal('');
  password = '';
  confirmation = '';

  choose(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) this.setFile(file);
  }

  drop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  private setFile(file: File): void {
    if (this.busy()) return;
    this.file.set(null);
    this.output.set(null);
    this.password = this.confirmation = '';
    this.error.set('');
    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      this.error.set('Choose a PDF file.');
    } else if (!file.size || file.size > 100 * 1024 * 1024) {
      this.error.set('Choose a nonempty PDF no larger than 100 MB.');
    } else {
      this.file.set(file);
    }
  }

  async convert(): Promise<void> {
    const file = this.file();
    const operation = this.kind();
    if (!file || this.busy()) return;
    this.output.set(null);
    this.error.set('');
    if (this.needsPassword() && (!this.password || this.password.includes('\0') ||
      new TextEncoder().encode(this.password).byteLength > 127)) {
      this.error.set('Enter a password between 1 and 127 UTF-8 bytes.');
      return;
    }
    if (operation === 'protect' && this.password !== this.confirmation) {
      this.error.set('The passwords must match.');
      return;
    }

    this.busy.set(true);
    this.status.set('Opening PDF…');
    const updateProgress = (label: string) => this.status.set(label);
    try {
      let result: Blob;
      if (operation === 'protect' || operation === 'unlock') {
        this.status.set('Processing PDF in this browser…');
        result = await processPdfInWorker(file, operation, this.password);
      } else if (operation === 'ocr') {
        const { makeSearchablePdf } = await import('./pdf-ocr');
        result = await makeSearchablePdf(file, updateProgress);
      } else {
        result = await exportPdfToOffice(file, operation, updateProgress);
      }
      this.output.set(result);
      this.password = this.confirmation = '';
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Could not process the PDF.');
    } finally {
      this.busy.set(false);
      this.status.set('');
    }
  }

  download(): void {
    const blob = this.output();
    const file = this.file();
    if (blob && file) downloadPdfToolOutput(blob, file.name.replace(/\.pdf$/i, '') + this.tool().suffix);
  }
}
