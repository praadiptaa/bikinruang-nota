import * as XLSX from 'xlsx';
import { ExpenseItem, EventItem } from '@/types';
import { formatRupiah, formatDate } from './formatters';

export function exportEventExpensesToExcel(
  event: EventItem,
  expenses: ExpenseItem[],
  summary: {
    totalBudget: number;
    totalSpent: number;
    remainingBudget: number;
  }
) {
  // 1. Create a new workbook
  const wb = XLSX.utils.book_new();

  // 2. Format Expense Rows for Excel
  const expenseRows = expenses.map((exp, index) => ({
    No: index + 1,
    Tanggal: exp.transaction_date,
    Vendor: exp.vendor || '-',
    Kategori: exp.category?.name || '-',
    Keterangan: exp.description || '-',
    'Metode Pembayaran': exp.payment_method || '-',
    Nominal: Number(exp.amount),
    Catatan: exp.notes || '-',
  }));

  // 3. Header summary rows
  const headerData = [
    ['LAPORAN PENGELUARAN EVENT'],
    ['Nama Event', event.name],
    ['Lokasi', event.location || '-'],
    ['Tanggal Mulai', formatDate(event.start_date)],
    ['Tanggal Selesai', formatDate(event.end_date)],
    ['Status', event.status.toUpperCase()],
    [''],
    ['RINGKASAN ANGGARAN'],
    ['Total Anggaran', summary.totalBudget],
    ['Total Pengeluaran', summary.totalSpent],
    ['Sisa Anggaran', summary.remainingBudget],
    ['Status Anggaran', summary.remainingBudget >= 0 ? 'Sesuai Budget' : 'OVER BUDGET'],
    [''],
    ['DETAIL TRANSAKSI / NOTA'],
  ];

  // Convert header to worksheet
  const ws = XLSX.utils.aoa_to_sheet(headerData);

  // Append expenses table after header (start at row 15)
  XLSX.utils.sheet_add_json(ws, expenseRows, { origin: 'A15' });

  // Column widths
  ws['!cols'] = [
    { wch: 6 },  // No
    { wch: 14 }, // Tanggal
    { wch: 25 }, // Vendor
    { wch: 18 }, // Kategori
    { wch: 35 }, // Keterangan
    { wch: 20 }, // Metode Pembayaran
    { wch: 16 }, // Nominal
    { wch: 30 }, // Catatan
  ];

  // Append sheet to workbook
  const sheetName = event.name.replace(/[:\\/?*[\]]/g, '').substring(0, 28);
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Generate filename
  const cleanEventName = event.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const filename = `Laporan_Pengeluaran_${cleanEventName}_${new Date().toISOString().split('T')[0]}.xlsx`;

  // Trigger browser download
  XLSX.writeFile(wb, filename);
}
