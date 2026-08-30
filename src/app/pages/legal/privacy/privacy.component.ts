import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="legal-page-container">
      <!-- Breadcrumb -->
      <div class="breadcrumb-bar">
        <a routerLink="/" class="breadcrumb-link">🏠 Home</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">Privacy Policy</span>
      </div>

      <!-- Hero Header -->
      <div class="legal-hero">
        <div class="badge-pill">
          <span class="badge-dot"></span>
          <span>GDPR, CCPA &amp; Google AdSense Compliant</span>
        </div>
        <h1 class="hero-title">Privacy Policy for <span class="gradient-text">ConverterAll AI</span></h1>
        <p class="hero-subtitle">
          Your privacy is paramount to us. Learn how ConverterAll AI processes data, enforces client-side file security, and respects international data protection standards.
        </p>
        <div class="update-meta">
          <span>📅 Last Updated: August 30, 2026</span>
          <span>•</span>
          <span>Version 2.0</span>
        </div>
      </div>

      <!-- Privacy Highlights Banner -->
      <div class="privacy-banner glass">
        <div class="banner-icon">🛡️</div>
        <div class="banner-text">
          <h3>The ConverterAll AI Client-Side Guarantee</h3>
          <p>
            Unlike traditional converters, <strong>we do NOT upload, inspect, or store your documents, images, audio files, or calculations on any server</strong>. All file operations execute directly within your browser sandbox via WebAssembly (WASM) and local client memory.
          </p>
        </div>
      </div>

      <!-- Content Container -->
      <div class="legal-content-card glass">
        <section class="policy-section">
          <h2>1. Introduction &amp; Overview</h2>
          <p>
            This Privacy Policy document outlines the types of information collected and recorded by <strong>ConverterAll AI</strong> (accessible at <a routerLink="/" class="inline-link">converterallai.com</a>) and how we use and protect it.
          </p>
          <p>
            If you have additional questions or require more information about our Privacy Policy, please do not hesitate to contact our Data Protection Officer at <a routerLink="/contact" class="inline-link">rupeshjadyar21&#64;gmail.com</a>.
          </p>
        </section>

        <section class="policy-section">
          <h2>2. Zero Server-Side File Storage Policy</h2>
          <p>
            ConverterAll AI is architected from the ground up as a <strong>client-side first web platform</strong>:
          </p>
          <ul class="policy-list">
            <li><strong>PDFs &amp; Documents:</strong> Merging, splitting, conversion, signing, OCR, and compression are handled entirely on your device via in-memory WebAssembly.</li>
            <li><strong>Images:</strong> Background removal, cropping, format conversion, and compression occur via your device's GPU and local browser Canvas API.</li>
            <li><strong>Text &amp; Speech:</strong> Text-to-Speech synthesis and calculation tools execute purely on your local hardware.</li>
            <li><strong>Memory Cleanup:</strong> Once you refresh, navigate away, or close your browser tab, all temporary memory objects are permanently discarded.</li>
          </ul>
        </section>

        <section class="policy-section">
          <h2>3. Google AdSense &amp; Third-Party Advertising</h2>
          <p>
            ConverterAll AI may display advertisements served by <strong>Google AdSense</strong> and authorized third-party ad networks to keep our tools 100% free for all users worldwide.
          </p>
          <div class="ad-notice-box">
            <h4>Google DoubleClick DART Cookie Disclosure:</h4>
            <p>
              Google is a third-party vendor on our site. Google uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to ConverterAll AI and other websites on the internet.
            </p>
            <p>
              Visitors may choose to decline or opt out of the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at:
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" class="external-link">
                https://policies.google.com/technologies/ads ↗
              </a>
            </p>
            <p>
              You can also opt out of personalized advertising by visiting
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" class="external-link">
                Network Advertising Initiative (NAI) / AboutAds ↗
              </a>.
            </p>
          </div>
          <p>
            Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on ConverterAll AI, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. ConverterAll AI has no access to or control over these cookies that are used by third-party advertisers.
          </p>
        </section>

        <section class="policy-section">
          <h2>4. Cookies &amp; Local Storage</h2>
          <p>
            Like any modern web application, ConverterAll AI uses standard browser cookies and <code>localStorage</code> to store preferences:
          </p>
          <ul class="policy-list">
            <li><strong>UI Theme Preference:</strong> Remembering whether you selected Dark Cyberpunk, Flash Light, or System theme.</li>
            <li><strong>Recent Tools:</strong> Saving your recently accessed tools locally in your browser for fast navigation.</li>
            <li><strong>Analytical Cookies:</strong> Aggregated, anonymous traffic telemetry to evaluate server health and tool performance.</li>
          </ul>
          <p>
            You can choose to disable cookies through your individual browser options. Detailed information about cookie management can be found in our dedicated <a routerLink="/cookie-policy" class="inline-link">Cookie Policy</a>.
          </p>
        </section>

        <section class="policy-section">
          <h2>5. Log Files &amp; Technical Telemetry</h2>
          <p>
            ConverterAll AI follows a standard procedure of utilizing log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
          </p>
        </section>

        <section class="policy-section">
          <h2>6. GDPR Data Protection Rights (EU &amp; UK Users)</h2>
          <p>We would like to make sure you are fully aware of all of your data protection rights under the General Data Protection Regulation (GDPR):</p>
          <div class="rights-grid">
            <div class="right-item">
              <strong>The right to access:</strong> You have the right to request copies of your personal data.
            </div>
            <div class="right-item">
              <strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.
            </div>
            <div class="right-item">
              <strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.
            </div>
            <div class="right-item">
              <strong>The right to object:</strong> You have the right to object to our processing of your personal data, under certain conditions.
            </div>
          </div>
        </section>

        <section class="policy-section">
          <h2>7. CCPA / CPRA Privacy Rights (California Residents)</h2>
          <p>
            Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California consumers have the right to:
          </p>
          <ul class="policy-list">
            <li>Request that a business disclose the categories and specific pieces of personal data collected.</li>
            <li>Request that a business delete any personal data collected.</li>
            <li><strong>Do Not Sell My Information:</strong> We do NOT sell or rent any user personal data to third parties.</li>
          </ul>
          <p>If you make a request, we have one month to respond to you. Please contact us to exercise these rights.</p>
        </section>

        <section class="policy-section">
          <h2>8. Children's Information (COPPA Compliance)</h2>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
          </p>
          <p>
            ConverterAll AI does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>
        </section>

        <section class="policy-section">
          <h2>9. Consent &amp; Contact Us</h2>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you have any inquiries regarding this policy or data processing practices, please reach out to us at:
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

    .privacy-banner {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      padding: 1.8rem;
      border-radius: 20px;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      margin-bottom: 2.5rem;
    }
    @media (max-width: 600px) {
      .privacy-banner { flex-direction: column; gap: 1rem; }
    }
    .banner-icon { font-size: 2.5rem; flex-shrink: 0; }
    .banner-text h3 { font-size: 1.15rem; font-weight: 800; color: #34d399; margin-bottom: 0.4rem; }
    .banner-text p { font-size: 0.92rem; color: var(--text-secondary, #cbd5e1); line-height: 1.6; margin: 0; }

    .legal-content-card {
      padding: 3rem 2.5rem;
      border-radius: 24px;
      background: var(--card-color, rgba(15, 18, 28, 0.7));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
    }
    @media (max-width: 640px) {
      .legal-content-card { padding: 1.8rem 1.2rem; }
    }

    .policy-section {
      margin-bottom: 2.8rem;
    }
    .policy-section:last-child { margin-bottom: 0; }

    .policy-section h2 {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      margin-bottom: 1rem;
    }

    .policy-section p {
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

    .external-link {
      color: #38bdf8;
      word-break: break-all;
      text-decoration: underline;
    }

    .ad-notice-box {
      padding: 1.4rem;
      border-radius: 16px;
      background: rgba(139, 92, 246, 0.08);
      border: 1px solid rgba(139, 92, 246, 0.25);
      margin: 1.2rem 0;
    }
    .ad-notice-box h4 {
      font-size: 0.98rem;
      font-weight: 800;
      color: #c4b5fd;
      margin-bottom: 0.5rem;
    }
    .ad-notice-box p {
      font-size: 0.88rem;
      color: var(--text-secondary, #cbd5e1);
      line-height: 1.6;
      margin-bottom: 0.75rem;
    }
    .ad-notice-box p:last-child { margin-bottom: 0; }

    .policy-list {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .policy-list li {
      position: relative;
      padding-left: 1.5rem;
      font-size: 0.93rem;
      color: var(--text-secondary, #cbd5e1);
      line-height: 1.6;
    }
    .policy-list li::before {
      content: '•';
      position: absolute;
      left: 0.3rem;
      color: #8b5cf6;
      font-size: 1.2rem;
      line-height: 1;
    }

    .rights-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-top: 1rem;
    }
    @media (max-width: 700px) {
      .rights-grid { grid-template-columns: 1fr; }
    }
    .right-item {
      padding: 1rem 1.2rem;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
      font-size: 0.88rem;
      color: var(--text-secondary, #cbd5e1);
      line-height: 1.55;
    }
    .right-item strong { color: var(--text-color, #fff); }

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

    /* Light Theme Overrides */
    :host-context(body.light-theme) .badge-pill {
      background: #ede9fe;
      border-color: rgba(109, 40, 217, 0.25);
      color: #6d28d9;
    }
    :host-context(body.light-theme) .hero-title { color: #0f172a; }
    :host-context(body.light-theme) .update-meta { color: #6d28d9; }
    :host-context(body.light-theme) .privacy-banner {
      background: #ecfdf5;
      border-color: rgba(16, 185, 129, 0.3);
    }
    :host-context(body.light-theme) .banner-text h3 { color: #059669; }
    :host-context(body.light-theme) .banner-text p { color: #065f46; }
    :host-context(body.light-theme) .legal-content-card {
      background: #ffffff;
      border-color: rgba(15, 23, 42, 0.09);
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
    }
    :host-context(body.light-theme) .policy-section h2 { color: #0f172a; }
    :host-context(body.light-theme) .policy-section p { color: #334155; }
    :host-context(body.light-theme) .inline-link { color: #6d28d9; }
    :host-context(body.light-theme) .external-link { color: #0284c7; }
    :host-context(body.light-theme) .ad-notice-box {
      background: #f5f3ff;
      border-color: rgba(109, 40, 217, 0.2);
    }
    :host-context(body.light-theme) .ad-notice-box h4 { color: #6d28d9; }
    :host-context(body.light-theme) .ad-notice-box p { color: #334155; }
    :host-context(body.light-theme) .policy-list li { color: #334155; }
    :host-context(body.light-theme) .right-item {
      background: #f8fafc;
      border-color: rgba(15, 23, 42, 0.08);
      color: #334155;
    }
    :host-context(body.light-theme) .right-item strong { color: #0f172a; }
    :host-context(body.light-theme) .contact-box {
      background: #f8fafc;
      border-color: rgba(15, 23, 42, 0.08);
    }
    :host-context(body.light-theme) .contact-box p { color: #334155; }
  `]
})
export class PrivacyComponent {}
