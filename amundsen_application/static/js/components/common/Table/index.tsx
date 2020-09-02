import * as React from 'react';

import './styles.scss';

export interface TableColumn {
  title: string;
  field: string;
  // className?: string;
  // horAlign?: 'left' | 'right' | 'center';
  // width?: number;
  // sortable?: bool (false)
  // data?: () => React.ReactNode ((row,index) => <div>{index}</div>)
  // actions?: Action[]
}

export interface TableOptions {
  tableClassName?: string;
}

export interface TableProps {
  columns: TableColumn[];
  data: [];
  options?: TableOptions;
}

const EMPTY_MESSAGE = 'No Results';

type EmptyRowProps = {
  colspan: number;
};

const EmptyRow: React.FC<EmptyRowProps> = ({ colspan }: EmptyRowProps) => (
  <tr className="ams-table-row">
    <td className="ams-empty-message-cell" colSpan={colspan}>
      {EMPTY_MESSAGE}
    </td>
  </tr>
);

const Table: React.FC<TableProps> = ({
  data,
  columns,
  options = {},
}: TableProps) => {
  const { tableClassName = '' } = options;
  const fields = columns.map(({ field }) => field);

  let body: React.ReactNode = <EmptyRow colspan={fields.length} />;

  if (data.length) {
    body = data.map((item, index) => {
      return (
        <tr className="ams-table-row" key={`index:${index}`}>
          {Object.entries(item)
            .filter(([key]) => fields.includes(key))
            .map(([, value], index) => (
              <td className="ams-table-cell" key={`index:${index}`}>
                {value}
              </td>
            ))}
        </tr>
      );
    });
  }

  const header = (
    <tr>
      {columns.map(({ title }, index) => {
        return (
          <th className="ams-table-heading-cell" key={`index:${index}`}>
            {title}
          </th>
        );
      })}
    </tr>
  );

  return (
    <table className={`ams-table ${tableClassName || ''}`}>
      <thead className="ams-table-header">{header}</thead>
      <tbody className="ams-table-body">{body}</tbody>
    </table>
  );
};

export default Table;
