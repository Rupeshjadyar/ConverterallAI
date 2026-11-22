import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.css']
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
