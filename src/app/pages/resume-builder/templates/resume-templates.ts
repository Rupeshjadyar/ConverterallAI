export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  experience: { id: string; company: string; role: string; startDate: string; endDate: string; current: boolean; description: string; }[];
  education: { id: string; institute: string; degree: string; field: string; year: string; grade: string; }[];
  skills: string[];
  projects: { id: string; title: string; description: string; techStack: string; link: string; }[];
  certifications: { id: string; name: string; issuer: string; year: string; }[];
  languages: { id: string; language: string; proficiency: string; }[];
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
  render: (data: ResumeData, isEditable?: boolean) => string;
}

export interface CustomTemplateConfig {
  colorPrimary: string;
  colorAccent: string;
  layout: string;
  font: string;
}

function esc(s: string): string {
  if (!s) return '';
  // Don't escape HTML tags because the user will use WYSIWYG formatting (<b>, <i>, etc.)
  // Just return the string. If it's empty, return placeholder text or empty space so it can be clicked.
  return s;
}

function ce(field: string, val: string, placeholder: string, isEditable: boolean): string {
  const content = val ? esc(val) : (isEditable ? `<span class="placeholder-text">${placeholder}</span>` : '');
  if (!isEditable) return content;
  return `<span contenteditable="true" data-field="${field}" class="editable-field">${content}</span>`;
}

export function generateResumeHTML(data: ResumeData, config: { id: string; colorPrimary: string; colorAccent: string; layout: string; font: string }, isEditable = true): string {
  const p = data || {} as any;
  const hasExp = data.experience && data.experience.length > 0;
  const hasEdu = data.education && data.education.length > 0;
  const hasSkills = data.skills && data.skills.length > 0;
  const hasProj = data.projects && data.projects.length > 0;
  const hasCert = data.certifications && data.certifications.length > 0;
  const hasLang = data.languages && data.languages.length > 0;

  let fontFam: string;
  if (config.font === 'serif') {
    fontFam = "Georgia, 'Times New Roman', serif";
  } else if (config.font === 'mono') {
    fontFam = "'Courier New', monospace";
  } else {
    fontFam = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
  }

  const isDark = config.layout.includes('dark');
  let bg = isDark ? config.colorAccent : '#ffffff';
  let textCol = isDark ? '#ffffff' : '#333333';
  if (config.layout === '1col-terminal') { bg = config.colorPrimary; textCol = config.colorAccent; }

  const terminalH = config.layout === '1col-terminal' ? config.colorAccent : config.colorPrimary;
  const terminalSub = config.layout === '1col-terminal' ? config.colorAccent : '#555';
  const chipBg = config.layout === '1col-terminal' ? 'transparent' : config.colorPrimary;
  const chipColor = config.layout === '1col-terminal' ? config.colorAccent : (config.colorPrimary === '#ffffff' ? '#000' : '#fff');
  const chipBorder = config.layout === '1col-terminal' ? '1px solid ' + config.colorAccent : 'none';
  const isSideBold = config.layout.includes('sidebar-bold');
  const sideBg = isSideBold ? config.colorPrimary : '#f8f9fa';
  const sideColor = isSideBold ? '#fff' : textCol;
  const sideH2 = isSideBold ? config.colorAccent : config.colorPrimary;
  const sideChipBg = isSideBold ? 'rgba(255,255,255,0.2)' : config.colorPrimary;
  const sideSub = isSideBold ? 'rgba(255,255,255,0.8)' : '#555';

  const styles = `<style>
    .${config.id} { font-family: ${fontFam}; width: 794px; min-height: 1123px; margin: 0 auto; background: ${bg}; color: ${textCol}; box-sizing: border-box; line-height: 1.5; font-size: 14px; position: relative; }
    .${config.id} * { box-sizing: border-box; }
    .${config.id} h1 { font-size: 28px; color: ${terminalH}; margin: 0 0 8px 0; }
    .${config.id} h2 { font-size: 18px; color: ${terminalH}; border-bottom: 2px solid ${terminalH}; padding-bottom: 5px; margin: 18px 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }
    .${config.id} .contact-info { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 15px; font-size: 12px; }
    .${config.id} .section { margin-bottom: 16px; position: relative; }
    .${config.id} .item { margin-bottom: 12px; position: relative; }
    .${config.id} .item-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 3px; font-size: 14px; }
    .${config.id} .item-sub { font-style: italic; color: ${terminalSub}; margin-bottom: 4px; font-size: 13px; }
    .${config.id} .item-desc { font-size: 13px; line-height: 1.5; }
    .${config.id} .skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .${config.id} .skill-chip { background: ${chipBg}; color: ${chipColor}; padding: 3px 10px; border-radius: 4px; font-size: 12px; border: ${chipBorder}; display: inline-block; }
    .${config.id} .layout-2col { display: flex; width: 100%; min-height: 1123px; }
    .${config.id} .col-main { flex: 2; padding: 35px; }
    .${config.id} .col-side { flex: 1; padding: 35px; background: ${sideBg}; color: ${sideColor}; }
    .${config.id} .col-side h2 { color: ${sideH2}; border-color: ${sideH2}; }
    .${config.id} .col-side .skill-chip { background: ${sideChipBg}; }
    .${config.id} .col-side .item-sub { color: ${sideSub}; }
    .${config.id} .layout-1col { padding: 35px; }
    .${config.id} .summary { font-size: 13px; line-height: 1.6; margin-bottom: 10px; color: ${isDark ? textCol : '#444'}; }
    
    /* Editable Field Styles */
    .editable-field { min-width: 20px; display: inline-block; outline: none; transition: background 0.2s; }
    .editable-field:hover { background: rgba(0, 150, 255, 0.1); cursor: text; border-radius: 2px; }
    .editable-field:focus { background: rgba(0, 150, 255, 0.15); box-shadow: 0 0 0 2px rgba(0, 150, 255, 0.5); border-radius: 2px; }
    .placeholder-text { opacity: 0.5; font-style: italic; }
    
    /* Add/Remove Controls inside Preview */
    .inline-controls { display: none; position: absolute; right: 0; top: 0; gap: 4px; }
    .section:hover > .inline-controls, .item:hover > .inline-controls { display: flex; }
    .btn-inline { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 2px 6px; font-size: 10px; cursor: pointer; color: #334155; }
    .btn-inline:hover { background: #e2e8f0; }
    .btn-inline-danger { background: #fee2e2; border-color: #fca5a5; color: #b91c1c; }
    .btn-inline-danger:hover { background: #fecaca; }
  </style>`;

  const contactParts: string[] = [];
  contactParts.push(`<span>\u2709 ${ce('email', p.email, 'Email Address', isEditable)}</span>`);
  contactParts.push(`<span>\u260E ${ce('phone', p.phone, 'Phone Number', isEditable)}</span>`);
  contactParts.push(`<span>\uD83D\uDCCD ${ce('location', p.location, 'Location / City', isEditable)}</span>`);
  contactParts.push(`<span>in/ ${ce('linkedin', p.linkedin, 'LinkedIn Profile', isEditable)}</span>`);
  contactParts.push(`<span>\uD83C\uDF10 ${ce('portfolio', p.portfolio, 'Portfolio URL', isEditable)}</span>`);

  const headerHtml = `<div class="header section">
    <h1>${ce('fullName', p.fullName, 'Your Full Name', isEditable)}</h1>
    <div class="contact-info">${contactParts.join('')}</div>
    <div class="summary">${ce('summary', data.summary, 'Write a professional summary here...', isEditable)}</div>
  </div>`;

  let expHtml = `<div class="section" data-section="experience"><h2>Experience</h2>
    ${isEditable ? `<div class="inline-controls"><button class="btn-inline" onclick="window.addResumeItem('experience')">+ Add Job</button></div>` : ''}`;
  
  if (hasExp) {
    data.experience.forEach((e, i) => {
      expHtml += `<div class="item">
        ${isEditable ? `<div class="inline-controls"><button class="btn-inline btn-inline-danger" onclick="window.removeResumeItem('experience', '${e.id}')">Delete</button></div>` : ''}
        <div class="item-header">
          <span>${ce(`experience.${i}.role`, e.role, 'Job Title', isEditable)}</span>
          <span>${ce(`experience.${i}.startDate`, e.startDate, 'Start', isEditable)} - ${ce(`experience.${i}.endDate`, e.endDate, 'End / Present', isEditable)}</span>
        </div>
        <div class="item-sub">${ce(`experience.${i}.company`, e.company, 'Company Name', isEditable)}</div>
        <div class="item-desc">${ce(`experience.${i}.description`, e.description, 'Describe your responsibilities and achievements...', isEditable)}</div>
      </div>`;
    });
  }
  expHtml += '</div>';

  let eduHtml = `<div class="section" data-section="education"><h2>Education</h2>
    ${isEditable ? `<div class="inline-controls"><button class="btn-inline" onclick="window.addResumeItem('education')">+ Add Education</button></div>` : ''}`;
  if (hasEdu || isEditable) {
    data.education.forEach((e, i) => {
      eduHtml += `<div class="item">
        ${isEditable ? `<div class="inline-controls"><button class="btn-inline btn-inline-danger" onclick="window.removeResumeItem('education', '${e.id}')">Delete</button></div>` : ''}
        <div class="item-header">
          <span>${ce(`education.${i}.degree`, e.degree, 'Degree', isEditable)} ${e.field ? ' in ' : ''} ${ce(`education.${i}.field`, e.field, 'Field of Study', isEditable)}</span>
          <span>${ce(`education.${i}.year`, e.year, 'Graduation Year', isEditable)}</span>
        </div>
        <div class="item-sub">${ce(`education.${i}.institute`, e.institute, 'University/Institute', isEditable)} | ${ce(`education.${i}.grade`, e.grade, 'GPA/Grade', isEditable)}</div>
      </div>`;
    });
  }
  eduHtml += '</div>';

  let skillsHtml = `<div class="section" data-section="skills"><h2>Skills</h2>
    ${isEditable ? `<div class="inline-controls"><button class="btn-inline" onclick="window.addResumeItem('skills')">+ Add Skill</button></div>` : ''}
    <div class="skills-list">`;
  if (hasSkills || isEditable) {
    data.skills.forEach((s, i) => {
      skillsHtml += `<span class="skill-chip">
        ${ce(`skills.${i}`, s, 'Skill', isEditable)}
        ${isEditable ? `<span style="cursor:pointer;margin-left:4px;color:rgba(255,255,255,0.5);" onclick="window.removeResumeItem('skills', ${i})">&times;</span>` : ''}
      </span>`;
    });
  }
  skillsHtml += '</div></div>';

  let projHtml = `<div class="section" data-section="projects"><h2>Projects</h2>
    ${isEditable ? `<div class="inline-controls"><button class="btn-inline" onclick="window.addResumeItem('projects')">+ Add Project</button></div>` : ''}`;
  if (hasProj || isEditable) {
    data.projects.forEach((pr, i) => {
      projHtml += `<div class="item">
        ${isEditable ? `<div class="inline-controls"><button class="btn-inline btn-inline-danger" onclick="window.removeResumeItem('projects', '${pr.id}')">Delete</button></div>` : ''}
        <div class="item-header"><span>${ce(`projects.${i}.title`, pr.title, 'Project Title', isEditable)}</span></div>
        <div class="item-sub">${ce(`projects.${i}.techStack`, pr.techStack, 'Technologies used (e.g. Angular, Node.js)', isEditable)}</div>
        <div class="item-desc">${ce(`projects.${i}.description`, pr.description, 'Project description...', isEditable)}</div>
        <div style="font-size:12px;margin-top:3px;color:${terminalH};">${ce(`projects.${i}.link`, pr.link, 'Project URL', isEditable)}</div>
      </div>`;
    });
  }
  projHtml += '</div>';

  let certHtml = `<div class="section" data-section="certifications"><h2>Certifications</h2>
    ${isEditable ? `<div class="inline-controls"><button class="btn-inline" onclick="window.addResumeItem('certifications')">+ Add Cert</button></div>` : ''}`;
  if (hasCert || isEditable) {
    data.certifications.forEach((c, i) => {
      certHtml += `<div class="item">
        ${isEditable ? `<div class="inline-controls"><button class="btn-inline btn-inline-danger" onclick="window.removeResumeItem('certifications', '${c.id}')">Delete</button></div>` : ''}
        <div class="item-header"><span>${ce(`certifications.${i}.name`, c.name, 'Certification Name', isEditable)}</span><span>${ce(`certifications.${i}.year`, c.year, 'Year', isEditable)}</span></div>
        <div class="item-sub">${ce(`certifications.${i}.issuer`, c.issuer, 'Issuing Organization', isEditable)}</div>
      </div>`;
    });
  }
  certHtml += '</div>';

  let langHtml = `<div class="section" data-section="languages"><h2>Languages</h2>
    ${isEditable ? `<div class="inline-controls"><button class="btn-inline" onclick="window.addResumeItem('languages')">+ Add Language</button></div>` : ''}
    <div class="skills-list">`;
  if (hasLang || isEditable) {
    data.languages.forEach((l, i) => {
      langHtml += `<span class="skill-chip">
        ${ce(`languages.${i}.language`, l.language, 'Language', isEditable)} - ${ce(`languages.${i}.proficiency`, l.proficiency, 'Proficiency', isEditable)}
        ${isEditable ? `<span style="cursor:pointer;margin-left:4px;color:rgba(255,255,255,0.5);" onclick="window.removeResumeItem('languages', '${l.id}')">&times;</span>` : ''}
      </span>`;
    });
  }
  langHtml += '</div></div>';

  let body = '';
  if (config.layout.startsWith('2col-left-main')) {
    body = `<div class="layout-2col"><div class="col-main">${headerHtml}${expHtml}${projHtml}</div><div class="col-side">${skillsHtml}${eduHtml}${certHtml}${langHtml}</div></div>`;
  } else if (config.layout.startsWith('2col-left-sidebar')) {
    body = `<div class="layout-2col"><div class="col-side">${headerHtml}${skillsHtml}${eduHtml}${langHtml}</div><div class="col-main">${expHtml}${projHtml}${certHtml}</div></div>`;
  } else if (config.layout.startsWith('2col-right-sidebar')) {
    body = `<div class="layout-2col"><div class="col-main">${headerHtml}${expHtml}${projHtml}${eduHtml}</div><div class="col-side">${skillsHtml}${certHtml}${langHtml}</div></div>`;
  } else {
    body = `<div class="layout-1col">${headerHtml}${expHtml}${eduHtml}${skillsHtml}${projHtml}${certHtml}${langHtml}</div>`;
  }

  return `<div class="resume-render ${config.id}">${styles}${body}</div>`;
}

// Expand to 30 templates
const templatesConfig = [
  { id: 'tpl-1', name: 'Modern Professional', category: 'Professional', colorPrimary: '#1e3a5f', colorAccent: '#ffffff', description: 'Clean 2-column, Navy + White', layout: '2col-left-main', font: 'sans' },
  { id: 'tpl-2', name: 'Creative Designer', category: 'Creative', colorPrimary: '#7c3aed', colorAccent: '#f97316', description: 'Bold left sidebar, Purple + Coral', layout: '2col-left-sidebar-bold', font: 'sans' },
  { id: 'tpl-3', name: 'Minimalist Elegant', category: 'Minimalist', colorPrimary: '#0f172a', colorAccent: '#ffffff', description: 'Single column, Black + White', layout: '1col', font: 'sans' },
  { id: 'tpl-4', name: 'Corporate Executive', category: 'Professional', colorPrimary: '#1e293b', colorAccent: '#d97706', description: 'Classic 2-col, Dark Blue + Gold', layout: '2col-right-sidebar', font: 'serif' },
  { id: 'tpl-5', name: 'Tech Developer', category: 'Tech', colorPrimary: '#0f172a', colorAccent: '#22c55e', description: 'Code-inspired monospace, Dark + Green', layout: '1col-terminal', font: 'mono' },
  { id: 'tpl-6', name: 'Fresh Graduate', category: 'Simple', colorPrimary: '#0d9488', colorAccent: '#f0fdfa', description: 'Simple clean, Teal + Light', layout: '2col-left-sidebar', font: 'sans' },
  { id: 'tpl-7', name: 'Academic Researcher', category: 'Academic', colorPrimary: '#7f1d1d', colorAccent: '#fef3c7', description: 'Formal serif, Burgundy + Cream', layout: '1col', font: 'serif' },
  { id: 'tpl-8', name: 'Marketing Pro', category: 'Creative', colorPrimary: '#ea580c', colorAccent: '#1e3a5f', description: 'Vibrant modern, Orange + Navy', layout: '2col-left-main', font: 'sans' },
  { id: 'tpl-9', name: 'Healthcare Worker', category: 'Professional', colorPrimary: '#2563eb', colorAccent: '#ffffff', description: 'Clean professional, Blue + White', layout: '1col', font: 'sans' },
  { id: 'tpl-10', name: 'Legal Professional', category: 'Professional', colorPrimary: '#374151', colorAccent: '#b45309', description: 'Traditional formal, Dark Gray + Gold', layout: '1col', font: 'serif' },
  { id: 'tpl-11', name: 'Finance Expert', category: 'Professional', colorPrimary: '#1e3a5f', colorAccent: '#94a3b8', description: 'Corporate sleek, Navy + Silver', layout: '2col-right-sidebar', font: 'sans' },
  { id: 'tpl-12', name: 'Startup Founder', category: 'Creative', colorPrimary: '#000000', colorAccent: '#3b82f6', description: 'Bold modern, Black + Electric Blue', layout: '2col-left-sidebar-bold', font: 'sans' },
  { id: 'tpl-13', name: 'UX/UI Designer', category: 'Creative', colorPrimary: '#ec4899', colorAccent: '#1e1e2e', description: 'Portfolio style, Pink + Dark', layout: '2col-left-main-dark', font: 'sans' },
  { id: 'tpl-14', name: 'Teacher/Educator', category: 'Education', colorPrimary: '#16a34a', colorAccent: '#fefce8', description: 'Warm friendly, Green + Cream', layout: '1col', font: 'serif' },
  { id: 'tpl-15', name: 'Engineering Pro', category: 'Tech', colorPrimary: '#475569', colorAccent: '#ffffff', description: 'Technical clean, Steel Blue + White', layout: '2col-left-main', font: 'sans' },
  { id: 'tpl-16', name: 'Sales Executive', category: 'Professional', colorPrimary: '#dc2626', colorAccent: '#0f172a', description: 'Dynamic, Red + Black', layout: '2col-right-sidebar', font: 'sans' },
  { id: 'tpl-17', name: 'Data Scientist', category: 'Tech', colorPrimary: '#4f46e5', colorAccent: '#ffffff', description: 'Analytical, Indigo + White', layout: '1col', font: 'sans' },
  { id: 'tpl-18', name: 'Freelancer', category: 'Creative', colorPrimary: '#f59e0b', colorAccent: '#1c1917', description: 'Creative personal, Amber + Dark', layout: '2col-left-sidebar-bold', font: 'sans' },
  { id: 'tpl-19', name: 'Government/PSU', category: 'Formal', colorPrimary: '#166534', colorAccent: '#ecfccb', description: 'Formal structured, Dark Green + Cream', layout: '1col', font: 'serif' },
  { id: 'tpl-20', name: 'Media/Journalist', category: 'Creative', colorPrimary: '#1f2937', colorAccent: '#ef4444', description: 'Editorial, Charcoal + Red', layout: '2col-left-main', font: 'serif' },
  { id: 'tpl-21', name: 'Simple Classic', category: 'Simple', colorPrimary: '#000000', colorAccent: '#ffffff', description: 'ATS-friendly plain text, Black + White', layout: '1col', font: 'sans' },
  // New Templates
  { id: 'tpl-22', name: 'Nordic Clean', category: 'Minimalist', colorPrimary: '#2e3440', colorAccent: '#88c0d0', description: 'Soft Nordic palette', layout: '2col-left-main', font: 'sans' },
  { id: 'tpl-23', name: 'Cyberpunk', category: 'Creative', colorPrimary: '#fcee0a', colorAccent: '#ff003c', description: 'High contrast yellow/red', layout: '2col-left-sidebar-bold', font: 'mono' },
  { id: 'tpl-24', name: 'Lawyer Classic', category: 'Formal', colorPrimary: '#0f172a', colorAccent: '#ffffff', description: 'Extreme formal serif', layout: '1col', font: 'serif' },
  { id: 'tpl-25', name: 'Medical Staff', category: 'Professional', colorPrimary: '#0284c7', colorAccent: '#e0f2fe', description: 'Clean blue & white', layout: '2col-right-sidebar', font: 'sans' },
  { id: 'tpl-26', name: 'Architect', category: 'Creative', colorPrimary: '#172554', colorAccent: '#bfdbfe', description: 'Structural bold fonts', layout: '2col-left-sidebar-bold', font: 'sans' },
  { id: 'tpl-27', name: 'Photographer', category: 'Creative', colorPrimary: '#000000', colorAccent: '#d4d4d8', description: 'Dark mode stylish', layout: '1col-terminal', font: 'sans' },
  { id: 'tpl-28', name: 'Software Engineer', category: 'Tech', colorPrimary: '#111827', colorAccent: '#f59e0b', description: 'Dark & Amber', layout: '2col-left-main', font: 'mono' },
  { id: 'tpl-29', name: 'Product Manager', category: 'Professional', colorPrimary: '#4338ca', colorAccent: '#eef2ff', description: 'Indigo & Light', layout: '2col-right-sidebar', font: 'sans' },
  { id: 'tpl-30', name: 'HR Executive', category: 'Professional', colorPrimary: '#be185d', colorAccent: '#fdf2f8', description: 'Pink & White friendly', layout: '2col-left-sidebar', font: 'sans' }
];

export const RESUME_TEMPLATES: ResumeTemplate[] = templatesConfig.map(t => ({
  id: t.id,
  name: t.name,
  category: t.category,
  colorPrimary: t.colorPrimary,
  colorAccent: t.colorAccent,
  description: t.description,
  layout: t.layout,
  font: t.font,
  render: (data: ResumeData, isEditable = true) => generateResumeHTML(data, t, isEditable)
}));
