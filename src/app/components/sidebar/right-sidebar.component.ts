import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToolExecutionService } from '../../services/tool-execution.service';
import { LocalAIService } from '../../services/local-ai.service';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  isAction?: boolean;
}

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="right-sidebar-wrapper">
      <aside class="app-right-sidebar glass">
        
        <div class="chat-header">
          <div class="bot-icon">🤖</div>
          <div class="header-text">
            <h3>AI Assistant</h3>
            <span class="status">Online & Ready</span>
          </div>
        </div>

        <div class="ai-model-status" *ngIf="!aiService.isModelLoaded()">
          <button class="init-ai-btn" *ngIf="aiService.progressPercent() === 0" (click)="aiService.loadModel()">
            Initialize Local AI (≈4GB)
          </button>
          <div class="progress-container" *ngIf="aiService.progressPercent() > 0">
            <span class="progress-text">{{ aiService.progressMessage() }}</span>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="aiService.progressPercent()"></div>
            </div>
          </div>
        </div>

        <div class="chat-messages" #scrollContainer>
          <div *ngFor="let msg of messages()" class="message" [ngClass]="msg.sender">
            <div class="avatar" *ngIf="msg.sender === 'bot'">🤖</div>
            <div class="bubble" [class.action-bubble]="msg.isAction" [innerHTML]="msg.text"></div>
          </div>
          
          <div class="message bot" *ngIf="isThinking()">
            <div class="avatar">🤖</div>
            <div class="bubble typing">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
          </div>
        </div>

        <div class="chat-input-container">
          <!-- Attached File Display -->
          <div class="attached-file" *ngIf="attachedFile()">
            <span class="file-icon">📄</span>
            <span class="file-name">{{ attachedFile()?.name }}</span>
            <button class="remove-file" (click)="removeFile()">×</button>
          </div>

          <div class="chat-input-area">
            <button class="attach-btn" (click)="fileInput.click()" title="Attach File">📎</button>
            <input type="file" #fileInput (change)="onFileSelected($event)" style="display: none;">
            
            <input type="text" 
                   #chatInput 
                   placeholder="Ask AI or upload a file..." 
                   class="chat-input"
                   (keyup.enter)="handleSend(chatInput)">
            <button class="send-btn" (click)="handleSend(chatInput)">➤</button>
          </div>
        </div>

      </aside>
    </div>
  `,
  styles: [`
    .right-sidebar-wrapper {
      width: 82px;
      margin: 1rem 0 1rem 0;
      position: sticky;
      top: 76px;
      height: calc(100vh - 90px);
      z-index: 1040;
    }

    .app-right-sidebar {
      width: 82px;
      height: 100%;
      border-radius: 24px 0 0 24px; 
      background: var(--card-color, rgba(14, 16, 24, 0.88));
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-left: 1px solid var(--border-color, rgba(255, 255, 255, 0.14));
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
      transition: width 0.3s cubic-bezier(0.2, 0, 0, 1);
      position: absolute;
      right: 0;
    }
    
    :host-context(body.light-theme) .app-right-sidebar {
      background: #ffffff;
      border-left: 1px solid rgba(0,0,0,0.05);
      box-shadow: -4px 0 24px rgba(0,0,0,0.04);
    }
    
    .app-right-sidebar:hover,
    .app-right-sidebar:focus-within,
    .app-right-sidebar.expanded {
      width: 340px;
    }
    
    .chat-header {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
      min-width: 340px;
    }

    .bot-icon {
      font-size: 1.8rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(56, 189, 248, 0.15);
      border-radius: 14px;
      box-shadow: 0 4px 12px rgba(56, 189, 248, 0.2);
      flex-shrink: 0;
      cursor: pointer;
    }

    .header-text {
      margin-left: 1rem;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .app-right-sidebar:hover .header-text,
    .app-right-sidebar:focus-within .header-text,
    .app-right-sidebar.expanded .header-text { opacity: 1; }

    .header-text h3 {
      margin: 0;
      font-size: 1.1rem;
      color: var(--text-primary, #fff);
    }

    .header-text .status {
      font-size: 0.8rem;
      color: #10b981;
      font-weight: 600;
    }
    
    .ai-model-status {
      padding: 10px 15px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      background: rgba(0,0,0,0.1);
      min-width: 340px;
      display: none;
    }
    
    .app-right-sidebar:hover .ai-model-status,
    .app-right-sidebar:focus-within .ai-model-status,
    .app-right-sidebar.expanded .ai-model-status { display: block; }
    
    .init-ai-btn {
      width: 100%;
      padding: 8px;
      border-radius: 8px;
      background: #38bdf8;
      color: #fff;
      border: none;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.85rem;
    }
    
    .progress-container {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .progress-text {
      font-size: 0.75rem;
      color: #94a3b8;
    }
    .progress-bar {
      width: 100%;
      height: 6px;
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: #38bdf8;
      transition: width 0.3s;
    }
    
    :host-context(body.light-theme) .header-text h3 { color: #0f172a; }

    .chat-messages {
      flex: 1;
      padding: 1.2rem 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      min-width: 340px;
      opacity: 0;
      transition: opacity 0.2s;
      scrollbar-width: none; 
      -ms-overflow-style: none;
    }
    .chat-messages::-webkit-scrollbar { display: none; }

    .app-right-sidebar:hover .chat-messages,
    .app-right-sidebar:focus-within .chat-messages,
    .app-right-sidebar.expanded .chat-messages { opacity: 1; }

    .message {
      display: flex;
      gap: 0.8rem;
      max-width: 90%;
    }

    .message.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message .avatar {
      font-size: 1.2rem;
      width: 32px;
      height: 32px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .message .bubble {
      padding: 0.8rem 1rem;
      border-radius: 14px;
      font-size: 0.9rem;
      line-height: 1.5;
      color: var(--text-primary, #e2e8f0);
      word-break: break-word;
    }
    
    .bubble .file-attachment {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0,0,0,0.1);
      padding: 6px 10px;
      border-radius: 8px;
      margin-top: 8px;
      font-size: 0.8rem;
    }

    .message.bot .bubble {
      background: rgba(255, 255, 255, 0.05);
      border-top-left-radius: 4px;
    }
    
    .message.bot .bubble.action-bubble {
      border: 1px solid rgba(16, 185, 129, 0.3);
      background: rgba(16, 185, 129, 0.1);
      color: #34d399;
    }

    .message.user .bubble {
      background: #257e84;
      color: #fff;
      border-top-right-radius: 4px;
    }

    :host-context(body.light-theme) .message.bot .bubble {
      background: #f1f5f9;
      color: #334155;
    }
    
    :host-context(body.light-theme) .message.bot .bubble.action-bubble {
      background: #ecfdf5;
      border-color: #a7f3d0;
      color: #059669;
    }

    /* Typing animation */
    .typing .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #94a3b8;
      margin-right: 4px;
      animation: wave 1.3s linear infinite;
    }
    .typing .dot:nth-child(2) { animation-delay: -1.1s; }
    .typing .dot:nth-child(3) { animation-delay: -0.9s; margin-right: 0; }
    @keyframes wave {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }

    .chat-input-container {
      border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
      min-width: 340px;
      opacity: 0;
      transition: opacity 0.2s;
      background: var(--card-color, rgba(14, 16, 24, 0.88));
    }
    
    .app-right-sidebar:hover .chat-input-container,
    .app-right-sidebar:focus-within .chat-input-container,
    .app-right-sidebar.expanded .chat-input-container { opacity: 1; }
    
    .attached-file {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 10px 14px 0;
      padding: 6px 12px;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 8px;
      font-size: 0.85rem;
      color: #e2e8f0;
    }
    
    :host-context(body.light-theme) .attached-file {
      background: #f0f9ff;
      border-color: #bae6fd;
      color: #0f172a;
    }
    
    .file-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .remove-file {
      background: none;
      border: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 1.1rem;
      line-height: 1;
    }

    .chat-input-area {
      padding: 0.8rem 1rem;
      display: flex;
      gap: 0.5rem;
    }
    
    .attach-btn {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: 1px solid var(--border-color, rgba(255,255,255,0.2));
      background: rgba(255,255,255,0.05);
      color: var(--text-primary, #fff);
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .attach-btn:hover {
      background: rgba(255,255,255,0.1);
    }
    
    :host-context(body.light-theme) .attach-btn {
      background: #f1f5f9;
      border-color: #e2e8f0;
      color: #475569;
    }

    .chat-input {
      flex: 1;
      padding: 0.8rem 1rem;
      border-radius: 12px;
      border: 1px solid var(--border-color, rgba(255,255,255,0.2));
      background: rgba(0,0,0,0.2);
      color: var(--text-primary, #fff);
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
    }

    .chat-input:focus { border-color: #38bdf8; }

    :host-context(body.light-theme) .chat-input {
      background: #f8fafc;
      border-color: #e2e8f0;
      color: #0f172a;
    }

    .send-btn {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: none;
      background: #257e84;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.1s;
    }
    .send-btn:active { transform: scale(0.95); }
  `]
})
export class RightSidebarComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  private router = inject(Router);
  private toolExecution = inject(ToolExecutionService);
  public aiService = inject(LocalAIService);
  
  messages = signal<ChatMessage[]>([
    { sender: 'bot', text: 'Hello! I am your AI Agent. I can help you navigate tools or execute tasks. Try saying <strong>"I want to compress an image"</strong> or attach a file.' }
  ]);
  
  isThinking = signal(false);
  attachedFile = signal<File | null>(null);

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
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

  handleSend(inputEl: HTMLInputElement) {
    const text = inputEl.value;
    const file = this.attachedFile();
    
    if (!text.trim() && !file) return;
    
    // Add user message
    let msgText = text;
    if (file) {
      msgText += `<div class="file-attachment">📎 ${file.name}</div>`;
    }
    
    this.messages.update(m => [...m, { sender: 'user', text: msgText }]);
    
    // Reset input
    inputEl.value = '';
    this.removeFile();
    this.isThinking.set(true);

    // Simulate AI thinking and executing Action
    setTimeout(() => {
      this.isThinking.set(false);
      this.handleAIIntent(text.toLowerCase(), file);
    }, 1200);
  }

  private handleAIIntent(query: string, file: File | null) {
    let actionRoute = '';
    let response = '';
    let isMatchedTool = false;

    // 1. First Priority: Check if request matches our internal Tools (NLP Router)
    if (file) {
      const type = file.type;
      if (type.includes('image')) {
        response = "I see you attached an image! Let's take you to the AI Background Remover to process it.";
        actionRoute = '/image-processing/bg-remover';
        isMatchedTool = true;
      } else if (type.includes('pdf')) {
        response = "I see a PDF! Let's open the PDF Compressor for you.";
        actionRoute = '/pdf-processing/compress-pdf';
        isMatchedTool = true;
      } else {
        response = `I see you attached ${file.name}. What would you like to do with it?`;
        isMatchedTool = true;
      }
    } 
    else if (query.includes('compress') && query.includes('image')) {
      response = "Executing Action: Opening Smart Image Compressor.";
      actionRoute = '/image-processing/compressor';
      isMatchedTool = true;
    } 
    else if (query.includes('background') || query.includes('bg remover') || query.includes('remove background')) {
      response = "Executing Action: Launching AI Background Remover.";
      actionRoute = '/image-processing/bg-remover';
      isMatchedTool = true;
    }
    else if (query.includes('merge') && query.includes('pdf')) {
      response = "Executing Action: Taking you to PDF Merger.";
      actionRoute = '/pdf-processing/merge-pdf';
      isMatchedTool = true;
    }
    else if (query.includes('bmi') || query.includes('weight')) {
      response = "Executing Action: Opening BMI Health Tracker.";
      actionRoute = '/calculators/bmi';
      isMatchedTool = true;
    }
    else if (query.includes('loan') || query.includes('emi')) {
      response = "Executing Action: Launching Loan EMI Calculator.";
      actionRoute = '/calculators/emi';
      isMatchedTool = true;
    }
    else if (query.includes('resume') || query.includes('cv')) {
      response = "Executing Action: Booting up the Professional Resume Builder.";
      actionRoute = '/resume-builder';
      isMatchedTool = true;
    }

    // 2. If it matched our tools, execute!
    if (isMatchedTool) {
      if (actionRoute) {
        this.messages.update(m => [...m, { sender: 'bot', text: response, isAction: true }]);
        
        if (file) {
          const toolId = actionRoute.split('/').pop() || '';
          this.toolExecution.setPendingTask(toolId, file, true);
        }
        
        this.router.navigate([actionRoute]);
      } else {
        this.messages.update(m => [...m, { sender: 'bot', text: response }]);
      }
      return; // Stop here, we served it internally
    }

    // 3. Second Priority: Fallback to real AI Model!
    if (this.aiService.isModelLoaded()) {
      this.aiService.generateResponse(query).then(reply => {
        this.messages.update(m => [...m, { sender: 'bot', text: reply }]);
        this.scrollToBottom();
      });
    } else {
      setTimeout(() => {
        let mockAiResponse = '';
        
        // Basic conversational handling (until real AI API is connected)
        const q = query.trim().toLowerCase();
        if (q === 'hi' || q === 'hiii' || q === 'hello' || q === 'hey') {
          mockAiResponse = "Hello there! 👋 How can I assist you with your files or tools today?";
        } 
        else if (q.includes('how are you')) {
          mockAiResponse = "I'm just a bundle of code, but I'm doing great! Ready to process some PDFs or Images for you. 🚀";
        }
        else {
          mockAiResponse = `I see you are asking about "${query}". My internal AI engine is not loaded yet. Click "Initialize Local AI" above to let me process this!`;
        }

        this.messages.update(m => [...m, { sender: 'bot', text: mockAiResponse }]);
        this.scrollToBottom();
      }, 500);
    }
  }
}
