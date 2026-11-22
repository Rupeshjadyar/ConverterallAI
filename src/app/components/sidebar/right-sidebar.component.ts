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
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']
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
