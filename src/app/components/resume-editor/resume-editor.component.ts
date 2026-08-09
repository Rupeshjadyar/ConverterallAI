import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ResumeService } from '../../services/resume.service';
import { AiAssistantComponent } from '../ai-assistant/ai-assistant.component';

@Component({
  selector: 'app-resume-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AiAssistantComponent],
  templateUrl: './resume-editor.component.html',
  styleUrls: ['./resume-editor.component.css']
})
export class ResumeEditorComponent implements OnInit {
  resumeForm!: FormGroup;
  showAiPopup = false;
  activeControlIndex = -1;

  constructor(private fb: FormBuilder, private resumeService: ResumeService) {}

  ngOnInit() {
    const currentData = this.resumeService.getCurrentData();
    
    this.resumeForm = this.fb.group({
      personalDetails: this.fb.group({
        fullName: [currentData.personalDetails.fullName],
        jobTitle: [currentData.personalDetails.jobTitle],
        email: [currentData.personalDetails.email],
        phone: [currentData.personalDetails.phone],
        website: [currentData.personalDetails.website],
        summary: [currentData.personalDetails.summary]
      }),
      experience: this.fb.array(
        currentData.experience.map(exp => this.fb.group({
          id: [exp.id],
          jobTitle: [exp.jobTitle],
          company: [exp.company],
          startDate: [exp.startDate],
          endDate: [exp.endDate],
          description: [exp.description]
        }))
      ),
      education: this.fb.array(
        currentData.education.map(edu => this.fb.group({
          id: [edu.id],
          degree: [edu.degree],
          school: [edu.school],
          startDate: [edu.startDate],
          endDate: [edu.endDate],
          description: [edu.description]
        }))
      )
    });

    this.resumeForm.valueChanges.subscribe(val => {
      this.resumeService.updateData(val);
    });
  }

  get experienceControls() {
    return (this.resumeForm.get('experience') as FormArray).controls;
  }

  openAiAssistant(index: number) {
    this.activeControlIndex = index;
    this.showAiPopup = true;
  }

  closeAiAssistant() {
    this.showAiPopup = false;
    this.activeControlIndex = -1;
  }

  applyAiSuggestion(suggestion: string) {
    if (this.activeControlIndex >= 0) {
      const expControl = this.experienceControls[this.activeControlIndex];
      expControl.get('description')?.setValue(suggestion);
    }
    this.closeAiAssistant();
  }
}
