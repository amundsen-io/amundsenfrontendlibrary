import {
  AddBookmark,
  AddBookmarkRequest,
  AddBookmarkResponse,
  Bookmark,
  GetBookmarks,
  GetBookmarksRequest,
  GetBookmarksResponse,
  GetBookmarksForUser,
  GetBookmarksForUserRequest,
  GetBookmarksForUserResponse,
  RemoveBookmark,
  RemoveBookmarkRequest,
  RemoveBookmarkResponse,
} from "./types";


export type BookmarkReducerAction =
  AddBookmarkRequest | AddBookmarkResponse |
  GetBookmarksRequest | GetBookmarksResponse |
  GetBookmarksForUserRequest | GetBookmarksForUserResponse |
  RemoveBookmarkRequest | RemoveBookmarkResponse;

// TODO - It's not clear what the bookmark format will be
interface BookmarkCache {
  list: Bookmark[];
  set: Set<string>;
}

export interface BookmarkReducerState {
  // TODO - Think of better names for these
  myBookmarks: BookmarkCache;
  bookmarksForUser: Bookmark[];
}

const initialState: BookmarkReducerState = {
  myBookmarks: {
    list: [],
    set: new Set(),
  },
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
      return state;
  }
}
