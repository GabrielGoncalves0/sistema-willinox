'use client';

import { ExcelExportService } from '@/services/exportService';
import { ReportService, ReportData } from '@/services/reportService';
import { PrintService, TableData } from '@/services/printService';

interface UseExportReturn {
  exportToExcel: (data: any[], filename: string, sheetName?: string) => void;
  exportProductsToExcel: (products: any[]) => void;
  exportClientsToExcel: (clients: any[]) => void;
  exportSuppliersToExcel: (suppliers: any[]) => void;
  exportEmployeesToExcel: (employees: any[]) => void;
  printReport: (reportData: ReportData, tableHeaders: string[]) => void;
  exportReportToExcel: (reportData: ReportData, filename: string) => void;
}

/**
 * Hook reutilizável para funcionalidades de exportação
 * Centraliza todas as operações de export/print
 */
export function useExport(): UseExportReturn {
  const exportToExcel = (data: any[], filename: string, sheetName?: string) => {
    ExcelExportService.export(data, { filename, sheetName });
  };

  const exportProductsToExcel = (products: any[]) => {
    ExcelExportService.exportProducts(products);
  };

  const exportClientsToExcel = (clients: any[]) => {
    ExcelExportService.exportClients(clients);
  };

  const exportSuppliersToExcel = (suppliers: any[]) => {
    ExcelExportService.exportSuppliers(suppliers);
  };

  const exportEmployeesToExcel = (employees: any[]) => {
    ExcelExportService.exportEmployees(employees);
  };

  const printReport = (reportData: ReportData, tableHeaders: string[]) => {
    ReportService.printReport(reportData, { filename: '', showFilters: true }, tableHeaders);
  };

  const exportReportToExcel = (reportData: ReportData, filename: string) => {
    ReportService.exportToExcel(reportData, { filename, showFilters: true });
  };

  return {
    exportToExcel,
    exportProductsToExcel,
    exportClientsToExcel,
    exportSuppliersToExcel,
    exportEmployeesToExcel,
    printReport,
    exportReportToExcel,
  };
}
