'use client';

import React, { useState, ChangeEvent, useMemo, useCallback } from 'react';
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
  Tooltip,
  Box,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CompraDetalhada } from '../../../../hooks/useCompra';
import { CompraStatus, getStatusColor, getStatusText } from '../constants';
import { FormatNumber } from '../../../../utils/formatNumber';
import { FormatDate } from '../../../../utils/formatDate';
import { useFornecedor } from '../../../../hooks/useFornecedor';
import { TablePagination } from '@/components/TablePagination';
import CustomizedProgressBars from '@/components/ProgressLoading';


interface CompraTableProps {
  compras: CompraDetalhada[];
  onEdit: (compra: CompraDetalhada) => void;
  onDelete: (compra: CompraDetalhada) => void;
  onFinalize: (compra: CompraDetalhada) => void;
  onCancel: (compra: CompraDetalhada) => void;
  onViewDetails: (compra: CompraDetalhada) => void;
  isLoading: boolean;
  searchTerm: string;
}

export default function CompraTable({
  compras,
  onEdit,
  onDelete,
  onFinalize,
  onCancel,
  onViewDetails,
  isLoading,
  searchTerm
}: CompraTableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { fornecedores } = useFornecedor();

  const getFornecedorNome = useCallback((id: number) => {
    const fornecedor = fornecedores.find(f => f.id === id);
    return fornecedor ? fornecedor.pessoa.nome : `Fornecedor ${id}`;
  }, [fornecedores]);

  const filteredCompras = useMemo(() => {
    if (!Array.isArray(compras)) return [];

    return compras.filter((item) => {
      const fornecedorNome = getFornecedorNome(item.compra.juridicaId);
      const data = FormatDate.date(item.compra.data);
      const status = item.compra.status;
      const valor = item.compra.valorTotal.toString();

      const searchTermLower = searchTerm.toLowerCase();

      return (
        fornecedorNome.toLowerCase().includes(searchTermLower) ||
        data.includes(searchTermLower) ||
        status.includes(searchTermLower) ||
        valor.includes(searchTermLower)
      );
    });
  }, [compras, searchTerm, getFornecedorNome]);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const paginatedCompras = useMemo(() => {
    return filteredCompras.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredCompras, page, rowsPerPage]);

  const isCompraFinalizavel = useCallback((compra: CompraDetalhada) => {
    return compra.compra.status === CompraStatus.PENDENTE ||
           compra.compra.status === CompraStatus.PROCESSANDO;
  }, []);

  const isCompraCancelavel = useCallback((compra: CompraDetalhada) => {
    return compra.compra.status === CompraStatus.PENDENTE ||
           compra.compra.status === CompraStatus.PROCESSANDO;
  }, []);

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: '8px 8px 0 0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Data</strong></TableCell>
              <TableCell><strong>Fornecedor</strong></TableCell>
              <TableCell align="right"><strong>Valor Total</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell align="center"><strong>Ações</strong></TableCell>
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
              paginatedCompras.length > 0 ? (
                paginatedCompras.map((item) => (
                  <TableRow key={item.compra.id}>
                    <TableCell>{item.compra.id}</TableCell>
                    <TableCell>{FormatDate.date(item.compra.data)}</TableCell>
                    <TableCell>{getFornecedorNome(item.compra.juridicaId)}</TableCell>
                    <TableCell align="right">{FormatNumber.currency(item.compra.valorTotal)}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusText(item.compra.status)}
                        sx={{
                          bgcolor: getStatusColor(item.compra.status),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Ver Detalhes">
                          <IconButton
                            color="info"
                            onClick={() => onViewDetails(item)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title={
                          item.compra.status === CompraStatus.CONCLUIDO || item.compra.status === CompraStatus.CANCELADO
                            ? "Compra concluída ou cancelada não pode ser editada"
                            : "Editar"
                        }>
                          <span style={{
                            opacity: item.compra.status === CompraStatus.CONCLUIDO || item.compra.status === CompraStatus.CANCELADO
                              ? 0.5
                              : 1
                          }}>
                            <IconButton
                              color="primary"
                              onClick={() => onEdit(item)}
                              disabled={
                                item.compra.status === CompraStatus.CONCLUIDO ||
                                item.compra.status === CompraStatus.CANCELADO
                              }
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Excluir">
                          <span style={{
                            opacity: item.compra.status === CompraStatus.CONCLUIDO || item.compra.status === CompraStatus.CANCELADO
                              ? 0.5
                              : 1
                          }}>
                            <IconButton
                              color="error"
                              onClick={() => onDelete(item)}
                              disabled={
                                item.compra.status === CompraStatus.CONCLUIDO ||
                                item.compra.status === CompraStatus.CANCELADO
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Finalizar Compra">
                          <span style={{ opacity: !isCompraFinalizavel(item) ? 0.5 : 1 }}>
                            <IconButton
                              color="success"
                              onClick={() => onFinalize(item)}
                              disabled={
                                item.compra.status === CompraStatus.CONCLUIDO ||
                                item.compra.status === CompraStatus.CANCELADO
                              }
                            >
                              <CheckCircleIcon />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip title="Cancelar Compra">
                          <span style={{ opacity: !isCompraCancelavel(item) ? 0.5 : 1 }}>
                            <IconButton
                              color="warning"
                              onClick={() => onCancel(item)}
                              disabled={
                                item.compra.status === CompraStatus.CONCLUIDO ||
                                item.compra.status === CompraStatus.CANCELADO
                              }
                            >
                              <CancelIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography align="center" sx={{ py: 2 }}>
                      Nenhuma compra encontrada.
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        count={filteredCompras.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
