'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { EventItem, CategoryItem, ExpenseItem, PaymentMethod } from '@/types';
import { EventService } from '@/services/events';
import { CategoryService } from '@/services/categories';
import { ExpenseService } from '@/services/expenses';
import { StorageService } from '@/services/storage';
import { PAYMENT_METHODS } from '@/lib/storage/mockStorage';
import { UploadCloud, CheckCircle2, Trash2, Zap, FileText } from 'lucide-react';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  presetEventId?: string;
  initialData?: ExpenseItem | null;
}

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  presetEventId,
  initialData,
}) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [eventId, setEventId] = useState<string>('');
  const [transactionDate, setTransactionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [vendor, setVendor] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | string>('Cash');
  const [notes, setNotes] = useState<string>('');

  // Receipt file state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [existingReceiptPath, setExistingReceiptPath] = useState<string | null>(null);

  // Fast entry vs Detailed mode
  const [isDetailedMode, setIsDetailedMode] = useState<boolean>(false);

  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen, presetEventId, initialData]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [eventsList, categoriesList] = await Promise.all([
        EventService.getAll(false),
        CategoryService.getAll(),
      ]);
      setEvents(eventsList);
      const activeCats = categoriesList.filter((c) => c.is_active);
      setCategories(activeCats);

      if (initialData) {
        // Edit mode
        setEventId(initialData.event_id);
        setTransactionDate(initialData.transaction_date);
        setCategoryId(initialData.category_id);
        setAmount(initialData.amount);
        setVendor(initialData.vendor || '');
        setDescription(initialData.description || '');
        setPaymentMethod(initialData.payment_method || 'Cash');
        setNotes(initialData.notes || '');
        setExistingReceiptPath(initialData.receipt_path || null);
        setReceiptPreview(initialData.receipt_url || null);
        setIsDetailedMode(true);
      } else {
        // Create mode
        setEventId(presetEventId || (eventsList.length > 0 ? eventsList[0].id : ''));
        setTransactionDate(new Date().toISOString().split('T')[0]);
        setCategoryId(activeCats.length > 0 ? activeCats[0].id : '');
        setAmount(0);
        setVendor('');
        setDescription('');
        setPaymentMethod('Cash');
        setNotes('');
        setReceiptFile(null);
        setReceiptPreview(null);
        setExistingReceiptPath(null);
        setIsDetailedMode(false);
      }
      setErrors({});
    } catch (err) {
      console.error('Error loading form dependencies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onload = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setExistingReceiptPath(null);
  };

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!eventId) errs.eventId = 'Pilih event terlebih dahulu';
    if (!transactionDate) errs.transactionDate = 'Tanggal transaksi wajib diisi';
    if (!categoryId) errs.categoryId = 'Pilih kategori pengeluaran';
    if (!amount || amount <= 0) errs.amount = 'Nominal harus lebih besar dari Rp0';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      let receiptPath = existingReceiptPath;
      const expenseId = initialData?.id || `exp-${Date.now()}`;

      if (receiptFile) {
        const uploadResult = await StorageService.uploadReceipt(receiptFile, eventId, expenseId);
        receiptPath = uploadResult.path;
      }

      const payload = {
        event_id: eventId,
        category_id: categoryId,
        vendor: vendor.trim() || null,
        transaction_date: transactionDate,
        description: description.trim() || null,
        amount: Math.round(amount),
        payment_method: paymentMethod || 'Cash',
        receipt_path: receiptPath,
        notes: notes.trim() || null,
      };

      if (initialData) {
        await ExpenseService.update(initialData.id, payload);
      } else {
        await ExpenseService.create(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save expense:', err);
      alert('Nota gagal disimpan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={initialData ? 'EDIT NOTA PENGELUARAN' : '+ TAMBAH NOTA EVENT'}
      description="Catat biaya produksi atelier dan lampirkan bukti foto nota fisik"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mode Toggle: Fast Entry vs Detail Lengkap */}
        {!initialData && (
          <div className="flex items-center justify-between pb-2 border-b border-[#e7e5e0] dark:border-[#282828]">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#8e8e8a]">
              <Zap className="w-3.5 h-3.5 text-[#ffc700]" />
              <span>{isDetailedMode ? '[ MODE DETAIL LENGKAP ]' : '[ MODE CEPAT (FAST-ENTRY) ]'}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsDetailedMode(!isDetailedMode)}
              className="text-xs font-mono font-bold text-[#003b6f] dark:text-[#ffc700] hover:underline uppercase"
            >
              {isDetailedMode ? '← Mode Cepat' : '+ Detail Lengkap'}
            </button>
          </div>
        )}

        {/* 1. Event & Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#111111] dark:text-[#f8f7f4] mb-1.5">
              Event <span className="text-rose-500">*</span>
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              disabled={loading || Boolean(presetEventId)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#e7e5e0] dark:border-[#282828] bg-white dark:bg-[#111111] text-[#111111] dark:text-[#f8f7f4] focus:outline-none focus:ring-2 focus:ring-[#ffc700]/30"
            >
              {events.length === 0 && <option value="">Tidak ada event aktif</option>}
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name}
                </option>
              ))}
            </select>
            {errors.eventId && <p className="text-xs text-rose-500 mt-1 font-mono">{errors.eventId}</p>}
          </div>

          <div>
            <Input
              type="date"
              label="TANGGAL NOTA"
              required
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              error={errors.transactionDate}
            />
          </div>
        </div>

        {/* 2. Nominal & Kategori in Bikinruang Atelier Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#003b6f]/5 dark:bg-[#003b6f]/20 p-4 rounded-2xl border-2 border-[#003b6f]/20 dark:border-[#003b6f]/40">
          <div>
            <CurrencyInput
              label="NOMINAL TRANSAKSI (RUPIAH)"
              required
              autoFocus={!initialData}
              value={amount}
              onChange={setAmount}
              error={errors.amount}
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#111111] dark:text-[#f8f7f4] mb-1.5">
              Kategori Pos Biaya <span className="text-rose-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#e7e5e0] dark:border-[#282828] bg-white dark:bg-[#111111] text-[#111111] dark:text-[#f8f7f4] focus:outline-none focus:ring-2 focus:ring-[#ffc700]/30"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="text-xs text-rose-500 mt-1 font-mono">{errors.categoryId}</p>}
          </div>
        </div>

        {/* 3. Foto / Bukti Nota */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#111111] dark:text-[#f8f7f4] mb-1.5">
            Foto Bukti Nota Fisik (Opsional)
          </label>

          {receiptPreview ? (
            <div className="relative group rounded-xl overflow-hidden border border-[#e7e5e0] dark:border-[#282828] bg-[#f8f7f4] dark:bg-[#181818] p-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {receiptPreview.startsWith('data:application/pdf') || receiptPreview.endsWith('.pdf') ? (
                  <div className="w-12 h-12 rounded-lg bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600">
                    <FileText className="w-6 h-6" />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={receiptPreview}
                    alt="Preview nota"
                    className="w-12 h-12 object-cover rounded-lg shadow-xs"
                  />
                )}
                <div>
                  <p className="text-xs font-bold text-[#111111] dark:text-white">
                    {receiptFile ? receiptFile.name : 'Bukti Nota Terlampir'}
                  </p>
                  <p className="text-[10px] font-mono text-[#003b6f] dark:text-[#ffc700] flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3 h-3" /> SIAP DISIMPAN
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveReceipt}
                className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                title="Hapus foto nota"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-[#e7e5e0] dark:border-[#282828] hover:border-[#ffc700] dark:hover:border-[#ffc700] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#f8f7f4]/60 dark:bg-[#181818]/60 group">
              <UploadCloud className="w-8 h-8 text-[#8e8e8a] group-hover:text-[#ffc700] transition-colors mb-1.5" />
              <p className="text-xs font-bold font-mono text-[#111111] dark:text-[#f8f7f4] uppercase">
                Pilih foto nota atau ambil dari kamera
              </p>
              <p className="text-[10px] font-mono text-[#8e8e8a]">Format: JPG, PNG, WEBP, atau PDF</p>
              <input
                type="file"
                accept="image/*,application/pdf"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* 4. Optional / Detailed Fields */}
        {isDetailedMode && (
          <div className="space-y-4 pt-2 border-t border-[#e7e5e0] dark:border-[#282828]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="VENDOR / SUPPLIER / PENYEDIA"
                placeholder="cth: Toko Besi, Toko Kayu, Rental Sound"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
              />

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#111111] dark:text-[#f8f7f4] mb-1.5">
                  Metode Pembayaran
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#e7e5e0] dark:border-[#282828] bg-white dark:bg-[#111111] text-[#111111] dark:text-[#f8f7f4] focus:outline-none focus:ring-2 focus:ring-[#ffc700]/30"
                >
                  {PAYMENT_METHODS.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label="KETERANGAN ITEM / PRODUKSI"
              placeholder="cth: Beli multiplek 12mm 10 lembar & sekrup"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#111111] dark:text-[#f8f7f4] mb-1.5">
                Catatan Tambahan
              </label>
              <textarea
                rows={2}
                placeholder="cth: Disimpan panitia produksi / DP lunas"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#e7e5e0] dark:border-[#282828] bg-white dark:bg-[#111111] text-[#111111] dark:text-[#f8f7f4] placeholder-[#8e8e8a] focus:outline-none focus:ring-2 focus:ring-[#ffc700]/30 resize-none"
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e7e5e0] dark:border-[#282828]">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting} className="font-mono uppercase">
            {initialData ? 'PERBARUI NOTA' : 'SIMPAN NOTA'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
