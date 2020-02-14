export interface JiraIssue {
    create_date: string;
    issue_key: string;
    last_updated: string;
    title: string;
    url: string;
};

export interface JiraIssuesData {
    key: string; 
}

export interface JiraIssueData {
    key: string; 
    title: string; 
    description: string; 
}