// Setting up different types for now so we can iterate faster as shared params change
import { Resource } from 'interfaces';

export interface User {
  email: string;
  employee_type: string;
  display_name: string;
  first_name: string;
  full_name: string;
  github_username: string;
  is_active: boolean;
  last_name: string;
  manager_fullname: string;
  profile_url: string;
  role_name?: string;
  slack_id: string;
  team_name: string;
  user_id: string;
}
export type LoggedInUser = User & {};

export type LoggedInUserResponse = { user: LoggedInUser; msg: string; };
export type UserResponse = { user: User; msg: string; };
export type UserOwnResponse = { own: Resource[], msg: string; };
export type UserReadResponse = { read: Resource[], msg: string; };


/* getLoggedInUser */
export enum GetLoggedInUser {
  ACTION = 'amundsen/current_user/GET_ACTION',
  SUCCESS = 'amundsen/current_user/GET_SUCCESS',
  FAILURE = 'amundsen/current_user/GET_FAILURE',
}

export interface GetLoggedInUserRequest {
  type: GetLoggedInUser.ACTION;
}

export interface GetLoggedInUserResponse {
  type: GetLoggedInUser.SUCCESS | GetLoggedInUser.FAILURE;
  payload?: LoggedInUser;
}

/* getUserById */
export enum GetUser {
  ACTION = 'amundsen/user/GET_ACTION',
  SUCCESS = 'amundsen/user/GET_SUCCESS',
  FAILURE = 'amundsen/user/GET_FAILURE',
}

export interface GetUserRequest {
  type: GetUser.ACTION;
  userId: string;
}

export interface GetUserResponse {
  type: GetUser.SUCCESS | GetUser.FAILURE;
  payload?: User;
}


/* getUserOwn */
export enum GetUserOwn {
  REQUEST = 'amundsen/user/own/GET_REQUEST',
  SUCCESS = 'amundsen/user/own/GET_SUCCESS',
  FAILURE = 'amundsen/user/own/GET_FAILURE',
}

export interface GetUserOwnRequest {
  type: GetUserOwn.REQUEST;
  payload: {
    userId: string;
  }
}

export interface GetUserOwnResponse {
  type: GetUserOwn.SUCCESS | GetUserOwn.FAILURE;
  payload?: {
    own: Resource[];
  }
}

/* getUserRead */
export enum GetUserRead {
  REQUEST = 'amundsen/user/read/GET_REQUEST',
  SUCCESS = 'amundsen/user/read/GET_SUCCESS',
  FAILURE = 'amundsen/user/read/GET_FAILURE',
}

export interface GetUserReadRequest {
  type: GetUserRead.REQUEST;
  payload: {
    userId: string;
  }
}

export interface GetUserReadResponse {
  type: GetUserRead.SUCCESS | GetUserRead.FAILURE;
  payload?: {
    read: Resource[];
  }
}
