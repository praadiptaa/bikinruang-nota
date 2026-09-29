'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { EventItem, EventStatus } from '@/types';
import { EventService } from '@/services/events';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: EventItem | null;
}

export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [status, setStatus] = useState<EventStatus>('active');

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description || '');
        setLocation(initialData.location || '');
        setStartDate(initialData.start_date);
        setEndDate(initialData.end_date || '');
        setBudget(initialData.budget || 0);
        setStatus(initialData.status);
      } else {
        setName('');
        setDescription('');
        setLocation('');
        setStartDate(new Date().toISOString().split('T')[0]);
        setEndDate('');
        setBudget(0);
        setStatus('active');
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Nama event wajib diisi';
    if (!startDate) errs.startDate = 'Tanggal mulai wajib diisi';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        location: location.trim() || null,
        start_date: startDate,
        end_date: endDate || null,
        budget: Math.round(budget),
        status,
      };

      if (initialData) {
        await EventService.update(initialData.id, payload);
      } else {
        await EventService.create(payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save event:', err);
      alert('Event gagal disimpan. Silakan periksa koneksi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={initialData ? 'Edit Event' : '+ Buat Event Baru'}
      description="Kelola informasi acara dan anggaran batas maksimal pengeluaran"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Event"
          required
          placeholder="cth: Soundville Festival 2026"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Tanggal Mulai"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            error={errors.startDate}
          />
          <Input
            type="date"
            label="Tanggal Selesai (Opsional)"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <Input
          label="Lokasi Acara (Opsional)"
          placeholder="cth: Kampus ABM, Lapangan Rampal, Malang"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CurrencyInput
            label="Alokasi Anggaran (Budget)"
            value={budget}
            onChange={setBudget}
            placeholder="0"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Status Event
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="planned">Direncanakan (Planned)</option>
              <option value="active">Sedang Berlangsung (Active)</option>
              <option value="completed">Selesai (Completed)</option>
              <option value="archived">Diarsipkan (Archived)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Deskripsi Event (Opsional)
          </label>
          <textarea
            rows={3}
            placeholder="Keterangan singkat seputar event..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            {initialData ? 'Perbarui Event' : 'Simpan Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
