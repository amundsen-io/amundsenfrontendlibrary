import * as React from 'react';
import { shallow } from 'enzyme';

import { mapStateToProps, ResourceSelector, ResourceSelectorProps} from '../';
import { TABLE_RESOURCE_TITLE, USER_RESOURCE_TITLE } from 'components/SearchPage/constants';

import AppConfig from 'config/config';
import globalState from 'fixtures/globalState';
import { ResourceType } from 'interfaces/Resources';


describe('ResourceSelector', () => {
  const setup = (propOverrides?: Partial<ResourceSelectorProps>) => {
    const props = {
      selectedTab: ResourceType.table,
      tables: globalState.search.tables,
      users: globalState.search.users,
      dashboards: globalState.search.dashboards,
      onChange: jest.fn(),
      ...propOverrides
    };
    const wrapper = shallow<ResourceSelector>(<ResourceSelector {...props} />);
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

    let tableOptionConfig;
    let userOptionConfig;
    let renderRadioOptionSpy;

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;

      tableOptionConfig = {
        type: ResourceType.table,
        label: TABLE_RESOURCE_TITLE,
        count: props.tables.total_results,
      };
      userOptionConfig = {
        type: ResourceType.user,
        label: USER_RESOURCE_TITLE,
        count: props.users.total_results,
      };

      renderRadioOptionSpy = jest.spyOn(wrapper.instance(), 'renderRadioOption');
    });

    it('renders the table resource option', () => {
      renderRadioOptionSpy.mockClear();
      wrapper.instance().render();
      expect(renderRadioOptionSpy).toHaveBeenCalledWith(tableOptionConfig);
    });

    it('renders the user resource option when enabled', () => {
      AppConfig.indexUsers.enabled = true;
      renderRadioOptionSpy.mockClear();
      wrapper.instance().render();
      expect(renderRadioOptionSpy).toHaveBeenCalledWith(userOptionConfig);
    });

    it('does not render user resource option when disabled', () => {
      AppConfig.indexUsers.enabled = false;
      renderRadioOptionSpy.mockClear();
      wrapper.instance().render();
      expect(renderRadioOptionSpy).not.toHaveBeenCalledWith(userOptionConfig);
    });
  })
});

describe('mapStateToProps', () => {
  let result;
  let ownProps;

  beforeAll(() => {
    ownProps = { onChange: jest.fn() };
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

  it('sets onChange on the props', () => {
    expect(result.onChange).toEqual(ownProps.onChange);
  });
});
