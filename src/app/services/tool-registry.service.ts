import { Injectable } from '@angular/core';
import { CATEGORIES_DATA, CategoryItem } from '../data/categories.data';
import { TOOLS_DATA, ToolItem } from '../data/tools.data';

@Injectable({
  providedIn: 'root'
})
export class ToolRegistryService {
  getCategories(): CategoryItem[] {
    return CATEGORIES_DATA.map(cat => ({
      ...cat,
      toolCount: this.getToolsByCategory(cat.id).length || cat.toolCount
    }));
  }

  getCategoryById(id: string): CategoryItem | undefined {
    return CATEGORIES_DATA.find(c => c.id === id);
  }

  getCategoryBySlug(slug: string): CategoryItem | undefined {
    const clean = slug.split('?')[0].split('#')[0].replace(/\/+$/, '');
    return CATEGORIES_DATA.find(c => c.slug.replace(/\/+$/, '') === clean);
  }

  getAllTools(): ToolItem[] {
    return TOOLS_DATA;
  }

  getToolBySlug(slug: string): ToolItem | undefined {
    const clean = slug.split('?')[0].split('#')[0].replace(/\/+$/, '');
    return TOOLS_DATA.find(t => t.slug.replace(/\/+$/, '') === clean);
  }

  getToolsByCategory(categoryId: string): ToolItem[] {
    return TOOLS_DATA.filter(t => t.categoryId === categoryId);
  }

  getTopToolsByCategory(categoryId: string, limit: number = 5): ToolItem[] {
    return this.getToolsByCategory(categoryId).slice(0, limit);
  }

  getPopularTools(): ToolItem[] {
    return TOOLS_DATA.filter(t => t.isPopular);
  }

  getLatestTools(): ToolItem[] {
    return TOOLS_DATA.filter(t => t.isLatest);
  }

  getAITools(): ToolItem[] {
    return TOOLS_DATA.filter(t => t.isAI);
  }

  searchTools(query: string): ToolItem[] {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    return TOOLS_DATA.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.shortDesc.toLowerCase().includes(q) ||
      t.categoryId.toLowerCase().includes(q)
    );
  }
}
