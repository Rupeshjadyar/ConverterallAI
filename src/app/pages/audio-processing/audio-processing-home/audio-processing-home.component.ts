import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

export interface AudioTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  popular: boolean;
  category: 'edit' | 'fx' | 'speed' | 'convert' | 'ai';
  badge?: string;
}

@Component({
  selector: 'app-audio-processing-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './audio-processing-home.component.html',
  styleUrls: ['./audio-processing-home.component.css']
})
export class AudioProcessingHomeComponent implements OnInit {
  searchTerm = '';
  selectedCategory = 'all';

  categories = [
    { id: 'all', name: 'All Audio Tools', icon: '🎯' },
    { id: 'edit', name: 'Trimming & Joining', icon: '✂️' },
    { id: 'fx', name: 'Volume & Equalizer', icon: '🎚️' },
    { id: 'speed', name: 'Speed & Reverser', icon: '⚡' },
    { id: 'convert', name: 'Converter & Video', icon: '🎬' },
    { id: 'ai', name: 'AI Voice & Speech', icon: '🎙️' }
  ];

  audioTools: AudioTool[] = [
    {
      id: 'audio-cutter',
      name: 'Audio Cutter & Trimmer',
      description: 'Cut, slice, and trim audio tracks with precision waveform UI and instant export.',
      icon: '✂️',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
      route: '/audio-processing/audio-cutter',
      popular: true,
      category: 'edit',
      badge: 'POPULAR'
    },
    {
      id: 'volume-booster',
      name: 'Volume Booster & Peak Limiter',
      description: 'Amplify quiet audio up to 500% with soft peak limiting to prevent distortion.',
      icon: '🔊',
      color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      route: '/audio-processing/volume-booster',
      popular: true,
      category: 'fx',
      badge: 'FREE'
    },
    {
      id: 'speed-changer',
      name: 'Audio Speed Changer',
      description: 'Change audio playback rate from 0.25x to 3.0x with live preview and resampling.',
      icon: '⚡',
      color: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
      route: '/audio-processing/speed-changer',
      popular: true,
      category: 'speed',
      badge: 'FREE'
    },
    {
      id: 'audio-reverser',
      name: 'Audio Reverser Studio',
      description: 'Flip any audio file backwards in 1 click with visual reversed waveform preview.',
      icon: '🔄',
      color: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      route: '/audio-processing/audio-reverser',
      popular: false,
      category: 'speed',
      badge: 'FREE'
    },
    {
      id: 'equalizer',
      name: '5-Band Equalizer & Bass Booster',
      description: 'Adjust Bass, Treble, Vocal Clarity, and 5 frequency bands with studio presets.',
      icon: '🎚️',
      color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      route: '/audio-processing/equalizer',
      popular: true,
      category: 'fx',
      badge: 'PRO'
    },
    {
      id: 'audio-compressor',
      name: 'Audio Dynamic Compressor',
      description: 'Compress audio dynamic range for balanced podcast, voiceover, and radio volume.',
      icon: '🗜️',
      color: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
      route: '/audio-processing/audio-compressor',
      popular: false,
      category: 'fx',
      badge: 'PRO'
    },
    {
      id: 'video-to-audio',
      name: 'Video to Audio MP3 Extractor',
      description: 'Extract MP3/WAV audio tracks from MP4, WebM, MOV, and AVI videos in-browser.',
      icon: '🎬',
      color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      route: '/audio-processing/video-to-audio',
      popular: true,
      category: 'convert',
      badge: 'NEW'
    },
    {
      id: 'format-converter',
      name: 'Audio Format Converter',
      description: 'Convert MP3, WAV, OGG, and AAC files in batch with custom bitrate selection.',
      icon: '🔁',
      color: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
      route: '/audio-processing/format-converter',
      popular: false,
      category: 'convert',
      badge: 'POPULAR'
    },
    {
      id: 'audio-joiner',
      name: 'Audio Joiner & Merger',
      description: 'Combine multiple audio files into a single track with crossfades and custom sequence.',
      icon: '🔗',
      color: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
      route: '/audio-processing/audio-joiner',
      popular: true,
      category: 'edit',
      badge: 'NEW'
    },
    {
      id: 'audio-editor',
      name: 'Powerful Multi-Track Studio',
      description: 'Full DAW audio editor with multi-track mixing, noise gate, mic recording, and timeline crop.',
      icon: '🎛️',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      route: '/audio-processing/audio-editor',
      popular: true,
      category: 'edit',
      badge: 'PRO'
    },
    {
      id: 'text-to-mp3',
      name: 'AI Text to Speech Studio',
      description: 'Convert written script into human voice narration in 100+ languages.',
      icon: '🎙️',
      color: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
      route: '/audio-processing/text-to-mp3',
      popular: true,
      category: 'ai',
      badge: 'AI'
    },
    {
      id: 'voice-cloning',
      name: 'AI Voice Cloning Studio',
      description: 'Extract spectral voice features from a 5-second sample & generate custom speech.',
      icon: '🧬',
      color: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
      route: '/audio-processing/voice-cloning',
      popular: true,
      category: 'ai',
      badge: 'AI'
    }
  ];

  filteredTools: AudioTool[] = [...this.audioTools];
  popularTools: AudioTool[] = this.audioTools.filter(tool => tool.popular);

  constructor(private router: Router) {}

  ngOnInit(): void {}

  filterTools(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredTools = this.audioTools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(term) ||
                           tool.description.toLowerCase().includes(term);
      const matchesCategory = this.selectedCategory === 'all' || tool.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterTools();
  }

  openTool(tool: AudioTool): void {
    this.router.navigate([tool.route]);
  }
}
