export class FormatNumber {
    static currency(value: number | null | undefined, currency: 'BRL' | 'USD' = 'BRL'): string {
      if (value == null) return '';

      const locales = {
        BRL: 'pt-BR',
        USD: 'en-US'
      };

      return new Intl.NumberFormat(locales[currency], {
        style: 'currency',
        currency
      }).format(value);
    }

    static parseCurrency(formattedValue: string): number {
      const cleanValue = formattedValue
        .replace(/[^\d,-]/g, '')
        .replace(',', '.');
      return parseFloat(cleanValue) || 0;
    }

    static quantity(value: number | null | undefined): string {
      if (value == null) return '';
      return new Intl.NumberFormat('pt-BR', {
        maximumFractionDigits: 0
      }).format(value);
    }

    static parseQuantity(formattedValue: string): number {
      return parseInt(formattedValue.replace(/\./g, '')) || 0;
    }

    static decimal(value: number | null | undefined, decimals: number = 2): string {
      if (value == null) return '';
      return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(value);
    }

    static parseDecimal(formattedValue: string): number {
      const cleanValue = formattedValue
        .replace(/\./g, '')
        .replace(',', '.');
      return parseFloat(cleanValue) || 0;
    }
  }