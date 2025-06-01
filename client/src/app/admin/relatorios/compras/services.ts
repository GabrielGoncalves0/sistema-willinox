import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Compra, CompraReportFilters, Fornecedor, getStatusText } from './schema';
import { FormatDate } from '@/utils/formatDate';
import { Document, Packer, Paragraph, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, HeadingLevel, BorderStyle, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export const formatarValor = (valor: number | undefined | null) => {
  if (valor === undefined || valor === null) return 'R$ 0,00';
  return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
};

export const formatarData = (data: string | null) => {
  if (!data) return 'N/A';
  try {
    return FormatDate.dateForReport(data);
  } catch (error) {
    return 'Data inválida';
  }
};

export const exportarComprasExcel = (compras: Compra[]) => {
  const dadosExportacao = compras.flatMap(compra =>
    compra.itens.map(item => ({
      'ID': compra.codigo,
      'Data': formatarData(compra.data),
      'Fornecedor': compra.fornecedor.nome,
      'Status': getStatusText(compra.status),
      'Matéria Prima': item.materiaPrima.nome,
      'Quantidade': item.quantidade,
      'Valor Unitário': formatarValor(item.valorUnitario),
      'Valor Total do Item': formatarValor(item.valorTotal),
      'Valor Total da Compra': formatarValor(compra.valorTotal),
    }))
  );

  const ws = XLSX.utils.json_to_sheet(dadosExportacao);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Compras');
  XLSX.writeFile(wb, 'relatorio_compras.xlsx');
  toast.success('Relatório exportado com sucesso!');
};

export const exportarComprasWord = async (compras: Compra[], filtros: CompraReportFilters) => {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Relatório de Compras",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Total de registros: ${compras.length}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: "" }),

          ...(filtros.codigo || filtros.fornecedorId || filtros.status || filtros.dataInicio || filtros.dataFim ? [
            new Paragraph({
              text: "Filtros Aplicados:",
              heading: HeadingLevel.HEADING_2,
            }),
            ...(filtros.codigo ? [new Paragraph({ text: `Código: ${filtros.codigo}` })] : []),
            ...(filtros.fornecedorId ? [new Paragraph({ text: `Fornecedor: ${filtros.fornecedorId}` })] : []),
            ...(filtros.status ? [new Paragraph({ text: `Status: ${getStatusText(filtros.status)}` })] : []),
            ...(filtros.dataInicio ? [new Paragraph({ text: `Data de Início: ${format(filtros.dataInicio, 'dd/MM/yyyy')}` })] : []),
            ...(filtros.dataFim ? [new Paragraph({ text: `Data de Fim: ${format(filtros.dataFim, 'dd/MM/yyyy')}` })] : []),
            new Paragraph({ text: "" }),
          ] : []),

          new DocxTable({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new DocxTableRow({
                children: [
                  new DocxTableCell({ children: [new Paragraph({ text: "ID" })] }),
                  new DocxTableCell({ children: [new Paragraph({ text: "Data" })] }),
                  new DocxTableCell({ children: [new Paragraph({ text: "Fornecedor" })] }),
                  new DocxTableCell({ children: [new Paragraph({ text: "Status" })] }),
                  new DocxTableCell({ children: [new Paragraph({ text: "Valor Total" })] }),
                ],
              }),
              ...compras.map(compra => new DocxTableRow({
                children: [
                  new DocxTableCell({ children: [new Paragraph({ text: compra.codigo })] }),
                  new DocxTableCell({ children: [new Paragraph({ text: formatarData(compra.data) })] }),
                  new DocxTableCell({ children: [new Paragraph({ text: compra.fornecedor.nome })] }),
                  new DocxTableCell({ children: [new Paragraph({ text: getStatusText(compra.status) })] }),
                  new DocxTableCell({ children: [new Paragraph({ text: formatarValor(compra.valorTotal) })] }),
                ],
              })),
            ],
          }),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, 'relatorio_compras.docx');
    toast.success('Relatório Word exportado com sucesso!');
  } catch (error) {
    console.error('Erro ao exportar para Word:', error);
    toast.error('Erro ao exportar relatório para Word.');
  }
};

export const imprimirCompras = (
  compras: Compra[],
  filtros: CompraReportFilters,
  fornecedores: Fornecedor[]
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
        <title>Relatório de Compras</title>
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
          .status-processando { background-color: #2196f3; }
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
          <h1>Relatório de Compras</h1>
          <p>Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
          ${compras.length > 0 ? `<p>Total de registros: ${compras.length}</p>` : ''}
        </div>

        ${filtros.codigo || filtros.fornecedorId || filtros.status || filtros.dataInicio || filtros.dataFim ? `
        <div class="filters">
          <h3>Filtros Aplicados:</h3>
          ${filtros.codigo ? `<p><strong>Código:</strong> ${filtros.codigo}</p>` : ''}
          ${filtros.fornecedorId ? `<p><strong>Fornecedor:</strong> ${fornecedores.find(f => f.id === filtros.fornecedorId)?.nome || 'N/A'}</p>` : ''}
          ${filtros.status ? `<p><strong>Status:</strong> ${getStatusText(filtros.status)}</p>` : ''}
          ${filtros.dataInicio ? `<p><strong>Data de Início:</strong> ${format(filtros.dataInicio, 'dd/MM/yyyy')}</p>` : ''}
          ${filtros.dataFim ? `<p><strong>Data de Fim:</strong> ${format(filtros.dataFim, 'dd/MM/yyyy')}</p>` : ''}
        </div>
        ` : ''}

        ${compras.length === 0 ? `
          <div style="text-align: center; padding: 40px; color: #666;">
            <h3>Nenhuma compra encontrada</h3>
            <p>Não há compras que correspondam aos filtros aplicados.</p>
          </div>
        ` : `
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Fornecedor</th>
                <th>Status</th>
                <th class="text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              ${compras.map(compra => `
                <tr>
                  <td>${compra.codigo}</td>
                  <td>${formatarData(compra.data)}</td>
                  <td>${compra.fornecedor.nome}</td>
                  <td>
                    <span class="status-chip status-${compra.status.toLowerCase()}">
                      ${getStatusText(compra.status)}
                    </span>
                  </td>
                  <td class="text-right">${formatarValor(compra.valorTotal)}</td>
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

export const imprimirDetalhesCompra = (compra: Compra) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.');
    return;
  }

  const printContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Detalhes da Compra ${compra.codigo}</title>
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
          <h1>Detalhes da Compra ${compra.codigo}</h1>
          <p>Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
        </div>

        <div class="info-section">
          <h3>Informações da Compra</h3>
          <p><strong>Código:</strong> ${compra.codigo}</p>
          <p><strong>Fornecedor:</strong> ${compra.fornecedor.nome}</p>
          <p><strong>Data:</strong> ${formatarData(compra.data)}</p>
          <p><strong>Status:</strong> ${getStatusText(compra.status)}</p>
          <p><strong>Valor Total:</strong> ${formatarValor(compra.valorTotal)}</p>
        </div>

        <div class="info-section">
          <h3>Itens da Compra</h3>
          <table>
            <thead>
              <tr>
                <th>Matéria Prima</th>
                <th class="text-right">Quantidade</th>
                <th class="text-right">Valor Unitário</th>
                <th class="text-right">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              ${compra.itens.map(item => `
                <tr>
                  <td>${item.materiaPrima.nome}</td>
                  <td class="text-right">${item.quantidade}</td>
                  <td class="text-right">${formatarValor(item.valorUnitario)}</td>
                  <td class="text-right">${formatarValor(item.valorTotal)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

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
