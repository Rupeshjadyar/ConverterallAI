import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="legal-page-container">
      <!-- Breadcrumb -->
      <div class="breadcrumb-bar">
        <a routerLink="/" class="breadcrumb-link">🏠 Home</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">Contact Us</span>
      </div>

      <!-- Hero Header -->
      <div class="legal-hero">
        <div class="badge-pill">
          <span class="badge-dot"></span>
          <span>We're here to help 24/7</span>
        </div>
        <h1 class="hero-title">Get in Touch with <span class="gradient-text">ConverterAll AI</span></h1>
        <p class="hero-subtitle">
          Have a suggestion, bug report, partnership inquiry, or need help with any converter tool? Send us a message and our team will get back to you within 24 hours.
        </p>
      </div>

      <!-- Contact Info Cards -->
      <div class="contact-cards-grid">
        <div class="info-card glass">
          <div class="info-icon">✉️</div>
          <h3>Official Support Email</h3>
          <p class="email-text">rupeshjadyar21&#64;gmail.com</p>
          <button class="copy-btn" (click)="copyEmail()">
            {{ copied() ? '✓ Copied to Clipboard!' : '📋 Copy Email Address' }}
          </button>
        </div>

        <div class="info-card glass">
          <div class="info-icon">⏱️</div>
          <h3>Response Time (SLA)</h3>
          <p>Our dedicated engineering and support team reviews inquiries within <strong>24 business hours</strong>.</p>
          <div class="live-status">
            <span class="pulse-dot"></span>
            <span>Support Desk Active</span>
          </div>
        </div>

        <div class="info-card glass">
          <div class="info-icon">💡</div>
          <h3>Feature &amp; Tool Requests</h3>
          <p>Want a specific file converter or financial calculator added? Submit your tool idea directly via the form below!</p>
          <span class="tag-badge">500+ Tools Roadmap</span>
        </div>
      </div>

      <!-- Main Layout: Form + FAQ -->
      <div class="contact-main-grid">
        <!-- Contact Form Card -->
        <div class="form-card glass">
          <h2 class="form-title">✉️ Send Us a Message</h2>
          <p class="form-desc">Fill out the form below and we will route your inquiry to the appropriate specialist.</p>

          <!-- Success Alert -->
          <div *ngIf="submitted()" class="success-alert">
            <div class="success-icon">🎉</div>
            <div>
              <h4>Thank you! Your message has been received.</h4>
              <p>We have logged your ticket and our engineering/support desk will reply to <strong>{{ formModel.email }}</strong> shortly.</p>
            </div>
            <button class="reset-btn" (click)="resetForm()">Send Another</button>
          </div>

          <form *ngIf="!submitted()" (ngSubmit)="submitContactForm()" #contactForm="ngForm" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="fullName">Your Full Name <span class="req">*</span></label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  [(ngModel)]="formModel.name"
                  #name="ngModel"
                  required
                  placeholder="e.g. John Doe"
                  class="form-input"
                />
                <span *ngIf="name.invalid && (name.dirty || name.touched)" class="err-msg">
                  Name is required
                </span>
              </div>

              <div class="form-group">
                <label for="emailAddr">Email Address <span class="req">*</span></label>
                <input
                  type="email"
                  id="emailAddr"
                  name="emailAddr"
                  [(ngModel)]="formModel.email"
                  #email="ngModel"
                  required
                  email
                  placeholder="e.g. john@example.com"
                  class="form-input"
                />
                <span *ngIf="email.invalid && (email.dirty || email.touched)" class="err-msg">
                  Please enter a valid email
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="subjectCategory">Inquiry Type / Category <span class="req">*</span></label>
              <select
                id="subjectCategory"
                name="subjectCategory"
                [(ngModel)]="formModel.category"
                class="form-input form-select"
              >
                <option value="general">General Inquiry / Question</option>
                <option value="bug">Bug Report or Tool Issue</option>
                <option value="feature">New Tool Request / Feature Suggestion</option>
                <option value="adsense">Google AdSense / Advertising Inquiry</option>
                <option value="partnership">Business &amp; API Partnership</option>
                <option value="legal">Privacy / Legal Question</option>
              </select>
            </div>

            <div class="form-group">
              <label for="subjectText">Subject <span class="req">*</span></label>
              <input
                type="text"
                id="subjectText"
                name="subjectText"
                [(ngModel)]="formModel.subject"
                #subj="ngModel"
                required
                placeholder="Brief summary of your message"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="messageBody">Your Message <span class="req">*</span></label>
              <textarea
                id="messageBody"
                name="messageBody"
                [(ngModel)]="formModel.message"
                #msg="ngModel"
                required
                rows="5"
                placeholder="Please describe your query or feedback in detail..."
                class="form-input form-textarea"
              ></textarea>
              <span *ngIf="msg.invalid && (msg.dirty || msg.touched)" class="err-msg">
                Message body cannot be empty
              </span>
            </div>

            <button
              type="submit"
              [disabled]="contactForm.invalid || isSubmitting()"
              class="submit-btn"
            >
              <span *ngIf="!isSubmitting()">🚀 Send Message</span>
              <span *ngIf="isSubmitting()">⏳ Sending Message...</span>
            </button>
          </form>
        </div>

        <!-- Contact FAQs Sidebar -->
        <div class="faq-sidebar">
          <div class="faq-card glass">
            <h3 class="faq-title">❓ Frequently Asked Questions</h3>

            <div class="faq-item" *ngFor="let item of faqList; let i = index">
              <button class="faq-q-btn" (click)="toggleFaq(i)">
                <span>{{ item.q }}</span>
                <span class="faq-chevron" [class.rotated]="item.open">▼</span>
              </button>
              <div class="faq-a-body" *ngIf="item.open">
                <p>{{ item.a }}</p>
              </div>
            </div>
          </div>

          <div class="legal-direct-box glass">
            <h4>🏢 Direct Inquiries</h4>
            <p>For urgent policy or webmaster communications:</p>
            <ul class="direct-list">
              <li><strong>Webmaster:</strong> rupeshjadyar21&#64;gmail.com</li>
              <li><strong>Privacy Officer:</strong> rupeshjadyar21&#64;gmail.com</li>
              <li><strong>Platform:</strong> ConverterAll AI Engine v2.0</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .legal-page-container {
      max-width: 1150px;
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

    /* Contact Cards */
    .contact-cards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }
    @media (max-width: 860px) {
      .contact-cards-grid { grid-template-columns: 1fr; }
    }

    .info-card {
      padding: 1.6rem;
      border-radius: 18px;
      background: var(--card-color, rgba(255, 255, 255, 0.04));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
      display: flex;
      flex-direction: column;
    }
    .info-icon { font-size: 2rem; margin-bottom: 0.75rem; }
    .info-card h3 { font-size: 1.05rem; font-weight: 700; color: var(--text-color, #fff); margin-bottom: 0.5rem; }
    .info-card p { font-size: 0.88rem; color: var(--text-secondary, #94a3b8); line-height: 1.5; margin-bottom: 1rem; }
    .email-text { font-family: monospace; font-size: 0.95rem !important; color: #a78bfa !important; font-weight: 700; }

    .copy-btn {
      margin-top: auto;
      padding: 0.55rem 1rem;
      border-radius: 10px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.35);
      color: #c4b5fd;
      font-weight: 600;
      font-size: 0.82rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .copy-btn:hover { background: rgba(139, 92, 246, 0.25); color: #fff; }

    .live-status {
      margin-top: auto;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: #34d399;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .tag-badge {
      margin-top: auto;
      display: inline-block;
      width: fit-content;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: 99px;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: #38bdf8;
    }

    /* Main Grid: Form + FAQ */
    .contact-main-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 2rem;
      align-items: flex-start;
    }
    @media (max-width: 900px) {
      .contact-main-grid { grid-template-columns: 1fr; }
    }

    .form-card {
      padding: 2.2rem;
      border-radius: 22px;
      background: var(--card-color, rgba(15, 18, 28, 0.7));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
    }
    .form-title { font-size: 1.4rem; font-weight: 800; color: var(--text-color, #fff); margin-bottom: 0.4rem; }
    .form-desc { font-size: 0.9rem; color: var(--text-secondary, #94a3b8); margin-bottom: 1.8rem; }

    .contact-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    @media (max-width: 600px) {
      .form-row { grid-template-columns: 1fr; }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .form-group label {
      font-size: 0.84rem;
      font-weight: 700;
      color: var(--text-color, #e2e8f0);
    }
    .req { color: #f43f5e; }

    .form-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
      color: var(--text-color, #fff);
      font-size: 0.92rem;
      font-family: inherit;
      transition: all 0.2s;
      outline: none;
    }
    .form-input:focus {
      border-color: #8b5cf6;
      background: rgba(139, 92, 246, 0.05);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    }

    .form-select {
      cursor: pointer;
      appearance: auto;
      background-color: var(--card-color, #0f121c);
    }

    .form-textarea {
      resize: vertical;
      min-height: 110px;
    }

    .err-msg {
      font-size: 0.75rem;
      color: #f43f5e;
      font-weight: 600;
    }

    .submit-btn {
      padding: 0.85rem 1.6rem;
      border-radius: 12px;
      background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
      color: #fff;
      font-weight: 800;
      font-size: 0.95rem;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(139, 92, 246, 0.35);
      transition: all 0.2s;
      margin-top: 0.5rem;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(139, 92, 246, 0.5);
    }
    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .success-alert {
      padding: 1.8rem;
      border-radius: 16px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.8rem;
    }
    .success-icon { font-size: 2.5rem; }
    .success-alert h4 { font-size: 1.15rem; font-weight: 800; color: #34d399; margin: 0; }
    .success-alert p { font-size: 0.9rem; color: var(--text-secondary, #cbd5e1); margin: 0; line-height: 1.5; }
    .reset-btn {
      margin-top: 0.5rem;
      padding: 0.5rem 1.2rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: var(--text-color, #fff);
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
    }

    /* FAQ Sidebar */
    .faq-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .faq-card {
      padding: 1.6rem;
      border-radius: 20px;
      background: var(--card-color, rgba(15, 18, 28, 0.7));
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.12));
    }
    .faq-title { font-size: 1.1rem; font-weight: 800; color: var(--text-color, #fff); margin-bottom: 1rem; }

    .faq-item {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.75rem 0;
    }
    .faq-item:last-child { border-bottom: none; }

    .faq-q-btn {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: none;
      border: none;
      color: var(--text-color, #fff);
      font-size: 0.88rem;
      font-weight: 700;
      text-align: left;
      cursor: pointer;
      padding: 0.3rem 0;
      gap: 0.5rem;
    }
    .faq-chevron {
      font-size: 0.65rem;
      transition: transform 0.2s;
      color: #a78bfa;
    }
    .faq-chevron.rotated { transform: rotate(180deg); }

    .faq-a-body {
      padding: 0.5rem 0 0.2rem 0;
    }
    .faq-a-body p {
      font-size: 0.83rem;
      color: var(--text-secondary, #94a3b8);
      line-height: 1.55;
      margin: 0;
    }

    .legal-direct-box {
      padding: 1.4rem;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
    }
    .legal-direct-box h4 { font-size: 0.95rem; font-weight: 800; color: var(--text-color, #fff); margin-bottom: 0.4rem; }
    .legal-direct-box p { font-size: 0.82rem; color: var(--text-secondary, #94a3b8); margin-bottom: 0.75rem; }
    .direct-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      font-size: 0.82rem;
      color: var(--text-secondary, #cbd5e1);
    }

    /* Light Theme Styles */
    :host-context(body.light-theme) .badge-pill {
      background: #ede9fe;
      border-color: rgba(109, 40, 217, 0.25);
      color: #6d28d9;
    }
    :host-context(body.light-theme) .hero-title { color: #0f172a; }
    :host-context(body.light-theme) .info-card {
      background: #ffffff;
      border-color: rgba(15, 23, 42, 0.08);
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
    }
    :host-context(body.light-theme) .info-card h3 { color: #0f172a; }
    :host-context(body.light-theme) .email-text { color: #6d28d9 !important; }
    :host-context(body.light-theme) .form-card,
    :host-context(body.light-theme) .faq-card,
    :host-context(body.light-theme) .legal-direct-box {
      background: #ffffff;
      border-color: rgba(15, 23, 42, 0.09);
      box-shadow: 0 6px 24px rgba(15, 23, 42, 0.05);
    }
    :host-context(body.light-theme) .form-title,
    :host-context(body.light-theme) .faq-title,
    :host-context(body.light-theme) .legal-direct-box h4 { color: #0f172a; }
    :host-context(body.light-theme) .form-group label { color: #1e293b; }
    :host-context(body.light-theme) .form-input {
      background: #f8fafc;
      border-color: rgba(15, 23, 42, 0.15);
      color: #0f172a;
    }
    :host-context(body.light-theme) .form-select {
      background-color: #f8fafc;
    }
    :host-context(body.light-theme) .faq-q-btn { color: #0f172a; }
    :host-context(body.light-theme) .faq-item { border-bottom-color: rgba(15, 23, 42, 0.08); }
    :host-context(body.light-theme) .direct-list { color: #334155; }
  `]
})
export class ContactComponent {
  copied = signal(false);
  isSubmitting = signal(false);
  submitted = signal(false);

  formModel = {
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  };

  faqList = [
    {
      q: 'How fast will I receive a response?',
      a: 'Our engineering & support desk typically replies within 24 hours during standard business days.',
      open: true
    },
    {
      q: 'Can I request a new tool or calculator?',
      a: 'Absolutely! Select "New Tool Request" in the form above and describe the tool. We frequently add community-requested tools.',
      open: false
    },
    {
      q: 'Do you offer an API for ConverterAll AI tools?',
      a: 'We are currently developing our developer API. Select "Business & API Partnership" to join our early developer preview.',
      open: false
    },
    {
      q: 'Where do I report security vulnerabilities?',
      a: 'Please email rupeshjadyar21@gmail.com or select "Bug Report" above with details on reproducing the issue.',
      open: false
    }
  ];

  copyEmail() {
    navigator.clipboard?.writeText('rupeshjadyar21@gmail.com');
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 3000);
  }

  toggleFaq(index: number) {
    this.faqList[index].open = !this.faqList[index].open;
  }

  submitContactForm() {
    this.isSubmitting.set(true);
    // Simulate network transmission
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitted.set(true);
    }, 900);
  }

  resetForm() {
    this.submitted.set(false);
    this.formModel = {
      name: '',
      email: '',
      category: 'general',
      subject: '',
      message: ''
    };
  }
}
