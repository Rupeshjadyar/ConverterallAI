import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ResumeData, ResumeTemplate, RESUME_TEMPLATES } from './templates/resume-templates';

interface SavedResume {
  id: string;
  name: string;
  templateId: string;
  data: ResumeData;
  updatedAt: number;
}

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.css']
})
export class ResumeBuilderComponent implements OnInit {
  selectedTemplateId: string = RESUME_TEMPLATES[0].id;
  resumeData: ResumeData = this.getDefaultResumeData();
  savedResumes: SavedResume[] = [];
  currentResumeId: string | null = null;
  activeTab: 'templates' | 'editor' | 'preview' = 'editor';
  activeSection: string = 'personal';
  autoSaveStatus: 'idle' | 'saving' | 'saved' = 'idle';
  isExporting: boolean = false;
  
  templates = RESUME_TEMPLATES;
  skillInput: string = '';
  private autoSaveTimeout: any;
  private storageKey = 'converterallai_resumes';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.loadSavedResumes();
      if (this.savedResumes.length > 0) {
        // Load the most recently edited resume
        const latest = [...this.savedResumes].sort((a, b) => b.updatedAt - a.updatedAt)[0];
        this.loadResume(latest.id);
      } else {
        this.createNewResume();
      }
    }
  }

  getDefaultResumeData(): ResumeData {
    return {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: []
    };
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  selectTemplate(id: string) {
    this.selectedTemplateId = id;
    this.autoSave();
  }

  getSelectedTemplate(): ResumeTemplate {
    return this.templates.find(t => t.id === this.selectedTemplateId) || this.templates[0];
  }

  getRenderedHtml(): string {
    const template = this.getSelectedTemplate();
    return template ? template.render(this.resumeData) : '';
  }

  // Experience
  addExperience() {
    this.resumeData.experience.push({ id: this.generateId(), company: '', role: '', startDate: '', endDate: '', current: false, description: '' });
    this.autoSave();
  }
  removeExperience(id: string) {
    this.resumeData.experience = this.resumeData.experience.filter((e: any) => e.id !== id);
    this.autoSave();
  }

  // Education
  addEducation() {
    this.resumeData.education.push({ id: this.generateId(), institute: '', degree: '', field: '', year: '', grade: '' });
    this.autoSave();
  }
  removeEducation(id: string) {
    this.resumeData.education = this.resumeData.education.filter((e: any) => e.id !== id);
    this.autoSave();
  }

  // Projects
  addProject() {
    this.resumeData.projects.push({ id: this.generateId(), title: '', description: '', techStack: '', link: '' });
    this.autoSave();
  }
  removeProject(id: string) {
    this.resumeData.projects = this.resumeData.projects.filter((p: any) => p.id !== id);
    this.autoSave();
  }

  // Certifications
  addCertification() {
    this.resumeData.certifications.push({ id: this.generateId(), name: '', issuer: '', year: '' });
    this.autoSave();
  }
  removeCertification(id: string) {
    this.resumeData.certifications = this.resumeData.certifications.filter((c: any) => c.id !== id);
    this.autoSave();
  }

  // Languages
  addLanguage() {
    this.resumeData.languages.push({ id: this.generateId(), language: '', proficiency: 'Basic' });
    this.autoSave();
  }
  removeLanguage(id: string) {
    this.resumeData.languages = this.resumeData.languages.filter((l: any) => l.id !== id);
    this.autoSave();
  }

  // Skills
  addSkill(skill: string) {
    if (skill.trim() && !this.resumeData.skills.includes(skill.trim())) {
      this.resumeData.skills.push(skill.trim());
      this.autoSave();
    }
  }
  removeSkill(index: number) {
    this.resumeData.skills.splice(index, 1);
    this.autoSave();
  }
  onSkillKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.skillInput.trim()) {
        this.addSkill(this.skillInput);
        this.skillInput = '';
      }
    }
  }

  autoSave() {
    if (!this.isBrowser) return;
    this.autoSaveStatus = 'saving';
    clearTimeout(this.autoSaveTimeout);
    this.autoSaveTimeout = setTimeout(() => {
      this.saveToLocalStorage();
      this.autoSaveStatus = 'saved';
      setTimeout(() => {
        if (this.autoSaveStatus === 'saved') this.autoSaveStatus = 'idle';
      }, 2000);
    }, 2000);
  }

  saveToLocalStorage() {
    if (!this.isBrowser || !this.currentResumeId) return;
    
    const existingIndex = this.savedResumes.findIndex(r => r.id === this.currentResumeId);
    const resumeToSave: SavedResume = {
      id: this.currentResumeId,
      name: this.resumeData.fullName || 'Untitled Resume',
      templateId: this.selectedTemplateId,
      data: JSON.parse(JSON.stringify(this.resumeData)),
      updatedAt: Date.now()
    };

    if (existingIndex >= 0) {
      this.savedResumes[existingIndex] = resumeToSave;
    } else {
      this.savedResumes.push(resumeToSave);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(this.savedResumes));
  }

  loadSavedResumes() {
    if (!this.isBrowser) return;
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        this.savedResumes = JSON.parse(stored);
      } catch (e) {
        this.savedResumes = [];
      }
    }
  }

  loadResume(id: string) {
    const resume = this.savedResumes.find(r => r.id === id);
    if (resume) {
      this.currentResumeId = resume.id;
      this.resumeData = JSON.parse(JSON.stringify(resume.data));
      this.selectedTemplateId = resume.templateId;
    }
  }

  deleteResume(id: string) {
    this.savedResumes = this.savedResumes.filter(r => r.id !== id);
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.savedResumes));
    }
    if (this.currentResumeId === id) {
      this.createNewResume();
    }
  }

  createNewResume() {
    this.currentResumeId = this.generateId();
    this.resumeData = this.getDefaultResumeData();
    this.selectedTemplateId = this.templates[0].id;
    this.saveToLocalStorage();
  }

  duplicateResume(id: string) {
    const resume = this.savedResumes.find(r => r.id === id);
    if (resume) {
      this.createNewResume();
      this.resumeData = JSON.parse(JSON.stringify(resume.data));
      this.selectedTemplateId = resume.templateId;
      this.saveToLocalStorage();
    }
  }

  async exportAsPdf() {
    if (!this.isBrowser) return;
    this.isExporting = true;
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = document.querySelector('.resume-preview-content') as HTMLElement;
      if (!element) throw new Error('Preview element not found');

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${this.resumeData.fullName || 'Resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Failed to generate PDF. Check console for details.');
    } finally {
      this.isExporting = false;
    }
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString();
  }
}
