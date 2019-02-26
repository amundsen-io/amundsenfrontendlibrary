import * as React from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

interface FlagProps {
  text: string;
  style?: string;
}

const Flag: React.SFC<FlagProps> = ({ text, style }) => {
  return (
    <span className={`flag label ${style}`}>{text.toUpperCase()}</span>
  );
};

Flag.defaultProps = {
  text: '',
  style: 'label-default',
};

export default Flag;
