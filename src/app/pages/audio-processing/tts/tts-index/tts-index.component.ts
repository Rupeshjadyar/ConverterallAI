import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TTS_LANGUAGES, TtsLanguage } from '../../../../data/tts-languages.data';

@Component({
  selector: 'app-tts-index',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tts-index.component.html',
  styleUrls: ['./tts-index.component.css']
})
export class TtsIndexComponent implements OnInit {
  allLanguages: TtsLanguage[] = TTS_LANGUAGES;
  filteredLanguages: TtsLanguage[] = TTS_LANGUAGES;
  
  searchQuery: string = '';
  selectedRegion: string = 'All';
  currentTheme: 'light' | 'dark' = 'light';

  regions: string[] = ['All', 'South Asia', 'Americas', 'Europe', 'Asia Pacific', 'Middle East & Africa'];

  private isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
      this.currentTheme = savedTheme;
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    this.filterLanguages();
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', this.currentTheme);
      document.documentElement.setAttribute('data-theme', this.currentTheme);
    }
  }

  onSearchChange(): void {
    this.filterLanguages();
  }

  selectRegion(region: string): void {
    this.selectedRegion = region;
    this.filterLanguages();
  }

  filterLanguages(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredLanguages = this.allLanguages.filter(lang => {
      const matchesSearch = !q || 
        lang.lang.toLowerCase().includes(q) || 
        lang.country.toLowerCase().includes(q) || 
        lang.code.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q);

      const matchesRegion = this.selectedRegion === 'All' || lang.region === this.selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }
}
