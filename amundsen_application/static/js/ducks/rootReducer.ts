import { combineReducers } from 'redux';

import announcements, { AnnouncementsReducerState } from './announcements/reducer';
import feedback, { FeedbackReducerState } from './feedback/reducer';
import popularTables, { PopularTablesReducerState } from './popularTables/reducer';
import search, { SearchReducerState } from './search/reducer';
import tableMetadata, { TableMetadataReducerState } from './tableMetadata/reducer';
import allTags, { AllTagsReducerState } from './allTags/reducer';
import user, { UserReducerState } from './user/reducer';
import bookmarks, { BookmarkReducerState } from "./bookmark/reducer";
import notification, { NotificationReducerState } from './notification/reducer';
import dashboard, { DashboardReducerState } from 'ducks/dashboard/reducer';

export interface GlobalState {
  announcements: AnnouncementsReducerState;
  bookmarks: BookmarkReducerState;
  dashboard: DashboardReducerState;
  feedback: FeedbackReducerState;
  notification: NotificationReducerState;
  popularTables: PopularTablesReducerState;
  search: SearchReducerState;
  tableMetadata: TableMetadataReducerState;
  allTags: AllTagsReducerState;
  user: UserReducerState;
}

export default combineReducers<GlobalState>({
  announcements,
  bookmarks,
  dashboard,
  feedback,
  notification,
  popularTables,
  search,
  tableMetadata,
  allTags,
  user,
});
