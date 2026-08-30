import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="legal-page-container">
      <!-- Breadcrumb -->
      <div class="breadcrumb-bar">
        <a routerLink="/" class="breadcrumb-link">🏠 Home</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">Terms of Service</span>
      </div>

      <!-- Hero Header -->
      <div class="legal-hero">
        <div class="badge-pill">
          <span class="badge-dot"></span>
          <span>User Agreement &amp; Operating Guidelines</span>
        </div>
        <h1 class="hero-title">Terms of <span class="gradient-text">Service</span></h1>
        <p class="hero-subtitle">
          Please review the terms and conditions that govern your access and usage of ConverterAll AI tools, calculators, and services.
        </p>
        <div class="update-meta">
          <span>📅 Effective Date: August 30, 2026</span>
          <span>•</span>
          <span>Version 2.0</span>
        </div>
      </div>

      <!-- Content Card -->
      <div class="legal-content-card glass">
        <section class="terms-section">
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using <strong>ConverterAll AI</strong> (the "Service", "we", "us", or "our"), available at <a routerLink="/" class="inline-link">converterallai.com</a>, you agree to be bound by these Terms of Service ("Terms") and our <a routerLink="/privacy-policy" class="inline-link">Privacy Policy</a>.
          </p>
          <p>
            If you disagree with any part of these terms, you must discontinue the use of our services immediately.
          </p>
        </section>

        <section class="terms-section">
          <h2>2. Permitted Use &amp; User License</h2>
          <p>
            ConverterAll AI grants you a personal, non-exclusive, non-transferable, revocable license to access and use our suite of in-browser converters, audio tools, image processors, and calculators for both <strong>personal and commercial purposes</strong>, subject to these Terms:
          </p>
          <ul class="terms-list">
            <li>You may process files, convert documents, manipulate images, and calculate values without fee or subscription.</li>
            <li>You agree not to attempt to reverse engineer, scrape, DDoS, or disrupt our web architecture or data registry.</li>
            <li>You agree not to use our tools to distribute malicious payloads, viruses, ransomware, or unlawful material.</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>3. Intellectual Property Rights &amp; Your Files</h2>
          <div class="highlight-box">
            <h4>Ownership of Your Uploaded Files</h4>
            <p>
              <strong>You retain 100% full ownership and intellectual property rights</strong> to any document, image, audio file, or text input you process on ConverterAll AI. Because processing occurs directly in your local browser sandbox, we never claim ownership, rights, or license over your content.
            </p>
          </div>
          <p>
            The ConverterAll AI name, logos, original software code, UI designs, graphics, branding, and dynamic tool architecture are the exclusive property of ConverterAll AI and protected by applicable copyright and trademark laws.
          </p>
        </section>

        <section class="terms-section">
          <h2>4. Disclaimer of Warranties</h2>
          <p>
            The tools, file conversions, mathematical formulas, and speech synthesizers on ConverterAll AI are provided on an <strong>"AS IS" and "AS AVAILABLE"</strong> basis without warranties of any kind, either express or implied.
          </p>
          <p>
            While we strive for 100% calculation precision and lossless file conversion, we do not warrant that results will always be error-free, uninterrupted, or suitable for certified legal, medical, or auditing purposes. Please review our <a routerLink="/disclaimer" class="inline-link">Disclaimer</a> for specific calculator caveats.
          </p>
        </section>

        <section class="terms-section">
          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall ConverterAll AI, its developers, affiliates, or contributors be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising from:
          </p>
          <ul class="terms-list">
            <li>The use or inability to use our file converters or calculation tools.</li>
            <li>Any loss of data, corrupted files, or unintended conversion formatting artifacts.</li>
            <li>Decisions made in reliance upon calculations (e.g. loan interest, tax, BMI estimates).</li>
          </ul>
        </section>

        <section class="terms-section">
          <h2>6. Third-Party Links &amp; Advertisements (Google AdSense)</h2>
          <p>
            Our website may contain links to third-party web sites or services and displays third-party advertisements served by <strong>Google AdSense</strong>. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
          </p>
        </section>

        <section class="terms-section">
          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. Material changes will be noted with an updated "Last Updated" timestamp on this page.
          </p>
        </section>

        <section class="terms-section">
          <h2>8. Contact Information</h2>
          <p>
            If you have questions or suggestions regarding these Terms of Service, please contact our legal desk:
          </p>
          <div class="contact-box">
            <p><strong>Email:</strong> rupeshjadyar21&#64;gmail.com</p>
            <p><strong>Support Desk:</strong> <a routerLink="/contact" class="inline-link">converterallai.com/contact</a></p>
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
      margin-bottom: 1rem;
    }

    .update-meta {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.82rem;
      color: #a78bfa;
      font-weight: 600;
    }

    .legal-content-card {
      padding: 3rem 2.5rem;
      border-radius: 24px;
      background: var(--card-color, rgba(15, 18, 28, 0.7));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
    }
    @media (max-width: 640px) {
      .legal-content-card { padding: 1.8rem 1.2rem; }
    }

    .terms-section {
      margin-bottom: 2.8rem;
    }
    .terms-section:last-child { margin-bottom: 0; }

    .terms-section h2 {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      margin-bottom: 1rem;
    }

    .terms-section p {
      font-size: 0.95rem;
      color: var(--text-secondary, #cbd5e1);
      line-height: 1.75;
      margin-bottom: 1rem;
    }

    .inline-link {
      color: #a78bfa;
      text-decoration: underline;
      font-weight: 600;
    }
    .inline-link:hover { color: #38bdf8; }

    .highlight-box {
      padding: 1.4rem;
      border-radius: 16px;
      background: rgba(139, 92, 246, 0.08);
      border: 1px solid rgba(139, 92, 246, 0.25);
      margin: 1.2rem 0;
    }
    .highlight-box h4 {
      font-size: 1rem;
      font-weight: 800;
      color: #c4b5fd;
      margin-bottom: 0.5rem;
    }
    .highlight-box p {
      font-size: 0.9rem;
      color: var(--text-secondary, #cbd5e1);
      line-height: 1.6;
      margin: 0;
    }

    .terms-list {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .terms-list li {
      position: relative;
      padding-left: 1.5rem;
      font-size: 0.93rem;
      color: var(--text-secondary, #cbd5e1);
      line-height: 1.6;
    }
    .terms-list li::before {
      content: '•';
      position: absolute;
      left: 0.3rem;
      color: #8b5cf6;
      font-size: 1.2rem;
      line-height: 1;
    }

    .contact-box {
      padding: 1.2rem 1.5rem;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      margin-top: 1rem;
    }
    .contact-box p {
      font-size: 0.92rem;
      color: var(--text-secondary, #cbd5e1);
      margin-bottom: 0.4rem;
    }
    .contact-box p:last-child { margin-bottom: 0; }

    /* Light Theme Adjustments */
    :host-context(body.light-theme) .badge-pill {
      background: #ede9fe;
      border-color: rgba(109, 40, 217, 0.25);
      color: #6d28d9;
    }
    :host-context(body.light-theme) .hero-title { color: #0f172a; }
    :host-context(body.light-theme) .update-meta { color: #6d28d9; }
    :host-context(body.light-theme) .legal-content-card {
      background: #ffffff;
      border-color: rgba(15, 23, 42, 0.09);
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
    }
    :host-context(body.light-theme) .terms-section h2 { color: #0f172a; }
    :host-context(body.light-theme) .terms-section p { color: #334155; }
    :host-context(body.light-theme) .inline-link { color: #6d28d9; }
    :host-context(body.light-theme) .highlight-box {
      background: #f5f3ff;
      border-color: rgba(109, 40, 217, 0.2);
    }
    :host-context(body.light-theme) .highlight-box h4 { color: #6d28d9; }
    :host-context(body.light-theme) .highlight-box p { color: #334155; }
    :host-context(body.light-theme) .terms-list li { color: #334155; }
    :host-context(body.light-theme) .contact-box {
      background: #f8fafc;
      border-color: rgba(15, 23, 42, 0.08);
    }
    :host-context(body.light-theme) .contact-box p { color: #334155; }
  `]
})
export class TermsComponent {}
