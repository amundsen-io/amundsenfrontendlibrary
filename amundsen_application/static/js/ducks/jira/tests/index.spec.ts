import { testSaga, expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import globalState from 'fixtures/globalState';


import * as API from '../api/v0';

import reducer, { 
  createJiraIssue, 
  createJiraIssueSuccess, 
  createJiraIssueFailure, 
  getJiraIssues, 
  getJiraIssuesSuccess, 
  getJiraIssuesFailure,
  JiraIssueReducerState
} from '../reducer'; 

import {
  CreateJiraIssue, 
  GetJiraIssues,
  GetJiraIssuesRequest,
  CreateJiraIssueRequest
} from '../types'; 
import { JiraIssue } from 'interfaces';
import { getJiraIssuesWatcher, getJiraIssuesWorker, createJiraIssueWatcher, createJiraIssueWorker } from '../sagas';
import { throwError } from 'redux-saga-test-plan/providers';

describe('jira ducks', () => {
  let formData: FormData; 
  let tableKey: string; 
  let jiraIssue: JiraIssue; 
  let jiraIssues: JiraIssue[]; 
  beforeAll(() => {
    tableKey = 'key'; 
    const testData = { 
      key: 'table', 
      title: 'stuff', 
      description: 'This is a test' 
    };
    formData = new FormData();
    Object.keys(testData).forEach(key => formData.append(key, testData[key]));

    jiraIssue =  {
      create_date: 'date', 
      issue_key: 'issue_key', 
      last_updated: 'also date', 
      title: 'title', 
      url: 'http://url'
    }; 

    jiraIssues = [jiraIssue];

  }); 

  describe('actions', () => {
    it('getJiraIssues - returns the action to submit feedback', () => {
      const action = getJiraIssues(tableKey);
      const { payload } = action;
      expect(action.type).toBe(GetJiraIssues.REQUEST);
      expect(payload.key).toBe(tableKey);
    });

    it('getJiraIssuesSuccess - returns the action to process success', () => {
      const action = getJiraIssuesSuccess(jiraIssues);
      expect(action.type).toBe(GetJiraIssues.SUCCESS);
    });

    it('getJiraIssuesFailure - returns the action to process failure', () => {
      const action = getJiraIssuesFailure();
      expect(action.type).toBe(GetJiraIssues.FAILURE);
    });

    it('createJiraIssue - returns the action to create jira items', () => {
      const action = createJiraIssue(formData);
      const { payload } = action;
      expect(action.type).toBe(CreateJiraIssue.REQUEST);
      expect(payload.data).toBe(formData);
    });

    it('createJiraIssueFailure - returns the action to process failure', () => {
      const action = createJiraIssueFailure();
      const { payload } = action;
      expect(action.type).toBe(CreateJiraIssue.FAILURE);
      expect(payload.jiraIssue).toBe(null);
    });

    it('createJiraIssueSuccess - returns the action to process success', () => {
      const action = createJiraIssueSuccess(jiraIssue);
      const { payload } = action;
      expect(action.type).toBe(CreateJiraIssue.SUCCESS);
      expect(payload.jiraIssue).toBe(jiraIssue);
    });
  });

  describe('reducer', () => {
    let testState: JiraIssueReducerState;
    beforeAll(() => {
      testState = { 
        isLoading: false, 
        jiraIssues: [] 
      };
    });

    it('should return the existing state if action is not handled', () => {
      expect(reducer(testState, { type: 'INVALID.ACTION' })).toEqual(testState);
    });

    it('should handle GetJiraIssues.REQUEST', () => {
      expect(reducer(testState, getJiraIssues(tableKey))).toEqual({ jiraIssues: [], isLoading: false });
    });

    it('should handle GetJiraIssues.SUCCESS', () => {
      expect(reducer(testState, getJiraIssuesSuccess(jiraIssues))).toEqual({ jiraIssues: jiraIssues, isLoading: false });
    });

    it('should handle GetJiraIssues.FAILURE', () => {
      expect(reducer(testState, getJiraIssuesFailure())).toEqual({ jiraIssues: [], isLoading: false  });
    });

    it('should handle CreateJiraIssue.REQUEST', () => {
      expect(reducer(testState, createJiraIssue(formData))).toEqual({ jiraIssues: [], isLoading: true });
    });

    it('should handle CreateJiraIssue.SUCCESS', () => {
      debugger
      expect(reducer(testState, createJiraIssueSuccess(jiraIssue))).toEqual({
         ...testState, jiraIssues: [jiraIssue], isLoading: false });
    });

    it('should handle CreateJiraIssue.FAILURE', () => {
      expect(reducer(testState, createJiraIssueFailure())).toEqual({ jiraIssues: [], isLoading: false  });
    });
  });

  describe('sagas', () => {
    describe('getJiraIssuesWatcher', () => {
      it('takes every getJiraIssues.REQUEST with getJiraIssuesWatcher', () => {
        testSaga(getJiraIssuesWatcher)
          .next().takeEvery(GetJiraIssues.REQUEST, getJiraIssuesWorker)
          .next().isDone();
      });
    });

    describe('getJiraIssuesWorker', () => {
      let action: GetJiraIssuesRequest;
      beforeAll(() => {
        action = getJiraIssues(tableKey);
        jiraIssues = globalState.jira.jiraIssues;
      });

      it('gets jira issues', () => {
        return expectSaga(getJiraIssuesWorker, action)
          .provide([
            [matchers.call.fn(API.getJiraIssues), { jiraIssues }],
          ])
          .put(getJiraIssuesSuccess(jiraIssues))
          .run();
      });

      it('handles request error', () => {
        return expectSaga(getJiraIssuesWorker, action)
          .provide([
            [matchers.call.fn(API.getJiraIssues), throwError(new Error())],
          ])
          .put(getJiraIssuesFailure())
          .run();
      });
    });

    describe('createJiraIssueWatcher', () => {
      it('takes every createJiraIssue.REQUEST with getJiraIssuesWatcher', () => {
        testSaga(createJiraIssueWatcher)
          .next().takeEvery(CreateJiraIssue.REQUEST, createJiraIssueWorker)
          .next().isDone();
      });
    });

    describe('createJiraIssuesWorker', () => {
      let action: CreateJiraIssueRequest;
      beforeAll(() => {
        action = createJiraIssue(formData);
        jiraIssues = globalState.jira.jiraIssues;
      });

      it('creates a jira issue', () => {
        return expectSaga(createJiraIssueWorker, action)
          .provide([
            [matchers.call.fn(API.createJiraIssue), {}],
            [matchers.call.fn(API.createJiraIssue), { jiraIssues }],
          ])
          .put(createJiraIssueSuccess(jiraIssue))
          .run();
      });

      it('handles request error', () => {
        return expectSaga(createJiraIssueWorker, action)
          .provide([
            [matchers.call.fn(API.createJiraIssue), throwError(new Error())],
          ])
          .put(createJiraIssueFailure())
          .run();
      });
    });

  });
}); 