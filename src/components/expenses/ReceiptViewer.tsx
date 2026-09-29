'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ExpenseItem } from '@/types';
import { formatRupiah, formatDate } from '@/lib/utils/formatters';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2,
  ExternalLink,
  Receipt,
  FileText,
} from 'lucide-react';

interface ReceiptViewerProps {
  isOpen: boolean;
  onClose: () => void;
  expense: ExpenseItem | null;
}

export const ReceiptViewer: React.FC<ReceiptViewerProps> = ({
  isOpen,
  onClose,
  expense,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!expense || !expense.receipt_url) return null;

  const isPdf =
    expense.receipt_path?.toLowerCase().endsWith('.pdf') ||
    expense.receipt_url.toLowerCase().includes('.pdf');

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const handleDownload = () => {
    if (!expense.receipt_url) return;
    const a = document.createElement('a');
    a.href = expense.receipt_url;
    a.download = `nota_${expense.vendor || 'expense'}_${expense.transaction_date}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={isFullscreen ? 'full' : 'xl'}
      title="Detail & Bukti Nota"
      description={`Transaksi pada ${formatDate(expense.transaction_date)}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Receipt Image Preview with Zoom Controls */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
          {/* Viewer Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 text-slate-300">
            <div className="flex items-center gap-1">
              {!isPdf && (
                <>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-emerald-400"
                title="Download Nota"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Canvas */}
          <div className="relative min-h-[360px] max-h-[550px] overflow-auto flex items-center justify-center p-4 bg-slate-950/40">
            {isPdf ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-300 space-y-4">
                <FileText className="w-16 h-16 text-rose-400" />
                <p className="text-sm font-medium">Dokumen Bukti Nota dalam format PDF</p>
                <a
                  href={expense.receipt_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" /> Buka PDF di Tab Baru
                </a>
              </div>
            ) : (
              <div
                className="transition-transform duration-100 ease-out origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={expense.receipt_url}
                  alt={`Bukti nota ${expense.vendor || 'pengeluaran'}`}
                  className="max-h-[500px] w-auto object-contain rounded-lg shadow-md cursor-zoom-in"
                  onClick={handleZoomIn}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Associated Expense Information Card */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Informasi Nota</p>
              <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                {expense.vendor || 'Pengeluaran Event'}
              </h4>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Nominal</span>
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatRupiah(expense.amount)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-slate-400 block mb-0.5">Kategori</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {expense.category?.name || 'Lainnya'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Metode Bayar</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {expense.payment_method || 'Cash'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Tanggal Transaksi</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {formatDate(expense.transaction_date)}
              </span>
            </div>

            {expense.description && (
              <div>
                <span className="text-slate-400 block mb-0.5">Keterangan</span>
                <p className="font-normal text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  {expense.description}
                </p>
              </div>
            )}

            {expense.notes && (
              <div>
                <span className="text-slate-400 block mb-0.5">Catatan Tambahan</span>
                <p className="font-normal text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                  {expense.notes}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Button variant="outline" size="sm" className="w-full" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
