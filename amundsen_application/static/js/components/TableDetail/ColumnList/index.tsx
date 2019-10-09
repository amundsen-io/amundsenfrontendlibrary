import * as React from 'react';
import DetailListItem from '../ColumnListItem';

import { TableColumn } from 'interfaces';

import "./styles.scss";


interface DetailListProps {
  columns?: TableColumn[];
}

const DetailList: React.SFC<DetailListProps> = ({ columns }) => {
  if (columns.length < 1) {
    return (<div />);
    // ToDo: return No Results Message
  }

  const columnList = columns.map((entry, index) =>
    <DetailListItem
      key={`column:${index}`}
      data={ entry }
      index={ index }
    />);

  return (
    <ul className="column-list list-group">
      { columnList }
    </ul>
  );
};

DetailList.defaultProps = {
  columns: [] as TableColumn[],
};

export default DetailList;
