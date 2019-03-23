import axios, { AxiosResponse, AxiosError } from 'axios';

export interface LoggingParams {
  command: string;
  target_id: string;
  target_type?: string;
  label?: string;
  location?: string;
  index?: number;
}

const BASE_URL = '/api/log/v0/log_event';


export function logAction(params: LoggingParams) {
  axios.post(BASE_URL, params)
  .then((response: AxiosResponse) => {
    return response.data;
  })
  .catch((error: AxiosError) => {
    if (error.response) {
      return error.response.data;
    }
  });
}
