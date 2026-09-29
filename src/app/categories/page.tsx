'use client';

import React, { useState, useEffect } from 'react';
import { CategoryService } from '@/services/categories';
import { CategoryItem } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Tags,
  Plus,
  Edit2,
  Check,
  X,
  Archive,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Category
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Editing Category
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await CategoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      await CategoryService.create({
        name: newCatName.trim(),
        description: newCatDesc.trim() || undefined,
      });
      setNewCatName('');
      setNewCatDesc('');
      setIsAdding(false);
      await loadCategories();
    } catch (err) {
      console.error('Add category error:', err);
      alert('Gagal menambahkan kategori');
    }
  };

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description || '');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;

    try {
      await CategoryService.update(id, {
        name: editName.trim(),
        description: editDesc.trim() || undefined,
      });
      setEditingId(null);
      await loadCategories();
    } catch (err) {
      console.error('Update category error:', err);
      alert('Gagal memperbarui kategori');
    }
  };

  const handleToggleArchive = async (id: string) => {
    try {
      await CategoryService.toggleActive(id);
      await loadCategories();
    } catch (err) {
      console.error('Toggle archive error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Kategori Pengeluaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Daftar kategori pos biaya event yang tersimpan di sistem
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto font-semibold"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Tambah Kategori</span>
        </Button>
      </div>

      {/* Info Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40 text-xs text-sky-800 dark:text-sky-300">
        <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-sky-600" />
        <p className="leading-relaxed">
          Kategori yang sudah digunakan oleh nota transaksi tidak dihapus permanen agar integritas laporan keuangan event masa lalu tetap terjaga. Anda dapat mengarsipkan kategori agar tidak muncul pada pilihan input nota baru.
        </p>
      </div>

      {/* Add Category Card Form */}
      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-500/40 shadow-sm space-y-4 animate-in fade-in"
        >
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            + Tambah Kategori Baru
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Kategori"
              placeholder="cth: Merchandise, Keamanan, Genset"
              required
              autoFocus
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <Input
              label="Keterangan / Deskripsi (Opsional)"
              placeholder="cth: Biaya cetak kaos, totebag, dan gantungan kunci"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Batal
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Simpan Kategori
            </Button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
        {loading ? (
          <p className="text-xs text-slate-400 p-8 text-center">Memuat daftar kategori...</p>
        ) : (
          categories.map((cat) => {
            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                {isEditing ? (
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Nama kategori"
                        autoFocus
                      />
                      <Input
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Deskripsi kategori"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleSaveEdit(cat.id)}
                        className="text-xs"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" /> Simpan
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                        className="text-xs"
                      >
                        <X className="w-3.5 h-3.5 mr-1" /> Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm ${
                            cat.is_active
                              ? 'text-slate-900 dark:text-slate-100'
                              : 'text-slate-400 dark:text-slate-600 line-through'
                          }`}
                        >
                          {cat.name}
                        </span>
                        {!cat.is_active && (
                          <Badge variant="warning" size="sm">
                            Diarsipkan
                          </Badge>
                        )}
                      </div>
                      {cat.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Nama / Deskripsi"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleArchive(cat.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          cat.is_active
                            ? 'text-slate-600 dark:text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                            : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                        }`}
                        title={cat.is_active ? 'Arsipkan kategori' : 'Aktifkan kategori'}
                      >
                        {cat.is_active ? (
                          <>
                            <Archive className="w-3.5 h-3.5" />
                            <span>Arsipkan</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Aktifkan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
