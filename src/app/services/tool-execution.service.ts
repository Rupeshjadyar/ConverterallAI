import { Injectable, signal, inject } from '@angular/core';
import { AnalyticsService } from './analytics.service';

export interface PendingTask {
  toolId: string;
  file: File;
  autoStart: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToolExecutionService {
  private analyticsService = inject(AnalyticsService);
  public pendingTask = signal<PendingTask | null>(null);

  setPendingTask(toolId: string, file: File, autoStart: boolean = true) {
    this.pendingTask.set({ toolId, file, autoStart });

    // Track tool usage in Live Telemetry
    const cat = toolId.includes('pdf') ? 'pdf' : toolId.includes('image') || toolId.includes('bg') ? 'image' : toolId.includes('tts') || toolId.includes('audio') ? 'audio' : 'calculator';
    this.analyticsService.trackToolUsage(toolId, cat, `File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
  }

  clearTask() {
    this.pendingTask.set(null);
  }
}
