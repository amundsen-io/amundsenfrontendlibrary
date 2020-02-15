import { testSaga } from 'redux-saga-test-plan';

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
  GetJiraIssues
} from '../types'; 
import { JiraIssue } from 'interfaces';

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
      const action = getJiraIssuesFailure(jiraIssues);
      expect(action.type).toBe(GetJiraIssues.FAILURE);
    });

    it('createJiraIssue - returns the action to create jira items', () => {
      const action = createJiraIssue(formData);
      const { payload } = action;
      expect(action.type).toBe(CreateJiraIssue.REQUEST);
      expect(payload.data).toBe(formData);
    });

    it('createJiraIssueFailure - returns the action to process failure', () => {
      const action = createJiraIssueFailure(jiraIssue);
      const { payload } = action;
      expect(action.type).toBe(CreateJiraIssue.FAILURE);
      expect(payload.jiraIssue).toBe(jiraIssue);
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

    it('should handle SubmitFeedback.SUCCESS', () => {
      expect(reducer(testState, getJiraIssuesSuccess(jiraIssues))).toEqual({ jiraIssues: jiraIssues, isLoading: false });
    });

    it('should handle SubmitFeedback.FAILURE', () => {
      expect(reducer(testState, getJiraIssuesFailure(jiraIssues))).toEqual({ jiraIssues: [], isLoading: false  });
    });
  });

}); 