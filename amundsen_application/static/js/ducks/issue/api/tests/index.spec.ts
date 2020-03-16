import axios, { AxiosResponse } from 'axios';
import * as API from '../v0';

jest.mock('axios');

describe('getIssues', () => {
  let mockGetResponse;
  let axiosMock;
  beforeAll(() => {
    mockGetResponse = {
      data: {
       issues: [],
       msg: 'Success'
      },
      status: 200,
      statusText: '',
      headers: {},
      config: {}
    };
    axiosMock = jest.spyOn(axios, 'get').mockImplementation(() => Promise.resolve(mockGetResponse));
  });

  it('calls axios with correct parameters if tableKey provided', async () => {
    expect.assertions(1);
    await API.getIssues('tableKey').then(data => {
      expect(axiosMock).toHaveBeenCalledWith(`${API.API_PATH}/issues?key=tableKey`);
    });
  });

  it('returns response data', async () => {
    expect.assertions(1);
    await API.getIssues('tableKey').then(data => {
      expect(data).toEqual(mockGetResponse.data.issues);
    });
  });

  afterAll(() => {
    axiosMock.mockClear();
  });
});

describe('createIssue', () => {
  let mockGetResponse;
  let axiosMock;
  let formData;
  let key;
  let title;
  let description;  
  const issueResult = { issue_key: 'key' };
  beforeAll(() => {
    mockGetResponse = {
      data: {
       issue: issueResult,
       msg: 'Success'
      },
      status: 200,
      statusText: '',
      headers: {},
      config: {}
    };
    key = 'key', 
    title = 'title', 
    description = 'description' 
    axiosMock = jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve(mockGetResponse));
  });

  it('calls expected endpoint with headers', async () => {
    expect.assertions(1);
    await API.createIssue(key, title, description).then(data => {
      expect(axiosMock).toHaveBeenCalledWith(
        `${API.API_PATH}/issue`,
        formData, {
        headers: {'Content-Type': 'multipart/form-data'}
      });
    });
  });

  it('returns response data', async () => {
    expect.assertions(1);
    await API.createIssue(key, title, description).then(data => {
      expect(data).toEqual(issueResult);
    });
  });

  afterAll(() => {
    axiosMock.mockClear();
  });
});
