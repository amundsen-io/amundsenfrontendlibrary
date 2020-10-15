import { getNumberFormat } from 'config/config-utils';
import { NumberFormatConfig } from 'config/config-types';

export function formatNumber(value) {
  const numberformat = getNumberFormat();
  if (numberformat == null) {
    return Intl.NumberFormat().format(value);
  }

  const numbersystem = numberformat.numbersystem || null;
  if (numbersystem) {
    return Intl.NumberFormat(numbersystem).format(value);
  }
  return Intl.NumberFormat().format(value);
}
