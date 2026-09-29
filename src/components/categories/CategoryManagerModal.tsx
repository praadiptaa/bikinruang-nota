'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { CategoryItem } from '@/types';
import { CategoryService } from '@/services/categories';
import { Plus, Edit2, Check, X, Archive, CheckCircle } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  // New category inputs
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Edit category inputs
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

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

  const handleAddCategory = async (e: React.FormEvent) => {
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
      onSuccess();
    } catch (err) {
      console.error('Failed to add category:', err);
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
      onSuccess();
    } catch (err) {
      console.error('Failed to update category:', err);
      alert('Gagal memperbarui kategori');
    }
  };

  const handleToggleArchive = async (id: string) => {
    try {
      await CategoryService.toggleActive(id);
      await loadCategories();
      onSuccess();
    } catch (err) {
      console.error('Failed to toggle category active status:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title="Kelola Kategori Pengeluaran"
      description="Kategori tersimpan di database dan dapat diatur sesuai kebutuhan event"
    >
      <div className="space-y-4">
        {/* Add Category Section */}
        {isAdding ? (
          <form onSubmit={handleAddCategory} className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-3">
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">+ Tambah Kategori Baru</h4>
            <Input
              placeholder="Nama Kategori (cth: Konsumsi, Equipment)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              required
              autoFocus
            />
            <Input
              placeholder="Deskripsi singkat (opsional)"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Simpan Kategori
              </Button>
            </div>
          </form>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-1.5 border-dashed"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Kategori Baru</span>
          </Button>
        )}

        {/* Categories List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[350px] overflow-y-auto pr-1">
          {loading ? (
            <p className="text-xs text-center text-slate-400 py-6">Memuat kategori...</p>
          ) : (
            categories.map((cat) => {
              const isEditing = editingId === cat.id;

              return (
                <div key={cat.id} className="py-2.5 flex items-center justify-between gap-3 group">
                  {isEditing ? (
                    <div className="flex-1 space-y-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Nama kategori"
                        autoFocus
                      />
                      <Input
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Deskripsi"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleSaveEdit(cat.id)}
                          className="h-7 text-xs px-2.5"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Simpan
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                          className="h-7 text-xs px-2"
                        >
                          <X className="w-3.5 h-3.5 mr-1" /> Batal
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold text-sm ${
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
                          <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                            {cat.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Ubah nama / deskripsi"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleArchive(cat.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            cat.is_active
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                              : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                          }`}
                          title={cat.is_active ? 'Arsipkan kategori' : 'Aktifkan kembali'}
                        >
                          {cat.is_active ? (
                            <Archive className="w-3.5 h-3.5" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
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

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
};
