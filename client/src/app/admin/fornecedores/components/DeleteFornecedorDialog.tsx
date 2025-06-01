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
import { listarFornecedor } from '../constants';

interface DeleteFornecedorDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fornecedor: listarFornecedor | null;
}

export default function DeleteFornecedorDialog({
  open,
  onClose,
  onConfirm,
  fornecedor,
}: DeleteFornecedorDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Excluir Fornecedor</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <AlertTitle>Atenção</AlertTitle>
          Tem certeza que deseja excluir o fornecedor {fornecedor?.pessoa.nome}? Esta ação não pode ser desfeita.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}