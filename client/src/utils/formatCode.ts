export class FormatCode {
  static productCode(value: string): string {
    const cleaned = value.toUpperCase().replace(/[^0-9]/g, '');
    if (!cleaned) return 'P-';
    return `P-${cleaned.slice(0, 6)}`;
  }

  static rawMaterialCode(value: string): string {
    const cleaned = value.toUpperCase().replace(/[^0-9]/g, '');
    if (!cleaned) return 'MP-';
    return `MP-${cleaned.slice(0, 6)}`;
  }
}
