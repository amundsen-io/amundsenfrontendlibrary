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

export function createJiraIssueSuccess(issue: JiraIssue): CreateJiraIssueResponse {
  return {
    type: CreateJiraIssue.SUCCESS, 
    payload: {
      issue
    }
  };
};

export function createJiraIssueFailure(): CreateJiraIssueResponse {
  return {
    type: CreateJiraIssue.FAILURE, 
    payload: {
      issue: null
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

export function getJiraIssuesSuccess(issues: JiraIssue[]): GetJiraIssuesResponse {
  return { 
    type: GetJiraIssues.SUCCESS, 
    payload: {
      issues
    }
  }
}

export function getJiraIssuesFailure(): GetJiraIssuesResponse {
  return { 
    type: GetJiraIssues.FAILURE, 
    payload: {
      issues: []
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
        jiraIssues: (<GetJiraIssuesResponse> action).payload.issues, 
        isLoading: false}
    case CreateJiraIssue.REQUEST: 
      return {...state, isLoading: true}; 
    case CreateJiraIssue.FAILURE: 
      return {...state,
        isLoading: false}; 
    case CreateJiraIssue.SUCCESS: 
      return {...state,
        jiraIssues: [(<CreateJiraIssueResponse> action).payload.issue, ...state.jiraIssues],
        isLoading: false}; 
    default: 
      return state; 
  }
}
