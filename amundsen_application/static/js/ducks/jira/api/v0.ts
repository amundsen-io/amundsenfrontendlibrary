import axios, { AxiosResponse } from 'axios';
import { JiraIssue } from 'interfaces'; 

export const API_PATH = '/api/jira/v0';
export type JiraIssueAPI = {jiraIssues: JiraIssue[] };  

export function getJiraIssues(tableKey: string) {
  return axios.get(`${API_PATH}/issues?key=${tableKey}`)
  .then((response: AxiosResponse) => {
    return response.data;
  });
}

export function createJiraIssue(data: FormData) {
  return axios({
    data,
    method: 'post',
    url: `${API_PATH}/issue`,
    headers: {'Content-Type': 'multipart/form-data' }
    }).then((response: AxiosResponse) => {
      return response.data; 
    });
}

