'use client';

import React from 'react';
import Image from 'next/image';
import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ExpenseFormModal } from '@/components/expenses/ExpenseFormModal';

const AppLayoutInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isQuickExpenseOpen,
    openQuickExpense,
    closeQuickExpense,
    selectedEventIdForExpense,
    triggerRefresh,
  } = useApp();

  return (
    <div className="flex min-h-screen bg-studio-white dark:bg-workshop-black text-workshop-black dark:text-studio-white bg-workshop-grid">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        <Header onOpenQuickExpense={() => openQuickExpense()} />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>

      {/* Mobile Bottom Navigation with center quick + Nota button */}
      <MobileNav onQuickAddExpense={() => openQuickExpense()} />

      {/* Global Quick Expense Modal */}
      <ExpenseFormModal
        isOpen={isQuickExpenseOpen}
        onClose={closeQuickExpense}
        onSuccess={() => {
          triggerRefresh();
        }}
        presetEventId={selectedEventIdForExpense}
      />
      {/* Floating Bikinruang Atelier Badge at bottom corner */}
      <a
        href="https://bikinruang-web.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        title="Bikinruang Workshop Atelier"
        className="fixed bottom-3 right-3 z-30 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#181818]/95 backdrop-blur-md border border-[#e7e5e0] dark:border-[#282828] shadow-lg shadow-black/5 hover:border-[#ffc700] dark:hover:border-[#ffc700] hover:scale-102 transition-all select-none group"
      >
        <Image
          src="/Default Fill Vertical.png"
          alt="Bikinruang Logo"
          width={22}
          height={22}
          className="w-5 h-5 object-contain rounded-xs transition-transform group-hover:scale-110"
        />
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-tight text-[#111111] dark:text-white leading-none">
            BIKINRUANG<span className="text-[#ffc700]">.</span>
          </span>
          <span className="text-[8px] font-mono text-[#8e8e8a] tracking-wider uppercase leading-none mt-0.5">
            ATELIER
          </span>
        </div>
      </a>
    </div>
  );
};

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </AppProvider>
  );
};
