import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="legal-page-container">
      <!-- Breadcrumb -->
      <div class="breadcrumb-bar">
        <a routerLink="/" class="breadcrumb-link">🏠 Home</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">Disclaimer</span>
      </div>

      <!-- Hero Header -->
      <div class="legal-hero">
        <div class="badge-pill">
          <span class="badge-dot"></span>
          <span>Important Notice &amp; Legal Disclosures</span>
        </div>
        <h1 class="hero-title">Website &amp; Tool <span class="gradient-text">Disclaimer</span></h1>
        <p class="hero-subtitle">
          Please read this disclaimer carefully before using the converters, calculators, document tools, and audio processors on ConverterAll AI.
        </p>
        <div class="update-meta">
          <span>📅 Effective Date: August 30, 2026</span>
          <span>•</span>
          <span>Version 2.0</span>
        </div>
      </div>

      <!-- Disclaimers Grid -->
      <div class="disclaimer-cards-grid">
        <div class="disclaimer-highlight-card glass">
          <div class="dh-icon">🧮</div>
          <h3>Financial &amp; Tax Calculators</h3>
          <p>EMI, GST, SIP, Loan Amortization, and Discount calculations are mathematical estimates for informational reference only. They do not constitute financial, investment, or certified tax advice.</p>
        </div>

        <div class="disclaimer-highlight-card glass">
          <div class="dh-icon">⚕️</div>
          <h3>Health &amp; BMI Calculators</h3>
          <p>The BMI and Age calculators provide general population statistical estimates and should not be used as medical diagnosis or health prescriptions. Consult a licensed healthcare provider for clinical advice.</p>
        </div>

        <div class="disclaimer-highlight-card glass">
          <div class="dh-icon">📄</div>
          <h3>File &amp; Document Conversion</h3>
          <p>Client-side conversion (PDF, Images, Word, Audio) employs standard open-source codecs. Complex document layouts, custom fonts, or protected files may experience visual variance during conversion.</p>
        </div>
      </div>

      <!-- Detailed Content Card -->
      <div class="legal-content-card glass">
        <section class="disclaimer-section">
          <h2>1. General Information Purpose</h2>
          <p>
            The information and online tools provided by <strong>ConverterAll AI</strong> ("we", "us", or "our") on <a routerLink="/" class="inline-link">converterallai.com</a> are for general educational, operational, and informational purposes only.
          </p>
          <p>
            All information and tool outputs are provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or conversion result on the site.
          </p>
        </section>

        <section class="disclaimer-section">
          <h2>2. No Professional Financial or Investment Advice</h2>
          <p>
            Our financial calculators (including EMI Calculator, GST Calculator, SIP Calculator, Loan Calculator, and Percentage Calculator) use standard mathematical formulas.
          </p>
          <ul class="disclaimer-list">
            <li>Actual bank interest calculations, compounding schedules, pre-payment penalties, and taxation laws may vary based on your local jurisdiction and financial institution.</li>
            <li>You should consult with a certified financial planner, accountant, or tax advisor before making any financial commitments or investment decisions.</li>
          </ul>
        </section>

        <section class="disclaimer-section">
          <h2>3. No Medical or Healthcare Advice</h2>
          <p>
            The Body Mass Index (BMI) calculator and related health utilities are designed solely as general educational screening references based on standard World Health Organization (WHO) index metrics.
          </p>
          <p>
            They do not account for muscle mass, bone density, ethnic distribution, or clinical conditions. ConverterAll AI does not provide medical advice, diagnosis, or treatment.
          </p>
        </section>

        <section class="disclaimer-section">
          <h2>4. Accuracy of AI &amp; File Conversion Tools</h2>
          <p>
            ConverterAll AI executes file transformations (such as AI Background Removal, PDF-to-Word, Image Compression, and Text-to-Speech synthesis) locally inside your browser sandbox:
          </p>
          <ul class="disclaimer-list">
            <li>Outputs may vary based on your browser version, available hardware acceleration, and the internal complexity of the source file.</li>
            <li>Users are strongly advised to verify the output of critical documents, legal contracts, and accounting spreadsheets before final distribution or submission.</li>
            <li>ConverterAll AI is not responsible for any typographical errors, missed pages, or formatting discrepancies.</li>
          </ul>
        </section>

        <section class="disclaimer-section">
          <h2>5. External Links &amp; Google Advertisements</h2>
          <p>
            ConverterAll AI contains third-party advertisements served via <strong>Google AdSense</strong> and may contain links to other external websites. Such external links and advertisements are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, or completeness by us.
          </p>
          <p>
            We do not endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through our platform or featured in any banner or advertising.
          </p>
        </section>

        <section class="disclaimer-section">
          <h2>6. "Use at Your Own Risk"</h2>
          <p>
            Under no circumstances shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or our online tools, or reliance on any calculation or converted file provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
          </p>
        </section>

        <section class="disclaimer-section">
          <h2>7. Contact Us</h2>
          <p>
            Should you have any feedback, questions, or concerns regarding this disclaimer, please feel free to reach out to us:
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
      background: #f59e0b;
      box-shadow: 0 0 8px #f59e0b;
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

    .disclaimer-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }
    @media (max-width: 860px) {
      .disclaimer-cards-grid { grid-template-columns: 1fr; }
    }

    .disclaimer-highlight-card {
      padding: 1.6rem;
      border-radius: 18px;
      background: var(--card-color, rgba(255, 255, 255, 0.04));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
    }
    .dh-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .disclaimer-highlight-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--text-color, #fff); margin-bottom: 0.5rem; }
    .disclaimer-highlight-card p { font-size: 0.86rem; color: var(--text-secondary, #94a3b8); line-height: 1.55; margin: 0; }

    .legal-content-card {
      padding: 3rem 2.5rem;
      border-radius: 24px;
      background: var(--card-color, rgba(15, 18, 28, 0.7));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
    }
    @media (max-width: 640px) {
      .legal-content-card { padding: 1.8rem 1.2rem; }
    }

    .disclaimer-section {
      margin-bottom: 2.8rem;
    }
    .disclaimer-section:last-child { margin-bottom: 0; }

    .disclaimer-section h2 {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-color, #fff);
      margin-bottom: 1rem;
    }

    .disclaimer-section p {
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

    .disclaimer-list {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .disclaimer-list li {
      position: relative;
      padding-left: 1.5rem;
      font-size: 0.93rem;
      color: var(--text-secondary, #cbd5e1);
      line-height: 1.6;
    }
    .disclaimer-list li::before {
      content: '•';
      position: absolute;
      left: 0.3rem;
      color: #f59e0b;
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
    :host-context(body.light-theme) .disclaimer-highlight-card {
      background: #ffffff;
      border-color: rgba(15, 23, 42, 0.08);
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
    }
    :host-context(body.light-theme) .disclaimer-highlight-card h3 { color: #0f172a; }
    :host-context(body.light-theme) .legal-content-card {
      background: #ffffff;
      border-color: rgba(15, 23, 42, 0.09);
      box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
    }
    :host-context(body.light-theme) .disclaimer-section h2 { color: #0f172a; }
    :host-context(body.light-theme) .disclaimer-section p { color: #334155; }
    :host-context(body.light-theme) .inline-link { color: #6d28d9; }
    :host-context(body.light-theme) .disclaimer-list li { color: #334155; }
    :host-context(body.light-theme) .contact-box {
      background: #f8fafc;
      border-color: rgba(15, 23, 42, 0.08);
    }
    :host-context(body.light-theme) .contact-box p { color: #334155; }
  `]
})
export class DisclaimerComponent {}
