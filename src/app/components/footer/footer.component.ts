import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="universal-footer">
      <div class="footer-glow"></div>
      <div class="footer-container">
        
        <div class="footer-grid">
          <!-- Brand Column -->
          <div class="footer-brand">
            <a routerLink="/" class="footer-logo">
              <div class="logo-icon glow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M12 3l1.912 5.813a2 2 0 001.272 1.272L21 12l-5.816 1.912a2 2 0 00-1.272 1.272L12 21l-1.912-5.816a2 2 0 00-1.272-1.272L3 12l5.816-1.912a2 2 0 001.272-1.272z"/>
                </svg>
              </div>
              <span class="logo-text">Converterall<span class="gradient-text">AI</span></span>
            </a>
            <p class="brand-desc">
              All Converters. One Place. Powered by state-of-the-art AI. Fast, secure, and 100% private image, PDF &amp; calculation tools.
            </p>
            <div class="system-status">
              <span class="status-dot"></span>
              <span>All 40+ AI Engines Operational</span>
            </div>
          </div>

          <!-- Calculators Column -->
          <div class="footer-col">
            <h4 class="col-title">🧮 Calculators</h4>
            <div class="col-links">
              <a routerLink="/calculators">All Calculators</a>
              <a routerLink="/calculators/emi">Loan EMI Calculator</a>
              <a routerLink="/calculators/sip">SIP Investment Calc</a>
              <a routerLink="/calculators/gst">GST Calculator</a>
              <a routerLink="/calculators/bmi">BMI Calculator</a>
              <a routerLink="/calculators/percentage">Percentage Calc</a>
            </div>
          </div>

          <!-- Image & Audio Column -->
          <div class="footer-col">
            <h4 class="col-title">🎨 Image &amp; Audio</h4>
            <div class="col-links">
              <a routerLink="/image-processing">Image Processing Suite</a>
              <a routerLink="/image-processing/compressor">AI Image Compressor</a>
              <a routerLink="/image-processing/bg-remover">Background Remover</a>
              <a routerLink="/audio-processing">Audio Processing Suite</a>
              <a routerLink="/audio-processing/text-to-mp3">Text to MP3 Speech</a>
              <a routerLink="/audio-processing/audio-cutter">Audio Cutter &amp; Trimmer</a>
            </div>
          </div>

          <!-- PDF Suite Column -->
          <div class="footer-col">
            <h4 class="col-title">📄 PDF Suite</h4>
            <div class="col-links">
              <a routerLink="/pdf-processing">All 30+ PDF Tools</a>
              <a routerLink="/pdf-processing/merge-pdf">Merge PDF Files</a>
              <a routerLink="/pdf-processing/split-pdf">Split PDF Pages</a>
              <a routerLink="/pdf-processing/compress-pdf">Compress PDF</a>
              <a routerLink="/pdf-processing/pdf-to-word">PDF to Word Converter</a>
              <a routerLink="/pdf-processing/word-to-pdf">Word to PDF Converter</a>
            </div>
          </div>

          <!-- Dev & Games Column -->
          <div class="footer-col">
            <h4 class="col-title">⚡ Dev, AI &amp; Games</h4>
            <div class="col-links">
              <a routerLink="/typing-speed-test">Typing Speed Test (WPM)</a>
              <a routerLink="/developer-tools/web-tutorials">Learn through ConverterAllAI</a>
              <a routerLink="/ai-chat">Free AI Chat Playground</a>
              <a routerLink="/developer-tools">Developer Tools Hub</a>
              <a routerLink="/developer-tools/sql">Interactive SQL Masterclass</a>
              <a routerLink="/developer-tools/json-formatter">JSON Formatter &amp; Validator</a>
              <a routerLink="/typing-master">Typing Master Tutor</a>
              <a routerLink="/games">Free Web Arcade Games</a>
              <a routerLink="/resume-builder">AI Resume Builder</a>
            </div>
          </div>

          <!-- Legal & Compliance Column -->
          <div class="footer-col">
            <h4 class="col-title">🏛️ Company &amp; Legal</h4>
            <div class="col-links">
              <a routerLink="/about">About Us</a>
              <a routerLink="/contact">Contact Support</a>
              <a routerLink="/privacy-policy">Privacy Policy</a>
              <a routerLink="/terms-of-service">Terms of Service</a>
              <a routerLink="/disclaimer">Disclaimer Notice</a>
              <a routerLink="/cookie-policy">Cookie Policy</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 ConverterAll AI. Designed with modern glassmorphic aesthetics &amp; AI speed.</p>
          <div class="footer-badges">
            <span class="badge-item">🔒 Zero Data Stored</span>
            <span class="badge-item">⚡ Instant Processing</span>
            <span class="badge-item">🇮🇳 India &amp; Global</span>
          </div>
        </div>

      </div>
    </footer>
  `,
  styles: [`
    .universal-footer {
      position: relative;
      margin-top: 5rem;
      background: rgba(11, 15, 28, 0.8);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      overflow: hidden;
    }

    :host-context([data-theme="light"]) .universal-footer {
      background: rgba(248, 250, 252, 0.9);
      border-top-color: rgba(0, 0, 0, 0.08);
    }

    .footer-glow {
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 250px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
      pointer-events: none;
    }

    .footer-container {
      max-width: 1320px;
      margin: 0 auto;
      padding: 4rem 1.5rem 2rem 1.5rem;
      position: relative;
      z-index: 2;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.4fr repeat(5, 1fr);
      gap: 1.8rem;
      margin-bottom: 3.5rem;
    }

    @media (max-width: 1100px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr 1fr;
        gap: 2rem;
      }
    }
    @media (max-width: 768px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
    }
    @media (max-width: 520px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
      font-weight: 800;
      font-size: 1.2rem;
      color: var(--text-color, #fff);
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }

    .brand-desc {
      font-size: 0.9rem;
      color: var(--text-muted, #94a3b8);
      line-height: 1.6;
      max-width: 340px;
      margin: 0;
    }

    .system-status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.8rem;
      border-radius: 99px;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #34d399;
      font-size: 0.78rem;
      font-weight: 600;
      width: fit-content;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulseDot 2s infinite;
    }

    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.15); }
    }

    .col-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-color, #fff);
      margin: 0 0 1.1rem 0;
    }

    .col-links {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }

    .col-links a {
      color: var(--text-muted, #94a3b8);
      text-decoration: none;
      font-size: 0.88rem;
      transition: all 0.2s ease;
    }

    .col-links a:hover {
      color: #818cf8;
      transform: translateX(3px);
    }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.5rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-muted, #64748b);
      font-size: 0.85rem;
    }

    .footer-badges {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .badge-item {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted, #94a3b8);
    }
  `]
})
export class FooterComponent {}
