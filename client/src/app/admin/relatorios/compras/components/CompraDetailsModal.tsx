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

  const handleImprimir = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Detalhes da Compra ${compra.codigo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .header h1 { margin: 0; color: #1976d2; }
            .info-section { margin-bottom: 25px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
            .info-section h3 { margin-top: 0; color: #1976d2; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .info-row { display: flex; margin-bottom: 8px; }
            .info-label { font-weight: bold; min-width: 150px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #1976d2; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .text-right { text-align: right; }
            .status-chip { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; }
            .status-pendente { background-color: #ff9800; }
            .status-processando { background-color: #2196f3; }
            .status-concluido { background-color: #4caf50; }
            .status-cancelado { background-color: #f44336; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Detalhes da Compra: ${compra.codigo}</h1>
            <p>Data de emissão: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div class="info-section">
            <h3>Informações Gerais</h3>
            <div class="info-row">
              <span class="info-label">Código:</span>
              <span>${compra.codigo}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Data:</span>
              <span>${formatarData(compra.data)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Fornecedor:</span>
              <span>${compra.fornecedor.nome}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="status-chip status-${compra.status.toLowerCase()}">
                ${getStatusText(compra.status)}
              </span>
            </div>
          </div>

          <div class="info-section">
            <h3>Itens da Compra</h3>
            <table>
              <thead>
                <tr>
                  <th>Matéria Prima</th>
                  <th class="text-right">Quantidade</th>
                  <th class="text-right">Valor Unitário</th>
                  <th class="text-right">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                ${compra.itens.map(item => `
                  <tr>
                    <td>${item.materiaPrima.nome}</td>
                    <td class="text-right">${item.quantidade}</td>
                    <td class="text-right">${formatarValor(item.valorUnitario)}</td>
                    <td class="text-right">${formatarValor(item.valorTotal)}</td>
                  </tr>
                `).join('')}
                <tr style="background-color: #e3f2fd; font-weight: bold;">
                  <td colspan="3" class="text-right">Total da Compra:</td>
                  <td class="text-right">${formatarValor(compra.valorTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
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
