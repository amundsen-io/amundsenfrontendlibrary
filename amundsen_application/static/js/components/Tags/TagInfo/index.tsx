import * as React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '../types';
import { logClick } from '../../../ducks/utilMethods';

import './styles.scss';

interface TagInfoProps {
  data: Tag;
  compact?: boolean;
  location: string;
}

class TagInfo extends React.Component<TagInfoProps, {}> {
  static defaultProps = {
    compact: true
  };

  constructor(props) {
    super(props);
  }

  render() {
    const name = this.props.data.tag_name;
    const searchUrl = `/search?searchTerm=tag:${name}`;

    return (
      <Link
        id={ `tag::${name}` } role="button" to={ searchUrl }
        className={"btn tag-button" + (this.props.compact ? " compact" : "")}
        onClick={(e) => logClick(e, { target_type: 'tag', label: name, })}
      >
        <span className="tag-name">{ name }</span>
        {
          !this.props.compact &&
            <span className="tag-count">{ this.props.data.tag_count }</span>
        }
      </Link>
    );
  }
}

export default TagInfo;
