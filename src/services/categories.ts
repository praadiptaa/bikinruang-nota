import { CategoryItem } from '@/types';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { MockStorage } from '@/lib/storage/mockStorage';

export const CategoryService = {
  async getAll(): Promise<CategoryItem[]> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { data, error } = await client
          .from('categories')
          .select('*')
          .order('name', { ascending: true });
        if (!error && data) {
          return data as CategoryItem[];
        }
        console.error('Supabase get categories error:', error);
      }
    }
    return MockStorage.getCategories();
  },

  async create(data: { name: string; description?: string }): Promise<CategoryItem> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { data: created, error } = await client
          .from('categories')
          .insert([{ name: data.name, description: data.description, is_active: true }])
          .select()
          .single();
        if (!error && created) {
          return created as CategoryItem;
        }
        console.error('Supabase create category error:', error);
      }
    }
    return MockStorage.saveCategory(data);
  },

  async update(id: string, data: { name: string; description?: string }): Promise<CategoryItem> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { data: updated, error } = await client
          .from('categories')
          .update({ name: data.name, description: data.description })
          .eq('id', id)
          .select()
          .single();
        if (!error && updated) {
          return updated as CategoryItem;
        }
        console.error('Supabase update category error:', error);
      }
    }
    return MockStorage.saveCategory({ id, ...data });
  },

  async toggleActive(id: string): Promise<CategoryItem | null> {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        // Fetch current active state
        const { data: current } = await client.from('categories').select('is_active').eq('id', id).single();
        if (current) {
          const { data: updated, error } = await client
            .from('categories')
            .update({ is_active: !current.is_active })
            .eq('id', id)
            .select()
            .single();
          if (!error && updated) {
            return updated as CategoryItem;
          }
        }
      }
    }
    return MockStorage.toggleCategoryActive(id);
  },
};
