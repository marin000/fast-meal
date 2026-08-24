/** Left-pad 12-digit UPC-A to EAN-13; leave other lengths unchanged. */
export const normalizeGtin = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 12) return `0${digits}`;
  return digits;
};

/**
 * GS1 mod-10 check digit for GTIN-8 / GTIN-12 / GTIN-13 / GTIN-14.
 * Weights alternate 3 and 1 from the right (excluding the check digit).
 */
export const isValidGtin = (raw: string): boolean => {
  const code = normalizeGtin(raw);
  if (!/^\d{8}$|^\d{13}$|^\d{14}$/.test(code)) return false;

  const body = code.slice(0, -1);
  const checkDigit = Number(code.slice(-1));

  let sum = 0;
  const reversed = body.split('').reverse();
  for (let i = 0; i < reversed.length; i += 1) {
    const digit = Number(reversed[i]);
    sum += digit * (i % 2 === 0 ? 3 : 1);
  }

  const expected = (10 - (sum % 10)) % 10;
  return expected === checkDigit;
};
