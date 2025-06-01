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
  Chip,
} from '@mui/material';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import HelpCollapse from '@/components/HelpCollapse';

import { useFuncionario } from '@/hooks/useFuncionario';
import { useFormModal } from '@/hooks/common/useFormModal';
import { useTableActions } from '@/hooks/common/useTableActions';

import { FuncionarioForm } from './components/FuncionarioForm';
import DeleteFuncionarioDialog from './components/DeleteFuncionarioDialog';
import FuncionarioTable from './components/FuncionarioTable';
import { CreateFuncionario, listarFuncionario } from './constants';

export default function FuncionariosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInativos, setShowInativos] = useState(false);

  const {
    funcionarios,
    isLoading,
    createFuncionario,
    updateFuncionario,
    deleteFuncionario,
    restaurarFuncionario,
    fetchFuncionarios,
  } = useFuncionario();

  const formModal = useFormModal<listarFuncionario>();

  const tableActions = useTableActions<listarFuncionario>({
    onDelete: async (funcionario) => {
      await deleteFuncionario(funcionario.id);
    },
    onRestore: async (funcionario) => {
      try {
        await restaurarFuncionario(funcionario.id);
      } catch {
        toast.error('Erro ao restaurar o funcionário.');
      }
    },
  });

  const handleSave = async (funcionarioData: CreateFuncionario): Promise<boolean> => {
    try {
      if (formModal.isEditing && formModal.currentItem) {
        await updateFuncionario({ ...funcionarioData, id: formModal.currentItem.id });
      } else {
        await createFuncionario(funcionarioData);
      }
      return true;
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      toast.error('Erro ao salvar funcionário.');
      return false;
    }
  };

  const handleToggleInativos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setShowInativos(checked);
    fetchFuncionarios(checked);
  };

  return (
    <Box sx={{ p: 3 }}>

      <HelpCollapse
        title="Gerenciamento de Funcionários"
        content={
          <>
            <Typography paragraph>
              Esta página permite gerenciar os funcionários da empresa. Aqui você pode:
            </Typography>
            <ul>
              <li><strong>Excluir:</strong> Remova um funcionário do sistema.</li>
            </ul>
            <Typography paragraph>
              <strong>Acesso ao Sistema:</strong> Você pode definir se o funcionário terá acesso ao sistema, criando um login e senha para ele.
            </Typography>
            <Typography paragraph>
              <strong>Importante:</strong> Os funcionários são associados às produções como responsáveis pelo processo produtivo.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip label="Sim" sx={{ backgroundColor: '#06c14a', color: 'white' }} />
              <Typography variant="body2" sx={{ mr: 2 }}>Tem acesso ao sistema</Typography>
              <Chip label="Não" sx={{ backgroundColor: '#9e9e9e', color: 'white' }} />
              <Typography variant="body2">Não tem acesso ao sistema</Typography>
            </Box>
          </>
        }
      />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Gerenciamento de Funcionários
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Buscar funcionários..."
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
            Novo Funcionário
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
          label={showInativos ? "Mostrar apenas funcionários inativos" : "Mostrar apenas funcionários ativos"}
        />
      </Box>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <FuncionarioTable
          funcionarios={funcionarios}
          onEdit={(funcionario: listarFuncionario | null) => formModal.openForm(funcionario || undefined)}
          onDelete={tableActions.openDeleteDialog}
          onRestore={tableActions.handleRestore!}
          isLoading={isLoading}
          searchTerm={searchTerm}
          showInativos={showInativos}
        />
      )}

      <FuncionarioForm
        open={formModal.isOpen}
        onClose={formModal.closeForm}
        onSubmit={handleSave}
        initialData={formModal.currentItem ?? undefined}
        isEditing={formModal.isEditing}
      />

      <DeleteFuncionarioDialog
        open={tableActions.isDeleteDialogOpen}
        onClose={tableActions.closeDeleteDialog}
        onConfirm={tableActions.confirmDelete}
        funcionario={tableActions.selectedItem}
      />
    </Box>
  );
}
