import { Issue } from "interfaces";

export enum GetIssues {
    REQUEST = 'amundsen/issue/GET_ISSUES_REQUEST',
    SUCCESS = 'amundsen/issue/GET_ISSUES_SUCCESS',
    FAILURE = 'amundsen/issue/GET_ISSUES_FAILURE',
};

export enum CreateIssue {
    REQUEST = 'amundsen/issue/CREATE_ISSUE_REQUEST',
    SUCCESS = 'amundsen/issue/CREATE_ISSUE_SUCCESS',
    FAILURE = 'amundsen/issue/CREATE_ISSUE_FAILURE',
}; 

export interface GetIssuesRequest {
    type: GetIssues.REQUEST; 
    payload: {
        key: string
    }
};
export interface CreateIssueRequest {
    type: CreateIssue.REQUEST;
    payload: {
        key: string, 
        title: string, 
        description: string, 
        resource_name: string, 
        resource_path: string, 
        owners: string[]
    }
};

export interface GetIssuesResponse {
    type: GetIssues.SUCCESS | GetIssues.FAILURE; 
    payload: {
        issues: Issue[]; 
        remainingIssues: number; 
        remainingIssuesUrl: string; 
    }
}; 

export interface CreateIssueResponse {
    type: CreateIssue.SUCCESS | CreateIssue.FAILURE; 
    payload: {
        issue: Issue
    }
}; 