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
  profilePageUser: User;
}

export function getCurrentUser(): GetCurrentUserRequest {
  return { type: GetCurrentUser.ACTION };
}

export function getUserById(userId: string): GetUserRequest {
  return { userId, type: GetUser.ACTION };
}


const defaultUser = {
  user_id: '',
  display_name: '',
};
const initialState: UserReducerState = {
  currentUser: defaultUser,
  profilePageUser: defaultUser,
};

export default function reducer(state: UserReducerState = initialState, action: UserReducerAction): UserReducerState {
  switch (action.type) {
    case GetCurrentUser.SUCCESS:
      return { ...state, currentUser: action.payload };
    case GetUser.ACTION:
    case GetUser.FAILURE:
      return { ...state, profilePageUser: defaultUser };
    case GetUser.SUCCESS:
      return { ...state, profilePageUser: action.payload };
    default:
      return state;
  }
}
