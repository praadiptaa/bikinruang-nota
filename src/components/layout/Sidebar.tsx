'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Receipt,
  Tags,
  Hammer,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Event', href: '/events', icon: CalendarCheck },
  { name: 'Pengeluaran', href: '/expenses', icon: Receipt },
  { name: 'Kategori', href: '/categories', icon: Tags },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#111111] border-r border-[#e7e5e0] dark:border-[#282828] h-screen sticky top-0 z-30 select-none">
      {/* Bikinruang Atelier Brand Header with New Horizontal Light.png (Enlarged) */}
      <div className="flex items-center px-4 h-24 bg-[#003b6f] border-b border-[#165a96] shadow-xs">
        <Link href="/" className="flex items-center justify-between w-full group gap-2">
          <div className="relative h-12 flex-1 flex items-center">
            <Image
              src="/New Horizontal Light.png"
              alt="Bikinruang Workshop Atelier"
              width={220}
              height={56}
              priority
              className="h-11 w-auto max-w-[180px] object-contain transition-transform group-hover:scale-105"
            />
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ffc700] text-[#111111] font-black uppercase tracking-wider shrink-0 shadow-xs">
            NOTA
          </span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold text-[#8e8e8a] uppercase tracking-wider">
          [ NAVIGATION ]
        </div>
        {navigation.map((item, idx) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all duration-150',
                isActive
                  ? 'bg-[#003b6f] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#111111] dark:hover:text-white hover:bg-[#efece6] dark:hover:bg-[#181818]'
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-[#ffc700]' : 'text-slate-400'
                  )}
                />
                <span>{item.name}</span>
              </div>
              <span className={cn('text-[10px] opacity-60 font-mono', isActive ? 'text-[#ffc700]' : '')}>
                0{idx + 1}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bikinruang Tagline & Atelier Mission Card */}
      <div className="p-3.5 m-3 rounded-2xl bg-[#003b6f] text-white border border-[#165a96] space-y-2 shadow-sm">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#ffc700]">
          <div className="flex items-center gap-1.5">
            <Image
              src="/Default Fill Vertical.png"
              alt="Bikinruang Logo"
              width={20}
              height={20}
              className="w-5 h-5 object-contain rounded bg-white p-0.5"
            />
            <span className="tracking-widest uppercase text-[10px]">[ ATELIER NOTE ]</span>
          </div>
          <Hammer className="w-3.5 h-3.5 text-[#ffc700]" />
        </div>
        <p className="font-serif italic text-xs text-[#e8f1f8] leading-tight">
          “From vision, built unexpected.”
        </p>
        <p className="text-[10px] font-mono text-slate-300 leading-relaxed">
          Pencatatan nota produksi dekorasi, props, stage & activation.
        </p>
      </div>
    </aside>
  );
};
