import { ASSOCIATION_TEXT, MAX_TEXT_LENGTH } from '../components/TableDetail/TableIssues/constants';

export function truncateText(issueTitle: string) : string {
  if (!issueTitle) {
    return issueTitle; 
  }
  const truncated = issueTitle.length > MAX_TEXT_LENGTH ? 
    issueTitle.substring(0, MAX_TEXT_LENGTH)  + "...": issueTitle;  
  return '"' + truncated + '"' +  ASSOCIATION_TEXT; 
}