export function getCardBrand(cardNumber: string): 'Visa' | 'MasterCard' | 'Amex' | 'Unknown' {
  const clean = cardNumber.replace(/\s+/g, '');

  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(clean)) return 'Visa';
  if (/^5[1-5][0-9]{14}$/.test(clean) || /^2[2-7][0-9]{14}$/.test(clean)) return 'MasterCard';
  if (/^3[47][0-9]{13}$/.test(clean)) return 'Amex';

  return 'Unknown';
}
export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '');
  const month = digits.slice(0, 2);
  const year = digits.slice(2, 4);

  return [month, year].filter(Boolean).join('/');
}
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, ''); // remove non-digits

  if (cleaned.startsWith('34') || cleaned.startsWith('37')) {
    // Amex: 4-6-5 format
    return cleaned
      .replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, g1, g2, g3) =>
        [g1, g2, g3].filter(Boolean).join(' ')
      )
      .trim();
  }

  // Default: 4-4-4-4 format (Visa, MasterCard, etc.)
  return cleaned
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();
}

