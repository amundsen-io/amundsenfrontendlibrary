import * as React from 'react';

import './styles_v2';


class TableDetail_v2 extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="resource-detail-layout table-detail-2">
        <header className="resource-header"></header>
        <main className="column-layout-1">
          <section className="left-panel">
            <section className="banner"></section>
            <section className="column-layout-2">
              <section className="left-panel"></section>
              <section className="right-panel"></section>
            </section>
          </section>
          <section className="right-panel"></section>
        </main>
      </div>
    );
  }
}


export default TableDetail_v2;
