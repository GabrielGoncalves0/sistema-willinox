import { ExcelExportService, WordExportService } from './exportService';
import { PrintService, TableData } from './printService';
import { FormatDate } from '@/utils/formatDate';

export interface ReportData {
  title: string;
  data: any[];
  filters?: { [key: string]: any };
  totalRecords?: number;
}

interface FormatterFunction {
  (value: any): string;
}

interface Formatters {
  [key: string]: FormatterFunction;
}

export interface ReportConfig {
  filename: string;
  sheetName?: string;
  showFilters?: boolean;
  customFormatters?: Formatters;
}

export class ReportService {
  private static defaultFormatters: Formatters = {
    currency: (value: number | undefined | null): string => {
      if (value === undefined || value === null) return 'R$ 0,00';
      return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
    },
    date: (value: string | Date): string => {
      if (!value) return '';
      return FormatDate.dateForReport(value.toString());
    },
    status: (value: string): string => {
      const statusMap: { [key: string]: string } = {
        'pendente': 'Pendente',
        'processando': 'Processando',
        'em_andamento': 'Em Andamento',
        'em_producao': 'Em Produção',
        'concluido': 'Concluído',
        'cancelado': 'Cancelado',
      };
      return statusMap[value] || value;
    },
    boolean: (value: boolean): string => value ? 'Sim' : 'Não',
    personType: (value: string): string => value === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica',
  };

  static exportToExcel(reportData: ReportData, config: ReportConfig): void {
    const formattedData = this.formatDataForExport(reportData.data, config.customFormatters);
    ExcelExportService.export(formattedData, {
      filename: config.filename,
      sheetName: config.sheetName,
      title: reportData.title,
    });
  }

  static printReport(reportData: ReportData, config: ReportConfig, tableHeaders: string[]): void {
    const tableData: TableData = {
      headers: tableHeaders,
      rows: this.formatDataForTable(reportData.data, config.customFormatters),
    };

    PrintService.print(
      {
        title: reportData.title,
        subtitle: reportData.totalRecords ? `Total de registros: ${reportData.totalRecords}` : undefined,
        showFilters: config.showFilters,
        filters: reportData.filters,
      },
      tableData
    );
  }

  static async exportDetailsToWord(
    detailsData: any,
    config: ReportConfig & { sections: any[] }
  ): Promise<void> {
    await WordExportService.exportDetails(detailsData, config);
  }

  private static formatDataForExport(
    data: any[],
    customFormatters?: Formatters
  ): any[] {
    const formatters: Formatters = { ...this.defaultFormatters, ...customFormatters };

    return data.map(item => {
      const formattedItem: any = {};

      Object.entries(item).forEach(([key, value]) => {
        if (key in formatters) {
          formattedItem[key] = formatters[key](value);
        } else {
          formattedItem[key] = value;
        }
      });

      return formattedItem;
    });
  }

  private static formatDataForTable(
    data: any[],
    customFormatters?: Formatters
  ): (string | number)[][] {
    const formatters: Formatters = { ...this.defaultFormatters, ...customFormatters };

    return data.map(item => {
      return Object.entries(item).map(([key, value]) => {
        if (key in formatters) {
          return formatters[key](value);
        }
        return value?.toString() || '';
      });
    });
  }

  static generateComprasReport(compras: any[], filters?: any): ReportData {
    const formattedData = compras.flatMap(compra =>
      compra.itens.map((item: any) => ({
        'ID': compra.codigo,
        'Data': this.defaultFormatters.date(compra.data),
        'Fornecedor': compra.fornecedor.nome,
        'Status': this.defaultFormatters.status(compra.status),
        'Matéria Prima': item.materiaPrima.nome,
        'Quantidade': item.quantidade,
        'Valor Unitário': this.defaultFormatters.currency(item.valorUnitario),
        'Valor Total do Item': this.defaultFormatters.currency(item.valorTotal),
        'Valor Total da Compra': this.defaultFormatters.currency(compra.valorTotal),
      }))
    );

    return {
      title: 'Relatório de Compras',
      data: formattedData,
      filters,
      totalRecords: compras.length,
    };
  }

  static generatePedidosReport(pedidos: any[], filters?: any): ReportData {
    const formattedData = pedidos.map(pedido => ({
      'ID': pedido.id,
      'Cliente': pedido.cliente.nome,
      'Data': this.defaultFormatters.date(pedido.dataInicio),
      'Status': this.defaultFormatters.status(pedido.status),
      'Valor de Entrada': this.defaultFormatters.currency(pedido.valorEntrada),
      'Valor Total': this.defaultFormatters.currency(pedido.valorTotal),
    }));

    return {
      title: 'Relatório de Pedidos',
      data: formattedData,
      filters,
      totalRecords: pedidos.length,
    };
  }

  static generateProducaoReport(producoes: any[], filters?: any): ReportData {
    const formattedData = producoes.map(producao => ({
      'ID': producao.id,
      'Funcionário': producao.funcionario.nome,
      'Data Início': this.defaultFormatters.date(producao.dataInicio),
      'Data Fim': producao.dataFim ? this.defaultFormatters.date(producao.dataFim) : 'Em andamento',
      'Status': this.defaultFormatters.status(producao.status),
      'Produtos': producao.itens.length,
    }));

    return {
      title: 'Relatório de Produção',
      data: formattedData,
      filters,
      totalRecords: producoes.length,
    };
  }

  static generateProdutosReport(produtos: any[], filters?: any): ReportData {
    const formattedData = produtos.map(produto => ({
      'Código': produto.codigo,
      'Nome': produto.nome,
      'Descrição': produto.descricao,
      'Preço': this.defaultFormatters.currency(produto.preco),
      'Estoque': produto.qtdEstoque,
      'Modelo': produto.modelo.nome,
      'Status': produto.ativo ? 'Ativo' : 'Inativo',
    }));

    return {
      title: 'Relatório de Produtos',
      data: formattedData,
      filters,
      totalRecords: produtos.length,
    };
  }
}
