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
import { listarCliente } from '../constants';
import { FormatDate } from '@/utils/formatDate';
import { TablePagination } from '@/components/TablePagination';
import { useState, ChangeEvent } from 'react';
import CustomizedProgressBars from '@/components/ProgressLoading';

interface ClientTableProps {
  clientes: listarCliente[];
  onEdit: (cliente: listarCliente | null) => void;
  onDelete: (cliente: listarCliente) => void;
  onRestore?: (cliente: listarCliente) => void;
  isLoading: boolean;
  searchTerm: string;
  showInativos?: boolean;
}

export const ClienteTable = ({
  clientes,
  onEdit,
  onDelete,
  onRestore,
  isLoading,
  searchTerm,
  showInativos = false,
}: ClientTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const statusFilteredClients = Array.isArray(clientes)
    ? showInativos
      ? clientes.filter(cliente => !cliente.ativo)
      : clientes.filter(cliente => cliente.ativo)
    : [];

  const filteredClients = statusFilteredClients.filter((cliente) =>
    [
      cliente.pessoa?.nome || '',
      cliente.pessoa?.endereco || '',
      cliente.pessoa?.telefone || '',
      cliente.pessoa?.email || '',
      cliente.cpf || cliente.cnpj,
    ]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const paginatedClients = filteredClients.slice(
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
            <TableCell>CPF/CNPJ</TableCell>
            <TableCell>Data de Nascimento</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <CustomizedProgressBars />
              </TableCell>
            </TableRow>
          ) : (
            paginatedClients.length > 0 ? (
              paginatedClients.map((client) => (
                <TableRow
                  key={`${client.tipo}-${client.id}`}
                  sx={!client.ativo ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {}}
                >
                  <TableCell>
                    {client.pessoa?.nome || 'Nome não disponível'}
                    {!client.ativo && (
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontStyle: 'italic' }}>
                        (Inativo)
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{client.pessoa?.endereco || 'Endereço não disponível'}</TableCell>
                  <TableCell>{client.pessoa?.telefone || 'Telefone não disponível'}</TableCell>
                  <TableCell>{client.pessoa?.email || 'Email não disponível'}</TableCell>
                  <TableCell>
                    {client.tipo === 'fisica' ? client.cpf : client.cnpj}
                  </TableCell>
                  <TableCell>
                    {client.tipo === 'fisica' && client.dataNascimento
                      ? FormatDate.date(client.dataNascimento)
                      : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(client)}
                      >
                        <Edit />
                      </IconButton>
                      {client.ativo ? (
                        <IconButton
                          color="error"
                          onClick={() => onDelete(client)}
                        >
                          <Delete />
                        </IconButton>
                      ) : (
                        <IconButton
                          color="success"
                          onClick={() => onRestore && onRestore(client)}
                          disabled={!onRestore}
                          title={!onRestore ? "Função de restauração não disponível" : "Restaurar cliente"}
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
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      count={filteredClients.length}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Box>
  );
};