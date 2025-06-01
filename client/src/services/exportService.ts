import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table as DocxTable, TableRow as DocxTableRow, TableCell as DocxTableCell, HeadingLevel, BorderStyle, WidthType, AlignmentType } from 'docx';
import { toast } from 'sonner';
import { FormatDate } from '@/utils/formatDate';

export interface ExportData {
  [key: string]: string | number | boolean | null | undefined;
}

export interface ExportConfig {
  filename: string;
  sheetName?: string;
  title?: string;
  headers?: string[];
}

export class ExcelExportService {
  static export(data: ExportData[], config: ExportConfig): void {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, config.sheetName || 'Dados');
      XLSX.writeFile(wb, `${config.filename}.xlsx`);
      toast.success('Exportação para Excel realizada com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      toast.error('Erro ao exportar para Excel.');
    }
  }

  static exportProducts(products: any[]): void {
    const formatPrice = (price?: number) => {
      const numericPrice = Number(price) || 0;
      return `R$${numericPrice.toFixed(2)}`;
    };

    const exportData = products.map((product) => ({
      'Código': product.codigo,
      'Nome': product.nome,
      'Descrição': product.descricao,
      'Preço': formatPrice(product.preco),
      'Quantidade': product.qtdEstoque,
      'Modelo': product.modelo.nome,
    }));

    this.export(exportData, { filename: 'produtos', sheetName: 'Produtos' });
  }

  static exportClients(clients: any[]): void {
    const exportData = clients.map((client) => ({
      'Nome': client.nome,
      'Email': client.email,
      'Telefone': client.telefone,
      'Endereço': client.endereco,
      'Tipo': client.tipo === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica',
      'CPF/CNPJ': client.cpf || client.cnpj,
      'Status': client.ativo ? 'Ativo' : 'Inativo',
    }));

    this.export(exportData, { filename: 'clientes', sheetName: 'Clientes' });
  }

  static exportSuppliers(suppliers: any[]): void {
    const exportData = suppliers.map((supplier) => ({
      'Nome': supplier.nome,
      'Email': supplier.email,
      'Telefone': supplier.telefone,
      'Endereço': supplier.endereco,
      'CNPJ': supplier.cnpj,
      'Status': supplier.ativo ? 'Ativo' : 'Inativo',
    }));

    this.export(exportData, { filename: 'fornecedores', sheetName: 'Fornecedores' });
  }

  static exportEmployees(employees: any[]): void {
    const exportData = employees.map((employee) => ({
      'Nome': employee.nome,
      'Email': employee.email,
      'Telefone': employee.telefone,
      'Endereço': employee.endereco,
      'CPF': employee.cpf,
      'Data de Nascimento': employee.dataNascimento ? FormatDate.dateForReport(employee.dataNascimento) : '',
      'Login': employee.login || 'Não possui',
      'Status': employee.ativo ? 'Ativo' : 'Inativo',
    }));

    this.export(exportData, { filename: 'funcionarios', sheetName: 'Funcionários' });
  }
}

export class WordExportService {
  static async exportDetails(data: any, config: ExportConfig & { sections: any[] }): Promise<void> {
    try {
      const doc = new Document({
        sections: config.sections,
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${config.filename}.docx`);
      toast.success('Detalhes exportados para Word com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar para Word:', error);
      toast.error('Erro ao exportar para Word.');
    }
  }

  static createSection(title: string, content: any[]): any {
    return {
      properties: {},
      children: [
        new Paragraph({
          text: title,
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          text: `Data de emissão: ${FormatDate.dateForReport(new Date().toISOString())}`,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ text: '' }),
        ...content,
      ],
    };
  }

  static createTable(headers: string[], rows: string[][]): DocxTable {
    return new DocxTable({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      rows: [
        new DocxTableRow({
          children: headers.map(header => 
            new DocxTableCell({
              children: [new Paragraph({ text: header })],
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1 },
                bottom: { style: BorderStyle.SINGLE, size: 1 },
                left: { style: BorderStyle.SINGLE, size: 1 },
                right: { style: BorderStyle.SINGLE, size: 1 },
              },
            })
          ),
        }),
        ...rows.map(row => 
          new DocxTableRow({
            children: row.map(cell => 
              new DocxTableCell({
                children: [new Paragraph({ text: cell })],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              })
            ),
          })
        ),
      ],
    });
  }
}
