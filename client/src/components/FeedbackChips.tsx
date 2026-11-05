import React from 'react';

interface ChipsProps {
  options: string[];
  selected: string[];
  onToggle: (opt: string) => void;
}

export const FeedbackChips: React.FC<ChipsProps> = ({ options, selected, onToggle }) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
              active ? 'bg-teal-600 text-white border-teal-600' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};
