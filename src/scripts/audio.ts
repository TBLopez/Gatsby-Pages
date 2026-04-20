export type SfxType = 'type' | 'enter' | 'done';

const STORAGE_KEY = 'sfx';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

function defaultMuted(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'on') return false;
  if (stored === 'off') return true;
  return prefersReducedMotion();
}

type AudioCtor = typeof AudioContext;

declare global {
  interface Window {
    webkitAudioContext?: AudioCtor;
  }
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean;
  private listeners = new Set<(muted: boolean) => void>();

  constructor() {
    this.muted = defaultMuted();
  }

  isMuted(): boolean {
    return this.muted;
  }

  onChange(fn: (muted: boolean) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    localStorage.setItem(STORAGE_KEY, muted ? 'off' : 'on');
    this.listeners.forEach((fn) => fn(muted));
  }

  toggle(): void {
    this.setMuted(!this.muted);
  }

  init(): void {
    if (this.muted) return;
    if (!this.ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  play(type: SfxType): void {
    if (this.muted || !this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const t = ctx.currentTime;
    if (type === 'type') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(220, t + 0.03);
      gain.gain.setValueAtTime(0.015, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      osc.start();
      osc.stop(t + 0.03);
    } else if (type === 'enter') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.15);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.start();
      osc.stop(t + 0.15);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.exponentialRampToValueAtTime(250, t + 0.1);
      gain.gain.setValueAtTime(0.02, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.1);
      osc.start();
      osc.stop(t + 0.1);
    }
  }
}

export const audio = new AudioEngine();
