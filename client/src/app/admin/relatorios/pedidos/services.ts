import * as XLSX from 'xlsx';
import { format, isValid } from 'date-fns';
import { toast } from 'sonner';
import { PedidoReport, PedidoReportFilters, Cliente } from './schema';
import { getStatusText, PedidoStatus } from '../../pedidos/constants';
import { FormatDate } from '@/utils/formatDate';

export const formatarValor = (valor: number | undefined | null) => {
  if (valor === undefined || valor === null) return 'R$ 0,00';
  return `R$ ${Number(valor).toFixed(2)}`;
};

export const formatarData = (data: string | null) => {
  if (!data) return 'N/A';
  try {
    return FormatDate.dateForReport(data);
  } catch (error) {
    return 'Data inválida';
  }
};

export const exportarPedidosExcel = (pedidos: PedidoReport[]) => {
  const dadosExportacao = pedidos.map(pedido => ({
    'ID': pedido.id,
    'Cliente': pedido.cliente.nome,
    'Data': formatarData(pedido.dataInicio),
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

export const imprimirPedidos = (
  pedidos: PedidoReport[],
  filtros: PedidoReportFilters,
  clientes: Cliente[]
) => {
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

        ${filtros.clienteId || filtros.status || filtros.dataInicio || filtros.dataFim ? `
        <div class="filters">
          <h3>Filtros Aplicados:</h3>
          ${filtros.clienteId ? `<p><strong>Cliente:</strong> ${clientes.find(c => c.id === filtros.clienteId)?.nome || 'N/A'}</p>` : ''}
          ${filtros.status ? `<p><strong>Status:</strong> ${getStatusText(filtros.status as PedidoStatus)}</p>` : ''}
          ${filtros.dataInicio ? `<p><strong>Data de Início:</strong> ${format(filtros.dataInicio, 'dd/MM/yyyy')}</p>` : ''}
          ${filtros.dataFim ? `<p><strong>Data de Fim:</strong> ${format(filtros.dataFim, 'dd/MM/yyyy')}</p>` : ''}
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

export const imprimirDetalhesPedido = (pedido: PedidoReport) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.');
    return;
  }

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Detalhes do Pedido ${pedido.id}</title>
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
          .info-section {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f5f5f5;
            border-radius: 5px;
          }
          .info-section h3 {
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
          .text-right { text-align: right; }
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
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Detalhes do Pedido ${pedido.id}</h1>
          <p>Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        </div>

        <div class="info-section">
          <h3>Informações do Pedido</h3>
          <p><strong>ID:</strong> ${pedido.id}</p>
          <p><strong>Cliente:</strong> ${pedido.cliente.nome}</p>
          <p><strong>Data:</strong> ${formatarData(pedido.dataInicio)}</p>
          <p><strong>Status:</strong> ${getStatusText(pedido.status)}</p>
          <p><strong>Valor de Entrada:</strong> ${formatarValor(pedido.valorEntrada)}</p>
          <p><strong>Valor Total:</strong> ${formatarValor(pedido.valorTotal)}</p>
        </div>

        ${pedido.produtos && pedido.produtos.length > 0 ? `
        <div class="info-section">
          <h3>Produtos</h3>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Código</th>
                <th class="text-right">Quantidade</th>
                <th class="text-right">Preço Unit.</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${pedido.produtos.map(item => `
                <tr>
                  <td>${item.produto?.nome || 'N/A'}</td>
                  <td>${item.produto?.codigo || 'N/A'}</td>
                  <td class="text-right">${item.quantidade}</td>
                  <td class="text-right">${formatarValor(item.preco)}</td>
                  <td class="text-right">${formatarValor(item.quantidade * item.preco)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        ${pedido.materiasPrimas && pedido.materiasPrimas.length > 0 ? `
        <div class="info-section">
          <h3>Matérias-Primas</h3>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Código</th>
                <th class="text-right">Quantidade</th>
                <th class="text-right">Preço Unit.</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${pedido.materiasPrimas.map(item => `
                <tr>
                  <td>${item.materiaPrima?.nome || 'N/A'}</td>
                  <td>${item.materiaPrima?.codigo || 'N/A'}</td>
                  <td class="text-right">${item.quantidade}</td>
                  <td class="text-right">${formatarValor(item.preco)}</td>
                  <td class="text-right">${formatarValor(item.quantidade * item.preco)}</td>
                </tr>
              `).join('')}
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
