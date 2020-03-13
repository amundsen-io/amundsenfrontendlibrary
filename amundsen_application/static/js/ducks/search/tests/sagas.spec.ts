import { testSaga } from 'redux-saga-test-plan';
import { debounce } from 'redux-saga/effects';

import { DEFAULT_RESOURCE_TYPE, ResourceType, SearchType } from 'interfaces';

import * as NavigationUtils from 'utils/navigationUtils';
import * as SearchUtils from 'ducks/search/utils';

import * as API from '../api/v0';
import * as Sagas from '../sagas';

import {
  initialState,
  initialInlineResultsState,
  loadPreviousSearch,
  searchAll,
  searchAllFailure,
  searchAllSuccess,
  SearchReducerState,
  searchResource,
  searchResourceFailure,
  searchResourceSuccess,
  selectInlineResult,
  submitSearch,
  updateFromInlineResult,
  urlDidUpdate,
} from '../reducer';
import {
  LoadPreviousSearch,
  InlineSearch,
  InlineSearchResponsePayload,
  InlineSearchUpdatePayload,
  SearchAll,
  SearchAllResponsePayload,
  SearchResource,
  SearchResponsePayload,
  SubmitSearch,
  UrlDidUpdate,
} from '../types';

import globalState from 'fixtures/globalState';

const updateSearchUrlSpy = jest.spyOn(NavigationUtils, 'updateSearchUrl');
const searchState = globalState.search;

describe('search sagas', () => {
  describe('searchAllWatcher', () => {
    it('takes every SearchAll.REQUEST with searchAllWorker', () => {
      testSaga(Sagas.searchAllWatcher)
        .next().takeEvery(SearchAll.REQUEST, Sagas.searchAllWorker)
        .next().isDone();
    });
  });

  // describe('searchAllWorker', () => {
  //   /*
  //     TODO - There seems to be no straughtforward way to test this method.
  //     We should re-evaluate how much logic is wrapped into sagas specifically
  //     question:
  //     1. Processing the response in the saga
  //     2. Helper methods
  //     Can we pass all necessary information to the api method such that the api method
  //     does all of the processing and returns what we need?
  //   */
  //
  //   it('handles request error', () => {
  //     testSaga(Sagas.searchAllWorker, searchAll(SearchType.SUBMIT_TERM, 'test', ResourceType.table, 0, true))
  //       .next().select(SearchUtils.getSearchState)
  //       .next(globalState.search).throw(new Error()).put(searchAllFailure())
  //       .next().isDone();
  //   });
  // });
  //
  // describe('searchResourceWatcher', () => {
  //   it('takes every SearchResource.REQUEST with searchResourceWorker', () => {
  //     testSaga(Sagas.searchResourceWatcher)
  //       .next().takeEvery(SearchResource.REQUEST, Sagas.searchResourceWorker)
  //       .next().isDone();
  //   });
  // });
  //
  // describe('searchResourceWorker', () => {
  //   it('executes flow for returning search results', () => {
  //     const pageIndex = 0;
  //     const resource = ResourceType.table;
  //     const term = 'test';
  //     const mockSearchState = globalState.search;
  //     const searchType = SearchType.PAGINATION;
  //     testSaga(Sagas.searchResourceWorker, searchResource(searchType, term, resource, pageIndex))
  //       .next().select(SearchUtils.getSearchState)
  //       .next(mockSearchState).call(API.searchResource, pageIndex, resource, term, mockSearchState.filters[resource], searchType)
  //       .next(expectedSearchResults).put(searchResourceSuccess(expectedSearchResults))
  //       .next().isDone();
  //   });
  //
  //   it('handles request error', () => {
  //     testSaga(Sagas.searchResourceWorker, searchResource(SearchType.PAGINATION, 'test', ResourceType.table, 0))
  //       .next().select(SearchUtils.getSearchState)
  //       .next(globalState.search).throw(new Error()).put(searchResourceFailure())
  //       .next().isDone();
  //   });
  // });
  //
  // describe('submitSearchWorker', () => {
  //   it('initiates flow to search with a term and existing filters', () => {
  //     const term = 'test';
  //     testSaga(Sagas.submitSearchWorker, submitSearch({ searchTerm: term, useFilters: true }))
  //       .next().put(searchAll(SearchType.SUBMIT_TERM, term, undefined, 0, true))
  //       .next().isDone();
  //   });
  //
  //   it('initiates flow to search with empty term and existing filters', () => {
  //     testSaga(Sagas.submitSearchWorker, submitSearch({ searchTerm: '', useFilters: false }))
  //       .next().put(searchAll(SearchType.CLEAR_TERM, '', undefined, 0, false))
  //       .next().isDone();
  //   });
  // });
  //
  // describe('submitSearchWatcher', () => {
  //   it('takes every SubmitSearch.REQUEST with submitSearchWorker', () => {
  //     testSaga(Sagas.submitSearchWatcher)
  //       .next().takeLatest(SubmitSearch.REQUEST, Sagas.submitSearchWorker)
  //       .next().isDone();
  //   });
  // });
  //
  // describe('urlDidUpdateWorker', () => {
  //   let sagaTest;
  //   let term;
  //   let resource;
  //   let index;
  //
  //   beforeEach(() => {
  //     term = searchState.search_term;
  //     resource = searchState.resource;
  //     index = SearchUtils.getPageIndex(searchState, resource);
  //
  //     sagaTest = (action) => {
  //       return testSaga(Sagas.urlDidUpdateWorker, action)
  //         .next().select(SearchUtils.getSearchState)
  //         .next(searchState);
  //     };
  //   });
  //
  //   it('Calls searchAll when search term changes', () => {
  //     term = 'new search';
  //     sagaTest(urlDidUpdate(`term=${term}&resource=${resource}&index=${index}`))
  //       .put(searchAll(SearchType.LOAD_URL, term, resource, index))
  //       .next().isDone();
  //   });
  //
  //   it('Calls setResource when the resource has changed', () => {
  //     resource = ResourceType.user;
  //     sagaTest(urlDidUpdate(`term=${term}&resource=${resource}&index=${index}`))
  //       .put(setResource(resource, false))
  //       .next().isDone();
  //   });
  //
  //   it('when filters have changed', () => {
  //     sagaTest(urlDidUpdate(`term=${term}&resource=${resource}&index=${index}&filters=%7B"database"%3A%7B"hive"%3Atrue%7D%7D`))
  //       .put(filterReducer.setSearchInputByResource({ 'database': { 'hive' : true }}, resource, index, term))
  //       .next().isDone();
  //   });
  //
  //   /*it('Calls setPageIndex when the index changes', () => {
  //     index = 10;
  //     sagaTest(urlDidUpdate(`term=${term}&resource=${resource}&index=${index}`))
  //       .put(setPageIndex(index, false))
  //       .next().isDone();
  //   });*/
  // });
  //
  // describe('urlDidUpdateWatcher', () => {
  //   it('takes every UrlDidUpdate.REQUEST with urlDidUpdateWorker', () => {
  //     testSaga(Sagas.urlDidUpdateWatcher)
  //       .next().takeEvery(UrlDidUpdate.REQUEST, Sagas.urlDidUpdateWorker)
  //       .next().isDone();
  //   });
  // });
  //
  // describe('loadPreviousSearchWorker', () => {
  //   // TODO - test 'BrowserHistory.goBack' case
  //
  //   it('applies the existing search state into the URL', () => {
  //     updateSearchUrlSpy.mockClear();
  //
  //     testSaga(Sagas.loadPreviousSearchWorker, loadPreviousSearch())
  //       .next().select(SearchUtils.getSearchState)
  //       .next(searchState).isDone();
  //
  //     expect(updateSearchUrlSpy).toHaveBeenCalledWith({
  //       term: searchState.search_term,
  //       resource: searchState.resource,
  //       index: SearchUtils.getPageIndex(searchState, searchState.resource),
  //       filters: searchState.filters,
  //     });
  //   });
  // });
  //
  // describe('loadPreviousSearchWatcher', () => {
  //   it('takes every LoadPreviousSearch.REQUEST with loadPreviousSearchWorker', () => {
  //     testSaga(Sagas.loadPreviousSearchWatcher)
  //       .next().takeEvery(LoadPreviousSearch.REQUEST, Sagas.loadPreviousSearchWorker)
  //       .next().isDone();
  //   });
  // });
  //
  // describe('inlineSearchWorker', () => {
  //   /* TODO - Considering some cleanup */
  // });
  //
  // describe('inlineSearchWatcher', () => {
  //   /* TODO - Need to investigate proper test approach
  //   it('debounces InlineSearch.REQUEST and calls inlineSearchWorker', () => {
  //   });
  //   */
  // });
  //
  // describe('selectInlineResultWorker', () => {
  //   /* TODO - Considering some cleanup */
  // });
  //
  // describe('selectInlineResultsWatcher', () => {
  //   it('takes every InlineSearch.REQUEST with selectInlineResultWorker', () => {
  //     testSaga(Sagas.selectInlineResultsWatcher)
  //       .next().takeEvery(InlineSearch.SELECT, Sagas.selectInlineResultWorker)
  //       .next().isDone();
  //   });
  // });
});
