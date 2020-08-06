import { AnnouncementPost } from 'interfaces';

import {
  GetAnnouncements,
  GetAnnouncementsRequest,
  GetAnnouncementsResponse,
  GetAnnouncementsPayload,
} from './types';

/* ACTIONS */
export function getAnnouncements(): GetAnnouncementsRequest {
  return { type: GetAnnouncements.REQUEST };
}
export function getAnnouncementsFailure(): GetAnnouncementsResponse {
  return { type: GetAnnouncements.FAILURE, payload: { posts: [] } };
}
export function getAnnouncementsSuccess(
  payload: GetAnnouncementsPayload
): GetAnnouncementsResponse {
  return {
    type: GetAnnouncements.SUCCESS,
    payload,
  };
}

/* REDUCER */
export interface AnnouncementsReducerState {
  posts: AnnouncementPost[];
  isLoading: boolean;
  statusCode: number;
}

export const initialState: AnnouncementsReducerState = {
  posts: [],
  isLoading: true,
  statusCode: null,
};

export default function reducer(
  state: AnnouncementsReducerState = initialState,
  action
): AnnouncementsReducerState {
  switch (action.type) {
    case GetAnnouncements.REQUEST:
      return {
        ...state,
        statusCode: null,
        isLoading: true,
      };
    case GetAnnouncements.FAILURE:
      return initialState;
    case GetAnnouncements.SUCCESS:
      return {
        ...state,
        isLoading: false,
        statusCode: action.payload.statusCode,
        posts: (<GetAnnouncementsResponse>action).payload.posts,
      };
    default:
      return state;
  }
}
