import axios from 'axios';

import globalState from 'fixtures/globalState';

import { ResourceType, SearchAllOptions } from 'interfaces';

import { DashboardSearchResults, TableSearchResults, UserSearchResults } from '../types';

import { searchAll, searchAllHelper, searchResource, searchResourceHelper, SearchAPI, BASE_URL } from '../v0';

jest.mock('axios');

describe('searchAll', () => {
  let axiosMockAllResults;
  let axiosMockGet;
  let axiosMockSpread;
  let mockTableResponse: AxiosResponse<SearchAPI>;
  beforeAll(() => {
    mockTableResponse = {
      data: {
        msg: 'Success',
        status_code: 200,
        search_term: globalState.search.search_term,
        tables: globalState.search.tables,
      },
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    };

    axiosMockAllResults = [ mockTableResponse ];
    axiosMockGet = jest.spyOn(axios, 'get');
    axiosMockSpread = jest.spyOn(axios, 'spread');

    const axiosMockAll = jest.spyOn(axios, 'all').mockImplementation(() => Promise.resolve(axiosMockAllResults));
  });

  beforeEach(() => {
    axiosMockGet.mockClear();
  });

  describe('with empty searchOptions', () => {
    let searchOptions: SearchAllOptions;
    let term: string;
    beforeAll(() => {
      searchOptions = {};
      term = globalState.search.search_term;
    });

    it('calls axios.get for table resources with correct parameters', async () => {
      await searchAll(searchOptions, term);
      expect(axiosMockGet).toHaveBeenCalledWith(`${BASE_URL}/table?query=${term}&page_index=${0}`);
    });
  });

  describe('with searchOptions', () => {
    let searchOptions: SearchAllOptions;
    let term: string;
    beforeAll(() => {
      searchOptions = {
        tableIndex: 1,
      };
      term = globalState.search.search_term;
    });

    it('calls axios.get for table resources with correct parameters', async () => {
      await searchAll(searchOptions, term);
      expect(axiosMockGet).toHaveBeenCalledWith(`${BASE_URL}/table?query=${term}&page_index=${searchOptions.tableIndex}`)
    });
  });

  it('should call axios.spread with a callback', () => {
    expect(axiosMockSpread).toHaveBeenCalledWith(searchAllHelper);
  });

  it('should call the result of axios.spread with the resolved value of axios.all', async () => {
    const axiosMockSpreadResult = jest.fn();
    axiosMockSpread.mockReturnValueOnce(axiosMockSpreadResult);
    await searchAll({}, 'test');
    expect(axiosMockSpreadResult).toHaveBeenCalledWith(axiosMockAllResults);
  });

  describe('searchAllHelper', () => {
    it('returns expected object', () => {
      expect(searchAllHelper(mockTableResponse)).toEqual({
        search_term: mockTableResponse.data.search_term,
        tables: mockTableResponse.data.tables,
      });
    })
  });
});

describe('searchResource', () => {
  let axiosMockGet;
  let mockTableResponse: AxiosResponse<SearchAPI>;
  beforeAll(() => {
    mockTableResponse = {
      data: {
        msg: 'Success',
        status_code: 200,
        search_term: globalState.search.search_term,
        tables: globalState.search.tables,
        users: globalState.search.users,
      },
      status: 200,
      statusText: '',
      headers: {},
      config: {},
    };
    axiosMockGet = jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(mockTableResponse));
  });

  it('calls axios get with request for a resource', async () => {
    let pageIndex = 0;
    let resourceType = ResourceType.table;
    let term = 'test';
    await searchResource(pageIndex, resourceType, term);
    expect(axiosMockGet).toHaveBeenCalledWith(`${BASE_URL}/${resourceType}?query=${term}&page_index=${pageIndex}`);
  });

  /*
  TODO: Not set up to test this.
  it('calls searchResourceHelper with resolved results', async () => {
    await searchResource(0, ResourceType.table, 'test');
    expect(searchResourceHelper).toHaveBeenCalledWith(mockTableResponse);
  });
  */

  describe('searchResourceHelper', () => {
    it('returns expected object', () => {
      expect(searchResourceHelper(mockTableResponse)).toEqual({
        searchTerm: mockTableResponse.data.search_term,
        tables: mockTableResponse.data.tables,
        users: mockTableResponse.data.users,
      });
    });
  });
});
