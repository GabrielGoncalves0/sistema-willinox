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

import { usePedido } from '@/hooks/usePedido';
import { useCliente } from '@/hooks/useCliente';

import { PedidoReport, PedidoAPI, Cliente } from './schema';
import { PedidoStatus, getStatusColor, getStatusText } from '../../pedidos/constants';
import { FormatDate } from '@/utils/formatDate';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import PedidoDetailsModal from './components/PedidoDetailsModal';

export default function RelatorioPedidosPage() {
  const [pedidos, setPedidos] = useState<PedidoReport[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtroId, setFiltroId] = useState<string>('');
  const [filtroCliente, setFiltroCliente] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [filtroDataInicio, setFiltroDataInicio] = useState<Date | null>(null);
  const [filtroDataFim, setFiltroDataFim] = useState<Date | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [pedidoDetalhes, setPedidoDetalhes] = useState<PedidoReport | null>(null);

  const { pedidos: pedidosDataRaw, isLoading: isLoadingPedidos } = usePedido();
  const pedidosData = pedidosDataRaw as unknown as PedidoAPI[];
  const { clientes: clientesData } = useCliente();

  useEffect(() => {

    if (clientesData?.length > 0 && pedidosData?.length > 0) {
      fetchClientes();
      fetchPedidos();
    }
  }, [clientesData, pedidosData]);

  const fetchClientes = async () => {
    try {
      if (clientesData && clientesData.length > 0) {
        const clientesFormatados = clientesData.map(cliente => ({
          id: cliente.pessoa?.id.toString() || '',
          nome: cliente.pessoa?.nome || 'Nome não disponível'
        }));
        setClientes(clientesFormatados);
      }
    } catch (error) {
      console.error('Erro ao processar clientes:', error);
      toast.error('Erro ao carregar clientes.');
    }
  };

  const fetchPedidos = async () => {
    setIsLoading(true);
    try {
      if (pedidosData && pedidosData.length > 0) {
        const pedidosFormatados = pedidosData.map(pedido => {

          const cliente = clientesData.find(c => {
            const match = c.pessoa?.id === pedido.pedido?.pessoaId;

            return match;
          });

          if (!cliente) {
          }

          let valorTotal = 0;
          if (pedido.produtos && pedido.produtos.length > 0) {
            valorTotal += pedido.produtos.reduce((sum, item) =>
              sum + (item.quantidade * item.preco), 0);
          }
          if (pedido.materiasPrimas && pedido.materiasPrimas.length > 0) {
            valorTotal += pedido.materiasPrimas.reduce((sum, item) =>
              sum + (item.quantidade * item.preco), 0);
          }

          const pedidoFormatado: PedidoReport = {
            id: pedido.pedido?.id.toString() || '',
            codigo: pedido.pedido?.id.toString() || '',
            dataInicio: pedido.pedido?.data || '',
            dataFim: null,
            status: pedido.pedido?.status || PedidoStatus.PENDENTE,
            valorEntrada: pedido.pedido?.valorEntrada || 0,
            valorTotal: valorTotal,
            cliente: {
              id: cliente && cliente.pessoa ? cliente.pessoa.id.toString() : '',
              nome: cliente && cliente.pessoa ? cliente.pessoa.nome : 'Não fornecido'
            },
            produtos: pedido.produtos || [],
            materiasPrimas: pedido.materiasPrimas || []
          };

          return pedidoFormatado;
        });

        setPedidos(pedidosFormatados);
      } else if (!isLoadingPedidos) {
        setPedidos([]);
      }
    } catch (error) {
      console.error('Erro ao processar pedidos:', error);
      toast.error('Erro ao carregar pedidos.');
      setPedidos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltrar = async () => {
    setIsLoading(true);
    try {
      if (pedidosData && pedidosData.length > 0) {
        const pedidosFormatados = pedidosData.map(pedido => {
          const cliente = clientesData.find(c => {
            const match = c.pessoa?.id === pedido.pedido?.pessoaId;
            return match;
          });

          if (!cliente) {
          }

          let valorTotal = 0;
          if (pedido.produtos && pedido.produtos.length > 0) {
            valorTotal += pedido.produtos.reduce((sum, item) =>
              sum + (item.quantidade * item.preco), 0);
          }
          if (pedido.materiasPrimas && pedido.materiasPrimas.length > 0) {
            valorTotal += pedido.materiasPrimas.reduce((sum, item) =>
              sum + (item.quantidade * item.preco), 0);
          }

          const pedidoFormatado: PedidoReport = {
            id: pedido.pedido?.id.toString() || '',
            codigo: pedido.pedido?.id.toString() || '',
            dataInicio: pedido.pedido?.data || '',
            dataFim: null,
            status: pedido.pedido?.status || PedidoStatus.PENDENTE,
            valorEntrada: pedido.pedido?.valorEntrada || 0,
            valorTotal: valorTotal,
            cliente: {
              id: cliente && cliente.pessoa ? cliente.pessoa.id.toString() : '',
              nome: cliente && cliente.pessoa ? cliente.pessoa.nome : 'Não fornecido'
            },
            produtos: pedido.produtos || [],
            materiasPrimas: pedido.materiasPrimas || []
          };

          return pedidoFormatado;
        });

        let pedidosFiltrados = [...pedidosFormatados];

        if (filtroId) {
          pedidosFiltrados = pedidosFiltrados.filter(pedido =>
            pedido.id.toLowerCase().includes(filtroId.toLowerCase())
          );
        }

        if (filtroCliente) {
          pedidosFiltrados = pedidosFiltrados.filter(pedido =>
            pedido.cliente.id === filtroCliente
          );
        }

        if (filtroStatus) {
          pedidosFiltrados = pedidosFiltrados.filter(pedido =>
            pedido.status === filtroStatus
          );
        }

        if (filtroDataInicio && isValid(filtroDataInicio)) {
          pedidosFiltrados = pedidosFiltrados.filter(pedido => {
            if (!pedido.dataInicio) return false;
            try {
              return new Date(pedido.dataInicio) >= filtroDataInicio;
            } catch (error) {
              return false;
            }
          });
        }

        if (filtroDataFim && isValid(filtroDataFim)) {
          pedidosFiltrados = pedidosFiltrados.filter(pedido => {
            if (!pedido.dataInicio) return false;
            try {
              return new Date(pedido.dataInicio) <= filtroDataFim;
            } catch (error) {
              return false;
            }
          });
        }

        setPedidos(pedidosFiltrados);
        toast.success('Filtros aplicados com sucesso!');
      } else {
        setPedidos([]);
        toast.info('Não há pedidos para filtrar.');
      }
    } catch (error) {
      console.error('Erro ao filtrar pedidos:', error);
      toast.error('Erro ao filtrar pedidos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLimparFiltros = () => {
    setFiltroId('');
    setFiltroCliente('');
    setFiltroStatus('');
    setFiltroDataInicio(null);
    setFiltroDataFim(null);
    setPage(0);
    fetchPedidos();
  };

  const handleExportarExcel = () => {
    const dadosExportacao = pedidos.map(pedido => ({
      'ID': pedido.id,
      'Cliente': pedido.cliente.nome,
      'Data': FormatDate.dateForReport(pedido.dataInicio),
      'Status': getStatusText(pedido.status),
      'Valor de Entrada': formatarValor(pedido.valorEntrada),
      'Valor Total': formatarValor(pedido.valorTotal),
    }));

    const ws = XLSX.utils.json_to_sheet(dadosExportacao);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    XLSX.writeFile(wb, 'relatorio_pedidos.xlsx');
    toast.success('Relatório exportado com sucesso!');
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
          <title>Relatório de Pedidos</title>
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
            .status-processado { background-color: #2196f3; }
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
            <h1>Relatório de Pedidos</h1>
            <p>Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
            ${pedidos.length > 0 ? `<p>Total de registros: ${pedidos.length}</p>` : ''}
          </div>

          ${filtroCliente || filtroStatus || filtroDataInicio || filtroDataFim ? `
          <div class="filters">
            <h3>Filtros Aplicados:</h3>
            ${filtroCliente ? `<p><strong>Cliente:</strong> ${clientes.find(c => c.id === filtroCliente)?.nome || 'N/A'}</p>` : ''}
            ${filtroStatus ? `<p><strong>Status:</strong> ${getStatusText(filtroStatus as PedidoStatus)}</p>` : ''}
            ${filtroDataInicio ? `<p><strong>Data de Início:</strong> ${format(filtroDataInicio, 'dd/MM/yyyy')}</p>` : ''}
            ${filtroDataFim ? `<p><strong>Data de Fim:</strong> ${format(filtroDataFim, 'dd/MM/yyyy')}</p>` : ''}
          </div>
          ` : ''}

          ${pedidos.length === 0 ? `
            <div style="text-align: center; padding: 40px; color: #666;">
              <h3>Nenhum pedido encontrado</h3>
              <p>Não há pedidos que correspondam aos filtros aplicados.</p>
            </div>
          ` : `
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th class="text-right">Valor de Entrada</th>
                  <th class="text-right">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                ${pedidos.map(pedido => `
                  <tr>
                    <td>${pedido.id}</td>
                    <td>${pedido.cliente.nome}</td>
                    <td>${formatarData(pedido.dataInicio)}</td>
                    <td>
                      <span class="status-chip status-${pedido.status.toLowerCase()}">
                        ${getStatusText(pedido.status)}
                      </span>
                    </td>
                    <td class="text-right">${formatarValor(pedido.valorEntrada)}</td>
                    <td class="text-right">${formatarValor(pedido.valorTotal)}</td>
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

  const handleImprimirDetalhes = () => {
    if (!pedidoDetalhes) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.');
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Detalhes do Pedido ${pedidoDetalhes.id}</title>
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
            .info-section {
              margin-bottom: 25px;
              padding: 15px;
              background-color: #f9f9f9;
              border-radius: 5px;
            }
            .info-section h3 {
              margin-top: 0;
              color: #1976d2;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            .info-row {
              display: flex;
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              min-width: 150px;
            }
            .status-chip {
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: bold;
              color: white;
            }
            .status-pendente { background-color: #ff9800; }
            .status-processado { background-color: #2196f3; }
            .status-concluido { background-color: #4caf50; }
            .status-cancelado { background-color: #f44336; }
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
            <h1>Detalhes do Pedido: ${pedidoDetalhes.id}</h1>
            <p>Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
          </div>

          <div class="info-section">
            <h3>Informações Gerais</h3>
            <div class="info-row">
              <span class="info-label">ID:</span>
              <span>${pedidoDetalhes.id}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Cliente:</span>
              <span>${pedidoDetalhes.cliente.nome}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Data:</span>
              <span>${formatarData(pedidoDetalhes.dataInicio)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Status:</span>
              <span class="status-chip status-${pedidoDetalhes.status.toLowerCase()}">
                ${getStatusText(pedidoDetalhes.status)}
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Valor de Entrada:</span>
              <span>${formatarValor(pedidoDetalhes.valorEntrada)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Valor Total:</span>
              <span><strong>${formatarValor(pedidoDetalhes.valorTotal)}</strong></span>
            </div>
          </div>

          ${pedidoDetalhes.produtos && pedidoDetalhes.produtos.length > 0 ? `
            <div class="info-section">
              <h3>Produtos</h3>
              <table>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th class="text-center">Quantidade</th>
                    <th class="text-right">Preço Unit.</th>
                    <th class="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${pedidoDetalhes.produtos.map(item => `
                    <tr>
                      <td>${item.produto?.nome || `Produto ${item.produtoId}`}</td>
                      <td class="text-center">${item.quantidade}</td>
                      <td class="text-right">${formatarValor(item.preco)}</td>
                      <td class="text-right">${formatarValor(item.quantidade * item.preco)}</td>
                    </tr>
                  `).join('')}
                  <tr style="background-color: #e3f2fd; font-weight: bold;">
                    <td colspan="3" class="text-right">Total Produtos:</td>
                    <td class="text-right">${formatarValor(
                      pedidoDetalhes.produtos.reduce((sum, item) => sum + item.quantidade * item.preco, 0)
                    )}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}

          ${pedidoDetalhes.materiasPrimas && pedidoDetalhes.materiasPrimas.length > 0 ? `
            <div class="info-section">
              <h3>Matérias-primas</h3>
              <table>
                <thead>
                  <tr>
                    <th>Matéria-prima</th>
                    <th class="text-center">Quantidade</th>
                    <th class="text-right">Preço Unit.</th>
                    <th class="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${pedidoDetalhes.materiasPrimas.map(item => `
                    <tr>
                      <td>${item.materiaPrima?.nome || `Matéria-prima ${item.materiaPrimaId}`}</td>
                      <td class="text-center">${item.quantidade}</td>
                      <td class="text-right">${formatarValor(item.preco)}</td>
                      <td class="text-right">${formatarValor(item.quantidade * item.preco)}</td>
                    </tr>
                  `).join('')}
                  <tr style="background-color: #e8f5e8; font-weight: bold;">
                    <td colspan="3" class="text-right">Total Matérias-primas:</td>
                    <td class="text-right">${formatarValor(
                      pedidoDetalhes.materiasPrimas.reduce((sum, item) => sum + item.quantidade * item.preco, 0)
                    )}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ` : ''}

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

  const formatarData = (data: string | null) => {
    if (!data) return '-';
    return FormatDate.dateForReport(data);
  };

  const formatarValor = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null) return 'R$ 0,00';
    return `R$ ${Number(valor).toFixed(2)}`;
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDetalhes = (pedido: PedidoReport) => {
    setPedidoDetalhes(pedido);
    setModalOpen(true);
  };

  const handleCloseDetalhes = () => {
    setModalOpen(false);
    setPedidoDetalhes(null);
  };

  const handleExportarDetalhesWord = () => {
    if (!pedidoDetalhes) return;

    const children = [
      new Paragraph({
        text: `Detalhes do Pedido: ${pedidoDetalhes.id}`,
        heading: HeadingLevel.HEADING_1,
      }),
      new Paragraph({
        text: `Data de emissão: ${format(new Date(), 'dd/MM/yyyy')}`,
        spacing: { after: 400 },
      }),
      new Paragraph({
        text: "Informações Gerais",
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 200 },
      }),
      new Paragraph({ text: `ID: ${pedidoDetalhes.id}` }),
      new Paragraph({ text: `Cliente: ${pedidoDetalhes.cliente.nome}` }),
      new Paragraph({ text: `Data: ${formatarData(pedidoDetalhes.dataInicio)}` }),
      new Paragraph({ text: `Status: ${getStatusText(pedidoDetalhes.status)}` }),
      new Paragraph({ text: `Valor de Entrada: ${formatarValor(pedidoDetalhes.valorEntrada)}` }),
      new Paragraph({ text: `Valor Total: ${formatarValor(pedidoDetalhes.valorTotal)}` }),
    ];

    if (pedidoDetalhes.produtos && pedidoDetalhes.produtos.length > 0) {
      children.push(
        new Paragraph({
          text: "Produtos",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        })
      );

      const produtosRows = pedidoDetalhes.produtos.map(item => {
        return new DocxTableRow({
          children: [
            new DocxTableCell({
              children: [new Paragraph(item.produto?.nome || `Produto ${item.produtoId}`)],
            }),
            new DocxTableCell({
              children: [new Paragraph(item.quantidade.toString())],
            }),
            new DocxTableCell({
              children: [new Paragraph(formatarValor(item.preco))],
            }),
            new DocxTableCell({
              children: [new Paragraph(formatarValor(item.quantidade * item.preco))],
            }),
          ],
        });
      });

      const produtosTableRows = [
        new DocxTableRow({
          children: [
            new DocxTableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Produto", bold: true })]
              })],
            }),
            new DocxTableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Quantidade", bold: true })]
              })],
            }),
            new DocxTableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Preço", bold: true })]
              })],
            }),
            new DocxTableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Subtotal", bold: true })]
              })],
            }),
          ],
        }),
        ...produtosRows,
      ];

      children.push(
        new Paragraph({
          text: "",
          spacing: { after: 200 },
        })
      );

    }

    if (pedidoDetalhes.materiasPrimas && pedidoDetalhes.materiasPrimas.length > 0) {
      children.push(
        new Paragraph({
          text: "Matérias-primas",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        })
      );

      const materiasRows = pedidoDetalhes.materiasPrimas.map(item => {
        return new DocxTableRow({
          children: [
            new DocxTableCell({
              children: [new Paragraph(item.materiaPrima?.nome || `Matéria-prima ${item.materiaPrimaId}`)],
            }),
            new DocxTableCell({
              children: [new Paragraph(item.quantidade.toString())],
            }),
            new DocxTableCell({
              children: [new Paragraph(formatarValor(item.preco))],
            }),
            new DocxTableCell({
              children: [new Paragraph(formatarValor(item.quantidade * item.preco))],
            }),
          ],
        });
      });

      const materiasTableRows = [
        new DocxTableRow({
          children: [
            new DocxTableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Matéria-prima", bold: true })]
              })],
            }),
            new DocxTableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Quantidade", bold: true })]
              })],
            }),
            new DocxTableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Preço", bold: true })]
              })],
            }),
            new DocxTableCell({
              children: [new Paragraph({
                children: [new TextRun({ text: "Subtotal", bold: true })]
              })],
            }),
          ],
        }),
        ...materiasRows,
      ];

      children.push(
        new Paragraph({
          text: "",
          spacing: { after: 200 },
        })
      );
    }

    const sections = [];

    sections.push({
      properties: {},
      children: children,
    });


    if (pedidoDetalhes.produtos && pedidoDetalhes.produtos.length > 0) {

      const headerRow = new DocxTableRow({
        children: [
          new DocxTableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Produto", bold: true })]
            })],
          }),
          new DocxTableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Quantidade", bold: true })]
            })],
          }),
          new DocxTableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Preço", bold: true })]
            })],
          }),
          new DocxTableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Subtotal", bold: true })]
            })],
          }),
        ],
      });

      const dataRows = pedidoDetalhes.produtos.map(item => {
        return new DocxTableRow({
          children: [
            new DocxTableCell({
              children: [new Paragraph(item.produto?.nome || `Produto ${item.produtoId}`)],
            }),
            new DocxTableCell({
              children: [new Paragraph(item.quantidade.toString())],
            }),
            new DocxTableCell({
              children: [new Paragraph(formatarValor(item.preco))],
            }),
            new DocxTableCell({
              children: [new Paragraph(formatarValor(item.quantidade * item.preco))],
            }),
          ],
        });
      });

      const produtosTable = new DocxTable({
        rows: [headerRow, ...dataRows],
      });

      sections.push({
        properties: {},
        children: [
          new Paragraph({ text: "Produtos", heading: HeadingLevel.HEADING_2 }),
          produtosTable
        ],
      });
    }

    if (pedidoDetalhes.materiasPrimas && pedidoDetalhes.materiasPrimas.length > 0) {
      const headerRow = new DocxTableRow({
        children: [
          new DocxTableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Matéria-prima", bold: true })]
            })],
          }),
          new DocxTableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Quantidade", bold: true })]
            })],
          }),
          new DocxTableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Preço", bold: true })]
            })],
          }),
          new DocxTableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: "Subtotal", bold: true })]
            })],
          }),
        ],
      });

      const dataRows = pedidoDetalhes.materiasPrimas.map(item => {
        return new DocxTableRow({
          children: [
            new DocxTableCell({
              children: [new Paragraph(item.materiaPrima?.nome || `Matéria-prima ${item.materiaPrimaId}`)],
            }),
            new DocxTableCell({
              children: [new Paragraph(item.quantidade.toString())],
            }),
            new DocxTableCell({
              children: [new Paragraph(formatarValor(item.preco))],
            }),
            new DocxTableCell({
              children: [new Paragraph(formatarValor(item.quantidade * item.preco))],
            }),
          ],
        });
      });

      const materiasTable = new DocxTable({
        rows: [headerRow, ...dataRows],
      });

      sections.push({
        properties: {},
        children: [
          new Paragraph({ text: "Matérias-primas", heading: HeadingLevel.HEADING_2 }),
          materiasTable
        ],
      });
    }

    const doc = new Document({
      sections: sections,
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `pedido_${pedidoDetalhes.id}.docx`);
      toast.success('Detalhes exportados para Word com sucesso!');
    });
  };

  return (
    <Box sx={{ p: 3 }}>

      <HelpCollapse
        title="Relatório de Pedidos"
        content={
          <>
            <Typography paragraph>
              Este relatório apresenta informações detalhadas sobre os pedidos realizados no sistema.
            </Typography>
            <Typography paragraph>
              <strong>Funcionalidades disponíveis:</strong>
            </Typography>
            <ul>
              <li><strong>Filtros:</strong> Utilize os filtros para refinar os resultados por cliente, status, data de início e data de fim.</li>
              <li><strong>Exportação:</strong> Exporte os dados filtrados para um arquivo Excel clicando no botão "Exportar para Excel".</li>
            </ul>
            <Typography paragraph>
              <strong>Informações exibidas:</strong>
            </Typography>
            <ul>
              <li><strong>ID:</strong> Identificador único do pedido.</li>
              <li><strong>Cliente:</strong> Nome do cliente que realizou o pedido.</li>
              <li><strong>Data:</strong> Data em que o pedido foi criado.</li>
              <li><strong>Status:</strong> Situação atual do pedido (Pendente, Em Andamento, Concluído ou Cancelado).</li>
              <li><strong>Valor de Entrada:</strong> Valor pago como entrada do pedido.</li>
              <li><strong>Valor Total:</strong> Valor total do pedido.</li>
            </ul>
          </>
        }
      />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Relatório de Pedidos
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filtros
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="ID do Pedido"
              placeholder="Buscar por ID"
              value={filtroId}
              onChange={(e) => setFiltroId(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Cliente"
              value={filtroCliente}
              onChange={(e) => setFiltroCliente(e.target.value)}
            >
              <MenuItem value="">Todos os clientes</MenuItem>
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <MenuItem value="">Todos os status</MenuItem>
              <MenuItem value={PedidoStatus.PENDENTE}>Pendente</MenuItem>
              <MenuItem value={PedidoStatus.PROCESSADO}>Processando</MenuItem>
              <MenuItem value={PedidoStatus.CONCLUIDO}>Concluído</MenuItem>
              <MenuItem value={PedidoStatus.CANCELADO}>Cancelado</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data de Início"
                value={filtroDataInicio}
                onChange={(date) => setFiltroDataInicio(date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data de Fim"
                value={filtroDataFim}
                onChange={(date) => setFiltroDataFim(date)}
                slotProps={{ textField: { fullWidth: true } }}
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
            disabled={isLoading || pedidos.length === 0}
            sx={{ ml: 'auto' }}
          >
            Imprimir
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExportarExcel}
            disabled={isLoading || pedidos.length === 0}
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
                <TableCell>Cliente</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Valor de Entrada</TableCell>
                <TableCell align="right">Valor Total</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : pedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    Nenhum pedido encontrado
                  </TableCell>
                </TableRow>
              ) : (
                pedidos
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell>{pedido.id}</TableCell>
                      <TableCell>{pedido.cliente.nome}</TableCell>
                      <TableCell>{formatarData(pedido.dataInicio)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(pedido.status)}
                          sx={{
                            backgroundColor: getStatusColor(pedido.status),
                            color: '#fff',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">{formatarValor(pedido.valorEntrada)}</TableCell>
                      <TableCell align="right">{formatarValor(pedido.valorTotal)}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenDetalhes(pedido)}
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
        {!isLoading && pedidos.length > 0 && (
          <TablePagination
            count={pedidos.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>

      {/* Modal de Detalhes */}
      <PedidoDetailsModal
        open={modalOpen}
        onClose={handleCloseDetalhes}
        pedido={pedidoDetalhes}
      />
    </Box>
  );
}
