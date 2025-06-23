'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import HelpCollapse from '@/components/HelpCollapse';

import { useFornecedor } from '../../../hooks/useFornecedor';
import { useFormModal } from '@/hooks/common/useFormModal';
import { useTableActions } from '@/hooks/common/useTableActions';

import { FornecedorForm } from './components/FornecedorForm';
import { FornecedorTable } from './components/FornecedorTable';
import DeleteFornecedorDialog from './components/DeleteFornecedorDialog';
import { CreateFornecedor, listarFornecedor } from './constants';


export default function FornecedoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInativos, setShowInativos] = useState(false);

  const {
    fornecedores,
    isLoading,
    createFornecedor,
    updateFornecedor,
    deleteFornecedor,
    restaurarFornecedor,
    fetchFornecedores,
  } = useFornecedor();

  const formModal = useFormModal<listarFornecedor>();

  const tableActions = useTableActions<listarFornecedor>({
    onDelete: async (fornecedor) => {
      await deleteFornecedor(fornecedor.id, showInativos);
    },
    onRestore: async (fornecedor) => {
      try {
        await restaurarFornecedor(fornecedor.id, showInativos);
      } catch (error) {
        toast.error('Erro ao restaurar o fornecedor.');
      }
    },
  });

  const handleSave = async (fornecedorData: CreateFornecedor): Promise<boolean> => {
    try {
      if (formModal.isEditing && formModal.currentItem) {
        await updateFornecedor({ ...fornecedorData, id: formModal.currentItem.id });
      } else {
        await createFornecedor(fornecedorData);
      }
      return true;
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      toast.error('Erro ao salvar fornecedor.');
      return false;
    }
  };

  const handleToggleInativos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setShowInativos(checked);
    fetchFornecedores(checked);
  };

  return (
    <Box sx={{ p: 3 }}>

      <HelpCollapse
        title="Gerenciamento de Fornecedores"
        content={
          <>
            <Typography paragraph>
              Esta página permite gerenciar os fornecedores da empresa. Aqui você pode:
            </Typography>
            <ul>
              <li><strong>Excluir:</strong> Remova um fornecedor do sistema.</li>
            </ul>
            <Typography paragraph>
              <strong>Importante:</strong> Os fornecedores são utilizados no processo de compra de matérias-primas.
            </Typography>
            <Typography paragraph>
              <strong>Dica:</strong> Mantenha as informações de contato dos fornecedores sempre atualizadas para facilitar a comunicação.
            </Typography>
          </>
        }
      />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Gerenciamento de Fornecedores
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Buscar fornecedores..."
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
            Novo Fornecedor
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showInativos}
              onChange={handleToggleInativos}
              color="primary"
            />
          }
          label={showInativos ? "Mostrar apenas fornecedores inativos" : "Mostrar apenas fornecedores ativos"}
        />
      </Box>

        <FornecedorTable
          fornecedores={fornecedores}
          onEdit={(fornecedor: listarFornecedor | null) => formModal.openForm(fornecedor || undefined)}
          onDelete={tableActions.openDeleteDialog}
          onRestore={tableActions.handleRestore!}
          isLoading={isLoading}
          searchTerm={searchTerm}
          showInativos={showInativos}
        />

      <FornecedorForm
        open={formModal.isOpen}
        onClose={formModal.closeForm}
        onSubmit={handleSave}
        initialData={formModal.currentItem ?? undefined}
        isEditing={formModal.isEditing}
      />

      <DeleteFornecedorDialog
        open={tableActions.isDeleteDialogOpen}
        onClose={tableActions.closeDeleteDialog}
        onConfirm={tableActions.confirmDelete}
        fornecedor={tableActions.selectedItem}
      />
    </Box>
  );
}
