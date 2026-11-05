import React from 'react';
import { ShieldCheck, HeartHandshake, Sparkles, X } from 'lucide-react';

interface GuidelinesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityGuidelinesModal: React.FC<GuidelinesProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 max-w-md w-full border border-zinc-200 dark:border-zinc-800 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-black text-lg text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-teal-600" />
            <span>Community Guidelines</span>
          </h3>
          <button onClick={onClose}><X className="w-5 h-5 text-zinc-400" /></button>
        </div>
        <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/50">
            <p className="font-bold text-teal-800 dark:text-teal-200">1. Mutual Trust & Respect</p>
            <p className="text-[11px] text-teal-700 dark:text-teal-300">We are all neighbors living in the same society. Be courteous and punctual.</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50">
            <p className="font-bold text-emerald-800 dark:text-emerald-200">2. Accurate Representations</p>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-300">Disclose item condition honestly. Mention ingredients for food.</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50">
            <p className="font-bold text-amber-800 dark:text-amber-200">3. Safe Handover Practices</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-300">Utilize the Clubhouse locker or Gatehouse drop-box for contactless exchanges.</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
};
