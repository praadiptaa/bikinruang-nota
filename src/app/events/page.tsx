'use client';

import React, { useState, useEffect } from 'react';
import { EventItem, ExpenseItem } from '@/types';
import { EventService } from '@/services/events';
import { ExpenseService } from '@/services/expenses';
import { EventCard } from '@/components/events/EventCard';
import { EventFormModal } from '@/components/events/EventFormModal';
import { Button } from '@/components/ui/Button';
import { Plus, Calendar, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'planned' | 'completed' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsList, allExpenses] = await Promise.all([
        EventService.getAll(true), // Include archived
        ExpenseService.getAll(),
      ]);
      setEvents(eventsList);
      setExpenses(allExpenses);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: EventItem) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleArchive = async (eventId: string) => {
    try {
      await EventService.archive(eventId);
      await loadData();
    } catch (err) {
      console.error('Failed to archive event:', err);
      alert('Gagal mengarsipkan event');
    }
  };

  const handleDelete = async (eventId: string, eventName: string) => {
    try {
      await EventService.delete(eventId);
      await loadData();
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert(`Gagal menghapus event "${eventName}"`);
    }
  };

  // Filter events
  const filteredEvents = events.filter((evt) => {
    // Tab filter
    if (activeTab === 'all' && evt.status === 'archived') return false;
    if (activeTab !== 'all' && evt.status !== activeTab) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = evt.name.toLowerCase().includes(q);
      const matchLoc = evt.location?.toLowerCase().includes(q);
      const matchDesc = evt.description?.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Manajemen Event
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Kelola event, batasan pagu anggaran, dan status pelaksanaan acara
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Buat Event</span>
        </Button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-x-auto select-none border border-slate-200/60 dark:border-slate-800">
          {(
            [
              { key: 'all', label: 'Semua Aktif' },
              { key: 'active', label: 'Berlangsung' },
              { key: 'planned', label: 'Direncanakan' },
              { key: 'completed', label: 'Selesai' },
              { key: 'archived', label: 'Diarsipkan' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Cari event, lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftAddon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Belum ada event</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Buat event pertama untuk mulai mencatat pengeluaran dan nota transaksi.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEditingEvent(null);
              setIsModalOpen(true);
            }}
            className="mt-2"
          >
            + Buat Event
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const eventSpent = expenses
              .filter((exp) => exp.event_id === evt.id)
              .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

            return (
              <EventCard
                key={evt.id}
                event={evt}
                spent={eventSpent}
                onEdit={handleEdit}
                onArchive={handleArchive}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}

      {/* Event Form Modal */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          loadData();
        }}
        initialData={editingEvent}
      />
    </div>
  );
}
