import { Component, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ALL_RICH_CSS_CHAPTERS, ALL_RICH_CSS_TOPICS } from '../rich-css.data';
import { RichTutorialChapter, W3TopicItem, TutorialSubSection } from '../rich-tutorial.models';

@Component({
  selector: 'app-css-tutorial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './css-tutorial.component.html',
  styleUrls: ['./css-tutorial.component.css']
})
export class CssTutorialComponent {
  private platformId = inject(PLATFORM_ID);

  chapters: RichTutorialChapter[] = ALL_RICH_CSS_CHAPTERS;
  topicsList: W3TopicItem[] = ALL_RICH_CSS_TOPICS;
  activeTopicId = signal<string>('css-home');
  expandedTopicId = signal<string>('css-home');
  activePlaygroundCode = signal<string | null>(null);
  editableCode: string = '';

  activeChapter = computed<RichTutorialChapter>(() => {
    const cur = this.topicsList.find(t => t.id === this.activeTopicId());
    const refId = cur ? cur.chapterRefId : 'css-intro';
    return this.chapters.find(c => c.id === refId) || this.chapters[0];
  });

  currentChapterIndex = computed(() => {
    return this.chapters.findIndex(c => c.id === this.activeChapter().id);
  });

  selectTopic(item: W3TopicItem) {
    if (this.activeTopicId() === item.id) {
      this.expandedTopicId.set(this.expandedTopicId() === item.id ? '' : item.id);
    } else {
      this.activeTopicId.set(item.id);
      this.expandedTopicId.set(item.id);
      this.activePlaygroundCode.set(null);
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  toggleSubmenu(item: W3TopicItem, event: Event): void {
    event.stopPropagation();
    if (this.activeTopicId() !== item.id) {
      this.selectTopic(item);
    } else {
      this.expandedTopicId.set(this.expandedTopicId() === item.id ? '' : item.id);
    }
  }

  getSectionsForChapter(chapterRefId: string): TutorialSubSection[] {
    const chapter = this.chapters.find(c => c.id === chapterRefId);
    return chapter?.sections || [];
  }

  scrollToElement(elementId: string, event?: Event): void {
    if (event) event.stopPropagation();
    if (isPlatformBrowser(this.platformId)) {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  nextChapter() {
    const idx = this.currentChapterIndex();
    if (idx < this.chapters.length - 1) {
      const next = this.chapters[idx + 1];
      const match = this.topicsList.find(t => t.chapterRefId === next.id);
      if (match) this.selectTopic(match);
    }
  }

  prevChapter() {
    const idx = this.currentChapterIndex();
    if (idx > 0) {
      const prev = this.chapters[idx - 1];
      const match = this.topicsList.find(t => t.chapterRefId === prev.id);
      if (match) this.selectTopic(match);
    }
  }

  openRunner(code?: string) {
    this.editableCode = code || "";
    this.activePlaygroundCode.set(code || "");
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const el = document.getElementById('liveRunnerStage');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }

  closeRunner() {
    this.activePlaygroundCode.set(null);
  }

  refreshPreview() {
    const current = this.editableCode;
    this.editableCode = '';
    setTimeout(() => { this.editableCode = current; }, 50);
  }
}
