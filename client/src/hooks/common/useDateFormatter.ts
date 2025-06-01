import { useCallback } from 'react';
import { formatDateForAPI, formatDateForDisplay, isValidDate } from '@/utils/dateUtils';

/**
 * Hook personalizado para formatação de datas
 * Centraliza a lógica de formatação para garantir consistência
 */
export const useDateFormatter = () => {
  /**
   * Formata data para envio à API (YYYY-MM-DD)
   */
  const formatForAPI = useCallback((dateInput: string | Date | null | undefined): string => {
    return formatDateForAPI(dateInput);
  }, []);

  /**
   * Formata data para exibição (DD/MM/YYYY)
   */
  const formatForDisplay = useCallback((dateInput: string | Date | null | undefined): string => {
    return formatDateForDisplay(dateInput);
  }, []);

  /**
   * Valida se uma data é válida
   */
  const validateDate = useCallback((dateInput: any): boolean => {
    return isValidDate(dateInput);
  }, []);

  /**
   * Formata dados de entidade para envio à API
   * Garante que todas as datas sejam formatadas corretamente
   */
  const formatEntityForAPI = useCallback(<T extends Record<string, any>>(
    entity: T,
    dateFields: (keyof T)[]
  ): T => {
    const formatted = { ...entity };
    
    dateFields.forEach(field => {
      if (formatted[field]) {
        formatted[field] = formatForAPI(formatted[field] as any) as T[keyof T];
      }
    });
    
    return formatted;
  }, [formatForAPI]);

  /**
   * Obtém a data atual formatada para API
   */
  const getCurrentDateForAPI = useCallback((): string => {
    return formatForAPI(new Date());
  }, [formatForAPI]);

  /**
   * Obtém a data atual formatada para exibição
   */
  const getCurrentDateForDisplay = useCallback((): string => {
    return formatForDisplay(new Date());
  }, [formatForDisplay]);

  return {
    formatForAPI,
    formatForDisplay,
    validateDate,
    formatEntityForAPI,
    getCurrentDateForAPI,
    getCurrentDateForDisplay
  };
};
