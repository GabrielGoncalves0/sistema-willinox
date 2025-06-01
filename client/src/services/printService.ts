import { toast } from 'sonner';
import { format } from 'date-fns';

export interface PrintConfig {
  title: string;
  subtitle?: string;
  showFilters?: boolean;
  filters?: { [key: string]: any };
  customStyles?: string;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
}

export class PrintService {
  private static getDefaultStyles(): string {
    return `
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
      .status-em_andamento { background-color: #2196f3; }
      .status-em_producao { background-color: #2196f3; }
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
      .no-data {
        text-align: center;
        padding: 40px;
        color: #666;
      }
      @media print {
        body { margin: 0; }
        .no-print { display: none; }
      }
    `;
  }

  static print(config: PrintConfig, tableData?: TableData, detailsData?: any): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.');
      return;
    }

    const content = this.generatePrintContent(config, tableData, detailsData);
    
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  private static generatePrintContent(config: PrintConfig, tableData?: TableData, detailsData?: any): string {
    const styles = config.customStyles || this.getDefaultStyles();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${config.title}</title>
          <style>${styles}</style>
        </head>
        <body>
          ${this.generateHeader(config)}
          ${config.showFilters && config.filters ? this.generateFilters(config.filters) : ''}
          ${tableData ? this.generateTable(tableData) : ''}
          ${detailsData ? this.generateDetails(detailsData) : ''}
          ${this.generateFooter()}
        </body>
      </html>
    `;
  }

  private static generateHeader(config: PrintConfig): string {
    return `
      <div class="header">
        <h1>${config.title}</h1>
        ${config.subtitle ? `<p>${config.subtitle}</p>` : ''}
        <p>Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</p>
      </div>
    `;
  }

  private static generateFilters(filters: { [key: string]: any }): string {
    const filterItems = Object.entries(filters)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => `<p><strong>${this.formatFilterLabel(key)}:</strong> ${value}</p>`)
      .join('');

    return filterItems ? `
      <div class="filters">
        <h3>Filtros Aplicados:</h3>
        ${filterItems}
      </div>
    ` : '';
  }

  private static generateTable(tableData: TableData): string {
    if (tableData.rows.length === 0) {
      return `
        <div class="no-data">
          <h3>Nenhum registro encontrado</h3>
          <p>Não há dados que correspondam aos filtros aplicados.</p>
        </div>
      `;
    }

    const headerRow = tableData.headers.map(header => `<th>${header}</th>`).join('');
    const bodyRows = tableData.rows.map(row => 
      `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
    ).join('');

    return `
      <table>
        <thead>
          <tr>${headerRow}</tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    `;
  }

  private static generateDetails(detailsData: any): string {
    return `
      <div class="info-section">
        <h3>Detalhes</h3>
        ${Object.entries(detailsData)
          .map(([key, value]) => `
            <div class="info-row">
              <span class="info-label">${this.formatFilterLabel(key)}:</span>
              <span>${value}</span>
            </div>
          `).join('')}
      </div>
    `;
  }

  private static generateFooter(): string {
    return `
      <div class="footer">
        <p>Relatório gerado automaticamente pelo Sistema de Gestão</p>
      </div>
    `;
  }

  private static formatFilterLabel(key: string): string {
    const labels: { [key: string]: string } = {
      codigo: 'Código',
      nome: 'Nome',
      dataInicio: 'Data de Início',
      dataFim: 'Data de Fim',
      status: 'Status',
      clienteId: 'Cliente',
      fornecedorId: 'Fornecedor',
      funcionarioId: 'Funcionário',
      produtoId: 'Produto',
      materiaPrimaId: 'Matéria Prima',
      valorTotal: 'Valor Total',
      valorEntrada: 'Valor de Entrada',
    };

    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }
}
