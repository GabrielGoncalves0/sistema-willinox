'use client';

import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  AlertTitle
} from '@mui/material';
import { CompraDetalhada } from '../../../../hooks/useCompra';

interface CompraDeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  compra: CompraDetalhada | null;
}

export default function CompraDelete({ open, onClose, onConfirm, compra }: CompraDeleteProps) {
  if (!compra) {
    return null;
  }

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Excluir Compra</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <AlertTitle>Atenção</AlertTitle>
          Tem certeza que deseja excluir esta compra? Esta ação não pode ser desfeita.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained">
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
