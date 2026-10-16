import fs from 'fs';
import path from 'path';
import { validateAndFormat } from './tools-data-validator.mjs';
import { calculatorTools } from './data/calculators.tools.mjs';
import { imageTools } from './data/images.tools.mjs';
import { audioTools } from './data/audio.tools.mjs';
import { gameTools } from './data/games.tools.mjs';
import { pdfTools } from './data/pdf.tools.mjs';
import { devTools } from './data/dev.tools.mjs';

const allTools = [
  ...calculatorTools,
  ...imageTools,
  ...audioTools,
  ...gameTools,
  ...pdfTools,
  ...devTools
];

// Validate all constraints
validateAndFormat(allTools);

// Generate src/app/data/tools.data.ts
const tsContent = `export interface ToolFaq {
  q: string;
  a: string;
}

export interface ToolItem {
  id: string;
  name: string;
  slug: string; // Route path
  categoryId: 'games' | 'pdf-tools' | 'image-tools' | 'audio-tools' | 'calculators' | 'converters' | 'developer-tools' | 'resume-tools';
  shortDesc: string;
  fullDesc: string;
  icon: string;
  badge?: 'NEW' | 'PRO' | 'AI' | 'FREE' | 'POPULAR' | '3D FPS' | 'HOT' | 'ALL-IN-1';
  isPopular?: boolean;
  isLatest?: boolean;
  isAI?: boolean;

  // SEO fields
  seoTitle: string;
  seoDescription: string;
  keywords: string;
  h1: string;
  intro: string;
  howToSteps: string[];
  features: string[];
  faqs: ToolFaq[];
  relatedToolPaths: string[];
  privacyNote?: string;
}

export const TOOLS_DATA: ToolItem[] = ${JSON.stringify(allTools, null, 2)};
`;

fs.writeFileSync('src/app/data/tools.data.ts', tsContent, 'utf8');
console.log(`Successfully generated src/app/data/tools.data.ts with ${allTools.length} verified tools!`);
