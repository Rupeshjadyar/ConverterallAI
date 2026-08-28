import { Injectable, signal } from '@angular/core';

export interface PendingTask {
  toolId: string;
  file: File;
  autoStart: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToolExecutionService {
  public pendingTask = signal<PendingTask | null>(null);

  setPendingTask(toolId: string, file: File, autoStart: boolean = true) {
    this.pendingTask.set({ toolId, file, autoStart });
  }

  clearTask() {
    this.pendingTask.set(null);
  }
}
