'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  AlertTitle,
} from '@mui/material';
import { Product } from '../constants';

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product?: Product;
}

export const DeleteDialog = ({
  open,
  onClose,
  onConfirm,
  product,
}: DeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Excluir Produto</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <AlertTitle>Aviso</AlertTitle>
          Tem certeza de que deseja excluir o produto {product?.nome}? Esta ação não pode ser desfeita.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
};