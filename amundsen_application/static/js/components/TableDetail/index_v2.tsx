import * as React from 'react';

import './styles_v2';


class TableDetail_v2 extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="table-detail-2">
        <div className="header-layout-1"></div>
        <div className="split-column-layout-1">
          <div className="left-panel">
            <div className="banner"></div>
            <div className="split-column-layout-2">
              <div className="left-panel"></div>
              <div className="right-panel"></div>
            </div>
          </div>
          <div className="right-panel">
            <div className="left-panel"></div>
            <div className="right-panel"></div>
          </div>
        </div>
      </div>
    );
  }
}


export default TableDetail_v2;
