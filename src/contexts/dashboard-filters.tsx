"use client";

import { createContext, useContext, useState, ReactNode } from "react";

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

export function DashboardFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const setFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <DashboardFiltersContext.Provider value={{ filters, setFilter, resetFilters }}>
      {children}
    </DashboardFiltersContext.Provider>
  );
}

export function useDashboardFilters() {
  return useContext(DashboardFiltersContext);
}
