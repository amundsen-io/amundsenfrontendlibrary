import * as React from 'react';
import * as DocumentTitle from 'react-document-title';

import { shallow } from 'enzyme';

import { ResourceType } from 'components/common/ResourceListItem/types';
import { SearchPage, SearchPageProps, mapDispatchToProps, mapStateToProps } from '../';

import InfoButton from 'components/common/InfoButton';
import TabsComponent from 'components/common/Tabs';

import SearchBar from '../SearchBar';
import SearchList from '../SearchList';

import globalState from 'fixtures/globalState';

describe('SearchPage', () => {
  //const eventMock = { preventDefault: jest.fn(), target: { value: 'Data Resources' } };
  const setStateSpy = jest.spyOn(SearchPage.prototype, 'setState');
  const setup = (propOverrides?: Partial<SearchPageProps>) => {
    const props: SearchPageProps = {
      searchTerm: globalState.search.search_term,
      popularTables: globalState.popularTables,
      dashboards: globalState.search.dashboards,
      tables: globalState.search.tables,
      users: globalState.search.users,
      searchAll: jest.fn(),
      searchResource: jest.fn(),
      getPopularTables: jest.fn(),
      ...propOverrides
    };
    const wrapper = shallow<SearchPage>(<SearchPage {...props} />)
    return { props, wrapper };
  };

  describe('constructor', () => {
    it('sets the default selectedTab', () => {
      const { props, wrapper } = setup();
      expect(wrapper.state().selectedTab).toEqual(ResourceType.table);
    });
  });

  describe('componentDidMount', () => {
    it('calls props.getPopularTables', () => {
      const { props, wrapper } = setup();
      wrapper.instance().componentDidMount();
      expect(props.getPopularTables).toHaveBeenCalled();
    });

    /* TODO: I think I need mount
    it('calls getSelectedTabByResourceType with correct value', () => {
      window.history.pushState({}, '', '/search?searchTerm=testName&selectedTab=table&pageIndex=0');
      const { props, wrapper } = setup();
      wrapper.instance().componentDidMount();
      expect(wrapper.instance().getSelectedTabByResourceType).toHaveBeenCalledWith('table');
    });*/

    it('calls setState with correct value', () => {
      window.history.pushState({}, '', '/search?searchTerm=testName&selectedTab=table&pageIndex=0');
      const { props, wrapper } = setup();
      wrapper.instance().componentDidMount();
      const expectedTab = wrapper.instance().getSelectedTabByResourceType(ResourceType.table);
      expect(setStateSpy).toHaveBeenCalledWith({ selectedTab: expectedTab });
    });
    /*
    TODO: Test this logic
    if (searchTerm && searchTerm.length > 0) {
      const index = pageIndex || 0;
      this.props.searchAll(searchTerm, this.createSearchOptions(index, currentTab));
      // Update the page URL with validated parameters.
      this.updatePageUrl(searchTerm, currentTab, index);
    }
    */
  });

  describe('getSelectedTabByResourceType', () => {
    let props;
    let wrapper;
    beforeAll(() => {
      const result = setup();
      props = result.props;
      wrapper = result.wrapper;
    });

    it('returns given tab if equal to ResourceType.table', () => {
      expect(wrapper.instance().getSelectedTabByResourceType(ResourceType.table)).toEqual(ResourceType.table);
    });

    it('returns given tab if equal to ResourceType.user', () => {
      expect(wrapper.instance().getSelectedTabByResourceType(ResourceType.user)).toEqual(ResourceType.user);
    });

    it('returns state.selectedTab if given equal to ResourceType.dashboard', () => {
      wrapper.setState({ selectedTab: 'user' })
      expect(wrapper.instance().getSelectedTabByResourceType(ResourceType.dashboard)).toEqual('user');
    });

    it('returns state.selectedTab if given equal to ResourceType.dashboard', () => {
      wrapper.setState({ selectedTab: 'table' })
      // @ts-ignore: test for default case
      expect(wrapper.instance().getSelectedTabByResourceType('not valid')).toEqual('table');
    });
  });

  describe('createSearchOptions', () => {
    let props;
    let wrapper;
    beforeAll(() => {
      const result = setup();
      props = result.props;
      wrapper = result.wrapper;
    });

    it('generates correct options if selectedTab === ResourceType.dashboard', () => {
      expect(wrapper.instance().createSearchOptions(5, ResourceType.dashboard)).toMatchObject({
        dashboardIndex: 5,
        userIndex: 0,
        tableIndex: 0,
      });
    });

    it('generates correct options if selectedTab === ResourceType.user', () => {
      expect(wrapper.instance().createSearchOptions(5, ResourceType.user)).toMatchObject({
        dashboardIndex: 0,
        userIndex: 5,
        tableIndex: 0,
      });
    });

    it('generates correct options if selectedTab === ResourceType.table', () => {
      expect(wrapper.instance().createSearchOptions(5, ResourceType.table)).toMatchObject({
        dashboardIndex: 0,
        userIndex: 0,
        tableIndex: 5,
      });
    });
  });

  describe('getPageIndexByResourceType', () => {
    let props;
    let wrapper;
    beforeAll(() => {
      const result = setup({
        dashboards: {...globalState.search.dashboards, page_index: 1},
        tables: {...globalState.search.tables, page_index: 2},
        users: {...globalState.search.users, page_index: 3},
      });
      props = result.props;
      wrapper = result.wrapper;
    });

    it('given ResourceType.dashboard, returns page_index from props for dashboards', () => {
      expect(wrapper.instance().getPageIndexByResourceType(ResourceType.dashboard)).toEqual(props.dashboards.page_index);
    });

    it('given ResourceType.table, returns page_index from props for tables', () => {
      expect(wrapper.instance().getPageIndexByResourceType(ResourceType.table)).toEqual(props.tables.page_index);
    });

    it('given ResourceType.user, returns page_index from props for users', () => {
      expect(wrapper.instance().getPageIndexByResourceType(ResourceType.user)).toEqual(props.users.page_index);
    });

    it('returns 0 if not given a supported ResourceType', () => {
      // @ts-ignore: test for default case
      expect(wrapper.instance().getPageIndexByResourceType('not valid')).toEqual(0);
    });
  });

  describe('onSearchBarSubmit', () => {
    let props;
    let wrapper;
    let searchAllSpy;
    let updatePageUrlSpy;
    beforeAll(() => {
      const result = setup();
      props = result.props;
      wrapper = result.wrapper;
      searchAllSpy = jest.spyOn(props, 'searchAll');
      updatePageUrlSpy = jest.spyOn(wrapper.instance(), 'updatePageUrl');
      wrapper.instance().onSearchBarSubmit('searchTerm');
    });

    it('calls props.searchAll with correct parameters', () => {
      expect(searchAllSpy).toHaveBeenCalledWith('searchTerm');
    });

    it('call updatePageUrl with correct parameters', () => {
      expect(updatePageUrlSpy).toHaveBeenCalledWith('searchTerm', wrapper.state().selectedTab, 0);
    });
  });

  describe('onPaginationChange', () => {
    let props;
    let wrapper;
    let searchResourceSpy;
    let updatePageUrlSpy;
    beforeAll(() => {
      const result = setup();
      props = result.props;
      wrapper = result.wrapper;
      searchResourceSpy = jest.spyOn(props, 'searchResource');
      updatePageUrlSpy = jest.spyOn(wrapper.instance(), 'updatePageUrl');
      wrapper.instance().onPaginationChange(10);
    });

    it('calls props.searchResource with correct parameters', () => {
      expect(searchResourceSpy).toHaveBeenCalledWith(wrapper.state().selectedTab, props.searchTerm, 9);
    });

    it('calls updatePageUrl with correct parameters', () => {
      expect(updatePageUrlSpy).toHaveBeenCalledWith(props.searchTerm, wrapper.state().selectedTab, 9);
    });
  });

  describe('onTabChange', () => {
    let props;
    let wrapper;
    let getSelectedTabByResourceTypeSpy;
    let updatePageUrlSpy;
    let expectedSelectedTab;
    const givenTab = ResourceType.user;
    beforeAll(() => {
      const result = setup();
      props = result.props;
      wrapper = result.wrapper;
      getSelectedTabByResourceTypeSpy = jest.spyOn(wrapper.instance(), 'getSelectedTabByResourceType');
      updatePageUrlSpy = jest.spyOn(wrapper.instance(), 'updatePageUrl');
      wrapper.instance().onTabChange(givenTab);
      expectedSelectedTab = wrapper.instance().getSelectedTabByResourceType(givenTab);
    });

    it('calls getSelectedTabByResourceType with correct parameters', () => {
      expect(getSelectedTabByResourceTypeSpy).toHaveBeenCalledWith(givenTab);
    });

    it('calls setState with correct parameters', () => {
      expect(setStateSpy).toHaveBeenCalledWith({ selectedTab: expectedSelectedTab });
    });

    it('calls updatePageUrl with correct parameters', () => {
      const expectedPageIndex = wrapper.instance().getPageIndexByResourceType(expectedSelectedTab);
      expect(updatePageUrlSpy).toHaveBeenCalledWith(props.searchTerm, expectedSelectedTab, expectedPageIndex);
    });
  });

  describe('updatePageUrl', () => {
    it('pushes correct update to the window state', () => {
      const { props, wrapper } = setup();
      const pageIndex = 2;
      const searchTerm = 'testing';
      const tab = ResourceType.user;
      const expectedPath = `/search?searchTerm=${searchTerm}&selectedTab=${tab}&pageIndex=${pageIndex}`;
      const pushStateSpy = jest.spyOn(window.history, 'pushState');
      wrapper.instance().updatePageUrl(searchTerm, tab, pageIndex);
      expect(pushStateSpy).toHaveBeenCalledWith({}, '', `${window.location.origin}${expectedPath}`);
    });
  });

  /* TODO: Test getTabContent */

  describe('renderPopularTables', () => {
    let content;
    let props;
    let wrapper;
    beforeAll(() => {
      const result = setup({ searchTerm: ''});
      props = result.props;
      wrapper = result.wrapper;
      content = shallow(wrapper.instance().renderPopularTables());
    });
    it('renders correct label for content', () => {
      expect(content.children().at(0).children().at(0).find('label').text()).toEqual('Popular Tables');
    });

    it('renders InfoButton with correct props', () => {
      expect(content.children().at(0).children().at(0).find(InfoButton).props()).toMatchObject({
        infoText: "These are some of the most commonly accessed tables within your organization.",
      });
    });

    it('renders SearchList with correct props', () => {
      expect(content.children().at(0).children().find(SearchList).props()).toMatchObject({
        results: props.popularTables,
        params: {
          source: 'popular_tables',
          paginationStartIndex: 0,
        },
      });
    });
  });

  describe('renderSearchResults', () => {
    it('renders TabsComponent with correct props', () => {
      const { props, wrapper } = setup({ searchTerm: 'test search' });
      const content = shallow(wrapper.instance().renderSearchResults());
      const expectedTabConfig = [
        {
          title: `Tables (${ props.tables.total_results })`,
          key: ResourceType.table,
          content: wrapper.instance().getTabContent(props.tables, 'tables'),
        }
      ]
      expect(content.find(TabsComponent).props()).toMatchObject({
        activeKey: wrapper.state().selectedTab,
        defaultTab: ResourceType.table,
        onSelect: wrapper.instance().onTabChange,
        tabs: expectedTabConfig,
      });
    });
  });

  describe('render', () => {
    describe('DocumentTitle', () => {
      it('renders correct title if there is a search term', () => {
        const { props, wrapper } = setup({ searchTerm: 'test search'});
        /* Note: Why did (wrapper.find(DocumentTitle).props().title throw a TS error in this file only? */
        expect(wrapper.find(DocumentTitle).props()).toMatchObject({
          title: 'test search - Amundsen Search'
        });
      });

      it('does not render DocumentTitle if searchTerm is empty string', () => {
        const { props, wrapper } = setup({ searchTerm: '' });
        expect(wrapper.find(DocumentTitle).exists()).toBeFalsy();
      });
    });

    it('renders SearchBar with correct props', () => {
      const { props, wrapper } = setup();
      expect(wrapper.find(SearchBar).props()).toMatchObject({
        handleValueSubmit: wrapper.instance().onSearchBarSubmit,
        searchTerm: props.searchTerm,
      });
    });

    /* TODO: I think I need mount
    it('calls renderSearchResults is searchTerm is not empty string', () => {
      const { props, wrapper } = setup({ searchTerm: 'test search' });
      const renderSearchResultsSpy = jest.spyOn(SearchPage.prototype, 'renderSearchResults');
      expect(renderSearchResultsSpy).toHaveBeenCalled();
    });

    it('calls renderPopularTables is searchTerm is empty string', () => {
      const { props, wrapper } = setup({ searchTerm: '' });
      const renderPopularTablesSpy = jest.spyOn(SearchPage.prototype, 'renderPopularTables');
      expect(renderPopularTablesSpy).toHaveBeenCalled();
    });
    */
  });
});

describe('mapDispatchToProps', () => {
  let dispatch;
  let result;
  beforeAll(() => {
    dispatch = jest.fn(() => Promise.resolve());
    result = mapDispatchToProps(dispatch);
  });

  it('sets searchAll on the props', () => {
    expect(result.searchAll).toBeInstanceOf(Function);
  });

  it('sets searchResource on the props', () => {
    expect(result.searchResource).toBeInstanceOf(Function);
  });

  it('sets getPopularTables on the props', () => {
    expect(result.getPopularTables).toBeInstanceOf(Function);
  });
});

describe('mapStateToProps', () => {
  let result;
  beforeAll(() => {
    result = mapStateToProps(globalState);
  });

  it('sets searchTerm on the props', () => {
    expect(result.searchTerm).toEqual(globalState.search.search_term);
  });

  it('sets popularTables on the props', () => {
    expect(result.popularTables).toEqual(globalState.popularTables);
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
});
