'use client';

import { useState } from 'react';

interface UseFiltersReturn<T> {
  filters: T;
  updateFilter: (key: keyof T, value: any) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

interface UseFiltersProps<T> {
  initialFilters: T;
  onApplyFilters?: (filters: T) => void;
  onClearFilters?: () => void;
}

/**
 * Hook reutilizável para gerenciar filtros de pesquisa
 * Controla estado e aplicação de filtros
 */
export function useFilters<T extends Record<string, any>>({ 
  initialFilters, 
  onApplyFilters,
  onClearFilters 
}: UseFiltersProps<T>): UseFiltersReturn<T> {
  const [filters, setFilters] = useState<T>(initialFilters);

  const updateFilter = (key: keyof T, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    if (onClearFilters) {
      onClearFilters();
    }
  };

  const applyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    updateFilter,
    clearFilters,
    applyFilters,
    resetFilters,
  };
}
