/**
 * Utilitários para formatação e manipulação de datas
 * Evita problemas de timezone e formatação inconsistente
 */

/**
 * Formata uma data para o formato ISO (YYYY-MM-DD) usado pela API
 * Trata casos de datas inválidas retornando a data atual
 * 
 * @param dateInput - String de data, objeto Date ou valor inválido
 * @returns String no formato YYYY-MM-DD
 */
export const formatDateForAPI = (dateInput: string | Date | null | undefined): string => {
  try {
    let date: Date;
    
    if (!dateInput) {
      date = new Date();
    } else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else {
      date = dateInput;
    }
    
    if (isNaN(date.getTime())) {
      console.warn('Data inválida detectada, usando data atual:', dateInput);
      date = new Date();
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Erro ao formatar data, usando data atual:', error);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};

/**
 * Formata uma data para exibição no formato brasileiro (DD/MM/YYYY)
 * 
 * @param dateInput - String de data, objeto Date ou valor inválido
 * @returns String no formato DD/MM/YYYY ou string vazia se inválida
 */
export const formatDateForDisplay = (dateInput: string | Date | null | undefined): string => {
  try {
    if (!dateInput) return '';
    
    let date: Date;
    if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    } else {
      date = dateInput;
    }
    
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erro ao formatar data para exibição:', error);
    return '';
  }
};

/**
 * Converte uma string de data no formato DD/MM/YYYY para Date
 * 
 * @param dateString - String no formato DD/MM/YYYY
 * @returns Objeto Date ou null se inválida
 */
export const parseDisplayDate = (dateString: string): Date | null => {
  try {
    if (!dateString) return null;
    
    const [day, month, year] = dateString.split('/').map(Number);
    
    if (!day || !month || !year) return null;
    
    const date = new Date(year, month - 1, day);
    
    if (isNaN(date.getTime())) return null;
    
    return date;
  } catch (error) {
    console.error('Erro ao converter data de exibição:', error);
    return null;
  }
};

/**
 * Verifica se uma data é válida
 * 
 * @param dateInput - Qualquer tipo de entrada de data
 * @returns true se a data for válida
 */
export const isValidDate = (dateInput: any): boolean => {
  try {
    if (!dateInput) return false;
    
    const date = new Date(dateInput);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Obtém a data atual no formato ISO (YYYY-MM-DD)
 * 
 * @returns String no formato YYYY-MM-DD
 */
export const getCurrentDateISO = (): string => {
  return formatDateForAPI(new Date());
};

/**
 * Obtém a data atual no formato brasileiro (DD/MM/YYYY)
 * 
 * @returns String no formato DD/MM/YYYY
 */
export const getCurrentDateDisplay = (): string => {
  return formatDateForDisplay(new Date());
};
