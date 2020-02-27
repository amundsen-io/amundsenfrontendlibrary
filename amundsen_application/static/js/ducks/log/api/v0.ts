import axios from 'axios';

export interface ActionLogParams {
  command?: string;
  target_id?: string;
  target_type?: string;
  label?: string;
  location?: string;
  value?: string;
}

export interface SearchActionParams extends ActionLogParams {
  search_term: string;
};

export interface PaginationActionParams extends ActionLogParams {
  page_index: number;
};

export interface FilterActionParams extends ActionLogParams {
  filter_category: string;
  filter_value?: any;
};

export const BASE_URL = '/api/log/v0/log_event';

/* TODO: Consider what we want to do on success/failure, if anything */
export function postActionLog(params: ActionLogParams) {
  axios.post(BASE_URL, params);
};
