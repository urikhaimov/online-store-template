export function getCardBrand(cardNumber: string): 'Visa' | 'MasterCard' | 'Amex' | 'Unknown' {
  const clean = cardNumber.replace(/\s+/g, '');

  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(clean)) return 'Visa';
  if (/^5[1-5][0-9]{14}$/.test(clean) || /^2[2-7][0-9]{14}$/.test(clean)) return 'MasterCard';
  if (/^3[47][0-9]{13}$/.test(clean)) return 'Amex';

  return 'Unknown';
}
