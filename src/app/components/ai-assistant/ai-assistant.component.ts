import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ai-popup-overlay" (click)="onClose.emit()">
      <div class="ai-popup" (click)="$event.stopPropagation()">
        <div class="header">
          <h3>✨ AI Suggestions</h3>
          <button class="close-btn" (click)="onClose.emit()">×</button>
        </div>
        
        <div class="content">
          <p class="instruction">Optimize this description?</p>
          
          <div class="suggestion-btn" (click)="generate('action_verbs')">
            <span class="icon">🚀</span>
            <div class="text">
              <strong>Consider stronger action verbs</strong>
              <small>Rephrase to sound more impactful</small>
            </div>
          </div>

          <div class="suggestion-btn" (click)="generate('quantify')">
            <span class="icon">📊</span>
            <div class="text">
              <strong>Quantify results where possible</strong>
              <small>Add numbers to show measurable impact</small>
            </div>
          </div>

          <div class="result-area" *ngIf="loading || suggestedText">
            <div *ngIf="loading" class="loader">Generating...</div>
            <div *ngIf="suggestedText && !loading" class="generated-text">
              {{ suggestedText }}
            </div>
          </div>
        </div>

        <div class="actions" *ngIf="suggestedText && !loading">
          <button class="apply-btn" (click)="apply()">Refine (सुधारें)</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ai-popup-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .ai-popup {
      background: #1e222b;
      border: 1px solid #333;
      border-radius: 8px;
      width: 350px;
      color: #fff;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #333;
    }
    .header h3 { margin: 0; font-size: 1rem; color: #4facfe; }
    .close-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
    .content { padding: 15px; }
    .instruction { margin-top: 0; font-size: 0.9rem; color: #aaa; }
    
    .suggestion-btn {
      display: flex;
      align-items: center;
      padding: 10px;
      background: #2a2e37;
      border-radius: 6px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .suggestion-btn:hover { background: #343a46; }
    .suggestion-btn .icon { font-size: 1.5rem; margin-right: 15px; }
    .suggestion-btn .text { display: flex; flex-direction: column; }
    .suggestion-btn .text strong { font-size: 0.9rem; }
    .suggestion-btn .text small { font-size: 0.75rem; color: #888; }
    
    .result-area { margin-top: 15px; padding-top: 15px; border-top: 1px dashed #444; }
    .generated-text { background: #15181e; padding: 10px; border-radius: 4px; font-size: 0.9rem; border-left: 3px solid #4facfe; }
    .loader { color: #888; font-size: 0.9rem; font-style: italic; }
    
    .actions { padding: 15px; text-align: right; border-top: 1px solid #333; }
    .apply-btn { background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .apply-btn:hover { background: #0056b3; }
  `]
})
export class AiAssistantComponent {
  @Input() currentText: string = '';
  @Output() onApply = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<void>();

  suggestedText = '';
  loading = false;

  constructor(private aiService: AiService) {}

  generate(type: 'action_verbs' | 'quantify') {
    this.loading = true;
    this.aiService.suggestImprovements(this.currentText, type).subscribe(res => {
      this.suggestedText = res;
      this.loading = false;
    });
  }

  apply() {
    if (this.suggestedText) {
      this.onApply.emit(this.suggestedText);
    }
  }
}
