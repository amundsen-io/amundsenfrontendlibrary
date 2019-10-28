import * as React from 'react';
import * as Avatar from 'react-avatar';

import { Link } from 'react-router-dom';
import { logClick } from 'ducks/utilMethods';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

export interface AvatarLabelProps {
  label?: string;
  src?: string;
  link?: string;
  target?: string;
}

const AvatarLabel: React.SFC<AvatarLabelProps> = ({ label, src, link, target }) => {
  return (
    <div className='avatar-label-component'>
      <div id='component-avatar' className='component-avatar'>
        <Link
          to={ link }
          target={ target }
          className="avatar-overlap"
          id="frequent-users"
          onClick={logClick}
        >
          <Avatar name={label} src={src} size={25} round={true} />
        </Link>
      </div>
      <label id='component-label' className='component-label'>{label}</label>
    </div>
  );
};

AvatarLabel.defaultProps = {
  label: '',
  src: '',
  link: '',
  target: ''
};

export default AvatarLabel;
