import * as Moment from 'moment-timezone';
import AppConfig from 'config/config';

const timezone = Moment.tz.guess();

interface DateConfig {
  timestamp?: number;
  epochTimestamp?: number;
  dateString?: string;
  dateStringFormat?: string;
}

// This function is only exported for testing
export function getMomentDate(config: DateConfig): Moment {
  let moment;
  if (config.timestamp) {
    moment = Moment(config.timestamp);
  }
  if (config.epochTimestamp) {
    moment = Moment(config.epochTimestamp * 1000);
  }
  if (config.dateString && config.dateStringFormat) {
    moment = Moment(config.dateString, config.dateStringFormat)
  }
  return moment.tz(timezone);
}

export function formatDate(config: DateConfig) {
  const date = getMomentDate(config);
  return date.format(AppConfig.date.dateFormat);
}

export function formatDateTimeShort(config: DateConfig) {
  const date = getMomentDate(config);
  return date.format(AppConfig.date.dateTimeFormatShort);
}

export function formatDateTimeLong(config: DateConfig) {
  const date = getMomentDate(config);
  return date.format(AppConfig.date.dateTimeFormatLong);
}
