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
import { pdf } from '@react-pdf/renderer';
import ProducaoPDFDocument from './ProducaoPDFDocument';

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
    if (!producao) return;
    const blob = await pdf(<ProducaoPDFDocument producao={producao} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `producao_${producao.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
