import { formatDate } from 'utils/dateUtils';

import { getDistinctStatTypeName } from 'config/config-utils';

import { ColumnUniqueValues } from 'interfaces/index';

type StatType = Record<string, any>;

const mapIntoUniqueValueFormat = ([k, v]): ColumnUniqueValues => ({
  value: k,
  count: v,
});
const parseRawUniqueValues = (uniqueValues: string) =>
  JSON.parse(uniqueValues.split("'").join('"'));

/**
 * Parses the stats' distinct values key into an array of
 * objects with value and count properties
 * @param statsList
 * @returns ColumnUniqueValues[]
 */
export const getUniqueValues = (
  statsList: StatType[]
): ColumnUniqueValues[] | [] => {
  const uniqueValuesKey = getDistinctStatTypeName();
  if (!uniqueValuesKey) {
    return [];
  }

  const uniqueValues = statsList.find(
    (item) => item.stat_type === uniqueValuesKey
  );

  if (uniqueValues) {
    return Object.entries(parseRawUniqueValues(uniqueValues.stat_val)).map(
      mapIntoUniqueValueFormat
    );
  }

  return [];
};

/**
 * Removes any stat identified as a distinct value
 * @param statsList
 * @returns StatType[]
 */
export const filterOutUniqueValues = (statsList: StatType[]) => {
  const uniqueValuesKey = getDistinctStatTypeName();

  return statsList.filter((item) => item.stat_type !== uniqueValuesKey);
};

/**
 * Creates the stats info message from the start and end epoch timestamps
 * @param startEpoch
 * @param endEpoch
 * @returns string
 */
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
