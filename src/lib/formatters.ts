
/**
 * Formata um número como valor monetário em real brasileiro
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata uma data no formato brasileiro (dd/mm/yyyy)
 */
export function formatDate(date: string | Date): string {
  if (!date) return "";
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
}

/**
 * Formata um telefone brasileiro ((99) 99999-9999)
 */
export function formatPhone(phone: string): string {
  if (!phone) return "";
  
  // Remove todos os caracteres não numéricos
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7)}`;
  } else if (numbers.length === 10) {
    return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 6)}-${numbers.substring(6)}`;
  }
  
  return phone;
}

/**
 * Formata um CNPJ (99.999.999/0001-99)
 */
export function formatCnpj(cnpj: string): string {
  if (!cnpj) return "";
  
  // Remove todos os caracteres não numéricos
  const numbers = cnpj.replace(/\D/g, '');
  
  if (numbers.length === 14) {
    return `${numbers.substring(0, 2)}.${numbers.substring(2, 5)}.${numbers.substring(5, 8)}/${numbers.substring(8, 12)}-${numbers.substring(12)}`;
  }
  
  return cnpj;
}
