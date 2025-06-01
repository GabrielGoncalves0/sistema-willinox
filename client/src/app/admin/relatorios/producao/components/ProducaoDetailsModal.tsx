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
import { ProducaoReport } from '../schema';
import { format } from 'date-fns';

interface ProducaoDetailsModalProps {
  open: boolean;
  onClose: () => void;
  producao: ProducaoReport | null;
}

export default function ProducaoDetailsModal({ open, onClose, producao }: ProducaoDetailsModalProps) {
  if (!producao) return null;

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
      case 'EM_ANDAMENTO': return 'Em Andamento';
      case 'CONCLUIDO': return 'Concluído';
      case 'CANCELADO': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE': return '#ff9800';
      case 'EM_ANDAMENTO': return '#2196f3';
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
          <title>Detalhes da Produção ${producao.id}</title>
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
            .status-em_andamento { background-color: #2196f3; }
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
            <h1>Detalhes da Produção: ${producao.id}</h1>
            <p>Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
          </div>

          <div class="info-section">
            <h3>Informações Gerais</h3>
            <div class="info-row">
              <span class="info-label">ID:</span>
              <span>${producao.id}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Produto:</span>
              <span>${producao.produto.nome}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Funcionário:</span>
              <span>${producao.funcionario.nome}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Quantidade:</span>
              <span>${producao.quantidade}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Data de Início:</span>
              <span>${formatarData(producao.dataInicio)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Data de Fim:</span>
              <span>${formatarData(producao.dataFim)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="status-chip status-${producao.status.toLowerCase()}">
                ${getStatusText(producao.status)}
              </span>
            </div>
          </div>

          ${producao.materiasPrimas && producao.materiasPrimas.length > 0 ? `
            <div class="info-section">
              <h3>Matérias-primas Utilizadas</h3>
              <table>
                <thead>
                  <tr>
                    <th>Matéria-prima</th>
                    <th class="text-center">Quantidade Utilizada</th>
                  </tr>
                </thead>
                <tbody>
                  ${producao.materiasPrimas.map(item => `
                    <tr>
                      <td>${item.materiaPrima?.nome || `Matéria-prima ${item.materiaPrimaId}`}</td>
                      <td class="text-center">${item.quantidade}</td>
                    </tr>
                  `).join('')}
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
      aria-labelledby="modal-detalhes-producao"
      aria-describedby="modal-detalhes-producao-description"
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
        <Typography id="modal-detalhes-producao" variant="h6" component="h2" sx={{ mb: 2 }}>
          Detalhes da Produção: {producao.id}
        </Typography>

        <List sx={{ bgcolor: 'background.paper', mb: 3 }}>
          <ListItem divider>
            <ListItemText
              primary="Produto"
              secondary={producao.produto.nome}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Funcionário"
              secondary={producao.funcionario.nome}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Quantidade"
              secondary={producao.quantidade}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Data de Início"
              secondary={formatarData(producao.dataInicio)}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Data de Fim"
              secondary={formatarData(producao.dataFim)}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Status"
              secondary={
                <Chip
                  label={getStatusText(producao.status)}
                  sx={{
                    bgcolor: getStatusColor(producao.status),
                    color: 'white',
                    fontWeight: 'bold',
                    mt: 1
                  }}
                  size="small"
                />
              }
            />
          </ListItem>

          {producao.materiasPrimas && producao.materiasPrimas.length > 0 && (
            <ListItem>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Matérias-primas Utilizadas
                  </Typography>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Matéria-prima</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quantidade Utilizada</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {producao.materiasPrimas.map((item, index) => (
                            <TableRow key={`materia-prima-${index}`}>
                              <TableCell>{item.materiaPrima?.nome || `Matéria-prima ${item.materiaPrimaId}`}</TableCell>
                              <TableCell align="center">{item.quantidade}</TableCell>
                            </TableRow>
                          ))}
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
