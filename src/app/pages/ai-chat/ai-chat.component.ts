import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  signal,
  computed,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import {
  AiProviderId,
  AiProvider,
  AiModel,
  ChatMessage,
  FailoverEvent,
  AI_PROVIDERS_REGISTRY,
  AI_PRIORITY_CHAIN,
  getProviderById,
  getDefaultModelForProvider
} from '../../data/ai-registry.data';
import {
  AiOrchestratorService,
  ProviderKeyStatus
} from '../../services/ai-orchestrator.service';

export interface ContentSegment {
  type: 'text' | 'code';
  raw: string;
  language?: string;
  codeId?: string;
}

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss']
})
export class AiChatComponent implements OnInit, OnDestroy {
  private readonly orchestrator = inject(AiOrchestratorService);
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  @ViewChild('chatScrollContainer') private chatScrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('promptTextarea') private promptTextarea?: ElementRef<HTMLTextAreaElement>;

  // AI Registry references
  readonly providers = AI_PROVIDERS_REGISTRY;
  readonly priorityChain = AI_PRIORITY_CHAIN;

  // State Signals
  readonly messages = signal<ChatMessage[]>([]);
  readonly inputPrompt = signal<string>('');
  readonly selectedRouting = signal<'auto' | AiProviderId>('auto');
  readonly selectedModelId = signal<string>('llama-3.1-8b-instant');

  // Orchestrator State Hooks
  readonly isGenerating = computed(() => this.orchestrator.isGenerating());
  readonly activeProvider = computed(() => this.orchestrator.activeProvider());
  readonly activeModel = computed(() => this.orchestrator.activeModel());
  readonly currentFailoverBadge = computed(() => this.orchestrator.currentFailoverBadge());

  // UI Control Signals
  readonly keyModalOpen = signal<boolean>(false);
  readonly keyForm = signal<Record<AiProviderId, string>>({
    groq: '',
    gemini: '',
    openrouter: '',
    huggingface: ''
  });
  readonly keyVisibility = signal<Record<AiProviderId, boolean>>({
    groq: false,
    gemini: false,
    openrouter: false,
    huggingface: false
  });
  readonly keyStatuses = signal<ProviderKeyStatus[]>([]);
  readonly keyFeedbackMessage = signal<string | null>(null);
  readonly copiedCodeId = signal<string | null>(null);

  // FAQ Accordion State
  readonly openFaqIndex = signal<number | null>(0);

  // Quick prompt starter chips
  readonly promptChips: string[] = [
    'Write an Angular reactive form with custom validator',
    'Explain difference between Groq LPU and GPU architecture',
    'Write a high-performance Python script for concurrent async scraping',
    'Write an optimized SQL query with window functions (ROW_NUMBER)',
    'Create a clean responsive CSS flexbox navbar'
  ];

  private failoverSub?: Subscription;

  // Cache for parsed message segments to avoid re-parsing on every CD cycle
  private segmentCache = new Map<string, ContentSegment[]>();

  ngOnInit(): void {
    this.setupSeoMetaTags();
    this.refreshKeyStatuses();
    this.loadInitialGreeting();

    // Listen to real-time failover events from the orchestrator
    this.failoverSub = this.orchestrator.failover$.subscribe(event => {
      this.handleIncomingFailover(event);
    });
  }

  ngOnDestroy(): void {
    this.failoverSub?.unsubscribe();
    this.orchestrator.abortCurrentRequest();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // =========================================================================
  // SEO & STRUCTURED DATA SETUP
  // =========================================================================

  private setupSeoMetaTags(): void {
    const pageTitle = 'Free AI Chat Playground – Groq & Gemini with Auto-Failover | ConverterAllAI';
    const pageDesc =
      'Universal free AI chat interface with Groq (14.4k RPD), Google Gemini (1.5k RPD), OpenRouter, and Hugging Face. ' +
      'Features automatic 429 rate-limit failover, pristine code formatting with one-click copy, and 100% private in-browser key storage.';
    const canonicalUrl = 'https://converterallai.com/ai-chat';

    this.titleService.setTitle(pageTitle);

    this.metaService.updateTag({ name: 'description', content: pageDesc });
    this.metaService.updateTag({
      name: 'keywords',
      content: 'free ai chat, groq llama 3.3, google gemini flash, openrouter free, deepseek r1, auto failover ai, ai code playground, free llm api'
    });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });

    // OpenGraph
    this.metaService.updateTag({ property: 'og:title', content: pageTitle });
    this.metaService.updateTag({ property: 'og:description', content: pageDesc });
    this.metaService.updateTag({ property: 'og:url', content: canonicalUrl });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: pageTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: pageDesc });

    if (this.isBrowser()) {
      let canonicalEl = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement;
      if (!canonicalEl) {
        canonicalEl = this.document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        this.document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute('href', canonicalUrl);
    }
  }

  private loadInitialGreeting(): void {
    const welcomeMsg: ChatMessage = {
      id: 'msg-welcome',
      role: 'assistant',
      providerId: 'groq',
      modelId: 'llama-3.1-8b-instant',
      timestamp: new Date(),
      content:
        '### 👋 Welcome to ConverterAllAI AI Chat Playground!\n\n' +
        'This interface features **multi-provider smart routing** and **automated 429 rate-limit failover**.\n\n' +
        '* **⚡ Priority 1 (Groq)**: Up to **14,400 free requests/day** at 500+ tokens/sec.\n' +
        '* **✨ Priority 2 (Google Gemini Flash)**: **1,500 free requests/day** with a 1-million token context window.\n' +
        '* **🌐 Priority 3 (OpenRouter)**: Free community models including DeepSeek R1.\n' +
        '* **🤗 Priority 4 (Hugging Face)**: Serverless open-weights models.\n\n' +
        '```typescript\n' +
        '// Auto-failover example guarantee\n' +
        'const aiPipeline = {\n' +
        '  status: "Protected",\n' +
        '  strategy: "Groq ➔ Gemini ➔ OpenRouter ➔ Hugging Face",\n' +
        '  zeroDowntime: true\n' +
        '};\n' +
        'console.log("Ready for technical queries, code refactoring, or SQL!");\n' +
        '```\n\n' +
        'Type any question below or pick a suggestion chip to begin!'
    };
    this.messages.set([welcomeMsg]);
  }

  // =========================================================================
  // PROVIDER & MODEL ROUTING LOGIC
  // =========================================================================

  public onProviderChange(value: string): void {
    if (value === 'auto') {
      this.selectedRouting.set('auto');
      const groqDefault = getDefaultModelForProvider('groq');
      this.selectedModelId.set(groqDefault.id);
    } else {
      const pid = value as AiProviderId;
      this.selectedRouting.set(pid);
      const defaultModel = getDefaultModelForProvider(pid);
      this.selectedModelId.set(defaultModel.id);
    }
  }

  public onModelChange(modelId: string): void {
    this.selectedModelId.set(modelId);
  }

  public getAvailableModelsForActiveProvider(): AiModel[] {
    const routing = this.selectedRouting();
    if (routing === 'auto') {
      const activeP = this.activeProvider();
      return activeP ? activeP.models : this.providers[0].models;
    }
    const provider = getProviderById(routing);
    return provider ? provider.models : this.providers[0].models;
  }

  // =========================================================================
  // CHAT INTERACTION & FAILOVER HANDLING
  // =========================================================================

  public async sendMessage(customPrompt?: string): Promise<void> {
    const textToSend = (customPrompt || this.inputPrompt()).trim();
    if (!textToSend || this.isGenerating()) return;

    // Reset input and adjust textarea height
    if (!customPrompt) {
      this.inputPrompt.set('');
      if (this.promptTextarea) {
        this.promptTextarea.nativeElement.style.height = 'auto';
      }
    }

    if (!this.hasAnyConfiguredKeys()) {
      this.openKeyModal();
      this.keyFeedbackMessage.set('🔑 Please enter your free Groq or Gemini API key to start chatting.');

      const promptKeyMsg: ChatMessage = {
        id: 'setup-' + Date.now(),
        role: 'system',
        content: '🔑 API Key Required: Groq and Google Gemini require a free API key. Click the "Configure Keys" button below to paste your free key (14,400 requests/day free at console.groq.com).',
        timestamp: new Date()
      };
      this.messages.update(list => [...list, promptKeyMsg]);
      this.scrollToBottom();
      return;
    }

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    // Append user message
    this.messages.update(list => [...list, userMessage]);
    this.scrollToBottom();

    const currentHistory = this.messages().filter(m => m.role === 'user' || m.role === 'assistant');

    try {
      const result = await this.orchestrator.sendMessage(
        textToSend,
        this.selectedRouting(),
        currentHistory,
        this.selectedModelId()
      );

      const assistantMessage: ChatMessage = {
        id: 'asst-' + Date.now(),
        role: 'assistant',
        content: result.reply,
        providerId: result.providerId,
        modelId: result.modelId,
        timestamp: new Date()
      };

      this.messages.update(list => [...list, assistantMessage]);
      this.scrollToBottom();
    } catch (error: any) {
      const errorMessageText = error?.message || 'An unexpected error occurred while processing your request.';

      const errorSystemMessage: ChatMessage = {
        id: 'err-' + Date.now(),
        role: 'system',
        content: '⚠️ Request Failed: ' + errorMessageText,
        timestamp: new Date()
      };

      this.messages.update(list => [...list, errorSystemMessage]);
      this.scrollToBottom();
    }
  }

  public stopGeneration(): void {
    this.orchestrator.abortCurrentRequest();
  }

  private handleIncomingFailover(event: FailoverEvent): void {
    const fromP = getProviderById(event.fromProvider)?.name || event.fromProvider;
    const toP = getProviderById(event.toProvider)?.name || event.toProvider;
    const errCode = event.errorCode ? event.errorCode : 429;

    const badgeContent =
      'Switched from ' + fromP + ' to ' + toP + ' due to rate limit (' + errCode + '). Seamlessly continuing response...';

    const systemBadge: ChatMessage = {
      id: 'failover-' + Date.now(),
      role: 'system',
      content: badgeContent,
      failoverInfo: event,
      timestamp: new Date()
    };

    this.messages.update(list => [...list, systemBadge]);
    this.scrollToBottom();
  }

  public clearChat(): void {
    if (this.messages().length > 1) {
      if (confirm('Are you sure you want to clear your current conversation?')) {
        this.segmentCache.clear();
        this.loadInitialGreeting();
      }
    }
  }

  public exportConversation(format: 'markdown' | 'json'): void {
    const history = this.messages();
    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'markdown') {
      content = history
        .map(m => {
          if (m.role === 'system') return '> ℹ️ *' + m.content + '*\n';
          const sender = m.role === 'user' ? '### 👤 User' : '### 🤖 Assistant (' + (m.providerId || 'AI') + ')';
          return sender + ' - ' + new Date(m.timestamp).toLocaleTimeString() + '\n\n' + m.content + '\n';
        })
        .join('\n---\n\n');
      filename = 'converterallai-chat-' + Date.now() + '.md';
      mimeType = 'text/markdown';
    } else {
      content = JSON.stringify(history, null, 2);
      filename = 'converterallai-chat-' + Date.now() + '.json';
      mimeType = 'application/json';
    }

    if (this.isBrowser()) {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  // =========================================================================
  // MARKDOWN & CLEAN CODE BLOCK PARSING ENGINE
  // =========================================================================

  public getMessageSegments(message: ChatMessage): ContentSegment[] {
    const cacheKey = message.id + '_' + message.content.length;
    if (this.segmentCache.has(cacheKey)) {
      return this.segmentCache.get(cacheKey)!;
    }

    const segments: ContentSegment[] = [];
    const raw = message.content;
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)```/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeBlockRegex.exec(raw)) !== null) {
      if (match.index > lastIndex) {
        const textChunk = raw.substring(lastIndex, match.index);
        if (textChunk.trim().length > 0) {
          segments.push({
            type: 'text',
            raw: textChunk
          });
        }
      }

      const language = match[1]?.trim().toLowerCase() || 'code';
      const codeBody = match[2];

      segments.push({
        type: 'code',
        language: this.normalizeLanguageName(language),
        raw: codeBody,
        codeId: 'code-' + message.id + '-' + segments.length
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < raw.length) {
      const remaining = raw.substring(lastIndex);
      if (remaining.trim().length > 0) {
        segments.push({
          type: 'text',
          raw: remaining
        });
      }
    }

    if (segments.length === 0) {
      segments.push({
        type: 'text',
        raw
      });
    }

    this.segmentCache.set(cacheKey, segments);
    return segments;
  }

  private normalizeLanguageName(lang: string): string {
    const map: Record<string, string> = {
      ts: 'TypeScript',
      typescript: 'TypeScript',
      js: 'JavaScript',
      javascript: 'JavaScript',
      py: 'Python',
      python: 'Python',
      html: 'HTML',
      css: 'CSS',
      scss: 'SCSS',
      sql: 'SQL',
      json: 'JSON',
      bash: 'Bash',
      sh: 'Shell',
      shell: 'Shell',
      cpp: 'C++',
      csharp: 'C#',
      cs: 'C#',
      go: 'Go',
      rust: 'Rust',
      java: 'Java',
      php: 'PHP',
      xml: 'XML',
      yaml: 'YAML',
      yml: 'YAML'
    };
    return map[lang] || lang.toUpperCase() || 'Code';
  }

  public async copyCode(code: string, codeId?: string): Promise<void> {
    if (!this.isBrowser()) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      if (codeId) {
        this.copiedCodeId.set(codeId);
        setTimeout(() => {
          if (this.copiedCodeId() === codeId) {
            this.copiedCodeId.set(null);
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy code to clipboard', err);
    }
  }

  // =========================================================================
  // INPUT TEXTAREA & AUTO-SCROLL
  // =========================================================================

  public onTextareaInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  }

  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  public applyChipPrompt(prompt: string): void {
    this.inputPrompt.set(prompt);
    if (this.promptTextarea) {
      this.promptTextarea.nativeElement.focus();
      setTimeout(() => {
        if (this.promptTextarea) {
          this.promptTextarea.nativeElement.style.height = 'auto';
          this.promptTextarea.nativeElement.style.height =
            Math.min(this.promptTextarea.nativeElement.scrollHeight, 180) + 'px';
        }
      }, 50);
    }
  }

  private scrollToBottom(): void {
    if (!this.isBrowser()) return;
    setTimeout(() => {
      if (this.chatScrollContainer) {
        const el = this.chatScrollContainer.nativeElement;
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 80);
  }

  // =========================================================================
  // KEY MANAGEMENT MODAL
  // =========================================================================

  public openKeyModal(): void {
    const currentForm: Record<AiProviderId, string> = {
      groq: this.orchestrator.getApiKey('groq'),
      gemini: this.orchestrator.getApiKey('gemini'),
      openrouter: this.orchestrator.getApiKey('openrouter'),
      huggingface: this.orchestrator.getApiKey('huggingface')
    };
    this.keyForm.set(currentForm);
    this.keyFeedbackMessage.set(null);
    this.keyModalOpen.set(true);
  }

  public closeKeyModal(): void {
    this.keyModalOpen.set(false);
    this.refreshKeyStatuses();
  }

  public toggleKeyVisibility(providerId: AiProviderId): void {
    this.keyVisibility.update(current => ({
      ...current,
      [providerId]: !current[providerId]
    }));
  }

  public updateKeyFormField(providerId: AiProviderId, val: string): void {
    this.keyForm.update(cur => ({
      ...cur,
      [providerId]: val
    }));
  }

  public saveAllKeys(): void {
    const form = this.keyForm();
    for (const pid of AI_PRIORITY_CHAIN) {
      this.orchestrator.saveApiKey(pid, form[pid] || '');
    }
    this.refreshKeyStatuses();
    this.keyFeedbackMessage.set('✓ Keys saved safely in your browser localStorage!');
    setTimeout(() => {
      this.keyFeedbackMessage.set(null);
      this.closeKeyModal();
    }, 1200);
  }

  public clearKeyForProvider(providerId: AiProviderId): void {
    this.orchestrator.clearApiKey(providerId);
    this.updateKeyFormField(providerId, '');
    this.refreshKeyStatuses();
  }

  private refreshKeyStatuses(): void {
    this.keyStatuses.set(this.orchestrator.getKeyStatuses());
  }

  public hasAnyConfiguredKeys(): boolean {
    return this.keyStatuses().some(k => k.hasCustomKey || k.hasFallbackKey);
  }

  // =========================================================================
  // FAQ ACCORDION LOGIC
  // =========================================================================

  public toggleFaq(index: number): void {
    this.openFaqIndex.update(cur => (cur === index ? null : index));
  }

  public isFaqOpen(index: number): boolean {
    return this.openFaqIndex() === index;
  }
}
