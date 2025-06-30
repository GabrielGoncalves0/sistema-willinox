'use client';

import {
  Modal,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Printer } from 'lucide-react';
import { PedidoReport } from '../schema';
import { format } from 'date-fns';
import { pdf } from '@react-pdf/renderer';
import PedidoPDFDocument from './PedidoPDFDocument';

interface PedidoDetailsModalProps {
  open: boolean;
  onClose: () => void;
  pedido: PedidoReport | null;
}

export default function PedidoDetailsModal({ open, onClose, pedido }: PedidoDetailsModalProps) {
  if (!pedido) return null;

  const formatarValor = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
  };

  const formatarData = (data: string | null) => {
    if (!data) return '-';
    try {
      return format(new Date(data), 'dd/MM/yyyy');
    } catch {
      return '-';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'processando': return 'Processando';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'warning.main';
      case 'processando': return 'info.main';
      case 'concluido': return 'success.main';
      case 'cancelado': return 'error.main';
      default: return 'default';
    }
  };

  const handleImprimir = async () => {
    if (!pedido) return;
    const blob = await pdf(<PedidoPDFDocument pedido={pedido} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pedido_${pedido.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-detalhes-pedido"
      aria-describedby="modal-detalhes-pedido-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 600 },
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 24,
        p: 4,
        overflow: 'auto'
      }}>
        <Typography id="modal-detalhes-pedido" variant="h6" component="h2" sx={{ mb: 2 }}>
          Detalhes do Pedido: {pedido.id}
        </Typography>

        <List sx={{ bgcolor: 'background.paper', mb: 3 }}>
          <ListItem divider>
            <ListItemText
              primary="Cliente"
              secondary={pedido.cliente.nome}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Data"
              secondary={formatarData(pedido.dataInicio)}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Status"
              secondary={
                <Chip
                  label={getStatusText(pedido.status)}
                  sx={{
                    bgcolor: getStatusColor(pedido.status),
                    color: 'white',
                    fontWeight: 'bold',
                    mt: 1
                  }}
                  size="small"
                />
              }
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Valor de Entrada"
              secondary={formatarValor(pedido.valorEntrada)}
            />
          </ListItem>

          {pedido.produtos && pedido.produtos.length > 0 && (
            <ListItem divider>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Produtos
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Produto</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quantidade</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Preço Unit.</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pedido.produtos.map((item, index) => (
                            <TableRow key={`produto-${index}`}>
                              <TableCell>{item.produto?.nome || `Produto ${item.produtoId}`}</TableCell>
                              <TableCell align="center">{item.quantidade}</TableCell>
                              <TableCell align="right">{formatarValor(item.preco)}</TableCell>
                              <TableCell align="right">{formatarValor(item.quantidade * item.preco)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                              Total Produtos:
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                              {formatarValor(
                                pedido.produtos.reduce(
                                  (sum, item) => sum + item.quantidade * item.preco,
                                  0
                                )
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                }
              />
            </ListItem>
          )}

          {pedido.materiasPrimas && pedido.materiasPrimas.length > 0 && (
            <ListItem divider>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Matérias-primas
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Matéria-prima</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quantidade</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Preço Unit.</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {pedido.materiasPrimas.map((item, index) => (
                            <TableRow key={`materia-prima-${index}`}>
                              <TableCell>{item.materiaPrima?.nome || `Matéria-prima ${item.materiaPrimaId}`}</TableCell>
                              <TableCell align="center">{item.quantidade}</TableCell>
                              <TableCell align="right">{formatarValor(item.preco)}</TableCell>
                              <TableCell align="right">{formatarValor(item.quantidade * item.preco)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                              Total Matérias-primas:
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                              {formatarValor(
                                pedido.materiasPrimas.reduce(
                                  (sum, item) => sum + item.quantidade * item.preco,
                                  0
                                )
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                }
              />
            </ListItem>
          )}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={onClose}
          >
            Fechar
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Printer size={16} />}
              onClick={handleImprimir}
            >
              Imprimir
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
