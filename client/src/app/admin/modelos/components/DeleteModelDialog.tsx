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
import { Modelo } from '../constants';

interface DeleteModelDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  model: Modelo | null;
}

export default function DeleteModelDialog({
  open,
  onClose,
  onConfirm,
  model,
}: DeleteModelDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Eliminar Modelo</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <AlertTitle>Aviso</AlertTitle>
          Tem a certeza de que deseja eliminar {model?.nome}? Esta ação não pode ser revertida.
          Nota: Eliminar um modelo pode afetar produtos que utilizam este modelo.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}