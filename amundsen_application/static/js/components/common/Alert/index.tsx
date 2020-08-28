// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import AlertIcon from './AlertIcon';

import './styles.scss';

export interface AlertProps {
  message: string | React.ReactNode;
  actionText?: string;
  onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Alert: React.FC<AlertProps> = ({
  message,
  onAction,
  actionText,
}: AlertProps) => {
  return (
    <div className="alert">
      <div>
        <AlertIcon />
        <p className="alert-message">{message}</p>
      </div>
      {actionText && onAction && (
        <button type="button" className="btn btn-link" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default Alert;
