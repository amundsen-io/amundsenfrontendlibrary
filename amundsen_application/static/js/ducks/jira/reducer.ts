import { JiraIssue } from "interfaces";
import { GetJiraIssues, CreateJiraIssue, CreateJiraIssueResponse } from './types'; 

/* REDUCER */
export interface JiraIssueReducerState {
    issues: JiraIssue[], 
    isLoading: boolean, 
    isOpen: boolean
};

export const initialJiraIssueState: JiraIssueReducerState = {
    issues: [], 
    isLoading: true, 
    isOpen: false
};

export default function reducer(state: JiraIssueReducerState, action): JiraIssueReducerState {
    switch (action.type) {
        case GetJiraIssues.REQUEST: 
            return { issues: [], isLoading: true, isOpen: false }; 
        case GetJiraIssues.FAILURE: 
        case GetJiraIssues.SUCCESS: 
        case CreateJiraIssue.REQUEST: 
            return {...state}; 
        case CreateJiraIssue.FAILURE: 
        case CreateJiraIssue.SUCCESS: 
            return {...state, issues: [(<CreateJiraIssueResponse>action).payload.issue], isLoading: false, isOpen: false}; 
        default: 
            return state; 
    }
}