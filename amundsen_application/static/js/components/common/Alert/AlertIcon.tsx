import * as React from 'react';

const STROKE_COLOR = '#b8072c'; // $red70
const SIZE = 16;

const AlertIcon: React.FC = () => {
  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox="0 0 24 24"
      fill="none"
      stroke={STROKE_COLOR}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="alert-triangle-svg-icon"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h0" />
    </svg>
  );
};

export default AlertIcon;
