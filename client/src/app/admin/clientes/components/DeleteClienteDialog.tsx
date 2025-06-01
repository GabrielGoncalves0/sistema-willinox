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
import { listarCliente } from '../constants';

interface DeleteClienteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cliente?: listarCliente | null; 
}

export const DeleteClienteDialog = ({
  open,
  onClose,
  onConfirm,
  cliente,
}: DeleteClienteProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Excluir Cliente</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <AlertTitle>Aviso</AlertTitle>
          Tem certeza de que deseja excluir o cliente {cliente?.pessoa.nome}? Esta ação não pode ser desfeita.
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
