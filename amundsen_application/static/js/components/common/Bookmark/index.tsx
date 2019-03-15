import * as React from 'react';



import './styles.scss'

class Bookmark extends React.Component<{}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="bookmark">
        <img className="icon icon-bookmark" />
      </div>
    )
  }
}

export default Bookmark;
