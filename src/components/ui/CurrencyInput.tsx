'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

interface CurrencyInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = '0',
  required,
  className,
  autoFocus,
}) => {
  // Local display string for comfortable typing
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (value === 0 && !displayValue) {
      setDisplayValue('');
    } else if (value !== undefined && value !== null) {
      setDisplayValue(value ? value.toLocaleString('id-ID') : '');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    if (!rawDigits) {
      setDisplayValue('');
      onChange(0);
      return;
    }

    const numeric = parseInt(rawDigits, 10);
    setDisplayValue(numeric.toLocaleString('id-ID'));
    onChange(numeric);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <span className="absolute left-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 select-none">
          Rp
        </span>
        <input
          type="text"
          inputMode="numeric"
          autoFocus={autoFocus}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-4 py-2 text-sm font-semibold rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 transition-colors focus:outline-none focus:ring-2 focus:border-transparent',
            error
              ? 'border-rose-400 focus:ring-rose-500/30 dark:border-rose-500'
              : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20',
            className
          )}
        />
      </div>
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
