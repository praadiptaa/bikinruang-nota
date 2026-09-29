import { DashboardSummary } from '@/types';
import { EventService } from './events';
import { ExpenseService } from './expenses';
import { CategoryService } from './categories';

export const ReportService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const [events, allExpenses, categories] = await Promise.all([
      EventService.getAll(true),
      ExpenseService.getAll(),
      CategoryService.getAll(),
    ]);

    const activeEvents = events.filter((e) => e.status === 'active');
    const totalEventsCount = events.filter((e) => e.status !== 'archived').length;
    const activeEventsCount = activeEvents.length;

    // Total Budget of non-archived events
    const validEvents = events.filter((e) => e.status !== 'archived');
    const totalBudget = validEvents.reduce((sum, e) => sum + (Number(e.budget) || 0), 0);
    const totalSpent = allExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
    const totalRemaining = totalBudget - totalSpent;

    // Recent 5-10 expenses
    const recentExpenses = allExpenses.slice(0, 8);

    // Category summaries
    const categoryTotals: { [key: string]: { name: string; totalAmount: number; count: number } } = {};
    for (const exp of allExpenses) {
      const catId = exp.category_id || 'unknown';
      const catName = exp.category?.name || categories.find((c) => c.id === catId)?.name || 'Lainnya';
      if (!categoryTotals[catId]) {
        categoryTotals[catId] = { name: catName, totalAmount: 0, count: 0 };
      }
      categoryTotals[catId].totalAmount += Number(exp.amount) || 0;
      categoryTotals[catId].count += 1;
    }

    const categorySummaries = Object.values(categoryTotals)
      .map((item) => ({
        categoryName: item.name,
        totalAmount: item.totalAmount,
        count: item.count,
        percentage: totalSpent > 0 ? (item.totalAmount / totalSpent) * 100 : 0,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);

    // Event spending summaries
    const eventSpendingSummaries = validEvents.map((evt) => {
      const evtExpenses = allExpenses.filter((exp) => exp.event_id === evt.id);
      const spent = evtExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
      const budget = Number(evt.budget) || 0;
      const percentage = budget > 0 ? (spent / budget) * 100 : 0;
      return {
        event: evt,
        spent,
        budget,
        percentage,
        isOverBudget: spent > budget,
      };
    });

    return {
      activeEventsCount,
      totalEventsCount,
      totalBudget,
      totalSpent,
      totalRemaining,
      recentExpenses,
      categorySummaries,
      eventSpendingSummaries,
    };
  },
};
