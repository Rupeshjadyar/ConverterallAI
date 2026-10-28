/**
 * ============================================================================
 * CONVERTERALLAI - ZERO-COST MICROSOFT EDGE TTS BACKEND PROXY (Cloudflare Worker)
 * ============================================================================
 * 
 * Free, serverless, edge-deployed proxy bridging browser requests to Microsoft
 * Edge Read-Aloud Neural TTS WebSocket endpoint with zero API fees.
 * 
 * Target Endpoint:
 *   wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1
 * 
 * Features:
 *   - Full CORS preflight (OPTIONS) support with open access headers.
 *   - Handles POST payload: { text, voice, rate?, pitch? }.
 *   - Automated Sec-MS-GEC v2 security token & Chromium header spoofing.
 *   - Full SSML construction with prosody tuning.
 *   - Binary audio extraction (strips Edge-TTS framing) & direct MP3 flushing.
 *   - Responds with Content-Type: audio/mpeg and Content-Disposition header.
 */

const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const CHROMIUM_MAJOR_VERSION = '143';
const CHROMIUM_FULL_VERSION = '143.0.3650.75';
const SEC_MS_GEC_VERSION = `2-${CHROMIUM_FULL_VERSION}`;
const WIN_EPOCH = 11644473600n; // Windows file time epoch difference (1601 to 1970)

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

/**
 * Generate Sec-MS-GEC v2 security token based on Windows file time ticks
 */
async function generateSecMsGec() {
  const nowSeconds = BigInt(Math.floor(Date.now() / 1000));
  const currentTicks = (nowSeconds + WIN_EPOCH) * 10000000n;
  const roundedTicks = currentTicks - (currentTicks % 3000000000n); // 5-minute interval
  const strToHash = `${roundedTicks.toString()}${TRUSTED_CLIENT_TOKEN}`;

  const msgUint8 = new TextEncoder().encode(strToHash);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * Generate a random 32-character hexadecimal UUID
 */
function generateUUID() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Escape text for safe XML/SSML embedding
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Main Cloudflare Worker Fetch Handler
 */
export default {
  async fetch(request, env, ctx) {
    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    // Health check endpoint
    const url = new URL(request.url);
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return new Response(JSON.stringify({
        status: 'online',
        service: 'ConverterAllAI Edge-TTS Proxy',
        timestamp: new Date().toISOString()
      }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed. Use POST.' }), {
        status: 405,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    try {
      const body = await request.json();
      const text = (body.text || '').trim();
      const voice = (body.voice || 'hi-IN-MadhurNeural').trim();
      const rate = body.rate || '+0%';
      const pitch = body.pitch || '+0Hz';

      if (!text) {
        return new Response(JSON.stringify({ error: 'Missing required "text" parameter.' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }

      // Voice language code extraction (e.g. 'hi-IN' from 'hi-IN-MadhurNeural')
      const langMatch = voice.match(/^([a-z]{2,3}-[A-Z]{2,3})/);
      const voiceLang = langMatch ? langMatch[1] : 'en-US';

      // 2. Synthesize audio via Edge TTS WebSocket
      const audioBuffer = await synthesizeSpeech(text, voice, voiceLang, rate, pitch);

      return new Response(audioBuffer, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': 'attachment; filename="converted.mp3"',
          'Content-Length': audioBuffer.byteLength.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });
    } catch (err) {
      console.error('TTS Proxy Error:', err);
      return new Response(JSON.stringify({
        error: 'Failed to synthesize speech',
        details: err.message || String(err)
      }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }
  }
};

/**
 * Connect to Microsoft Edge TTS WebSocket and synthesize audio into a single MP3 ArrayBuffer
 */
async function synthesizeSpeech(text, voice, lang, rate, pitch) {
  const connectionId = generateUUID();
  const requestId = generateUUID();
  const secMsGec = await generateSecMsGec();
  const muid = generateUUID().toUpperCase();

  const wsUrl = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&ConnectionId=${connectionId}&Sec-MS-GEC=${secMsGec}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}`;

  // Establish WebSocket connection via Cloudflare Workers WebSocket client
  // Cloudflare Workers fetch with Upgrade header creates a client WebSocket
  const resp = await fetch(wsUrl, {
    headers: {
      'Upgrade': 'websocket',
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache',
      'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
      'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${CHROMIUM_MAJOR_VERSION}.0.0.0 Safari/537.36 Edg/${CHROMIUM_MAJOR_VERSION}.0.0.0`,
      'Cookie': `muid=${muid};`,
      'Sec-WebSocket-Version': '13'
    }
  });

  const ws = resp.webSocket;
  if (!ws) {
    throw new Error('Failed to initiate WebSocket connection with Edge TTS endpoint.');
  }

  ws.accept();

  return new Promise((resolve, reject) => {
    const audioChunks = [];
    const dateStr = new Date().toUTCString();

    const timeout = setTimeout(() => {
      try { ws.close(); } catch (_) {}
      if (audioChunks.length > 0) {
        resolve(mergeChunks(audioChunks));
      } else {
        reject(new Error('Edge TTS WebSocket synthesis timed out (15s limit).'));
      }
    }, 15000);

    // 1. Send speech.config message
    const configPayload = JSON.stringify({
      context: {
        synthesis: {
          audio: {
            metadataoptions: {
              sentenceBoundaryEnabled: 'false',
              wordBoundaryEnabled: 'false'
            },
            outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
          }
        }
      }
    });

    const configMessage = `X-Timestamp:${dateStr}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${configPayload}\r\n`;
    ws.send(configMessage);

    // 2. Send SSML message
    const safeText = escapeXml(text);
    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang}'>` +
      `<voice name='${voice}'>` +
      `<prosody pitch='${pitch}' rate='${rate}' volume='+0%'>` +
      `${safeText}` +
      `</prosody></voice></speak>`;

    const ssmlMessage = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${dateStr}Z\r\nPath:ssml\r\n\r\n${ssml}`;
    ws.send(ssmlMessage);

    // 3. Process incoming messages
    ws.addEventListener('message', async (event) => {
      if (typeof event.data === 'string') {
        if (event.data.includes('Path:turn.end')) {
          clearTimeout(timeout);
          try { ws.close(); } catch (_) {}
          if (audioChunks.length === 0) {
            reject(new Error('No audio was generated by Edge TTS for the provided input.'));
          } else {
            resolve(mergeChunks(audioChunks));
          }
        }
      } else {
        // Binary message containing audio frames
        const arrayBuf = event.data instanceof ArrayBuffer ? event.data : await event.data.arrayBuffer();
        if (arrayBuf.byteLength >= 2) {
          const view = new DataView(arrayBuf);
          const headerLength = view.getUint16(0);
          if (arrayBuf.byteLength > 2 + headerLength) {
            const rawAudio = arrayBuf.slice(2 + headerLength);
            if (rawAudio.byteLength > 0) {
              audioChunks.push(new Uint8Array(rawAudio));
            }
          }
        }
      }
    });

    ws.addEventListener('error', (err) => {
      clearTimeout(timeout);
      try { ws.close(); } catch (_) {}
      reject(new Error(`WebSocket error from Edge TTS: ${err.message || 'Handshake failed'}`));
    });

    ws.addEventListener('close', () => {
      clearTimeout(timeout);
      if (audioChunks.length > 0) {
        resolve(mergeChunks(audioChunks));
      }
    });
  });
}

/**
 * Merge an array of Uint8Arrays into a single continuous ArrayBuffer
 */
function mergeChunks(chunks) {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged.buffer;
}
