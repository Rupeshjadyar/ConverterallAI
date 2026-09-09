import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToolExecutionService } from '../../services/tool-execution.service';
import { LocalAIService } from '../../services/local-ai.service';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  isAction?: boolean;
  timestamp?: string;
}

interface QuickPrompt {
  icon: string;
  label: string;
  query: string;
}

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- FLOATING ASSISTANT CONTAINER -->
    <div class="floating-assistant-container">

      <!-- 1. FLOATING CHAT POPUP WINDOW -->
      <div class="chat-popup-card" [class.open]="isOpen()">
        
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="header-left">
            <div class="bot-avatar-wrapper">
              <svg viewBox="0 0 36 36" width="30" height="30" fill="none" class="bot-svg">
                <circle cx="18" cy="18" r="17" fill="url(#popupBotGrad)" />
                <path d="M9 16 C9 11 27 11 27 16" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                <rect x="10" y="12" width="16" height="13" rx="5" fill="white" />
                <rect x="7" y="13.5" width="3.5" height="8" rx="1.75" fill="#38bdf8" />
                <rect x="25.5" y="13.5" width="3.5" height="8" rx="1.75" fill="#38bdf8" />
                <circle cx="14.5" cy="17" r="1.6" fill="#0284c7" />
                <circle cx="21.5" cy="17" r="1.6" fill="#0284c7" />
                <path d="M14.5 20.5 Q18 23 21.5 20.5" stroke="#0284c7" stroke-width="1.6" stroke-linecap="round" fill="none" />
                <defs>
                  <linearGradient id="popupBotGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#9333ea"/>
                    <stop offset="50%" stop-color="#ec4899"/>
                    <stop offset="100%" stop-color="#38bdf8"/>
                  </linearGradient>
                </defs>
              </svg>
              <span class="status-pulse-dot"></span>
            </div>
            <div class="header-info">
              <h3 class="header-title">ConverterAll AI</h3>
              <div class="status-row">
                <span class="status-indicator"></span>
                <span class="status-text">Online & Ready</span>
              </div>
            </div>
          </div>

          <div class="header-actions">
            <button class="icon-action-btn" (click)="clearChat()" title="Clear Chat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
            </button>
            <button class="icon-action-btn close-btn" (click)="toggleChat()" title="Minimize Chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Local AI Model Status Banner -->
        <div class="ai-model-status" *ngIf="!aiService.isModelLoaded()">
          <button class="init-ai-btn" *ngIf="aiService.progressPercent() === 0" (click)="aiService.loadModel()">
            <span class="btn-sparkle">⚡</span> Initialize Local AI (WebGPU ≈4GB)
          </button>
          <div class="progress-container" *ngIf="aiService.progressPercent() > 0">
            <div class="progress-info">
              <span class="progress-text">{{ aiService.progressMessage() }}</span>
              <span class="progress-num">{{ aiService.progressPercent() }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="aiService.progressPercent()"></div>
            </div>
          </div>
        </div>

        <!-- Chat Messages Area -->
        <div class="chat-messages" #scrollContainer>
          <div *ngFor="let msg of messages()" class="message" [ngClass]="msg.sender">
            <div class="avatar" *ngIf="msg.sender === 'bot'">
              <svg viewBox="0 0 36 36" width="22" height="22" fill="none">
                <circle cx="18" cy="18" r="17" fill="url(#msgBotGrad)" />
                <path d="M9 16 C9 11 27 11 27 16" stroke="white" stroke-width="2" stroke-linecap="round" fill="none"/>
                <rect x="10" y="12" width="16" height="13" rx="5" fill="white" />
                <rect x="7" y="13.5" width="3.5" height="8" rx="1.75" fill="#38bdf8" />
                <rect x="25.5" y="13.5" width="3.5" height="8" rx="1.75" fill="#38bdf8" />
                <circle cx="14.5" cy="17" r="1.5" fill="#0284c7" />
                <circle cx="21.5" cy="17" r="1.5" fill="#0284c7" />
                <path d="M14.5 20.5 Q18 23 21.5 20.5" stroke="#0284c7" stroke-width="1.5" stroke-linecap="round" fill="none" />
                <defs>
                  <linearGradient id="msgBotGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#9333ea"/>
                    <stop offset="50%" stop-color="#ec4899"/>
                    <stop offset="100%" stop-color="#38bdf8"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="bubble-wrapper">
              <div class="bubble" [class.action-bubble]="msg.isAction" [innerHTML]="msg.text"></div>
              <span class="msg-time" *ngIf="msg.timestamp">{{ msg.timestamp }}</span>
            </div>
          </div>
          
          <!-- Typing Indicator -->
          <div class="message bot" *ngIf="isThinking()">
            <div class="avatar">
              <svg viewBox="0 0 36 36" width="22" height="22" fill="none">
                <circle cx="18" cy="18" r="17" fill="url(#msgBotGrad2)" />
                <rect x="10" y="12" width="16" height="13" rx="5" fill="white" />
                <circle cx="14.5" cy="17" r="1.5" fill="#0284c7" />
                <circle cx="21.5" cy="17" r="1.5" fill="#0284c7" />
                <path d="M14.5 20.5 Q18 23 21.5 20.5" stroke="#0284c7" stroke-width="1.5" stroke-linecap="round" fill="none" />
                <defs>
                  <linearGradient id="msgBotGrad2" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#9333ea"/>
                    <stop offset="100%" stop-color="#38bdf8"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div class="bubble typing">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
          </div>

          <!-- Quick Action Suggestion Chips -->
          <div class="quick-prompts" *ngIf="messages().length <= 2 && !isThinking()">
            <p class="quick-title">Quick Actions:</p>
            <div class="prompt-chips">
              <button *ngFor="let q of quickPrompts" 
                      class="chip-btn" 
                      (click)="sendQuickPrompt(q.query)">
                <span class="chip-icon">{{ q.icon }}</span>
                <span>{{ q.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Chat Input Area -->
        <div class="chat-input-container">
          <!-- Attached File Preview -->
          <div class="attached-file" *ngIf="attachedFile()">
            <div class="file-info">
              <span class="file-icon">📎</span>
              <span class="file-name">{{ attachedFile()?.name }}</span>
            </div>
            <button class="remove-file" (click)="removeFile()" title="Remove File">×</button>
          </div>

          <div class="chat-input-area">
            <button class="attach-btn" (click)="fileInput.click()" title="Attach Image or Document">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <input type="file" #fileInput (change)="onFileSelected($event)" style="display: none;">
            
            <input type="text" 
                   #chatInput 
                   placeholder="Ask AI or upload a file..." 
                   class="chat-input"
                   (keyup.enter)="handleSend(chatInput)">
            
            <button class="send-btn" (click)="handleSend(chatInput)" title="Send Message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>

      </div>

      <!-- 2. FLOATING TRIGGER BUTTON (Pill shape matching user screenshot) -->
      <button class="floating-assistance-pill" 
              (click)="toggleChat()" 
              [class.active]="isOpen()"
              title="Need Assistance? Click to chat with AI">
        
        <!-- Bot Avatar Badge -->
        <div class="bot-avatar-badge">
          <svg viewBox="0 0 36 36" width="30" height="30" fill="none" class="bot-svg">
            <circle cx="18" cy="18" r="17" fill="url(#pillBotGrad)" />
            <path d="M9 16 C9 11 27 11 27 16" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
            <rect x="10" y="12" width="16" height="13" rx="5" fill="white" />
            <rect x="7" y="13.5" width="3.5" height="8" rx="1.75" fill="#38bdf8" />
            <rect x="25.5" y="13.5" width="3.5" height="8" rx="1.75" fill="#38bdf8" />
            <circle cx="14.5" cy="17" r="1.6" fill="#0284c7" />
            <circle cx="21.5" cy="17" r="1.6" fill="#0284c7" />
            <path d="M14.5 20.5 Q18 23 21.5 20.5" stroke="#0284c7" stroke-width="1.6" stroke-linecap="round" fill="none" />
            <defs>
              <linearGradient id="pillBotGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#9333ea"/>
                <stop offset="50%" stop-color="#ec4899"/>
                <stop offset="100%" stop-color="#38bdf8"/>
              </linearGradient>
            </defs>
          </svg>
          <span class="online-indicator"></span>
        </div>

        <!-- Pill Label Text -->
        <span class="pill-label">Need Assistance?</span>

        <!-- Floating Chevron / Close indicator -->
        <span class="pill-chevron" [class.open]="isOpen()">
          <svg *ngIf="!isOpen()" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <svg *ngIf="isOpen()" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>

      </button>

    </div>
  `,
  styles: [`
    /* Container strictly floats in bottom-right corner */
    .floating-assistant-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-family: inherit;
    }

    /* ========================================================
       1. FLOATING ASSISTANCE PILL BUTTON (Screenshot design)
       ======================================================== */
    .floating-assistance-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 6px 18px 6px 8px;
      border-radius: 9999px;
      cursor: pointer;
      position: relative;
      user-select: none;
      outline: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      
      /* Vibrant gradient border matching screenshot */
      background: linear-gradient(rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.96)) padding-box,
                  linear-gradient(135deg, #00f2fe 0%, #38bdf8 25%, #a855f7 50%, #ec4899 75%, #f59e0b 100%) border-box;
      border: 2px solid transparent;
      box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.12), 
                  0 4px 14px rgba(236, 72, 153, 0.18),
                  0 0 10px rgba(56, 189, 248, 0.18);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    :host-context(body.dark-theme) .floating-assistance-pill,
    :host-context(body.default-theme) .floating-assistance-pill {
      background: linear-gradient(rgba(14, 18, 28, 0.95), rgba(14, 18, 28, 0.95)) padding-box,
                  linear-gradient(135deg, #00f2fe 0%, #38bdf8 25%, #a855f7 50%, #ec4899 75%, #f59e0b 100%) border-box;
      box-shadow: 0 10px 28px -4px rgba(0, 0, 0, 0.5), 
                  0 4px 18px rgba(236, 72, 153, 0.25),
                  0 0 14px rgba(56, 189, 248, 0.25);
    }

    .floating-assistance-pill:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 30px -4px rgba(0, 0, 0, 0.2), 
                  0 6px 22px rgba(236, 72, 153, 0.35),
                  0 0 18px rgba(56, 189, 248, 0.35);
    }

    .floating-assistance-pill:active {
      transform: translateY(-1px) scale(0.98);
    }

    .floating-assistance-pill.active {
      border-color: #ec4899;
      box-shadow: 0 10px 28px rgba(236, 72, 153, 0.35);
    }

    .bot-avatar-badge {
      position: relative;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .bot-svg {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
      transition: transform 0.3s ease;
    }

    .floating-assistance-pill:hover .bot-svg {
      transform: scale(1.08) rotate(3deg);
    }

    .online-indicator {
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 9px;
      height: 9px;
      background: #10b981;
      border: 1.5px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 6px #10b981;
    }

    .pill-label {
      font-size: 0.95rem;
      font-weight: 600;
      color: #0f172a;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }

    :host-context(body.dark-theme) .pill-label,
    :host-context(body.default-theme) .pill-label {
      color: #f1f5f9;
    }

    .pill-chevron {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      transition: transform 0.2s ease, color 0.2s ease;
    }

    .floating-assistance-pill:hover .pill-chevron {
      color: #38bdf8;
    }

    /* ========================================================
       2. FLOATING CHAT POPUP WINDOW
       ======================================================== */
    .chat-popup-card {
      position: fixed;
      bottom: 78px;
      right: 20px;
      width: 380px;
      max-width: calc(100vw - 32px);
      height: 560px;
      max-height: calc(100vh - 100px);
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.2), 
                  0 0 20px rgba(56, 189, 248, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 10000;
      
      /* Animation state */
      opacity: 0;
      transform: translateY(18px) scale(0.94);
      pointer-events: none;
      visibility: hidden;
      transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.28s cubic-bezier(0.16, 1, 0.3, 1),
                  visibility 0.28s;
      transform-origin: bottom right;
    }

    :host-context(body.dark-theme) .chat-popup-card,
    :host-context(body.default-theme) .chat-popup-card {
      background: rgba(14, 18, 28, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.6), 
                  0 0 30px rgba(56, 189, 248, 0.15);
    }

    .chat-popup-card.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
      visibility: visible;
    }

    /* Header */
    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      background: rgba(255, 255, 255, 0.4);
    }

    :host-context(body.dark-theme) .chat-header,
    :host-context(body.default-theme) .chat-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(255, 255, 255, 0.02);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bot-avatar-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .status-pulse-dot {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 8px;
      height: 8px;
      background: #10b981;
      border: 1.5px solid #fff;
      border-radius: 50%;
      box-shadow: 0 0 6px #10b981;
    }

    .header-info {
      display: flex;
      flex-direction: column;
    }

    .header-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.01em;
    }

    :host-context(body.dark-theme) .header-title,
    :host-context(body.default-theme) .header-title {
      color: #f8fafc;
    }

    .status-row {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 1px;
    }

    .status-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }

    .status-text {
      font-size: 0.75rem;
      color: #10b981;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .icon-action-btn {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      border: none;
      background: rgba(0, 0, 0, 0.04);
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .icon-action-btn:hover {
      background: rgba(0, 0, 0, 0.08);
      color: #0f172a;
    }

    .close-btn:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }

    :host-context(body.dark-theme) .icon-action-btn,
    :host-context(body.default-theme) .icon-action-btn {
      background: rgba(255, 255, 255, 0.06);
      color: #94a3b8;
    }

    :host-context(body.dark-theme) .icon-action-btn:hover,
    :host-context(body.default-theme) .icon-action-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #f8fafc;
    }

    /* AI Model Status */
    .ai-model-status {
      padding: 10px 16px;
      background: rgba(56, 189, 248, 0.06);
      border-bottom: 1px solid rgba(56, 189, 248, 0.12);
    }

    .init-ai-btn {
      width: 100%;
      padding: 8px 12px;
      border-radius: 10px;
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: #ffffff;
      border: none;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: transform 0.15s, box-shadow 0.15s;
    }

    .init-ai-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
    }

    .btn-sparkle { font-size: 0.95rem; }

    .progress-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
    }

    .progress-text {
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 80%;
    }

    :host-context(body.dark-theme) .progress-text,
    :host-context(body.default-theme) .progress-text {
      color: #94a3b8;
    }

    .progress-num {
      color: #0284c7;
      font-weight: 700;
    }

    .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(0, 0, 0, 0.08);
      border-radius: 3px;
      overflow: hidden;
    }

    :host-context(body.dark-theme) .progress-bar,
    :host-context(body.default-theme) .progress-bar {
      background: rgba(255, 255, 255, 0.1);
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      transition: width 0.3s ease;
    }

    /* Messages List */
    .chat-messages {
      flex: 1;
      padding: 14px 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scrollbar-width: thin;
      scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
    }

    .chat-messages::-webkit-scrollbar {
      width: 5px;
    }

    .chat-messages::-webkit-scrollbar-thumb {
      background: rgba(148, 163, 184, 0.3);
      border-radius: 4px;
    }

    .message {
      display: flex;
      gap: 8px;
      max-width: 90%;
      animation: fadeInMsg 0.2s ease-out;
    }

    @keyframes fadeInMsg {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message .avatar {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .bubble-wrapper {
      display: flex;
      flex-direction: column;
    }

    .message.user .bubble-wrapper {
      align-items: flex-end;
    }

    .message .bubble {
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 0.88rem;
      line-height: 1.45;
      word-break: break-word;
    }

    .message.bot .bubble {
      background: #f1f5f9;
      color: #1e293b;
      border-top-left-radius: 4px;
      border: 1px solid rgba(0, 0, 0, 0.04);
    }

    :host-context(body.dark-theme) .message.bot .bubble,
    :host-context(body.default-theme) .message.bot .bubble {
      background: rgba(255, 255, 255, 0.06);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .message.bot .bubble.action-bubble {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      color: #065f46;
      font-weight: 500;
    }

    :host-context(body.dark-theme) .message.bot .bubble.action-bubble,
    :host-context(body.default-theme) .message.bot .bubble.action-bubble {
      background: rgba(16, 185, 129, 0.12);
      border-color: rgba(16, 185, 129, 0.35);
      color: #34d399;
    }

    .message.user .bubble {
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      color: #ffffff;
      border-top-right-radius: 4px;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }

    .msg-time {
      font-size: 0.68rem;
      color: #94a3b8;
      margin-top: 3px;
      padding: 0 4px;
    }

    .bubble :deep(.file-attachment) {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 0, 0, 0.15);
      padding: 5px 8px;
      border-radius: 8px;
      margin-top: 6px;
      font-size: 0.78rem;
    }

    /* Typing Dots */
    .typing .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #94a3b8;
      margin-right: 4px;
      animation: typingWave 1.3s linear infinite;
    }

    .typing .dot:nth-child(2) { animation-delay: -1.1s; }
    .typing .dot:nth-child(3) { animation-delay: -0.9s; margin-right: 0; }

    @keyframes typingWave {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }

    /* Quick Action Chips */
    .quick-prompts {
      margin-top: 6px;
      padding-top: 8px;
      border-top: 1px dashed rgba(148, 163, 184, 0.2);
    }

    .quick-title {
      margin: 0 0 6px 0;
      font-size: 0.75rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .prompt-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .chip-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      border-radius: 20px;
      background: rgba(56, 189, 248, 0.08);
      border: 1px solid rgba(56, 189, 248, 0.2);
      color: #0284c7;
      font-size: 0.78rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    :host-context(body.dark-theme) .chip-btn,
    :host-context(body.default-theme) .chip-btn {
      background: rgba(56, 189, 248, 0.1);
      border-color: rgba(56, 189, 248, 0.25);
      color: #38bdf8;
    }

    .chip-btn:hover {
      background: rgba(56, 189, 248, 0.2);
      transform: translateY(-1px);
    }

    .chip-icon { font-size: 0.85rem; }

    /* Input Area */
    .chat-input-container {
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      background: rgba(255, 255, 255, 0.7);
    }

    :host-context(body.dark-theme) .chat-input-container,
    :host-context(body.default-theme) .chat-input-container {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(14, 18, 28, 0.8);
    }

    .attached-file {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 8px 12px 0;
      padding: 6px 10px;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 8px;
      font-size: 0.8rem;
      color: #0284c7;
    }

    :host-context(body.dark-theme) .attached-file,
    :host-context(body.default-theme) .attached-file {
      color: #38bdf8;
    }

    .file-info {
      display: flex;
      align-items: center;
      gap: 6px;
      overflow: hidden;
    }

    .file-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 250px;
    }

    .remove-file {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0 4px;
      line-height: 1;
    }

    .chat-input-area {
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .attach-btn {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: rgba(0, 0, 0, 0.04);
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .attach-btn:hover {
      background: rgba(0, 0, 0, 0.08);
      color: #0f172a;
    }

    :host-context(body.dark-theme) .attach-btn,
    :host-context(body.default-theme) .attach-btn {
      border-color: rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: #94a3b8;
    }

    :host-context(body.dark-theme) .attach-btn:hover,
    :host-context(body.default-theme) .attach-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #f8fafc;
    }

    .chat-input {
      flex: 1;
      padding: 9px 14px;
      border-radius: 12px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.9);
      color: #0f172a;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .chat-input:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
    }

    :host-context(body.dark-theme) .chat-input,
    :host-context(body.default-theme) .chat-input {
      border-color: rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.35);
      color: #f8fafc;
    }

    :host-context(body.dark-theme) .chat-input:focus,
    :host-context(body.default-theme) .chat-input:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
    }

    .send-btn {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
    }

    .send-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
    }

    .send-btn:active {
      transform: scale(0.95);
    }

    /* Mobile Phones Responsiveness */
    @media (max-width: 600px) {
      .floating-assistant-container {
        bottom: 14px;
        right: 14px;
      }

      .floating-assistance-pill {
        padding: 5px 12px 5px 6px;
        gap: 8px;
      }

      .pill-label {
        font-size: 0.85rem;
      }

      .chat-popup-card {
        bottom: 66px;
        left: 8px;
        right: 8px;
        width: auto;
        max-width: none;
        height: calc(100dvh - 84px);
        max-height: 85vh;
        border-radius: 20px;
      }

      .chat-header {
        padding: 10px 14px;
      }

      .chat-messages {
        padding: 10px 12px;
      }

      .prompt-chips {
        gap: 4px;
      }

      .chip-btn {
        padding: 4px 8px;
        font-size: 0.72rem;
      }

      .chat-input-area {
        padding: 8px 10px;
        gap: 6px;
      }
    }
  `]
})
export class RightSidebarComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  @ViewChild('chatInput') private chatInputRef!: ElementRef;
  
  private router = inject(Router);
  private toolExecution = inject(ToolExecutionService);
  public aiService = inject(LocalAIService);

  isOpen = signal<boolean>(false);
  isThinking = signal<boolean>(false);
  attachedFile = signal<File | null>(null);

  quickPrompts: QuickPrompt[] = [
    { icon: '🖼️', label: 'Compress Image', query: 'I want to compress an image' },
    { icon: '🪄', label: 'Remove BG', query: 'Remove background from image' },
    { icon: '📄', label: 'Merge PDF', query: 'I want to merge PDF files' },
    { icon: '📝', label: 'Resume Builder', query: 'Open professional resume builder' },
    { icon: '⚖️', label: 'BMI Calc', query: 'Open BMI health tracker' }
  ];

  messages = signal<ChatMessage[]>([
    { 
      sender: 'bot', 
      text: 'Hello! I am your <strong>ConverterAll AI Agent</strong>. How can I help you today? You can ask me to run any tool or attach files directly!',
      timestamp: this.getCurrentTime()
    }
  ]);

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  toggleChat() {
    this.isOpen.update(open => !open);
    if (this.isOpen()) {
      setTimeout(() => {
        this.scrollToBottom();
        this.chatInputRef?.nativeElement?.focus();
      }, 100);
    }
  }

  clearChat() {
    this.messages.set([
      { 
        sender: 'bot', 
        text: 'Chat history cleared. How can I assist you?', 
        timestamp: this.getCurrentTime() 
      }
    ]);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.attachedFile.set(input.files[0]);
    }
  }

  removeFile() {
    this.attachedFile.set(null);
  }

  sendQuickPrompt(query: string) {
    this.messages.update(m => [...m, { 
      sender: 'user', 
      text: query, 
      timestamp: this.getCurrentTime() 
    }]);
    
    this.isThinking.set(true);
    setTimeout(() => {
      this.isThinking.set(false);
      this.handleAIIntent(query.toLowerCase(), null);
    }, 800);
  }

  handleSend(inputEl: HTMLInputElement) {
    const text = inputEl.value;
    const file = this.attachedFile();
    
    if (!text.trim() && !file) return;
    
    let msgText = text;
    if (file) {
      msgText += `<div class="file-attachment">📎 ${file.name}</div>`;
    }
    
    this.messages.update(m => [...m, { 
      sender: 'user', 
      text: msgText, 
      timestamp: this.getCurrentTime() 
    }]);
    
    inputEl.value = '';
    this.removeFile();
    this.isThinking.set(true);

    setTimeout(() => {
      this.isThinking.set(false);
      this.handleAIIntent(text.toLowerCase(), file);
    }, 900);
  }

  private handleAIIntent(query: string, file: File | null) {
    let actionRoute = '';
    let response = '';
    let isMatchedTool = false;

    // 1. File intent routing
    if (file) {
      const type = file.type;
      if (type.includes('image')) {
        response = "I see you attached an image! Navigating to <strong>AI Background Remover</strong> to process it.";
        actionRoute = '/image-processing/bg-remover';
        isMatchedTool = true;
      } else if (type.includes('pdf')) {
        response = "I see a PDF file! Opening the <strong>PDF Compressor</strong> for you.";
        actionRoute = '/pdf-processing/compress-pdf';
        isMatchedTool = true;
      } else {
        response = `I see you attached <strong>${file.name}</strong>. What would you like to do with it?`;
        isMatchedTool = true;
      }
    } 
    // 2. Text NLP intent routing
    else if (query.includes('compress') && query.includes('image')) {
      response = "🚀 Executing Action: Opening <strong>Smart Image Compressor</strong>.";
      actionRoute = '/image-processing/compressor';
      isMatchedTool = true;
    } 
    else if (query.includes('background') || query.includes('bg remover') || query.includes('remove background')) {
      response = "✨ Executing Action: Launching <strong>AI Background Remover</strong>.";
      actionRoute = '/image-processing/bg-remover';
      isMatchedTool = true;
    }
    else if (query.includes('merge') && query.includes('pdf')) {
      response = "📄 Executing Action: Taking you to <strong>PDF Merger</strong>.";
      actionRoute = '/pdf-processing/merge-pdf';
      isMatchedTool = true;
    }
    else if (query.includes('compress') && query.includes('pdf')) {
      response = "📦 Executing Action: Opening <strong>PDF Compressor</strong>.";
      actionRoute = '/pdf-processing/compress-pdf';
      isMatchedTool = true;
    }
    else if (query.includes('bmi') || query.includes('weight')) {
      response = "⚖️ Executing Action: Opening <strong>BMI Health Tracker</strong>.";
      actionRoute = '/calculators/bmi';
      isMatchedTool = true;
    }
    else if (query.includes('loan') || query.includes('emi')) {
      response = "💳 Executing Action: Launching <strong>Loan EMI Calculator</strong>.";
      actionRoute = '/calculators/emi';
      isMatchedTool = true;
    }
    else if (query.includes('resume') || query.includes('cv')) {
      response = "📝 Executing Action: Booting up the <strong>Professional Resume Builder</strong>.";
      actionRoute = '/resume-builder';
      isMatchedTool = true;
    }
    else if (query.includes('tts') || query.includes('speech') || query.includes('mp3')) {
      response = "🎙️ Executing Action: Opening <strong>Text to Speech Converter</strong>.";
      actionRoute = '/audio-processing/text-to-mp3';
      isMatchedTool = true;
    }
    else if (query.includes('qr') || query.includes('barcode')) {
      response = "📱 Executing Action: Opening <strong>QR Code Generator</strong>.";
      actionRoute = '/developer-tools/qr-generator';
      isMatchedTool = true;
    }
    else if (query.includes('json') || query.includes('formatter')) {
      response = "💻 Executing Action: Opening <strong>JSON Formatter & Validator</strong>.";
      actionRoute = '/developer-tools/json-formatter';
      isMatchedTool = true;
    }

    // Execute tool routing
    if (isMatchedTool) {
      if (actionRoute) {
        this.messages.update(m => [...m, { 
          sender: 'bot', 
          text: response, 
          isAction: true, 
          timestamp: this.getCurrentTime() 
        }]);
        
        if (file) {
          const toolId = actionRoute.split('/').pop() || '';
          this.toolExecution.setPendingTask(toolId, file, true);
        }
        
        this.router.navigate([actionRoute]);
      } else {
        this.messages.update(m => [...m, { 
          sender: 'bot', 
          text: response, 
          timestamp: this.getCurrentTime() 
        }]);
      }
      return;
    }

    // Fallback to Local AI or helpful mock conversation
    if (this.aiService.isModelLoaded()) {
      this.aiService.generateResponse(query).then(reply => {
        this.messages.update(m => [...m, { 
          sender: 'bot', 
          text: reply, 
          timestamp: this.getCurrentTime() 
        }]);
        this.scrollToBottom();
      });
    } else {
      setTimeout(() => {
        let mockAiResponse = '';
        const q = query.trim().toLowerCase();
        
        if (q === 'hi' || q === 'hiii' || q === 'hello' || q === 'hey' || q === 'namaste') {
          mockAiResponse = "Hello there! 👋 How can I assist you with your images, PDFs, audio, or calculators today?";
        } 
        else if (q.includes('how are you')) {
          mockAiResponse = "I'm doing great! Ready to process files and navigate tools for you. 🚀";
        }
        else if (q.includes('help') || q.includes('kya kar sakte ho')) {
          mockAiResponse = "I can help you convert files, compress images, remove backgrounds, merge PDFs, build resumes, calculate loan EMIs, and much more! Simply tell me what you need.";
        }
        else {
          mockAiResponse = `I see you are asking about "${query}". You can initialize the Local AI engine above for in-depth intelligent replies, or ask me about any file conversion tool!`;
        }

        this.messages.update(m => [...m, { 
          sender: 'bot', 
          text: mockAiResponse, 
          timestamp: this.getCurrentTime() 
        }]);
        this.scrollToBottom();
      }, 400);
    }
  }
}
