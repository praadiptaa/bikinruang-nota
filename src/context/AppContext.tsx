'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AppContextType {
  isQuickExpenseOpen: boolean;
  selectedEventIdForExpense?: string;
  openQuickExpense: (eventId?: string) => void;
  closeQuickExpense: () => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isQuickExpenseOpen, setIsQuickExpenseOpen] = useState(false);
  const [selectedEventIdForExpense, setSelectedEventIdForExpense] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const openQuickExpense = useCallback((eventId?: string) => {
    setSelectedEventIdForExpense(eventId);
    setIsQuickExpenseOpen(true);
  }, []);

  const closeQuickExpense = useCallback(() => {
    setIsQuickExpenseOpen(false);
    setSelectedEventIdForExpense(undefined);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isQuickExpenseOpen,
        selectedEventIdForExpense,
        openQuickExpense,
        closeQuickExpense,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
