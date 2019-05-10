import {
  AddBookmark,
  AddBookmarkRequest,
  AddBookmarkResponse,
  Bookmark,
  GetBookmarks,
  GetBookmarksForUser,
  GetBookmarksForUserRequest,
  GetBookmarksForUserResponse,
  GetBookmarksRequest,
  GetBookmarksResponse,
  RemoveBookmark,
  RemoveBookmarkRequest,
  RemoveBookmarkResponse,
} from "./types";

export type BookmarkReducerAction =
  AddBookmarkRequest | AddBookmarkResponse |
  GetBookmarksRequest | GetBookmarksResponse |
  GetBookmarksForUserRequest | GetBookmarksForUserResponse |
  RemoveBookmarkRequest | RemoveBookmarkResponse;


export function addBookmark(key: string): AddBookmarkRequest {
  return {
    key,
    type: AddBookmark.ACTION,
  }
}

export function removeBookmark(key: string): RemoveBookmarkRequest {
  return {
    key,
    type: RemoveBookmark.ACTION,
  }
}

export function getBookmarks(): GetBookmarksRequest {
  return {
    type: GetBookmarks.ACTION
  }
}

export function getBookmarksForUser(user: string): GetBookmarksForUserRequest {
  return {
    user,
    type: GetBookmarksForUser.ACTION,
  }
}

 export interface BookmarkReducerState {
  myBookmarks: Bookmark[];
  bookmarksForUser: Bookmark[];
}

 const initialState: BookmarkReducerState = {
  myBookmarks: [
    { key: "hive://gold.core/dim_venues" },
    { key: "hive://gold.redshift/dimension_applicants" }
  ],
  bookmarksForUser: [],
};

 export default function reducer(state: BookmarkReducerState = initialState, action: BookmarkReducerAction): BookmarkReducerState {
  switch(action.type) {
    case AddBookmark.SUCCESS:
    case AddBookmark.FAILURE:
    case RemoveBookmark.SUCCESS:
    case RemoveBookmark.FAILURE:
    case GetBookmarks.SUCCESS:
    case GetBookmarks.FAILURE:
    case GetBookmarksForUser.SUCCESS:
    case GetBookmarksForUser.FAILURE:
    default:
      return state;
  }
}
