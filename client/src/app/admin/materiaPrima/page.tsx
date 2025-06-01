'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Plus, FileSpreadsheet, Search } from 'lucide-react';
import { toast } from 'sonner';
import HelpCollapse from '@/components/HelpCollapse';

import { useMateriasPrimas } from '../../../hooks/useMateriaPrima';
import { useFormModal } from '@/hooks/common/useFormModal';
import { useTableActions } from '@/hooks/common/useTableActions';
import { useExport } from '@/hooks/common/useExport';

import { MateriaPrimaTable } from './components/MateriaPrimaTable';
import { MateriaPrima } from './constants';
import { DeleteMateriaPrima } from './components/DeleteMateriaPrima';
import { MateriaPrimaForm } from './components/MateriaPrimaForm';

export default function MateriasPrimasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInativos, setShowInativos] = useState(false);

  const {
    materiasPrimas,
    isLoading,
    createMateriaPrima,
    updateMateriaPrima,
    deleteMateriaPrima,
    restaurarMateriaPrima,
    fetchMateriasPrimas,
  } = useMateriasPrimas();

  const formModal = useFormModal<MateriaPrima>();
  const { exportToExcel } = useExport();

  const tableActions = useTableActions<MateriaPrima>({
    onDelete: async (material) => {
      await deleteMateriaPrima(material.id);
    },
    onRestore: async (material) => {
      try {
        await restaurarMateriaPrima(material.id);
      } catch {
        toast.error('Erro ao restaurar a matéria-prima.');
      }
    },
  });

  const handleSaveMaterial = async (materialData: Partial<MateriaPrima>): Promise<boolean> => {
    try {
      let result: boolean;
      if (formModal.isEditing && formModal.currentItem) {
        result = await updateMateriaPrima({ ...formModal.currentItem, ...materialData });
      } else {
        result = await createMateriaPrima(materialData);
      }
      return result;
    } catch (error) {
      console.error('Erro ao salvar matéria-prima:', error);
      toast.error('Erro ao salvar matéria-prima.');
      return false;
    }
  };

  const handleToggleInativos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setShowInativos(checked);
    fetchMateriasPrimas(checked);
  };

  const handleExportToExcel = () => {
    const formatPrice = (price?: number) => {
      const numericPrice = Number(price) || 0;
      return `R$${numericPrice.toFixed(2)}`;
    };

    const exportData = materiasPrimas.map((material) => ({
      'Código': material.codigo,
      'Nome': material.nome,
      'Descrição': material.descricao,
      'Quantidade': material.qtdEstoque,
      'Unidade': material.unidadeMedida,
      'Preço': formatPrice(material.preco),
    }));

    exportToExcel(exportData, 'materias_primas', 'Matérias-Primas');
  };

  return (
    <Box sx={{ p: 3 }}>

      <HelpCollapse
        title="Gerenciamento de Matérias-Primas"
        content={
          <>
            <Typography paragraph>
              Esta página permite gerenciar o estoque de matérias-primas da empresa. Aqui você pode:
            </Typography>
            <ul>
              <li><strong>Excluir:</strong> Remova uma matéria-prima do sistema.</li>
              <li><strong>Exportar para Excel:</strong> Exporte a lista de matérias-primas para um arquivo Excel.</li>
            </ul>
            <Typography paragraph>
              <strong>Estoque:</strong> A quantidade em estoque é atualizada automaticamente quando:
            </Typography>
            <ul>
              <li>Uma compra é finalizada (aumenta o estoque)</li>
              <li>Uma produção é criada (diminui o estoque)</li>
              <li>Um pedido de matéria-prima é finalizado (diminui o estoque)</li>
            </ul>
          </>
        }
      />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Gerenciamento de Matérias-Primas
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Pesquisar matérias-primas..."
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
            Adicionar Matéria-Prima
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileSpreadsheet size={20} />}
            onClick={handleExportToExcel}
          >
            Exportar para Excel
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
          label={showInativos ? "Mostrar apenas matérias-primas inativas" : "Mostrar apenas matérias-primas ativas"}
        />
      </Box>

      <MateriaPrimaTable
        materials={materiasPrimas}
        onEdit={formModal.openForm}
        onDelete={tableActions.openDeleteDialog}
        onRestore={tableActions.handleRestore!}
        isLoading={isLoading}
        searchTerm={searchTerm}
        showInativos={showInativos}
      />

      <MateriaPrimaForm
        open={formModal.isOpen}
        onClose={formModal.closeForm}
        onSubmit={handleSaveMaterial}
        initialData={formModal.currentItem || undefined}
        isEditing={formModal.isEditing}
      />

      <DeleteMateriaPrima
        open={tableActions.isDeleteDialogOpen}
        onClose={tableActions.closeDeleteDialog}
        onConfirm={tableActions.confirmDelete}
        materiaPrima={tableActions.selectedItem}
      />
    </Box>
  );
}
