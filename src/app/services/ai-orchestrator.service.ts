import { Injectable, signal } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import {
  AiProviderId,
  AiProvider,
  AiModel,
  ChatMessage,
  FailoverEvent,
  AI_PROVIDERS_REGISTRY,
  AI_PRIORITY_CHAIN,
  getProviderById,
  getDefaultModelForProvider,
  getNextProviderInChain
} from '../data/ai-registry.data';

export interface OrchestrationResult {
  reply: string;
  providerId: AiProviderId;
  modelId: string;
  failoversOccurred: FailoverEvent[];
  latencyMs: number;
}

export interface ProviderKeyStatus {
  providerId: AiProviderId;
  name: string;
  hasCustomKey: boolean;
  hasFallbackKey: boolean;
  keyMasked: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiOrchestratorService {
  // System prompts ensuring top-quality code and markdown outputs
  private readonly DEFAULT_SYSTEM_PROMPT =
    'You are an expert AI assistant and Principal Software Architect on ConverterAllAI. ' +
    'Provide precise, clear, well-structured, production-ready responses. ' +
    'When generating code (TypeScript, Python, HTML, SQL, etc.), always wrap it in standard fenced markdown code blocks ' +
    'with explicit language tags (e.g. ```typescript, ```python, ```sql). ' +
    'Preserve exact syntax, indentations, clean comments, and do not use corrupted characters or unescaped placeholders.';

  // Signal state for active UI binding
  readonly activeProvider = signal<AiProvider>(AI_PROVIDERS_REGISTRY[0]);
  readonly activeModel = signal<AiModel>(AI_PROVIDERS_REGISTRY[0].models[0]);
  readonly isGenerating = signal<boolean>(false);
  readonly currentFailoverBadge = signal<FailoverEvent | null>(null);

  // Observable stream for failover notifications
  private readonly failoverSubject = new Subject<FailoverEvent>();
  public readonly failover$: Observable<FailoverEvent> = this.failoverSubject.asObservable();

  // Active in-flight AbortController for cancel / stop generation
  private activeAbortController: AbortController | null = null;

  // Optional site-wide fallback keys (provided by administrator or environment)
  private readonly siteWideFallbackKeys: Record<AiProviderId, string> = {
    groq: '',
    gemini: '',
    openrouter: '',
    huggingface: ''
  };

  constructor() {
    // Initialize default active provider and model
    const groq = getProviderById('groq') || AI_PROVIDERS_REGISTRY[0];
    this.activeProvider.set(groq);
    this.activeModel.set(getDefaultModelForProvider('groq'));
  }

  // =========================================================================
  // API KEY MANAGEMENT (100% Client-Side LocalStorage with Fallback Slots)
  // =========================================================================

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Retrieves active API key for a provider. Prioritizes user's custom localStorage key,
   * then falls back to admin site-wide slot if present.
   */
  public getApiKey(providerId: AiProviderId): string {
    if (this.isBrowser()) {
      const provider = getProviderById(providerId);
      if (provider) {
        const storedKey = localStorage.getItem(provider.storageKey);
        if (storedKey && storedKey.trim().length > 0) {
          return storedKey.trim();
        }
      }
    }
    return this.siteWideFallbackKeys[providerId] || '';
  }

  /**
   * Saves a user-provided API key to localStorage.
   */
  public saveApiKey(providerId: AiProviderId, key: string): void {
    if (!this.isBrowser()) return;
    const provider = getProviderById(providerId);
    if (!provider) return;

    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(provider.storageKey, trimmed);
    } else {
      localStorage.removeItem(provider.storageKey);
    }
  }

  /**
   * Clears a stored API key.
   */
  public clearApiKey(providerId: AiProviderId): void {
    if (!this.isBrowser()) return;
    const provider = getProviderById(providerId);
    if (provider) {
      localStorage.removeItem(provider.storageKey);
    }
  }

  /**
   * Checks whether a working key is available (custom or fallback).
   */
  public hasAvailableKey(providerId: AiProviderId): boolean {
    return this.getApiKey(providerId).length > 0;
  }

  /**
   * Returns inspection statuses for all providers (e.g. for Key Management modal).
   */
  public getKeyStatuses(): ProviderKeyStatus[] {
    return AI_PROVIDERS_REGISTRY.map(provider => {
      let customKey = '';
      if (this.isBrowser()) {
        customKey = localStorage.getItem(provider.storageKey) || '';
      }
      const hasCustom = customKey.trim().length > 0;
      const hasFallback = (this.siteWideFallbackKeys[provider.id] || '').length > 0;
      const activeKey = hasCustom ? customKey.trim() : (this.siteWideFallbackKeys[provider.id] || '');

      let keyMasked = 'None configured';
      if (activeKey.length > 8) {
        keyMasked = `${activeKey.slice(0, 4)}...${activeKey.slice(-4)}`;
      } else if (activeKey.length > 0) {
        keyMasked = '••••••••';
      }

      return {
        providerId: provider.id,
        name: provider.name,
        hasCustomKey: hasCustom,
        hasFallbackKey: hasFallback,
        keyMasked
      };
    });
  }

  /**
   * Allows setting optional site-wide fallback keys (e.g. from runtime config)
   */
  public setSiteWideFallbackKey(providerId: AiProviderId, key: string): void {
    this.siteWideFallbackKeys[providerId] = key.trim();
  }

  // =========================================================================
  // ORCHESTRATION & AUTO-FAILOVER PIPELINE
  // =========================================================================

  /**
   * Aborts in-flight request immediately
   */
  public abortCurrentRequest(): void {
    if (this.activeAbortController) {
      this.activeAbortController.abort('User aborted generation');
      this.activeAbortController = null;
    }
    this.isGenerating.set(false);
  }

  /**
   * Primary entry point: sends user message with conversational history.
   * Seamlessly handles automatic failover across the priority chain on 429/503/network errors.
   */
  public async sendMessage(
    prompt: string,
    routingChoice: 'auto' | AiProviderId,
    chatHistory: ChatMessage[],
    customModelId?: string
  ): Promise<OrchestrationResult> {
    if (!prompt.trim()) {
      throw new Error('Prompt cannot be empty.');
    }

    this.abortCurrentRequest();
    this.activeAbortController = new AbortController();
    const abortSignal = this.activeAbortController.signal;

    this.isGenerating.set(true);
    this.currentFailoverBadge.set(null);

    const startTime = performance.now();
    const failoversOccurred: FailoverEvent[] = [];
    const triedProviders = new Set<AiProviderId>();

    // Determine initial target provider
    let currentProviderId: AiProviderId;
    if (routingChoice === 'auto') {
      currentProviderId = AI_PRIORITY_CHAIN[0]; // Start at highest priority: Groq
    } else {
      currentProviderId = routingChoice;
    }

    let targetModelId = customModelId || getDefaultModelForProvider(currentProviderId).id;
    let attemptNumber = 0;

    try {
      while (attemptNumber < AI_PRIORITY_CHAIN.length) {
        attemptNumber++;
        triedProviders.add(currentProviderId);

        const currentProvider = getProviderById(currentProviderId);
        if (!currentProvider) {
          throw new Error(`Provider "${currentProviderId}" is not registered.`);
        }

        // Update active UI signals
        this.activeProvider.set(currentProvider);
        const modelObj = currentProvider.models.find(m => m.id === targetModelId) || currentProvider.models[0];
        this.activeModel.set(modelObj);

        // Check API Key
        const apiKey = this.getApiKey(currentProviderId);
        if (!apiKey) {
          // If in Auto mode and no key for this provider, failover to next provider with key
          if (routingChoice === 'auto') {
            const nextCandidate = this.findNextAvailableProvider(currentProviderId, triedProviders, true);
            if (nextCandidate) {
              const failoverEvent: FailoverEvent = {
                fromProvider: currentProviderId,
                toProvider: nextCandidate.id,
                reason: `No API key for ${currentProvider.name}. Routed to ${nextCandidate.name}.`,
                timestamp: new Date(),
                attemptNumber
              };
              failoversOccurred.push(failoverEvent);
              this.emitFailover(failoverEvent);
              currentProviderId = nextCandidate.id;
              targetModelId = getDefaultModelForProvider(currentProviderId).id;
              continue;
            }
          }
          throw new Error(
            `No API key configured for ${currentProvider.name}. ` +
            `Please click "API Keys" in the top bar to enter your free key from ${currentProvider.keyDocsUrl}.`
          );
        }

        try {
          // Dispatch request to specific provider handler
          const reply = await this.dispatchProviderRequest(
            currentProviderId,
            targetModelId,
            prompt,
            chatHistory,
            apiKey,
            abortSignal
          );

          const latencyMs = Math.round(performance.now() - startTime);

          return {
            reply,
            providerId: currentProviderId,
            modelId: targetModelId,
            failoversOccurred,
            latencyMs
          };
        } catch (error: any) {
          if (abortSignal.aborted) {
            throw new Error('Generation stopped by user.');
          }

          const status = error?.status || error?.statusCode;
          const isRateLimitOrOverload = status === 429 || status === 503 || status === 504 || status === 529;
          const isNetworkError = error?.name === 'TypeError' || error?.message?.includes('fetch') || error?.message?.includes('Network');

          // If failover is appropriate (auto mode OR rate limit encountered)
          const canFailover = isRateLimitOrOverload || isNetworkError || routingChoice === 'auto';

          if (canFailover) {
            const nextCandidate = this.findNextAvailableProvider(currentProviderId, triedProviders, false);
            if (nextCandidate) {
              const reasonDescription = status === 429
                ? `Rate limit (HTTP 429) hit on ${currentProvider.name}`
                : status === 503
                ? `Service overloaded (HTTP 503) on ${currentProvider.name}`
                : `Network/API issue on ${currentProvider.name}`;

              const failoverEvent: FailoverEvent = {
                fromProvider: currentProviderId,
                toProvider: nextCandidate.id,
                reason: reasonDescription,
                errorCode: status,
                timestamp: new Date(),
                attemptNumber
              };

              failoversOccurred.push(failoverEvent);
              this.emitFailover(failoverEvent);

              // Switch to next provider and its default model
              currentProviderId = nextCandidate.id;
              targetModelId = getDefaultModelForProvider(currentProviderId).id;
              continue; // Re-attempt exact prompt
            }
          }

          // If failover not possible or exhausted
          throw error;
        }
      }

      throw new Error(
        'All AI providers in the failover chain were exhausted or encountered rate limits. ' +
        'Please wait a few moments or provide custom API keys in the settings modal.'
      );
    } finally {
      this.isGenerating.set(false);
      this.activeAbortController = null;
    }
  }

  private findNextAvailableProvider(
    currentId: AiProviderId,
    tried: Set<AiProviderId>,
    requireKey: boolean
  ): AiProvider | null {
    for (const candidateId of AI_PRIORITY_CHAIN) {
      if (!tried.has(candidateId)) {
        if (!requireKey || this.hasAvailableKey(candidateId)) {
          const provider = getProviderById(candidateId);
          if (provider) return provider;
        }
      }
    }
    return null;
  }

  private emitFailover(event: FailoverEvent): void {
    this.currentFailoverBadge.set(event);
    this.failoverSubject.next(event);
  }

  // =========================================================================
  // PROVIDER HTTP ADAPTER IMPLEMENTATIONS
  // =========================================================================

  private async dispatchProviderRequest(
    providerId: AiProviderId,
    modelId: string,
    prompt: string,
    history: ChatMessage[],
    apiKey: string,
    signal: AbortSignal
  ): Promise<string> {
    switch (providerId) {
      case 'groq':
        return this.executeGroqRequest(modelId, prompt, history, apiKey, signal);
      case 'gemini':
        return this.executeGeminiRequest(modelId, prompt, history, apiKey, signal);
      case 'openrouter':
        return this.executeOpenRouterRequest(modelId, prompt, history, apiKey, signal);
      case 'huggingface':
        return this.executeHuggingFaceRequest(modelId, prompt, history, apiKey, signal);
      default:
        throw new Error(`Unsupported provider: ${providerId}`);
    }
  }

  /**
   * 1. Groq (OpenAI-compatible format)
   * High performance LPU inference (500+ tok/s).
   */
  private async executeGroqRequest(
    modelId: string,
    prompt: string,
    history: ChatMessage[],
    apiKey: string,
    signal: AbortSignal
  ): Promise<string> {
    const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

    const messages = [
      { role: 'system', content: this.DEFAULT_SYSTEM_PROMPT },
      ...history
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: prompt }
    ];

    const body = {
      model: modelId,
      messages,
      temperature: 0.6,
      max_tokens: 4096
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body),
      signal
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      let parsed: any;
      try {
        parsed = JSON.parse(errText);
      } catch {}
      const error: any = new Error(
        parsed?.error?.message || `Groq API responded with HTTP ${response.status}: ${response.statusText}`
      );
      error.status = response.status;
      throw error;
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      throw new Error('Groq returned an invalid or empty response payload.');
    }
    return content;
  }

  /**
   * 2. Google Gemini (generateContent format)
   * 1M token context window, multimodal capability.
   */
  private async executeGeminiRequest(
    modelId: string,
    prompt: string,
    history: ChatMessage[],
    apiKey: string,
    signal: AbortSignal
  ): Promise<string> {
    const cleanModel = modelId.replace('models/', '');
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${apiKey}`;

    // Map conversation history to Gemini schema (user <-> model alternation)
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (const msg of history) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        const geminiRole = msg.role === 'assistant' ? 'model' : 'user';
        // Avoid duplicate consecutive roles
        if (contents.length > 0 && contents[contents.length - 1].role === geminiRole) {
          contents[contents.length - 1].parts[0].text += `\n\n${msg.content}`;
        } else {
          contents.push({
            role: geminiRole,
            parts: [{ text: msg.content }]
          });
        }
      }
    }

    // Append current user prompt
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents[contents.length - 1].parts[0].text += `\n\n${prompt}`;
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });
    }

    const payload = {
      systemInstruction: {
        parts: [{ text: this.DEFAULT_SYSTEM_PROMPT }]
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      let parsed: any;
      try {
        parsed = JSON.parse(errText);
      } catch {}
      const error: any = new Error(
        parsed?.error?.message || `Google Gemini API returned HTTP ${response.status}: ${response.statusText}`
      );
      error.status = response.status;
      throw error;
    }

    const json = await response.json();
    const candidate = json.candidates?.[0];
    const textPart = candidate?.content?.parts?.[0]?.text;

    if (!textPart) {
      if (candidate?.finishReason === 'SAFETY') {
        throw new Error('Gemini response was blocked by content safety filters.');
      }
      throw new Error('Gemini returned an empty candidate response.');
    }

    return textPart;
  }

  /**
   * 3. OpenRouter (Unified multi-model API)
   * Connects to DeepSeek R1, Llama 3.3 Free, and hundreds more.
   */
  private async executeOpenRouterRequest(
    modelId: string,
    prompt: string,
    history: ChatMessage[],
    apiKey: string,
    signal: AbortSignal
  ): Promise<string> {
    const endpoint = 'https://openrouter.ai/api/v1/chat/completions';

    const messages = [
      { role: 'system', content: this.DEFAULT_SYSTEM_PROMPT },
      ...history
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: prompt }
    ];

    const body = {
      model: modelId,
      messages,
      temperature: 0.7
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://converterallai.com',
        'X-Title': 'ConverterAllAI AI Playground'
      },
      body: JSON.stringify(body),
      signal
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      let parsed: any;
      try {
        parsed = JSON.parse(errText);
      } catch {}
      const error: any = new Error(
        parsed?.error?.message || `OpenRouter API returned HTTP ${response.status}: ${response.statusText}`
      );
      error.status = response.status;
      throw error;
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      throw new Error('OpenRouter returned an invalid response payload.');
    }
    return content;
  }

  /**
   * 4. Hugging Face Inference API
   * Access to open-weights models. Supports OpenAI-compatible chat completions.
   */
  private async executeHuggingFaceRequest(
    modelId: string,
    prompt: string,
    history: ChatMessage[],
    apiKey: string,
    signal: AbortSignal
  ): Promise<string> {
    const endpoint = 'https://api-inference.huggingface.co/v1/chat/completions';

    const messages = [
      { role: 'system', content: this.DEFAULT_SYSTEM_PROMPT },
      ...history
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: prompt }
    ];

    const body = {
      model: modelId,
      messages,
      max_tokens: 2048,
      temperature: 0.7
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body),
      signal
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      let parsed: any;
      try {
        parsed = JSON.parse(errText);
      } catch {}

      // Handle model loading state on Hugging Face (503 with estimated_time)
      if (response.status === 503 && parsed?.estimated_time) {
        const error: any = new Error(
          `Hugging Face model is warming up (${Math.round(parsed.estimated_time)}s remaining).`
        );
        error.status = 503;
        throw error;
      }

      const error: any = new Error(
        parsed?.error || parsed?.message || `Hugging Face API returned HTTP ${response.status}: ${response.statusText}`
      );
      error.status = response.status;
      throw error;
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      throw new Error('Hugging Face returned an invalid response payload.');
    }
    return content;
  }
}
