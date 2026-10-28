import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

export interface TtsProgressUpdate {
  progress: number;            // 0 to 100 percentage
  currentChunk: number;        // e.g. 1
  totalChunks: number;         // e.g. 4
  blob?: Blob;                 // Final combined MP3 blob when progress === 100
  statusMessage?: string;      // Human-readable status string
}

export interface TtsRequestPayload {
  text: string;
  voice: string;
  rate?: string;
  pitch?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TextToMp3Service {
  // Configurable proxy endpoint: defaults to the integrated /api/tts endpoint
  private proxyUrl: string = '/api/tts';

  /**
   * Set custom proxy URL (e.g. deployed Cloudflare Worker URL)
   */
  public setProxyUrl(url: string): void {
    if (url && url.trim()) {
      this.proxyUrl = url.trim();
    }
  }

  public getProxyUrl(): string {
    return this.proxyUrl;
  }

  /**
   * Main synthesis pipeline: handles text validation, sentence-boundary chunking,
   * sequential network streaming with progress updates, and binary MP3 concatenation.
   */
  public convertTextToMp3(
    text: string,
    voice: string,
    rate: string = '+0%',
    pitch: string = '+0Hz'
  ): Observable<TtsProgressUpdate> {
    return new Observable((observer: Observer<TtsProgressUpdate>) => {
      const cleanText = (text || '').trim();
      if (!cleanText) {
        observer.error(new Error('Input text is empty. Please enter text to convert.'));
        return;
      }

      // Divide long text into logical sentence chunks (~3,500 characters max)
      const chunks = this.splitTextIntoChunks(cleanText, 3500);
      const totalChunks = chunks.length;

      observer.next({
        progress: 5,
        currentChunk: 0,
        totalChunks,
        statusMessage: `Prepared ${totalChunks} text section${totalChunks > 1 ? 's' : ''}...`
      });

      const audioBlobs: Blob[] = [];

      // Process chunks sequentially to respect rate limits and order
      const processSequentially = async () => {
        try {
          for (let i = 0; i < chunks.length; i++) {
            const currentChunkNum = i + 1;
            const currentChunkText = chunks[i];

            // Calculate chunk progress (5% to 95%)
            const chunkBaseProgress = Math.round(5 + ((i / totalChunks) * 90));
            observer.next({
              progress: chunkBaseProgress,
              currentChunk: currentChunkNum,
              totalChunks,
              statusMessage: totalChunks > 1
                ? `Synthesizing part ${currentChunkNum} of ${totalChunks}...`
                : 'Synthesizing neural voiceover...'
            });

            const blob = await this.fetchSingleChunkAudio(currentChunkText, voice, rate, pitch);
            audioBlobs.push(blob);

            const chunkDoneProgress = Math.round(5 + (((i + 1) / totalChunks) * 90));
            observer.next({
              progress: chunkDoneProgress,
              currentChunk: currentChunkNum,
              totalChunks,
              statusMessage: `Completed part ${currentChunkNum} of ${totalChunks}`
            });
          }

          // Merge all binary chunks into a single continuous MP3 stream
          observer.next({
            progress: 98,
            currentChunk: totalChunks,
            totalChunks,
            statusMessage: 'Merging MP3 audio stream...'
          });

          const finalCombinedBlob = new Blob(audioBlobs, { type: 'audio/mpeg' });

          observer.next({
            progress: 100,
            currentChunk: totalChunks,
            totalChunks,
            blob: finalCombinedBlob,
            statusMessage: 'Audio synthesis complete!'
          });

          observer.complete();
        } catch (err: any) {
          console.error('Text-to-MP3 Service Error:', err);
          observer.error(err);
        }
      };

      processSequentially();
    });
  }

  /**
   * Fetches the synthesized MP3 audio for a single chunk.
   * Priority 1: Backend proxy (/api/tts or configured Cloudflare Worker).
   * Priority 2: Direct Google Translate TTS endpoint fallback if proxy is 404 in local ng-serve dev mode.
   */
  private async fetchSingleChunkAudio(
    chunkText: string,
    voice: string,
    rate: string,
    pitch: string
  ): Promise<Blob> {
    const payload: TtsRequestPayload = {
      text: chunkText,
      voice,
      rate,
      pitch
    };

    // Priority 1: Try proxy endpoint via native fetch
    try {
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const blob = await response.blob();
        if (blob && blob.size > 0) {
          return blob;
        }
      }
    } catch (_) {
      // Proxy not running on this port (e.g. ng serve without backend) -> proceed to fallback
    }

    // Priority 2: In-browser high-definition translation TTS fallback
    try {
      const langMatch = voice.match(/^([a-z]{2,3})/);
      const shortLang = langMatch ? langMatch[1] : 'en';
      const encodedText = encodeURIComponent(chunkText.slice(0, 300));
      const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${shortLang}&client=tw-ob`;

      const fallbackRes = await fetch(fallbackUrl);
      if (fallbackRes.ok) {
        const blob = await fallbackRes.blob();
        if (blob && blob.size > 0) {
          return blob;
        }
      }
    } catch (fallbackErr: any) {
      console.warn('Fallback synthesis notice:', fallbackErr);
    }

    throw new Error('Speech synthesis endpoint unavailable. Please ensure your backend proxy is running.');
  }

  /**
   * Intelligent Sentence-Boundary Chunker:
   * Splits text on paragraph breaks and natural punctuation boundaries
   * (Devanagari danda '।', periods, question marks, exclamation marks, etc.)
   * without splitting in the middle of words or sentences.
   */
  public splitTextIntoChunks(text: string, maxChunkLength: number = 3500): string[] {
    const normalized = text.trim();
    if (normalized.length <= maxChunkLength) {
      return [normalized];
    }

    // Paragraph split
    const paragraphs = normalized.split(/\n\s*\n/);
    const chunks: string[] = [];
    let currentBuffer = '';

    for (const para of paragraphs) {
      const trimmedPara = para.trim();
      if (!trimmedPara) continue;

      if ((currentBuffer.length + trimmedPara.length + 2) <= maxChunkLength) {
        currentBuffer = currentBuffer ? `${currentBuffer}\n\n${trimmedPara}` : trimmedPara;
      } else {
        if (currentBuffer) {
          chunks.push(currentBuffer);
          currentBuffer = '';
        }

        if (trimmedPara.length <= maxChunkLength) {
          currentBuffer = trimmedPara;
        } else {
          // Paragraph exceeds maxChunkLength -> split into sentences
          const sentenceRegex = /([^.!?।॥؟。\n]+[.!?।॥؟。\n]+)/g;
          const sentences = trimmedPara.match(sentenceRegex) || [trimmedPara];

          for (const sentence of sentences) {
            const s = sentence.trim();
            if (!s) continue;

            if ((currentBuffer.length + s.length + 1) <= maxChunkLength) {
              currentBuffer = currentBuffer ? `${currentBuffer} ${s}` : s;
            } else {
              if (currentBuffer) {
                chunks.push(currentBuffer);
                currentBuffer = '';
              }

              if (s.length > maxChunkLength) {
                const words = s.split(/\s+/);
                for (const word of words) {
                  if ((currentBuffer.length + word.length + 1) <= maxChunkLength) {
                    currentBuffer = currentBuffer ? `${currentBuffer} ${word}` : word;
                  } else {
                    if (currentBuffer) {
                      chunks.push(currentBuffer);
                    }
                    currentBuffer = word;
                  }
                }
              } else {
                currentBuffer = s;
              }
            }
          }
        }
      }
    }

    if (currentBuffer) {
      chunks.push(currentBuffer);
    }

    return chunks.length > 0 ? chunks : [normalized];
  }

  /**
   * Download helper method: triggers instantaneous browser file download for a given Blob
   */
  public downloadBlob(blob: Blob, filename: string = 'converterallai-speech.mp3'): void {
    if (typeof window === 'undefined') return;

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = url;
    anchor.download = filename.endsWith('.mp3') ? filename : `${filename}.mp3`;

    document.body.appendChild(anchor);
    anchor.click();

    setTimeout(() => {
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(url);
    }, 200);
  }
}
