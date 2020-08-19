// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import './styles.scss';

export interface RunStateProps {
  stateText: string;
  succeeded: boolean;
}

export interface StateProps {
  stateText: string;
}

const MissedState: React.FC<StateProps> = ({
  stateText,
}: StateProps) => {
  return (
    <div className="missed">
      <div className="missed-icon">
        <div className="exclamation-top" />
        <div className="exclamation-bottom" />
      </div>
      <span className="status-text">{stateText}</span>
    </div>
  );
};

const HitState: React.FC<StateProps> = ({
  stateText,
}: StateProps) => {
  return (
    <div className="hit">
      <div className="hit-icon">
        <img className="icon icon-check" alt="" />
      </div>
      <span className="status-text">{stateText}</span>
    </div>
  );
};

const RunStateContainer: React.FC<RunStateProps> = ({
  stateText,
  succeeded,
}: RunStateProps) => {
  if (succeeded) {
    return <HitState
      stateText={stateText}/>;
  }
  return <MissedState 
    stateText={stateText}/>;
};

export default RunStateContainer;
