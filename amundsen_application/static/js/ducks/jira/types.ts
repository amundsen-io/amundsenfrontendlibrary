import { JiraIssue } from "interfaces";

export enum GetJiraIssues {
    REQUEST = 'amundsen/jira/GET_JIRA_ISSUES_REQUEST',
    SUCCESS = 'amundsen/jira/GET_JIRA_ISSUES_SUCCESS',
    FAILURE = 'amundsen/jira/GET_JIRA_ISSUES_FAILURE',
};

export enum CreateJiraIssue {
    REQUEST = 'amundsen/jira/CREATE_JIRA_ISSUE_REQUEST',
    SUCCESS = 'amundsen/jira/CREATE_JIRA_ISSUE_SUCCESS',
    FAILURE = 'amundsen/jira/CREATE_JIRA_ISSUE_FAILURE',
}; 

export interface GetJiraIssuesRequest {
    type: GetJiraIssues.REQUEST; 
    payload: {
        key: string
    }
};
export interface CreateJiraIssueRequest {
    type: CreateJiraIssue.REQUEST;
    payload: {
        data: FormData
    }
};

export interface GetJiraIssuesResponse {
    type: GetJiraIssues.SUCCESS | GetJiraIssues.FAILURE; 
    payload: {
        jiraIssues: JiraIssue[]; 
    }
}; 

export interface CreateJiraIssueResponse {
    type: CreateJiraIssue.SUCCESS | CreateJiraIssue.FAILURE; 
    payload: {
        jiraIssue: JiraIssue
    }
}; 