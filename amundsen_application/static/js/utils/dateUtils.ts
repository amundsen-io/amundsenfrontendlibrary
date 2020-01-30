import * as moment from 'moment-timezone';


// TODO - we may need additional configurable formats
export const DATE_FORMAT = 'MMM DD, YYYY';
export const DATE_FORMAT_LONG = 'MMMM Do YYYY [at] h:mm:ss a';

export function formatEpochTime(epochTimestamp: number, dateFormat?: string) {
  const date = moment(epochTimestamp * 1000);
  return date.format(dateFormat || DATE_FORMAT);
}



