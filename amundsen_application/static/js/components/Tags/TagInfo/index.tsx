import * as React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from '../types';
import { log } from '../../../ducks/utilMethods';


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

    const analyticsId = `tag::${name}`;

    if (this.props.compact) {
      return (
        <Link
          role="button" to={searchUrl} className="btn tag-button compact"
          onClick={()=> {log('click', analyticsId, 'tag', name, this.props.location)}}
        >
          { name }
        </Link>
      );
    }

    return (
      <Link
        role="button" to={searchUrl} className="btn tag-button"
        onClick={()=> {log('click', analyticsId, 'tag', name, this.props.location)}}
      >
        <span className="tag-name">{ name }</span>
        <span className="tag-count">{this.props.data.tag_count}</span>
      </Link>
    );
  }
}

export default TagInfo;
