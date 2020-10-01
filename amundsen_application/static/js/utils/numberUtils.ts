import { getNumberFormat } from 'config/config-utils';

export function formatNumber(value) {
  const numberformat = getNumberFormat();
  if (numberformat) {
    return Intl.NumberFormat(numberformat).format(value);
  }
  return Intl.NumberFormat().format(value);
}
