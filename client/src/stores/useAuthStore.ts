import { create } from 'zustand';
import { IUser, UserRole } from '../types';
import { authAPI } from '../lib/api';
import { sounds } from '../lib/sound';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  theme: 'light' | 'dark';
  isSoundEnabled: boolean;
  init: () => Promise<void>;
  setUser: (user: IUser | null, token?: string) => void;
  login: (data: any) => Promise<void>;
  adminLogin: (data: any) => Promise<void>;
  residentLogin: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  switchDemoUser: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  togglePrivacy: () => Promise<void>;
  toggleTheme: () => void;
  toggleSound: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem('communimart_token'),
  isLoading: true,
  theme: (localStorage.getItem('communimart_theme') as 'light' | 'dark') || 'light',
  isSoundEnabled: localStorage.getItem('communimart_sound') !== 'false',

  init: async () => {
    try {
      const savedTheme = localStorage.getItem('communimart_theme') || 'light';
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      const res = await authAPI.me();
      if (res.data.success) {
        set({ user: res.data.user, isLoading: false });
      } else {
        // Fallback to demo login if first time
        const demo = await authAPI.demoLogin('resident');
        localStorage.setItem('communimart_token', demo.data.token);
        set({ user: demo.data.user, token: demo.data.token, isLoading: false });
      }
    } catch {
      try {
        const demo = await authAPI.demoLogin('resident');
        localStorage.setItem('communimart_token', demo.data.token);
        set({ user: demo.data.user, token: demo.data.token, isLoading: false });
      } catch {
        set({ user: null, isLoading: false });
      }
    }
  },

  setUser: (user, token) => {
    if (token) {
      localStorage.setItem('communimart_token', token);
    }
    set({ user, token: token || get().token });
  },

  login: async (credentials) => {
    const res = await authAPI.login(credentials);
    if (res.data.success) {
      localStorage.setItem('communimart_token', res.data.token);
      set({ user: res.data.user, token: res.data.token });
      sounds.playSuccess();
    }
  },

  adminLogin: async (credentials) => {
    const res = await authAPI.adminLogin(credentials);
    if (res.data.success) {
      localStorage.setItem('communimart_token', res.data.token);
      set({ user: res.data.user, token: res.data.token });
      sounds.playSuccess();
    }
  },

  residentLogin: async (credentials) => {
    const res = await authAPI.residentLogin(credentials);
    if (res.data.success) {
      localStorage.setItem('communimart_token', res.data.token);
      set({ user: res.data.user, token: res.data.token });
      sounds.playSuccess();
    }
  },

  register: async (data) => {
    const res = await authAPI.register(data);
    if (res.data.success) {
      localStorage.setItem('communimart_token', res.data.token);
      set({ user: res.data.user, token: res.data.token });
      sounds.playSuccess();
    }
  },

  switchDemoUser: async (role: UserRole) => {
    try {
      const res = await authAPI.demoLogin(role);
      if (res.data.success) {
        localStorage.setItem('communimart_token', res.data.token);
        set({ user: res.data.user, token: res.data.token });
        sounds.playSuccess();
      }
    } catch (err) {
      console.error('Demo switch error:', err);
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch {}
    localStorage.removeItem('communimart_token');
    set({ user: null, token: null });
  },

  togglePrivacy: async () => {
    const current = get().user;
    if (!current) return;
    try {
      const newHide = !current.hideFlatNumber;
      const res = await authAPI.updateProfile({ hideFlatNumber: newHide });
      if (res.data.success) {
        set({ user: res.data.user });
        sounds.playPop();
      }
    } catch (err) {
      console.error('Privacy toggle error:', err);
    }
  },

  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('communimart_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: newTheme });
  },

  toggleSound: () => {
    const res = sounds.toggleSound();
    set({ isSoundEnabled: res });
  }
}));

