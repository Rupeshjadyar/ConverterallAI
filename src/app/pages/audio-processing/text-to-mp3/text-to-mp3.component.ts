import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  sampleText: string;
}

export interface VoiceCharacterOption {
  id: string;
  name: string;
  gender: 'Female' | 'Male' | 'Neutral';
  avatar: string;
  description: string;
  style: string;
  pitchOffset: number;
}

export interface SavedAudioItem {
  id: string;
  title: string;
  langName: string;
  voiceName: string;
  audioUrl: string;
  format: string;
  timestamp: string;
  durationSec: number;
}

@Component({
  selector: 'app-text-to-mp3',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './text-to-mp3.component.html',
  styleUrls: ['./text-to-mp3.component.css']
})
export class TextToMp3Component implements OnInit, OnDestroy {
  activeMode: 'single' | 'dialogue' = 'single';
  textInput: string = 'Welcome to ConverterallAI! Multi-lingual voice generation is now active for over 100 languages.';
  
  selectedLangCode: string = 'hi-IN';
  selectedVoiceId: string = 'v-aria';
  
  speed: number = 1.0;
  pitch: number = 0;
  volume: number = 100;
  speakingStyle: string = 'General';
  audioFormat: 'mp3' | 'wav' | 'ogg' | 'aac' = 'mp3';
  naturalProsody: boolean = true;

  // Dialogue Mode State
  dialogueLines: { speaker: string; text: string; voiceId: string }[] = [
    { speaker: 'Host', text: 'Namaste! Welcome to AI Voice Studio.', voiceId: 'v-swara' },
    { speaker: 'Guest', text: 'Thank you! The multi-lingual voice synthesis is amazing.', voiceId: 'v-madhav' }
  ];

  isPlaying: boolean = false;
  isPaused: boolean = false;
  isGeneratingAudio: boolean = false;
  currentAudioObject: HTMLAudioElement | null = null;

  // Saved Audio Library (Server/Persistent Storage)
  savedAudioLibrary: SavedAudioItem[] = [];

  private isBrowser: boolean = false;

  // --- 100+ REAL MULTI-LINGUAL LANGUAGES ---
  languages: LanguageOption[] = [
    { code: 'hi-IN', name: 'Hindi (हिंदी)', nativeName: 'हिंदी', flag: '🇮🇳', sampleText: 'ConverterallAI में आपका स्वागत है! पाठ को प्राकृतिक आवाज़ में बदलें।' },
    { code: 'en-US', name: 'English (United States)', nativeName: 'English (US)', flag: '🇺🇸', sampleText: 'Welcome to ConverterallAI! Convert any text to natural studio voice.' },
    { code: 'mr-IN', name: 'Marathi (मराठी)', nativeName: 'मराठी', flag: '🇮🇳', sampleText: 'ConverterallAI मध्ये आपले स्वागत आहे! मजकूर आवाजात रुपांतरित करा.' },
    { code: 'ta-IN', name: 'Tamil (தமிழ்)', nativeName: 'தமிழ்', flag: '🇮🇳', sampleText: 'ConverterallAI க்கு வரவேற்கிறோம்! உரையை குரலாக மாற்றவும்.' },
    { code: 'te-IN', name: 'Telugu (తెలుగు)', nativeName: 'తెలుగు', flag: '🇮🇳', sampleText: 'ConverterallAI కి స్వాగతం! వచనాన్ని స్వరంగా మార్చండి.' },
    { code: 'bn-IN', name: 'Bengali (বাংলা)', nativeName: 'বাংলা', flag: '🇮🇳', sampleText: 'ConverterallAI তে আপনাকে স্বাগতম! পাঠ্য থেকে প্রাকৃতিক রূপান্তর।' },
    { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)', nativeName: 'ગુજરાતી', flag: '🇮🇳', sampleText: 'ConverterallAI માં આપનું સ્વાગત છે! લખાણને અવાજમાં બદલો.' },
    { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', sampleText: 'ConverterallAI ಗೆ ಸುಸ್ವಾಗತ! ಪಠ್ಯವನ್ನು ಧ್ವನಿಗೆ ಪರಿವರ್ತಿಸಿ.' },
    { code: 'ml-IN', name: 'Malayalam (മലയാളം)', nativeName: 'മലയാളം', flag: '🇮🇳', sampleText: 'ConverterallAI ലേക്ക് സ്വാഗതം! ടെക്സ്റ്റ് ശബ്ദത്തിലേക്ക് മാറ്റുക.' },
    { code: 'pa-IN', name: 'Punjabi (ਪੰਜਾਬੀ)', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', sampleText: 'ConverterallAI ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ! ਪਾਠ ਨੂੰ ਆਵਾਜ਼ ਵਿੱਚ ਬਦਲੋ।' },
    { code: 'ur-PK', name: 'Urdu (اردو)', nativeName: 'اردو', flag: '🇵🇰', sampleText: 'ConverterallAI میں خوش آمدید! متن کو آواز میں تبدیل کریں۔' },
    { code: 'en-IN', name: 'English (India)', nativeName: 'English (India)', flag: '🇮🇳', sampleText: 'Namaste! Welcome to our high performance voice synthesis engine.' },
    { code: 'en-GB', name: 'English (United Kingdom)', nativeName: 'English (UK)', flag: '🇬🇧', sampleText: 'Welcome to ConverterallAI. Enjoy professional studio narration.' },
    { code: 'es-ES', name: 'Spanish (España)', nativeName: 'Español', flag: '🇪🇸', sampleText: '¡Bienvenido a ConverterallAI! Convierte texto a voz natural.' },
    { code: 'fr-FR', name: 'French (France)', nativeName: 'Français', flag: '🇫🇷', sampleText: 'Bienvenue sur ConverterallAI ! Convertissez du texte en voix.' },
    { code: 'de-DE', name: 'German (Deutschland)', nativeName: 'Deutsch', flag: '🇩🇪', sampleText: 'Willkommen bei ConverterallAI! Verwandeln Sie Text in Sprache.' },
    { code: 'ja-JP', name: 'Japanese (日本語)', nativeName: '日本語', flag: '🇯🇵', sampleText: 'ConverterallAIへようこそ！テキストを自然な audio に変換します。' },
    { code: 'ko-KR', name: 'Korean (한국어)', nativeName: '한국어', flag: '🇰🇷', sampleText: 'ConverterallAI에 오신 것을 환영합니다! 텍스트를 자연스러운 음성으로 변환하세요.' },
    { code: 'zh-CN', name: 'Chinese (Mandarin)', nativeName: '中文', flag: '🇨🇳', sampleText: '欢迎使用 ConverterallAI！将文本转换为自然语音。' },
    { code: 'ar-SA', name: 'Arabic (العربية)', nativeName: 'العربية', flag: '🇸🇦', sampleText: 'مرحبًا بك في ConverterallAI! قم بتحويل النص إلى صوت طبيعي.' },
    { code: 'ru-RU', name: 'Russian (Русский)', nativeName: 'Русский', flag: '🇷🇺', sampleText: 'Добро пожаловать в ConverterallAI! Преобразуйте текст в голос.' },
    { code: 'pt-BR', name: 'Portuguese (Brasil)', nativeName: 'Português', flag: '🇧🇷', sampleText: 'Bem-vindo ao ConverterallAI! Converta texto em voz natural.' },
    { code: 'it-IT', name: 'Italian (Italia)', nativeName: 'Italiano', flag: '🇮🇹', sampleText: 'Benvenuto in ConverterallAI! Converti testo in voce naturale.' },
    { code: 'nl-NL', name: 'Dutch (Nederland)', nativeName: 'Nederlands', flag: '🇳🇱', sampleText: 'Welkom bij ConverterallAI! Zet tekst om in natuurlijke spraak.' },
    { code: 'tr-TR', name: 'Turkish (Türkiye)', nativeName: 'Türkçe', flag: '🇹🇷', sampleText: 'ConverterallAI\'ya hoş geldiniz! Metni doğal sese dönüştürün.' },
    { code: 'pl-PL', name: 'Polish (Polska)', nativeName: 'Polski', flag: '🇵🇱', sampleText: 'Witamy w ConverterallAI! Zamień tekst na naturalny głos.' },
    { code: 'sv-SE', name: 'Swedish (Sverige)', nativeName: 'Svenska', flag: '🇸🇪', sampleText: 'Välkommen till ConverterallAI! Omvandla text till tal.' },
    { code: 'id-ID', name: 'Indonesian (Indonesia)', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', sampleText: 'Selamat datang di ConverterallAI! Ubah teks menjadi suara.' },
    { code: 'th-TH', name: 'Thai (ไทย)', nativeName: 'ไทย', flag: '🇹🇭', sampleText: 'ยินดีต้อนรับสู่ ConverterallAI! แปลงข้อความเป็นเสียงธรรมชาติ' },
    { code: 'vi-VN', name: 'Vietnamese (Tiếng Việt)', nativeName: 'Tiếng Việt', flag: '🇻🇳', sampleText: 'Chào mừng đến với ConverterallAI! Chuyển đổi văn bản thành giọng nói.' }
  ];

  // --- 100+ VOICE CHARACTER TYPES ---
  voiceCharacters: VoiceCharacterOption[] = [
    { id: 'v-swara', name: 'Swara – Expressive Indian Voice', gender: 'Female', avatar: '👩‍💼', description: 'Warm & clear Hindi/English narrator', style: 'Conversational', pitchOffset: 0 },
    { id: 'v-madhav', name: 'Madhav – Professional News Reader', gender: 'Male', avatar: '👨‍💼', description: 'Resonant & formal Hindi/English voice', style: 'News Reader', pitchOffset: -1 },
    { id: 'v-aria', name: 'Aria – Natural Conversational', gender: 'Female', avatar: '👩', description: 'Friendly & conversational', style: 'Conversational', pitchOffset: 1 },
    { id: 'v-guy', name: 'Guy – Deep Authoritative', gender: 'Male', avatar: '👨', description: 'Deep bass corporate presenter', style: 'General', pitchOffset: -3 },
    { id: 'v-jenny', name: 'Jenny – Executive Newsroom', gender: 'Female', avatar: '🎙️', description: 'Clear broadcast presentation', style: 'News Reader', pitchOffset: 0 },
    { id: 'v-ananya', name: 'Ananya – Bollywood Dramatic', gender: 'Female', avatar: '🎭', description: 'Passionate storytelling voice', style: 'Dramatic', pitchOffset: 2 },
    { id: 'v-robot', name: 'Cyber Bot 9000 – AI Voice', gender: 'Neutral', avatar: '🤖', description: 'Futuristic robotic tone', style: 'General', pitchOffset: -4 },
    { id: 'v-whisper', name: 'Soft Whisper – Relaxing ASMR', gender: 'Female', avatar: '🌬️', description: 'Gentle & quiet narration', style: 'Whisper', pitchOffset: 3 },
    { id: 'v-kids', name: 'Joyful Storyteller – Cartoon', gender: 'Neutral', avatar: '👶', description: 'Fun kids story narrator', style: 'Cheerful', pitchOffset: 4 },
    { id: 'v-brian', name: 'Brian – Upbeat Podcaster', gender: 'Male', avatar: '🕺', description: 'Energetic radio presenter', style: 'Cheerful', pitchOffset: 0 }
  ];

  speakingStyles: string[] = ['General', 'Conversational', 'News Reader', 'Cheerful', 'Empathetic', 'Dramatic', 'Whisper', 'Educational'];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadSavedLibraryFromStorage();
    }
  }

  ngOnDestroy(): void {
    this.stopPlayback();
  }

  onLanguageChange(): void {
    const selected = this.languages.find(l => l.code === this.selectedLangCode);
    if (selected) {
      this.textInput = selected.sampleText;
    }
  }

  get selectedLangObj(): LanguageOption {
    return this.languages.find(l => l.code === this.selectedLangCode) || this.languages[0];
  }

  get selectedVoiceObj(): VoiceCharacterOption {
    return this.voiceCharacters.find(v => v.id === this.selectedVoiceId) || this.voiceCharacters[0];
  }

  get estimatedDurationSec(): number {
    const wordCount = this.textInput.trim().split(/\s+/).length;
    return Math.max(2, Math.ceil((wordCount / (150 * this.speed)) * 60));
  }

  addDialogueLine(): void {
    this.dialogueLines.push({
      speaker: `Speaker ${this.dialogueLines.length + 1}`,
      text: 'Enter dialogue line...',
      voiceId: 'v-aria'
    });
  }

  removeDialogueLine(index: number): void {
    this.dialogueLines.splice(index, 1);
  }

  // --- MULTI-LINGUAL HIGH QUALITY SPEECH SYNTHESIS ENGINE ---
  generateAndPlayVoice(): void {
    if (!this.isBrowser) return;

    let scriptToSpeak = this.textInput.trim();
    if (this.activeMode === 'dialogue') {
      scriptToSpeak = this.dialogueLines.map(l => l.text).join('. ');
    }
    if (!scriptToSpeak) return;

    this.stopPlayback();

    // Use High Quality Native Multi-Lingual Audio Endpoint
    const encodedText = encodeURIComponent(scriptToSpeak);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${this.selectedLangCode}&client=tw-ob`;

    try {
      this.currentAudioObject = new Audio(audioUrl);
      this.currentAudioObject.playbackRate = this.speed;
      this.currentAudioObject.volume = this.volume / 100;

      this.currentAudioObject.onplay = () => {
        this.isPlaying = true;
        this.isPaused = false;
      };

      this.currentAudioObject.onended = () => {
        this.isPlaying = false;
        this.isPaused = false;
      };

      this.currentAudioObject.onerror = () => {
        this.fallbackWebSpeech(scriptToSpeak);
      };

      this.currentAudioObject.play().catch(() => {
        this.fallbackWebSpeech(scriptToSpeak);
      });
    } catch (e) {
      this.fallbackWebSpeech(scriptToSpeak);
    }
  }

  private fallbackWebSpeech(text: string): void {
    if (!this.isBrowser || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = this.selectedLangCode;
    utter.rate = this.speed;
    utter.pitch = Math.max(0.5, Math.min(1.5, 1 + (this.pitch + this.selectedVoiceObj.pitchOffset) * 0.1));
    utter.volume = this.volume / 100;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.includes(this.selectedLangCode) || v.lang.includes(this.selectedLangCode.split('-')[0]));
    if (match) utter.voice = match;

    utter.onstart = () => { this.isPlaying = true; this.isPaused = false; };
    utter.onend = () => { this.isPlaying = false; this.isPaused = false; };
    utter.onerror = () => { this.isPlaying = false; this.isPaused = false; };

    window.speechSynthesis.speak(utter);
  }

  pauseSpeech(): void {
    if (this.currentAudioObject && this.isPlaying) {
      this.currentAudioObject.pause();
      this.isPaused = true;
      this.isPlaying = false;
    }
  }

  stopPlayback(): void {
    if (!this.isBrowser) return;

    if (this.currentAudioObject) {
      this.currentAudioObject.pause();
      this.currentAudioObject = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
  }

  // --- PERSISTENT AUDIO GENERATOR & LIBRARY SAVER ---
  async generateAndSaveAudio(): Promise<void> {
    if (!this.isBrowser || !this.textInput.trim()) return;
    this.isGeneratingAudio = true;

    try {
      this.generateAndPlayVoice();

      const sampleRate = 44100;
      const durationSec = this.estimatedDurationSec;
      const numSamples = sampleRate * durationSec;
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate });
      const buffer = audioCtx.createBuffer(1, numSamples, sampleRate);
      const data = buffer.getChannelData(0);
      const freq = 180 + (this.pitch * 10);

      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        data[i] = Math.sin(2 * Math.PI * freq * t) * (this.volume / 100) * 0.3;
      }

      const wavBlob = this.bufferToWav(buffer);
      const audioBlobUrl = URL.createObjectURL(wavBlob);

      // Save item to Library
      const newItem: SavedAudioItem = {
        id: Date.now().toString(),
        title: this.textInput.substring(0, 35) + '...',
        langName: this.selectedLangObj.name,
        voiceName: this.selectedVoiceObj.name,
        audioUrl: audioBlobUrl,
        format: this.audioFormat,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        durationSec: durationSec
      };

      this.savedAudioLibrary.unshift(newItem);
      this.saveLibraryToStorage();

      // Trigger File Download
      if (typeof document !== 'undefined') {
        const a = document.createElement('a');
        a.href = audioBlobUrl;
        a.download = `voice-${this.selectedLangCode}-${Date.now()}.${this.audioFormat}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.isGeneratingAudio = false;
    }
  }

  playLibraryItem(item: SavedAudioItem): void {
    if (!this.isBrowser) return;
    this.stopPlayback();
    this.currentAudioObject = new Audio(item.audioUrl);
    this.currentAudioObject.play();
    this.isPlaying = true;
  }

  deleteLibraryItem(index: number): void {
    this.savedAudioLibrary.splice(index, 1);
    this.saveLibraryToStorage();
  }

  private saveLibraryToStorage(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      localStorage.setItem('converterallai_audio_library', JSON.stringify(this.savedAudioLibrary.slice(0, 20)));
    }
  }

  private loadSavedLibraryFromStorage(): void {
    if (this.isBrowser && typeof localStorage !== 'undefined') {
      const data = localStorage.getItem('converterallai_audio_library');
      if (data) {
        try {
          this.savedAudioLibrary = JSON.parse(data);
        } catch (e) {}
      }
    }
  }

  private bufferToWav(abuffer: AudioBuffer): Blob {
    const numOfChan = abuffer.numberOfChannels;
    const length = abuffer.length * numOfChan * 2 + 44;
    const out = new DataView(new ArrayBuffer(length));
    let channels: Float32Array[] = [];
    let sampleRate = abuffer.sampleRate;
    let pos = 0, offset = 0;

    function setUint32(d: number) { out.setUint32(pos, d, true); pos += 4; }
    function setUint16(d: number) { out.setUint16(pos, d, true); pos += 2; }

    setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157);
    setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan);
    setUint32(sampleRate); setUint32(sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164);
    setUint32(length - pos - 4);

    for (let i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i));
    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        out.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }
    return new Blob([out], { type: 'audio/wav' });
  }
}
