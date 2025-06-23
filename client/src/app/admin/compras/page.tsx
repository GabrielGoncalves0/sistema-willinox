'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  TextField,
  InputAdornment,
  Grid,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Search } from 'lucide-react';
import HelpCollapse from '@/components/HelpCollapse';

import { useCompra, CompraDetalhada, CompraComItens, CompraComItensUpdate } from '@/hooks/useCompra';
import { useFormModal } from '@/hooks/common/useFormModal';
import { useTableActions } from '@/hooks/common/useTableActions';

import CompraTable from './components/CompraTable';
import CompraForm from './components/CompraForm';
import CompraDelete from './components/CompraDelete';
import { CompraDetailsModal } from './components/CompraDetailsModal';
import { CompraStatus, getStatusColor, getStatusText } from './constants';
import { useDateFormatter } from '@/hooks/common/useDateFormatter';

export default function ComprasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompraForDetails, setSelectedCompraForDetails] = useState<CompraDetalhada | null>(null);

  const { formatForAPI } = useDateFormatter();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const {
    compras,
    isLoading,
    createCompra,
    updateCompra,
    deleteCompra,
    finalizarCompra,
    cancelarCompra
  } = useCompra();

  const formModal = useFormModal<CompraDetalhada>();

  const tableActions = useTableActions<CompraDetalhada>({
    onDelete: async (compra) => {
      await deleteCompra(compra.compra.id);
    },
  });



  const handleSubmit = async (data: CompraComItens | CompraComItensUpdate) => {
    if ('id' in data) {
      await updateCompra(data as CompraComItensUpdate);
    } else {
      await createCompra(data as CompraComItens);
    }
  };

  const handleFinalize = async (compra: CompraDetalhada) => {
    await finalizarCompra(compra.compra.id, {
      id: compra.compra.id,
      data: formatForAPI(compra.compra.data),
      juridicaId: compra.compra.juridicaId,
      valorTotal: compra.compra.valorTotal,
      itens: compra.itens
    });
  };

  const handleCancel = async (compra: CompraDetalhada) => {
    await cancelarCompra(compra.compra.id, {
      id: compra.compra.id,
      data: formatForAPI(compra.compra.data),
      juridicaId: compra.compra.juridicaId,
      valorTotal: compra.compra.valorTotal,
      itens: compra.itens
    });
  };

  const handleViewDetails = (compra: CompraDetalhada) => {
    setSelectedCompraForDetails(compra);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedCompraForDetails(null);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>

        <HelpCollapse
          title="Gerenciamento de Compras"
          content={
            <>
              <Typography paragraph>
                Esta página permite gerenciar as compras de matérias-primas da empresa. Aqui você pode:
              </Typography>
              <ul>
                <li><strong>Excluir:</strong> Remova uma compra do sistema.</li>
                <li><strong>Finalizar:</strong> Conclua uma compra, atualizando o estoque de matérias-primas.</li>
                <li><strong>Cancelar:</strong> Cancele uma compra em andamento.</li>
              </ul>
              <Typography paragraph>
                <strong>Status:</strong> O status da compra é indicado por cores:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Pendente" sx={{ bgcolor: getStatusColor(CompraStatus.PENDENTE), color: 'white', fontWeight: 'bold' }} size="small" />
                <Chip label="Processando" sx={{ bgcolor: getStatusColor(CompraStatus.PROCESSANDO), color: 'white', fontWeight: 'bold' }} size="small" />
                <Chip label="Concluído" sx={{ bgcolor: getStatusColor(CompraStatus.CONCLUIDO), color: 'white', fontWeight: 'bold' }} size="small" />
                <Chip label="Cancelado" sx={{ bgcolor: getStatusColor(CompraStatus.CANCELADO), color: 'white', fontWeight: 'bold' }} size="small" />
              </Box>
            </>
          }
        />

        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Gerenciamento de Compras
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar compras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => formModal.openForm()}
            >
              Nova Compra
            </Button>
          </Grid>
        </Grid>

        <CompraTable
          compras={compras}
          onEdit={(compra?: CompraDetalhada) => formModal.openForm(compra)}
          onDelete={tableActions.openDeleteDialog}
          onFinalize={handleFinalize}
          onCancel={handleCancel}
          onViewDetails={handleViewDetails}
          isLoading={isLoading}
          searchTerm={searchTerm}
        />
      </Box>

      <CompraForm
        open={formModal.isOpen}
        onClose={formModal.closeForm}
        onSubmit={handleSubmit}
        initialData={formModal.currentItem || undefined}
      />

      <CompraDelete
        open={tableActions.isDeleteDialogOpen}
        onClose={tableActions.closeDeleteDialog}
        onConfirm={tableActions.confirmDelete}
        compra={tableActions.selectedItem}
      />

      <CompraDetailsModal
        open={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        compra={selectedCompraForDetails}
      />
    </Container>
  );
}
