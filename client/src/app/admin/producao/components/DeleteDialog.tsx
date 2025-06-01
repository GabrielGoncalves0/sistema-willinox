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
import { ListarProducao } from '../constants';

interface DeleteProducaoDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  producao: ListarProducao | null;
}

export default function DeleteProducaoDialog({
  open,
  onClose,
  onConfirm,
  producao,
}: DeleteProducaoDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Excluir Produção</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <AlertTitle>Atenção</AlertTitle>
          Tem certeza que deseja excluir a produção do produto{' '}
          <strong>{producao?.produto.nome}</strong> para o cliente{' '}
          <strong>{producao?.fisica.pessoa.nome}</strong>? Esta ação não pode ser desfeita.
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
}
