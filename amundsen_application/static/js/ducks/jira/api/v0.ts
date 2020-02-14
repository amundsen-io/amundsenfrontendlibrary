import axios, { AxiosResponse, AxiosError } from 'axios';
import { JiraIssue } from 'interfaces'; 

export const API_PATH = '/api/jira/v0';
export type JiraIssueAPI = {jiraIssues: JiraIssue[] };  

export function getJiraIssues(tableKey: string) {
    return axios.get(`${API_PATH}/issues?key=${tableKey}`)
    .then((response: AxiosResponse) => {
      return response.data;
    });
}

export function createJiraIssue(tableKey: string, title: string, description: string) {
    return axios.post(`${API_PATH}/issue`, {
        description: description, 
        key: tableKey, 
        title: title
    }); 
}

