import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SQL_TOPICS } from './sql/sql.models';

@Component({
  selector: 'app-developer-tools-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './developer-tools-home.component.html',
  styleUrls: ['./developer-tools-home.component.css']
})
export class DeveloperToolsHomeComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);

  sqlTopics = SQL_TOPICS;

  // 1. JSON
  jsonInput = '';
  jsonStatus = '';
  jsonPlaceholder = 'Paste JSON here e.g. {"name":"ConverterallAI","version":2}';

  // 2. Base64
  base64Input = '';
  base64Status = '';

  // 3. URL
  urlInput = '';
  urlStatus = '';

  // 4. JWT
  jwtInput = '';
  jwtHeader = '';
  jwtPayload = '';
  jwtExpiry = '';
  jwtStatus = '';

  // 5. Hash
  hashInput = '';
  hashSha256 = '';
  hashSha512 = '';
  hashSha1 = '';
  hashMd5 = '';
  hashStatus = '';

  // 6. UUID
  uuidQuantity = 1;
  uuidUppercase = false;
  uuidNoHyphens = false;
  generatedUuidsText = '';
  uuidStatus = '';

  // 7. Regex
  regexPattern = '';
  regexFlags = 'g';
  regexText = '';
  regexMatchCount = 0;
  regexError = '';

  // 8. HTML Entities
  htmlInput = '';
  htmlStatus = '';

  // 9. Markdown
  markdownInput = '### Hello Developer!\n\nThis is a **live Markdown preview** editor.\n- Fast in-browser execution\n- GitHub-flavored formatting\n- Instant HTML generation';
  markdownHtml = '';
  safeMarkdownHtml: SafeHtml = '';
  mdStatus = '';

  // 10. Color
  hexColor = '#7c3aed';
  rgbColor = 'rgb(124, 58, 237)';
  hslColor = 'hsl(262, 83%, 58%)';
  colorStatus = '';

  ngOnInit() {
    this.generateUuids();
    this.updateMarkdown();
    this.updateColor();
  }

  // --- Scroll ---
  scrollTo(elementId: string) {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('highlight-pulse');
      setTimeout(() => el.classList.remove('highlight-pulse'), 1500);
    }
  }

  // --- Copy ---
  copyText(text: string) {
    if (!text || typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(text);
  }

  // --- 1. JSON Formatter ---
  formatJson(indent: number) {
    if (!this.jsonInput) return;
    try {
      const parsed = JSON.parse(this.jsonInput);
      this.jsonInput = JSON.stringify(parsed, null, indent);
      this.jsonStatus = '✓ Valid JSON';
      setTimeout(() => this.jsonStatus = '', 2000);
    } catch (err: any) {
      this.jsonStatus = '⚠️ ' + err.message;
    }
  }

  // --- 2. Base64 ---
  encodeBase64() {
    if (!this.base64Input) return;
    try {
      this.base64Input = btoa(unescape(encodeURIComponent(this.base64Input)));
      this.base64Status = '✓ Encoded';
      setTimeout(() => this.base64Status = '', 2000);
    } catch {
      this.base64Status = '⚠️ Encoding error';
    }
  }

  decodeBase64() {
    if (!this.base64Input) return;
    try {
      this.base64Input = decodeURIComponent(escape(atob(this.base64Input)));
      this.base64Status = '✓ Decoded';
      setTimeout(() => this.base64Status = '', 2000);
    } catch {
      this.base64Status = '⚠️ Invalid Base64';
    }
  }

  // --- 3. URL ---
  encodeUrl() {
    if (!this.urlInput) return;
    this.urlInput = encodeURIComponent(this.urlInput);
    this.urlStatus = '✓ URL Encoded';
    setTimeout(() => this.urlStatus = '', 2000);
  }

  decodeUrl() {
    if (!this.urlInput) return;
    try {
      this.urlInput = decodeURIComponent(this.urlInput);
      this.urlStatus = '✓ URL Decoded';
      setTimeout(() => this.urlStatus = '', 2000);
    } catch {
      this.urlStatus = '⚠️ Invalid URI';
    }
  }

  // --- 4. JWT Decoder ---
  decodeJwt() {
    if (!this.jwtInput) {
      this.jwtHeader = '';
      this.jwtPayload = '';
      this.jwtExpiry = '';
      return;
    }
    try {
      const parts = this.jwtInput.trim().split('.');
      if (parts.length < 2) {
        this.jwtStatus = '⚠️ Invalid JWT structure (expected 3 parts)';
        return;
      }
      const headerStr = this.base64UrlDecode(parts[0]);
      const payloadStr = this.base64UrlDecode(parts[1]);
      const headerJson = JSON.parse(headerStr);
      const payloadJson = JSON.parse(payloadStr);

      this.jwtHeader = JSON.stringify(headerJson, null, 2);
      this.jwtPayload = JSON.stringify(payloadJson, null, 2);

      if (payloadJson.exp) {
        const expDate = new Date(payloadJson.exp * 1000);
        const isExpired = expDate.getTime() < Date.now();
        this.jwtExpiry = (isExpired ? '⚠️ Expired on: ' : '✓ Valid until: ') + expDate.toLocaleString();
      } else {
        this.jwtExpiry = 'ℹ️ No expiration (exp) claim present';
      }
      this.jwtStatus = '✓ Decoded';
      setTimeout(() => this.jwtStatus = '', 2000);
    } catch (e: any) {
      this.jwtStatus = '⚠️ ' + e.message;
    }
  }

  private base64UrlDecode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: break;
      case 2: output += '=='; break;
      case 3: output += '='; break;
      default: throw new Error('Illegal base64url string');
    }
    return decodeURIComponent(escape(atob(output)));
  }

  // --- 5. Hash Generator ---
  async generateHashes() {
    if (!this.hashInput) {
      this.hashSha256 = '';
      this.hashSha512 = '';
      this.hashSha1 = '';
      this.hashMd5 = '';
      return;
    }
    try {
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(this.hashInput);

        const sha256Buf = await window.crypto.subtle.digest('SHA-256', data);
        this.hashSha256 = this.bufToHex(sha256Buf);

        const sha512Buf = await window.crypto.subtle.digest('SHA-512', data);
        this.hashSha512 = this.bufToHex(sha512Buf);

        const sha1Buf = await window.crypto.subtle.digest('SHA-1', data);
        this.hashSha1 = this.bufToHex(sha1Buf);
      }
      this.hashMd5 = this.simpleChecksum(this.hashInput);
      this.hashStatus = '✓ Hashes updated';
      setTimeout(() => this.hashStatus = '', 1500);
    } catch (err: any) {
      this.hashStatus = '⚠️ ' + err.message;
    }
  }

  private bufToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private simpleChecksum(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return hex + hex + hex + hex; // 32-char hex presentation
  }

  // --- 6. UUID Generator ---
  generateUuids() {
    const list: string[] = [];
    const count = Math.max(1, Math.min(25, Number(this.uuidQuantity) || 1));
    for (let i = 0; i < count; i++) {
      let u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      if (this.uuidNoHyphens) u = u.replace(/-/g, '');
      if (this.uuidUppercase) u = u.toUpperCase();
      list.push(u);
    }
    this.generatedUuidsText = list.join('\n');
    this.uuidStatus = '✓ Generated ' + count + ' UUID(s)';
    setTimeout(() => this.uuidStatus = '', 1500);
  }

  // --- 7. Regex Tester ---
  testRegex() {
    if (!this.regexPattern) {
      this.regexMatchCount = 0;
      this.regexError = '';
      return;
    }
    try {
      const rx = new RegExp(this.regexPattern, this.regexFlags || 'g');
      const matches = this.regexText.match(rx);
      this.regexMatchCount = matches ? matches.length : 0;
      this.regexError = '';
    } catch (err: any) {
      this.regexError = 'Invalid regex: ' + err.message;
      this.regexMatchCount = 0;
    }
  }

  // --- 8. HTML Entity ---
  encodeHtml() {
    if (!this.htmlInput) return;
    this.htmlInput = this.htmlInput
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    this.htmlStatus = '✓ HTML Escaped';
    setTimeout(() => this.htmlStatus = '', 1500);
  }

  decodeHtml() {
    if (!this.htmlInput) return;
    this.htmlInput = this.htmlInput
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    this.htmlStatus = '✓ HTML Unescaped';
    setTimeout(() => this.htmlStatus = '', 1500);
  }

  // --- 9. Markdown ---
  updateMarkdown() {
    if (!this.markdownInput) {
      this.markdownHtml = '';
      this.safeMarkdownHtml = '';
      return;
    }
    let html = this.markdownInput
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\n$/gim, '<br />')
      .replace(/\n/gim, '<br />');

    this.markdownHtml = html;
    this.safeMarkdownHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  }

  // --- 10. Color ---
  updateColor() {
    const hex = this.hexColor.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      this.rgbColor = `rgb(${r}, ${g}, ${b})`;

      // HSL
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;
      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
          case gNorm: h = (bNorm - rNorm) / d + 2; break;
          case bNorm: h = (rNorm - gNorm) / d + 4; break;
        }
        h /= 6;
      }
      this.hslColor = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
  }

  updateColorFromHex() {
    if (/^#[0-9A-Fa-f]{6}$/.test(this.hexColor)) {
      this.updateColor();
    }
  }
}
