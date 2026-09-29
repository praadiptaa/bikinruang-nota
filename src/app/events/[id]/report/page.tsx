'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { EventService } from '@/services/events';
import { ExpenseService } from '@/services/expenses';
import { EventFinancialSummary, ExpenseItem } from '@/types';
import { formatRupiah, formatDate } from '@/lib/utils/formatters';
import { exportEventExpensesToExcel } from '@/lib/utils/exportExcel';
import { Button } from '@/components/ui/Button';
import {
  Printer,
  FileSpreadsheet,
  ArrowLeft,
  Calendar,
  MapPin,
  Receipt,
  Download,
} from 'lucide-react';

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default function EventReportPage({ params }: ReportPageProps) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [summary, setSummary] = useState<EventFinancialSummary | null>(null);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [eventId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sum, expList] = await Promise.all([
        EventService.getFinancialSummary(eventId),
        ExpenseService.getByEventId(eventId),
      ]);
      setSummary(sum);
      setExpenses(expList);
    } catch (err) {
      console.error('Failed to load report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (!summary) return;
    exportEventExpensesToExcel(summary.event, expenses, {
      totalBudget: summary.totalBudget,
      totalSpent: summary.totalSpent,
      remainingBudget: summary.remainingBudget,
    });
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Menyiapkan laporan event...</div>;
  }

  if (!summary) {
    return <div className="p-12 text-center text-slate-400">Data laporan tidak ditemukan.</div>;
  }

  const { event, totalBudget, totalSpent, remainingBudget, isOverBudget, categoryBreakdown } = summary;

  return (
    <div className="space-y-6">
      {/* Top Action Header (Hidden during Print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href={`/events/${eventId}`}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              Laporan Keuangan Event
            </h1>
            <p className="text-xs text-slate-400">Siap dicetak atau disimpan sebagai PDF</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportExcel} className="text-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            <span>Export Excel</span>
          </Button>

          <Button variant="primary" size="sm" onClick={handlePrint} className="text-xs font-semibold">
            <Printer className="w-3.5 h-3.5 mr-1" />
            <span>Cetak / Simpan PDF</span>
          </Button>
        </div>
      </div>

      {/* Printable Sheet Container */}
      <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 max-w-4xl mx-auto">
        {/* Report Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                NOTA-EVENT
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                LAPORAN KEUANGAN & PENGELUARAN
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight pt-1">
              {event.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(event.start_date)}
                {event.end_date && ` - ${formatDate(event.end_date)}`}
              </span>
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {event.location}
                </span>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500">
            <p>Tanggal Cetak:</p>
            <p className="font-bold text-slate-800">{formatDate(new Date().toISOString())}</p>
            <p className="mt-1">Status: <span className="font-semibold uppercase">{event.status}</span></p>
          </div>
        </div>

        {/* Budget Summary Box */}
        <div className="grid grid-cols-3 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div>
            <span className="text-xs text-slate-500 block mb-0.5">Pagu Anggaran</span>
            <span className="text-lg font-black text-slate-900">{formatRupiah(totalBudget)}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block mb-0.5">Total Pengeluaran</span>
            <span className="text-lg font-black text-rose-600">{formatRupiah(totalSpent)}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 block mb-0.5">
              {isOverBudget ? 'Melebihi Budget' : 'Sisa Anggaran'}
            </span>
            <span
              className={`text-lg font-black ${
                isOverBudget ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {formatRupiah(Math.abs(remainingBudget))}
            </span>
          </div>
        </div>

        {/* Category Breakdown Table */}
        {categoryBreakdown.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Ringkasan per Kategori
            </h3>
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3 text-center">Jumlah Nota</th>
                  <th className="py-2.5 px-3 text-right">Total (Rp)</th>
                  <th className="py-2.5 px-3 text-right">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categoryBreakdown.map((cat) => (
                  <tr key={cat.categoryId}>
                    <td className="py-2 px-3 font-semibold text-slate-800">{cat.categoryName}</td>
                    <td className="py-2 px-3 text-center text-slate-600">{cat.count}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {formatRupiah(cat.totalAmount)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-600">
                      {Math.round(cat.percentageOfTotal)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Detailed Itemized Transactions Table */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Rincian Seluruh Transaksi & Pengeluaran ({expenses.length} Transaksi)
          </h3>
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="py-2.5 px-3 w-8">No</th>
                <th className="py-2.5 px-3">Tanggal</th>
                <th className="py-2.5 px-3">Vendor</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Keterangan</th>
                <th className="py-2.5 px-3">Metode</th>
                <th className="py-2.5 px-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp, idx) => (
                <tr key={exp.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 text-slate-400 font-medium">{idx + 1}</td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                    {exp.transaction_date}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{exp.vendor || '-'}</td>
                  <td className="py-2.5 px-3 text-slate-700">{exp.category?.name || 'Lainnya'}</td>
                  <td className="py-2.5 px-3 text-slate-600">{exp.description || '-'}</td>
                  <td className="py-2.5 px-3 text-slate-600">{exp.payment_method || 'Cash'}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                    {formatRupiah(exp.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                <td colSpan={6} className="py-3 px-3 text-right uppercase text-slate-700">
                  Total Pengeluaran:
                </td>
                <td className="py-3 px-3 text-right text-rose-600 text-sm whitespace-nowrap">
                  {formatRupiah(totalSpent)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Signatures for Event Production */}
        <div className="grid grid-cols-2 gap-12 pt-12 text-center text-xs text-slate-600">
          <div>
            <p className="mb-14">Dibuat Oleh (Finance / Operasional):</p>
            <p className="font-bold underline text-slate-900">( ............................................ )</p>
          </div>
          <div>
            <p className="mb-14">Mengetahui (Ketua / Koordinator Event):</p>
            <p className="font-bold underline text-slate-900">( ............................................ )</p>
          </div>
        </div>
      </div>
    </div>
  );
}
