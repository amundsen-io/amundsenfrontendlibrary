import * as moment from 'moment-timezone';

export const DATE_FORMAT = 'MMM DD, YYYY';
export const DATE_FORMAT_LONG = 'MMMM Do YYYY [at] h:mm:ss a';

export function formatEpochTime(epochTime: number, dateFormat?: string) {
  const date = moment(epochTime * 1000);
  return date.format(dateFormat || DATE_FORMAT);
}
