/**
 * AI Provider & Model Registry for ConverterAllAI
 * Strict typing for Multi-Provider AI Architecture with Free-Tier Priority Routing.
 */

export type AiProviderId = 'groq' | 'gemini' | 'openrouter' | 'huggingface';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  providerId?: AiProviderId;
  modelId?: string;
  failoverInfo?: FailoverEvent;
}

export interface FailoverEvent {
  fromProvider: AiProviderId;
  toProvider: AiProviderId;
  reason: string;
  errorCode?: number;
  timestamp: Date;
  attemptNumber: number;
}

export interface AiModel {
  id: string;
  name: string;
  providerId: AiProviderId;
  description: string;
  contextWindow: string;
  speedRating: 'Ultra' | 'Fast' | 'Balanced';
  isFreeTier: boolean;
  isDefault?: boolean;
}

export interface AiProvider {
  id: AiProviderId;
  name: string;
  brandName: string;
  priority: number;
  rpm: number;
  rpd: number;
  quotaBadge: string;
  badgeClass: string;
  accentColor: string;
  endpoint: string;
  storageKey: string;
  keyDocsUrl: string;
  description: string;
  iconSvg: string;
  models: AiModel[];
  defaultModelId: string;
}

/**
 * Prioritized Free-Tier AI Model & Provider Registry
 * Priority 1: Groq (30 RPM / 14,400 RPD) - Ultra-fast LPU inference
 * Priority 2: Google AI Studio Gemini (15 RPM / 1,500 RPD) - Massive 1M+ context window
 * Priority 3: OpenRouter (DeepSeek R1 / Llama 3.3 Free) - Free community routing
 * Priority 4: Hugging Face Inference API - Open weights foundation models
 */
export const AI_PROVIDERS_REGISTRY: AiProvider[] = [
  {
    id: 'groq',
    name: 'Groq Cloud',
    brandName: 'Groq (LPU™)',
    priority: 1,
    rpm: 30,
    rpd: 14400,
    quotaBadge: '⚡ 30 RPM / 14.4k RPD (Ultra-Fast LPU)',
    badgeClass: 'badge-groq',
    accentColor: '#f55036',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    storageKey: 'cai_key_groq',
    keyDocsUrl: 'https://console.groq.com/keys',
    description: 'Hardware-accelerated LPUs delivering near-instant 500+ tokens/second throughput on Llama 3 models.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    defaultModelId: 'llama-3.1-8b-instant',
    models: [
      {
        id: 'llama-3.1-8b-instant',
        name: 'Llama 3.1 8B Instant',
        providerId: 'groq',
        description: 'Ultra-fast inference (500+ tok/s). Excellent for conversational chat, syntax fixes, and instant answers.',
        contextWindow: '8,192 tokens',
        speedRating: 'Ultra',
        isFreeTier: true,
        isDefault: true
      },
      {
        id: 'llama-3.3-70b-versatile',
        name: 'Llama 3.3 70B Versatile',
        providerId: 'groq',
        description: 'Flagship open-weights model matching GPT-4o capabilities. Premier for complex code, SQL, and system design.',
        contextWindow: '128,000 tokens',
        speedRating: 'Fast',
        isFreeTier: true
      },
      {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B 32k',
        providerId: 'groq',
        description: 'High-speed Mixture-of-Experts architecture with 32k context for long documentation parsing.',
        contextWindow: '32,768 tokens',
        speedRating: 'Fast',
        isFreeTier: true
      }
    ]
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    brandName: 'Google AI Studio',
    priority: 2,
    rpm: 15,
    rpd: 1500,
    quotaBadge: '✨ 15 RPM / 1,500 RPD (Multimodal Flash)',
    badgeClass: 'badge-gemini',
    accentColor: '#4285f4',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    storageKey: 'cai_key_gemini',
    keyDocsUrl: 'https://aistudio.google.com/app/apikey',
    description: 'Google state-of-the-art multimodal reasoning models with industry-leading context window length.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
    defaultModelId: 'gemini-1.5-flash',
    models: [
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        providerId: 'gemini',
        description: 'Blazing speed and lightweight efficiency with a massive 1-million token context window on free tier.',
        contextWindow: '1,000,000 tokens',
        speedRating: 'Fast',
        isFreeTier: true,
        isDefault: true
      },
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        providerId: 'gemini',
        description: 'Next-generation reasoning with enhanced coding, multimodal perception, and lower latency.',
        contextWindow: '1,000,000 tokens',
        speedRating: 'Ultra',
        isFreeTier: true
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        providerId: 'gemini',
        description: 'Complex reasoning, math proofs, deep multi-file code refactoring with 2M token context window.',
        contextWindow: '2,000,000 tokens',
        speedRating: 'Balanced',
        isFreeTier: true
      }
    ]
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    brandName: 'OpenRouter Free',
    priority: 3,
    rpm: 20,
    rpd: 200,
    quotaBadge: '🌐 Free Tier (Community Shared)',
    badgeClass: 'badge-openrouter',
    accentColor: '#6366f1',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    storageKey: 'cai_key_openrouter',
    keyDocsUrl: 'https://openrouter.ai/keys',
    description: 'Universal unified AI gateway aggregating free-tier models like DeepSeek R1 and Llama 3.3.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    defaultModelId: 'deepseek/deepseek-r1:free',
    models: [
      {
        id: 'deepseek/deepseek-r1:free',
        name: 'DeepSeek R1 (Free)',
        providerId: 'openrouter',
        description: 'Cutting-edge open reasoning model with transparent chain-of-thought mathematical and algorithmic analysis.',
        contextWindow: '64,000 tokens',
        speedRating: 'Balanced',
        isFreeTier: true,
        isDefault: true
      },
      {
        id: 'meta-llama/llama-3.3-70b-instruct:free',
        name: 'Llama 3.3 70B Instruct (Free)',
        providerId: 'openrouter',
        description: 'High-capability open model hosted with free community rate allocations.',
        contextWindow: '128,000 tokens',
        speedRating: 'Fast',
        isFreeTier: true
      },
      {
        id: 'google/gemini-2.0-flash-exp:free',
        name: 'Gemini 2.0 Flash Exp (Free)',
        providerId: 'openrouter',
        description: 'Experimental build of Gemini 2.0 served via OpenRouter free tier.',
        contextWindow: '1,000,000 tokens',
        speedRating: 'Ultra',
        isFreeTier: true
      }
    ]
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    brandName: 'HF Inference API',
    priority: 4,
    rpm: 10,
    rpd: 1000,
    quotaBadge: '🤗 Community Inference API',
    badgeClass: 'badge-huggingface',
    accentColor: '#ffbd59',
    endpoint: 'https://api-inference.huggingface.co/v1/chat/completions',
    storageKey: 'cai_key_huggingface',
    keyDocsUrl: 'https://huggingface.co/settings/tokens',
    description: 'Community AI hub powering thousands of open models via serverless Inference Endpoints.',
    iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
    defaultModelId: 'meta-llama/Meta-Llama-3-8B-Instruct',
    models: [
      {
        id: 'meta-llama/Meta-Llama-3-8B-Instruct',
        name: 'Llama 3 8B Instruct',
        providerId: 'huggingface',
        description: 'Reliable general-purpose conversational LLM hosted directly on Hugging Face Serverless.',
        contextWindow: '8,192 tokens',
        speedRating: 'Fast',
        isFreeTier: true,
        isDefault: true
      },
      {
        id: 'mistralai/Mistral-7B-Instruct-v0.3',
        name: 'Mistral 7B Instruct v0.3',
        providerId: 'huggingface',
        description: 'Top-tier 7B parameter reasoning and code completion model with native function calling support.',
        contextWindow: '32,768 tokens',
        speedRating: 'Fast',
        isFreeTier: true
      },
      {
        id: 'Qwen/Qwen2.5-Coder-32B-Instruct',
        name: 'Qwen 2.5 Coder 32B',
        providerId: 'huggingface',
        description: 'State-of-the-art specialized code intelligence model for full-stack software development.',
        contextWindow: '32,768 tokens',
        speedRating: 'Balanced',
        isFreeTier: true
      }
    ]
  }
];

/**
 * Priority Chain Order for Seamless Auto-Failover:
 * 1. Groq (Highest speed & 14,400 free RPD)
 * 2. Gemini (Multimodal reasoning & 1,500 free RPD)
 * 3. OpenRouter (Zero-cost community models)
 * 4. Hugging Face (Serverless community inference)
 */
export const AI_PRIORITY_CHAIN: AiProviderId[] = ['groq', 'gemini', 'openrouter', 'huggingface'];

/**
 * Registry Helper Functions
 */
export function getProviderById(providerId: AiProviderId): AiProvider | undefined {
  return AI_PROVIDERS_REGISTRY.find(p => p.id === providerId);
}

export function getAllProvidersSorted(): AiProvider[] {
  return [...AI_PROVIDERS_REGISTRY].sort((a, b) => a.priority - b.priority);
}

export function getDefaultProvider(): AiProvider {
  return AI_PROVIDERS_REGISTRY[0]; // Groq
}

export function getDefaultModelForProvider(providerId: AiProviderId): AiModel {
  const provider = getProviderById(providerId) || AI_PROVIDERS_REGISTRY[0];
  const defaultModel = provider.models.find(m => m.isDefault);
  return defaultModel || provider.models[0];
}

export function getNextProviderInChain(currentProviderId: AiProviderId, excludedProviders: AiProviderId[] = []): AiProvider | null {
  const currentIndex = AI_PRIORITY_CHAIN.indexOf(currentProviderId);
  const total = AI_PRIORITY_CHAIN.length;

  for (let i = 1; i <= total; i++) {
    const nextIndex = (currentIndex + i) % total;
    const candidateId = AI_PRIORITY_CHAIN[nextIndex];
    if (!excludedProviders.includes(candidateId)) {
      const candidate = getProviderById(candidateId);
      if (candidate) return candidate;
    }
  }

  return null;
}
