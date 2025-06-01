'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Edit, Delete, Restore } from '@mui/icons-material';
import { Modelo } from '../constants';
import { TablePagination } from '@/components/TablePagination';
import { useState, ChangeEvent } from 'react';


interface ModelListProps {
  models: Modelo[];
  onEdit: (model: Modelo) => void;
  onDelete: (model: Modelo) => void;
  onRestore?: (model: Modelo) => void;
  isLoading: boolean;
  searchTerm: string;
  showInativos?: boolean;
}

export default function ModelTable({ models, onEdit, onDelete, onRestore, isLoading, searchTerm, showInativos = false }: ModelListProps) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const statusFilteredModels = Array.isArray(models)
    ? showInativos
      ? models.filter(model => !model.ativo)
      : models.filter(model => model.ativo)
    : [];

  const filteredModels = statusFilteredModels.filter((model) =>
    Object.values(model).some((value) =>
      value !== null &&
      value !== undefined &&
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedModels = filteredModels.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return <Typography>Carregando modelos...</Typography>;
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: '8px 8px 0 0' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell></TableCell>
            <TableCell width="120px" align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedModels.length > 0 ? (
            paginatedModels.map((model) => (
              <TableRow
                key={model.id}
                sx={!model.ativo ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {}}
              >
                <TableCell>
                  {model.nome}
                  {!model.ativo && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontStyle: 'italic' }}>
                      (Inativo)
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{model.descricao}</TableCell>
                <TableCell></TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(model)}
                    >
                      <Edit />
                    </IconButton>
                    {model.ativo ? (
                      <IconButton
                        color="error"
                        onClick={() => onDelete(model)}
                      >
                        <Delete />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="success"
                        onClick={() => onRestore && onRestore(model)}
                        disabled={!onRestore}
                      >
                        <Restore />
                      </IconButton>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                Nenhum modelo encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      count={filteredModels.length}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Box>
  );
}
