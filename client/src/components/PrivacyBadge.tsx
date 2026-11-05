import React from 'react';
import { ShieldCheck, EyeOff } from 'lucide-react';

interface PrivacyBadgeProps {
  isMasked: boolean;
  flatNumber: string;
}

export const PrivacyBadge: React.FC<PrivacyBadgeProps> = ({ isMasked, flatNumber }) => {
  if (isMasked) {
    return (
      <span className="inline-flex items-center space-x-1 text-[11px] text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md font-medium">
        <EyeOff className="w-3 h-3 text-amber-500" />
        <span>Door Masked</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 text-[11px] text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded-md font-medium">
      <ShieldCheck className="w-3 h-3 text-teal-600" />
      <span>Unit {flatNumber}</span>
    </span>
  );
};
