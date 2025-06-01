'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  InputAdornment,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Plus, Search } from 'lucide-react';
import HelpCollapse from '@/components/HelpCollapse';

import { useModelos } from '../../../hooks/useModelo';
import { useFormModal } from '@/hooks/common/useFormModal';
import { useTableActions } from '@/hooks/common/useTableActions';

import { ModelForm } from './components/ModelForm';
import ModelTable from './components/ModelTable';
import DeleteModelDialog from './components/DeleteModelDialog';
import { Modelo } from './constants';

export default function ModelosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInativos, setShowInativos] = useState(false);

  const {
    modelos,
    createModelo,
    updateModelo,
    deleteModelo,
    restaurarModelo,
    fetchModelos,
    isLoading,
  } = useModelos();

  const formModal = useFormModal<Modelo>();

  const tableActions = useTableActions<Modelo>({
    onDelete: async (model) => {
      await deleteModelo(model.id);
    },
    onRestore: async (model) => {
      await restaurarModelo(model.id, showInativos);
    },
  });

  const handleSave = async (modelData: Omit<Modelo, 'id'>) => {
    if (formModal.isEditing && formModal.currentItem) {
      await updateModelo({ ...formModal.currentItem, ...modelData });
    } else {
      await createModelo(modelData);
    }
    formModal.closeForm();
  };

  const handleToggleInativos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setShowInativos(checked);
    fetchModelos(checked);
  };

  const filteredModels = Array.isArray(modelos)
  ? modelos.filter((model) =>
    Object.values(model).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : [];

  return (
    <Box sx={{ p: 3 }}>

      <HelpCollapse
        title="Gerenciamento de Modelos"
        content={
          <>
            <Typography paragraph>
              Esta página permite gerenciar os modelos de produtos da empresa. Aqui você pode:
            </Typography>
            <ul>
              <li><strong>Excluir:</strong> Remova um modelo do sistema.</li>
            </ul>
            <Typography paragraph>
              <strong>Importante:</strong> Os modelos são utilizados na criação de produtos. Cada produto deve estar associado a um modelo.
            </Typography>
            <Typography paragraph>
              <strong>Dica:</strong> Crie modelos que representem categorias ou tipos de produtos para facilitar a organização do seu catálogo.
            </Typography>
          </>
        }
      />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Gerenciamento de Modelos
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Pesquisar modelos..."
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
        <Grid item xs={12} md={6} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => formModal.openForm()}
          >
            Adicionar Modelo
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
          label={showInativos ? "Mostrar apenas modelos inativos" : "Mostrar apenas modelos ativos"}
        />
      </Box>

      <ModelTable
        models={filteredModels}
        onEdit={formModal.openForm}
        onDelete={tableActions.openDeleteDialog}
        onRestore={tableActions.handleRestore!}
        isLoading={isLoading}
        searchTerm={searchTerm}
        showInativos={showInativos}
      />

      <ModelForm
        open={formModal.isOpen}
        onClose={formModal.closeForm}
        onSubmit={handleSave}
        initialData={formModal.currentItem || undefined}
        isEditing={formModal.isEditing}
      />

      <DeleteModelDialog
        open={tableActions.isDeleteDialogOpen}
        onClose={tableActions.closeDeleteDialog}
        onConfirm={tableActions.confirmDelete}
        model={tableActions.selectedItem}
      />
    </Box>
  );
}
