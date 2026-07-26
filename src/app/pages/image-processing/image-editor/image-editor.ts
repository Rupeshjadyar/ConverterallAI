import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

interface TextOverlay {
  id: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  color: string;
  fontSize: number;
  fontFamily: string;
}

interface DrawStroke {
  mode: 'paint' | 'erase' | 'blur';
  color: string;
  width: number;
  opacity: number;
  points: { x: number; y: number }[];
}

interface ImageOverlayItem {
  id: string;
  image: HTMLImageElement;
  name: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  scale: number; // percentage 10-200
  opacity: number; // percentage 0-100
  blendMode: any;
}

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-editor.html',
  styleUrls: ['./image-editor.css']
})
export class ImageEditorComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  image: HTMLImageElement = (typeof window !== 'undefined' && typeof Image !== 'undefined') ? new Image() : ({} as any);
  
  selectedFile: File | null = null;
  
  // Left Sidebar Tools
  activeTool: 'crop' | 'adjust' | 'filters' | 'ai' | 'paint' | 'healing' | 'text' | 'overlay' | 'border' = 'crop';
  
  // Draggable Floating Studio Popup State (Exact Reference UI)
  showFloatingPopup: boolean = false;
  popupX: number = 260; // Initial X position right next to TOOLS sidebar
  popupY: number = 130; // Initial Y position
  private isDraggingPopup: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;

  // Right Panel Category Tabs or All Scrollable
  rightSection: 'adjustments' | 'layers' = 'adjustments';
  
  // Quick Presets / AI
  activePreset: string = 'normal';
  aiEnhanceActive: boolean = false;
  
  // Canvas View Controls
  zoomLevel: number = 100;
  ruleOfThirds: boolean = true;
  comparePosition: number = 100; // 100 = full edited, 0 = full original
  isComparing: boolean = false;
  aspectRatio: string = 'Freeform';
  
  // LIGHT Adjustments
  brightness = 100; // Exposure equivalent
  contrast = 100;
  highlights = 0;
  shadows = 0;
  whites = 0;
  blacks = 0;
  
  // COLOR Adjustments
  saturation = 100;
  vibrance = 0;
  temperature = 0; // -100 (cool/5000K) to +100 (warm/6500K)
  hue = 0; // Tint
  
  // DETAIL Adjustments
  sharpness = 0;
  clarity = 0;
  blur = 0;
  
  // Filters & Effects
  grayscale = 0;
  sepia = 0;
  invert = 0;
  
  // Transforms
  rotation = 0;
  fineRotation = 0;
  flipH = false;
  flipV = false;

  // Painting / Drawing & Erasing
  isDrawMode = false;
  brushMode: 'paint' | 'erase' | 'blur' = 'paint';
  brushColor = '#06b6d4'; // Cyan default
  brushWidth = 12;
  brushOpacity = 100; // 10-100%
  strokes: DrawStroke[] = [];
  currentStroke: DrawStroke | null = null;
  private isDrawingNow = false;
  colorSwatches = ['#06b6d4', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#ffffff', '#000000'];

  // Text Overlays & Photo Overlays
  textOverlays: TextOverlay[] = [];
  imageOverlays: ImageOverlayItem[] = [];
  newText = '';
  newTextColor = '#ffffff';
  newTextSize = 36;
  newTextFont = 'Arial';

  // Decorations / Borders / Watermark
  watermarkText = '';
  watermarkPos: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center' = 'bottom-right';
  watermarkOpacity = 80;
  borderWidth = 0;
  borderColor = '#06b6d4';
  roundCorners = 0;
  
  // Export
  exportFormat = 'image/jpeg';
  exportQuality = 95;
  fileName = 'converterall-studio';

  constructor(
    private title: Title,
    private meta: Meta,
    private cdr: ChangeDetectorRef
  ) {
    this.title.setTitle('ConverterAll AI Studio Pro - Free Browser Photo & Color Editor');
    this.meta.updateTag({ name: 'description', content: 'Professional desktop-grade browser photo studio. RAW/Image color grading, AI enhance, exposure curves, vector drawing, and layers locally.' });
    if (typeof window !== 'undefined' && typeof Image !== 'undefined' && (!this.image || !this.image.onload)) {
      this.image = new Image();
    }
  }

  ngAfterViewInit() {
    if (this.canvasRef) {
      this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (!this.image || typeof this.image.onload === 'undefined') {
        this.image = new Image();
      }
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name.split('.')[0] || 'edited-image';
      this.strokes = [];
      this.textOverlays = [];
      this.currentStroke = null;
      this.zoomLevel = 100;
      this.resetAll();
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.image.onload = () => {
          this.cdr.detectChanges();
          this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
          this.applyChanges();
        };
        this.image.src = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  selectTool(tool: 'crop' | 'adjust' | 'filters' | 'ai' | 'paint' | 'healing' | 'text' | 'overlay' | 'border') {
    this.activeTool = tool;
    this.showFloatingPopup = true; // Open the sleek floating tool popup ("kuch aise popup open chona chahiye")
    
    if (tool === 'paint' || tool === 'healing') {
      this.isDrawMode = true;
      if (tool === 'healing') {
        this.brushMode = 'erase';
      } else {
        this.brushMode = 'paint';
      }
    } else {
      this.isDrawMode = false;
    }
    if (tool === 'ai') {
      this.applyAIEnhance();
    }
    if (tool === 'crop') {
      this.ruleOfThirds = true;
    }
  }

  // Floating Popup Dragging Methods ("or use mvo kam jad")
  startDragPopup(event: MouseEvent) {
    this.isDraggingPopup = true;
    this.dragStartX = event.clientX - this.popupX;
    this.dragStartY = event.clientY - this.popupY;
    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  onDocumentMouseMove(event: MouseEvent) {
    if (this.isDraggingPopup) {
      this.popupX = Math.max(10, Math.min(window.innerWidth - 360, event.clientX - this.dragStartX));
      this.popupY = Math.max(70, Math.min(window.innerHeight - 300, event.clientY - this.dragStartY));
    }
  }

  @HostListener('document:mouseup')
  stopDragPopup() {
    this.isDraggingPopup = false;
  }

  closeFloatingPopup() {
    this.showFloatingPopup = false;
  }

  onOverlaySelected(event: any) {
    const file = event.target.files[0];
    if (file && typeof window !== 'undefined' && typeof Image !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          this.imageOverlays.push({
            id: Date.now().toString(),
            image: img,
            name: file.name,
            x: 50,
            y: 50,
            scale: 40,
            opacity: 100,
            blendMode: 'source-over'
          });
          this.activeTool = 'overlay';
          this.showFloatingPopup = true;
          this.applyChanges();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteImageOverlay(id: string) {
    this.imageOverlays = this.imageOverlays.filter(item => item.id !== id);
    this.applyChanges();
  }

  applyAIEnhance() {
    this.aiEnhanceActive = !this.aiEnhanceActive;
    if (this.aiEnhanceActive) {
      this.brightness = 108;
      this.contrast = 124;
      this.saturation = 118;
      this.vibrance = 15;
      this.sharpness = 28;
      this.highlights = -18;
      this.shadows = 20;
      this.temperature = 12;
      this.activePreset = 'ai-enhance';
    } else {
      this.resetAll();
    }
    this.applyChanges();
  }

  applyPreset(preset: string) {
    this.activePreset = preset;
    this.aiEnhanceActive = false;
    switch (preset) {
      case 'normal':
        this.resetAll();
        return;
      case 'vivid':
        this.brightness = 106; this.contrast = 128; this.saturation = 145;
        this.sharpness = 22; this.hue = 0; this.blur = 0;
        this.grayscale = 0; this.sepia = 0; this.invert = 0;
        this.temperature = 5;
        break;
      case 'cinema':
        this.brightness = 96; this.contrast = 138; this.saturation = 88;
        this.sharpness = 18; this.hue = 8; this.blur = 0;
        this.grayscale = 0; this.sepia = 12; this.invert = 0;
        this.temperature = -10;
        break;
      case 'vintage':
        this.brightness = 110; this.contrast = 92; this.saturation = 75;
        this.sharpness = 0; this.hue = 0; this.blur = 0;
        this.grayscale = 0; this.sepia = 45; this.invert = 0;
        this.temperature = 25;
        break;
      case 'cyberpunk':
        this.brightness = 112; this.contrast = 142; this.saturation = 175;
        this.sharpness = 32; this.hue = 170; this.blur = 0;
        this.grayscale = 0; this.sepia = 0; this.invert = 0;
        this.temperature = -20;
        break;
      case 'bw':
        this.brightness = 105; this.contrast = 132; this.saturation = 0;
        this.sharpness = 16; this.hue = 0; this.blur = 0;
        this.grayscale = 100; this.sepia = 0; this.invert = 0;
        break;
      case 'warm':
        this.brightness = 103; this.contrast = 108; this.saturation = 120;
        this.sharpness = 0; this.hue = 345; this.blur = 0;
        this.grayscale = 0; this.sepia = 20; this.invert = 0;
        this.temperature = 35;
        break;
      case 'cool':
        this.brightness = 102; this.contrast = 112; this.saturation = 110;
        this.sharpness = 12; this.hue = 25; this.blur = 0;
        this.grayscale = 0; this.sepia = 0; this.invert = 0;
        this.temperature = -30;
        break;
    }
    this.applyChanges();
  }

  applyChanges() {
    if (!this.selectedFile || !this.canvasRef || !this.image || !this.image.width) return;

    const canvas = this.canvasRef.nativeElement;
    const totalRotation = (this.rotation + this.fineRotation) % 360;
    
    // Swap dimensions if rotated 90 or 270 degrees approx
    if (Math.abs(this.rotation % 180) === 90) {
      canvas.width = this.image.height + (this.borderWidth * 2);
      canvas.height = this.image.width + (this.borderWidth * 2);
    } else {
      canvas.width = this.image.width + (this.borderWidth * 2);
      canvas.height = this.image.height + (this.borderWidth * 2);
    }

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // If in compare position 0 (Full original) or hold comparing, draw original
    if (this.comparePosition === 0 || this.isComparing) {
      this.ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
      return;
    }

    // Combine exposure, temperature, and vibrance into CSS filters
    const finalBrightness = Math.max(0, this.brightness + (this.highlights / 3) + (this.whites / 3));
    const finalContrast = Math.max(0, this.contrast + (this.shadows / 3) + (this.blacks / 3) + (this.clarity / 2));
    const finalSaturation = Math.max(0, this.saturation + (this.vibrance / 2));
    const finalSepia = Math.max(0, this.sepia + (this.temperature > 0 ? this.temperature * 0.4 : 0));
    const finalHue = (this.hue + (this.temperature < 0 ? Math.abs(this.temperature) * 0.3 : 0)) % 360;

    this.ctx.filter = `
      brightness(${finalBrightness}%) 
      contrast(${finalContrast}%) 
      saturate(${finalSaturation}%) 
      hue-rotate(${finalHue}deg)
      blur(${this.blur}px) 
      grayscale(${this.grayscale}%) 
      sepia(${finalSepia}%) 
      invert(${this.invert}%)
    `;

    this.ctx.save();
    
    // Move to center to apply rotation/flip
    this.ctx.translate(canvas.width / 2, canvas.height / 2);
    this.ctx.rotate(totalRotation * Math.PI / 180);
    this.ctx.scale(this.flipH ? -1 : 1, this.flipV ? -1 : 1);

    // Draw base Image
    this.ctx.drawImage(
      this.image, 
      -this.image.width / 2, 
      -this.image.height / 2
    );

    this.ctx.restore();
    this.ctx.filter = 'none'; // reset filters for vector drawing layers

    // Draw Photo / Logo Overlays
    this.imageOverlays.forEach(item => {
      if (!item.image || !item.image.width) return;
      this.ctx.save();
      this.ctx.globalAlpha = item.opacity / 100;
      this.ctx.globalCompositeOperation = item.blendMode;
      const w = (item.image.width * (item.scale / 100));
      const h = (item.image.height * (item.scale / 100));
      const posX = (canvas.width * (item.x / 100)) - (w / 2);
      const posY = (canvas.height * (item.y / 100)) - (h / 2);
      this.ctx.drawImage(item.image, posX, posY, w, h);
      this.ctx.restore();
    });

    // Draw finished freehand strokes & erasures
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.strokes.forEach(stroke => {
      if (stroke.points.length < 1) return;
      this.ctx.save();
      if (stroke.mode === 'erase') {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.globalAlpha = stroke.opacity || 1;
      } else if (stroke.mode === 'blur') {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = (stroke.opacity || 1) * 0.5;
        this.ctx.filter = 'blur(10px)';
      } else {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = stroke.opacity || 1;
      }
      this.ctx.beginPath();
      this.ctx.strokeStyle = stroke.color;
      this.ctx.lineWidth = stroke.width;
      this.ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        this.ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      this.ctx.stroke();
      this.ctx.restore();
    });

    // Draw current active stroke
    if (this.currentStroke && this.currentStroke.points.length > 0) {
      this.ctx.save();
      if (this.currentStroke.mode === 'erase') {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.globalAlpha = this.currentStroke.opacity || 1;
      } else if (this.currentStroke.mode === 'blur') {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = (this.currentStroke.opacity || 1) * 0.5;
        this.ctx.filter = 'blur(10px)';
      } else {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = this.currentStroke.opacity || 1;
      }
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.currentStroke.color;
      this.ctx.lineWidth = this.currentStroke.width;
      this.ctx.moveTo(this.currentStroke.points[0].x, this.currentStroke.points[0].y);
      for (let i = 1; i < this.currentStroke.points.length; i++) {
        this.ctx.lineTo(this.currentStroke.points[i].x, this.currentStroke.points[i].y);
      }
      this.ctx.stroke();
      this.ctx.restore();
    }

    // Draw text overlays
    this.textOverlays.forEach(item => {
      this.ctx.fillStyle = item.color;
      this.ctx.font = `bold ${item.fontSize}px ${item.fontFamily}`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      const px = (item.x / 100) * canvas.width;
      const py = (item.y / 100) * canvas.height;
      
      this.ctx.shadowColor = 'rgba(0,0,0,0.75)';
      this.ctx.shadowBlur = 10;
      this.ctx.fillText(item.text, px, py);
      this.ctx.shadowColor = 'transparent';
      this.ctx.shadowBlur = 0;
    });

    // Draw Border
    if (this.borderWidth > 0) {
      this.ctx.lineWidth = this.borderWidth * 2;
      this.ctx.strokeStyle = this.borderColor;
      this.ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    // Apply Sharpness using simple Convolution
    if (this.sharpness > 0) {
      const imageData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
      const amount = this.sharpness / 100;
      const kernel = [
        0, -1 * amount, 0,
        -1 * amount, 1 + 4 * amount, -1 * amount,
        0, -1 * amount, 0
      ];
      this.applyConvolution(imageData, kernel);
      this.ctx.putImageData(imageData, 0, 0);
    }

    // Apply Rounded Corners
    if (this.roundCorners > 0) {
      this.ctx.globalCompositeOperation = 'destination-in';
      this.ctx.beginPath();
      const radius = (Math.min(canvas.width, canvas.height) * (this.roundCorners / 100)) / 2;
      if (typeof this.ctx.roundRect === 'function') {
        this.ctx.roundRect(0, 0, canvas.width, canvas.height, radius);
      } else {
        this.ctx.rect(0, 0, canvas.width, canvas.height);
      }
      this.ctx.fill();
      this.ctx.globalCompositeOperation = 'source-over';
    }

    // Draw Watermark
    if (this.watermarkText) {
      const op = Math.max(0.1, Math.min(1, this.watermarkOpacity / 100));
      this.ctx.fillStyle = `rgba(255, 255, 255, ${op})`;
      const fontSize = Math.max(20, Math.round(canvas.width * 0.035));
      this.ctx.font = `bold ${fontSize}px Arial`;
      this.ctx.shadowColor = 'rgba(0,0,0,0.9)';
      this.ctx.shadowBlur = 6;
      
      let wx = canvas.width - 24;
      let wy = canvas.height - 24;
      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'bottom';

      if (this.watermarkPos === 'bottom-left') {
        wx = 24; wy = canvas.height - 24;
        this.ctx.textAlign = 'left';
      } else if (this.watermarkPos === 'top-right') {
        wx = canvas.width - 24; wy = 24 + fontSize;
        this.ctx.textAlign = 'right';
      } else if (this.watermarkPos === 'top-left') {
        wx = 24; wy = 24 + fontSize;
        this.ctx.textAlign = 'left';
      } else if (this.watermarkPos === 'center') {
        wx = canvas.width / 2; wy = canvas.height / 2;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
      }

      this.ctx.fillText(this.watermarkText, wx, wy);
      this.ctx.shadowColor = 'transparent';
      this.ctx.shadowBlur = 0;
    }

    // Draw Rule of Thirds Overlay if active (Preview only)
    if (this.ruleOfThirds) {
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.65)'; // Cyan dashed overlay
      this.ctx.lineWidth = 1.5;
      this.ctx.setLineDash([6, 6]);
      
      // 2 horizontal lines
      const h1 = canvas.height / 3;
      const h2 = (canvas.height / 3) * 2;
      this.ctx.beginPath();
      this.ctx.moveTo(0, h1); this.ctx.lineTo(canvas.width, h1);
      this.ctx.moveTo(0, h2); this.ctx.lineTo(canvas.width, h2);
      this.ctx.stroke();

      // 2 vertical lines
      const w1 = canvas.width / 3;
      const w2 = (canvas.width / 3) * 2;
      this.ctx.beginPath();
      this.ctx.moveTo(w1, 0); this.ctx.lineTo(w1, canvas.height);
      this.ctx.moveTo(w2, 0); this.ctx.lineTo(w2, canvas.height);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }

  // Zoom Controls
  zoom(delta: number) {
    this.zoomLevel = Math.max(25, Math.min(300, this.zoomLevel + delta));
  }

  // Swatch Selection
  setBrushColor(color: string) {
    this.brushColor = color;
  }

  // Preset Text Additions
  addPresetText(type: 'heading' | 'badge' | 'watermark') {
    const id = Date.now().toString();
    if (type === 'heading') {
      this.textOverlays.push({
        id, text: 'CONVERTERALL TITLE', x: 50, y: 50, color: '#ffffff', fontSize: 64, fontFamily: 'Impact'
      });
    } else if (type === 'badge') {
      this.textOverlays.push({
        id, text: '★ COLOR GRADED ★', x: 50, y: 85, color: '#06b6d4', fontSize: 36, fontFamily: 'Arial'
      });
    } else if (type === 'watermark') {
      this.textOverlays.push({
        id, text: '© ConverterAll AI Studio', x: 50, y: 50, color: '#e2e8f0', fontSize: 28, fontFamily: 'Georgia'
      });
    }
    this.applyChanges();
  }

  // Canvas Mouse Listeners (Drawing, Erasing, and Blur mode)
  startDrawing(e: MouseEvent) {
    if (!this.isDrawMode) return;
    this.isDrawingNow = true;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    
    this.currentStroke = {
      mode: this.brushMode,
      color: this.brushColor,
      width: this.brushWidth,
      opacity: this.brushOpacity / 100,
      points: [{ x, y }]
    };
  }

  draw(e: MouseEvent) {
    if (!this.isDrawMode || !this.isDrawingNow || !this.currentStroke) return;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    
    this.currentStroke.points.push({ x, y });
    this.applyChanges();
  }

  stopDrawing() {
    if (this.isDrawingNow && this.currentStroke) {
      this.strokes.push(this.currentStroke);
      this.currentStroke = null;
    }
    this.isDrawingNow = false;
    this.applyChanges();
  }

  clearPaint() {
    this.strokes = [];
    this.currentStroke = null;
    this.applyChanges();
  }

  undoStroke() {
    if (this.strokes.length > 0) {
      this.strokes.pop();
      this.applyChanges();
    }
  }

  addTextOverlay() {
    if (!this.newText.trim()) return;
    const id = Date.now().toString();
    this.textOverlays.push({
      id,
      text: this.newText,
      x: 50,
      y: 50,
      color: this.newTextColor,
      fontSize: this.newTextSize,
      fontFamily: this.newTextFont
    });
    this.newText = '';
    this.applyChanges();
  }

  deleteTextOverlay(id: string) {
    this.textOverlays = this.textOverlays.filter(item => item.id !== id);
    this.applyChanges();
  }

  onCanvasClick(e: MouseEvent) {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const pctX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const pctY = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    if (this.activeTool === 'text' && this.textOverlays.length > 0) {
      const lastText = this.textOverlays[this.textOverlays.length - 1];
      if (lastText) {
        lastText.x = pctX;
        lastText.y = pctY;
        this.applyChanges();
      }
    } else if (this.activeTool === 'overlay' && this.imageOverlays.length > 0) {
      const lastOverlay = this.imageOverlays[this.imageOverlays.length - 1];
      if (lastOverlay) {
        lastOverlay.x = pctX;
        lastOverlay.y = pctY;
        this.applyChanges();
      }
    }
  }

  rotate(degrees: number) {
    this.rotation = (this.rotation + degrees) % 360;
    if (this.rotation < 0) this.rotation += 360;
    this.applyChanges();
  }

  toggleFlipH() {
    this.flipH = !this.flipH;
    this.applyChanges();
  }

  toggleFlipV() {
    this.flipV = !this.flipV;
    this.applyChanges();
  }

  resetAll() {
    this.activePreset = 'normal';
    this.aiEnhanceActive = false;
    this.ruleOfThirds = false;
    this.comparePosition = 100;
    this.brightness = 100;
    this.contrast = 100;
    this.highlights = 0;
    this.shadows = 0;
    this.whites = 0;
    this.blacks = 0;
    this.saturation = 100;
    this.vibrance = 0;
    this.temperature = 0;
    this.hue = 0;
    this.sharpness = 0;
    this.clarity = 0;
    this.blur = 0;
    this.grayscale = 0;
    this.sepia = 0;
    this.invert = 0;
    this.rotation = 0;
    this.fineRotation = 0;
    this.flipH = false;
    this.flipV = false;
    this.watermarkText = '';
    this.watermarkOpacity = 80;
    this.borderWidth = 0;
    this.roundCorners = 0;
    this.strokes = [];
    this.textOverlays = [];
    this.currentStroke = null;
    this.isDrawMode = false;
    this.applyChanges();
  }

  downloadImage() {
    // Temporarily turn off rule of thirds guideline before exporting
    const prevGuideline = this.ruleOfThirds;
    this.ruleOfThirds = false;
    this.applyChanges();

    const canvas = this.canvasRef.nativeElement;
    const dataUrl = canvas.toDataURL(this.exportFormat, this.exportQuality / 100);
    
    const link = document.createElement('a');
    link.href = dataUrl;
    const ext = this.exportFormat.split('/')[1];
    link.download = `${this.fileName || 'converterall-studio'}.${ext}`;
    link.click();

    this.ruleOfThirds = prevGuideline;
    this.applyChanges();
  }

  private applyConvolution(imageData: ImageData, weights: number[]) {
    const side = Math.round(Math.sqrt(weights.length));
    const halfSide = Math.floor(side / 2);
    const src = imageData.data;
    const w = imageData.width;
    const h = imageData.height;

    const output = new Uint8ClampedArray(src);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dstOff = (y * w + x) * 4;
        let r = 0, g = 0, b = 0;
        for (let cy = 0; cy < side; cy++) {
          for (let cx = 0; cx < side; cx++) {
            const scy = y + cy - halfSide;
            const scx = x + cx - halfSide;
            if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
              const srcOff = (scy * w + scx) * 4;
              const wt = weights[cy * side + cx];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
            }
          }
        }
        output[dstOff] = r;
        output[dstOff + 1] = g;
        output[dstOff + 2] = b;
      }
    }

    for (let i = 0; i < src.length; i++) {
      src[i] = output[i];
    }
  }
}
