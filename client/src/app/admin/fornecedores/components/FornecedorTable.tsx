'use client';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Edit, Delete, Restore } from '@mui/icons-material';
import { listarFornecedor } from '../constants';
import { TablePagination } from '@/components/TablePagination';
import { useState, ChangeEvent } from 'react';


interface FornecedorTableProps {
  fornecedores: listarFornecedor[];
  onEdit: (fornecedor: listarFornecedor | null) => void;
  onDelete: (fornecedor: listarFornecedor) => void;
  onRestore?: (fornecedor: listarFornecedor) => void;
  isLoading: boolean;
  searchTerm: string;
  showInativos?: boolean;
}

export const FornecedorTable = ({
  fornecedores,
  onEdit,
  onDelete,
  onRestore,
  isLoading,
  searchTerm,
  showInativos = false,
}: FornecedorTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isFornecedorAtivo = (fornecedor: any): boolean => {
    return fornecedor.ativo === true || fornecedor.ativo === 1 || fornecedor.ativo === '1';
  };

  const statusFilteredFornecedores = Array.isArray(fornecedores)
    ? showInativos
      ? fornecedores.filter(fornecedor => !isFornecedorAtivo(fornecedor))
      : fornecedores.filter(fornecedor => isFornecedorAtivo(fornecedor))
    : [];

  const filteredFornecedores = statusFilteredFornecedores.filter((fornecedor) =>
    [
      fornecedor.pessoa?.nome || '',
      fornecedor.pessoa?.endereco || '',
      fornecedor.pessoa?.telefone || '',
      fornecedor.pessoa?.email || '',
      fornecedor.cnpj,
    ]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedFornecedores = filteredFornecedores.slice(
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
    return <Typography>Carregando fornecedores...</Typography>;
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: '8px 8px 0 0' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Endereço</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>CNPJ</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedFornecedores.length > 0 ? (
            paginatedFornecedores.map((fornecedor) => (
              <TableRow
                key={fornecedor.id}
                sx={!isFornecedorAtivo(fornecedor) ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {}}
              >
                <TableCell>
                  {fornecedor.pessoa?.nome || 'Nome não disponível'}
                  {!isFornecedorAtivo(fornecedor) && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontStyle: 'italic' }}>
                      (Inativo)
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{fornecedor.pessoa?.endereco || 'Endereço não disponível'}</TableCell>
                <TableCell>{fornecedor.pessoa?.telefone || 'Telefone não disponível'}</TableCell>
                <TableCell>{fornecedor.pessoa?.email || 'Email não disponível'}</TableCell>
                <TableCell>{fornecedor.cnpj}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(fornecedor)}
                    >
                      <Edit />
                    </IconButton>


                    {isFornecedorAtivo(fornecedor) ? (
                      <IconButton
                        color="error"
                        onClick={() => onDelete(fornecedor)}
                      >
                        <Delete />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="success"
                        onClick={() => onRestore && onRestore(fornecedor)}
                        disabled={!onRestore}
                        title={!onRestore ? "Função de restauração não disponível" : "Restaurar fornecedor"}
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
              <TableCell colSpan={7} align="center">
                Nenhum fornecedor encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      count={filteredFornecedores.length}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Box>
  );
};
