'use client';

import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  AlertTitle
} from '@mui/material';
import { PedidoDetalhado } from '../constants';

interface PedidoDeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  pedido: PedidoDetalhado | null;
}

export default function PedidoDelete({ open, onClose, onConfirm, pedido }: PedidoDeleteProps) {
  if (!pedido) {
    return null;
  }

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Excluir Pedido</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <AlertTitle>Atenção</AlertTitle>
          Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm} variant="contained" color="error">
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
