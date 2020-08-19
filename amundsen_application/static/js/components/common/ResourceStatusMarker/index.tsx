// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import {
  MISSED_STATUS_TEXT,
  HIT_STATUS_TEXT,
} from './constants';

import './styles.scss';

export interface StatusMarkerProps {
  succeeded: boolean;
}

const FailureState: React.FC = () => {
  return (
    <div className="failure">
      <div className="failure-icon">
        <div className="exclamation-top" />
        <div className="exclamation-bottom" />
      </div>
      <span className="status-text">{MISSED_STATUS_TEXT}</span>
    </div>
  );
};

const SuccessState: React.FC = () => {
  return (
    <div className="success">
      <div className="success-icon">
        <span className="icon icon-check" />
      </div>
      <span className="status-text">{HIT_STATUS_TEXT}</span>
    </div>
  );
};

const ResourceStatusMarker: React.FC<StatusMarkerProps> = ({
  succeeded,
}: StatusMarkerProps) => {
  if (succeeded) {
    return <SuccessState />;
  }
  return <FailureState />;
};

export default ResourceStatusMarker;
