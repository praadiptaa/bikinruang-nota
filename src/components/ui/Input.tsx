import React from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftAddon, rightAddon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-sm">
              {leftAddon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full px-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:outline-none focus:ring-2 focus:border-transparent',
              leftAddon ? 'pl-9' : '',
              rightAddon ? 'pr-9' : '',
              error
                ? 'border-rose-400 focus:ring-rose-500/30 dark:border-rose-500'
                : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20',
              className
            )}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-sm">
              {rightAddon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-400 dark:text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
