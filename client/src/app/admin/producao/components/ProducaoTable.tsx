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
  Chip,
  Box,
  Tooltip
} from '@mui/material';
import { Delete, Edit, CheckCircle, Cancel } from '@mui/icons-material';
import { ListarProducao } from '../constants';
import { useState, ChangeEvent } from 'react';
import { TablePagination } from '@/components/TablePagination';
import { FormatDate } from '@/utils/formatDate';


interface ProducaoTableProps {
  producoes: ListarProducao[];
  onEdit: (producao: ListarProducao) => void;
  onDelete: (producao: ListarProducao) => void;
  onFinalize?: (producao: ListarProducao) => void;
  onCancel?: (producao: ListarProducao) => void;
  isLoading?: boolean;
  searchTerm?: string;
}

export default function ProducaoTable({
  producoes,
  onEdit,
  onDelete,
  onFinalize,
  onCancel,
  isLoading = false,
  searchTerm = '',
}: ProducaoTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'warning';
      case 'em_andamento':
        return 'info';
      case 'concluido':
        return 'success';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatStatusText = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedProducoes = producoes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: '8px 8px 0 0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Funcionário</strong></TableCell>
              <TableCell><strong>Produto</strong></TableCell>
              <TableCell align="center"><strong>Quantidade</strong></TableCell>
              <TableCell><strong>Data Início</strong></TableCell>
              <TableCell><strong>Data Fim</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducoes.length > 0 ? (
              paginatedProducoes.map((producao) => (
                <TableRow key={`producao-${producao.id}-${Math.random().toString(36).substring(2, 9)}`}>
                  <TableCell>{producao.id}</TableCell>
                  <TableCell>{producao?.fisica.pessoa.nome}</TableCell>
                  <TableCell>{producao.produto.nome}</TableCell>
                  <TableCell align="center">{producao.quantidade || 1}</TableCell>
                  <TableCell>{FormatDate.date(producao.dataInicio)}</TableCell>
                  <TableCell>
                    {producao.dataFim ? FormatDate.date(producao.dataFim) : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={formatStatusText(producao.status)}
                      color={getStatusColor(producao.status) as "warning" | "info" | "success" | "error" | "default"}
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title="Editar">
                        <IconButton
                          color="primary"
                          onClick={() => onEdit(producao)}
                          disabled={producao.status === 'concluido' || producao.status === 'cancelado'}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Excluir">
                        <IconButton
                          color="error"
                          onClick={() => onDelete(producao)}
                          disabled={producao.status === 'concluido' || producao.status === 'cancelado'}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>

                      {onFinalize && (
                        <Tooltip title="Finalizar Produção">
                          <span style={{ opacity: producao.status === 'concluido' || producao.status === 'cancelado' ? 0.5 : 1 }}>
                            <IconButton
                              color="success"
                              onClick={() => onFinalize(producao)}
                              disabled={producao.status === 'concluido' || producao.status === 'cancelado'}
                            >
                              <CheckCircle />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}

                      {onCancel && (
                        <Tooltip title="Cancelar Produção">
                          <span style={{ opacity: producao.status === 'concluido' || producao.status === 'cancelado' ? 0.5 : 1 }}>
                            <IconButton
                              color="warning"
                              onClick={() => onCancel(producao)}
                              disabled={producao.status === 'concluido' || producao.status === 'cancelado'}
                            >
                              <Cancel />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>
                  <Typography align="center" sx={{ py: 2 }}>
                    Nenhuma produção cadastrada.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {producoes.length > 0 && (
        <TablePagination
          count={producoes.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Box>
  );
}
