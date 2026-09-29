'use client';

import React from 'react';
import Link from 'next/link';
import { EventItem } from '@/types';
import { formatRupiah, formatDateShort } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  Calendar,
  MapPin,
  ArrowRight,
  Edit2,
  Archive,
  AlertTriangle,
  FileSpreadsheet,
  Trash2,
} from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  spent: number;
  onEdit: (event: EventItem) => void;
  onArchive: (eventId: string) => void;
  onDelete?: (eventId: string, eventName: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  spent,
  onEdit,
  onArchive,
  onDelete,
}) => {
  const budget = Number(event.budget) || 0;
  const remaining = budget - spent;
  const isOverBudget = remaining < 0;
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;

  const getStatusBadge = () => {
    switch (event.status) {
      case 'active':
        return <Badge variant="navy">ACTIVE</Badge>;
      case 'planned':
        return <Badge variant="yellow">PLANNED</Badge>;
      case 'completed':
        return <Badge variant="default">COMPLETED</Badge>;
      case 'archived':
        return <Badge variant="warning">ARCHIVED</Badge>;
      default:
        return <Badge variant="default">{event.status}</Badge>;
    }
  };

  return (
    <div className="bg-white dark:bg-[#181818] rounded-2xl border-2 border-[#e7e5e0] dark:border-[#282828] hover:border-[#003b6f] dark:hover:border-[#ffc700] p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      {/* Top Details */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              {isOverBudget && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200">
                  <AlertTriangle className="w-3 h-3" /> OVER BUDGET
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-base text-[#111111] dark:text-white group-hover:text-[#003b6f] dark:group-hover:text-[#ffc700] transition-colors uppercase tracking-tight line-clamp-1">
              {event.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => onEdit(event)}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Edit Event"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            {event.status !== 'archived' && (
              <button
                type="button"
                onClick={() => onArchive(event.id)}
                className="p-1.5 text-slate-400 hover:text-amber-600 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30"
                title="Arsipkan Event"
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  const confirmed = window.confirm(
                    `Apakah Anda yakin ingin menghapus event "${event.name}"?\n\nPERINGATAN: Semua pengeluaran dan nota foto terkait event ini akan dihapus secara permanen.`
                  );
                  if (confirmed) {
                    onDelete(event.id, event.name);
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Hapus Event"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Location & Dates */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#8e8e8a] font-mono">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#003b6f] dark:text-[#ffc700]" />
            <span>
              {formatDateShort(event.start_date)}
              {event.end_date && ` - ${formatDateShort(event.end_date)}`}
            </span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#003b6f] dark:text-[#ffc700]" />
              <span className="truncate max-w-[150px]">{event.location}</span>
            </div>
          )}
        </div>

        {event.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}
      </div>

      {/* Financial Numbers & Budget Bar */}
      <div className="mt-5 pt-4 border-t border-[#e7e5e0] dark:border-[#282828] space-y-3">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[#8e8e8a] block text-[10px] font-mono uppercase tracking-wider">Terpakai</span>
            <span className="font-black text-sm text-[#111111] dark:text-white font-mono">
              {formatRupiah(spent)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[#8e8e8a] block text-[10px] font-mono uppercase tracking-wider">Budget</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
              {formatRupiah(budget)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <ProgressBar percentage={percentage} isOverBudget={isOverBudget} />
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className={isOverBudget ? 'text-rose-600 font-bold' : 'text-[#8e8e8a]'}>
              {isOverBudget
                ? `Melebihi ${formatRupiah(Math.abs(remaining))}`
                : `Sisa ${formatRupiah(remaining)}`}
            </span>
            <span className="font-bold text-[#111111] dark:text-white">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>

        {/* Bottom Action Links */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#e7e5e0]/60 dark:border-[#282828]">
          <Link
            href={`/events/${event.id}/report`}
            className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-600 dark:text-slate-400 hover:text-[#003b6f] dark:hover:text-[#ffc700] uppercase"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#003b6f] dark:text-[#ffc700]" />
            <span>Laporan</span>
          </Link>

          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#003b6f] dark:text-[#ffc700] hover:underline uppercase"
          >
            <span>BUKA EVENT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
