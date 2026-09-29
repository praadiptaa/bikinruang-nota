'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarCheck, Receipt, Tags, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface MobileNavProps {
  onQuickAddExpense?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onQuickAddExpense }) => {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111111]/95 backdrop-blur-md border-t border-[#282828] px-3 py-2 flex items-center justify-around select-none">
      <Link
        href="/"
        className={cn(
          'flex flex-col items-center justify-center p-1.5 rounded-lg text-xs font-mono font-bold transition-colors',
          pathname === '/'
            ? 'text-[#ffc700]'
            : 'text-slate-400'
        )}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[9px] uppercase tracking-wider">Dash</span>
      </Link>

      <Link
        href="/events"
        className={cn(
          'flex flex-col items-center justify-center p-1.5 rounded-lg text-xs font-mono font-bold transition-colors',
          pathname.startsWith('/events')
            ? 'text-[#ffc700]'
            : 'text-slate-400'
        )}
      >
        <CalendarCheck className="w-5 h-5 mb-0.5" />
        <span className="text-[9px] uppercase tracking-wider">Event</span>
      </Link>

      {/* Floating Center Button: + Tambah Nota (Bikinruang Yellow) */}
      <button
        type="button"
        onClick={onQuickAddExpense}
        className="flex flex-col items-center justify-center -mt-6 bg-[#ffc700] text-[#111111] p-3 rounded-full shadow-lg shadow-[#ffc700]/30 hover:bg-white active:scale-95 transition-transform border-2 border-[#111111]"
        aria-label="Tambah Nota Cepat"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      <Link
        href="/expenses"
        className={cn(
          'flex flex-col items-center justify-center p-1.5 rounded-lg text-xs font-mono font-bold transition-colors',
          pathname.startsWith('/expenses')
            ? 'text-[#ffc700]'
            : 'text-slate-400'
        )}
      >
        <Receipt className="w-5 h-5 mb-0.5" />
        <span className="text-[9px] uppercase tracking-wider">Nota</span>
      </Link>

      <Link
        href="/categories"
        className={cn(
          'flex flex-col items-center justify-center p-1.5 rounded-lg text-xs font-mono font-bold transition-colors',
          pathname.startsWith('/categories')
            ? 'text-[#ffc700]'
            : 'text-slate-400'
        )}
      >
        <Tags className="w-5 h-5 mb-0.5" />
        <span className="text-[9px] uppercase tracking-wider">Kategori</span>
      </Link>
    </div>
  );
};
