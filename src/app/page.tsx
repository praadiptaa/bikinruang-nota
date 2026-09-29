'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ReportService } from '@/services/reports';
import { DashboardSummary, ExpenseItem } from '@/types';
import { formatRupiah, formatDateShort } from '@/lib/utils/formatters';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ReceiptViewer } from '@/components/expenses/ReceiptViewer';
import { EventFormModal } from '@/components/events/EventFormModal';
import {
  CalendarCheck,
  Wallet,
  TrendingDown,
  PiggyBank,
  Plus,
  ArrowRight,
  Receipt,
  Hammer,
  Image as ImageIcon,
} from 'lucide-react';

export default function DashboardPage() {
  const { openQuickExpense, refreshKey } = useApp();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceiptExpense, setSelectedReceiptExpense] = useState<ExpenseItem | null>(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [refreshKey]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await ReportService.getDashboardSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const isOverTotalBudget = summary ? summary.totalRemaining < 0 : false;

  return (
    <div className="space-y-8">
      {/* Bikinruang Hero Banner */}
      <div className="relative overflow-hidden bg-[#003b6f] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#165a96]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-dark-grid opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-[11px] font-mono font-bold tracking-widest uppercase text-[#ffc700]">
              <span className="w-2 h-2 rounded-full bg-[#ffc700] animate-pulse" />
              <span>BIKINRUANG ATELIER • FINANCIAL & NOTA OPERATIONS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase leading-tight">
              Pencatatan Nota Event<span className="text-[#ffc700]">.</span>
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-[#e8f1f8]/90">
              “From vision, built unexpected.”
            </p>
            <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed pt-1">
              Pantau realisasi anggaran produksi, dekorasi, props, dan arsip bukti foto nota fisik tiap event.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <Button
              variant="outline"
              onClick={() => setIsEventModalOpen(true)}
              className="text-xs font-mono font-bold uppercase tracking-wider bg-transparent text-white border-white/30 hover:bg-white/10"
            >
              + Buat Event
            </Button>
            <Button
              variant="primary"
              onClick={() => openQuickExpense()}
              className="text-xs font-mono font-bold uppercase tracking-wider px-5 py-3 shadow-md"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ TAMBAH NOTA</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Events */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[#8e8e8a] uppercase tracking-wider">
              [ 01 // EVENT AKTIF ]
            </span>
            <div className="p-2 rounded-xl bg-[#003b6f]/10 text-[#003b6f] dark:text-[#ffc700]">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-2xl font-black text-[#111111] dark:text-white">
              {loading ? '...' : summary?.activeEventsCount || 0}
            </span>
            <p className="text-[11px] text-[#8e8e8a] font-mono">
              dari total {summary?.totalEventsCount || 0} event
            </p>
          </div>
        </div>

        {/* Card 2: Total Budget */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[#8e8e8a] uppercase tracking-wider">
              [ 02 // TOTAL ANGGARAN ]
            </span>
            <div className="p-2 rounded-xl bg-[#ffc700]/20 text-[#111111] dark:text-[#ffc700]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-2xl font-black text-[#111111] dark:text-white">
              {loading ? '...' : formatRupiah(summary?.totalBudget)}
            </span>
            <p className="text-[11px] text-[#8e8e8a] font-mono">Pagu alokasi event</p>
          </div>
        </div>

        {/* Card 3: Total Spent */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[#8e8e8a] uppercase tracking-wider">
              [ 03 // REALISASI NOTA ]
            </span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-2xl font-black text-rose-600">
              {loading ? '...' : formatRupiah(summary?.totalSpent)}
            </span>
            <p className="text-[11px] text-[#8e8e8a] font-mono">Total nota keluar</p>
          </div>
        </div>

        {/* Card 4: Remaining Budget */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-[#8e8e8a] uppercase tracking-wider">
              [ 04 // SISA ANGGARAN ]
            </span>
            <div
              className={`p-2 rounded-xl ${
                isOverTotalBudget
                  ? 'bg-rose-50 dark:bg-rose-950 text-rose-600'
                  : 'bg-[#003b6f]/10 text-[#003b6f] dark:text-[#ffc700]'
              }`}
            >
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <span
              className={`text-2xl font-black ${
                isOverTotalBudget
                  ? 'text-rose-600'
                  : 'text-[#003b6f] dark:text-[#ffc700]'
              }`}
            >
              {loading ? '...' : formatRupiah(summary?.totalRemaining)}
            </span>
            <p className="text-[11px] text-[#8e8e8a] font-mono">
              {isOverTotalBudget ? 'Status: Over Budget' : 'Status: Anggaran Terkendali'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: Event Spending & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Event Spending Overview (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#181818] rounded-2xl p-6 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e7e5e0] dark:border-[#282828] pb-3">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#8e8e8a] uppercase tracking-widest">
                <span className="w-2 h-2 bg-[#ffc700]" />
                <span>REALISASI ANGGARAN</span>
              </div>
              <h3 className="font-extrabold text-base text-[#111111] dark:text-white uppercase tracking-tight">
                Event Spending Overview
              </h3>
            </div>
            <Link
              href="/events"
              className="text-xs font-mono font-bold text-[#003b6f] dark:text-[#ffc700] hover:underline flex items-center gap-1 uppercase"
            >
              <span>SEMUA EVENT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {summary?.eventSpendingSummaries.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center font-mono">Belum ada event tercatat</p>
            ) : (
              summary?.eventSpendingSummaries.map((item) => (
                <div
                  key={item.event.id}
                  className="p-3.5 rounded-xl bg-[#f8f7f4] dark:bg-[#111111] border border-[#e7e5e0] dark:border-[#282828] space-y-2 hover:border-[#003b6f] dark:hover:border-[#ffc700] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Link
                        href={`/events/${item.event.id}`}
                        className="font-bold text-sm text-[#111111] dark:text-white hover:text-[#003b6f] dark:hover:text-[#ffc700] transition-colors uppercase tracking-tight"
                      >
                        {item.event.name}
                      </Link>
                      <div className="flex items-center gap-2 text-[11px] text-[#8e8e8a] font-mono">
                        <span>{formatDateShort(item.event.start_date)}</span>
                        {item.event.location && <span>• {item.event.location}</span>}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-[#111111] dark:text-white block font-mono">
                        {formatRupiah(item.spent)}{' '}
                        <span className="font-normal text-[#8e8e8a]">/ {formatRupiah(item.budget)}</span>
                      </span>
                      {item.isOverBudget && (
                        <span className="text-[10px] font-bold font-mono text-rose-600">
                          OVER BUDGET!
                        </span>
                      )}
                    </div>
                  </div>

                  <ProgressBar percentage={item.percentage} isOverBudget={item.isOverBudget} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Category Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#181818] rounded-2xl p-6 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e7e5e0] dark:border-[#282828] pb-3">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#8e8e8a] uppercase tracking-widest">
                <span className="w-2 h-2 bg-[#ffc700]" />
                <span>ALOKASI POS BIAYA</span>
              </div>
              <h3 className="font-extrabold text-base text-[#111111] dark:text-white uppercase tracking-tight">
                Pengeluaran per Kategori
              </h3>
            </div>
            <Link
              href="/categories"
              className="text-xs font-mono font-bold text-[#003b6f] dark:text-[#ffc700] hover:underline flex items-center gap-1 uppercase"
            >
              <span>KATEGORI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {summary?.categorySummaries.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center font-mono">Belum ada pengeluaran</p>
            ) : (
              summary?.categorySummaries.slice(0, 6).map((cat) => (
                <div key={cat.categoryName} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{cat.categoryName}</span>
                    <span className="font-bold font-mono text-slate-900 dark:text-white">
                      {formatRupiah(cat.totalAmount)}{' '}
                      <span className="text-[10px] font-normal text-[#8e8e8a]">
                        ({Math.round(cat.percentage)}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-[#efece6] dark:bg-[#222222] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#003b6f] dark:bg-[#ffc700] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. Recent Expenses Section */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-6 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#e7e5e0] dark:border-[#282828] pb-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#8e8e8a] uppercase tracking-widest">
              <span className="w-2 h-2 bg-[#ffc700]" />
              <span>TRANSAKSI TERKINI</span>
            </div>
            <h3 className="font-extrabold text-base text-[#111111] dark:text-white uppercase tracking-tight">
              Daftar Nota Terbaru
            </h3>
          </div>
          <Link
            href="/expenses"
            className="text-xs font-mono font-bold text-[#003b6f] dark:text-[#ffc700] hover:underline flex items-center gap-1 uppercase"
          >
            <span>LIHAT SEMUA NOTA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-[#e7e5e0] dark:divide-[#282828]">
          {summary?.recentExpenses.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center font-mono">Belum ada nota yang tercatat.</p>
          ) : (
            summary?.recentExpenses.map((exp) => (
              <div
                key={exp.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-[#efece6]/40 dark:hover:bg-[#222222]/40 transition-colors rounded-xl px-2"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#003b6f]/10 dark:bg-[#003b6f]/30 flex items-center justify-center text-[#003b6f] dark:text-[#ffc700] flex-shrink-0">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-bold text-sm text-[#111111] dark:text-white truncate">
                      {exp.vendor || 'Pengeluaran Event'}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-[#8e8e8a] font-mono">
                      <span>{formatDateShort(exp.transaction_date)}</span>
                      <span>•</span>
                      <span className="text-[#003b6f] dark:text-[#ffc700] font-semibold">
                        {exp.category?.name || 'Lainnya'}
                      </span>
                      {exp.event && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">
                            {exp.event.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-[#111111] dark:text-white block">
                      {formatRupiah(exp.amount)}
                    </span>
                    <span className="text-[10px] text-[#8e8e8a] font-mono">
                      {exp.payment_method || 'Cash'}
                    </span>
                  </div>

                  {exp.receipt_url && (
                    <button
                      type="button"
                      onClick={() => setSelectedReceiptExpense(exp)}
                      className="p-2 rounded-xl bg-[#efece6] hover:bg-[#ffc700] dark:bg-[#282828] dark:hover:bg-[#ffc700] text-[#111111] hover:text-[#111111] transition-colors"
                      title="Lihat Bukti Foto Nota"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Creating New Event */}
      <EventFormModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSuccess={() => {
          loadDashboardData();
        }}
      />

      {/* Modal for Viewing Receipt Photo */}
      <ReceiptViewer
        isOpen={Boolean(selectedReceiptExpense)}
        onClose={() => setSelectedReceiptExpense(null)}
        expense={selectedReceiptExpense}
      />
    </div>
  );
}
