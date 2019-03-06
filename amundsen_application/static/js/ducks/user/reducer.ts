import {
  GetCurrentUser,
  GetCurrentUserRequest,
  GetCurrentUserResponse,
  GetUser,
  GetUserRequest,
  GetUserResponse,
  CurrentUser, User
} from './types';

type UserReducerAction =
  GetCurrentUserRequest | GetCurrentUserResponse |
  GetUserRequest | GetUserResponse ;

export interface UserReducerState {
  currentUser: CurrentUser;
  isLoading: boolean;
  profilePageUser: User;
}

export function getCurrentUser(): GetCurrentUserRequest {
  return { type: GetCurrentUser.ACTION };
}

export function getUserById(userId: string): GetUserRequest {
  return { userId, type: GetUser.ACTION };
}


const initialState: UserReducerState = {
  currentUser: {
    user_id: '',
    display_name: '',
  },
  isLoading: true,
  profilePageUser: {
    user_id: '',
    display_name: '',
  },
};

export default function reducer(state: UserReducerState = initialState, action: UserReducerAction): UserReducerState {
  switch (action.type) {
    case GetCurrentUser.SUCCESS:
      return { ...state, currentUser: action.payload };
    case GetUser.ACTION:
      return { ...state, isLoading: true }
    case GetUser.FAILURE:
      return { ...state, isLoading: false };
    case GetUser.SUCCESS:
      return { ...state, isLoading: false, profilePageUser: action.payload };
    default:
      return state;
  }
}
