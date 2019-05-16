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


export function addBookmark(resourceKey: string, resourceType: string): AddBookmarkRequest {
  return {
    resourceKey,
    resourceType,
    type: AddBookmark.ACTION,
  }
}

export function removeBookmark(resourceKey: string, resourceType: string): RemoveBookmarkRequest {
  return {
    resourceKey,
    resourceType,
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
  myBookmarks: [],
  bookmarksForUser: [],
};

 export default function reducer(state: BookmarkReducerState = initialState, action: BookmarkReducerAction): BookmarkReducerState {
  switch(action.type) {
    case AddBookmark.SUCCESS:
    case AddBookmark.FAILURE:
      return;
    case RemoveBookmark.SUCCESS:
      let { resourceKey, resourceType } = action.payload;
      return {
        ...state,
        myBookmarks: state.myBookmarks.filter((bookmark) => bookmark.key !== resourceKey)
      };


    case RemoveBookmark.FAILURE:
      return;
    case GetBookmarks.SUCCESS:
      return { ...state, myBookmarks: action.payload };


    case GetBookmarks.FAILURE:
    case GetBookmarksForUser.SUCCESS:
    case GetBookmarksForUser.FAILURE:
    default:
      return state;
  }
}
