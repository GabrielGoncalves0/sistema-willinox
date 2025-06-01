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
      case 'PENDENTE': return 'Pendente';
      case 'PROCESSADO': return 'Processando';
      case 'CONCLUIDO': return 'Concluído';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE': return '#ff9800';
      case 'PROCESSADO': return '#2196f3';
      case 'CONCLUIDO': return '#4caf50';
      case 'CANCELADO': return '#f44336';
      default: return '#757575';
    }
  };

  const handleImprimir = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Detalhes do Pedido ${pedido.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .header h1 { margin: 0; color: #1976d2; }
            .info-section { margin-bottom: 25px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
            .info-section h3 { margin-top: 0; color: #1976d2; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .info-row { display: flex; margin-bottom: 8px; }
            .info-label { font-weight: bold; min-width: 150px; }
            .status-chip { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; }
            .status-pendente { background-color: #ff9800; }
            .status-processado { background-color: #2196f3; }
            .status-concluido { background-color: #4caf50; }
            .status-cancelado { background-color: #f44336; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #1976d2; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Detalhes do Pedido: ${pedido.id}</h1>
            <p>Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
          </div>

          <div class="info-section">
            <h3>Informações Gerais</h3>
            <div class="info-row">
              <span class="info-label">ID:</span>
              <span>${pedido.id}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Cliente:</span>
              <span>${pedido.cliente.nome}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Data:</span>
              <span>${formatarData(pedido.dataInicio)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="status-chip status-${pedido.status.toLowerCase()}">
                ${getStatusText(pedido.status)}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Valor de Entrada:</span>
              <span>${formatarValor(pedido.valorEntrada)}</span>
            </div>
          </div>

          ${pedido.produtos && pedido.produtos.length > 0 ? `
            <div class="info-section">
              <h3>Produtos</h3>
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th class="text-center">Quantidade</th>
                    <th class="text-right">Preço Unit.</th>
                    <th class="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${pedido.produtos.map(item => `
                    <tr>
                      <td>${item.produto?.nome || `Produto ${item.produtoId}`}</td>
                      <td class="text-center">${item.quantidade}</td>
                      <td class="text-right">${formatarValor(item.preco)}</td>
                      <td class="text-right">${formatarValor(item.quantidade * item.preco)}</td>
                    </tr>
                  `).join('')}
                  <tr style="background-color: #e3f2fd; font-weight: bold;">
                    <td colspan="3" class="text-right">Total Produtos:</td>
                    <td class="text-right">${formatarValor(
                      pedido.produtos.reduce((sum, item) => sum + item.quantidade * item.preco, 0)
                    )}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}

          ${pedido.materiasPrimas && pedido.materiasPrimas.length > 0 ? `
            <div class="info-section">
              <h3>Matérias-primas</h3>
              <table>
                <thead>
                  <tr>
                    <th>Matéria-prima</th>
                    <th class="text-center">Quantidade</th>
                    <th class="text-right">Preço Unit.</th>
                    <th class="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${pedido.materiasPrimas.map(item => `
                    <tr>
                      <td>${item.materiaPrima?.nome || `Matéria-prima ${item.materiaPrimaId}`}</td>
                      <td class="text-center">${item.quantidade}</td>
                      <td class="text-right">${formatarValor(item.preco)}</td>
                      <td class="text-right">${formatarValor(item.quantidade * item.preco)}</td>
                    </tr>
                  `).join('')}
                  <tr style="background-color: #e8f5e8; font-weight: bold;">
                    <td colspan="3" class="text-right">Total Matérias-primas:</td>
                    <td class="text-right">${formatarValor(
                      pedido.materiasPrimas.reduce((sum, item) => sum + item.quantidade * item.preco, 0)
                    )}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}
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
