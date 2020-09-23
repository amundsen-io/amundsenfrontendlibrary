// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import globalState from 'fixtures/globalState';
import ColumnList, { ColumnListProps } from '.';
import ColumnType from './ColumnType';
import { EMPTY_MESSAGE } from './constants';

import TestDataBuilder from './testDataBuilder';

const dataBuilder = new TestDataBuilder();
const middlewares = [];
const mockStore = configureStore(middlewares);

const setup = (propOverrides?: Partial<ColumnListProps>) => {
  const props = {
    editText: 'Click to edit description in the data source site',
    editUrl: 'https://test.datasource.site/table',
    database: 'testDatabase',
    columns: [],
    openRequestDescriptionDialog: jest.fn(),
    ...propOverrides,
  };
  // Update state
  const testState = globalState;
  testState.tableMetadata.tableData.columns = props.columns;

  const wrapper = mount<ColumnListProps>(
    <Provider store={mockStore(testState)}>
      <ColumnList {...props} />
    </Provider>
  );

  return { props, wrapper };
};

const SIMPLE_COLUMNS_STATS = [
  {
    col_type: 'string',
    description: null,
    is_editable: true,
    name: 'simple_column_name_string',
    sort_order: 0,
    stats: [
      {
        end_epoch: 1600473600,
        start_epoch: 1597881600,
        stat_type: 'column_usage',
        stat_val: '123',
      },
    ],
  },
  {
    col_type: 'int',
    description: null,
    is_editable: true,
    name: 'simple_column_name_int',
    sort_order: 1,
    stats: [
      {
        end_epoch: 1600473600,
        start_epoch: 1597881600,
        stat_type: 'column_usage',
        stat_val: '456',
      },
    ],
  },
  {
    col_type: 'bigint',
    description: null,
    is_editable: true,
    name: 'simple_column_name_bigint',
    sort_order: 2,
    stats: [
      {
        end_epoch: 1600473600,
        start_epoch: 1597881600,
        stat_type: 'column_usage',
        stat_val: '789',
      },
    ],
  },
  {
    col_type: 'timestamp',
    description: null,
    is_editable: true,
    name: 'simple_column_name_timestamp',
    sort_order: 8,
    stats: [
      {
        end_epoch: 1600473600,
        start_epoch: 1597881600,
        stat_type: 'column_usage',
        stat_val: '1011',
      },
    ],
  },
];
const COMPLEX_TYPE_COLUMNS = [
  {
    col_type:
      'struct<trigger_event:string,backfill:boolean,graphql_version:string>',
    description: null,
    is_editable: true,
    name: 'complex_column_name_2',
    sort_order: 1,
    stats: [
      {
        end_epoch: 1600473600,
        start_epoch: 1597881600,
        stat_type: 'column_usage',
        stat_val: '111',
      },
    ],
  },
  {
    col_type: 'struct<code:string,timezone:string>',
    description: null,
    is_editable: true,
    name: 'complex_column_name_3',
    sort_order: 2,
    stats: [
      {
        end_epoch: 1600473600,
        start_epoch: 1597881600,
        stat_type: 'column_usage',
        stat_val: '222',
      },
    ],
  },
  {
    col_type:
      'struct<route_id:string,shift:struct<shift_id:string,started_at:timestamp,ended_at:timestamp>>',
    description: null,
    is_editable: true,
    name: 'complex_column_name_4',
    sort_order: 3,
    stats: [
      {
        end_epoch: 1600473600,
        start_epoch: 1597881600,
        stat_type: 'column_usage',
        stat_val: '333',
      },
    ],
  },
];
const COMPLEX_TYPE_COLUMNS_NO_STATS = [
  {
    col_type:
      'struct<event_id:string,occurred_at:timestamp,sample_rate:double,__metadata__:struct<flattened:boolean,sending_service:string,streamcheck_selected_at:timestamp,is_priority:boolean,ingest_library_version:string,requires_field_values_as_strings:boolean,aic_time:bigint,fanner_time:bigint,send_to_realtime:boolean,origin_service:string,complex_persistence:boolean>,__debug_metadata__:struct<__is_empty_struct_set__:boolean>,enrichments:struct<is_simulated_ride:boolean>,logged_at:timestamp,source_pipeline:string,reporter_ip_address:string,reporter_hostname:string,http_request_id:string,event_name:string>',
    description: null,
    is_editable: true,
    name: 'complex_column_name_1',
    sort_order: 0,
    stats: [],
  },
  {
    col_type:
      'struct<platform:string,device:string,app_name:string,app_version:string,platform_version:string>',
    description: null,
    is_editable: true,
    name: 'complex_column_name_2',
    sort_order: 28,
    stats: [],
  },
];

describe('ColumnList', () => {
  describe('render', () => {
    it('renders without issues', () => {
      expect(() => {
        setup();
      }).not.toThrow();
    });

    describe('when empty columns are passed', () => {
      const { columns } = dataBuilder.withEmptyColumns().build();

      it('should render the custom empty messagee', () => {
        const { wrapper } = setup({ columns });
        const expected = EMPTY_MESSAGE;

        const actual = wrapper
          .find('.table-detail-table .ams-empty-message-cell')
          .text();
        expect(actual).toEqual(expected);
      });
    });

    describe('when simple type columns are passed', () => {
      const { columns } = dataBuilder.build();

      it('should render the rows', () => {
        const { wrapper } = setup({ columns });
        const expected = columns.length;
        const actual = wrapper.find('.table-detail-table .ams-table-row')
          .length;

        expect(actual).toEqual(expected);
      });

      it('should render the usage column', () => {
        const { wrapper } = setup({ columns });
        const expected = columns.length;
        const actual = wrapper.find('.table-detail-table .usage-value').length;

        expect(actual).toEqual(expected);
      });
    });

    describe('when complex type columns are passed', () => {
      const { columns } = dataBuilder.withAllComplexColumns().build();

      it('should render the rows', () => {
        const { wrapper } = setup({ columns });
        const expected = columns.length;
        const actual = wrapper.find('.table-detail-table .ams-table-row')
          .length;

        expect(actual).toEqual(expected);
      });

      it('should render ColumnType components', () => {
        const { wrapper } = setup({ columns });
        const expected = columns.length;
        const actual = wrapper.find(ColumnType).length;

        expect(actual).toEqual(expected);
      });
    });

    describe('when columns with no usage data are passed', () => {
      const { columns } = dataBuilder.withComplexColumnsNoStats().build();

      it('should render the rows', () => {
        const { wrapper } = setup({ columns });
        const expected = columns.length;
        const actual = wrapper.find('.table-detail-table .ams-table-row')
          .length;

        expect(actual).toEqual(expected);
      });

      it('should not render the usage column', () => {
        const { wrapper } = setup({ columns });
        const expected = 0;
        const actual = wrapper.find('.table-detail-table .usage-value').length;

        expect(actual).toEqual(expected);
      });
    });

    describe('when columns with one usage data entry are passed', () => {
      const { columns } = dataBuilder.withComplexColumnsOneStat().build();

      it('should render the usage column', () => {
        const { wrapper } = setup({ columns });
        const expected = columns.length;
        const actual = wrapper.find('.table-detail-table .usage-value').length;
        console.log(wrapper.debug());
        expect(actual).toEqual(expected);
      });
    });
  });
});
