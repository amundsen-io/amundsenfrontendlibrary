// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { ColumnUniqueValues } from 'interfaces/index';

import UniqueValuesModal from './UniqueValuesModal';

import './styles.scss';

export const UNIQUE_VALUES_TITLE = 'Unique Values';
export const SEE_MORE_LINK_TEXT = 'See all';
export const NUMBER_OF_VALUES_SUMMARY = 5;

export interface ExpandableUniqueValuesProps {
  uniqueValues: ColumnUniqueValues[];
}

type UniqueValueSummaryProps = {
  uniqueValues: ColumnUniqueValues[];
};

const UniqueValueSummary: React.FC<UniqueValueSummaryProps> = ({
  uniqueValues,
}: UniqueValueSummaryProps) => {
  const summaryItems = uniqueValues.slice(0, NUMBER_OF_VALUES_SUMMARY);
  const [showModal, setShowModal] = React.useState(false);

  const handleSeeAll = () => {
    console.log('see all!!');
    setShowModal(true);
  };
  const handleCloseModal = () => {
    console.log('close modal!!');
    setShowModal(false);
  };

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
      <button
        className="unique-values-expand-link"
        type="button"
        onClick={handleSeeAll}
      >
        {SEE_MORE_LINK_TEXT}
      </button>
      {showModal && (
        <UniqueValuesModal
          uniqueValues={uniqueValues}
          onClose={handleCloseModal}
        />
      )}
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
    </article>
  );
};

export default ExpandableUniqueValues;
