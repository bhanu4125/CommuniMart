import React, { useState } from 'react';
import { Info } from 'lucide-react';

export const DoorMaskTooltip: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 ml-1"
        aria-label="Privacy information"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-52 p-2.5 rounded-xl bg-zinc-900 text-zinc-100 text-[10px] leading-relaxed shadow-xl border border-zinc-700 z-50">
          Door masking keeps your flat number private from public browsing until an order is placed and accepted.
        </div>
      )}
    </div>
  );
};
