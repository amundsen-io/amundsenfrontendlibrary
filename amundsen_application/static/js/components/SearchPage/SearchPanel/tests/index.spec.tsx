import * as React from 'react';

import { shallow } from 'enzyme';
import { SearchPanel, SearchPanelProps, mapStateToProps} from '../';
import globalState from 'fixtures/globalState';
import { ResourceType } from 'interfaces/Resources';
import { TABLE_RESOURCE_TITLE, USER_RESOURCE_TITLE } from 'components/SearchPage/constants';

import AppConfig from 'config/config';

describe('SearchPanel', () => {
  const setup = (propOverrides?: Partial<SearchPanelProps>) => {
    const props = {
      selectedTab: ResourceType.table,
      tables: globalState.search.tables,
      users: globalState.search.users,
      dashboards: globalState.search.dashboards,
      onTabChange: jest.fn(),
      ...propOverrides
    };
    const wrapper = shallow<SearchPanel>(<SearchPanel {...props} />);
    return { props, wrapper };
  };

  describe('onChange', () => {
    // TODO - placeholder as I expect the `onChange` to disappear once we use redux for search state actions
  });

  describe('renderRadioOption', () => {
    // TODO - placeholder as I expect the radio buttons logic to change
  });

  describe('render', () => {
    let props;
    let wrapper;
    let renderRadioOptionSpy;

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
      renderRadioOptionSpy = jest.spyOn(wrapper.instance(), 'renderRadioOption');
    });

    it('renders the table resource option', () => {
      renderRadioOptionSpy.mockClear();
      wrapper.instance().render();
      expect(renderRadioOptionSpy).toHaveBeenCalledWith(ResourceType.table, TABLE_RESOURCE_TITLE, props.tables.total_results);
    });

    it('renders the user resource option when enabled', () => {
      AppConfig.indexUsers.enabled = true;
      renderRadioOptionSpy.mockClear();
      wrapper.instance().render();
      expect(renderRadioOptionSpy).toHaveBeenCalledWith(ResourceType.user, USER_RESOURCE_TITLE, props.users.total_results);
    });

    it('does not render user resource option when disabled', () => {
      AppConfig.indexUsers.enabled = false;
      renderRadioOptionSpy.mockClear();
      wrapper.instance().render();
      expect(renderRadioOptionSpy).not.toHaveBeenCalledWith(ResourceType.user, USER_RESOURCE_TITLE, props.users.total_results);
    });
  });
});

describe('mapStateToProps', () => {
  let result;
  let ownProps;

  beforeAll(() => {
    ownProps = { onTabChange: jest.fn() };
    result = mapStateToProps(globalState, ownProps);
  });

  it('sets selectedTab on the props', () => {
    expect(result.selectedTab).toEqual(globalState.search.selectedTab);
  });

  it('sets tables on the props', () => {
    expect(result.tables).toEqual(globalState.search.tables);
  });

  it('sets users on the props', () => {
    expect(result.users).toEqual(globalState.search.users);
  });

  it('sets dashboards on the props', () => {
    expect(result.dashboards).toEqual(globalState.search.dashboards);
  });

  it('sets onTabChange on the props', () => {
    expect(result.onTabChange).toEqual(ownProps.onTabChange);
  });
});
