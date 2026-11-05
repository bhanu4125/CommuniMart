import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 space-y-3 animate-pulse">
      <div className="w-full aspect-[4/3] bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      <div className="space-y-2">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
        <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-16" />
      </div>
    </div>
  );
};
