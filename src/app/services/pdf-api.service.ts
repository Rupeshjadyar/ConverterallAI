import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfApiService {
  constructor() {}

  // PDF to Office formats
  public pdfToWord(file: File): Observable<Blob> {
    // Simulated cloud call
    const mockData = new Blob(['Mock Word document converted from ' + file.name], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    return of(mockData).pipe(delay(2000));
  }

  public pdfToExcel(file: File): Observable<Blob> {
    const mockData = new Blob(['Mock Excel sheet converted from ' + file.name], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return of(mockData).pipe(delay(2000));
  }

  public pdfToPpt(file: File): Observable<Blob> {
    const mockData = new Blob(['Mock PPT presentation converted from ' + file.name], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
    return of(mockData).pipe(delay(2000));
  }

  // Office formats to PDF
  public wordToPdf(file: File): Observable<Blob> {
    const mockData = new Blob(['Mock PDF generated from Word file ' + file.name], { type: 'application/pdf' });
    return of(mockData).pipe(delay(2000));
  }

  public excelToPdf(file: File): Observable<Blob> {
    const mockData = new Blob(['Mock PDF generated from Excel file ' + file.name], { type: 'application/pdf' });
    return of(mockData).pipe(delay(2000));
  }

  public pptToPdf(file: File): Observable<Blob> {
    const mockData = new Blob(['Mock PDF generated from PPT file ' + file.name], { type: 'application/pdf' });
    return of(mockData).pipe(delay(2000));
  }

  // Optimization & AI tasks
  public compressPdf(file: File, quality: 'extreme' | 'recommended' | 'low' = 'recommended'): Observable<Blob> {
    const mockData = new Blob(['Mock compressed PDF from ' + file.name + ' with quality ' + quality], { type: 'application/pdf' });
    return of(mockData).pipe(delay(2000));
  }

  public ocrPdf(file: File, language: string = 'eng'): Observable<Blob> {
    const mockData = new Blob(['Mock OCR-ed searchable PDF from ' + file.name + ' with language ' + language], { type: 'application/pdf' });
    return of(mockData).pipe(delay(2000));
  }

  public aiSummarize(file: File): Observable<{ summary: string }> {
    return of({
      summary: `Here is a simulated AI summary of your document "${file.name}":\n\n1. Key points are extracted successfully.\n2. The main topic concerns PDF file formatting and tools.\n3. Safe client-side execution is recommended whenever possible.`
    }).pipe(delay(1500));
  }

  public translatePdf(file: File, targetLanguage: string): Observable<Blob> {
    const mockData = new Blob(['Mock translated PDF in ' + targetLanguage + ' from ' + file.name], { type: 'application/pdf' });
    return of(mockData).pipe(delay(2000));
  }

  // HTML / URL to PDF
  public htmlToPdf(urlOrHtml: string): Observable<Blob> {
    const mockData = new Blob(['Mock PDF generated from webpage/HTML input: ' + urlOrHtml.substring(0, 100)], { type: 'application/pdf' });
    return of(mockData).pipe(delay(2000));
  }

  // Other Cloud utilities
  public repairPdf(file: File): Observable<Blob> {
    const mockData = new Blob(['Mock repaired PDF from ' + file.name], { type: 'application/pdf' });
    return of(mockData).pipe(delay(2000));
  }

  public pdfToPdfa(file: File): Observable<Blob> {
    const mockData = new Blob(['Mock PDF/A compliant document from ' + file.name], { type: 'application/pdf' });
    return of(mockData).pipe(delay(2000));
  }
}
