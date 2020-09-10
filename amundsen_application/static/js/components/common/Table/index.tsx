// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import ShimmeringResourceLoader from '../ShimmeringResourceLoader';

import './styles.scss';

type TextAlignmentValues = 'left' | 'right' | 'center';

export interface TableColumn {
  title: string;
  field: string;
  horAlign?: TextAlignmentValues;
  component?: (value: any, index: number) => React.ReactNode;
  // className?: string;
  // width?: number;
  // sortable?: bool (false)
}

export interface TableOptions {
  tableClassName?: string;
  isLoading?: boolean;
  numLoadingBlocks?: number;
  rowHeight?: number;
  expandRow?: (rowValue: any, index: number) => React.ReactNode;
}

export interface TableProps {
  columns: TableColumn[];
  data: [];
  options?: TableOptions;
}

const DEFAULT_EMPTY_MESSAGE = 'No Results';
const EXPAND_ROW_TEXT = 'Expand Row';
const DEFAULT_LOADING_ITEMS = 3;
const DEFAULT_ROW_HEIGHT = 30;
const DEFAULT_TEXT_ALIGNMENT = 'left';

type RowStyles = {
  height: string;
};

type EmptyRowProps = {
  colspan: number;
  rowStyles: RowStyles;
};

const EmptyRow: React.FC<EmptyRowProps> = ({
  colspan,
  rowStyles,
}: EmptyRowProps) => (
  <tr className="ams-table-row" style={rowStyles}>
    <td className="ams-empty-message-cell" colSpan={colspan}>
      {DEFAULT_EMPTY_MESSAGE}
    </td>
  </tr>
);

const ShimmeringHeader: React.FC = () => (
  <tr>
    <th className="ams-table-heading-loading-cell">
      <div className="ams-table-shimmer-block" />
    </th>
  </tr>
);

type ShimmeringBodyProps = {
  numLoadingBlocks: number;
};

const ShimmeringBody: React.FC<ShimmeringBodyProps> = ({
  numLoadingBlocks,
}: ShimmeringBodyProps) => (
  <tr className="ams-table-row">
    <td className="ams-table-body-loading-cell">
      <ShimmeringResourceLoader numItems={numLoadingBlocks} />
    </td>
  </tr>
);

type ExpandingCellProps = {
  index: number;
  expandedRows: RowIndex[];
  onClick: (index) => void;
};
const ExpandingCell: React.FC<ExpandingCellProps> = ({
  index,
  onClick,
  expandedRows,
}: ExpandingCellProps) => (
  <td
    className="ams-table-cell ams-table-expanding-cell"
    key={`expandingIndex:${index}`}
  >
    <button
      type="button"
      className="ams-table-expanding-button"
      onClick={() => {
        const newExpandedRows = expandedRows.includes(index)
          ? expandedRows.filter((i) => i !== index)
          : [...expandedRows, index];

        onClick(newExpandedRows);
      }}
    >
      <span className="sr-only">{EXPAND_ROW_TEXT}</span>
    </button>
  </td>
);

type RowIndex = number;

const Table: React.FC<TableProps> = ({
  data,
  columns,
  options = {},
}: TableProps) => {
  const {
    tableClassName = '',
    isLoading = false,
    numLoadingBlocks = DEFAULT_LOADING_ITEMS,
    rowHeight = DEFAULT_ROW_HEIGHT,
    expandRow = null,
  } = options;
  const fields = columns.map(({ field }) => field);
  const rowStyles = { height: `${rowHeight}px` };
  const isExpandable: boolean = !!expandRow;
  const [expandedRows, setExpandedRows] = React.useState<RowIndex[]>([]);

  let body: React.ReactNode = (
    <EmptyRow colspan={fields.length} rowStyles={rowStyles} />
  );

  if (data.length) {
    body = data.map((item, index) => {
      return (
        <React.Fragment key={`index:${index}`}>
          <tr
            className="ams-table-row"
            key={`index:${index}`}
            style={rowStyles}
          >
            <>
              {isExpandable ? (
                <ExpandingCell
                  index={index}
                  expandedRows={expandedRows}
                  onClick={setExpandedRows}
                />
              ) : null}
              {Object.entries(item)
                .filter(([key]) => fields.includes(key))
                .map(([key, value], index) => {
                  const columnInfo = columns.find(({ field }) => field === key);
                  const horAlign = columnInfo
                    ? columnInfo.horAlign || DEFAULT_TEXT_ALIGNMENT
                    : DEFAULT_TEXT_ALIGNMENT;
                  const cellStyle = {
                    textAlign: `${horAlign}` as TextAlignmentValues,
                  };
                  // TODO: Improve the typing of this
                  let cellContent: React.ReactNode | typeof value = value;
                  if (columnInfo && columnInfo.component) {
                    cellContent = columnInfo.component(value, index);
                  }

                  return (
                    <td
                      className="ams-table-cell"
                      key={`index:${index}`}
                      style={cellStyle}
                    >
                      {cellContent}
                    </td>
                  );
                })}
            </>
          </tr>
          {isExpandable ? (
            <tr
              className={`ams-table-expanded-row ${
                expandedRows.includes(index) ? 'is-expanded' : ''
              }`}
              key={`expandedIndex:${index}`}
            >
              <td className="ams-table-cell" colSpan={fields.length + 1}>
                {expandRow(item, index)}
              </td>
            </tr>
          ) : null}
        </React.Fragment>
      );
    });
  }

  let header: React.ReactNode = (
    <tr>
      {isExpandable && (
        <th key="emptyTableHeading" className="ams-table-heading-cell" />
      )}
      {columns.map(({ title, horAlign = DEFAULT_TEXT_ALIGNMENT }, index) => {
        const cellStyle = {
          textAlign: `${horAlign}` as TextAlignmentValues,
        };

        return (
          <th
            className="ams-table-heading-cell"
            key={`index:${index}`}
            style={cellStyle}
          >
            {title}
          </th>
        );
      })}
    </tr>
  );

  if (isLoading) {
    header = <ShimmeringHeader />;
    body = <ShimmeringBody numLoadingBlocks={numLoadingBlocks} />;
  }

  return (
    <table className={`ams-table ${tableClassName || ''}`}>
      <thead className="ams-table-header">{header}</thead>
      <tbody className="ams-table-body">{body}</tbody>
    </table>
  );
};

export default Table;
