import { Injectable } from '@angular/core';
import { CATEGORIES_DATA, CategoryItem } from '../data/categories.data';
import { TOOLS_DATA, ToolItem } from '../data/tools.data';

@Injectable({
  providedIn: 'root'
})
export class ToolRegistryService {
  getCategories(): CategoryItem[] {
    return CATEGORIES_DATA;
  }

  getCategoryById(id: string): CategoryItem | undefined {
    return CATEGORIES_DATA.find(c => c.id === id);
  }

  getAllTools(): ToolItem[] {
    return TOOLS_DATA;
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
