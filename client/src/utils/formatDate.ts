export class FormatDate {
  static date(value: Date | string | null | undefined): string {
    if (!value) return '';

    try {
      if (typeof value === 'string' && value.includes('-') && !value.includes('T')) {
        const [year, month, day] = value.split('-').map(Number);
        if (isNaN(year) || isNaN(month) || isNaN(day)) return '';
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
      }

      const date = new Date(value);
      if (isNaN(date.getTime())) return '';

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch (error) {
      return '';
    }
  }

  static dateUS(value: Date | string | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }

  static dateISO(value: Date | string | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  static dateForReport(value: Date | string | null | undefined): string {
    if (!value) return '';

    if (typeof value === 'string' && value.includes('-') && !value.includes('T')) {
      const [year, month, day] = value.split('-').map(Number);
      return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    }

    return this.date(value);
  }

  static time(value: Date | string | null | undefined): string {
    if (!value) return '';

    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) return '';

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${hours}:${minutes}`;
    } catch (error) {
      return '';
    }
  }

  static dateTime(value: Date | string | null | undefined): string {
    if (!value) return '';

    return `${this.date(value)} ${this.time(value)}`;
  }

  static parseDate(formattedValue: string): Date {
    const [day, month, year] = formattedValue.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  static parseISO(formattedValue: string): Date {
    return new Date(formattedValue);
  }
}
