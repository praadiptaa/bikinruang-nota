import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'navy';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold tracking-tight rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    const variants = {
      // Signature Bikinruang Industrial Yellow with Navy Hover
      primary:
        'bg-[#ffc700] text-[#111111] hover:bg-[#003b6f] hover:text-white border border-[#ffc700] hover:border-[#003b6f] shadow-xs focus:ring-[#ffc700]',
      // Bikinruang Deep Blueprint Navy
      secondary:
        'bg-[#003b6f] text-white hover:bg-[#165a96] border border-[#003b6f] shadow-xs focus:ring-[#003b6f]',
      navy:
        'bg-[#003b6f] text-white hover:bg-[#ffc700] hover:text-[#111111] border border-[#003b6f] hover:border-[#ffc700] shadow-xs',
      outline:
        'border border-[#dcd9d0] dark:border-[#282828] text-[#111111] dark:text-[#f8f7f4] bg-white dark:bg-[#181818] hover:bg-[#efece6] dark:hover:bg-[#222222] focus:ring-slate-400',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 shadow-xs focus:ring-rose-500',
      ghost:
        'text-slate-700 dark:text-slate-300 hover:bg-[#efece6] dark:hover:bg-[#1f1f1f] focus:ring-slate-400',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
      icon: 'p-2 w-9 h-9',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
