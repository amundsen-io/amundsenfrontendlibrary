import { JiraIssue } from "interfaces";
import { 
  GetJiraIssues, 
  CreateJiraIssue, 
  GetJiraIssuesResponse, 
  CreateJiraIssueRequest,
  GetJiraIssuesRequest,
  CreateJiraIssueResponse} 
  from './types'; 


/* ACTIONS */
export function createJiraIssue(formData: FormData): CreateJiraIssueRequest {
  return {
    payload: {
      data: formData,
    },
    type: CreateJiraIssue.REQUEST,
    };
};

export function createJiraIssueSuccess(jiraIssue: JiraIssue): CreateJiraIssueResponse {
  return {
    type: CreateJiraIssue.SUCCESS, 
    payload: {
      jiraIssue
    }
  };
};

export function createJiraIssueFailure(jiraIssue: JiraIssue): CreateJiraIssueResponse {
  return {
    type: CreateJiraIssue.FAILURE, 
    payload: {
      jiraIssue
    }
  };
};

export function getJiraIssues(tableKey: string): GetJiraIssuesRequest {
  return {
    type: GetJiraIssues.REQUEST, 
    payload: {
      key: tableKey
    }
  }; 
}

export function getJiraIssuesSuccess(jiraIssues: JiraIssue[]): GetJiraIssuesResponse {
  return { 
    type: GetJiraIssues.SUCCESS, 
    payload: {
      jiraIssues 
    }
  }
}

export function getJiraIssuesFailure(jiraIssues: JiraIssue[]): GetJiraIssuesResponse {
  return { 
  type: GetJiraIssues.FAILURE, 
  payload: {
    jiraIssues 
  }
  }
}

/* REDUCER */
export interface JiraIssueReducerState {
  jiraIssues: JiraIssue[], 
  isLoading: boolean
};

export const initialJiraIssueState: JiraIssueReducerState = {
  jiraIssues: [], 
  isLoading: false, 
};


/* maybe these should be separate reducers?*/
export default function reducer(state: JiraIssueReducerState = initialJiraIssueState, action): JiraIssueReducerState {
  switch (action.type) {
    case GetJiraIssues.REQUEST: 
      return { jiraIssues: [], isLoading: false }; 
    case GetJiraIssues.FAILURE: 
      return { jiraIssues: [], isLoading: false }; 
    case GetJiraIssues.SUCCESS: 
      return {...state, 
        jiraIssues: (<GetJiraIssuesResponse> action).payload.jiraIssues, 
        isLoading: false}
    case CreateJiraIssue.REQUEST: 
      return {...state, isLoading: true}; 
    case CreateJiraIssue.FAILURE: 
      return {...state,
        isLoading: false}; 
    case CreateJiraIssue.SUCCESS: 
      return {...state,
        jiraIssues: [...state.jiraIssues, (<CreateJiraIssueResponse> action).payload.jiraIssue[0]], 
        isLoading: false}; 
    default: 
      return state; 
  }
}