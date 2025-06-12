// Email validator
export function validateEmail(value: string): true | string {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(value) ? true : 'Invalid email address';
}

// ZIP code validator (US-style 5-digit or 5+4)
export function validateZip(value: string): true | string {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(value) ? true : 'Invalid ZIP code format';
}

// CVC validator (3 or 4 digits)
export function validateCVC(value: string): true | string {
  const cvcRegex = /^[0-9]{3,4}$/;
  return cvcRegex.test(value) ? true : 'CVC must be 3 or 4 digits';
}
export function validateLuhn(value: string): true | string {
  const digits = value.replace(/\D/g, '').split('').reverse().map(Number);

  const sum = digits.reduce((acc, digit, idx) => {
    if (idx % 2 === 1) {
      const double = digit * 2;
      return acc + (double > 9 ? double - 9 : double);
    }
    return acc + digit;
  }, 0);

  return sum % 10 === 0 ? true : 'Invalid card number (Luhn check failed)';
}

export function validateExpiry(value: string): true | string {
  const [monthStr, yearStr] = value.split('/');
  const month = parseInt(monthStr, 10);
  const year = parseInt('20' + yearStr, 10); // YY → 20YY

  if (isNaN(month) || isNaN(year)) return 'Invalid date format';
  if (month < 1 || month > 12) return 'Invalid month';

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }

  return true;
}