import axios, { AxiosResponse } from 'axios';
import { Issue } from 'interfaces';

export const API_PATH = '/api/issue';

export type IssuesAPI = {
  issues: {
    issues: Issue[]; 
    remaining: number;  
    remaining_url: string; 
  }
}

export type IssueApi = {
  issue: Issue; 
}

export function getIssues(tableKey: string) {
  return axios.get(`${API_PATH}/issues?key=${tableKey}`)
  .then((response: AxiosResponse<IssuesAPI>) => {
    return response.data.issues;
  });
}

export function createIssue(key: string, title: string, description: string) {
  return axios.post(`${API_PATH}/issue`, {data: 
    key, 
    title, 
    description
  }
    ).then((response: AxiosResponse<IssueApi>) => {
      return response.data.issue; 
    });
}

