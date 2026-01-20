
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private masterGain: GainNode | null = null;

  public initialize(): boolean {
    if (this.audioContext) {
      return true;
    }
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
      this.masterGain.connect(this.audioContext.destination);
      return true;
    } catch (e) {
      console.error("Web Audio API is not supported in this browser");
      return false;
    }
  }

  public setVolume(volume: number): void {
    this.volume = volume;
    if (this.audioContext && this.masterGain && !this.isMuted) {
      // Use setTargetAtTime for smooth transitions
      this.masterGain.gain.setTargetAtTime(volume, this.audioContext.currentTime, 0.05);
    }
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.audioContext && this.masterGain) {
      const targetVolume = muted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(targetVolume, this.audioContext.currentTime, 0.05);
    }
  }

  private playNote(frequency: number, duration: number, type: OscillatorType = 'sine', startTimeOffset: number = 0): void {
    if (!this.audioContext || !this.masterGain) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);

    const now = this.audioContext.currentTime + startTimeOffset;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);

    // Simple ADSR-like envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + duration * 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  public playCompareSound(value: number, maxValue: number): void {
    if (this.isMuted) return;
    const minFreq = 200;
    const maxFreq = 800;
    const freq = minFreq + (value / maxValue) * (maxFreq - minFreq);
    this.playNote(freq, 0.08, 'triangle');
  }

  public playSwapSound(): void {
    if (this.isMuted || !this.audioContext || !this.masterGain) return;
    
    const now = this.audioContext.currentTime;
    const noise = this.audioContext.createBufferSource();
    const buffer = this.audioContext.createBuffer(1, 4096, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < 4096; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    noise.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.1);
  }

  public playSortedSound(index: number, total: number): void {
    if (this.isMuted) return;
    // C Major scale frequencies
    const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    const noteIndex = Math.floor((index / total) * (scale.length - 1));
    const freq = scale[noteIndex];
    this.playNote(freq, 0.1, 'sine');
  }

  public playFinalSortSound(): void {
    if (this.isMuted) return;
    // C Major Chord
    this.playNote(261.63, 0.5, 'sine', 0); // C4
    this.playNote(329.63, 0.5, 'sine', 0.1); // E4
    this.playNote(392.00, 0.5, 'sine', 0.2); // G4
  }
}
