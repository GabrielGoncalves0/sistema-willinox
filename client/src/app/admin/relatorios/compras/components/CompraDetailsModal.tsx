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
import { Compra } from '../schema';
import { FormatDate } from '@/utils/formatDate';
import { pdf } from '@react-pdf/renderer';
import CompraPDFDocument from './CompraPDFDocument';

interface CompraDetailsModalProps {
  open: boolean;
  onClose: () => void;
  compra: Compra | null;
}

export default function CompraDetailsModal({ open, onClose, compra }: CompraDetailsModalProps) {
  if (!compra) return null;

  const formatarValor = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
  };

  const formatarData = (data: string | null) => {
    if (!data) return '-';
    return FormatDate.dateForReport(data);
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
    if (!compra) return;
    const blob = await pdf(<CompraPDFDocument compra={compra} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compra_${compra.codigo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-detalhes-compra"
      aria-describedby="modal-detalhes-compra-description"
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
        <Typography id="modal-detalhes-compra" variant="h6" component="h2" sx={{ mb: 2 }}>
          Detalhes da Compra: {compra.codigo}
        </Typography>

        <List sx={{ bgcolor: 'background.paper', mb: 3 }}>
          <ListItem divider>
            <ListItemText
              primary="Código"
              secondary={compra.codigo}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Data"
              secondary={formatarData(compra.data)}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Fornecedor"
              secondary={compra.fornecedor.nome}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Status"
              secondary={
                <Chip
                  label={getStatusText(compra.status)}
                  sx={{
                    bgcolor: getStatusColor(compra.status),
                    color: 'white',
                    fontWeight: 'bold',
                    mt: 1
                  }}
                  size="small"
                />
              }
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary={
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Itens da Compra
                </Typography>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold' }}>Matéria Prima</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quantidade</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Valor Unit.</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>Subtotal</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {compra.itens.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.materiaPrima.nome}</TableCell>
                            <TableCell align="center">{item.quantidade}</TableCell>
                            <TableCell align="right">{formatarValor(item.valorUnitario)}</TableCell>
                            <TableCell align="right">{formatarValor(item.valorTotal)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right" sx={{ fontWeight: 'bold' }}>
                            Total da Compra:
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {formatarValor(compra.valorTotal)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              }
            />
          </ListItem>
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
