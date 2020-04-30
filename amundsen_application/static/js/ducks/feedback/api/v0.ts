import axiosInstance from 'axiosInstance/instance';

export function submitFeedback(data: FormData) {
  return axiosInstance({
    data,
    method: 'post',
    url: '/api/mail/v0/feedback',
    headers: {'Content-Type': 'multipart/form-data' }
  });
}
