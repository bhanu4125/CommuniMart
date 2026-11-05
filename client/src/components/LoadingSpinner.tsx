import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = size === 'sm' ? 'w-4 h-4 border-2' : size === 'lg' ? 'w-8 h-8 border-3' : 'w-6 h-6 border-2';
  return (
    <div className={`${dimensions} border-teal-600 border-t-transparent rounded-full animate-spin`} />
  );
};
