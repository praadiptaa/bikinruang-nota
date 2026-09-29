import { ExpenseItem } from '@/types';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { MockStorage } from '@/lib/storage/mockStorage';
import { StorageService } from './storage';

export const ExpenseService = {
  async getAll(): Promise<ExpenseItem[]> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from('expenses')
          .select(`
            *,
            category:categories(*),
            event:events(*)
          `)
          .order('transaction_date', { ascending: false });
        if (!error && data) {
          return data.map((item) => ({
            ...item,
            receipt_url: item.receipt_path ? StorageService.getReceiptUrl(item.receipt_path) : null,
          })) as ExpenseItem[];
        }
        console.error('Supabase get expenses error:', error);
      }
    }
    const expenses = MockStorage.getExpenses();
    return expenses.map((item) => ({
      ...item,
      receipt_url: item.receipt_path ? StorageService.getReceiptUrl(item.receipt_path) : item.receipt_url,
    }));
  },

  async getByEventId(eventId: string): Promise<ExpenseItem[]> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from('expenses')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('event_id', eventId)
          .order('transaction_date', { ascending: false });
        if (!error && data) {
          return data.map((item) => ({
            ...item,
            receipt_url: item.receipt_path ? StorageService.getReceiptUrl(item.receipt_path) : null,
          })) as ExpenseItem[];
        }
        console.error('Supabase get expenses by event error:', error);
      }
    }
    const expenses = MockStorage.getExpenses(eventId);
    return expenses.map((item) => ({
      ...item,
      receipt_url: item.receipt_path ? StorageService.getReceiptUrl(item.receipt_path) : item.receipt_url,
    }));
  },

  async getById(id: string): Promise<ExpenseItem | null> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from('expenses')
          .select(`
            *,
            category:categories(*),
            event:events(*)
          `)
          .eq('id', id)
          .single();
        if (!error && data) {
          return {
            ...data,
            receipt_url: data.receipt_path ? StorageService.getReceiptUrl(data.receipt_path) : null,
          } as ExpenseItem;
        }
      }
    }
    const item = MockStorage.getExpenseById(id);
    if (!item) return null;
    return {
      ...item,
      receipt_url: item.receipt_path ? StorageService.getReceiptUrl(item.receipt_path) : item.receipt_url,
    };
  },

  async create(data: Omit<ExpenseItem, 'id' | 'created_at' | 'updated_at' | 'category' | 'event'>): Promise<ExpenseItem> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        // Strip undefined/empty fields
        const insertPayload = {
          event_id: data.event_id,
          category_id: data.category_id,
          vendor: data.vendor || null,
          transaction_date: data.transaction_date,
          description: data.description || null,
          amount: Math.round(Number(data.amount)),
          payment_method: data.payment_method || null,
          receipt_path: data.receipt_path || null,
          notes: data.notes || null,
        };
        const { data: created, error } = await client
          .from('expenses')
          .insert([insertPayload])
          .select(`*, category:categories(*), event:events(*)`)
          .single();
        if (!error && created) {
          return created as ExpenseItem;
        }
        console.error('Supabase create expense error:', error);
      }
    }
    return MockStorage.saveExpense(data);
  },

  async update(id: string, data: Partial<Omit<ExpenseItem, 'id' | 'created_at' | 'updated_at' | 'category' | 'event'>>): Promise<ExpenseItem> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const updatePayload: Record<string, unknown> = { ...data };
        if (data.amount !== undefined) {
          updatePayload.amount = Math.round(Number(data.amount));
        }
        const { data: updated, error } = await client
          .from('expenses')
          .update(updatePayload)
          .eq('id', id)
          .select(`*, category:categories(*), event:events(*)`)
          .single();
        if (!error && updated) {
          return updated as ExpenseItem;
        }
        console.error('Supabase update expense error:', error);
      }
    }
    const existing = MockStorage.getExpenseById(id);
    if (!existing) throw new Error('Expense not found');
    return MockStorage.saveExpense({ ...existing, ...data, id });
  },

  async delete(id: string): Promise<boolean> {
    const item = await this.getById(id);
    if (item?.receipt_path) {
      // Clean up receipt storage if exists
      try {
        await StorageService.deleteReceipt(item.receipt_path);
      } catch (err) {
        console.warn('Could not delete receipt file:', err);
      }
    }

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { error } = await client.from('expenses').delete().eq('id', id);
        if (!error) return true;
        console.error('Supabase delete expense error:', error);
      }
    }
    return MockStorage.deleteExpense(id);
  },
};
