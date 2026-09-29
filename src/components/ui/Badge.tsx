import React from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'navy' | 'yellow' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-bold font-mono tracking-wider rounded-lg uppercase';

  const variants = {
    default: 'bg-[#efece6] text-[#111111] dark:bg-[#1f1f1f] dark:text-[#f8f7f4] border border-[#dcd9d0] dark:border-[#282828]',
    navy: 'bg-[#003b6f] text-white border border-[#003b6f]',
    yellow: 'bg-[#ffc700] text-[#111111] border border-[#ffc700]/60',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40',
    info: 'bg-[#003b6f]/10 text-[#003b6f] border border-[#003b6f]/20 dark:bg-[#003b6f]/30 dark:text-[#e8f1f8]',
    purple: 'bg-[#003b6f]/10 text-[#003b6f] border border-[#003b6f]/25 dark:bg-[#003b6f]/30 dark:text-[#e8f1f8]',
    outline: 'border border-[#dcd9d0] text-[#71716e] dark:border-[#282828] dark:text-[#8e8e8a]',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
