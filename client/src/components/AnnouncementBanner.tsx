import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';

interface AnnouncementBannerProps {
  message?: string;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  message = 'Society Maintenance scheduled this Sunday 10am-12pm. Clubhouse locker pick-up is open 24/7!'
}) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-700 text-white text-xs px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-2 truncate mx-auto">
        <Megaphone className="w-3.5 h-3.5 shrink-0 text-amber-300" />
        <span className="font-semibold truncate">{message}</span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded hover:bg-white/10 transition shrink-0 ml-2"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
