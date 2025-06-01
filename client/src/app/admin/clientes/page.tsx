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

import { useCliente } from '../../../hooks/useCliente';
import { useFormModal } from '@/hooks/common/useFormModal';
import { useTableActions } from '@/hooks/common/useTableActions';

import { ClienteForm } from './components/ClienteForm';
import { ClienteTable } from './components/ClienteTable';
import { DeleteClienteDialog } from './components/DeleteClienteDialog';
import { CreateCliente, listarCliente } from './constants';

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInativos, setShowInativos] = useState(false);

  const {
    clientes,
    isLoading,
    createCliente,
    updateCliente,
    deleteCliente,
    restaurarCliente,
    fetchClientes,
  } = useCliente();

  const formModal = useFormModal<listarCliente>();

  const tableActions = useTableActions<listarCliente>({
    onDelete: async (cliente) => {
      await deleteCliente(cliente.id, cliente.tipo);
    },
    onRestore: async (cliente) => {
      try {
        await restaurarCliente(cliente.id, cliente.tipo);
      } catch {
        toast.error('Erro ao restaurar o cliente.');
      }
    },
  });

  const handleSave = async (clienteData: CreateCliente): Promise<boolean> => {
    try {
      if (formModal.isEditing && formModal.currentItem) {
        await updateCliente({ ...clienteData, id: formModal.currentItem.id });
      } else {
        await createCliente(clienteData);
      }
      return true;
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast.error('Erro ao salvar cliente.');
      return false;
    }
  };

  const handleToggleInativos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setShowInativos(checked);
    fetchClientes(checked);
  };

  return (
    <Box sx={{ p: 3 }}>

      <HelpCollapse
        title="Gerenciamento de Clientes"
        content={
          <>
            <Typography paragraph>
              Esta página permite gerenciar os clientes da empresa. Aqui você pode:
            </Typography>
            <ul>
              <li><strong>Excluir:</strong> Remova um cliente do sistema.</li>
            </ul>
            <Typography paragraph>
              <strong>Pessoa Física:</strong> Para clientes pessoa física, são necessários nome, endereço, telefone, email, CPF e data de nascimento.
            </Typography>
            <Typography paragraph>
              <strong>Pessoa Jurídica:</strong> Para clientes pessoa jurídica, são necessários nome, endereço, telefone, email e CNPJ.
            </Typography>
            <Typography paragraph>
              <strong>Importante:</strong> Os clientes são utilizados no processo de criação de pedidos.
            </Typography>
          </>
        }
      />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Gerenciamento de Clientes
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Buscar clientes..."
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
            Novo Cliente
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
          label={showInativos ? "Mostrar apenas clientes inativos" : "Mostrar apenas clientes ativos"}
        />
      </Box>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <ClienteTable
          clientes={clientes}
          onEdit={(cliente: listarCliente | null) => formModal.openForm(cliente || undefined)}
          onDelete={tableActions.openDeleteDialog}
          onRestore={tableActions.handleRestore!}
          isLoading={isLoading}
          searchTerm={searchTerm}
          showInativos={showInativos}
        />
      )}

      <ClienteForm
        open={formModal.isOpen}
        onClose={formModal.closeForm}
        onSubmit={handleSave}
        initialData={formModal.currentItem ?? undefined}
        isEditing={formModal.isEditing}
      />

      <DeleteClienteDialog
        open={tableActions.isDeleteDialogOpen}
        onClose={tableActions.closeDeleteDialog}
        onConfirm={tableActions.confirmDelete}
        cliente={tableActions.selectedItem}
      />
    </Box>
  );
}
