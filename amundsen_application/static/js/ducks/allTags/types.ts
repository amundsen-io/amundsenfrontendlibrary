import { TagsInterface } from 'interfaces/Tags';

export enum GetAllTags {
  REQUEST = 'amundsen/allTags/GET_ALL_TAGS_REQUEST',
  SUCCESS = 'amundsen/allTags/GET_ALL_TAGS_SUCCESS',
  FAILURE = 'amundsen/allTags/GET_ALL_TAGS_FAILURE',
}
export interface GetAllTagsRequest {
  type: GetAllTags.REQUEST;
}
export interface GetAllTagsResponse {
  type: GetAllTags.SUCCESS | GetAllTags.FAILURE;
  payload: {
    tags: TagsInterface.Tag[];
  };
}
