import { Issue } from "interfaces";
import { 
  GetIssues, 
  CreateIssue, 
  GetIssuesResponse, 
  CreateIssueRequest,
  GetIssuesRequest,
  CreateIssueResponse} 
  from './types'; 


/* ACTIONS */
export function createIssue(formData: FormData): CreateIssueRequest {
  return {
    payload: {
      data: formData,
    },
    type: CreateIssue.REQUEST,
    };
};

export function createIssueSuccess(issue: Issue): CreateIssueResponse {
  return {
    type: CreateIssue.SUCCESS, 
    payload: {
      issue
    }
  };
};

export function createIssueFailure(): CreateIssueResponse {
  return {
    type: CreateIssue.FAILURE, 
    payload: {
      issue: null
    }
  };
};

export function getIssues(tableKey: string): GetIssuesRequest {
  return {
    type: GetIssues.REQUEST, 
    payload: {
      key: tableKey
    }
  }; 
}

export function getIssuesSuccess(issues: Issue[], remainingIssues?: number, remainingIssuesUrl?: string): GetIssuesResponse {
  return { 
    type: GetIssues.SUCCESS, 
    payload: {
      issues, 
      remainingIssues, 
      remainingIssuesUrl
    }
  }
}

export function getIssuesFailure(): GetIssuesResponse {
  return { 
    type: GetIssues.FAILURE, 
    payload: {
      issues: [], 
      remainingIssues: 0,
      remainingIssuesUrl: null
    }
  }
}

/* REDUCER */
export interface IssueReducerState {
  issues: Issue[], 
  remainingIssuesUrl: string,
  remainingIssues: number, 
  isLoading: boolean
};

export const initialIssuestate: IssueReducerState = {
  issues: [], 
  remainingIssuesUrl: null, 
  remainingIssues: 0, 
  isLoading: false, 
};


/* maybe these should be separate reducers?*/
export default function reducer(state: IssueReducerState = initialIssuestate, action): IssueReducerState {
  switch (action.type) {
    case GetIssues.REQUEST: 
      return { issues: [], remainingIssuesUrl: null, remainingIssues: 0, isLoading: true }; 
    case GetIssues.FAILURE: 
      return { issues: [], remainingIssuesUrl: null, remainingIssues: 0, isLoading: false }; 
    case GetIssues.SUCCESS: 
      return {...state, 
        ...(<GetIssuesResponse> action).payload, 
        isLoading: false}
    case CreateIssue.REQUEST: 
      return {...state, isLoading: true}; 
    case CreateIssue.FAILURE: 
      return {...state,
        isLoading: false
      }; 
    case CreateIssue.SUCCESS: 
      return {...state,
        issues: [(<CreateIssueResponse> action).payload.issue, ...state.issues],
        isLoading: false } 
    default: 
      return state; 
  }
}
