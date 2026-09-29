'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EventService } from '@/services/events';
import { ExpenseService } from '@/services/expenses';
import { CategoryService } from '@/services/categories';
import { ExpenseItem, CategoryItem, EventFinancialSummary } from '@/types';
import { formatRupiah, formatDate } from '@/lib/utils/formatters';
import { exportEventExpensesToExcel } from '@/lib/utils/exportExcel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseFormModal } from '@/components/expenses/ExpenseFormModal';
import { EventFormModal } from '@/components/events/EventFormModal';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Plus,
  FileSpreadsheet,
  Printer,
  Edit2,
  FolderOpen,
  Trash2,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [summary, setSummary] = useState<EventFinancialSummary | null>(null);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const loadEventData = async () => {
    setLoading(true);
    try {
      const [sum, expList, catList] = await Promise.all([
        EventService.getFinancialSummary(eventId),
        ExpenseService.getByEventId(eventId),
        CategoryService.getAll(),
      ]);
      setSummary(sum);
      setExpenses(expList);
      setCategories(catList);
    } catch (err) {
      console.error('Failed to load event details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (!summary) return;
    exportEventExpensesToExcel(summary.event, expenses, {
      totalBudget: summary.totalBudget,
      totalSpent: summary.totalSpent,
      remainingBudget: summary.remainingBudget,
    });
  };

  const handleDeleteExpense = async (id: string) => {
    await ExpenseService.delete(id);
    await loadEventData();
  };

  const handleDeleteEvent = async () => {
    if (!summary || !summary.event) return;
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus event "${summary.event.name}"?\n\nPERINGATAN: Semua data nota fisik dan pengeluaran pada event ini akan dihapus secara permanen.`
    );
    if (!confirmed) return;

    try {
      await EventService.delete(eventId);
      router.push('/events');
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert('Gagal menghapus event.');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 font-mono text-xs">
        MEMUAT DETAIL EVENT BIKINRUANG...
      </div>
    );
  }

  if (!summary || !summary.event) {
    return (
      <div className="py-20 text-center space-y-4">
        <h3 className="text-lg font-bold text-[#111111] dark:text-[#f8f7f4]">Event tidak ditemukan</h3>
        <Link href="/events">
          <Button variant="primary">Kembali ke Daftar Event</Button>
        </Link>
      </div>
    );
  }

  const { event, totalBudget, totalSpent, remainingBudget, isOverBudget, percentageUsed, expenseCount, categoryBreakdown } = summary;

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/events"
            className="p-2 rounded-xl bg-white dark:bg-[#181818] border border-[#e7e5e0] dark:border-[#282828] text-slate-500 hover:text-[#003b6f] dark:hover:text-[#ffc700] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#8e8e8a] font-bold">[ EVENT ATELIER ]</span>
              <span>•</span>
              <Badge
                variant={event.status === 'active' ? 'navy' : event.status === 'completed' ? 'default' : 'warning'}
                size="sm"
              >
                {event.status}
              </Badge>
            </div>
            <h1 className="text-2xl font-black text-[#111111] dark:text-white uppercase tracking-tight">
              {event.name}
            </h1>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditEventModalOpen(true)}
            className="text-xs font-mono uppercase"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteEvent}
            className="text-xs font-mono uppercase text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            title="Hapus Event Ini"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Hapus
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportExcel}
            className="text-xs font-mono font-bold uppercase text-[#003b6f] dark:text-[#ffc700] border-[#003b6f]/30"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1" /> Excel
          </Button>

          <Link href={`/events/${event.id}/report`}>
            <Button variant="secondary" size="sm" className="text-xs font-mono uppercase">
              <Printer className="w-3.5 h-3.5 mr-1" /> Cetak / PDF
            </Button>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
            className="text-xs font-mono font-bold uppercase"
          >
            <Plus className="w-4 h-4 stroke-[3] mr-1" /> + TAMBAH NOTA
          </Button>
        </div>
      </div>

      {/* Event Metadata Banner */}
      <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-white dark:bg-[#181818] border border-[#e7e5e0] dark:border-[#282828] text-xs font-mono text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#003b6f] dark:text-[#ffc700]" />
          <span>
            {formatDate(event.start_date)}
            {event.end_date && ` - ${formatDate(event.end_date)}`}
          </span>
        </div>
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#003b6f] dark:text-[#ffc700]" />
            <span>{event.location}</span>
          </div>
        )}
        {event.description && (
          <div className="flex items-center gap-2 text-slate-500 font-sans">
            <FolderOpen className="w-4 h-4 text-slate-400" />
            <span className="italic">{event.description}</span>
          </div>
        )}
      </div>

      {/* 1. Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Budget */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-1">
          <span className="text-[10px] font-mono font-bold text-[#8e8e8a] uppercase tracking-wider block">
            [ PAGU ANGGARAN ]
          </span>
          <span className="text-2xl font-black font-mono text-[#111111] dark:text-white">
            {formatRupiah(totalBudget)}
          </span>
          <p className="text-[11px] font-mono text-[#8e8e8a]">Batas pagu event</p>
        </div>

        {/* Spent */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-1">
          <span className="text-[10px] font-mono font-bold text-[#8e8e8a] uppercase tracking-wider block">
            [ REALISASI PENGELUARAN ]
          </span>
          <span className="text-2xl font-black font-mono text-rose-600">
            {formatRupiah(totalSpent)}
          </span>
          <p className="text-[11px] font-mono text-[#8e8e8a]">{expenseCount} nota tercatat</p>
        </div>

        {/* Remaining / Over Budget */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-1">
          <span className="text-[10px] font-mono font-bold text-[#8e8e8a] uppercase tracking-wider block">
            {isOverBudget ? '[ MELEBIHI ANGGARAN ]' : '[ SISA DANA ]'}
          </span>
          <span
            className={`text-2xl font-black font-mono ${
              isOverBudget ? 'text-rose-600' : 'text-[#003b6f] dark:text-[#ffc700]'
            }`}
          >
            {formatRupiah(Math.abs(remainingBudget))}
          </span>
          <p className="text-[11px] font-mono text-[#8e8e8a]">
            {isOverBudget ? 'Perhatian: Over Budget' : 'Saldo tersedia'}
          </p>
        </div>

        {/* Progress % */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-5 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-[#8e8e8a] uppercase tracking-wider">
              [ PERSENTASE ]
            </span>
            <span
              className={`text-xs font-black font-mono ${
                isOverBudget ? 'text-rose-600' : 'text-[#111111] dark:text-white'
              }`}
            >
              {Math.round(percentageUsed)}%
            </span>
          </div>
          <ProgressBar percentage={percentageUsed} isOverBudget={isOverBudget} />
          <p className="text-[11px] font-mono text-[#8e8e8a]">Realisasi pagu</p>
        </div>
      </div>

      {/* 2. Expense Breakdown by Category */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-6 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#e7e5e0] dark:border-[#282828] pb-3">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-[#8e8e8a] uppercase tracking-widest">
                <span className="w-2 h-2 bg-[#ffc700]" />
                <span>RINCIAN POS BIAYA</span>
              </div>
              <h3 className="font-extrabold text-base text-[#111111] dark:text-white uppercase tracking-tight">
                Pengeluaran per Kategori
              </h3>
            </div>
            <span className="text-xs font-mono text-[#8e8e8a]">{categoryBreakdown.length} POS TERPAKAI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryBreakdown.map((cat) => (
              <div
                key={cat.categoryId}
                className="p-3.5 rounded-xl bg-[#f8f7f4] dark:bg-[#111111] border border-[#e7e5e0] dark:border-[#282828] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-slate-200">{cat.categoryName}</span>
                  <span className="text-[#8e8e8a] font-mono text-[11px]">{cat.count} nota</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-black font-mono text-[#111111] dark:text-white">
                    {formatRupiah(cat.totalAmount)}
                  </span>
                  <span className="text-xs font-mono text-[#8e8e8a]">
                    {Math.round(cat.percentageOfTotal)}%
                  </span>
                </div>
                <div className="w-full bg-[#efece6] dark:bg-[#222222] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#003b6f] dark:bg-[#ffc700] h-full rounded-full"
                    style={{ width: `${Math.min(cat.percentageOfTotal, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Expense List Table for this Event */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold uppercase text-[#111111] dark:text-white tracking-tight">
              Daftar Nota Transaksi ({expenses.length})
            </h3>
            <p className="text-xs text-[#8e8e8a] font-mono">
              Arsip nota fisik dan rincian transaksi belanja event ini
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
            className="flex items-center gap-1.5 font-mono uppercase"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ TAMBAH NOTA</span>
          </Button>
        </div>

        <ExpenseList
          expenses={expenses}
          events={summary ? [summary.event] : []}
          categories={categories}
          hideEventColumn={true}
          onEditExpense={(exp) => {
            setEditingExpense(exp);
            setIsExpenseModalOpen(true);
          }}
          onDeleteExpense={handleDeleteExpense}
        />
      </div>

      {/* Expense Modal (Add / Edit) */}
      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={() => {
          loadEventData();
        }}
        presetEventId={eventId}
        initialData={editingExpense}
      />

      {/* Event Edit Modal */}
      <EventFormModal
        isOpen={isEditEventModalOpen}
        onClose={() => setIsEditEventModalOpen(false)}
        onSuccess={() => {
          loadEventData();
        }}
        initialData={event}
      />
    </div>
  );
}
