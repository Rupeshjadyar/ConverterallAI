import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToolItem } from '../../data/tools.data';
import { ToolRegistryService } from '../../services/tool-registry.service';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-tool-seo-content',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './tool-seo-content.component.html',
  styleUrls: ['./tool-seo-content.component.css']
})
export class ToolSeoContentComponent implements OnInit {
  @Input() tool?: ToolItem;
  @Input() showH1: boolean = false;

  private router = inject(Router);
  private toolRegistry = inject(ToolRegistryService);

  get currentTool(): ToolItem | undefined {
    if (this.tool) return this.tool;
    const cleanPath = this.router.url.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
    return this.toolRegistry.getToolBySlug(cleanPath);
  }

  get relatedTools(): ToolItem[] {
    const t = this.currentTool;
    if (!t || !t.relatedToolPaths || t.relatedToolPaths.length === 0) return [];
    return t.relatedToolPaths
      .map(p => this.toolRegistry.getToolBySlug(p))
      .filter((item): item is ToolItem => !!item);
  }

  ngOnInit() {}
}
