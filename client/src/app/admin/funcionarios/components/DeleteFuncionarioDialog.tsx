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
import { listarFuncionario } from '../constants';

interface DeleteFuncionarioDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  funcionario: listarFuncionario | null;
}

export default function DeleteFuncionarioDialog({
  open,
  onClose,
  onConfirm,
  funcionario,
}: DeleteFuncionarioDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Excluir Funcionário</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ mt: 2 }}>
          <AlertTitle>Atenção</AlertTitle>
          Tem certeza que deseja excluir o funcionário {funcionario?.pessoa.nome}? Esta ação não pode ser desfeita.
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