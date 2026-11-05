import React from 'react';

interface PulseProps {
  count?: number;
}

export const NotificationPulse: React.FC<PulseProps> = ({ count = 1 }) => {
  if (count <= 0) return null;
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
    </span>
  );
};
