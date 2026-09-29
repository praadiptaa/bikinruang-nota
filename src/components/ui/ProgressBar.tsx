import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  percentage: number;
  className?: string;
  isOverBudget?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  className,
  isOverBudget = false,
}) => {
  const clamped = Math.min(Math.max(percentage, 0), 100);

  let fillColor = 'bg-[#003b6f] dark:bg-[#ffc700]';
  if (isOverBudget || percentage > 100) {
    fillColor = 'bg-rose-600 animate-pulse';
  } else if (percentage >= 80) {
    fillColor = 'bg-[#ffc700] dark:bg-[#ffc700]';
  }

  return (
    <div className={cn('w-full bg-[#efece6] dark:bg-[#222222] rounded-full h-2.5 overflow-hidden border border-[#dcd9d0]/60 dark:border-[#282828]', className)}>
      <div
        className={cn('h-full transition-all duration-300 rounded-full', fillColor)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};
