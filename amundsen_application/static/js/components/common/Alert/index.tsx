// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import AlertIcon from './AlertIcon';

import './styles.scss';

export interface AlertProps {
  message: string | React.ReactNode;
  actionText?: string;
  actionHref?: string;
  onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Alert: React.FC<AlertProps> = ({
  message,
  onAction,
  actionText,
  actionHref,
}: AlertProps) => {
  return (
    <div className="alert">
      <AlertIcon />
      <p className="alert-message">{message}</p>
      {actionText && onAction && (
        <button type="button" className="btn btn-link" onClick={onAction}>
          {actionText}
        </button>
      )}
      {actionText && actionHref && (
        <a className="action-link" href={actionHref}>
          {actionText}
        </a>
      )}
    </div>
  );
};

export default Alert;
