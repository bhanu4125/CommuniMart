import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const ClubhouseAmenitiesCard: React.FC = () => {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-500">Clubhouse Handover Hours</h4>
        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-full">Open Daily</span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal-600" /> Security Gate 1 & 2</span>
          <span className="font-mono font-bold">24 / 7</span>
        </div>
        <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300">
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal-600" /> Clubhouse Reception</span>
          <span className="font-mono font-bold">7:00 AM – 10:00 PM</span>
        </div>
      </div>
    </div>
  );
};
