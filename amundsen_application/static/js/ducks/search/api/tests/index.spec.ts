import axios, { AxiosResponse } from 'axios';

import AppConfig from 'config/config';

import { DashboardSearchResults, TableSearchResults, UserSearchResults } from 'ducks/search/types';

import globalState from 'fixtures/globalState';

import { ResourceType } from 'interfaces';

import * as API from '../v0';

jest.mock('axios');

describe('searchResource', () => {
  let axiosMockGet;
  let axiosMockPost;
  let mockTableResponse: AxiosResponse<API.SearchAPI>;
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
    axiosMockPost = jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve(mockTableResponse));
  });

  describe('searchResource', () => {
    it('resolves with empty object if dashboard resource search not supported', async () => {
      axiosMockGet.mockClear();
      axiosMockPost.mockClear();
      const pageIndex = 0;
      const resourceType = ResourceType.dashboard;
      const term = 'test';
      expect.assertions(3);
      await API.searchResource(pageIndex, resourceType, term).then(results => {
        expect(results).toEqual({});
      });
      expect(axiosMockGet).not.toHaveBeenCalled();
      expect(axiosMockPost).not.toHaveBeenCalled();
    });

    it('resolves with empty object if user resource search not supported', async () => {
      axiosMockGet.mockClear();
      axiosMockPost.mockClear();
      AppConfig.indexUsers.enabled = false;
      const pageIndex = 0;
      const resourceType = ResourceType.user;
      const term = 'test';
      expect.assertions(3);
      await API.searchResource(pageIndex, resourceType, term).then(results => {
        expect(results).toEqual({});
      });
      expect(axiosMockGet).not.toHaveBeenCalled();
      expect(axiosMockPost).not.toHaveBeenCalled();
    });

    describe('if no filters are passed', () => {
      it('calls axios get with request for a resource', async () => {
        axiosMockGet.mockClear();
        axiosMockPost.mockClear();
        const pageIndex = 0;
        const resourceType = ResourceType.table;
        const term = 'test';
        await API.searchResource(pageIndex, resourceType, term);
        expect(axiosMockGet).toHaveBeenCalledWith(`${API.BASE_URL}/${resourceType}?query=${term}&page_index=${pageIndex}`);
        expect(axiosMockPost).not.toHaveBeenCalled();
      });

      it('calls searchResourceHelper with api call response', async () => {
        const searchResourceHelperSpy = jest.spyOn(API, 'searchResourceHelper');
        await API.searchResource(0, ResourceType.table, 'test');
        expect(searchResourceHelperSpy).toHaveBeenCalledWith(mockTableResponse);
      });
    })

    describe('if filters are passed', () => {
      it('calls axios post with request for a resource', async () => {
        axiosMockGet.mockClear();
        axiosMockPost.mockClear();
        const pageIndex = 0;
        const resourceType = ResourceType.table;
        const term = 'test';
        const filters = { 'schema': 'schema_name' }
        await API.searchResource(pageIndex, resourceType, term, filters);
        expect(axiosMockGet).not.toHaveBeenCalled();
        expect(axiosMockPost).toHaveBeenCalledWith(`${API.BASE_URL}/${resourceType}_qs`, {
          filters,
          pageIndex,
          term,
        });
      });

      it('calls searchResourceHelper with api call response', async () => {
        const searchResourceHelperSpy = jest.spyOn(API, 'searchResourceHelper');
        await API.searchResource(0, ResourceType.table, 'test', { 'schema': 'schema_name' });
        expect(searchResourceHelperSpy).toHaveBeenCalledWith(mockTableResponse);
      });
    })
  });

  describe('searchResourceHelper', () => {
    it('returns expected object', () => {
      expect(API.searchResourceHelper(mockTableResponse)).toEqual({
        searchTerm: mockTableResponse.data.search_term,
        tables: mockTableResponse.data.tables,
        users: mockTableResponse.data.users,
      });
    });
  });
});
