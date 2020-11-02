import { getNumberFormat } from 'config/config-utils';

export function formatNumber(value) {
  const numberformat = getNumberFormat();
  if (numberformat == null) {
    return Intl.NumberFormat().format(value);
  }

  const numbersystem = numberformat.numberSystem || null;
  if (numbersystem) {
    return Intl.NumberFormat(numbersystem).format(value);
  }
  return Intl.NumberFormat().format(value);
}

export function isNumber(value) {
  if (typeof value == 'string') {
    return !Number.isNaN(Number(value));
  }
}
