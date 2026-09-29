import { EventItem, EventFinancialSummary } from '@/types';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { MockStorage } from '@/lib/storage/mockStorage';
import { ExpenseService } from './expenses';
import { CategoryService } from './categories';

export const EventService = {
  async getAll(includeArchived = false): Promise<EventItem[]> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        let query = client.from('events').select('*').order('start_date', { ascending: false });
        if (!includeArchived) {
          query = query.neq('status', 'archived');
        }
        const { data, error } = await query;
        if (!error && data) {
          return data as EventItem[];
        }
        console.error('Supabase get events error:', error);
      }
    }
    const events = MockStorage.getEvents();
    if (!includeArchived) {
      return events.filter((e) => e.status !== 'archived');
    }
    return events;
  },

  async getById(id: string): Promise<EventItem | null> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client.from('events').select('*').eq('id', id).single();
        if (!error && data) {
          return data as EventItem;
        }
      }
    }
    return MockStorage.getEventById(id);
  },

  async create(data: Omit<EventItem, 'id' | 'created_at' | 'updated_at'>): Promise<EventItem> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { data: created, error } = await client
          .from('events')
          .insert([data])
          .select()
          .single();
        if (!error && created) {
          return created as EventItem;
        }
        console.error('Supabase create event error:', error);
      }
    }
    return MockStorage.saveEvent(data);
  },

  async update(id: string, data: Partial<Omit<EventItem, 'id' | 'created_at' | 'updated_at'>>): Promise<EventItem> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { data: updated, error } = await client
          .from('events')
          .update(data)
          .eq('id', id)
          .select()
          .single();
        if (!error && updated) {
          return updated as EventItem;
        }
        console.error('Supabase update event error:', error);
      }
    }
    const existing = MockStorage.getEventById(id);
    if (!existing) throw new Error('Event not found');
    return MockStorage.saveEvent({ ...existing, ...data, id });
  },

  async archive(id: string): Promise<EventItem | null> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from('events')
          .update({ status: 'archived' })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          return data as EventItem;
        }
      }
    }
    return MockStorage.archiveEvent(id);
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { error } = await client.from('events').delete().eq('id', id);
        if (!error) return true;
        console.error('Supabase delete event error:', error);
      }
    }
    return MockStorage.deleteEvent(id);
  },

  async getFinancialSummary(eventId: string): Promise<EventFinancialSummary | null> {
    const event = await this.getById(eventId);
    if (!event) return null;

    const expenses = await ExpenseService.getByEventId(eventId);
    const categories = await CategoryService.getAll();

    const totalBudget = Number(event.budget) || 0;
    const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const remainingBudget = totalBudget - totalSpent;
    const isOverBudget = remainingBudget < 0;
    const overBudgetAmount = isOverBudget ? Math.abs(remainingBudget) : 0;
    const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    // Calculate category breakdown
    const categoryMap: { [key: string]: { name: string; totalAmount: number; count: number } } = {};
    for (const exp of expenses) {
      const catId = exp.category_id || 'unknown';
      const catName = exp.category?.name || categories.find((c) => c.id === catId)?.name || 'Lainnya';
      if (!categoryMap[catId]) {
        categoryMap[catId] = { name: catName, totalAmount: 0, count: 0 };
      }
      categoryMap[catId].totalAmount += Number(exp.amount) || 0;
      categoryMap[catId].count += 1;
    }

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([catId, val]) => ({
        categoryId: catId,
        categoryName: val.name,
        totalAmount: val.totalAmount,
        count: val.count,
        percentageOfTotal: totalSpent > 0 ? (val.totalAmount / totalSpent) * 100 : 0,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    return {
      event,
      totalBudget,
      totalSpent,
      remainingBudget,
      isOverBudget,
      overBudgetAmount,
      percentageUsed,
      expenseCount: expenses.length,
      categoryBreakdown,
    };
  },
};
