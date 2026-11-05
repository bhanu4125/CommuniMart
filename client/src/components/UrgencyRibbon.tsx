import React from 'react';
import { AlertCircle } from 'lucide-react';

interface RibbonProps {
  category: string;
}

export const UrgencyRibbon: React.FC<RibbonProps> = ({ category }) => {
  if (category !== 'Society Alert') return null;

  return (
    <div className="flex items-center space-x-1 text-[10px] font-black text-rose-700 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-300/40">
      <AlertCircle className="w-3 h-3 text-rose-600 animate-pulse" />
      <span>Urgent Broadcast</span>
    </div>
  );
};
