import * as React from 'react';
import { shallow } from 'enzyme';
import ExploreButton from 'components/TableDetail/ExploreButton';
import { TableMetadata } from 'interfaces/TableMetadata';
import { logClick } from 'ducks/utilMethods';

jest.mock('config/config', () => (
  {
    default: {
      tableProfile: {
        isExploreEnabled: true,
        exploreUrlGenerator: (database: string, cluster: string, schema: string, table: string, partitionKey?: string, partitionValue?: string) =>
          `https://DEFAULT_EXPLORE_URL?schema=${schema}&cluster=${cluster}&db=${database}&table=${table}`
      }
    }
  }
));
import AppConfig from 'config/config';

describe('ExploreButton', () => {
  const setup = (tableDataOverrides?: Partial<TableMetadata>) => {
    const props = {
      tableData: {
        badges: [],
        cluster: 'cluster',
        columns: [],
        database: 'database',
        is_editable: false,
        is_view: false,
        key: '',
        schema: 'schema',
        table_name: 'table_name',
        table_description: '',
        table_writer: { application_url: '', description: '', id: '', name: '' },
        partition: { is_partitioned: true },
        table_readers: [],
        source: { source: '', source_type: '' },
        watermarks: [],
        ...tableDataOverrides,
      },
    };
    const wrapper = shallow<ExploreButton>(<ExploreButton {...props } />)
    return { props, wrapper };
  };

  describe('generateUrl', () => {
    const { props, wrapper } = setup();
    const urlGeneratorSpy = jest.spyOn(AppConfig.tableProfile, "exploreUrlGenerator");

    it('calls url generator with the partition value and key, if partitioned', () => {
      urlGeneratorSpy.mockClear();
      const tableData = {
        ...props.tableData,
        partition: {
          is_partitioned: true,
          key: 'partition_key',
          value: 'partition_value',
        },
      };
      const partition = tableData.partition;
      wrapper.instance().generateUrl(tableData);
      expect(urlGeneratorSpy).toHaveBeenCalledWith(
        tableData.database,
        tableData.cluster,
        tableData.schema,
        tableData.table_name,
        partition.key,
        partition.value);
    });


    it('calls url generator with no partition value and key, if not partitioned', () => {
      urlGeneratorSpy.mockClear();
      const tableData = {
        ...props.tableData,
        partition: {
          is_partitioned: false,
        },
      };
      wrapper.instance().generateUrl(tableData);
      expect(urlGeneratorSpy).toHaveBeenCalledWith(
        tableData.database,
        tableData.cluster,
        tableData.schema,
        tableData.table_name);
    });
  });


  describe('render', () => {
    beforeEach(() => {
      AppConfig.tableProfile.isExploreEnabled = true;
    });

    it('returns null if explore is not enabled', () => {
      AppConfig.tableProfile.isExploreEnabled = false;
      const { props, wrapper } = setup();
      expect(wrapper.instance().render()).toBeNull();
    });

    it('returns null if the generated url is empty', () => {
      const { props, wrapper } = setup();
      const generateUrlSpy = jest.spyOn(AppConfig.tableProfile, "exploreUrlGenerator")
      generateUrlSpy.mockImplementationOnce(() => '');
      expect(wrapper.instance().render()).toBeNull();
    });

    it('renders a link to the explore URL', () => {
      const { props, wrapper } = setup();
      const url = wrapper.instance().generateUrl(props.tableData);
      expect(wrapper.find('a').props()).toMatchObject({
        href: url,
        target: "_blank",
        id: "explore-sql",
        onClick: logClick,
      });
    });
  });
});
