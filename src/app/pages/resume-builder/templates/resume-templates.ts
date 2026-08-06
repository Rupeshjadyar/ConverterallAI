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
  render: (data: ResumeData) => string;
}

function esc(s: string): string {
  if (!s) return '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function generateResumeHTML(data: ResumeData, config: { id: string; colorPrimary: string; colorAccent: string; layout: string; font: string }): string {
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

  const isDark = config.layout === '1col-terminal' || config.layout === '2col-left-main-dark';
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

  const styles = '<style>' +
    '.' + config.id + ' { font-family: ' + fontFam + '; width: 794px; min-height: 1123px; margin: 0 auto; background: ' + bg + '; color: ' + textCol + '; box-sizing: border-box; line-height: 1.5; font-size: 14px; position: relative; }' +
    '.' + config.id + ' * { box-sizing: border-box; }' +
    '.' + config.id + ' h1 { font-size: 28px; color: ' + terminalH + '; margin: 0 0 8px 0; }' +
    '.' + config.id + ' h2 { font-size: 18px; color: ' + terminalH + '; border-bottom: 2px solid ' + terminalH + '; padding-bottom: 5px; margin: 18px 0 10px 0; text-transform: uppercase; letter-spacing: 1px; }' +
    '.' + config.id + ' .contact-info { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 15px; font-size: 12px; }' +
    '.' + config.id + ' .section { margin-bottom: 16px; }' +
    '.' + config.id + ' .item { margin-bottom: 12px; }' +
    '.' + config.id + ' .item-header { display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 3px; font-size: 14px; }' +
    '.' + config.id + ' .item-sub { font-style: italic; color: ' + terminalSub + '; margin-bottom: 4px; font-size: 13px; }' +
    '.' + config.id + ' .item-desc { font-size: 13px; line-height: 1.5; white-space: pre-line; }' +
    '.' + config.id + ' .skills-list { display: flex; flex-wrap: wrap; gap: 6px; }' +
    '.' + config.id + ' .skill-chip { background: ' + chipBg + '; color: ' + chipColor + '; padding: 3px 10px; border-radius: 4px; font-size: 12px; border: ' + chipBorder + '; }' +
    '.' + config.id + ' .layout-2col { display: flex; width: 100%; min-height: 1123px; }' +
    '.' + config.id + ' .col-main { flex: 2; padding: 35px; }' +
    '.' + config.id + ' .col-side { flex: 1; padding: 35px; background: ' + sideBg + '; color: ' + sideColor + '; }' +
    '.' + config.id + ' .col-side h2 { color: ' + sideH2 + '; border-color: ' + sideH2 + '; }' +
    '.' + config.id + ' .col-side .skill-chip { background: ' + sideChipBg + '; }' +
    '.' + config.id + ' .col-side .item-sub { color: ' + sideSub + '; }' +
    '.' + config.id + ' .layout-1col { padding: 35px; }' +
    '.' + config.id + ' .summary { font-size: 13px; line-height: 1.6; margin-bottom: 10px; color: ' + (isDark ? textCol : '#444') + '; }' +
    '</style>';

  // Render functions
  const contactParts: string[] = [];
  if (p.email) contactParts.push('<span>\u2709 ' + esc(p.email) + '</span>');
  if (p.phone) contactParts.push('<span>\u260E ' + esc(p.phone) + '</span>');
  if (p.location) contactParts.push('<span>\uD83D\uDCCD ' + esc(p.location) + '</span>');
  if (p.linkedin) contactParts.push('<span>in/ ' + esc(p.linkedin) + '</span>');
  if (p.portfolio) contactParts.push('<span>\uD83C\uDF10 ' + esc(p.portfolio) + '</span>');

  const headerHtml = '<div class="header section">' +
    '<h1>' + esc(p.fullName || '') + '</h1>' +
    '<div class="contact-info">' + contactParts.join('') + '</div>' +
    (data.summary ? '<div class="summary">' + esc(data.summary) + '</div>' : '') +
    '</div>';

  let expHtml = '';
  if (hasExp) {
    expHtml = '<div class="section"><h2>Experience</h2>';
    for (const e of data.experience) {
      const dates = e.startDate + (e.current ? ' - Present' : (e.endDate ? ' - ' + e.endDate : ''));
      expHtml += '<div class="item">' +
        '<div class="item-header"><span>' + esc(e.role) + '</span><span>' + esc(dates) + '</span></div>' +
        '<div class="item-sub">' + esc(e.company) + '</div>' +
        (e.description ? '<div class="item-desc">' + esc(e.description) + '</div>' : '') +
        '</div>';
    }
    expHtml += '</div>';
  }

  let eduHtml = '';
  if (hasEdu) {
    eduHtml = '<div class="section"><h2>Education</h2>';
    for (const e of data.education) {
      eduHtml += '<div class="item">' +
        '<div class="item-header"><span>' + esc(e.degree) + (e.field ? ' in ' + esc(e.field) : '') + '</span><span>' + esc(e.year) + '</span></div>' +
        '<div class="item-sub">' + esc(e.institute) + (e.grade ? ' | ' + esc(e.grade) : '') + '</div>' +
        '</div>';
    }
    eduHtml += '</div>';
  }

  let skillsHtml = '';
  if (hasSkills) {
    skillsHtml = '<div class="section"><h2>Skills</h2><div class="skills-list">' +
      data.skills.map(s => '<span class="skill-chip">' + esc(s) + '</span>').join('') +
      '</div></div>';
  }

  let projHtml = '';
  if (hasProj) {
    projHtml = '<div class="section"><h2>Projects</h2>';
    for (const pr of data.projects) {
      projHtml += '<div class="item">' +
        '<div class="item-header"><span>' + esc(pr.title) + '</span></div>' +
        (pr.techStack ? '<div class="item-sub">' + esc(pr.techStack) + '</div>' : '') +
        (pr.description ? '<div class="item-desc">' + esc(pr.description) + '</div>' : '') +
        (pr.link ? '<div style="font-size:12px;margin-top:3px;"><a href="' + esc(pr.link) + '" style="color:' + terminalH + ';">' + esc(pr.link) + '</a></div>' : '') +
        '</div>';
    }
    projHtml += '</div>';
  }

  let certHtml = '';
  if (hasCert) {
    certHtml = '<div class="section"><h2>Certifications</h2>';
    for (const c of data.certifications) {
      certHtml += '<div class="item">' +
        '<div class="item-header"><span>' + esc(c.name) + '</span><span>' + esc(c.year) + '</span></div>' +
        '<div class="item-sub">' + esc(c.issuer) + '</div>' +
        '</div>';
    }
    certHtml += '</div>';
  }

  let langHtml = '';
  if (hasLang) {
    langHtml = '<div class="section"><h2>Languages</h2><div class="skills-list">' +
      data.languages.map(l => '<span class="skill-chip">' + esc(l.language) + ' (' + esc(l.proficiency) + ')</span>').join('') +
      '</div></div>';
  }

  // Assemble based on layout
  let body = '';
  if (config.layout.startsWith('2col-left-main')) {
    body = '<div class="layout-2col">' +
      '<div class="col-main">' + headerHtml + expHtml + projHtml + '</div>' +
      '<div class="col-side">' + skillsHtml + eduHtml + certHtml + langHtml + '</div>' +
      '</div>';
  } else if (config.layout.startsWith('2col-left-sidebar')) {
    body = '<div class="layout-2col">' +
      '<div class="col-side">' + headerHtml + skillsHtml + eduHtml + langHtml + '</div>' +
      '<div class="col-main">' + expHtml + projHtml + certHtml + '</div>' +
      '</div>';
  } else if (config.layout.startsWith('2col-right-sidebar')) {
    body = '<div class="layout-2col">' +
      '<div class="col-main">' + headerHtml + expHtml + projHtml + eduHtml + '</div>' +
      '<div class="col-side">' + skillsHtml + certHtml + langHtml + '</div>' +
      '</div>';
  } else {
    body = '<div class="layout-1col">' + headerHtml + expHtml + eduHtml + skillsHtml + projHtml + certHtml + langHtml + '</div>';
  }

  return '<div class="resume-render ' + config.id + '">' + styles + body + '</div>';
}

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
  { id: 'tpl-21', name: 'Simple Classic', category: 'Simple', colorPrimary: '#000000', colorAccent: '#ffffff', description: 'ATS-friendly plain text, Black + White', layout: '1col', font: 'sans' }
];

export const RESUME_TEMPLATES: ResumeTemplate[] = templatesConfig.map(t => ({
  id: t.id,
  name: t.name,
  category: t.category,
  colorPrimary: t.colorPrimary,
  colorAccent: t.colorAccent,
  description: t.description,
  render: (data: ResumeData) => generateResumeHTML(data, t)
}));
