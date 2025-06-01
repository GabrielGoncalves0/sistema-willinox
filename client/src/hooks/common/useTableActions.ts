'use client';

import { useState } from 'react';

interface UseTableActionsReturn<T> {
  selectedItem: T | null;
  isDeleteDialogOpen: boolean;
  openDeleteDialog: (item: T) => void;
  closeDeleteDialog: () => void;
  confirmDelete: () => Promise<void>;
  handleRestore?: (item: T) => Promise<void>;
}

interface UseTableActionsProps<T> {
  onDelete: (item: T) => Promise<void>;
  onRestore?: (item: T) => Promise<void>;
}

/**
 * Hook reutilizável para ações de tabela (deletar, restaurar)
 * Gerencia estado de diálogos de confirmação
 */
export function useTableActions<T>({ 
  onDelete, 
  onRestore 
}: UseTableActionsProps<T>): UseTableActionsReturn<T> {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openDeleteDialog = (item: T) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const confirmDelete = async () => {
    if (selectedItem) {
      await onDelete(selectedItem);
      closeDeleteDialog();
    }
  };

  const handleRestore = onRestore ? async (item: T) => {
    await onRestore(item);
  } : undefined;

  return {
    selectedItem,
    isDeleteDialogOpen,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
    handleRestore,
  };
}
