// Cheerful Web Audio API celesta + music-box instrumental melody player
// Lightweight, zero external audio assets, seamless loop, and browser autoplay-aware.

export interface MusicState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number; // 0 to 1
  hasExplicitlyStopped: boolean;
}

type MusicListener = (state: MusicState) => void;

interface MelodyStep {
  lead: number | null;
  bass?: number | null;
  duration?: number; // seconds
}

class CheerfulMusicPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private timerId: number | null = null;
  private stepIndex = 0;
  private listeners = new Set<MusicListener>();

  private state: MusicState = {
    isPlaying: false,
    isMuted: false,
    volume: 0.45,
    hasExplicitlyStopped: false,
  };

  // Original joyful C-major Children's Day music-box melody (32 steps, seamless loop)
  private readonly melody: MelodyStep[] = [
    { lead: 523.25, bass: 261.63 }, // C5 + C4
    { lead: 659.25, bass: null },   // E5
    { lead: 783.99, bass: null },   // G5
    { lead: 659.25, bass: null },   // E5
    { lead: 880.0, bass: 349.23 },  // A5 + F4
    { lead: 783.99, bass: null },   // G5
    { lead: 659.25, bass: null },   // E5
    { lead: null, bass: null },

    { lead: 587.33, bass: 293.66 }, // D5 + D4
    { lead: 659.25, bass: null },   // E5
    { lead: 698.46, bass: null },   // F5
    { lead: 587.33, bass: null },   // D5
    { lead: 783.99, bass: 196.0 },  // G5 + G3
    { lead: 659.25, bass: null },   // E5
    { lead: 523.25, bass: null },   // C5
    { lead: null, bass: null },

    { lead: 523.25, bass: 261.63 }, // C5 + C4
    { lead: 783.99, bass: null },   // G5
    { lead: 1046.5, bass: null },   // C6
    { lead: 880.0, bass: null },    // A5
    { lead: 783.99, bass: 349.23 }, // G5 + F4
    { lead: 698.46, bass: null },   // F5
    { lead: 659.25, bass: null },   // E5
    { lead: null, bass: null },

    { lead: 587.33, bass: 196.0 },  // D5 + G3
    { lead: 698.46, bass: null },   // F5
    { lead: 659.25, bass: null },   // E5
    { lead: 587.33, bass: null },   // D5
    { lead: 523.25, bass: 261.63, duration: 0.65 }, // C5 + C4 resolve
    { lead: 659.25, bass: null },   // E5
    { lead: 523.25, bass: null, duration: 0.65 },   // C5
    { lead: null, bass: null },
  ];

  private notify() {
    const snapshot = { ...this.state };
    this.listeners.forEach((fn) => fn(snapshot));
  }

  public subscribe(listener: MusicListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): MusicState {
    return { ...this.state };
  }

  private ensureContext(): boolean {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return false;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.state.isMuted ? 0 : this.state.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    return true;
  }

  private updateMasterGain() {
    if (!this.ctx || !this.masterGain) return;
    const target = this.state.isMuted ? 0 : this.state.volume;
    this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.03);
  }

  private playTone(freq: number, duration: number, type: OscillatorType, peakGain: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(peakGain, now + 0.025);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  private startLoop() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }

    const tick = () => {
      if (!this.state.isPlaying || !this.ctx || this.ctx.state !== 'running') return;
      const step = this.melody[this.stepIndex % this.melody.length];
      const dur = step.duration ?? 0.44;
      if (step.lead) {
        // Celesta chime: pure sine + gentle octave shimmer
        this.playTone(step.lead, dur, 'sine', 0.14);
        this.playTone(step.lead * 2, dur * 0.65, 'sine', 0.022);
      }
      if (step.bass) {
        this.playTone(step.bass, 0.72, 'triangle', 0.055);
      }
      this.stepIndex = (this.stepIndex + 1) % this.melody.length;
    };

    tick();
    this.timerId = window.setInterval(tick, 340);
  }

  /**
   * Attempts to start playback. Returns true only if the AudioContext is actively running
   * (false if autoplay is blocked by browser policy).
   */
  public async tryPlay(userInitiated = false): Promise<boolean> {
    if (!this.ensureContext() || !this.ctx) return false;

    if (userInitiated) {
      this.state.hasExplicitlyStopped = false;
    }

    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        return false;
      }
    }

    // Double check: browsers keep state as 'suspended' if autoplay without gesture was blocked
    if (this.ctx.state !== 'running') {
      this.state.isPlaying = false;
      this.notify();
      return false;
    }

    this.updateMasterGain();
    if (!this.state.isPlaying) {
      this.state.isPlaying = true;
      this.startLoop();
      this.notify();
    }
    return true;
  }

  public pause(explicitByUser = true) {
    this.state.isPlaying = false;
    if (explicitByUser) {
      this.state.hasExplicitlyStopped = true;
    }
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  public stop() {
    this.pause(false);
    this.stepIndex = 0;
  }

  public async togglePlay(): Promise<boolean> {
    if (this.state.isPlaying) {
      this.pause(true);
      return false;
    }
    return this.tryPlay(true);
  }

  public setMuted(muted: boolean) {
    this.state.isMuted = muted;
    this.updateMasterGain();
    this.notify();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.state.isMuted);
    return this.state.isMuted;
  }

  public setVolume(volume: number) {
    const clamped = Math.max(0, Math.min(1, volume));
    this.state.volume = clamped;
    if (clamped > 0 && this.state.isMuted) {
      this.state.isMuted = false;
    }
    this.updateMasterGain();
    this.notify();
  }
}

export const musicPlayer = new CheerfulMusicPlayer();
