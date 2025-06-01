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
import { MateriaPrima } from '../constants';

interface DeleteMateriaPrimaProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  materiaPrima?: MateriaPrima | null;
}

export const DeleteMateriaPrima = ({
  open,
  onClose,
  onConfirm,
  materiaPrima,
}: DeleteMateriaPrimaProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Excluir Matéria-Prima</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <AlertTitle>Aviso</AlertTitle>
          Tem certeza de que deseja excluir a matéria-prima {materiaPrima?.nome}? Esta ação não pode ser desfeita.
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