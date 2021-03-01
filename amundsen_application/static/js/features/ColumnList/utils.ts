// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import { formatDate } from 'utils/dateUtils';
import { TableColumn } from 'interfaces/TableMetadata';
import { USAGE_STAT_TYPE } from './index';

export const getStatsInfoText = (startEpoch?: number, endEpoch?: number) => {
  const startDate = startEpoch
    ? formatDate({ epochTimestamp: startEpoch })
    : null;
  const endDate = endEpoch ? formatDate({ epochTimestamp: endEpoch }) : null;

  let infoText = 'Stats reflect data collected';

  if (startDate && endDate) {
    if (startDate === endDate) {
      infoText = `${infoText} on ${startDate} only. (daily partition)`;
    } else {
      infoText = `${infoText} between ${startDate} and ${endDate}.`;
    }
  } else {
    infoText = `${infoText} over a recent period of time.`;
  }

  return infoText;
};

export const hasColumnUsageStat = (columns: TableColumn[]) => {
  let hasUsage = false;
  columns.some((column) =>
    column.stats.some((stat) => {
      if (stat.stat_type === USAGE_STAT_TYPE) {
        hasUsage = true;
        return true;
      }
      return false;
    })
  );
  return hasUsage;
};
