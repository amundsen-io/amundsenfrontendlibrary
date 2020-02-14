import { SagaIterator } from 'redux-saga';
import { call, put, select, takeEvery } from 'redux-saga/effects';

import { getJiraIssuesSuccess, getJiraIssuesFailure } from './reducer'; 

import { GetJiraIssues, GetJiraIssuesRequest } from './types'; 

import * as API from './api/v0';

/** maybe just reload the issues content when there is a new issue created?*/

export function* getJiraIssuesWorker(action: GetJiraIssuesRequest): SagaIterator {
    const { key } = action.payload; 
    let response;
    try {
        response = yield call(API.getJiraIssues, key); 
        yield put(getJiraIssuesSuccess(response.jiraIssues)); 
    } catch(e) {
        yield put(getJiraIssuesFailure(response.jiraIssues)); 
    }
}

export function* getJiraIssuesWatcher(): SagaIterator {
    yield takeEvery(GetJiraIssues.REQUEST, getJiraIssuesWorker); 
}