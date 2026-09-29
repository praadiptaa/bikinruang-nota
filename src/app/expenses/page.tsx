'use client';

import React, { useState, useEffect } from 'react';
import { ExpenseService } from '@/services/expenses';
import { EventService } from '@/services/events';
import { CategoryService } from '@/services/categories';
import { ExpenseItem, EventItem, CategoryItem } from '@/types';
import { ExpenseList } from '@/components/expenses/ExpenseList';
import { ExpenseFormModal } from '@/components/expenses/ExpenseFormModal';
import { Button } from '@/components/ui/Button';
import { Plus, Receipt } from 'lucide-react';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allExpenses, allEvents, allCategories] = await Promise.all([
        ExpenseService.getAll(),
        EventService.getAll(false),
        CategoryService.getAll(),
      ]);
      setExpenses(allExpenses);
      setEvents(allEvents);
      setCategories(allCategories);
    } catch (err) {
      console.error('Failed to load expenses data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = (expense: ExpenseItem) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteExpense = async (id: string) => {
    await ExpenseService.delete(id);
    await loadData();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Semua Nota & Pengeluaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Daftar lengkap transaksi dari seluruh event yang Anda kelola
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingExpense(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 self-start sm:self-auto font-semibold"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Tambah Nota</span>
        </Button>
      </div>

      {/* Expense List Table with Full Search & Filters */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          Memuat daftar nota & pengeluaran...
        </div>
      ) : (
        <ExpenseList
          expenses={expenses}
          events={events}
          categories={categories}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      )}

      {/* Expense Form Modal */}
      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          loadData();
        }}
        initialData={editingExpense}
      />
    </div>
  );
}
