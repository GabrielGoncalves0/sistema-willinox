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

import { useProducts } from '../../../hooks/useProduto';
import { useFormModal } from '@/hooks/common/useFormModal';
import { useTableActions } from '@/hooks/common/useTableActions';
import { useExport } from '@/hooks/common/useExport';

import { ProductForm } from './components/ProductForm';
import { ProductTable } from './components/ProductTable';
import { DeleteDialog } from './components/DeleteDialog';
import { Product } from './constants';

export default function ProductsPageRefactored() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInativos, setShowInativos] = useState(false);

  const {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    restaurarProduct,
    fetchProducts,
  } = useProducts();

  const formModal = useFormModal<Product>();
  const { exportProductsToExcel } = useExport();
  
  const tableActions = useTableActions<Product>({
    onDelete: async (product) => {
      await deleteProduct(product.id);
    },
    onRestore: async (product) => {
      try {
        await restaurarProduct(product.id);
      } catch {
        toast.error('Erro ao restaurar o produto.');
      }
    },
  });

  const handleSaveProduct = async (productData: Partial<Product>): Promise<boolean> => {
    try {
      let result: boolean;
      if (formModal.isEditing && formModal.currentItem) {
        result = await updateProduct({ ...formModal.currentItem, ...productData });
      } else {
        result = await createProduct(productData);
      }
      return result;
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Erro ao salvar produto.');
      return false;
    }
  };

  const handleToggleInativos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setShowInativos(checked);
    fetchProducts(checked);
  };

  const handleExportToExcel = () => {
    exportProductsToExcel(products);
  };

  return (
    <Box sx={{ p: 3 }}>
      <HelpCollapse
        title="Gerenciamento de Produtos"
        content={
          <>
            <Typography paragraph>
              Esta página permite gerenciar o catálogo de produtos da empresa. Aqui você pode:
            </Typography>
            <ul>
              <li><strong>Excluir:</strong> Remova um produto do sistema.</li>
              <li><strong>Exportar para Excel:</strong> Exporte a lista de produtos para um arquivo Excel.</li>
            </ul>
            <Typography paragraph>
              <strong>Estoque:</strong> A quantidade em estoque é atualizada automaticamente quando:
            </Typography>
            <ul>
              <li>Uma produção é finalizada (aumenta o estoque)</li>
              <li>Um pedido de produto é finalizado (diminui o estoque)</li>
            </ul>
            <Typography paragraph>
              <strong>Modelo:</strong> Cada produto deve estar associado a um modelo cadastrado no sistema.
            </Typography>
          </>
        }
      />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Gerenciamento de Produtos
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Pesquisar produtos..."
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
            Adicionar Produto
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
          label={showInativos ? "Mostrar apenas produtos inativos" : "Mostrar apenas produtos ativos"}
        />
      </Box>

      <ProductTable
        products={products}
        onEdit={formModal.openForm}
        onDelete={tableActions.openDeleteDialog}
        onRestore={tableActions.handleRestore!}
        isLoading={isLoading}
        searchTerm={searchTerm}
        showInativos={showInativos}
      />

      <ProductForm
        open={formModal.isOpen}
        onClose={formModal.closeForm}
        onSubmit={handleSaveProduct}
        initialData={formModal.currentItem || undefined}
        isEditing={formModal.isEditing}
      />

      <DeleteDialog
        open={tableActions.isDeleteDialogOpen}
        onClose={tableActions.closeDeleteDialog}
        onConfirm={tableActions.confirmDelete}
      />
    </Box>
  );
}
