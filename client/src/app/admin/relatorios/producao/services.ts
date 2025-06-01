import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ProducaoReport, ProducaoReportFilters, Funcionario, Produto, getStatusText } from './schema';
import { FormatDate } from '@/utils/formatDate';

export const formatarData = (data: string | null) => {
  if (!data) return 'N/A';
  try {
    return FormatDate.dateForReport(data);
  } catch (error) {
    return 'Data inválida';
  }
};

export const exportarProducaoExcel = (producoes: ProducaoReport[]) => {
  const dadosExportacao = producoes.map(producao => ({
    'ID': producao.id,
    'Produto': producao.produto.nome,
    'Funcionário': producao.funcionario.nome,
    'Quantidade': producao.quantidade,
    'Data de Início': formatarData(producao.dataInicio),
    'Data de Finalização': formatarData(producao.dataFim),
    'Status': getStatusText(producao.status),
  }));

  const ws = XLSX.utils.json_to_sheet(dadosExportacao);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Produções');
  XLSX.writeFile(wb, 'relatorio_producao.xlsx');
  toast.success('Relatório exportado com sucesso!');
};

export const imprimirProducao = (
  producoes: ProducaoReport[],
  filtros: ProducaoReportFilters,
  funcionarios: Funcionario[],
  produtos: Produto[]
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

        ${filtros.codigo || filtros.funcionarioId || filtros.produtoId || filtros.status || filtros.dataInicio || filtros.dataFim ? `
        <div class="filters">
          <h3>Filtros Aplicados:</h3>
          ${filtros.codigo ? `<p><strong>ID:</strong> ${filtros.codigo}</p>` : ''}
          ${filtros.funcionarioId ? `<p><strong>Funcionário:</strong> ${funcionarios.find(f => f.id === filtros.funcionarioId)?.nome || 'N/A'}</p>` : ''}
          ${filtros.produtoId ? `<p><strong>Produto:</strong> ${produtos.find(p => p.id === filtros.produtoId)?.nome || 'N/A'}</p>` : ''}
          ${filtros.status ? `<p><strong>Status:</strong> ${getStatusText(filtros.status)}</p>` : ''}
          ${filtros.dataInicio ? `<p><strong>Data de Início:</strong> ${format(filtros.dataInicio, 'dd/MM/yyyy')}</p>` : ''}
          ${filtros.dataFim ? `<p><strong>Data de Fim:</strong> ${format(filtros.dataFim, 'dd/MM/yyyy')}</p>` : ''}
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
