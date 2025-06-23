'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  CircularProgress,
  Chip,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import { TablePagination } from '@/components/TablePagination';
import { Download, Search, Filter, Printer } from 'lucide-react';
import { toast } from 'sonner';
import HelpCollapse from '@/components/HelpCollapse';

import { useProducts } from '@/hooks/useProduto';
import { useModelos } from '@/hooks/useModelo';
import { useFilters } from '@/hooks/common/useFilters';
import { usePagination } from '@/hooks/common/usePagination';
import CustomizedProgressBars from '@/components/ProgressLoading';

import {
  ProdutoReportFilters,
  ProdutoReport,
  ProdutoPorModelo,
  produtoReportFilterInitialValues,
} from './schema';
import {
  exportarProdutosExcel,
  imprimirProdutos,
  formatarValor,
} from './services';
import ProdutoDetailsModal from './components/ProdutoDetailsModal';


interface Modelo {
  id: string;
  nome: string;
}

export default function RelatorioProdutosPage() {
  const [produtos, setProdutos] = useState<ProdutoReport[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<ProdutoReport[]>([]);
  const [produtosPorModelo, setProdutosPorModelo] = useState<ProdutoPorModelo[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoReport | null>(null);

  const filters = useFilters<ProdutoReportFilters>({
    initialFilters: produtoReportFilterInitialValues,
  });

  const pagination = usePagination({
    initialRowsPerPage: 10,
  });

  const { products: produtosData, isLoading: isLoadingProdutos, fetchProducts } = useProducts();
  const { modelos: modelosData, isLoading: isLoadingModelos } = useModelos();

  useEffect(() => {
    fetchModelos();
    fetchProdutos();
  }, [modelosData, produtosData]);

  useEffect(() => {
    fetchProducts(true);
  }, []);

  useEffect(() => {
    pagination.setPage(0);
  }, [filters.filters.status]);



  const fetchModelos = async () => {
    try {
      if (modelosData && modelosData.length > 0) {
        const modelosFormatados = modelosData.map(modelo => {
          return {
            id: modelo.id.toString(),
            nome: modelo.nome
          };
        });
        setModelos(modelosFormatados);
      } else {
        setModelos([]);
      }
    } catch (error) {
      toast.error('Erro ao carregar modelos.');
    }
  };

  const fetchProdutos = async () => {
    setIsLoading(true);
    try {
      if (produtosData && produtosData.length > 0) {
        const produtosFormatados = produtosData.map(produto => {
          if (produto.modelo && produto.modelo.id && produto.modelo.nome) {
            return {
              id: produto.id.toString(),
              codigo: produto.codigo || `PROD-${produto.id.toString().padStart(3, '0')}`,
              nome: produto.nome,
              descricao: produto.descricao || '',
              preco: produto.preco || 0,
              qtdEstoque: produto.qtdEstoque || 0,
              modelo: {
                id: produto.modelo.id.toString(),
                nome: produto.modelo.nome
              },
              ativo: Boolean(produto.ativo)
            };
          }

          const modeloId = produto.modelo?.id;
          const modelo = modelosData.find(m => {
            if (!modeloId) return false;
            return m.id.toString() === modeloId.toString();
          });

          if (!modelo) {
            if (modelosData.length > 0) {
              const primeiroModelo = modelosData[0];
              return {
                id: produto.id.toString(),
                codigo: produto.codigo || `PROD-${produto.id.toString().padStart(3, '0')}`,
                nome: produto.nome,
                descricao: produto.descricao || '',
                preco: produto.preco || 0,
                qtdEstoque: produto.qtdEstoque || 0,
                modelo: {
                  id: primeiroModelo.id.toString(),
                  nome: primeiroModelo.nome
                },
                ativo: Boolean(produto.ativo)
              };
            } else {
              return {
                id: produto.id.toString(),
                codigo: produto.codigo || `PROD-${produto.id.toString().padStart(3, '0')}`,
                nome: produto.nome,
                descricao: produto.descricao || '',
                preco: produto.preco || 0,
                qtdEstoque: produto.qtdEstoque || 0,
                modelo: {
                  id: '0',
                  nome: 'Modelo Padrão'
                },
                ativo: Boolean(produto.ativo)
              };
            }
          } else {
            return {
              id: produto.id.toString(),
              codigo: produto.codigo || `PROD-${produto.id.toString().padStart(3, '0')}`,
              nome: produto.nome,
              descricao: produto.descricao || '',
              preco: produto.preco || 0,
              qtdEstoque: produto.qtdEstoque || 0,
              modelo: {
                id: modelo.id.toString(),
                nome: modelo.nome
              },
              ativo: Boolean(produto.ativo)
            };
          }
        });

        setProdutos(produtosFormatados);
        setProdutosFiltrados(produtosFormatados);
        processarDadosPorModelo(produtosFormatados);
      } else if (!isLoadingProdutos) {
        setProdutos([]);
        setProdutosFiltrados([]);
        setProdutosPorModelo([]);
      }
    } catch (error) {
      toast.error('Erro ao carregar produtos.');
      setProdutos([]);
      setProdutosFiltrados([]);
      setProdutosPorModelo([]);
    } finally {
      setIsLoading(false);
    }
  };

  const processarDadosPorModelo = (produtosData: ProdutoReport[]) => {
    const porModelo = produtosData.reduce((acc: Record<string, ProdutoPorModelo>, produto) => {
      const modeloNome = produto.modelo.nome;
      if (!acc[modeloNome]) {
        acc[modeloNome] = { modelo: modeloNome, quantidade: 0, valorEstoque: 0 };
      }
      acc[modeloNome].quantidade += 1;
      acc[modeloNome].valorEstoque += produto.preco * produto.qtdEstoque;
      return acc;
    }, {});

    setProdutosPorModelo(Object.values(porModelo));
  };

  const aplicarFiltros = (produtosList: ProdutoReport[]) => {
    let produtosFiltrados = [...produtosList];

    if (filters.filters.codigo) {
      produtosFiltrados = produtosFiltrados.filter(produto =>
        produto.codigo.toLowerCase().includes(filters.filters.codigo.toLowerCase()) ||
        produto.nome.toLowerCase().includes(filters.filters.codigo.toLowerCase())
      );
    }

    if (filters.filters.modeloId) {
      produtosFiltrados = produtosFiltrados.filter(produto =>
        produto.modelo.id === filters.filters.modeloId
      );
    }

    if (filters.filters.status === 'ativos') {
      produtosFiltrados = produtosFiltrados.filter(produto => produto.ativo === true);
    } else if (filters.filters.status === 'inativos') {
      produtosFiltrados = produtosFiltrados.filter(produto => produto.ativo === false);
    }

    return produtosFiltrados;
  };

  const handleFiltrar = () => {
    const produtosFiltradosResult = aplicarFiltros(produtos);
    setProdutosFiltrados(produtosFiltradosResult);
    pagination.setPage(0);
    toast.success('Filtros aplicados com sucesso!');
  };

  const handleLimparFiltros = () => {
    filters.clearFilters();
    setProdutosFiltrados(produtos);
    pagination.setPage(0);
    toast.success('Filtros limpos com sucesso!');
  };

  const handleExportarExcel = () => {
    exportarProdutosExcel(produtosFiltrados, produtosPorModelo, 0);
  };

  const handleImprimir = () => {
    imprimirProdutos(produtosFiltrados, filters.filters, modelos);
  };

  const handleAbrirDetalhes = (produto: ProdutoReport) => {
    setProdutoSelecionado(produto);
    setModalDetalhesOpen(true);
  };

  const handleFecharDetalhes = () => {
    setModalDetalhesOpen(false);
    setProdutoSelecionado(null);
  };



  return (
    <Box sx={{ p: 3 }}>

      <HelpCollapse
        title="Relatório de Produtos"
        content={
          <>
            <Typography paragraph>
              Este relatório apresenta informações detalhadas sobre os produtos cadastrados no sistema.
            </Typography>
            <Typography paragraph>
              <strong>Funcionalidades disponíveis:</strong>
            </Typography>
            <ul>
              <li><strong>Filtros:</strong> Utilize os filtros para refinar os resultados por modelo, faixa de estoque e faixa de preço.</li>
              <li><strong>Visualizações:</strong> Alterne entre as abas para visualizar a lista completa de produtos ou análises por modelo.</li>
              <li><strong>Exportação:</strong> Exporte os dados filtrados para um arquivo Excel clicando no botão "Exportar para Excel".</li>
            </ul>
            <Typography paragraph>
              <strong>Informações exibidas:</strong>
            </Typography>
            <ul>
              <li><strong>Lista de Produtos:</strong> Mostra todos os produtos com detalhes como código, nome, preço e quantidade em estoque.</li>
              <li><strong>Produtos por Modelo:</strong> Apresenta análises gráficas da distribuição de produtos por modelo e valor em estoque.</li>
            </ul>
          </>
        }
      />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Relatório de Produtos
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filtros
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Código ou Nome"
              placeholder="Código ou Nome"
              value={filters.filters.codigo}
              onChange={(e) => filters.updateFilter('codigo', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              fullWidth
              options={modelos}
              getOptionLabel={(option) => option.nome}
              value={filters.filters.modeloId ? modelos.find(m => m.id === filters.filters.modeloId) || null : null}
              onChange={(_event, newValue) => filters.updateFilter('modeloId', newValue ? newValue.id : '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Modelo"
                  placeholder="Modelo"
                  fullWidth
                  size="small"
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={filters.filters.status}
              onChange={(e) => filters.updateFilter('status', e.target.value)}
              size="small"
            >
              <MenuItem value="ativos">Apenas Ativos</MenuItem>
              <MenuItem value="inativos">Apenas Inativos</MenuItem>
              <MenuItem value="todos">Todos</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={handleFiltrar}
            disabled={isLoading}
          >
            Filtrar
          </Button>
          <Button
            variant="outlined"
            startIcon={<Filter />}
            onClick={handleLimparFiltros}
            disabled={isLoading}
          >
            Limpar Filtros
          </Button>
          <Button
            variant="outlined"
            startIcon={<Printer />}
            onClick={handleImprimir}
            disabled={isLoading || produtosFiltrados.length === 0}
            sx={{ ml: 'auto' }}
          >
            Imprimir
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportarExcel}
            disabled={isLoading || produtosFiltrados.length === 0}
          >
            Exportar para Excel
          </Button>
        </Box>
      </Paper>

      <Box>
        <TableContainer component={Paper} sx={{ borderRadius: '8px 8px 0 0' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Código</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell align="right">Preço</TableCell>
                <TableCell align="right">Estoque</TableCell>
                <TableCell align="right">Valor em Estoque</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading || isLoadingProdutos || isLoadingModelos ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CustomizedProgressBars />
                  </TableCell>
                </TableRow>
              ) : produtosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                produtosFiltrados
                  .slice(pagination.page * pagination.rowsPerPage, pagination.page * pagination.rowsPerPage + pagination.rowsPerPage)
                  .map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>{produto.codigo}</TableCell>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.modelo.nome}</TableCell>
                      <TableCell align="right">{formatarValor(produto.preco)}</TableCell>
                      <TableCell align="right">{produto.qtdEstoque}</TableCell>
                      <TableCell align="right">{formatarValor(produto.preco * produto.qtdEstoque)}</TableCell>
                      <TableCell>
                        <Chip
                          label={produto.ativo ? 'Ativo' : 'Inativo'}
                          color={produto.ativo ? 'success' : 'error'}
                          size="small"
                          sx={{ fontWeight: 'medium' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleAbrirDetalhes(produto)}
                        >
                          Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {produtosFiltrados.length > 0 && (
          <TablePagination
            count={produtosFiltrados.length}
            page={pagination.page}
            rowsPerPage={pagination.rowsPerPage}
            onPageChange={pagination.handleChangePage}
            onRowsPerPageChange={pagination.handleChangeRowsPerPage}
          />
        )}
      </Box>

      {/* Modal de Detalhes */}
      <ProdutoDetailsModal
        open={modalDetalhesOpen}
        onClose={handleFecharDetalhes}
        produto={produtoSelecionado}
      />
    </Box>
  );
}
