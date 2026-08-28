import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalAIService {
  private engine: any = null; // MLCEngine type
  public isModelLoaded = signal(false);
  public progressMessage = signal('');
  public progressPercent = signal(0);
  
  private modelId = 'Llama-3-8B-Instruct-q4f32_1-MLC-1k'; 
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async loadModel() {
    if (!this.isBrowser) return; // Do not run on SSR!
    if (this.engine) return; 
    
    this.progressMessage.set('Initializing AI Engine...');
    this.progressPercent.set(0);

    try {
      // DYNAMIC IMPORT to prevent Angular SSR crash
      const webllm = await import('@mlc-ai/web-llm');
      
      const initProgressCallback = (report: any) => {
        this.progressMessage.set(report.text);
        this.progressPercent.set(Math.round(report.progress * 100));
      };

      this.engine = await webllm.CreateMLCEngine(this.modelId, { initProgressCallback });
      this.isModelLoaded.set(true);
      this.progressMessage.set('AI Engine Loaded Successfully!');
    } catch (err) {
      console.error('Error loading AI model:', err);
      this.progressMessage.set('Failed to load AI model. Please ensure WebGPU is enabled.');
    }
  }

  async generateResponse(prompt: string): Promise<string> {
    if (!this.engine) {
      return "AI Model is not loaded yet! Please initialize it first.";
    }

    try {
      const reply = await this.engine.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are ConverterAll AI, a helpful and polite assistant operating entirely locally in the browser.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      });
      return reply.choices[0].message.content || 'I could not generate a response.';
    } catch (error) {
      console.error('AI Generation Error:', error);
      return "Oops! I encountered an error while thinking.";
    }
  }
}
