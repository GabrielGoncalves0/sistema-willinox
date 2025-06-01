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
  InputAdornment,
  CircularProgress,
  Chip,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { Download, Search, Filter, Printer } from 'lucide-react';
import HelpCollapse from '@/components/HelpCollapse';

import { useCompraRelatorio } from '@/hooks/useCompraRelatorio';
import { useFornecedor } from '@/hooks/useFornecedor';

import { Compra, Fornecedor } from './schema';
import { exportarComprasExcel, imprimirCompras } from './services';
import { FormatDate } from '@/utils/formatDate';
import CompraDetailsModal from './components/CompraDetailsModal';

export default function RelatorioComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtroCodigo, setFiltroCodigo] = useState<string>('');
  const [filtroFornecedor, setFiltroFornecedor] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [filtroDataInicio, setFiltroDataInicio] = useState<Date | null>(null);
  const [filtroDataFim, setFiltroDataFim] = useState<Date | null>(null);

  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [compraSelecionada, setCompraSelecionada] = useState<Compra | null>(null);


  const { compras: comprasData, isLoading: isLoadingCompras } = useCompraRelatorio();
  const { fornecedores: fornecedoresData } = useFornecedor();

  useEffect(() => {
    if (fornecedoresData && fornecedoresData.length > 0) {
      const fornecedoresFormatados = fornecedoresData.map(forn => ({
        id: forn.id.toString(),
        nome: forn.pessoa?.nome || 'Fornecedor sem nome'
      }));
      setFornecedores(fornecedoresFormatados);
    }
  }, [fornecedoresData]);

  useEffect(() => {
    if (comprasData && comprasData.length > 0) {
      const comprasFormatadas = comprasData.map(compra => ({
        id: compra.id.toString(),
        codigo: compra.codigo,
        data: compra.data,
        status: compra.status || 'pendente',
        valorTotal: compra.valorTotal || 0,
        fornecedor: {
          id: compra.fornecedor?.id?.toString() || '',
          nome: compra.fornecedor?.nome || 'Fornecedor não encontrado'
        },
        itens: compra.itens?.map(item => ({
          id: item.id.toString(),
          quantidade: item.quantidade || 0,
          valorUnitario: item.preco || 0,
          valorTotal: item.valorTotal || 0,
          materiaPrima: {
            id: item.materiaPrima?.id?.toString() || '',
            nome: item.materiaPrima?.nome || 'Matéria Prima não encontrada'
          }
        })) || []
      }));
      setCompras(comprasFormatadas);
    }
  }, [comprasData]);

  const handleExportarExcel = () => {
    exportarComprasExcel(compras);
  };

  const handleImprimir = () => {
    const filtros = {
      codigo: filtroCodigo,
      fornecedorId: filtroFornecedor,
      status: filtroStatus,
      dataInicio: filtroDataInicio,
      dataFim: filtroDataFim,
    };
    imprimirCompras(compras, filtros, fornecedores);
  };

  const handleLimparFiltros = () => {
    setFiltroCodigo('');
    setFiltroFornecedor('');
    setFiltroStatus('');
    setFiltroDataInicio(null);
    setFiltroDataFim(null);
  };

  const handleAbrirDetalhes = (compra: Compra) => {
    setCompraSelecionada(compra);
    setModalDetalhesOpen(true);
  };

  const handleFecharDetalhes = () => {
    setModalDetalhesOpen(false);
    setCompraSelecionada(null);
  };

  const formatarValor = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
  };

  const formatarData = (data: string | null) => {
    if (!data) return '-';
    return FormatDate.dateForReport(data);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'processando': return 'Processando';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'warning.main';
      case 'processando': return 'info.main';
      case 'concluido': return 'success.main';
      case 'cancelado': return 'error.main';
      default: return 'default';
    }
  };



  return (
    <Box sx={{ p: 3 }}>

      <HelpCollapse
        title="Relatório de Compras"
        content={
          <>
            <Typography paragraph>
              Este relatório apresenta informações detalhadas sobre as compras de matérias-primas realizadas.
            </Typography>
            <Typography paragraph>
              <strong>Funcionalidades disponíveis:</strong>
            </Typography>
            <ul>
              <li><strong>Filtros:</strong> Utilize os filtros para refinar os resultados por fornecedor, matéria-prima, status, data de início e data de fim.</li>
              <li><strong>Exportação:</strong> Exporte os dados filtrados para um arquivo Excel clicando no botão "Exportar para Excel".</li>
            </ul>
            <Typography paragraph>
              <strong>Informações exibidas:</strong>
            </Typography>
            <ul>
              <li><strong>ID:</strong> Identificador único da compra.</li>
              <li><strong>Data:</strong> Data em que a compra foi realizada.</li>
              <li><strong>Fornecedor:</strong> Nome do fornecedor da matéria-prima.</li>
              <li><strong>Status:</strong> Situação atual da compra (Pendente, Finalizado ou Cancelado).</li>
              <li><strong>Valor Total:</strong> Valor total da compra.</li>
              <li><strong>Itens:</strong> Detalhes dos itens incluídos na compra, incluindo matéria-prima, quantidade e valores.</li>
            </ul>
          </>
        }
      />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Relatório de Compras
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filtros
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Código"
              placeholder="Código"
              value={filtroCodigo}
              onChange={(e) => setFiltroCodigo(e.target.value)}
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
              options={fornecedores}
              getOptionLabel={(option) => option.nome}
              value={filtroFornecedor ? fornecedores.find(f => f.id === filtroFornecedor) || null : null}
              onChange={(_event, newValue) => setFiltroFornecedor(newValue ? newValue.id : '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Fornecedor"
                  placeholder="Fornecedor"
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
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              size="small"
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="PENDENTE">Pendente</MenuItem>
              <MenuItem value="FINALIZADO">Finalizado</MenuItem>
              <MenuItem value="CANCELADO">Cancelado</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data de Início"
                value={filtroDataInicio}
                onChange={(date) => setFiltroDataInicio(date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    InputProps: {
                      endAdornment: null
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data de Fim"
                value={filtroDataFim}
                onChange={(date) => setFiltroDataFim(date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    InputProps: {
                      endAdornment: null
                    }
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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
            disabled={isLoading || compras.length === 0}
            sx={{ ml: 'auto' }}
          >
            Imprimir
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportarExcel}
            disabled={isLoading || compras.length === 0}
          >
            Exportar para Excel
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Fornecedor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Valor Total</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : compras.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    Nenhuma compra encontrada
                  </TableCell>
                </TableRow>
              ) : (
                compras.map((compra) => (
                  <TableRow key={compra.id}>
                    <TableCell>{compra.codigo}</TableCell>
                    <TableCell>{formatarData(compra.data)}</TableCell>
                    <TableCell>{compra.fornecedor.nome}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(compra.status)}
                        sx={{
                          bgcolor: getStatusColor(compra.status),
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{formatarValor(compra.valorTotal)}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleAbrirDetalhes(compra)}
                        sx={{ mr: 1 }}
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
      </Paper>

      {/* Modal de Detalhes */}
      <CompraDetailsModal
        open={modalDetalhesOpen}
        onClose={handleFecharDetalhes}
        compra={compraSelecionada}
      />
    </Box>
  );
}
