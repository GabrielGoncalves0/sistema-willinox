'use client';

import {
  Box,
  Button,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import HelpCollapse from '@/components/HelpCollapse';

import { useProducao, Producao } from '../../../hooks/useProducao';
import { useFormModal } from '@/hooks/common/useFormModal';
import { useTableActions } from '@/hooks/common/useTableActions';

import { ListarProducao } from './constants';
import httpClient from '@/utils/httpClient';
import ProducaoTable from './components/ProducaoTable';
import DeleteProducaoDialog from './components/DeleteDialog';
import ProducaoForm from './components/ProducaoForm';
import { useDateFormatter } from '@/hooks/common/useDateFormatter';

export default function ProducaoPage() {
  const [producoesDetalhadas, setProducoesDetalhadas] = useState<ListarProducao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const { formatForAPI } = useDateFormatter();

  const { producoes, createProducao, updateProducao, deleteProducao, finalizarProducao, cancelarProducao } = useProducao();

  const formModal = useFormModal<ListarProducao>();

  const tableActions = useTableActions<ListarProducao>({
    onDelete: async (producao) => {
      await deleteProducao(producao.id);
    },
  });

  useEffect(() => {
    const fetchProducoesDetalhadas = async () => {
      try {
        setIsLoading(true);
        const response = await httpClient.get<ListarProducao[]>('/producao');

        const uniqueProducoes = response.data.reduce((acc: ListarProducao[], current) => {
          const x = acc.find(item => item.id === current.id);
          if (!x) {
            return acc.concat([current]);
          } else {
            console.warn(`Produção duplicada encontrada com ID ${current.id}`);
            return acc;
          }
        }, []);

        setProducoesDetalhadas(uniqueProducoes);
      } catch (err) {
        console.error('Erro ao carregar produções detalhadas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducoesDetalhadas();
  }, [producoes]);

  const handleFinalize = async (producao: ListarProducao) => {
    if (producao) {
      await finalizarProducao({
        id: producao.id,
        fisicaId: producao.fisica.id,
        produtoId: producao.produto.id,
        status: producao.status,
        dataInicio: producao.dataInicio,
        quantidade: producao.quantidade
      });
    }
  };

  const handleCancel = async (producao: ListarProducao) => {
    if (producao) {
      await cancelarProducao({
        id: producao.id,
        fisicaId: producao.fisica.id,
        produtoId: producao.produto.id,
        status: producao.status,
        dataInicio: producao.dataInicio,
        quantidade: producao.quantidade
      });
    }
  };



  const filteredProducoes = producoesDetalhadas.filter(producao =>
    producao.fisica.pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producao.produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producao.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>

      <HelpCollapse
        title="Gerenciamento de Produções"
        content={
          <>
            <Typography paragraph>
              Esta página permite gerenciar as produções da empresa. Aqui você pode:
            </Typography>
            <ul>
              <li><strong>Excluir:</strong> Remova uma produção do sistema.</li>
              <li><strong>Finalizar:</strong> Conclua uma produção, registrando automaticamente a data de finalização.</li>
              <li><strong>Cancelar:</strong> Cancele uma produção em andamento.</li>
            </ul>
            <Typography paragraph>
              <strong>Status:</strong> O status da produção é indicado por cores:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Pendente" color="warning" size="small" />
              <Chip label="Em Andamento" color="info" size="small" />
              <Chip label="Concluído" color="success" size="small" />
              <Chip label="Cancelado" color="error" size="small" />
            </Box>
          </>
        }
      />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Gerenciamento de Produções
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Buscar produções..."
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
            Nova Produção
          </Button>
        </Grid>
      </Grid>

        <ProducaoTable
          producoes={filteredProducoes}
          onEdit={(producao: ListarProducao) => formModal.openForm(producao)}
          onDelete={tableActions.openDeleteDialog}
          onFinalize={handleFinalize}
          onCancel={handleCancel}
          isLoading={isLoading}
          searchTerm={searchTerm}
        />

      <ProducaoForm
        open={formModal.isOpen}
        onClose={formModal.closeForm}
        onSubmit={formModal.currentItem ? updateProducao : createProducao}
        initialData={formModal.currentItem}
        isEditing={Boolean(formModal.currentItem)}
      />

      <DeleteProducaoDialog
        open={tableActions.isDeleteDialogOpen}
        onClose={tableActions.closeDeleteDialog}
        onConfirm={tableActions.confirmDelete}
        producao={tableActions.selectedItem}
      />
    </Box>
  );
}
