import axios, { AxiosResponse } from 'axios';
import * as API from '../v0';

jest.mock('axios');

describe('getJiraIssues', () => {
  let mockGetResponse;
  let axiosMock;
  beforeAll(() => {
    mockGetResponse = {
      data: {
       jiraIssues: [],
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
    await API.getJiraIssues('tableKey').then(data => {
      expect(axiosMock).toHaveBeenCalledWith(`${API.API_PATH}/issues?key=tableKey`);
    });
  });

  it('returns response data', async () => {
    expect.assertions(1);
    await API.getJiraIssues('tableKey').then(data => {
      expect(data).toEqual(mockGetResponse.data);
    });
  });

  afterAll(() => {
    axiosMock.mockClear();
  });
});


describe('createJiraIssue', () => {
  let formData: FormData;
  let axiosMock;
  let mockPostResponse;
  beforeAll(() => {
    formData = new FormData();
    mockPostResponse = {
      data: {
       jiraIssue: [],
       msg: 'Success'
      },
      status: 200,
      statusText: '',
      headers: {},
      config: {}
    };
    axiosMock = jest.spyOn(axios, 'post').mockImplementation(() => Promise.resolve(mockPostResponse));
  });

  it('calls axios with expected payload', async () => {
    expect.assertions(1);
    await API.createJiraIssue(formData).then(data => {
      expect(axios).toHaveBeenCalledWith({
        data: formData,
        method: 'post',
        url: `${API.API_PATH}/issue`,
        headers: {'Content-Type': 'multipart/form-data' }
      });
    });
  });
});