'use client';

import React, { useState, ChangeEvent } from 'react';
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
import { PedidoDetalhado, PedidoStatus, getStatusColor, getStatusText } from '../constants';
import { FormatNumber } from '@/utils/formatNumber';
import { FormatDate } from '@/utils/formatDate';
import { useCliente } from '@/hooks/useCliente';
import { usePedido } from '@/hooks/usePedido';
import { TablePagination } from '@/components/TablePagination';
import CustomizedProgressBars from '@/components/ProgressLoading';


interface PedidoTableProps {
  pedidos: PedidoDetalhado[];
  onEdit: (pedido: PedidoDetalhado) => void;
  onDelete: (pedido: PedidoDetalhado) => void;
  onFinalize: (pedido: PedidoDetalhado) => void;
  onCancel: (pedido: PedidoDetalhado) => void;
  isLoading: boolean;
  searchTerm: string;
}

export default function PedidoTable({
  pedidos,
  onEdit,
  onDelete,
  onFinalize,
  onCancel,
  isLoading,
  searchTerm
}: PedidoTableProps) {

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { clientes } = useCliente();
  const { calcularValorTotal } = usePedido();

  const getClienteNome = (id: number) => {
    const cliente = clientes.find(c => c.pessoa.id === id);
    return cliente ? cliente.pessoa.nome : `Cliente ${id}`;
  };

  const filteredPedidos = pedidos.filter(pedido => {
    const clienteNome = getClienteNome(pedido.pedido.pessoaId).toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();

    return (
      clienteNome.includes(searchTermLower) ||
      pedido.pedido.id.toString().includes(searchTermLower) ||
      FormatDate.date(pedido.pedido.data).includes(searchTermLower) ||
      getStatusText(pedido.pedido.status).toLowerCase().includes(searchTermLower)
    );
  });


  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const paginatedPedidos = filteredPedidos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: '8px 8px 0 0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Valor Entrada</TableCell>
              <TableCell>Valor Total</TableCell>
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
              paginatedPedidos.length > 0 ? (
                paginatedPedidos.map((pedido) => (
                  <TableRow key={pedido.pedido.id}>
                    <TableCell>{pedido.pedido.id}</TableCell>
                    <TableCell>{FormatDate.date(pedido.pedido.data)}</TableCell>
                    <TableCell>{getClienteNome(pedido.pedido.pessoaId)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(pedido.pedido.status)}
                        sx={{
                          bgcolor: getStatusColor(pedido.pedido.status),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {FormatNumber.currency(pedido.pedido.valorEntrada || 0)}
                    </TableCell>
                    <TableCell>
                      {(() => {
                        try {

                          const valorTotal = calcularValorTotal(pedido);
                          return FormatNumber.currency(valorTotal);
                        } catch (error) {
                          console.error(`Erro ao calcular valor total do pedido ${pedido.pedido.id}:`, error);
                          return FormatNumber.currency(0);
                        }
                      })()}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title={
                        pedido.pedido.status === PedidoStatus.CONCLUIDO || pedido.pedido.status === PedidoStatus.CANCELADO
                          ? "Pedido concluído ou cancelado não pode ser editado"
                          : "Editar"
                      }>
                        <span style={{
                          opacity: pedido.pedido.status === PedidoStatus.CONCLUIDO || pedido.pedido.status === PedidoStatus.CANCELADO
                            ? 0.5
                            : 1
                        }}>
                          <IconButton
                            onClick={() => onEdit(pedido)}
                            color="primary"
                            disabled={
                              pedido.pedido.status === PedidoStatus.CONCLUIDO ||
                              pedido.pedido.status === PedidoStatus.CANCELADO
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Excluir">
                        <span style={{
                          opacity: pedido.pedido.status === PedidoStatus.CONCLUIDO || pedido.pedido.status === PedidoStatus.CANCELADO
                            ? 0.5
                            : 1
                        }}>
                          <IconButton
                            onClick={() => onDelete(pedido)}
                            color="error"
                            disabled={
                              pedido.pedido.status === PedidoStatus.CONCLUIDO ||
                              pedido.pedido.status === PedidoStatus.CANCELADO
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Finalizar">
                        <span style={{ opacity: pedido.pedido.status === PedidoStatus.CONCLUIDO || pedido.pedido.status === PedidoStatus.CANCELADO ? 0.5 : 1 }}>
                          <IconButton
                            onClick={() => onFinalize(pedido)}
                            disabled={
                              pedido.pedido.status === PedidoStatus.CONCLUIDO ||
                              pedido.pedido.status === PedidoStatus.CANCELADO
                            }
                            color="success"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Cancelar">
                        <span style={{ opacity: pedido.pedido.status === PedidoStatus.CONCLUIDO || pedido.pedido.status === PedidoStatus.CANCELADO ? 0.5 : 1 }}>
                          <IconButton
                            onClick={() => onCancel(pedido)}
                            disabled={
                              pedido.pedido.status === PedidoStatus.CONCLUIDO ||
                              pedido.pedido.status === PedidoStatus.CANCELADO
                            }
                            color="warning"
                          >
                            <CancelIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      {searchTerm ? 'Nenhum pedido encontrado para a pesquisa.' : 'Nenhum pedido cadastrado.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        count={filteredPedidos.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
