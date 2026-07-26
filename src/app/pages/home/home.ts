import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToolRegistryService } from '../../services/tool-registry.service';
import { CategoryItem } from '../../data/categories.data';
import { ToolItem } from '../../data/tools.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private registry = inject(ToolRegistryService);

  searchQuery: string = '';
  activeCategory: string = 'all';

  categories: CategoryItem[] = this.registry.getCategories();
  popularTools: ToolItem[] = this.registry.getPopularTools();
  aiTools: ToolItem[] = this.registry.getAITools();

  pdfTools: ToolItem[] = this.registry.getTopToolsByCategory('pdf-tools', 6);
  imageTools: ToolItem[] = this.registry.getTopToolsByCategory('image-tools', 6);
  audioTools: ToolItem[] = this.registry.getTopToolsByCategory('audio-tools', 6);
  calcTools: ToolItem[] = this.registry.getTopToolsByCategory('calculators', 6);

  stats = [
    { value: '500+', label: 'Target Tools & Utilities' },
    { value: '100%', label: 'In-Browser Client Privacy' },
    { value: '0.1s', label: 'WASM Processing Latency' },
    { value: 'Free', label: 'No Signup Barriers' }
  ];

  features = [
    { icon: '🛡️', title: '100% Local Browser Privacy', desc: 'Documents and photos are processed in your browser memory via WebAssembly. Zero upload risk.' },
    { icon: '⚡', title: 'WebAssembly & WebGPU Speed', desc: 'Experience native app speed directly in Chrome, Safari, and Firefox without lag.' },
    { icon: '🧩', title: 'Dynamic Modular Architecture', desc: 'Built on Angular Standalone architecture supporting 500+ tools with zero UI clutter.' },
    { icon: '🎙️', title: 'Studio AI Speech Narration', desc: 'Convert text to natural voice narration with precise rate and pitch controls.' },
    { icon: '🌐', title: 'Responsive 320px to 4K', desc: 'Flawless mobile-first grid design on every device from iPhone SE to ultra-wide displays.' },
    { icon: '🎨', title: '3 Enterprise SaaS Themes', desc: 'Choose between Modern Light, Modern Dark, or Automatic System Theme sync.' }
  ];

  faqs = [
    { q: 'Are my files uploaded to any external server?', a: 'No! ConverterallAI runs 100% locally using client-side JavaScript, WebAssembly, and PDF-Lib so your documents stay in your browser memory.', open: false },
    { q: 'Is ConverterallAI free for commercial use?', a: 'Yes! All tools including PDF manipulation, AI background removal, speech synthesis, and financial calculators are free.', open: false },
    { q: 'How does the architecture support 500+ tools?', a: 'We use a centralized dynamic data registry. Adding new tools requires only adding a single data entry without changing any component templates.', open: false },
    { q: 'Does ConverterallAI work offline or on mobile devices?', a: 'Yes! Once loaded, the web app functions as a fast PWA on Android, iOS, and desktop browsers.', open: false }
  ];

  get searchResults(): ToolItem[] {
    return this.registry.searchTools(this.searchQuery);
  }
}