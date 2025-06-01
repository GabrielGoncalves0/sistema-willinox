import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { ProdutoReport, ProdutoPorModelo, ProdutoReportFilters } from './schema';

export const formatarValor = (valor: number | undefined | null) => {
  if (valor === undefined || valor === null) return 'R$ 0,00';
  return `R$ ${Number(valor).toFixed(2)}`;
};

export const exportarProdutosExcel = (
  produtos: ProdutoReport[],
  produtosPorModelo: ProdutoPorModelo[],
  tabValue: number
) => {
  let dadosExportacao;

  if (tabValue === 0) {
    dadosExportacao = produtos.map(produto => ({
      'Código': produto.codigo,
      'Nome': produto.nome,
      'Descrição': produto.descricao,
      'Modelo': produto.modelo.nome,
      'Preço': formatarValor(produto.preco),
      'Quantidade em Estoque': produto.qtdEstoque,
      'Valor em Estoque': formatarValor(produto.preco * produto.qtdEstoque),
      'Status': produto.ativo ? 'Ativo' : 'Inativo',
    }));
  } else {
    dadosExportacao = produtosPorModelo.map(item => ({
      'Modelo': item.modelo,
      'Quantidade de Produtos': item.quantidade,
      'Valor em Estoque': formatarValor(item.valorEstoque),
    }));
  }

  const ws = XLSX.utils.json_to_sheet(dadosExportacao);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Produtos');
  XLSX.writeFile(wb, `relatorio_produtos_${tabValue === 0 ? 'lista' : 'por_modelo'}.xlsx`);
  toast.success('Relatório exportado com sucesso!');
};

export const imprimirProdutos = (
  produtos: ProdutoReport[],
  filtros: ProdutoReportFilters,
  modelos: Array<{ id: string; nome: string }>
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
        <title>Relatório de Produtos</title>
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
          .status-ativo { background-color: #4caf50; }
          .status-inativo { background-color: #f44336; }
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
          <h1>Relatório de Produtos</h1>
          <p>Data de emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}</p>
          ${produtos.length > 0 ? `<p>Total de registros: ${produtos.length}</p>` : ''}
        </div>

        ${filtros.codigo || filtros.modeloId || filtros.status !== 'ativos' ? `
        <div class="filters">
          <h3>Filtros Aplicados:</h3>
          ${filtros.codigo ? `<p><strong>Código/Nome:</strong> ${filtros.codigo}</p>` : ''}
          ${filtros.modeloId ? `<p><strong>Modelo:</strong> ${modelos.find(m => m.id === filtros.modeloId)?.nome || 'N/A'}</p>` : ''}
          ${filtros.status !== 'ativos' ? `<p><strong>Status:</strong> ${filtros.status === 'inativos' ? 'Apenas Inativos' : filtros.status === 'todos' ? 'Todos' : 'Apenas Ativos'}</p>` : ''}
        </div>
        ` : ''}

        ${produtos.length === 0 ? `
          <div style="text-align: center; padding: 40px; color: #666;">
            <h3>Nenhum produto encontrado</h3>
            <p>Não há produtos que correspondam aos filtros aplicados.</p>
          </div>
        ` : `
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Modelo</th>
                <th class="text-right">Preço</th>
                <th class="text-right">Estoque</th>
                <th class="text-right">Valor em Estoque</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${produtos.map(produto => `
                <tr>
                  <td>${produto.codigo}</td>
                  <td>${produto.nome}</td>
                  <td>${produto.modelo.nome}</td>
                  <td class="text-right">${formatarValor(produto.preco)}</td>
                  <td class="text-right">${produto.qtdEstoque}</td>
                  <td class="text-right">${formatarValor(produto.preco * produto.qtdEstoque)}</td>
                  <td>
                    <span class="status-chip status-${produto.ativo ? 'ativo' : 'inativo'}">
                      ${produto.ativo ? 'Ativo' : 'Inativo'}
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
