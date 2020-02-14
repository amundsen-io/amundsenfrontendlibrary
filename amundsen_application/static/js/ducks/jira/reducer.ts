import { JiraIssue } from "interfaces";
import { 
    GetJiraIssues, 
    CreateJiraIssue, 
    GetJiraIssuesResponse, 
    CreateJiraIssueRequest,
    GetJiraIssuesRequest} 
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
    isLoading: boolean, 
    isOpen: boolean
};

export const initialJiraIssueState: JiraIssueReducerState = {
    jiraIssues: [], 
    isLoading: true, 
    isOpen: false, 
};


/* maybe these should be separate reducers?*/
export default function reducer(state: JiraIssueReducerState = initialJiraIssueState, action): JiraIssueReducerState {
    switch (action.type) {
        case GetJiraIssues.REQUEST: 
            return { jiraIssues: [], isLoading: true, isOpen: false }; 
        case GetJiraIssues.FAILURE: 
        case GetJiraIssues.SUCCESS: 
            return {...state, jiraIssues: (<GetJiraIssuesResponse> action).payload.jiraIssues, isLoading: false, isOpen: false}
        case CreateJiraIssue.REQUEST: 
            return {...state}; 
        case CreateJiraIssue.FAILURE: 
        case CreateJiraIssue.SUCCESS: 
            return {...state, jiraIssues: [], isLoading: true, isOpen: false}; 
        default: 
            return state; 
    }
}