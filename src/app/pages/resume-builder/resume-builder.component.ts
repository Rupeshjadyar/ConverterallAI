import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  institute: string;
  degree: string;
  field: string;
  year: string;
  grade: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string;
  link: string;
}

export interface CertItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
}

export interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: CertItem[];
  languages: LanguageItem[];
  customSections: CustomSectionItem[];
}

export interface ResumeTemplate {
  id: string;
  name: string;
  category: string;
  colorPrimary: string;
  colorAccent: string;
  description: string;
  layout: string;
  font: string;
  isCustom?: boolean;
}

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resume-builder.component.html',
  styleUrls: ['./resume-builder.component.css']
})
export class ResumeBuilderComponent implements OnInit {
  @ViewChild('pdfTarget', { static: false }) pdfTarget!: ElementRef;

  activeTab: 'templates' | 'editor' | 'customize' = 'editor';
  activeEditorSection: 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'customSections' = 'personal';
  activeCategory: string = 'All';

  // Customization Options
  customPrimaryColor: string = '#1e3a5f';
  customAccentColor: string = '#2563eb';
  customFont: 'sans' | 'serif' | 'mono' = 'sans';
  customLayout: '2col-left-main' | '2col-top-banner' | '2col-right-sidebar' | '1col-minimal' | '1col-terminal' = '2col-left-main';
  fontSizeScale: 'small' | 'medium' | 'large' = 'medium';
  sectionSpacing: 'compact' | 'normal' | 'spacious' = 'normal';
  zoomLevel: number = 100;

  // Section Visibility Flags
  sectionVisibility = {
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    certifications: true,
    languages: true,
    customSections: true
  };

  // AI Modal State
  showAiModal: boolean = false;
  aiPromptType: 'summary' | 'experience' | 'skills' = 'experience';
  targetExperienceIndex: number = -1;
  aiLoading: boolean = false;
  aiGeneratedResult: string = '';
  aiSelectedOption: string = 'action_verbs';

  categories: string[] = ['All', 'Custom', 'Professional', 'Creative', 'Tech', 'Minimalist', 'Academic', 'Executive', 'Simple'];

  // --- 30 TEMPLATES + CUSTOM TEMPLATE ---
  templates: ResumeTemplate[] = [
    { id: 'tpl-custom', name: 'Custom Design', category: 'Custom', colorPrimary: '#8b5cf6', colorAccent: '#ec4899', description: 'Design your own custom layout, colors & typography from scratch', layout: 'custom', font: 'sans', isCustom: true },
    { id: 'tpl-1', name: 'Modern Executive', category: 'Professional', colorPrimary: '#1e3a5f', colorAccent: '#2563eb', description: 'Dark navy sidebar with crisp dual column structure', layout: '2col-left-main', font: 'sans' },
    { id: 'tpl-2', name: 'Creative Portfolio', category: 'Creative', colorPrimary: '#7c3aed', colorAccent: '#f97316', description: 'Vibrant purple & orange top gradient banner', layout: '2col-top-banner', font: 'sans' },
    { id: 'tpl-3', name: 'Minimalist Clean', category: 'Minimalist', colorPrimary: '#0f172a', colorAccent: '#64748b', description: 'Centered header with subtle dividers for ATS', layout: '1col-minimal', font: 'sans' },
    { id: 'tpl-4', name: 'Corporate Leader', category: 'Executive', colorPrimary: '#1e293b', colorAccent: '#d97706', description: 'Classic serif elegance with gold accents & right bar', layout: '2col-right-sidebar', font: 'serif' },
    { id: 'tpl-5', name: 'Tech Engineer', category: 'Tech', colorPrimary: '#0f172a', colorAccent: '#10b981', description: 'Terminal-inspired monospace code aesthetic', layout: '1col-terminal', font: 'mono' },
    { id: 'tpl-6', name: 'Fresh Graduate', category: 'Simple', colorPrimary: '#0d9488', colorAccent: '#14b8a6', description: 'Clean teal layout highlighting education & projects', layout: '2col-left-main', font: 'sans' },
    { id: 'tpl-7', name: 'Academic Scholar', category: 'Academic', colorPrimary: '#7f1d1d', colorAccent: '#b91c1c', description: 'Formal serif structure tailored for publications', layout: '1col-minimal', font: 'serif' },
    { id: 'tpl-8', name: 'Product Manager', category: 'Professional', colorPrimary: '#2563eb', colorAccent: '#1d4ed8', description: 'Metrics-focused design with skill badges', layout: '2col-left-main', font: 'sans' },
    { id: 'tpl-9', name: 'Nordic Minimal', category: 'Minimalist', colorPrimary: '#334155', colorAccent: '#0ea5e9', description: 'Soft slate tones with generous whitespace', layout: '1col-minimal', font: 'sans' },
    { id: 'tpl-10', name: 'Emerald Executive', category: 'Executive', colorPrimary: '#064e3b', colorAccent: '#10b981', description: 'Deep emerald green sidebar for corporate roles', layout: '2col-left-main', font: 'sans' },
    { id: 'tpl-11', name: 'Cyberpunk Tech', category: 'Tech', colorPrimary: '#18181b', colorAccent: '#ec4899', description: 'High contrast dark mode with neon accents', layout: '1col-terminal', font: 'mono' },
    { id: 'tpl-12', name: 'Startup Founder', category: 'Creative', colorPrimary: '#4c1d95', colorAccent: '#8b5cf6', description: 'Bold purple top bar with impact metrics', layout: '2col-top-banner', font: 'sans' },
    { id: 'tpl-13', name: 'Legal Professional', category: 'Executive', colorPrimary: '#172554', colorAccent: '#3b82f6', description: 'Traditional formal serif with double border', layout: '1col-minimal', font: 'serif' },
    { id: 'tpl-14', name: 'UI/UX Specialist', category: 'Creative', colorPrimary: '#be185d', colorAccent: '#f43f5e', description: 'Design-forward layout with soft pill badges', layout: '2col-top-banner', font: 'sans' },
    { id: 'tpl-15', name: 'DevOps Architect', category: 'Tech', colorPrimary: '#0f172a', colorAccent: '#06b6d4', description: 'Clean monospace layout with cyan prompt indicators', layout: '1col-terminal', font: 'mono' },
    { id: 'tpl-16', name: 'Finance Strategist', category: 'Professional', colorPrimary: '#1e3a5f', colorAccent: '#ca8a04', description: 'Navy & gold split column layout', layout: '2col-right-sidebar', font: 'sans' },
    { id: 'tpl-17', name: 'Healthcare Pro', category: 'Professional', colorPrimary: '#0369a1', colorAccent: '#38bdf8', description: 'Clean medical blue with structured sections', layout: '1col-minimal', font: 'sans' },
    { id: 'tpl-18', name: 'Marketing Lead', category: 'Creative', colorPrimary: '#c2410c', colorAccent: '#f97316', description: 'Energetic orange accents with headline summary', layout: '2col-top-banner', font: 'sans' },
    { id: 'tpl-19', name: 'Data Scientist', category: 'Tech', colorPrimary: '#312e81', colorAccent: '#6366f1', description: 'Indigo theme with highlighted tech stack section', layout: '2col-left-main', font: 'mono' },
    { id: 'tpl-20', name: 'Media & Journalist', category: 'Academic', colorPrimary: '#111827', colorAccent: '#ef4444', description: 'Editorial newspaper serif style with red drop line', layout: '1col-minimal', font: 'serif' },
    { id: 'tpl-21', name: 'ATS Standard', category: 'Simple', colorPrimary: '#000000', colorAccent: '#475569', description: '100% plain text ATS friendly resume format', layout: '1col-minimal', font: 'sans' },
    { id: 'tpl-22', name: 'Classic Navy', category: 'Professional', colorPrimary: '#0f172a', colorAccent: '#38bdf8', description: 'Timeless dark navy header with 2 column body', layout: '2col-left-main', font: 'sans' },
    { id: 'tpl-23', name: 'Rose Gold Executive', category: 'Executive', colorPrimary: '#881337', colorAccent: '#fb7185', description: 'Sophisticated burgundy & rose gold accents', layout: '2col-right-sidebar', font: 'serif' },
    { id: 'tpl-24', name: 'Clean Slate', category: 'Minimalist', colorPrimary: '#475569', colorAccent: '#94a3b8', description: 'Subtle slate gray borders with wide margin padding', layout: '1col-minimal', font: 'sans' },
    { id: 'tpl-25', name: 'Full Stack Engineer', category: 'Tech', colorPrimary: '#0284c7', colorAccent: '#22c55e', description: 'Dual color blue & green code badges', layout: '2col-left-main', font: 'mono' },
    { id: 'tpl-26', name: 'Architect & Interior', category: 'Creative', colorPrimary: '#292524', colorAccent: '#a8a29e', description: 'Architectural monochrome with sharp lines', layout: '2col-top-banner', font: 'sans' },
    { id: 'tpl-27', name: 'Sales Director', category: 'Executive', colorPrimary: '#991b1b', colorAccent: '#f87171', description: 'Bold red accent line with revenue highlight box', layout: '2col-right-sidebar', font: 'sans' },
    { id: 'tpl-28', name: 'HR Manager', category: 'Simple', colorPrimary: '#047857', colorAccent: '#34d399', description: 'Friendly emerald green layout with soft spacing', layout: '2col-left-main', font: 'sans' },
    { id: 'tpl-29', name: 'Consultant Leader', category: 'Professional', colorPrimary: '#1e293b', colorAccent: '#38bdf8', description: 'McKinsey-style clean executive format', layout: '1col-minimal', font: 'serif' },
    { id: 'tpl-30', name: 'AI & ML Researcher', category: 'Tech', colorPrimary: '#581c87', colorAccent: '#a855f7', description: 'Deep purple AI tech theme with publication tags', layout: '1col-terminal', font: 'mono' }
  ];

  selectedTemplate: ResumeTemplate = this.templates[0];

  // --- DEFAULT RESUME DATA FOR RUPESH JADYAR ---
  resume: ResumeData = {
    fullName: 'Rupesh Jadyar',
    jobTitle: 'Senior Full Stack Developer & AI Engineer',
    email: 'rupesh.jadyar@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    linkedin: 'linkedin.com/in/rupeshjadyar',
    portfolio: 'rupeshjadyar.dev',
    summary: 'Results-driven Senior Software Engineer with over 6 years of experience building high-performance web applications, scalable backend microservices, and AI-powered automation workflows. Proven track record in leading cross-functional teams, optimizing database queries by 45%, and architecting enterprise cloud solutions.',
    experience: [
      {
        id: '1',
        company: 'TechCorp Solutions Inc.',
        role: 'Senior Full Stack Developer',
        startDate: 'Jan 2022',
        endDate: 'Present',
        current: true,
        description: '• Architected and deployed microservices using Node.js and Angular, improving app load times by 40% for over 500,000 monthly active users.\n• Spearheaded the integration of OpenAI & Gemini APIs, delivering automated resume scoring and intelligent search.\n• Mentored 8 junior developers and implemented CI/CD pipelines reducing deployment friction by 60%.'
      },
      {
        id: '2',
        company: 'Innovate Digital Labs',
        role: 'Software Engineer',
        startDate: 'Jun 2019',
        endDate: 'Dec 2021',
        current: false,
        description: '• Developed responsive Web Applications using React, RxJS, and TypeScript.\n• Optimized PostgreSQL queries and Redis caching layer, decreasing database response latency by 35%.\n• Collaborated with UX designers to craft high-conversion landing pages resulting in a 25% surge in user signups.'
      }
    ],
    education: [
      {
        id: '1',
        institute: 'Mumbai University',
        degree: 'Bachelor of Technology',
        field: 'Computer Engineering',
        year: '2019',
        grade: '8.8 / 10 CGPA'
      }
    ],
    skills: [
      'Angular', 'TypeScript', 'Node.js', 'Python', 'React', 
      'RxJS', 'PostgreSQL', 'Docker', 'AWS Cloud', 'REST & GraphQL APIs', 'Tailwind CSS', 'Git & CI/CD'
    ],
    projects: [
      {
        id: '1',
        title: 'AI Resume Synthesizer',
        techStack: 'Angular, Node.js, Gemini API, PDF-Lib',
        description: 'Engineered an automated AI resume enhancement platform generating tailored action points and real-time PDF exports.',
        link: 'github.com/rupesh/ai-resume-builder'
      },
      {
        id: '2',
        title: 'Cloud Metrics Dashboard',
        techStack: 'React, D3.js, Express, Redis',
        description: 'Built real-time telemetry monitoring dashboard processing 10k events/sec with customizable widget panels.',
        link: 'cloudmetrics-demo.app'
      }
    ],
    certifications: [
      { id: '1', name: 'AWS Certified Solutions Architect – Associate', issuer: 'Amazon Web Services', year: '2023' },
      { id: '2', name: 'Professional Scrum Master (PSM I)', issuer: 'Scrum.org', year: '2022' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Fluent / Full Professional' },
      { id: '2', language: 'Hindi', proficiency: 'Native / Bilingual' }
    ],
    customSections: [
      {
        id: '1',
        title: 'Honors & Awards',
        content: '• Recipient of "Engineer of the Year 2023" at TechCorp Inc.\n• 1st Place Winner at National Hackathon 2021.'
      }
    ]
  };

  newSkillInput: string = '';

  ngOnInit() {
    this.customPrimaryColor = this.selectedTemplate.colorPrimary;
    this.customAccentColor = this.selectedTemplate.colorAccent;
  }

  get filteredTemplates(): ResumeTemplate[] {
    if (this.activeCategory === 'All') return this.templates;
    return this.templates.filter(t => t.category === this.activeCategory);
  }

  selectTemplate(tpl: ResumeTemplate) {
    this.selectedTemplate = tpl;
    if (tpl.isCustom) {
      this.activeTab = 'customize';
    } else {
      this.customPrimaryColor = tpl.colorPrimary;
      this.customAccentColor = tpl.colorAccent;
      this.customFont = tpl.font as any;
      this.customLayout = tpl.layout as any;
    }
  }

  get activeEffectiveLayout(): string {
    if (this.selectedTemplate.isCustom) {
      return this.customLayout;
    }
    return this.selectedTemplate.layout;
  }

  // --- INLINE EDITING SYNC HANDLER ---
  onInlineEdit(fieldPath: string, event: Event) {
    const target = event.target as HTMLElement;
    const text = target.innerText.trim();

    if (fieldPath === 'fullName') this.resume.fullName = text;
    else if (fieldPath === 'jobTitle') this.resume.jobTitle = text;
    else if (fieldPath === 'email') this.resume.email = text;
    else if (fieldPath === 'phone') this.resume.phone = text;
    else if (fieldPath === 'location') this.resume.location = text;
    else if (fieldPath === 'summary') this.resume.summary = text;
  }

  onExpInlineEdit(index: number, key: 'role' | 'company' | 'description', event: Event) {
    const target = event.target as HTMLElement;
    if (this.resume.experience[index]) {
      this.resume.experience[index][key] = target.innerText.trim();
    }
  }

  // --- CUSTOM SECTIONS & FORM HANDLERS ---
  addCustomSection() {
    this.resume.customSections.push({
      id: Date.now().toString(),
      title: 'New Custom Section',
      content: '• Enter your custom details or accomplishments...'
    });
  }

  removeCustomSection(index: number) {
    this.resume.customSections.splice(index, 1);
  }

  addExperience() {
    this.resume.experience.push({
      id: Date.now().toString(),
      company: 'New Company',
      role: 'Role Title',
      startDate: '2023',
      endDate: 'Present',
      current: true,
      description: '• Key achievement or responsibility point.'
    });
  }

  removeExperience(index: number) {
    this.resume.experience.splice(index, 1);
  }

  addEducation() {
    this.resume.education.push({
      id: Date.now().toString(),
      institute: 'University Name',
      degree: 'Degree',
      field: 'Field of Study',
      year: '2023',
      grade: 'Grade/GPA'
    });
  }

  removeEducation(index: number) {
    this.resume.education.splice(index, 1);
  }

  addSkill() {
    if (this.newSkillInput.trim()) {
      this.resume.skills.push(this.newSkillInput.trim());
      this.newSkillInput = '';
    }
  }

  removeSkill(index: number) {
    this.resume.skills.splice(index, 1);
  }

  addProject() {
    this.resume.projects.push({
      id: Date.now().toString(),
      title: 'New Project Title',
      techStack: 'Technologies used',
      description: 'Short project summary and metrics achieved.',
      link: 'project-link.com'
    });
  }

  removeProject(index: number) {
    this.resume.projects.splice(index, 1);
  }

  addCertification() {
    this.resume.certifications.push({
      id: Date.now().toString(),
      name: 'Certification Title',
      issuer: 'Issuing Body',
      year: '2024'
    });
  }

  removeCertification(index: number) {
    this.resume.certifications.splice(index, 1);
  }

  // --- JSON EXPORT / IMPORT ---
  exportJsonData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.resume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${this.resume.fullName.replace(/\s+/g, '_')}_resume_data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importJsonData(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const parsed = JSON.parse(e.target.result);
          if (parsed.fullName) {
            this.resume = parsed;
          }
        } catch (err) {
          alert('Invalid JSON File structure');
        }
      };
      reader.readAsText(input.files[0]);
    }
  }

  // --- AI Assistant Logic ---
  openAiForExperience(index: number) {
    this.targetExperienceIndex = index;
    this.aiPromptType = 'experience';
    this.showAiModal = true;
    this.aiGeneratedResult = '';
  }

  openAiForSummary() {
    this.aiPromptType = 'summary';
    this.showAiModal = true;
    this.aiGeneratedResult = '';
  }

  closeAiModal() {
    this.showAiModal = false;
    this.aiLoading = false;
    this.aiGeneratedResult = '';
  }

  generateAiSuggestions() {
    this.aiLoading = true;
    this.aiGeneratedResult = '';

    setTimeout(() => {
      this.aiLoading = false;
      if (this.aiPromptType === 'summary') {
        this.aiGeneratedResult = `High-impact ${this.resume.jobTitle} with demonstrated expertise in scalable system design, cross-functional leadership, and software engineering. Leverages cutting-edge technologies and data-driven solutions to accelerate business growth, optimize application efficiency, and elevate user experience.`;
      } else if (this.aiPromptType === 'experience') {
        if (this.aiSelectedOption === 'action_verbs') {
          this.aiGeneratedResult = `• Engineered robust end-to-end features utilizing modern frameworks, reducing system downtime by 30%.\n• Spearheaded cross-team collaboration to streamline product delivery and improve user satisfaction scores by 25%.\n• Orchestrated cloud infrastructure migrations, cutting monthly hosting costs by $12,000.`;
        } else if (this.aiSelectedOption === 'quantify') {
          this.aiGeneratedResult = `• Quantified Impact: Led an engineering initiative that boosted conversion rates by 38% and served over 1.2M active monthly users.\n• Optimized application query performance, achieving a 500ms reduction in latency across core API endpoints.\n• Managed a team of 6 engineers to deliver 14 high-priority sprint features ahead of schedule.`;
        } else {
          this.aiGeneratedResult = `• Designed and implemented key features aligned with modern software engineering best practices.\n• Automated routine testing and deployment pipelines to enhance developer efficiency and code reliability.`;
        }
      }
    }, 1200);
  }

  applyAiResult() {
    if (!this.aiGeneratedResult) return;
    if (this.aiPromptType === 'summary') {
      this.resume.summary = this.aiGeneratedResult;
    } else if (this.aiPromptType === 'experience' && this.targetExperienceIndex >= 0) {
      this.resume.experience[this.targetExperienceIndex].description = this.aiGeneratedResult;
    }
    this.closeAiModal();
  }

  // --- Export PDF ---
  exportToPDF() {
    if (!this.pdfTarget) return;
    const element = this.pdfTarget.nativeElement;

    const opt = {
      scale: 2,
      useCORS: true,
      logging: false
    };

    html2canvas(element, opt).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${this.resume.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    });
  }
}
