// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Modal } from 'react-bootstrap';

import { formatNumber, isNumber } from 'utils/numberUtils';

import { ColumnUniqueValues } from 'interfaces/index';

type UniqueValueRowProps = ColumnUniqueValues;

const UniqueValueRow: React.FC<UniqueValueRowProps> = ({
  value,
  count,
}: UniqueValueRowProps) => (
  <div className="unique-value-row">
    <div className="unique-value-name body-3">{value.toUpperCase()}</div>
    <div className="unique-value-value">
      {isNumber(count) ? formatNumber(+count) : count}
    </div>
  </div>
);

export type UniqueValuesModalProps = {
  uniqueValues: ColumnUniqueValues[];
  onClose: () => void;
};

const UniqueValuesModal: React.FC<UniqueValuesModalProps> = ({
  uniqueValues,
  onClose,
}: UniqueValuesModalProps) => (
  <Modal className="unique-values-modal" onHide={onClose}>
    <Modal.Header className="unique-values-modal-header" closeButton={false}>
      <Modal.Title>Unique Values</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="unique-values-table">
        {uniqueValues.map(({ value, count }) => (
          <UniqueValueRow key={value} value={value} count={count} />
        ))}
      </div>
    </Modal.Body>
  </Modal>
);

export default UniqueValuesModal;
