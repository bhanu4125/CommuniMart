import { create } from 'zustand';

interface SoundState {
  enabled: boolean;
  toggleSound: () => void;
}

export const useSoundStore = create<SoundState>((set) => ({
  enabled: localStorage.getItem('sound_enabled') !== 'false',
  toggleSound: () => set((state) => {
    const next = !state.enabled;
    localStorage.setItem('sound_enabled', String(next));
    return { enabled: next };
  })
}));
