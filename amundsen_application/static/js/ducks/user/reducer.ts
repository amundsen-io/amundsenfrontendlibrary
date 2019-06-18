import {
  GetLoggedInUser, GetLoggedInUserRequest, GetLoggedInUserResponse,
  GetUser, GetUserRequest, GetUserResponse,
  GetUserOwn, GetUserOwnRequest, GetUserOwnResponse,
  GetUserRead, GetUserReadRequest, GetUserReadResponse,
  LoggedInUser,
  User,
} from './types';
import { Resource } from 'interfaces';

type UserReducerAction =
  GetLoggedInUserRequest | GetLoggedInUserResponse |
  GetUserRequest | GetUserResponse |
  GetUserOwnRequest | GetUserOwnResponse |
  GetUserReadRequest | GetUserReadResponse;

export interface UserReducerState {
  loggedInUser: LoggedInUser;
  profile: {
    own: Resource[],
    read: Resource[],
    user: User,
  };
}

export function getLoggedInUser(): GetLoggedInUserRequest {
  return { type: GetLoggedInUser.ACTION };
}

export function getUserById(userId: string): GetUserRequest {
  return { userId, type: GetUser.ACTION };
}

export function getUserOwn(userId: string): GetUserOwnRequest {
  return { type: GetUserOwn.REQUEST, payload: { userId } }
}

export function getUserRead(userId: string): GetUserReadRequest {
  return { type: GetUserRead.REQUEST, payload: { userId } }
}


const defaultUser = {
  display_name: '',
  email: '',
  employee_type: '',
  first_name: '',
  full_name: '',
  github_username: '',
  is_active: true,
  last_name: '',
  manager_fullname: '',
  profile_url: '',
  role_name: '',
  slack_id: '',
  team_name: '',
  user_id: '',
};
const initialState: UserReducerState = {
  loggedInUser: defaultUser,
  profile: {
    own: [],
    read: [],
    user: defaultUser,
  },
};

export default function reducer(state: UserReducerState = initialState, action: UserReducerAction): UserReducerState {
  switch (action.type) {
    case GetLoggedInUser.SUCCESS:
      return { ...state, loggedInUser: action.payload };
    case GetUser.ACTION:
    case GetUser.FAILURE:
      return {
        ...state,
        profile: {
          ...state.profile,
          user: defaultUser,
        },
      };
    case GetUser.SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          user: action.payload,
        },
      };

    case GetUserOwn.REQUEST:
    case GetUserOwn.FAILURE:
      return {
        ...state,
        profile: {
          ...state.profile,
          own: [],
        }
      };
    case GetUserOwn.SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
        }
      };

    case GetUserRead.REQUEST:
    case GetUserRead.FAILURE:
      return {
        ...state,
        profile: {
          ...state.profile,
          read: [],
        }
      };
    case GetUserRead.SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload,
        }
      };

    default:
      return state;
  }
}
