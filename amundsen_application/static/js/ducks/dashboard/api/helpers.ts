import * as API from 'ducks/dashboard/api/v0';
import { Tag } from 'interfaces/Tags';
import { sortTagsAlphabetical } from 'ducks/utilMethods';

/**
 * Parses the response for dashboard data to return an array of sorted table tags
 */
export function getDashboardTagsFromResponseData(responseData: API.GetDashboardAPI): Tag[] {
  return responseData.dashboard.tags.sort(sortTagsAlphabetical);
}
