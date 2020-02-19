import { SagaIterator } from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';

import { getJiraIssuesSuccess, getJiraIssuesFailure, createJiraIssueSuccess, createJiraIssueFailure } from './reducer'; 

import { GetJiraIssues, GetJiraIssuesRequest, CreateJiraIssue, CreateJiraIssueRequest } from './types'; 

import * as API from './api/v0';

/** maybe just reload the issues content when there is a new issue created?*/

export function* getJiraIssuesWorker(action: GetJiraIssuesRequest): SagaIterator {
    const { key } = action.payload; 
    let response;
    try {
        response = yield call(API.getJiraIssues, key); 
        yield put(getJiraIssuesSuccess(response.jiraIssues)); 
    } catch(e) {
        yield put(getJiraIssuesFailure()); 
    }
}

export function* getJiraIssuesWatcher(): SagaIterator {
    yield takeEvery(GetJiraIssues.REQUEST, getJiraIssuesWorker); 
}

export function* createJiraIssueWorker(action: CreateJiraIssueRequest): SagaIterator {
  try { 
    let response;
    response = yield call(API.createJiraIssue, action.payload.data);
    yield put((createJiraIssueSuccess(response.jiraIssue)));
  } catch(error) {
    yield put(createJiraIssueFailure());
  }
}

export function* createJiraIssueWatcher(): SagaIterator {
    yield takeEvery(CreateJiraIssue.REQUEST, createJiraIssueWorker)
}
