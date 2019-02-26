import * as React from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

interface FlagProps {
  text: string;
}

const Flag: React.SFC<FlagProps> = ({ text }) => {

  return (
    <div className='flag-component'>
      <label>{text.toUpperCase()}</label>
    </div>
  );

};

Flag.defaultProps = {
  text: '',
};

export default Flag;
