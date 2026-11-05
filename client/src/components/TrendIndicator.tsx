import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendProps {
  percentage: number;
  isPositive?: boolean;
}

export const TrendIndicator: React.FC<TrendProps> = ({ percentage, isPositive = true }) => {
  return (
    <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
      isPositive ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950' : 'text-rose-700 bg-rose-50 dark:bg-rose-950'
    }`}>
      {isPositive ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
      {percentage}%
    </span>
  );
};
