import { Component, ChangeDetectorRef, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { removeBackground as imglyRemoveBackground } from '@imgly/background-removal';

interface BatchFileItem {
  id: string;
  name: string;
  size: string;
  status: 'processing' | 'done' | 'error';
  progress: number;
  originalUrl: string;
  resultUrl: string | null;
}

import { ToolExecutionService } from '../../../services/tool-execution.service';

@Component({
  selector: 'app-bg-remover',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bg-remover.html',
  styleUrls: ['./bg-remover.css']
})
export class BgRemoverComponent {
  private toolExec = inject(ToolExecutionService);

  // Navigation & Menu
  activeMenu: string = 'remover';
  
  // Current Active File / Preview
  selectedFile: File | null = null;
  originalUrl = '';
  resultUrl: string | null = null;
  
  // Processing State
  isProcessing: boolean = false;
  progressMessage: string = '';
  processingProgress: number = 0;
  processingError = '';

  // Preview View Modes
  isSliderView: boolean = true;
  sliderPosition: number = 50; // 0 to 100%
  zoomLevel: number = 100;

  // Background Options (transparent | solid | gradient | ai | image)
  bgType: 'transparent' | 'solid' | 'gradient' | 'ai' | 'image' = 'transparent';
  customBgImageUrl: string | null = null;
  solidColor: string = '#ffffff';
  selectedGradient: string = 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)';
  gradientPresets: string[] = [
    'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #f9a8d4 0%, #f43f5e 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #312e81 100%)'
  ];

  // AI Background Replace
  aiPrompt: string = 'neon cyberpunk city rooftop, rainy night, moody';
  isGeneratingAiBg: boolean = false;

  // Enhancements
  autoShadow: boolean = true;
  relightSubject: boolean = true;
  edgeRefinement: boolean = true;

  // Magic Brush
  magicBrushMode: 'restore' | 'erase' = 'restore';
  brushSize: number = 24;

  // Export Settings
  exportResolution: string = '4K (3840×2160)';
  exportFormat: string = 'PNG • Transparent';
  exportQuality: number = 100;

  // Batch Files List
  batchFiles: BatchFileItem[] = [];
  activeBatchId: string = '';

  constructor(private cdr: ChangeDetectorRef) {
    // Set initial preview from first batch item
    if (this.batchFiles.length > 0) {
      this.originalUrl = this.batchFiles[0].originalUrl;
      this.resultUrl = this.batchFiles[0].resultUrl;
    }
  }

  ngOnInit() {
    const task = this.toolExec.pendingTask();
    if (task && task.toolId === 'bg-remover' && task.file) {
      this.handleFiles([task.file] as any);
      this.toolExec.clearTask();
      
    }
  }

  selectMenu(menu: string) {
    this.activeMenu = menu;
  }

  selectBatchItem(item: BatchFileItem) {
    this.activeBatchId = item.id;
    this.originalUrl = item.originalUrl;
    this.resultUrl = item.resultUrl;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFiles(input.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  handleFiles(files: FileList) {
    const file = files[0];
    if (!file || this.isProcessing) return;
    this.selectedFile = file;
    this.originalUrl = URL.createObjectURL(file);
    this.resultUrl = null;

    // Add to batch queue
    const newItem: BatchFileItem = {
      id: Date.now().toString(),
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'processing',
      progress: 0,
      originalUrl: this.originalUrl,
      resultUrl: null
    };
    this.batchFiles.unshift(newItem);
    this.activeBatchId = newItem.id;

    // Trigger AI background removal
    this.removeBackground(newItem);
  }

  private lastProgressUpdate: number = 0;

  async removeBackground(batchItem?: BatchFileItem) {
    const sourceUrl = batchItem?.originalUrl ?? this.originalUrl;
    if (!sourceUrl || this.isProcessing) return;

    this.isProcessing = true;
    this.processingError = '';
    this.progressMessage = 'Preparing the image…';
    this.processingProgress = 5;
    this.lastProgressUpdate = Date.now();
    this.cdr.detectChanges();

    // Yield to allow browser to render the initial loading overlay smoothly
    await new Promise(resolve => setTimeout(resolve, 60));

    try {
      const sourceResponse = await fetch(sourceUrl);
      if (!sourceResponse.ok) throw new Error('Could not read image');
      const source = await sourceResponse.blob();

      this.progressMessage = 'Loading the background removal model…';
      this.processingProgress = 15;
      this.cdr.detectChanges();

      const imageBlob = await imglyRemoveBackground(source, {
        model: 'isnet_quint8', // 'isnet_quint8' is the fast 8-bit quantized AI model (4x faster & super lightweight)
        output: {
          format: 'image/png',
          quality: 0.95
        },
        progress: (key: string, current: number, total: number) => {
          const now = Date.now();
          // Throttle UI change detection to max once every 150ms to prevent main-thread freeze!
          if (now - this.lastProgressUpdate < 150 && current < total) {
            return;
          }
          this.lastProgressUpdate = now;

          let pct = total > 0 ? Math.round((current / total) * 100) : 0;
          let displayMsg = 'Processing AI background removal...';

          if (key.includes('fetch') || key.includes('download')) {
            const currentMB = (current / (1024 * 1024)).toFixed(1);
            const totalMB = total > 0 ? (total / (1024 * 1024)).toFixed(1) : '15.0';
            pct = total > 0 ? Math.min(Math.max(pct, 15), 55) : 35;
            displayMsg = `📥 Downloading AI Neural Model: ${currentMB} MB / ${totalMB} MB (${pct}%)`;
          } else if (key.includes('compute:inference') || key.includes('inference')) {
            pct = total > 0 ? 55 + Math.round((current / total) * 25) : 70;
            displayMsg = `🧠 Running AI Neural Inference (${pct}%)`;
          } else if (key.includes('compute:decode') || key.includes('decode') || key.includes('encode')) {
            pct = total > 0 ? 80 + Math.round((current / total) * 18) : 90;
            displayMsg = `✨ Refining Hair & Edge Masking (${pct}%)`;
          } else {
            pct = Math.min(Math.max(pct, 20), 95);
            displayMsg = `⚡ Processing: ${key.replace(/[_:]/g, ' ')} (${pct}%)`;
          }

          this.processingProgress = pct;
          this.progressMessage = displayMsg;
          if (batchItem) {
            batchItem.progress = pct;
          }
          this.cdr.detectChanges();
        }
      });

      const resultUrl = URL.createObjectURL(imageBlob);
      this.resultUrl = resultUrl;
      this.processingProgress = 100;
      this.progressMessage = 'Background removed';

      if (batchItem) {
        batchItem.resultUrl = resultUrl;
        batchItem.status = 'done';
        batchItem.progress = 100;
      } else {
        const activeItem = this.batchFiles.find(f => f.id === this.activeBatchId);
        if (activeItem) {
          activeItem.resultUrl = resultUrl;
          activeItem.status = 'done';
          activeItem.progress = 100;
        }
      }
    } catch {
      this.processingError = 'Background removal could not finish. Check your connection and try Remove Background again.';
      const item = batchItem ?? this.batchFiles.find(file => file.id === this.activeBatchId);
      if (item) item.status = 'error';
    } finally {
      this.isProcessing = false;
      this.cdr.detectChanges();
    }
  }

  // Helper method to downscale huge images to max 2048px before AI inference so the browser never hangs
  private async optimizeImageForAI(blob: Blob | File, maxDimension: number): Promise<Blob> {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        let width = img.width;
        let height = img.height;

        if (width <= maxDimension && height <= maxDimension) {
          resolve(blob);
          return;
        }

        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(blob);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((optimizedBlob) => {
          resolve(optimizedBlob || blob);
        }, 'image/png', 0.95);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(blob);
      };
      img.src = url;
    });
  }

  setBgType(type: 'transparent' | 'solid' | 'gradient' | 'ai' | 'image') {
    this.bgType = type;
  }

  onCustomBgSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.customBgImageUrl = URL.createObjectURL(file);
      this.bgType = 'image';
    }
  }

  getBackgroundStyle(): string {
    if (this.bgType === 'solid') return this.solidColor;
    if (this.bgType === 'gradient') return this.selectedGradient;
    if (this.bgType === 'image' && this.customBgImageUrl) return `url(${this.customBgImageUrl}) center/cover no-repeat`;
    return '';
  }

  selectGradient(gradient: string) {
    this.bgType = 'gradient';
    this.selectedGradient = gradient;
  }

  async generateAiBackground() {
    if (!this.aiPrompt) return;
    this.isGeneratingAiBg = true;
    this.bgType = 'ai';
    this.cdr.detectChanges();

    // Simulate rapid neural background synth
    setTimeout(() => {
      this.isGeneratingAiBg = false;
      this.selectedGradient = 'linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #312e81 100%)';
      this.cdr.detectChanges();
    }, 1500);
  }

  onSliderChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.sliderPosition = Number(input.value);
  }

  async downloadImage() {
    const rawUrl = this.resultUrl || this.originalUrl;
    if (!rawUrl) return;

    if (this.bgType === 'transparent') {
      const link = document.createElement('a');
      link.href = rawUrl;
      link.download = `ConverterAll_4K_NoBg_${Date.now()}.png`;
      link.click();
      return;
    }

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = rawUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (this.bgType === 'solid') {
        ctx.fillStyle = this.solidColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (this.bgType === 'gradient' || this.bgType === 'ai') {
        const colors = (this.selectedGradient || '').match(/#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)/g);
        if (colors && colors.length >= 2) {
          const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          colors.forEach((color, idx) => {
            grad.addColorStop(idx / (colors.length - 1), color);
          });
          ctx.fillStyle = grad;
        } else {
          ctx.fillStyle = '#06b6d4';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (this.bgType === 'image' && this.customBgImageUrl) {
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        await new Promise<void>((res) => {
          bgImg.onload = () => res();
          bgImg.onerror = () => res();
          bgImg.src = this.customBgImageUrl!;
        });
        if (bgImg.width) {
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        }
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compositeUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = compositeUrl;
      link.download = `ConverterAll_4K_Composite_${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Error compositing background on download:', err);
      const link = document.createElement('a');
      link.href = rawUrl;
      link.download = `ConverterAll_4K_NoBg_${Date.now()}.png`;
      link.click();
    }
  }

  downloadAllBatch() {
    this.batchFiles.forEach((item, index) => {
      if (item.resultUrl || item.originalUrl) {
        setTimeout(() => {
          const link = document.createElement('a');
          link.href = item.resultUrl || item.originalUrl;
          link.download = `ConverterAll_4K_Batch_${item.name || index}.png`;
          link.click();
        }, index * 400);
      }
    });
  }
}
