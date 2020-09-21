// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

import { OpenRequestAction } from 'ducks/notification/types';

import { notificationsEnabled } from 'config/config-utils';
import { TableColumn, RequestMetadataType } from 'interfaces';

import Table, {
  TableColumn as ReusableTableColumn,
} from 'components/common/Table';
import ColumnListItem from '../ColumnListItem';

import './styles.scss';

const MORE_BUTTON_TEXT = 'More options';
const REQUEST_DESCRIPTION_TEXT = 'Request Column Description';
const EMPTY_MESSAGE = 'There are no available columns for this table';

interface ColumnListProps {
  columns?: TableColumn[];
  openRequestDescriptionDialog: (
    requestMetadataType: RequestMetadataType,
    columnName: string
  ) => OpenRequestAction;
  database: string;
  editText?: string;
  editUrl?: string;
}

type ContentType = {
  title: string;
  description: string;
};

const ColumnList: React.FC<ColumnListProps> = ({
  columns,
  database,
  editText,
  editUrl,
  openRequestDescriptionDialog,
}: ColumnListProps) => {
  if (columns.length < 1) {
    return <div />;
    // ToDo: return No Results Message
  }

  const columnList = columns.map((entry, index) => (
    <ColumnListItem
      openRequestDescriptionDialog={openRequestDescriptionDialog}
      key={`column:${index}`}
      data={entry}
      database={database}
      index={index}
      editText={editText}
      editUrl={editUrl}
    />
  ));

  const formattedData = columns.map((item) => {
    return {
      content: {
        title: item.name,
        description: item.description,
      },
      col_type: item.col_type,
      usage: item.stats[0].stat_val,
      action: item.name,
    };
  });

  let formattedColumns: ReusableTableColumn[] = [
    {
      title: 'Column',
      field: 'content',
      component: ({ title, description }: ContentType) => (
        <>
          <div className="column-name">{title}</div>
          <div className="column-desc body-3 truncated">{description}</div>
        </>
      ),
    },
    {
      title: 'Type',
      field: 'col_type',
      component: (type) => <p className="resource-type">{type}</p>,
    },
    {
      title: 'Usage',
      field: 'usage',
      horAlign: 'right',
      component: (usage) => <p className="resource-type">{usage}</p>,
    },
  ];

  if (notificationsEnabled()) {
    formattedColumns = [
      ...formattedColumns,
      {
        title: '',
        field: 'action',
        width: 80,
        horAlign: 'right',
        component: (name, index) => (
          <div className="actions">
            <Dropdown
              id={`detail-list-item-dropdown:${index}`}
              pullRight
              className="column-dropdown"
            >
              <Dropdown.Toggle noCaret>
                <span className="sr-only">{MORE_BUTTON_TEXT}</span>
                <img className="icon icon-more" alt="" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <MenuItem
                  onClick={openRequestDescriptionDialog.bind(
                    null,
                    RequestMetadataType.COLUMN_DESCRIPTION,
                    name
                  )}
                >
                  {REQUEST_DESCRIPTION_TEXT}
                </MenuItem>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        ),
      },
    ];
  }

  return (
    <>
      <Table
        columns={formattedColumns}
        data={formattedData}
        options={{ rowHeight: 72, emptyMessage: EMPTY_MESSAGE }}
      />
      <ul className="column-list list-group">{columnList}</ul>
    </>
  );
};

ColumnList.defaultProps = {
  columns: [] as TableColumn[],
  editText: '',
  editUrl: '',
};

export default ColumnList;
