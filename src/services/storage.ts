import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { MockStorage } from '@/lib/storage/mockStorage';

export const StorageService = {
  /**
   * Upload a receipt file (Image or PDF)
   */
  async uploadReceipt(file: File, eventId: string, expenseId: string): Promise<{ path: string; url: string }> {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const sanitizedFileName = `${Date.now()}.${fileExt}`;
    const filePath = `receipts/${eventId}/${expenseId}/${sanitizedFileName}`;

    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { error: uploadError } = await client.storage
          .from('receipts')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!uploadError) {
          const { data } = client.storage.from('receipts').getPublicUrl(filePath);
          return {
            path: filePath,
            url: data.publicUrl,
          };
        }
        console.error('Supabase storage upload error:', uploadError);
      }
    }

    // Fallback to MockStorage (base64 data URL)
    return MockStorage.uploadReceipt(file, eventId, expenseId);
  },

  /**
   * Get public or cached URL for receipt
   */
  getReceiptUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { data } = client.storage.from('receipts').getPublicUrl(path);
        return data.publicUrl;
      }
    }
    return MockStorage.getReceiptUrl(path);
  },

  /**
   * Delete receipt file
   */
  async deleteReceipt(path: string): Promise<boolean> {
    if (!path) return true;
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      if (client) {
        const { error } = await client.storage.from('receipts').remove([path]);
        if (error) {
          console.error('Supabase storage remove error:', error);
        }
      }
    }
    return true;
  }
};
