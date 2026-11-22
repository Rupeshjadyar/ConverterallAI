export async function encodeMp3(audio: AudioBuffer, signal: AbortSignal): Promise<Blob> {
  const { Mp3Encoder } = await import('@breezystack/lamejs');
  const sampleRate = 44_100;
  const channels = Math.min(2, audio.numberOfChannels);
  let source = audio;
  if (audio.sampleRate !== sampleRate || audio.numberOfChannels !== channels) {
    const offline = new OfflineAudioContext(channels, Math.ceil(audio.duration * sampleRate), sampleRate);
    const input = offline.createBufferSource();
    input.buffer = audio;
    input.connect(offline.destination);
    input.start();
    source = await offline.startRendering();
  }
  signal.throwIfAborted();

  const encoder = new Mp3Encoder(channels, sampleRate, 128);
  const frames: Uint8Array<ArrayBuffer>[] = [];
  const frameSize = 1152;
  const left = source.getChannelData(0);
  const right = channels === 2 ? source.getChannelData(1) : left;
  const leftPcm = new Int16Array(frameSize);
  const rightPcm = new Int16Array(frameSize);
  const toPcm = (value: number) =>
    Math.round(Math.max(-1, Math.min(1, value)) * (value < 0 ? 32768 : 32767));

  for (let start = 0; start < left.length; start += frameSize) {
    const length = Math.min(frameSize, left.length - start);
    for (let i = 0; i < length; i++) {
      leftPcm[i] = toPcm(left[start + i]);
      rightPcm[i] = toPcm(right[start + i]);
    }
    const packet = encoder.encodeBuffer(leftPcm.subarray(0, length), rightPcm.subarray(0, length));
    if (packet.length) frames.push(Uint8Array.from(packet));
    if ((start / frameSize) % 32 === 31) {
      await new Promise<void>(resolve => setTimeout(resolve, 0));
      signal.throwIfAborted();
    }
  }

  const last = encoder.flush();
  if (last.length) frames.push(Uint8Array.from(last));
  if (!frames.length) throw new Error('No audio was encoded.');
  return new Blob(frames, { type: 'audio/mpeg' });
}
