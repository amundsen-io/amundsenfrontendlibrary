import axiosInstance from 'axiosInstance/instance';

import * as API from '../v0';

jest.mock('axiosInstance');

describe('postActionLog', () => {
  let axiosMock;
  let params: API.ActionLogParams;
  beforeAll(() => {
    axiosMock = jest.spyOn(axiosInstance, 'post').mockImplementation(() => Promise.resolve());
    params = {};
    API.postActionLog(params);
  });

  it('calls axios with expected parameters',() => {
    expect(axiosMock).toHaveBeenCalledWith(API.BASE_URL, params);
  });

  afterAll(() => {
    axiosMock.mockClear();
  })
});
