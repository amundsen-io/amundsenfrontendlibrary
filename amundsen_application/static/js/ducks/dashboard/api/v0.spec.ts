import axios, { AxiosResponse } from 'axios';

import * as API from './v0';

jest.mock('axios');

describe('getDashboardPreview', () => {
  let axiosMockGet;
  let testUri;
  let expectedImageSrc;
  beforeAll(() => {
    testUri = 'someUri';
    expectedImageSrc = `${API.DASHBOARD_PREVIEW_BASE}/${testUri}/preview.jpg`;
  })

  it('resolves with object with expected url on success', async () => {
    expect.assertions(1);
    axiosMockGet = jest.spyOn(axios, 'get').mockImplementationOnce(() => Promise.resolve());
    await API.getDashboardPreview(testUri).then(payload => {
      expect(payload).toEqual({ url: expectedImageSrc });
    });
  });

  it('resolves with object with expected url and error infor on failure', async () => {
    expect.assertions(1);
    const mockMessage = 'Something bad happened';
    const mockStatus = 500;
    const mockErrorResponse = {
      response: {
        data: {
         msg: mockMessage
        },
        status: mockStatus,
        statusText: '',
        headers: {},
        config: {}
      }
    };
    axiosMockGet = jest.spyOn(axios, 'get').mockImplementationOnce(() => Promise.reject(mockErrorResponse));
    try {
      const payload = await API.getDashboardPreview(testUri);
    }
    catch(errorPayload) {
      expect(errorPayload).toEqual({
        url: expectedImageSrc,
        errorCode: mockStatus,
        errorMessage: mockMessage
      });
    }
  });
});
