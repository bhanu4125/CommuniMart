import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md py-6 px-4 mt-12 text-center text-xs text-zinc-500">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 font-bold text-zinc-700 dark:text-zinc-300">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>CommuniMart • Green Meadows Gated Community</span>
        </div>
        <div className="flex items-center space-x-1 text-[11px]">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for verified society neighbors</span>
        </div>
      </div>
    </footer>
  );
};
