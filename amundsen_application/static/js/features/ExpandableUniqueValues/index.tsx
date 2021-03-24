// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { ColumnUniqueValues } from 'interfaces/index';
import { formatNumber, isNumber } from 'utils/numberUtils';

import './styles.scss';

export const UNIQUE_VALUES_TITLE = 'Unique Values';
export const NUMBER_OF_VALUES_SUMMARY = 5;

export interface ExpandableUniqueValuesProps {
  uniqueValues: ColumnUniqueValues[];
}

type UniqueValueRowProps = ColumnUniqueValues;

const UniqueValueRow: React.FC<UniqueValueRowProps> = ({
  value,
  count,
}: UniqueValueRowProps) => (
  <div className="column-stat-row">
    <div className="stat-name body-3">{value.toUpperCase()}</div>
    <div className="stat-value">
      {isNumber(count) ? formatNumber(+count) : count}
    </div>
  </div>
);

type UniqueValueSummaryProps = {
  uniqueValues: ColumnUniqueValues[];
};

const UniqueValueSummary: React.FC<UniqueValueSummaryProps> = ({
  uniqueValues,
}: UniqueValueSummaryProps) => {
  const summaryItems = uniqueValues.slice(0, NUMBER_OF_VALUES_SUMMARY);

  return (
    <div className="unique-values-list">
      {summaryItems.map(({ value }, index) => {
        const trailingSymbol = index === summaryItems.length - 1 ? '...' : ',';

        return (
          <span className="unique-value-item" key={value}>
            {value}
            {trailingSymbol}
          </span>
        );
      })}
    </div>
  );
};

const ExpandableUniqueValues: React.FC<ExpandableUniqueValuesProps> = ({
  uniqueValues,
}: ExpandableUniqueValuesProps) => {
  if (uniqueValues.length === 0) {
    return null;
  }

  return (
    <article className="unique-values">
      <div className="unique-values-wrapper">
        <span className="unique-values-title">{UNIQUE_VALUES_TITLE} </span>
        <UniqueValueSummary uniqueValues={uniqueValues} />
      </div>
      {/* <div className="column-stats-table">
        <div className="column-stats-column">
          {uniqueValues.map((stat, index) => {
            if (index % 2 === 0) {
              return (
                <UniqueValueRow
                  key={stat.value}
                  value={stat.value}
                  count={stat.count}
                />
              );
            }

            return null;
          })}
        </div>
        <div className="column-stats-column">
          {uniqueValues.map((stat, index) => {
            if (index % 2 === 1) {
              return (
                <UniqueValueRow
                  key={stat.value}
                  value={stat.value}
                  count={stat.count}
                />
              );
            }

            return null;
          })}
        </div>
      </div> */}
    </article>
  );
};

export default ExpandableUniqueValues;
