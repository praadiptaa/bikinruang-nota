'use client';

import React from 'react';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onOpenQuickExpense?: () => void;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onOpenQuickExpense,
  actions,
}) => {

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-[#e7e5e0] dark:border-[#282828] bg-[#f8f7f4]/95 dark:bg-[#111111]/95 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
      {/* Title & Subtitle + Mobile Brand */}
      <div className="flex items-center gap-2.5">
        <div className="md:hidden">
          <Image
            src="/Default Fill Vertical.png"
            alt="Bikinruang"
            width={28}
            height={28}
            className="w-7 h-7 object-contain rounded"
          />
        </div>
        <div>
          {title && <h2 className="text-base font-extrabold uppercase tracking-tight text-[#111111] dark:text-white leading-tight">{title}</h2>}
          {subtitle && <p className="text-xs text-[#8e8e8a]">{subtitle}</p>}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {actions}

        {/* Primary Action Button: + Tambah Nota (Bikinruang Yellow) */}
        {onOpenQuickExpense && (
          <Button
            size="sm"
            variant="primary"
            onClick={onOpenQuickExpense}
            className="flex items-center gap-1.5 font-bold uppercase font-mono text-xs px-3.5 py-2 shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ TAMBAH NOTA</span>
          </Button>
        )}
      </div>
    </header>
  );
};
