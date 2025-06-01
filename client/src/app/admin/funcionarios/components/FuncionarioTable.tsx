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
  Chip,
  Typography,
  Box,
} from '@mui/material';
import { Edit, Delete, Restore } from '@mui/icons-material';
import { listarFuncionario } from '../constants';
import { TablePagination } from '@/components/TablePagination';
import { useState, ChangeEvent } from 'react';


interface FuncionarioListProps {
  funcionarios: listarFuncionario[];
  onEdit: (funcionario: listarFuncionario) => void;
  onDelete: (funcionario: listarFuncionario) => void;
  onRestore?: (funcionario: listarFuncionario) => void;
  isLoading: boolean;
  searchTerm: string;
  showInativos?: boolean;
}

export default function FuncionarioTable({
  funcionarios,
  onEdit,
  onDelete,
  onRestore,
  isLoading,
  searchTerm,
  showInativos = false,
}: FuncionarioListProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const statusFilteredFuncionarios = Array.isArray(funcionarios)
    ? showInativos
      ? funcionarios.filter(funcionario => !funcionario.ativo)
      : funcionarios.filter(funcionario => funcionario.ativo)
    : [];

  const filteredFuncionarios = statusFilteredFuncionarios.filter((funcionario) =>
    [
      funcionario.pessoa.nome,
      funcionario.cpf,
      funcionario.pessoa.email,
      funcionario.pessoa.telefone,
    ]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedFuncionarios = filteredFuncionarios.slice(
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
    return <Typography>Carregando funcionários...</Typography>;
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: '8px 8px 0 0' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>CPF</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Acesso ao Sistema</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedFuncionarios.length > 0 ? (
            paginatedFuncionarios.map((funcionario) => (
              <TableRow
                key={funcionario.id}
                sx={!funcionario.ativo ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {}}
              >
                <TableCell>
                  {funcionario.pessoa.nome}
                  {!funcionario.ativo && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontStyle: 'italic' }}>
                      (Inativo)
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{funcionario.cpf}</TableCell>
                <TableCell>{funcionario.pessoa.email}</TableCell>
                <TableCell>{funcionario.pessoa.telefone}</TableCell>
                <TableCell>
                  {funcionario.login ? (
                    <Chip
                      label="Sim"
                      sx={{
                        backgroundColor: '#06c14a',
                        color: 'white',
                      }}
                    />
                  ) : (
                    <Chip
                      label="Não"
                      sx={{
                        backgroundColor: '#9e9e9e',
                        color: 'white',
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(funcionario)}
                    >
                      <Edit />
                    </IconButton>
                    {funcionario.ativo ? (
                      <IconButton
                        color="error"
                        onClick={() => onDelete(funcionario)}
                      >
                        <Delete />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="success"
                        onClick={() => onRestore && onRestore(funcionario)}
                        disabled={!onRestore}
                        title={!onRestore ? "Função de restauração não disponível" : "Restaurar funcionário"}
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
              <TableCell colSpan={6} align="center">
                Nenhum funcionário encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      count={filteredFuncionarios.length}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Box>
  );
}