import axiosInstance from 'axiosInstance/instance';

import * as API from '../v0';

jest.mock('axiosInstance');

describe('submitFeedback', () => {
  let formData: FormData;
  beforeAll(() => {
    formData = new FormData();
    API.submitFeedback(formData);
  });

  it('calls axios with expected payload', () => {
    expect(axiosInstance).toHaveBeenCalledWith({
      data: formData,
      method: 'post',
      url: '/api/mail/v0/feedback',
      headers: {'Content-Type': 'multipart/form-data' }
    })
  });
});
