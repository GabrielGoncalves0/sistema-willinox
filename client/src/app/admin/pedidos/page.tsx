'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import { Plus, Search } from 'lucide-react';
import { PedidoPageHelp } from '@/components/help';
import CustomizedProgressBars from '@/components/ProgressLoading';

import { usePedido } from '@/hooks/usePedido';
import { useFormModal } from '@/hooks/common/useFormModal';
import { useTableActions } from '@/hooks/common/useTableActions';

import PedidoTable from './components/PedidoTable';
import PedidoForm from './components/PedidoForm';
import PedidoDelete from './components/PedidoDelete';
import { PedidoDetalhado, PedidoComItens, PedidoComItensUpdate } from './constants';
import { useDateFormatter } from '@/hooks/common/useDateFormatter';

export default function PedidosPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { formatForAPI } = useDateFormatter();

  const {
    pedidos,
    isLoading,
    createPedido,
    updatePedido,
    deletePedido,
    finalizarPedido,
    cancelarPedido
  } = usePedido();

  const formModal = useFormModal<PedidoDetalhado>();

  const tableActions = useTableActions<PedidoDetalhado>({
    onDelete: async (pedido) => {
      await deletePedido(pedido.pedido.id);
    },
  });

  const handleSubmit = async (data: PedidoComItens | PedidoComItensUpdate) => {
    if ('id' in data) {
      await updatePedido(data as PedidoComItensUpdate);
    } else {
      await createPedido(data);
    }
  };

  const handleFinalize = async (pedido: PedidoDetalhado) => {
    if (pedido) {

      const produtosValidos = pedido.produtos.filter(p => p.produtoId !== undefined && p.produtoId !== null);

      const materiasPrimasValidas = pedido.materiasPrimas.filter(mp => mp.materiaPrimaId !== undefined && mp.materiaPrimaId !== null);

      const pedidoData: PedidoComItensUpdate = {
        id: pedido.pedido.id,
        data: formatForAPI(pedido.pedido.data),
        pessoaId: pedido.pedido.pessoaId,
        produtos: produtosValidos.length > 0 ? produtosValidos : undefined,
        materiasPrimas: materiasPrimasValidas.length > 0 ? materiasPrimasValidas : undefined
      };
      await finalizarPedido(pedido.pedido.id, pedidoData);
    }
  };

  const handleCancel = async (pedido: PedidoDetalhado) => {
    if (pedido) {

      const produtosValidos = pedido.produtos.filter(p => p.produtoId !== undefined && p.produtoId !== null);


      const materiasPrimasValidas = pedido.materiasPrimas.filter(mp => mp.materiaPrimaId !== undefined && mp.materiaPrimaId !== null);

      const pedidoData: PedidoComItensUpdate = {
        id: pedido.pedido.id,
        data: formatForAPI(pedido.pedido.data),
        pessoaId: pedido.pedido.pessoaId,
        produtos: produtosValidos.length > 0 ? produtosValidos : undefined,
        materiasPrimas: materiasPrimasValidas.length > 0 ? materiasPrimasValidas : undefined
      };
      await cancelarPedido(pedido.pedido.id, pedidoData);
    }
  };

  return (
    <Box sx={{ p: 3 }}>

      <PedidoPageHelp />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Gerenciamento de Pedidos
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Buscar pedidos..."
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
            startIcon={<Plus size={20} />}
            onClick={() => formModal.openForm()}
          >
            Novo Pedido
          </Button>
        </Grid>
      </Grid>

      <PedidoTable
        pedidos={pedidos}
        onEdit={(pedido?: PedidoDetalhado) => formModal.openForm(pedido)}
        onDelete={tableActions.openDeleteDialog}
        onFinalize={handleFinalize}
        onCancel={handleCancel}
        isLoading={isLoading}
        searchTerm={searchTerm}
      />

      <PedidoForm
        open={formModal.isOpen}
        onClose={formModal.closeForm}
        onSubmit={handleSubmit}
        initialData={formModal.currentItem || undefined}
      />

      <PedidoDelete
        open={tableActions.isDeleteDialogOpen}
        onClose={tableActions.closeDeleteDialog}
        onConfirm={tableActions.confirmDelete}
        pedido={tableActions.selectedItem}
      />
    </Box>
  );
}
