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
import { TablePagination } from '@/components/TablePagination';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { format, isValid } from 'date-fns';
import { FileText, Download, Search, Filter, Printer } from 'lucide-react';
import { toast } from 'sonner';
import HelpCollapse from '@/components/HelpCollapse';

import { useProducao } from '@/hooks/useProducao';
import { useFuncionario } from '@/hooks/useFuncionario';
import { useProducts } from '@/hooks/useProduto';

import { ProducaoReport, ProducaoAPI, Funcionario, Produto, getStatusText, getStatusColor } from './schema';
import { exportarProducaoExcel, formatarData } from './services';
import { FormatDate } from '@/utils/formatDate';
import * as XLSX from 'xlsx';
import ProducaoDetailsModal from './components/ProducaoDetailsModal';

export default function RelatorioProducaoPage() {
  const [producoes, setProducoes] = useState<ProducaoReport[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtroCodigo, setFiltroCodigo] = useState<string>('');
  const [filtroFuncionario, setFiltroFuncionario] = useState<string>('');
  const [filtroProduto, setFiltroProduto] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [filtroDataInicio, setFiltroDataInicio] = useState<Date | null>(null);
  const [filtroDataFim, setFiltroDataFim] = useState<Date | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [producaoSelecionada, setProducaoSelecionada] = useState<ProducaoReport | null>(null);

  const { producoes: producoesDataRaw, isLoading: isLoadingProducoes } = useProducao();
  const producoesData = producoesDataRaw as unknown as ProducaoAPI[];
  const { funcionarios: funcionariosData, isLoading: isLoadingFuncionarios } = useFuncionario();
  const { products: produtosData, isLoading: isLoadingProdutos } = useProducts();

  useEffect(() => {
    fetchFuncionarios();
    fetchProdutos();
    fetchProducoes();
  }, [funcionariosData, produtosData, producoesData]);

  const fetchFuncionarios = async () => {
    try {
      if (funcionariosData && funcionariosData.length > 0) {
        const funcionariosFormatados = funcionariosData.map(func => ({
          id: func.id.toString(),
          nome: func.pessoa.nome
        }));
        setFuncionarios(funcionariosFormatados);
      }
    } catch (error) {
      toast.error('Erro ao carregar funcionários.');
    }
  };

  const fetchProdutos = async () => {
    try {
      if (produtosData && produtosData.length > 0) {
        const produtosFormatados = produtosData.map(prod => {
          return {
            id: prod.id.toString(),
            nome: prod.nome
          };
        });

        setProdutos(produtosFormatados);
      }
    } catch (error) {
      toast.error('Erro ao carregar produtos.');
    }
  };

  const fetchProducoes = async () => {
    setIsLoading(true);
    try {
      if (producoesData && producoesData.length > 0) {
        const producoesFormatadas = producoesData.map(prod => {
          const funcionario = funcionariosData.find(f => f.id === prod.fisicaId);
          let produtoInfo = { id: '', nome: 'Não fornecido' };

          if ((prod as any).produto && (prod as any).produto.nome) {
            produtoInfo = {
              id: (prod as any).produto.id ? (prod as any).produto.id.toString() : '0',
              nome: (prod as any).produto.nome
            };
          } else {
            if (prod.produtoId) {
              const produto = produtosData.find(p => {
                if (!p || !p.id) return false;
                const match = p.id.toString() === prod.produtoId.toString();
                return match;
              });

              if (produto) {
                produtoInfo = {
                  id: produto.id.toString(),
                  nome: produto.nome
                };
              }
            }
          }

          const producaoFormatada: ProducaoReport = {
            id: prod.id ? prod.id.toString() : '0',
            codigo: prod.id ? prod.id.toString() : '0',
            dataInicio: prod.dataInicio || '',
            dataFim: prod.dataFim || null,
            status: (prod.status as 'pendente' | 'em_andamento' | 'concluido' | 'cancelado') || 'pendente',
            quantidade: prod.quantidade || 1,
            funcionario: {
              id: funcionario ? funcionario.id.toString() : '',
              nome: funcionario ? funcionario.pessoa.nome : 'Não fornecido'
            },
            produto: produtoInfo
          };

          return producaoFormatada;
        });

        setProducoes(producoesFormatadas);
      } else if (!isLoadingProducoes) {
        setProducoes([]);
      }
    } catch (error) {
      toast.error('Erro ao carregar produções.');
      setProducoes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltrar = async () => {
    setIsLoading(true);
    try {
      if (producoesData && producoesData.length > 0) {
        const producoesFormatadas = producoesData.map(prod => {
          const funcionario = funcionariosData.find(f => f.id === prod.fisicaId);
          let produtoInfo = { id: '', nome: 'Não fornecido' };

          if ((prod as any).produto && (prod as any).produto.nome) {
            produtoInfo = {
              id: (prod as any).produto.id ? (prod as any).produto.id.toString() : '0',
              nome: (prod as any).produto.nome
            };
          } else {
            if (prod.produtoId) {
              const produto = produtosData.find(p => {
                if (!p || !p.id) return false;
                const match = p.id.toString() === prod.produtoId.toString();
                return match;
              });

              if (produto) {
                produtoInfo = {
                  id: produto.id.toString(),
                  nome: produto.nome
                };
              }
            }
          }

          const producaoFormatada: ProducaoReport = {
            id: prod.id ? prod.id.toString() : '0',
            codigo: prod.id ? prod.id.toString() : '0',
            dataInicio: prod.dataInicio || '',
            dataFim: prod.dataFim || null,
            status: (prod.status as 'pendente' | 'em_andamento' | 'concluido' | 'cancelado') || 'pendente',
            quantidade: prod.quantidade || 1,
            funcionario: {
              id: funcionario ? funcionario.id.toString() : '',
              nome: funcionario ? funcionario.pessoa.nome : 'Não fornecido'
            },
            produto: produtoInfo
          };

          return producaoFormatada;
        });

        let producoesFiltradas = [...producoesFormatadas];

        if (filtroCodigo) {
          producoesFiltradas = producoesFiltradas.filter(producao =>
            producao.codigo.includes(filtroCodigo)
          );
        }

        if (filtroFuncionario) {
          producoesFiltradas = producoesFiltradas.filter(producao =>
            producao.funcionario.id === filtroFuncionario
          );
        }

        if (filtroProduto) {
          producoesFiltradas = producoesFiltradas.filter(producao =>
            producao.produto.id === filtroProduto
          );
        }

        if (filtroStatus) {
          producoesFiltradas = producoesFiltradas.filter(producao =>
            producao.status === filtroStatus
          );
        }

        if (filtroDataInicio && isValid(filtroDataInicio)) {
          producoesFiltradas = producoesFiltradas.filter(producao =>
            new Date(producao.dataInicio) >= filtroDataInicio
          );
        }

        if (filtroDataFim && isValid(filtroDataFim)) {
          producoesFiltradas = producoesFiltradas.filter(producao =>
            new Date(producao.dataInicio) <= filtroDataFim
          );
        }

        setProducoes(producoesFiltradas);
        toast.success('Filtros aplicados com sucesso!');
      } else {
        setProducoes([]);
        toast.info('Não há produções para filtrar.');
      }
    } catch (error) {
      toast.error('Erro ao filtrar produções.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimparFiltros = () => {
    setFiltroCodigo('');
    setFiltroFuncionario('');
    setFiltroProduto('');
    setFiltroStatus('');
    setFiltroDataInicio(null);
    setFiltroDataFim(null);
    setPage(0);
    fetchProducoes();
  };

  const handleExportarExcel = () => {
    exportarProducaoExcel(producoes);
  };

  const handleImprimir = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Produção</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .header h1 {
              margin: 0;
              color: #1976d2;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .filters {
              margin-bottom: 20px;
              padding: 15px;
              background-color: #f5f5f5;
              border-radius: 5px;
            }
            .filters h3 {
              margin-top: 0;
              color: #1976d2;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #1976d2;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .status-chip {
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
              color: white;
            }
            .status-pendente { background-color: #ff9800; }
            .status-em_andamento { background-color: #2196f3; }
            .status-concluido { background-color: #4caf50; }
            .status-cancelado { background-color: #f44336; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Relatório de Produção</h1>
            <p>Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
            ${producoes.length > 0 ? `<p>Total de registros: ${producoes.length}</p>` : ''}
          </div>

          ${filtroCodigo || filtroFuncionario || filtroProduto || filtroStatus || filtroDataInicio || filtroDataFim ? `
          <div class="filters">
            <h3>Filtros Aplicados:</h3>
            ${filtroCodigo ? `<p><strong>ID:</strong> ${filtroCodigo}</p>` : ''}
            ${filtroFuncionario ? `<p><strong>Funcionário:</strong> ${funcionarios.find(f => f.id === filtroFuncionario)?.nome || 'N/A'}</p>` : ''}
            ${filtroProduto ? `<p><strong>Produto:</strong> ${produtos.find(p => p.id === filtroProduto)?.nome || 'N/A'}</p>` : ''}
            ${filtroStatus ? `<p><strong>Status:</strong> ${getStatusText(filtroStatus)}</p>` : ''}
            ${filtroDataInicio ? `<p><strong>Data de Início:</strong> ${format(filtroDataInicio, 'dd/MM/yyyy')}</p>` : ''}
            ${filtroDataFim ? `<p><strong>Data de Fim:</strong> ${format(filtroDataFim, 'dd/MM/yyyy')}</p>` : ''}
          </div>
          ` : ''}

          ${producoes.length === 0 ? `
            <div style="text-align: center; padding: 40px; color: #666;">
              <h3>Nenhuma produção encontrada</h3>
              <p>Não há produções que correspondam aos filtros aplicados.</p>
            </div>
          ` : `
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Produto</th>
                  <th>Funcionário</th>
                  <th class="text-center">Quantidade</th>
                  <th>Data de Início</th>
                  <th>Data de Finalização</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${producoes.map(producao => `
                  <tr>
                    <td>${producao.id}</td>
                    <td>${producao.produto.nome}</td>
                    <td>${producao.funcionario.nome}</td>
                    <td class="text-center">${producao.quantidade}</td>
                    <td>${formatarData(producao.dataInicio)}</td>
                    <td>${formatarData(producao.dataFim)}</td>
                    <td>
                      <span class="status-chip status-${producao.status}">
                        ${getStatusText(producao.status)}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}

          <div class="footer">
            <p>Relatório gerado automaticamente pelo Sistema de Gestão</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const formatarData = (data: string | null | undefined) => {
    if (!data) return '-';
    return FormatDate.dateForReport(data);
  };

  const getStatusText = (status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado' | string | undefined) => {
    if (!status) return 'Desconhecido';

    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado' | string | undefined) => {
    if (!status) return 'default';

    switch (status) {
      case 'pendente': return 'warning';
      case 'em_andamento': return 'info';
      case 'concluido': return 'success';
      case 'cancelado': return 'error';
      default: return 'default';
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAbrirDetalhes = (producao: ProducaoReport) => {
    setProducaoSelecionada(producao);
    setModalDetalhesOpen(true);
  };

  const handleFecharDetalhes = () => {
    setModalDetalhesOpen(false);
    setProducaoSelecionada(null);
  };

  return (
    <Box sx={{ p: 3 }}>

      <HelpCollapse
        title="Relatório de Produção"
        content={
          <>
            <Typography paragraph>
              Este relatório apresenta informações detalhadas sobre as produções realizadas no sistema.
            </Typography>
            <Typography paragraph>
              <strong>Funcionalidades disponíveis:</strong>
            </Typography>
            <ul>
              <li><strong>Filtros:</strong> Utilize os filtros para refinar os resultados por funcionário, produto, status, data de início e data de fim.</li>
              <li><strong>Exportação:</strong> Exporte os dados filtrados para um arquivo Excel clicando no botão "Exportar para Excel".</li>
            </ul>
            <Typography paragraph>
              <strong>Informações exibidas:</strong>
            </Typography>
            <ul>
              <li><strong>ID:</strong> Identificador único da produção.</li>
              <li><strong>Produto:</strong> Nome do produto que foi produzido.</li>
              <li><strong>Funcionário:</strong> Nome do funcionário responsável pela produção.</li>
              <li><strong>Quantidade:</strong> Quantidade de itens produzidos.</li>
              <li><strong>Data de Início:</strong> Data em que a produção foi iniciada.</li>
              <li><strong>Data de Finalização:</strong> Data em que a produção foi concluída (se aplicável).</li>
              <li><strong>Status:</strong> Situação atual da produção (Pendente, Em Andamento, Concluído ou Cancelado).</li>
            </ul>
          </>
        }
      />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Relatório de Produção
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filtros
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="ID"
              placeholder="Digite o ID"
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
              options={funcionarios}
              getOptionLabel={(option) => option.nome}
              value={filtroFuncionario ? funcionarios.find(f => f.id === filtroFuncionario) || null : null}
              onChange={(_event, newValue) => setFiltroFuncionario(newValue ? newValue.id : '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Funcionário"
                  placeholder="Funcionário"
                  fullWidth
                  size="small"
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              fullWidth
              options={produtos}
              getOptionLabel={(option) => option.nome}
              value={filtroProduto ? produtos.find(p => p.id === filtroProduto) || null : null}
              onChange={(_event, newValue) => setFiltroProduto(newValue ? newValue.id : '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Produto"
                  placeholder="Produto"
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
              <MenuItem value="pendente">Pendente</MenuItem>
              <MenuItem value="em_andamento">Em Andamento</MenuItem>
              <MenuItem value="concluido">Concluído</MenuItem>
              <MenuItem value="cancelado">Cancelado</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data de Início"
                value={filtroDataInicio}
                onChange={(date) => setFiltroDataInicio(date)}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data de Fim"
                value={filtroDataFim}
                onChange={(date) => setFiltroDataFim(date)}
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </LocalizationProvider>
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
            disabled={isLoading || producoes.length === 0}
            sx={{ ml: 'auto' }}
          >
            Imprimir
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportarExcel}
            disabled={isLoading || producoes.length === 0}
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
                <TableCell>Produto</TableCell>
                <TableCell>Funcionário</TableCell>
                <TableCell align="right">Quantidade</TableCell>
                <TableCell>Data de Início</TableCell>
                <TableCell>Data de Finalização</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : producoes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    Nenhuma produção encontrada
                  </TableCell>
                </TableRow>
              ) : (
                producoes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((producao) => (
                    <TableRow key={producao.id}>
                      <TableCell>{producao.id}</TableCell>
                      <TableCell>{producao.produto.nome}</TableCell>
                      <TableCell>{producao.funcionario.nome}</TableCell>
                      <TableCell align="right">{producao.quantidade}</TableCell>
                      <TableCell>{formatarData(producao.dataInicio)}</TableCell>
                      <TableCell>{formatarData(producao.dataFim)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(producao.status)}
                          color={getStatusColor(producao.status) as "warning" | "info" | "success" | "error" | "default"}
                          size="small"
                          sx={{ fontWeight: 'medium' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleAbrirDetalhes(producao)}
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
        {!isLoading && producoes.length > 0 && (
          <TablePagination
            count={producoes.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      {/* Modal de Detalhes */}
      <ProducaoDetailsModal
        open={modalDetalhesOpen}
        onClose={handleFecharDetalhes}
        producao={producaoSelecionada}
      />
    </Box>
  );
}
