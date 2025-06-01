'use client';

import { useState } from 'react';

interface UseFormModalReturn<T> {
  isOpen: boolean;
  isEditing: boolean;
  currentItem: T | null;
  openForm: (item?: T) => void;
  closeForm: () => void;
}

/**
 * Hook reutilizável para gerenciar estado de modais de formulário
 * Controla abertura/fechamento e modo de edição
 */
export function useFormModal<T>(): UseFormModalReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<T | null>(null);

  const openForm = (item?: T) => {
    if (item) {
      setCurrentItem(item);
      setIsEditing(true);
    } else {
      setCurrentItem(null);
      setIsEditing(false);
    }
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setCurrentItem(null);
    setIsEditing(false);
  };

  return {
    isOpen,
    isEditing,
    currentItem,
    openForm,
    closeForm,
  };
}
