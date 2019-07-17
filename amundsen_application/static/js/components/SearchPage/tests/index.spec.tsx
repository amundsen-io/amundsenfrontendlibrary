import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import * as History from 'history';

import { shallow } from 'enzyme';

import AppConfig from 'config/config';
import { ResourceType } from 'interfaces';
import { mapDispatchToProps, mapStateToProps, SearchPage, SearchPageProps } from '../';
import {
  DOCUMENT_TITLE_SUFFIX,
  PAGE_INDEX_ERROR_MESSAGE,
  RESULTS_PER_PAGE,
  SEARCH_ERROR_MESSAGE_INFIX,
  SEARCH_ERROR_MESSAGE_PREFIX,
  SEARCH_ERROR_MESSAGE_SUFFIX,
  SEARCH_INFO_TEXT,
  SEARCH_SOURCE_NAME,
  TABLE_RESOURCE_TITLE,
} from '../constants';

import InfoButton from 'components/common/InfoButton';
import TabsComponent from 'components/common/Tabs';

import SearchBar from '../SearchBar';

import LoadingSpinner from 'components/common/LoadingSpinner';

import ResourceList from 'components/common/ResourceList';
import globalState from 'fixtures/globalState';
import { searchAll, updateSearchTab } from 'ducks/search/reducer';
import { getMockRouterProps } from 'fixtures/mockRouter';

describe('SearchPage', () => {
  const setStateSpy = jest.spyOn(SearchPage.prototype, 'setState');
  const setup = (propOverrides?: Partial<SearchPageProps>, location?: Partial<History.Location>) => {
    const routerProps = getMockRouterProps<any>(null, location);
    const props: SearchPageProps = {
      searchTerm: globalState.search.search_term,
      selectedTab: ResourceType.table,
      isLoading: false,
      dashboards: globalState.search.dashboards,
      tables: globalState.search.tables,
      users: globalState.search.users,
      searchAll: jest.fn(),
      searchResource: jest.fn(),
      updateSearchTab: jest.fn(),
      ...routerProps,
      ...propOverrides,
    };
    const wrapper = shallow<SearchPage>(<SearchPage {...props} />)
    return { props, wrapper };
  };

  describe('componentDidMount', () => {
    let props;
    let wrapper;

    let getGlobalStateParamsSpy;
    let shouldUpdateFromGlobalStateSpy;
    let shouldUpdateFromUrlParamsSpy;
    let getUrlParamsSpy;
    let updatePageUrlSpy;
    let searchAllSpy;


    beforeAll(() => {
      const setupResult = setup(null, {
        search: '/search?searchTerm=testName&selectedTab=table&pageIndex=1',
      });
      props = setupResult.props;
      wrapper = setupResult.wrapper;

      getUrlParamsSpy = jest.spyOn(wrapper.instance(), 'getUrlParams');
      getGlobalStateParamsSpy = jest.spyOn(wrapper.instance(), 'getGlobalStateParams');

      shouldUpdateFromUrlParamsSpy = jest.spyOn(wrapper.instance(), 'shouldUpdateFromUrlParams');
      shouldUpdateFromGlobalStateSpy = jest.spyOn(wrapper.instance(), 'shouldUpdateFromGlobalState');

      updatePageUrlSpy = jest.spyOn(wrapper.instance(), 'updatePageUrl');
      searchAllSpy = jest.spyOn(props, 'searchAll');
    });

    it('calls getUrlParams and getGlobalStateParams', () => {
      wrapper.instance().componentDidMount();
      expect(getUrlParamsSpy).toHaveBeenCalledWith(props.location.search);
      expect(getGlobalStateParamsSpy).toHaveBeenCalled();
    });

    describe('when rendering from GlobalState', () => {
      beforeAll(() => {
        shouldUpdateFromGlobalStateSpy.mockReset();
        shouldUpdateFromUrlParamsSpy.mockReset();
        shouldUpdateFromGlobalStateSpy.mockImplementationOnce(() => true);
        shouldUpdateFromUrlParamsSpy.mockImplementationOnce(() => false);
        wrapper.instance().componentDidMount();
      });

      it('calls updatePageUrl', () => {
        expect(updatePageUrlSpy).toHaveBeenCalled()
      });

      it('does not call shouldUpdateFromUrlParams', () => {
        expect(shouldUpdateFromUrlParamsSpy).not.toHaveBeenCalled()
      });
    });

    describe('when rendering from URL state', () => {
      beforeAll(() => {
        searchAllSpy.mockReset();
        updatePageUrlSpy.mockReset();
        shouldUpdateFromGlobalStateSpy.mockReset();
        shouldUpdateFromUrlParamsSpy.mockReset();
        shouldUpdateFromGlobalStateSpy.mockImplementationOnce(() => false);
        shouldUpdateFromUrlParamsSpy.mockImplementationOnce(() => true);
        wrapper.instance().componentDidMount();
      });

      it('calls shouldUpdateFromGlobalState', () => {
        expect(searchAllSpy).toHaveBeenCalled()
      });

      it('calls updatePageUrl', () => {
        expect(updatePageUrlSpy).toHaveBeenCalled()
      });
    });
  });

  describe('shouldUpdateFromGlobalState', () => {
    let props;
    let wrapper;

    let mockUrlParams;
    let mockGlobalStateParams;

    let returnValue;

    beforeAll(() => {
      const setupResult = setup(null, {
        search: '/search?searchTerm=testName&selectedTab=table&pageIndex=1',
      });
      props = setupResult.props;
      wrapper = setupResult.wrapper;
    });

    describe('when urlParams.term is empty and globalState is initialized', () => {
      beforeAll(() => {
        mockUrlParams = { term: '', tab: ResourceType.table, index: 0 };
        mockGlobalStateParams = { term: 'test', tab: ResourceType.table, index: 2 };
        returnValue = wrapper.instance().shouldUpdateFromGlobalState(mockUrlParams, mockGlobalStateParams);
      });

      it('returns a value of true', () => {
        expect(returnValue).toBe(true);
      });
    });

    describe('when urlParams is initialized', () => {
      beforeAll(() => {
        mockUrlParams = { term: 'testTerm', tab: ResourceType.table, index: 0 };
        mockGlobalStateParams = { term: '', tab: ResourceType.table, index: 2 };
        returnValue = wrapper.instance().shouldUpdateFromGlobalState(mockUrlParams, mockGlobalStateParams);
      });

      it('returns a value of false', () => {
        expect(returnValue).toBe(false);
      });
    });

    describe('when globalState is empty', () => {
      beforeAll(() => {
        mockUrlParams = { term: '', tab: ResourceType.table, index: 0 };
        mockGlobalStateParams = { term: '', tab: ResourceType.table, index: 2 };
        returnValue = wrapper.instance().shouldUpdateFromGlobalState(mockUrlParams, mockGlobalStateParams);
      });

      it('returns a value of false', () => {
        expect(returnValue).toBe(false);
      });
    });
  });

  describe('shouldUpdateFromUrlParams', () => {
    let props;
    let wrapper;

    let mockUrlParams;
    let mockGlobalStateParams;

    let returnValue;

    beforeAll(() => {
      const setupResult = setup(null, {
        search: '/search?searchTerm=current&selectedTab=table&pageIndex=0',
      });
      props = setupResult.props;
      wrapper = setupResult.wrapper;
    });

    describe('when urlParams.term is empty', () => {
      beforeAll(() => {
        mockUrlParams = { term: '', tab: ResourceType.table, index: 0 };
        mockGlobalStateParams = { term: '', tab: ResourceType.table, index: 0 };
        returnValue = wrapper.instance().shouldUpdateFromUrlParams(mockUrlParams, mockGlobalStateParams);
      });

      it('returns a value of false', () => {
        expect(returnValue).toBe(false);
      });
    });

    describe('when urlParams.term is initialized and equals globalState.term', () => {
      beforeAll(() => {
        mockUrlParams = { term: 'test', tab: ResourceType.table, index: 0 };
        mockGlobalStateParams = { term: 'test', tab: ResourceType.table, index: 0 };
        returnValue = wrapper.instance().shouldUpdateFromUrlParams(mockUrlParams, mockGlobalStateParams);
      });

      it('returns a value of false', () => {
        expect(returnValue).toBe(false);
      });
    });

    describe('when urlParams are initialized and not equal to global state', () => {
      beforeAll(() => {
        mockUrlParams = { term: 'test', tab: ResourceType.table, index: 0 };
        mockGlobalStateParams = { term: '', tab: ResourceType.table, index: 0 };
        returnValue = wrapper.instance().shouldUpdateFromUrlParams(mockUrlParams, mockGlobalStateParams);
      });

      it('returns a value of true', () => {
        expect(returnValue).toBe(true);
      });
    });
  });
  
  describe('componentDidUpdate', () => {
    let props;
    let wrapper;

    let mockNextUrlParams;
    let mockPrevUrlParams;
    let mockPrevProps;

    let getUrlParamsSpy;
    let isUrlStateSyncedSpy;
    let shouldUpdateSearchTermSpy;
    let shouldUpdateTabSpy;
    let shouldUpdatePageIndexSpy;
    let searchAllSpy;
    let updateSearchTabSpy;
    let searchResourceSpy;

    beforeAll(() => {
      const setupResult = setup(null, {
        search: '/search?searchTerm=testName&selectedTab=table&pageIndex=1',
      });
      props = setupResult.props;
      wrapper = setupResult.wrapper;

      mockPrevProps = {
        searchTerm: 'previous',
        location: {
          search: '/search?searchTerm=previous&selectedTab=table&pageIndex=0',
          pathname: 'mockstr',
          state: jest.fn(),
          hash: 'mockstr',
        }
      };

      getUrlParamsSpy = jest.spyOn(wrapper.instance(), 'getUrlParams');
      isUrlStateSyncedSpy = jest.spyOn(wrapper.instance(), 'isUrlStateSynced');
      shouldUpdateSearchTermSpy = jest.spyOn(wrapper.instance(), 'shouldUpdateSearchTerm');
      shouldUpdateTabSpy = jest.spyOn(wrapper.instance(), 'shouldUpdateTab');
      shouldUpdatePageIndexSpy = jest.spyOn(wrapper.instance(), 'shouldUpdatePageIndex');
      searchAllSpy = jest.spyOn(props, 'searchAll');
      updateSearchTabSpy = jest.spyOn(props, 'updateSearchTab');
      searchResourceSpy = jest.spyOn(props, 'searchResource');
    });

    it('calls getUrlParams for both current and prev props', () => {
      wrapper.instance().componentDidUpdate(mockPrevProps);
      expect(getUrlParamsSpy).toHaveBeenCalledTimes(2);
      expect(getUrlParamsSpy).toHaveBeenCalledWith(mockPrevProps.location.search);
      expect(getUrlParamsSpy).toHaveBeenCalledWith(props.location.search);
    });


    it('exits the function when isUrlStateSynced returns true', () => {
      isUrlStateSyncedSpy.mockImplementationOnce(() => true);

      shouldUpdateSearchTermSpy.mockClear();
      shouldUpdateTabSpy.mockClear();
      wrapper.instance().componentDidUpdate(mockPrevProps);

      expect(shouldUpdateSearchTermSpy).not.toHaveBeenCalled();
      expect(shouldUpdateTabSpy).not.toHaveBeenCalled();
    });


    describe('when the search term has changed', () => {
      beforeAll(() => {
        mockNextUrlParams = { term: 'new term', tab: ResourceType.table, index: 0 };
        mockPrevUrlParams = { term: 'old term', tab: ResourceType.table, index: 0 };

        getUrlParamsSpy.mockReset();
        isUrlStateSyncedSpy.mockClear();
        shouldUpdateSearchTermSpy.mockClear();
        shouldUpdateTabSpy.mockClear();
        shouldUpdatePageIndexSpy.mockClear();
        searchAllSpy.mockClear();
        updateSearchTabSpy.mockClear();
        searchResourceSpy.mockClear();

        getUrlParamsSpy.mockImplementationOnce(() => mockNextUrlParams);
        getUrlParamsSpy.mockImplementationOnce(() => mockPrevUrlParams);
        getUrlParamsSpy.mockImplementationOnce(() => mockNextUrlParams);
        isUrlStateSyncedSpy.mockImplementationOnce(() => false);

        wrapper.instance().componentDidUpdate(mockPrevProps);
      });

      it('calls searchAll', () => {
        expect(searchAllSpy).toHaveBeenCalledWith(mockNextUrlParams.term, mockNextUrlParams.tab, mockNextUrlParams.index);
      });

      it('does not call updateSearchTab nor searchResource', () => {
        expect(updateSearchTabSpy).not.toHaveBeenCalled();
        expect(searchResourceSpy).not.toHaveBeenCalled();
      });
    });

    describe('when the search tab has changed', () => {
      beforeAll(() => {
        mockNextUrlParams = { term: 'old term', tab: ResourceType.user, index: 0 };
        mockPrevUrlParams = { term: 'old term', tab: ResourceType.table, index: 0 };

        getUrlParamsSpy.mockReset();
        isUrlStateSyncedSpy.mockClear();
        shouldUpdateSearchTermSpy.mockClear();
        shouldUpdateTabSpy.mockClear();
        shouldUpdatePageIndexSpy.mockClear();
        searchAllSpy.mockClear();
        updateSearchTabSpy.mockClear();
        searchResourceSpy.mockClear();

        getUrlParamsSpy.mockImplementationOnce(() => mockNextUrlParams);
        getUrlParamsSpy.mockImplementationOnce(() => mockPrevUrlParams);
        isUrlStateSyncedSpy.mockImplementationOnce(() => false);

        wrapper.instance().componentDidUpdate(mockPrevProps);
      });

      it('calls updateSearchTab', () => {
        expect(updateSearchTabSpy).toHaveBeenCalledWith(mockNextUrlParams.tab)
      });

      it('does not call searchAll nor searchResource', () => {
        expect(searchAllSpy).not.toHaveBeenCalled();
        expect(searchResourceSpy).not.toHaveBeenCalled();
      });
    });

    describe('when the page index has changed', () => {
      beforeAll(() => {
        mockNextUrlParams = { term: 'old term', tab: ResourceType.table, index: 1 };
        mockPrevUrlParams = { term: 'old term', tab: ResourceType.table, index: 0 };

        getUrlParamsSpy.mockReset();
        isUrlStateSyncedSpy.mockClear();
        shouldUpdateSearchTermSpy.mockClear();
        shouldUpdateTabSpy.mockClear();
        shouldUpdatePageIndexSpy.mockClear();
        searchAllSpy.mockClear();
        updateSearchTabSpy.mockClear();
        searchResourceSpy.mockClear();

        getUrlParamsSpy.mockImplementationOnce(() => mockNextUrlParams);
        getUrlParamsSpy.mockImplementationOnce(() => mockPrevUrlParams);
        isUrlStateSyncedSpy.mockImplementationOnce(() => false);

        wrapper.instance().componentDidUpdate(mockPrevProps);
      });

      it('calls searchResource', () => {
        expect(searchResourceSpy).toHaveBeenCalledWith(mockNextUrlParams.term, mockNextUrlParams.tab, mockNextUrlParams.index)
      });

      it('does not call searchAll nor updateSearchTab', () => {
        expect(searchAllSpy).not.toHaveBeenCalled();
        expect(updateSearchTabSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('getUrlParams', () => {
    let props;
    let wrapper;

    let urlString;
    let urlParams;

    beforeAll(() => {
      const setupResult = setup(null, {
        search: '/search?searchTerm=current&selectedTab=table&pageIndex=0',
      });
      props = setupResult.props;
      wrapper = setupResult.wrapper;
    });

    it('parses url params correctly', () => {
      urlString = '/search?searchTerm=tableSearch&selectedTab=table&pageIndex=3';
      urlParams = wrapper.instance().getUrlParams(urlString);

      expect(urlParams.term).toEqual('tableSearch');
      expect(urlParams.tab).toEqual('table');
      expect(urlParams.index).toEqual(3);
    });

    it('parses url params correctly', () => {
      urlString = '/search?searchTerm=userSearch&selectedTab=user&pageIndex=0';
      urlParams = wrapper.instance().getUrlParams(urlString);

      expect(urlParams.term).toEqual('userSearch');
      expect(urlParams.tab).toEqual('user');
      expect(urlParams.index).toEqual(0);
    });

    it('trims empty spaces from searchTerm', () => {
      urlString = '/search?searchTerm= term%20&selectedTab=user&pageIndex=0';
      urlParams = wrapper.instance().getUrlParams(urlString);

      expect(urlParams.term).toEqual('term');
      expect(urlParams.tab).toEqual('user');
      expect(urlParams.index).toEqual(0);
    });

    it('defaults NaN pageIndex as 0', () => {
      urlString = '/search?searchTerm=current&selectedTab=table&pageIndex=NotANumber';
      urlParams = wrapper.instance().getUrlParams(urlString);

      expect(urlParams.term).toEqual('current');
      expect(urlParams.tab).toEqual('table');
      expect(urlParams.index).toEqual(0);
    });

    it('defaults invalid tabs to the current tab', () => {
      urlString = '/search?searchTerm=current&selectedTab=invalidTabType&pageIndex=0';
      urlParams = wrapper.instance().getUrlParams(urlString);

      expect(urlParams.term).toEqual('current');
      expect(urlParams.tab).toEqual(props.selectedTab);
      expect(urlParams.index).toEqual(0);
    });

  });

  describe('getSelectedTabByResourceType', () => {
    let props;
    let wrapper;

    beforeAll(() => {
      const setupResult = setup(null, {
        search: '/search?searchTerm=testName&selectedTab=table&pageIndex=1',
      });
      props = setupResult.props;
      wrapper = setupResult.wrapper;
    });

    it('returns given tab if equal to ResourceType.table', () => {
      expect(wrapper.instance().getSelectedTabByResourceType(ResourceType.table)).toEqual(ResourceType.table);
    });

    it('returns given tab if equal to ResourceType.user', () => {
      expect(wrapper.instance().getSelectedTabByResourceType(ResourceType.user)).toEqual(ResourceType.user);
    });

    it('returns state.selectedTab in default case', () => {
      wrapper.setState({ selectedTab: 'table' })
      // @ts-ignore: cover default case
      expect(wrapper.instance().getSelectedTabByResourceType('not valid')).toEqual('table');
    });
  });

  describe('getPageIndexByResourceType', () => {
    let props;
    let wrapper;
    beforeAll(() => {
      const setupResult = setup({
        dashboards: { ...globalState.search.dashboards, page_index: 1 },
        tables: { ...globalState.search.tables, page_index: 2 },
        users: { ...globalState.search.users, page_index: 3 },
      });
      props = setupResult.props;
      wrapper = setupResult.wrapper;
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
      // @ts-ignore: cover default case
      expect(wrapper.instance().getPageIndexByResourceType('not valid')).toEqual(0);
    });
  });

  describe('onPaginationChange', () => {
    const testIndex = 10;
    let props;
    let wrapper;

    let searchResourceSpy;
    let updatePageUrlSpy;
    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;

      searchResourceSpy = jest.spyOn(props, 'searchResource');
      updatePageUrlSpy = jest.spyOn(wrapper.instance(), 'updatePageUrl');

      wrapper.instance().onPaginationChange(testIndex);
    });

    it('calls updatePageUrl with correct parameters', () => {
      expect(updatePageUrlSpy).toHaveBeenCalledWith(props.searchTerm, props.selectedTab, testIndex);
    });
  });

  describe('onTabChange', () => {
    const givenTab = ResourceType.user;
    const mockPageIndex = 2;
    let props;
    let wrapper;

    let getPageIndexByResourceTypeSpy;
    let getSelectedTabByResourceTypeSpy;
    let updatePageUrlSpy;
    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;

      getSelectedTabByResourceTypeSpy = jest.spyOn(wrapper.instance(), 'getSelectedTabByResourceType').mockImplementation(() => {
        return givenTab;
      });
      getPageIndexByResourceTypeSpy = jest.spyOn(wrapper.instance(), 'getPageIndexByResourceType').mockImplementation(() => {
        return mockPageIndex;
      });
      updatePageUrlSpy = jest.spyOn(wrapper.instance(), 'updatePageUrl');
      setStateSpy.mockClear();

      wrapper.instance().onTabChange(givenTab);
    });

    it('calls getSelectedTabByResourceType with correct parameters', () => {
      expect(getSelectedTabByResourceTypeSpy).toHaveBeenCalledWith(givenTab);
    });

    // it('calls setState with correct parameters', () => {
    //   expect(setStateSpy).toHaveBeenCalledWith({ selectedTab: givenTab });
    // });

    it('calls updatePageUrl with correct parameters', () => {
      expect(updatePageUrlSpy).toHaveBeenCalledWith(props.searchTerm, givenTab, mockPageIndex);
    });

    afterAll(() => {
      getSelectedTabByResourceTypeSpy.mockRestore();
      getPageIndexByResourceTypeSpy.mockRestore();
    });
  });

  describe('updatePageUrl', () => {
    it('pushes correct update to the window state', () => {
      const { props, wrapper } = setup();
      const pageIndex = 2;
      const searchTerm = 'testing';
      const tab = ResourceType.user;
      const expectedPath = `/search?searchTerm=${searchTerm}&selectedTab=${tab}&pageIndex=${pageIndex}`;
      const historyPushSpy = jest.spyOn(props.history, 'push');
      wrapper.instance().updatePageUrl(searchTerm, tab, pageIndex);
      expect(historyPushSpy).toHaveBeenCalledWith(expectedPath);
    });
  });

  describe('getTabContent', () => {
    let content;

    describe('if searchTerm but no results', () => {
      it('renders expected search error message', () => {
        const { props, wrapper } = setup({ searchTerm: 'data' });
        const testResults = {
          page_index: 0,
          results: [],
          total_results: 0,
        };
        content = shallow(wrapper.instance().getTabContent(testResults, TABLE_RESOURCE_TITLE));
        expect(content.children().at(0).text()).toEqual(`${SEARCH_ERROR_MESSAGE_PREFIX}data${SEARCH_ERROR_MESSAGE_INFIX}tables${SEARCH_ERROR_MESSAGE_SUFFIX}`);
      });
    });

    describe('if page index is out of bounds', () => {
      it('renders expected page index error message', () => {
        const { props, wrapper } = setup();
        const testResults = {
          page_index: 2,
          results: [],
          total_results: 1,
        };
        content = shallow(wrapper.instance().getTabContent(testResults, TABLE_RESOURCE_TITLE));
        expect(content.children().at(0).text()).toEqual(PAGE_INDEX_ERROR_MESSAGE);
      });
    });

    describe('if searchTerm and search results exist', () => {
      let props;
      let wrapper;
      beforeAll(() => {
        const setupResult = setup({ searchTerm: '' });
        props = setupResult.props;
        wrapper = setupResult.wrapper;
        content = shallow(wrapper.instance().getTabContent(props.tables, TABLE_RESOURCE_TITLE));
      });

      it('renders correct label for content', () => {
        expect(content.children().at(0).find('label').text()).toEqual(`1-1 of 1 results`);
      });

      it('renders InfoButton with correct props', () => {
        expect(content.children().at(0).find(InfoButton).props()).toMatchObject({
          infoText: SEARCH_INFO_TEXT,
        });
      });

      it('renders ResourceList with correct props', () => {
        const { props, wrapper } = setup();
        const testResults = {
          page_index: 0,
          results: [],
          total_results: 11,
        };
        content = shallow(wrapper.instance().getTabContent(testResults, TABLE_RESOURCE_TITLE));

        expect(content.children().find(ResourceList).props()).toMatchObject({
          activePage: 0,
          slicedItems: testResults.results,
          slicedItemsCount: testResults.total_results,
          itemsPerPage: RESULTS_PER_PAGE,
          onPagination: wrapper.instance().onPaginationChange,
          source: SEARCH_SOURCE_NAME,
        });
      });
    });
  });

  describe('renderContent', () => {
    it('renders search results when given search term', () => {
      const {props, wrapper} = setup({ searchTerm: 'test' });
      expect(wrapper.instance().renderContent()).toEqual(wrapper.instance().renderSearchResults());
    });

    it('renders loading spinner when in loading state', () => {
      const {props, wrapper} = setup({ isLoading: true });
      expect(wrapper.instance().renderContent()).toEqual(<LoadingSpinner/>);
    });
  });

  describe('renderSearchResults', () => {
    let props;
    let wrapper;

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
    });

    it('renders TabsComponent with correct props', () => {
      AppConfig.indexUsers.enabled = false;
      const content = shallow(wrapper.instance().renderSearchResults());
      const tabProps = content.find(TabsComponent).props();
      expect(tabProps.activeKey).toEqual(props.selectedTab);
      expect(tabProps.defaultTab).toEqual(ResourceType.table);
      expect(tabProps.onSelect).toEqual(wrapper.instance().onTabChange);

      const firstTab = tabProps.tabs[0];
      expect(firstTab.key).toEqual(ResourceType.table);
      expect(firstTab.title).toEqual(`${TABLE_RESOURCE_TITLE} (${props.tables.total_results})`);
      expect(firstTab.content).toEqual(wrapper.instance().getTabContent(props.tables, TABLE_RESOURCE_TITLE));
    });

    it('renders only one tab if people is disabled', () => {
      AppConfig.indexUsers.enabled = false;
      const content = shallow(wrapper.instance().renderSearchResults());
      const tabConfig = content.find(TabsComponent).props().tabs;
      expect(tabConfig.length).toEqual(1)
    });

    it('renders two tabs if indexUsers is enabled', () => {
      AppConfig.indexUsers.enabled = true;
      const content = shallow(wrapper.instance().renderSearchResults());
      const tabConfig = content.find(TabsComponent).props().tabs;
      expect(tabConfig.length).toEqual(2)
    });
  });

  describe('render', () => {
    describe('DocumentTitle', () => {
      it('renders correct title if there is a search term', () => {
        const { props, wrapper } = setup({ searchTerm: 'test search' });
        expect(wrapper.find(DocumentTitle).props()).toMatchObject({
          title: `test search${DOCUMENT_TITLE_SUFFIX}`
        });
      });

      it('does not render DocumentTitle if searchTerm is empty string', () => {
        const { props, wrapper } = setup({ searchTerm: '' });
        expect(wrapper.find(DocumentTitle).exists()).toBeFalsy();
      });
    });

    it('renders SearchBar with correct props', () => {
      const { props, wrapper } = setup();
      expect(wrapper.find(SearchBar).exists()).toBeTruthy();
    });

    it('calls renderSearchResults if searchTerm is not empty string', () => {
      const { props, wrapper } = setup({ searchTerm: 'test search' });
      const renderSearchResultsSpy = jest.spyOn(wrapper.instance(), 'renderSearchResults');
      wrapper.setProps(props);
      expect(renderSearchResultsSpy).toHaveBeenCalled();
    });
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
});

describe('mapStateToProps', () => {
  let result;
  beforeAll(() => {
    result = mapStateToProps(globalState);
  });

  it('sets searchTerm on the props', () => {
    expect(result.searchTerm).toEqual(globalState.search.search_term);
  });

  it('sets isLoading on the props', () => {
    expect(result.isLoading).toEqual(globalState.search.isLoading);
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
