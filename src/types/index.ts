export type EventStatus = 'planned' | 'active' | 'completed' | 'archived';

export interface EventItem {
  id: string;
  name: string;
  description?: string | null;
  location?: string | null;
  start_date: string;
  end_date?: string | null;
  budget: number;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PaymentMethod = 
  | 'Cash' 
  | 'Transfer Bank' 
  | 'E-Wallet' 
  | 'Debit Card' 
  | 'Credit Card' 
  | 'Other';

export interface ExpenseItem {
  id: string;
  event_id: string;
  category_id: string;
  vendor?: string | null;
  transaction_date: string;
  description?: string | null;
  amount: number;
  payment_method?: PaymentMethod | string | null;
  receipt_path?: string | null;
  receipt_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;

  // Joined relations for convenience
  category?: CategoryItem;
  event?: EventItem;
}

export interface EventFinancialSummary {
  event: EventItem;
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  isOverBudget: boolean;
  overBudgetAmount: number;
  percentageUsed: number;
  expenseCount: number;
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    totalAmount: number;
    count: number;
    percentageOfTotal: number;
  }[];
}

export interface DashboardSummary {
  activeEventsCount: number;
  totalEventsCount: number;
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  recentExpenses: ExpenseItem[];
  categorySummaries: {
    categoryName: string;
    totalAmount: number;
    count: number;
    percentage: number;
  }[];
  eventSpendingSummaries: {
    event: EventItem;
    spent: number;
    budget: number;
    percentage: number;
    isOverBudget: boolean;
  }[];
}
