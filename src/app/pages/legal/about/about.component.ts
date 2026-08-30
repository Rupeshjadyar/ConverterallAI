import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="legal-page-container">
      <!-- Breadcrumb -->
      <div class="breadcrumb-bar">
        <a routerLink="/" class="breadcrumb-link">🏠 Home</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">About Us</span>
      </div>

      <!-- Hero Header -->
      <div class="legal-hero">
        <div class="badge-pill">
          <span class="badge-dot"></span>
          <span>Next-Gen Web Utilities &amp; AI Converters</span>
        </div>
        <h1 class="hero-title">About <span class="gradient-text">ConverterAll AI</span></h1>
        <p class="hero-subtitle">
          Empowering millions of users worldwide with lightning-fast, 100% private, client-side conversion tools and intelligent utilities — without subscriptions, paywalls, or privacy compromises.
        </p>
      </div>

      <!-- Key Highlights Grid -->
      <div class="highlights-grid">
        <div class="highlight-card glass">
          <div class="highlight-icon">🔒</div>
          <h3>100% In-Browser Privacy</h3>
          <p>Your sensitive PDFs, documents, images, and calculations never leave your computer. WebAssembly processes files right in your browser memory.</p>
        </div>
        <div class="highlight-card glass">
          <div class="highlight-icon">⚡</div>
          <h3>Zero Server Latency</h3>
          <p>By eliminating upload and download bottlenecks, files convert instantaneously with native C++/Rust compiled WASM performance.</p>
        </div>
        <div class="highlight-card glass">
          <div class="highlight-icon">🆓</div>
          <h3>Always Free &amp; Open</h3>
          <p>No paywalls, no forced account registrations, no email captchas, and no usage limits. Universal tools built for creators, students, and professionals.</p>
        </div>
        <div class="highlight-card glass">
          <div class="highlight-icon">🌐</div>
          <h3>Universal Cross-Device</h3>
          <p>Works seamlessly across all modern desktop browsers, tablets, iPhones, Android devices, and Chromebooks without installing extra apps.</p>
        </div>
      </div>

      <!-- Main Content Container -->
      <div class="legal-content-card glass">
        <section class="content-section">
          <h2>🌟 Our Mission</h2>
          <p>
            At <strong>ConverterAll AI</strong>, our mission is simple: to make universal file conversion, document editing, and everyday calculations fast, completely private, and freely accessible to everyone across the globe.
          </p>
          <p>
            Traditional online converter websites often force users to upload confidential documents and personal photos to remote cloud servers, exposing them to privacy risks, slow transfer speeds, queue limits, and intrusive advertising traps. We set out to change that standard completely by leveraging modern <strong>WebAssembly (WASM)</strong>, <strong>Web Workers</strong>, and <strong>Client-Side AI Engines</strong>.
          </p>
        </section>

        <section class="content-section">
          <h2>🚀 What We Offer</h2>
          <p>ConverterAll AI offers a growing ecosystem of over 40+ dedicated, high-performance web utilities:</p>
          <div class="offerings-grid">
            <div class="offering-item">
              <div class="offering-header">
                <span class="offering-icon">📄</span>
                <h4>PDF Suite &amp; Document Tools</h4>
              </div>
              <p>Merge, split, compress, sign, encrypt, convert PDF to Word/Excel/PowerPoint, OCR scan, redact, and summarize documents with local client libraries.</p>
            </div>
            <div class="offering-item">
              <div class="offering-header">
                <span class="offering-icon">🖼️</span>
                <h4>Smart Image Studio</h4>
              </div>
              <p>State-of-the-art background removal, lossless image compression (WebP, JPEG, PNG, AVIF), cropping, format conversion, and watermarking.</p>
            </div>
            <div class="offering-item">
              <div class="offering-header">
                <span class="offering-icon">🎙️</span>
                <h4>AI Audio &amp; Speech Narration</h4>
              </div>
              <p>High-fidelity Text-to-Speech (TTS) with realistic multi-language synthesis, pitch control, and instant MP3 audio downloads.</p>
            </div>
            <div class="offering-item">
              <div class="offering-header">
                <span class="offering-icon">🧮</span>
                <h4>Financial &amp; Daily Calculators</h4>
              </div>
              <p>Instant precision calculators for EMI, GST, SIP, Loan Amortization, CGPA, BMI, Age, and Date calculations with interactive charts.</p>
            </div>
          </div>
        </section>

        <section class="content-section">
          <h2>🛡️ Our Privacy Guarantee</h2>
          <div class="privacy-callout">
            <div class="callout-icon">🛡️</div>
            <div>
              <h4>Zero-File-Retention Policy</h4>
              <p>
                When you use ConverterAll AI, your documents, images, and audio data never touch our servers. File parsing, image rendering, and document manipulation happen entirely in your browser's local sandbox memory. Once you close your browser tab, all temporary memory buffers are automatically wiped.
              </p>
            </div>
          </div>
        </section>

        <section class="content-section">
          <h2>💡 Meet the Tech Stack</h2>
          <p>ConverterAll AI is engineered using cutting-edge modern web standards:</p>
          <ul class="tech-list">
            <li><strong>Angular 21:</strong> High-speed reactive architecture with Standalone Components &amp; Signals.</li>
            <li><strong>WebAssembly (WASM):</strong> Near-native binary execution for PDF rendering, compression, and mathematical calculations.</li>
            <li><strong>Web Workers &amp; Canvas:</strong> Multi-threaded image processing that never freezes your browser UI.</li>
            <li><strong>Modern Glassmorphic UI:</strong> Responsive, accessible, and theme-adaptive (Dark Cyberpunk &amp; Flash Light themes).</li>
          </ul>
        </section>

        <section class="content-section cta-section">
          <h3>Have questions, feedback, or tool suggestions?</h3>
          <p>We are constantly expanding our tool registry and love hearing from our community.</p>
          <div class="cta-buttons">
            <a routerLink="/contact" class="cta-btn primary">✉️ Contact Support Team</a>
            <a routerLink="/home" class="cta-btn secondary">🧰 Explore All Tools</a>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .legal-page-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 5rem 1.5rem;
    }

    .breadcrumb-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-secondary, #94a3b8);
      margin-bottom: 2rem;
    }

    .breadcrumb-link {
      color: var(--text-secondary, #94a3b8);
      text-decoration: none;
      transition: color 0.2s;
    }
    .breadcrumb-link:hover { color: var(--primary-color, #8b5cf6); }
    .breadcrumb-sep { opacity: 0.5; }
    .breadcrumb-current { color: var(--text-color, #fff); font-weight: 600; }

    .legal-hero {
      text-align: center;
      max-width: 820px;
      margin: 0 auto 3rem auto;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.9rem;
      border-radius: 99px;
      background: rgba(139, 92, 246, 0.12);
      border: 1px solid rgba(139, 92, 246, 0.3);
      color: #c4b5fd;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1.2rem;
    }

    .badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .hero-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      line-height: 1.2;
      margin-bottom: 1.2rem;
    }

    .hero-subtitle {
      font-size: 1.05rem;
      color: var(--text-secondary, #94a3b8);
      line-height: 1.65;
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      margin-bottom: 3rem;
    }
    @media (max-width: 900px) {
      .highlights-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 540px) {
      .highlights-grid { grid-template-columns: 1fr; }
    }

    .highlight-card {
      padding: 1.5rem;
      border-radius: 18px;
      background: var(--card-color, rgba(255, 255, 255, 0.04));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
      transition: transform 0.2s, border-color 0.2s;
    }
    .highlight-card:hover {
      transform: translateY(-3px);
      border-color: rgba(139, 92, 246, 0.4);
    }
    .highlight-icon { font-size: 2rem; margin-bottom: 0.8rem; }
    .highlight-card h3 { font-size: 1rem; font-weight: 700; color: var(--text-color, #fff); margin-bottom: 0.5rem; }
    .highlight-card p { font-size: 0.85rem; color: var(--text-secondary, #94a3b8); line-height: 1.5; margin: 0; }

    .legal-content-card {
      padding: 3rem 2.5rem;
      border-radius: 24px;
      background: var(--card-color, rgba(15, 18, 28, 0.7));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.3);
    }
    @media (max-width: 640px) {
      .legal-content-card { padding: 1.8rem 1.2rem; }
    }

    .content-section {
      margin-bottom: 2.8rem;
    }
    .content-section:last-child { margin-bottom: 0; }

    .content-section h2 {
      font-size: 1.45rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      margin-bottom: 1.1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .content-section p {
      font-size: 0.96rem;
      color: var(--text-secondary, #cbd5e1);
      line-height: 1.75;
      margin-bottom: 1rem;
    }

    .offerings-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
      margin-top: 1.2rem;
    }
    @media (max-width: 700px) {
      .offerings-grid { grid-template-columns: 1fr; }
    }

    .offering-item {
      padding: 1.25rem;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    }
    .offering-header {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 0.5rem;
    }
    .offering-icon { font-size: 1.3rem; }
    .offering-item h4 { font-size: 0.95rem; font-weight: 700; color: var(--text-color, #fff); margin: 0; }
    .offering-item p { font-size: 0.85rem; color: var(--text-secondary, #94a3b8); margin: 0; line-height: 1.5; }

    .privacy-callout {
      display: flex;
      gap: 1.25rem;
      align-items: flex-start;
      padding: 1.5rem;
      border-radius: 16px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
    }
    .callout-icon { font-size: 2rem; flex-shrink: 0; }
    .privacy-callout h4 { font-size: 1.05rem; font-weight: 700; color: #34d399; margin-bottom: 0.4rem; }
    .privacy-callout p { font-size: 0.9rem; color: var(--text-secondary, #cbd5e1); line-height: 1.6; margin: 0; }

    .tech-list {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .tech-list li {
      position: relative;
      padding-left: 1.5rem;
      font-size: 0.93rem;
      color: var(--text-secondary, #cbd5e1);
      line-height: 1.6;
    }
    .tech-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #8b5cf6;
      font-weight: 900;
    }

    .cta-section {
      text-align: center;
      padding: 2.5rem 1.5rem;
      border-radius: 20px;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.1) 100%);
      border: 1px solid rgba(139, 92, 246, 0.25);
      margin-top: 2rem;
    }
    .cta-section h3 { font-size: 1.3rem; font-weight: 800; color: var(--text-color, #fff); margin-bottom: 0.5rem; }
    .cta-section p { font-size: 0.95rem; color: var(--text-secondary, #94a3b8); margin-bottom: 1.5rem; }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1.4rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .cta-btn.primary {
      background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
      color: #fff;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.35);
    }
    .cta-btn.primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
    }
    .cta-btn.secondary {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-color, #fff);
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.15));
    }
    .cta-btn.secondary:hover {
      background: rgba(255, 255, 255, 0.14);
    }

    /* Light Theme Adjustments */
    :host-context(body.light-theme) .badge-pill {
      background: #ede9fe;
      border-color: rgba(109, 40, 217, 0.25);
      color: #6d28d9;
    }
    :host-context(body.light-theme) .hero-title { color: #0f172a; }
    :host-context(body.light-theme) .highlight-card {
      background: #ffffff;
      border-color: rgba(15, 23, 42, 0.08);
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
    }
    :host-context(body.light-theme) .highlight-card h3 { color: #0f172a; }
    :host-context(body.light-theme) .legal-content-card {
      background: #ffffff;
      border-color: rgba(15, 23, 42, 0.09);
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
    }
    :host-context(body.light-theme) .content-section h2 { color: #0f172a; }
    :host-context(body.light-theme) .content-section p { color: #334155; }
    :host-context(body.light-theme) .offering-item {
      background: #f8fafc;
      border-color: rgba(15, 23, 42, 0.07);
    }
    :host-context(body.light-theme) .offering-item h4 { color: #0f172a; }
    :host-context(body.light-theme) .privacy-callout {
      background: #ecfdf5;
      border-color: rgba(16, 185, 129, 0.3);
    }
    :host-context(body.light-theme) .privacy-callout h4 { color: #059669; }
    :host-context(body.light-theme) .privacy-callout p { color: #065f46; }
    :host-context(body.light-theme) .tech-list li { color: #334155; }
    :host-context(body.light-theme) .cta-section {
      background: linear-gradient(135deg, #ede9fe 0%, #e0f2fe 100%);
      border-color: rgba(109, 40, 217, 0.2);
    }
    :host-context(body.light-theme) .cta-section h3 { color: #0f172a; }
    :host-context(body.light-theme) .cta-btn.secondary {
      background: #ffffff;
      color: #0f172a;
      border-color: rgba(15, 23, 42, 0.15);
    }
  `]
})
export class AboutComponent {}
