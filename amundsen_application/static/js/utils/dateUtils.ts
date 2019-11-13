import * as moment from 'moment-timezone';


// TODO - we may need additional configurable formats
export const DATE_FORMAT = "MMM DD, YYYY";

export function formatEpochTime(epochTimestamp: number) {
  const date = moment(epochTimestamp * 1000);
  const string = date.format(DATE_FORMAT);
  return string;
}
