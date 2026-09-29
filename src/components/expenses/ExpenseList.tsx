'use client';

import React, { useState, useMemo } from 'react';
import { ExpenseItem, CategoryItem, EventItem } from '@/types';
import { formatRupiah, formatDateShort } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ReceiptViewer } from './ReceiptViewer';
import {
  Search,
  Image as ImageIcon,
  Edit2,
  Trash2,
  FilterX,
  FileText,
} from 'lucide-react';

interface ExpenseListProps {
  expenses: ExpenseItem[];
  events?: EventItem[];
  categories?: CategoryItem[];
  onEditExpense: (expense: ExpenseItem) => void;
  onDeleteExpense: (expenseId: string) => Promise<void>;
  hideEventColumn?: boolean;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  events = [],
  categories = [],
  onEditExpense,
  onDeleteExpense,
  hideEventColumn = false,
}) => {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  // Modal states
  const [viewingReceiptExpense, setViewingReceiptExpense] = useState<ExpenseItem | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered & Sorted Expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        // Search filter (vendor, description, notes)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchVendor = item.vendor?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchNotes = item.notes?.toLowerCase().includes(q);
          if (!matchVendor && !matchDesc && !matchNotes) return false;
        }

        // Event filter
        if (selectedEventId !== 'ALL' && item.event_id !== selectedEventId) {
          return false;
        }

        // Category filter
        if (selectedCategoryId !== 'ALL' && item.category_id !== selectedCategoryId) {
          return false;
        }

        // Payment method filter
        if (selectedPaymentMethod !== 'ALL' && item.payment_method !== selectedPaymentMethod) {
          return false;
        }

        // Date range filter
        if (startDate && item.transaction_date < startDate) return false;
        if (endDate && item.transaction_date > endDate) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.transaction_date.localeCompare(a.transaction_date);
        if (sortBy === 'oldest') return a.transaction_date.localeCompare(b.transaction_date);
        if (sortBy === 'highest') return (b.amount || 0) - (a.amount || 0);
        if (sortBy === 'lowest') return (a.amount || 0) - (b.amount || 0);
        return 0;
      });
  }, [
    expenses,
    searchQuery,
    selectedEventId,
    selectedCategoryId,
    selectedPaymentMethod,
    startDate,
    endDate,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedEventId('ALL');
    setSelectedCategoryId('ALL');
    setSelectedPaymentMethod('ALL');
    setStartDate('');
    setEndDate('');
    setSortBy('newest');
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedEventId !== 'ALL' ||
    selectedCategoryId !== 'ALL' ||
    selectedPaymentMethod !== 'ALL' ||
    Boolean(startDate) ||
    Boolean(endDate) ||
    sortBy !== 'newest';

  const handleDeleteConfirm = async () => {
    if (!deletingExpenseId) return;
    setIsDeleting(true);
    try {
      await onDeleteExpense(deletingExpenseId);
      setDeletingExpenseId(null);
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Gagal menghapus pengeluaran');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-[#181818] rounded-2xl p-4 border border-[#e7e5e0] dark:border-[#282828] shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-4">
            <Input
              placeholder="Cari vendor, nota, catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftAddon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Event Filter (if enabled) */}
          {!hideEventColumn && events.length > 0 && (
            <div className="md:col-span-3">
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-xl border border-[#e7e5e0] dark:border-[#282828] bg-white dark:bg-[#111111] text-[#111111] dark:text-[#f8f7f4] focus:outline-none focus:ring-2 focus:ring-[#ffc700]/30"
              >
                <option value="ALL">SEMUA EVENT</option>
                {events.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category Filter */}
          <div className={hideEventColumn ? 'md:col-span-4' : 'md:col-span-3'}>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-xl border border-[#e7e5e0] dark:border-[#282828] bg-white dark:bg-[#111111] text-[#111111] dark:text-[#f8f7f4] focus:outline-none focus:ring-2 focus:ring-[#ffc700]/30"
            >
              <option value="ALL">SEMUA KATEGORI</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-xl border border-[#e7e5e0] dark:border-[#282828] bg-white dark:bg-[#111111] text-[#111111] dark:text-[#f8f7f4] focus:outline-none focus:ring-2 focus:ring-[#ffc700]/30"
            >
              <option value="newest">TERBARU</option>
              <option value="oldest">TERLAMA</option>
              <option value="highest">NOMINAL TERTINGGI</option>
              <option value="lowest">NOMINAL TERENDAH</option>
            </select>
          </div>
        </div>

        {/* Extended Filters Row (Date Range & Reset) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#e7e5e0] dark:border-[#282828] text-xs font-mono">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[#8e8e8a]">DARI:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 rounded-lg border border-[#e7e5e0] dark:border-[#282828] bg-white dark:bg-[#111111] text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#8e8e8a]">SAMPAI:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 rounded-lg border border-[#e7e5e0] dark:border-[#282828] bg-white dark:bg-[#111111] text-xs"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 text-[#8e8e8a] hover:text-rose-600 transition-colors font-bold uppercase tracking-wider"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>RESET FILTER</span>
            </button>
          )}
        </div>
      </div>

      {/* Expense Items Container */}
      {filteredExpenses.length === 0 ? (
        <div className="bg-white dark:bg-[#181818] rounded-2xl p-12 text-center border border-[#e7e5e0] dark:border-[#282828]">
          <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-extrabold uppercase text-[#111111] dark:text-white">
            Belum ada nota
          </h4>
          <p className="text-xs text-[#8e8e8a] font-mono mt-1 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'Tidak ditemukan nota yang sesuai dengan parameter filter.'
              : 'Belum ada nota yang tercatat untuk daftar ini.'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-[#e7e5e0] dark:border-[#282828] shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e7e5e0] dark:border-[#282828] text-[10px] font-mono font-bold text-[#8e8e8a] uppercase tracking-widest bg-[#f8f7f4] dark:bg-[#111111]">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Keterangan</th>
                  <th className="py-3 px-4">Metode Bayar</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4 text-center">Nota</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7e5e0] dark:divide-[#282828] text-sm">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#efece6]/40 dark:hover:bg-[#222222]/50 transition-colors">
                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap text-xs">
                      {formatDateShort(exp.transaction_date)}
                    </td>

                    {/* Vendor */}
                    <td className="py-3.5 px-4 font-bold text-[#111111] dark:text-white whitespace-nowrap">
                      {exp.vendor || '-'}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge variant="navy" size="sm">
                        {exp.category?.name || 'Lainnya'}
                      </Badge>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs max-w-xs truncate">
                      {exp.description || '-'}
                    </td>

                    {/* Payment Method */}
                    <td className="py-3.5 px-4 text-[#8e8e8a] font-mono text-xs whitespace-nowrap">
                      {exp.payment_method || 'Cash'}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-black font-mono text-[#111111] dark:text-white text-right whitespace-nowrap">
                      {formatRupiah(exp.amount)}
                    </td>

                    {/* Receipt Thumbnail */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {exp.receipt_url ? (
                        <button
                          type="button"
                          onClick={() => setViewingReceiptExpense(exp)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ffc700] text-[#111111] text-[10px] font-mono font-bold uppercase hover:bg-[#003b6f] hover:text-white transition-colors shadow-2xs"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Lihat</span>
                        </button>
                      ) : (
                        <span className="text-[#8e8e8a] text-xs font-mono">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onEditExpense(exp)}
                          className="p-1.5 text-slate-400 hover:text-[#003b6f] dark:hover:text-[#ffc700] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit Nota"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingExpenseId(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Hapus Nota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="lg:hidden divide-y divide-[#e7e5e0] dark:divide-[#282828]">
            {filteredExpenses.map((exp) => (
              <div key={exp.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-bold text-sm text-[#111111] dark:text-white">
                      {exp.vendor || 'Pengeluaran Event'}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-[#8e8e8a] font-mono">
                      <span>{formatDateShort(exp.transaction_date)}</span>
                      <span>•</span>
                      <Badge variant="navy" size="sm">
                        {exp.category?.name || 'Lainnya'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-[#111111] dark:text-white">
                      {formatRupiah(exp.amount)}
                    </span>
                    <p className="text-[10px] text-[#8e8e8a] font-mono">{exp.payment_method || 'Cash'}</p>
                  </div>
                </div>

                {exp.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {exp.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1">
                  <div>
                    {exp.receipt_url && (
                      <button
                        type="button"
                        onClick={() => setViewingReceiptExpense(exp)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#003b6f] dark:text-[#ffc700]"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>LIHAT NOTA</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditExpense(exp)}
                      className="p-1 text-slate-400 hover:text-slate-600"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingExpenseId(exp.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receipt Viewer Modal */}
      <ReceiptViewer
        isOpen={Boolean(viewingReceiptExpense)}
        onClose={() => setViewingReceiptExpense(null)}
        expense={viewingReceiptExpense}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingExpenseId)}
        onClose={() => setDeletingExpenseId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Pengeluaran / Nota?"
        message="Data pengeluaran beserta file bukti nota akan dihapus dari perhitungan total anggaran."
        confirmText="Ya, Hapus"
        isLoading={isDeleting}
      />
    </div>
  );
};
