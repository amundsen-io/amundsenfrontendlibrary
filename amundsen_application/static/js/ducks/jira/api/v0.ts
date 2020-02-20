import axios, { AxiosResponse } from 'axios';

export const API_PATH = '/api/jira/v0';

export function getJiraIssues(tableKey: string) {
  return axios.get(`${API_PATH}/issues?key=${tableKey}`)
  .then((response: AxiosResponse) => {
    return response.data;
  });
}

export function createJiraIssue(data: FormData) {
  const headers =  {'Content-Type': 'multipart/form-data' };
  return axios.post(`${API_PATH}/issue`, data, { headers }
    ).then((response: AxiosResponse) => {
      return response.data.jiraIssue[0]; 
    });
}

