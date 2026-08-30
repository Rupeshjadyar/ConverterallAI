import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="legal-page-container">
      <!-- Breadcrumb -->
      <div class="breadcrumb-bar">
        <a routerLink="/" class="breadcrumb-link">🏠 Home</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">Cookie Policy</span>
      </div>

      <!-- Hero Header -->
      <div class="legal-hero">
        <div class="badge-pill">
          <span class="badge-dot"></span>
          <span>Transparency &amp; User Controls</span>
        </div>
        <h1 class="hero-title">Cookie <span class="gradient-text">Policy</span></h1>
        <p class="hero-subtitle">
          Learn how ConverterAll AI and our advertising partners (such as Google AdSense) utilize cookies and local storage to personalize preferences and deliver high-speed web services.
        </p>
        <div class="update-meta">
          <span>📅 Effective Date: August 30, 2026</span>
          <span>•</span>
          <span>Version 2.0</span>
        </div>
      </div>

      <!-- Content Card -->
      <div class="legal-content-card glass">
        <section class="cookie-section">
          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used to make websites work efficiently, enhance user experience, and provide analytical reporting.
          </p>
        </section>

        <section class="cookie-section">
          <h2>2. How We Use Cookies &amp; Local Storage</h2>
          <p>ConverterAll AI categorizes cookie usage into the following functional tiers:</p>

          <div class="cookie-tier-grid">
            <div class="tier-card">
              <div class="tier-badge essential">Strictly Necessary &amp; Preferences</div>
              <h4>Local Theme &amp; State</h4>
              <p>Used to remember your selected theme (Flash Light vs Cyberpunk Dark), active tool tabs, and recent tools in local storage. These do not track personal identity.</p>
            </div>

            <div class="tier-card">
              <div class="tier-badge analytics">Performance &amp; Analytics</div>
              <h4>Anonymous Telemetry</h4>
              <p>Helps us understand how users navigate tools, error rates, and load performance to continuously optimize WebAssembly conversion engines.</p>
            </div>

            <div class="tier-card">
              <div class="tier-badge advertising">Advertising &amp; AdSense</div>
              <h4>Google AdSense &amp; DART</h4>
              <p>Third-party cookies set by Google and ad partners to serve relevant advertisements, prevent ad repetition, and measure ad viewability.</p>
            </div>
          </div>
        </section>

        <section class="cookie-section">
          <h2>3. Google AdSense &amp; Third-Party Cookies</h2>
          <p>
            Google, as a third-party vendor, uses cookies to serve ads on ConverterAll AI. Google's use of the DART cookie enables it to serve ads to users based on their visit to our site and other sites on the Internet.
          </p>
          <p>
            You can opt out of the DART cookie by visiting the Google Ad and Content Network Privacy Policy:
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" class="inline-link">
              Google Ads Settings &amp; Opt-Out ↗
            </a>
          </p>
        </section>

        <section class="cookie-section">
          <h2>4. Managing &amp; Disabling Cookies in Your Browser</h2>
          <p>
            Most modern web browsers allow you to control cookies through their settings preferences. Note that disabling cookies may affect some local preference features (such as retaining your selected UI theme):
          </p>
          <ul class="cookie-list">
            <li><strong>Google Chrome:</strong> Settings &gt; Privacy and Security &gt; Cookies and other site data.</li>
            <li><strong>Mozilla Firefox:</strong> Options &gt; Privacy &amp; Security &gt; Cookies and Site Data.</li>
            <li><strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Block all cookies.</li>
            <li><strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage and delete cookies.</li>
          </ul>
        </section>

        <section class="cookie-section">
          <h2>5. Contact Us</h2>
          <p>
            If you have any questions regarding our use of cookies or tracking technologies, please contact our support desk:
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
      background: #06b6d4;
      box-shadow: 0 0 8px #06b6d4;
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

    .cookie-section {
      margin-bottom: 2.8rem;
    }
    .cookie-section:last-child { margin-bottom: 0; }

    .cookie-section h2 {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      margin-bottom: 1rem;
    }

    .cookie-section p {
      font-size: 0.95rem;
      color: var(--text-secondary, #cbd5e1);
      line-height: 1.75;
      margin-bottom: 1rem;
    }

    .cookie-tier-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin: 1.5rem 0;
    }
    @media (max-width: 860px) {
      .cookie-tier-grid { grid-template-columns: 1fr; }
    }

    .tier-card {
      padding: 1.4rem;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    }
    .tier-badge {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 0.2rem 0.6rem;
      border-radius: 99px;
      margin-bottom: 0.75rem;
    }
    .tier-badge.essential { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .tier-badge.analytics { background: rgba(6, 182, 212, 0.15); color: #38bdf8; }
    .tier-badge.advertising { background: rgba(139, 92, 246, 0.15); color: #c4b5fd; }

    .tier-card h4 { font-size: 0.98rem; font-weight: 700; color: var(--text-color, #fff); margin-bottom: 0.4rem; }
    .tier-card p { font-size: 0.85rem; color: var(--text-secondary, #94a3b8); margin: 0; line-height: 1.5; }

    .inline-link {
      color: #a78bfa;
      text-decoration: underline;
      font-weight: 600;
    }
    .inline-link:hover { color: #38bdf8; }

    .cookie-list {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .cookie-list li {
      position: relative;
      padding-left: 1.5rem;
      font-size: 0.93rem;
      color: var(--text-secondary, #cbd5e1);
      line-height: 1.6;
    }
    .cookie-list li::before {
      content: '•';
      position: absolute;
      left: 0.3rem;
      color: #06b6d4;
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
    :host-context(body.light-theme) .cookie-section h2 { color: #0f172a; }
    :host-context(body.light-theme) .cookie-section p { color: #334155; }
    :host-context(body.light-theme) .tier-card {
      background: #f8fafc;
      border-color: rgba(15, 23, 42, 0.08);
    }
    :host-context(body.light-theme) .tier-card h4 { color: #0f172a; }
    :host-context(body.light-theme) .tier-card p { color: #334155; }
    :host-context(body.light-theme) .inline-link { color: #6d28d9; }
    :host-context(body.light-theme) .cookie-list li { color: #334155; }
    :host-context(body.light-theme) .contact-box {
      background: #f8fafc;
      border-color: rgba(15, 23, 42, 0.08);
    }
    :host-context(body.light-theme) .contact-box p { color: #334155; }
  `]
})
export class CookiePolicyComponent {}
