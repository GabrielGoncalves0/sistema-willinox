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

interface ProdutoDetailsModalProps {
  open: boolean;
  onClose: () => void;
  produto: ProdutoReport | null;
}

export default function ProdutoDetailsModal({ open, onClose, produto }: ProdutoDetailsModalProps) {
  if (!produto) return null;

  const handleImprimir = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Detalhes do Produto ${produto.codigo}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .header h1 { margin: 0; color: #1976d2; }
            .info-section { margin-bottom: 25px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
            .info-section h3 { margin-top: 0; color: #1976d2; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .info-row { display: flex; margin-bottom: 8px; }
            .info-label { font-weight: bold; min-width: 150px; }
            .status-chip { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; color: white; }
            .status-ativo { background-color: #4caf50; }
            .status-inativo { background-color: #f44336; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Detalhes do Produto: ${produto.codigo}</h1>
            <p>Data de emissão: ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>

          <div class="info-section">
            <h3>Informações Gerais</h3>
            <div class="info-row">
              <span class="info-label">Código:</span>
              <span>${produto.codigo}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Nome:</span>
              <span>${produto.nome}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Descrição:</span>
              <span>${produto.descricao || 'Não informado'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Modelo:</span>
              <span>${produto.modelo.nome}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Preço:</span>
              <span>${formatarValor(produto.preco)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Quantidade em Estoque:</span>
              <span>${produto.qtdEstoque}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Valor Total em Estoque:</span>
              <span><strong>${formatarValor(produto.preco * produto.qtdEstoque)}</strong></span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="status-chip status-${produto.ativo ? 'ativo' : 'inativo'}">
                ${produto.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>
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
