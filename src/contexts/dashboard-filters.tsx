"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Filters {
  salesRep: string;
  organization: string;
  productCategory: string;
}

interface DashboardFiltersContextType {
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
  resetFilters: () => void;
}

const defaultFilters: Filters = {
  salesRep: "all",
  organization: "all",
  productCategory: "all",
};

const DashboardFiltersContext = createContext<DashboardFiltersContextType>({
  filters: defaultFilters,
  setFilter: () => {},
  resetFilters: () => {},
});

const STORAGE_KEY = "dashboard-filters";

function getInitialFilters(): Filters {
  if (typeof window === "undefined") return defaultFilters;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultFilters, ...parsed };
    }
  } catch {}
  return defaultFilters;
}

export function DashboardFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(getInitialFilters);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {}
  }, [filters]);

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  };

  return (
    <DashboardFiltersContext.Provider value={{ filters, setFilter, resetFilters }}>
      {children}
    </DashboardFiltersContext.Provider>
  );
}

export function useDashboardFilters() {
  return useContext(DashboardFiltersContext);
}
