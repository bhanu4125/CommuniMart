import React from 'react';
import { Check } from 'lucide-react';
import { OrderStatus } from '../types';

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'Requested', label: 'Requested' },
  { status: 'Accepted by Neighbor', label: 'Accepted' },
  { status: 'Ready for Handover', label: 'Ready' },
  { status: 'Completed', label: 'Completed' }
];

interface StepperProps {
  currentStatus: OrderStatus;
}

export const HandoverStepper: React.FC<StepperProps> = ({ currentStatus }) => {
  const currentIndex = STEPS.findIndex(s => s.status === currentStatus);

  return (
    <div className="flex items-center justify-between w-full py-2">
      {STEPS.map((step, idx) => {
        const isDone = idx <= currentIndex;
        return (
          <div key={step.status} className="flex-1 flex flex-col items-center relative">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
              isDone ? 'bg-teal-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
            }`}>
              {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
            </div>
            <span className="text-[10px] font-semibold mt-1 text-zinc-600 dark:text-zinc-400">
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
