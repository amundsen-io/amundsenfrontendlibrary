import axios, { AxiosResponse, AxiosError } from 'axios';
import { JiraIssue } from 'interfaces'; 


export const API_PATH = '/api/jira/v0';
export type JiraIssueAPI = {jiraIssues: JiraIssue[] };  

export function getJiraIssues(tableKey: string) {
    axios.get(`${API_PATH}/issues?key=${this.props.tableKey}`)
    .then((response: AxiosResponse<JiraIssueAPI>) => {
        return response.data.jiraIssues; 
    });
}

export function createJiraIssue(tableKey: string, title: string, description: string) {
    return axios.post(`${API_PATH}/issue`, {
        description: description, 
        key: tableKey, 
        title: title
    }); 
}