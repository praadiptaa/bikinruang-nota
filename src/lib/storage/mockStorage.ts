import { EventItem, CategoryItem, ExpenseItem } from '@/types';

const STORAGE_KEYS = {
  EVENTS: 'ine_events_v1',
  CATEGORIES: 'ine_categories_v1',
  EXPENSES: 'ine_expenses_v1',
  RECEIPTS: 'ine_receipts_v1',
};

export const DEFAULT_CATEGORIES: Omit<CategoryItem, 'created_at' | 'updated_at'>[] = [
  { id: 'cat-1', name: 'Konsumsi', description: 'Makanan, minuman, konsumsi crew & guest', is_active: true },
  { id: 'cat-2', name: 'Transportasi', description: 'Bensin, tol, tiket, sewa mobil, grab/ojol', is_active: true },
  { id: 'cat-3', name: 'Akomodasi', description: 'Hotel, penginapan, homestay panitia/pengisi acara', is_active: true },
  { id: 'cat-4', name: 'Equipment', description: 'Sewa sound system, lighting, panggung, genset', is_active: true },
  { id: 'cat-5', name: 'Produksi', description: 'Material panggung, konstruksi, tenda, barikade', is_active: true },
  { id: 'cat-6', name: 'Venue', description: 'Sewa gedung, lapangan, kebersihan tempat', is_active: true },
  { id: 'cat-7', name: 'Talent', description: 'Fee artis, pembicara, MC, pengisi acara, rider', is_active: true },
  { id: 'cat-8', name: 'Dekorasi', description: 'Dekorasi panggung, photobooth, instalasi artistik', is_active: true },
  { id: 'cat-9', name: 'Printing', description: 'Banner, spanduk, ID card, tiket fisik, flyer', is_active: true },
  { id: 'cat-10', name: 'Dokumentasi', description: 'Fotografer, videografer, aftermovie, memory card', is_active: true },
  { id: 'cat-11', name: 'Perizinan', description: 'Izin keramaian polisi, satpol PP, pemda, asuransi', is_active: true },
  { id: 'cat-12', name: 'Operasional', description: 'Komunikasi, pulsa, ATK, medis/P3K, petty cash', is_active: true },
  { id: 'cat-13', name: 'Entertainment', description: 'Game, doorprize, souvenir, gift merchandise', is_active: true },
  { id: 'cat-14', name: 'Lainnya', description: 'Biaya lain-lain yang tidak tergolong kategori di atas', is_active: true },
];

export const PAYMENT_METHODS = [
  'Cash',
  'Transfer Bank',
  'E-Wallet',
  'Debit Card',
  'Credit Card',
  'Other',
] as const;

// Sample Seed Events
const SEED_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    name: 'Soundville Festival 2026',
    description: 'Festival musik tahunan kampus dengan musisi nasional dan pentas seni mahasiswa.',
    location: 'Kampus ABM, Malang',
    start_date: '2026-09-25',
    end_date: '2026-09-26',
    budget: 20000000,
    status: 'active',
    created_at: '2026-09-01T08:00:00Z',
    updated_at: '2026-09-25T14:30:00Z',
  },
  {
    id: 'evt-2',
    name: 'Corporate Gathering 2026',
    description: 'Acara temu tahunan seluruh divisi perusahaan dengan gala dinner & team building.',
    location: 'Batu Paradise Resort',
    start_date: '2026-10-15',
    end_date: '2026-10-16',
    budget: 15000000,
    status: 'active',
    created_at: '2026-09-05T09:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'evt-3',
    name: 'Music Showcase Live Acoustic',
    description: 'Konser intim akustik mini showcase akhir pekan.',
    location: 'Ruang Kreatif Hub',
    start_date: '2026-11-02',
    end_date: '2026-11-02',
    budget: 10000000,
    status: 'planned',
    created_at: '2026-09-10T11:00:00Z',
    updated_at: '2026-09-10T11:00:00Z',
  },
];

// Sample Seed Expenses
const SEED_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    event_id: 'evt-1',
    category_id: 'cat-1',
    vendor: 'Toko ABC',
    transaction_date: '2026-09-25',
    description: 'Konsumsi nasi box crew persiapan stage',
    amount: 350000,
    payment_method: 'Cash',
    receipt_path: 'sample-receipt-1',
    receipt_url: 'https://images.unsplash.com/photo-1554415707-9e44667efe05?auto=format&fit=crop&w=800&q=80',
    notes: 'Nota fisik sudah distempel lunas',
    created_at: '2026-09-25T10:00:00Z',
    updated_at: '2026-09-25T10:00:00Z',
  },
  {
    id: 'exp-2',
    event_id: 'evt-1',
    category_id: 'cat-2',
    vendor: 'Grab Express & Car',
    transaction_date: '2026-09-25',
    description: 'Antar jemput dokumen perizinan & kabel audio',
    amount: 125000,
    payment_method: 'E-Wallet',
    receipt_path: 'sample-receipt-2',
    receipt_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    notes: 'Bukti transfer e-wallet terlampir',
    created_at: '2026-09-25T11:30:00Z',
    updated_at: '2026-09-25T11:30:00Z',
  },
  {
    id: 'exp-3',
    event_id: 'evt-1',
    category_id: 'cat-9',
    vendor: 'Print XYZ Digital Printing',
    transaction_date: '2026-09-24',
    description: 'Cetak ID Card panitia, wristband tiket, dan spanduk gate',
    amount: 200000,
    payment_method: 'Transfer Bank',
    receipt_path: 'sample-receipt-3',
    receipt_url: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?auto=format&fit=crop&w=800&q=80',
    notes: 'Invoice no #PRNT-9981',
    created_at: '2026-09-24T15:00:00Z',
    updated_at: '2026-09-24T15:00:00Z',
  },
  {
    id: 'exp-4',
    event_id: 'evt-1',
    category_id: 'cat-4',
    vendor: 'Rental Audio Max Power',
    transaction_date: '2026-09-25',
    description: 'Sewa line array sound system 10.000 watt & 4 mic wireless',
    amount: 2500000,
    payment_method: 'Transfer Bank',
    receipt_path: 'sample-receipt-4',
    receipt_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    notes: 'DP 50% sudah dibayar via BCA',
    created_at: '2026-09-25T09:00:00Z',
    updated_at: '2026-09-25T09:00:00Z',
  },
  {
    id: 'exp-5',
    event_id: 'evt-1',
    category_id: 'cat-12',
    vendor: 'Apotek & Toko Berkah',
    transaction_date: '2026-09-25',
    description: 'Isi ulang kotak P3K medis & lakban hitam panggung',
    amount: 185000,
    payment_method: 'Cash',
    receipt_path: null,
    receipt_url: null,
    notes: 'Beli langsung di lokasi',
    created_at: '2026-09-25T13:00:00Z',
    updated_at: '2026-09-25T13:00:00Z',
  },
  {
    id: 'exp-6',
    event_id: 'evt-2',
    category_id: 'cat-6',
    vendor: 'Batu Paradise Resort',
    transaction_date: '2026-09-18',
    description: 'Deposit ballroom & sound banquet',
    amount: 6000000,
    payment_method: 'Transfer Bank',
    receipt_path: null,
    receipt_url: null,
    notes: 'Invoice DP 40%',
    created_at: '2026-09-18T14:00:00Z',
    updated_at: '2026-09-18T14:00:00Z',
  },
  {
    id: 'exp-7',
    event_id: 'evt-2',
    category_id: 'cat-13',
    vendor: 'Vendor Kaos & Merchandise',
    transaction_date: '2026-09-20',
    description: 'Polo shirt seragam 50 pcs',
    amount: 2250000,
    payment_method: 'Transfer Bank',
    receipt_path: null,
    receipt_url: null,
    notes: '',
    created_at: '2026-09-20T10:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'exp-8',
    event_id: 'evt-3',
    category_id: 'cat-7',
    vendor: 'Akustik Duo & Soundman',
    transaction_date: '2026-09-22',
    description: 'Down payment fee performer',
    amount: 4000000,
    payment_method: 'Transfer Bank',
    receipt_path: null,
    receipt_url: null,
    notes: 'Pelunasan H-1 event',
    created_at: '2026-09-22T16:00:00Z',
    updated_at: '2026-09-22T16:00:00Z',
  },
];

// Helper to check browser environment
const isBrowser = typeof window !== 'undefined';

export class MockStorage {
  private static init(): void {
    if (!isBrowser) return;

    // Initialize Categories
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      const now = new Date().toISOString();
      const initialCats: CategoryItem[] = DEFAULT_CATEGORIES.map((c) => ({
        ...c,
        created_at: now,
        updated_at: now,
      }));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCats));
    }

    // Initialize Events
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
    }

    // Initialize Expenses
    if (!localStorage.getItem(STORAGE_KEYS.EXPENSES)) {
      localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(SEED_EXPENSES));
    }
  }

  // --- EVENTS ---
  static getEvents(): EventItem[] {
    this.init();
    if (!isBrowser) return SEED_EVENTS;
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return raw ? JSON.parse(raw) : [];
  }

  static getEventById(id: string): EventItem | null {
    const events = this.getEvents();
    return events.find((e) => e.id === id) || null;
  }

  static saveEvent(event: Omit<EventItem, 'id' | 'created_at' | 'updated_at'> & { id?: string }): EventItem {
    this.init();
    const events = this.getEvents();
    const now = new Date().toISOString();

    if (event.id) {
      // Update existing
      const index = events.findIndex((e) => e.id === event.id);
      if (index !== -1) {
        const updated: EventItem = {
          ...events[index],
          ...event,
          updated_at: now,
        };
        events[index] = updated;
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
        return updated;
      }
    }

    // Create new
    const newEvent: EventItem = {
      ...event,
      id: event.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: now,
      updated_at: now,
    };
    events.unshift(newEvent);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return newEvent;
  }

  static archiveEvent(id: string): EventItem | null {
    this.init();
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;

    events[index].status = 'archived';
    events[index].updated_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return events[index];
  }

  static deleteEvent(id: string): boolean {
    this.init();
    const events = this.getEvents().filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));

    // Also remove associated expenses
    const expenses = this.getExpenses().filter((exp) => exp.event_id !== id);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    return true;
  }

  // --- CATEGORIES ---
  static getCategories(): CategoryItem[] {
    this.init();
    if (!isBrowser) {
      const now = new Date().toISOString();
      return DEFAULT_CATEGORIES.map((c) => ({ ...c, created_at: now, updated_at: now }));
    }
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : [];
  }

  static saveCategory(category: { id?: string; name: string; description?: string | null }): CategoryItem {
    this.init();
    const categories = this.getCategories();
    const now = new Date().toISOString();

    if (category.id) {
      const index = categories.findIndex((c) => c.id === category.id);
      if (index !== -1) {
        categories[index] = {
          ...categories[index],
          name: category.name,
          description: category.description,
          updated_at: now,
        };
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
        return categories[index];
      }
    }

    const newCat: CategoryItem = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: category.name,
      description: category.description || null,
      is_active: true,
      created_at: now,
      updated_at: now,
    };
    categories.push(newCat);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return newCat;
  }

  static toggleCategoryActive(id: string): CategoryItem | null {
    this.init();
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;

    categories[index].is_active = !categories[index].is_active;
    categories[index].updated_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return categories[index];
  }

  // --- EXPENSES ---
  static getExpenses(eventId?: string): ExpenseItem[] {
    this.init();
    if (!isBrowser) {
      let list = SEED_EXPENSES;
      if (eventId) list = list.filter((exp) => exp.event_id === eventId);
      return list;
    }
    const raw = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    let list: ExpenseItem[] = raw ? JSON.parse(raw) : [];
    if (eventId) {
      list = list.filter((exp) => exp.event_id === eventId);
    }

    // Attach category and event metadata
    const categories = this.getCategories();
    const events = this.getEvents();
    return list.map((exp) => ({
      ...exp,
      category: categories.find((c) => c.id === exp.category_id),
      event: events.find((e) => e.id === exp.event_id),
    }));
  }

  static getExpenseById(id: string): ExpenseItem | null {
    const list = this.getExpenses();
    return list.find((exp) => exp.id === id) || null;
  }

  static saveExpense(expense: Omit<ExpenseItem, 'id' | 'created_at' | 'updated_at' | 'category' | 'event'> & { id?: string }): ExpenseItem {
    this.init();
    const expenses = this.getExpenses();
    const now = new Date().toISOString();

    if (expense.id) {
      const index = expenses.findIndex((e) => e.id === expense.id);
      if (index !== -1) {
        const updated: ExpenseItem = {
          ...expenses[index],
          ...expense,
          updated_at: now,
        };
        // Clean joined properties before saving
        const toSave = expenses.map((e) => (e.id === expense.id ? updated : e)).map(this.stripRelations);
        localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(toSave));
        return updated;
      }
    }

    const newExpense: ExpenseItem = {
      ...expense,
      id: expense.id || `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: now,
      updated_at: now,
    };
    const toSave = [newExpense, ...expenses].map(this.stripRelations);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(toSave));
    return newExpense;
  }

  static deleteExpense(id: string): boolean {
    this.init();
    const expenses = this.getExpenses().filter((exp) => exp.id !== id);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses.map(this.stripRelations)));
    return true;
  }

  private static stripRelations(exp: ExpenseItem) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { category, event, ...rest } = exp;
    return rest;
  }

  // --- RECEIPT FILE STORAGE ---
  static async uploadReceipt(file: File, eventId: string, expenseId: string): Promise<{ path: string; url: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const path = `receipts/${eventId}/${expenseId}/${file.name}`;
        if (isBrowser) {
          try {
            // Store data URL into localStorage or indexed map
            const receiptsRaw = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
            const receiptsMap = receiptsRaw ? JSON.parse(receiptsRaw) : {};
            receiptsMap[path] = dataUrl;
            localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receiptsMap));
          } catch (err) {
            console.warn('Storage limit for local receipt caching:', err);
          }
        }
        resolve({ path, url: dataUrl });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  static getReceiptUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    if (!isBrowser) return null;
    try {
      const receiptsRaw = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
      if (!receiptsRaw) return null;
      const receiptsMap = JSON.parse(receiptsRaw);
      return receiptsMap[path] || null;
    } catch {
      return null;
    }
  }
}
