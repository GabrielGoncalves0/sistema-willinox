'use client';

import {
  Modal,
  Button,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Printer } from 'lucide-react';
import { ProdutoReport } from '../schema';
import { formatarValor } from '../services';
import { pdf } from '@react-pdf/renderer';
import ProdutoPDFDocument from './ProdutoPDFDocument';

interface ProdutoDetailsModalProps {
  open: boolean;
  onClose: () => void;
  produto: ProdutoReport | null;
}

export default function ProdutoDetailsModal({ open, onClose, produto }: ProdutoDetailsModalProps) {
  if (!produto) return null;

  const handleImprimir = async () => {
    if (!produto) return;
    const blob = await pdf(<ProdutoPDFDocument produto={produto} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `produto_${produto.codigo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-detalhes-produto"
      aria-describedby="modal-detalhes-produto-description"
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
        <Typography id="modal-detalhes-produto" variant="h6" component="h2" sx={{ mb: 2 }}>
          Detalhes do Produto: {produto.codigo}
        </Typography>

        <List sx={{ bgcolor: 'background.paper', mb: 3 }}>
          <ListItem divider>
            <ListItemText
              primary="Código"
              secondary={produto.codigo}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Nome"
              secondary={produto.nome}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Descrição"
              secondary={produto.descricao || 'Não informado'}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Modelo"
              secondary={produto.modelo.nome}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Preço"
              secondary={formatarValor(produto.preco)}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Quantidade em Estoque"
              secondary={produto.qtdEstoque}
            />
          </ListItem>
          <ListItem divider>
            <ListItemText
              primary="Valor Total em Estoque"
              secondary={formatarValor(produto.preco * produto.qtdEstoque)}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Status"
              secondary={
                <Chip
                  label={produto.ativo ? 'Ativo' : 'Inativo'}
                  color={produto.ativo ? 'success' : 'error'}
                  size="small"
                  sx={{ mt: 1, fontWeight: 'medium' }}
                />
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
