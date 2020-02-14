import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import { getJiraIssuesSuccess, getJiraIssuesFailure } from './reducer'; 

import { GetJiraIssues, GetJiraIssuesRequest } from './types'; 

import * as API from './api/v0';

/** maybe just reload the issues content when there is a new issue created?*/

export function* getJiraIssuesWorker(action: GetJiraIssuesRequest): SagaIterator {
    const { key } = action.payload; 
    const state = yield select();
    let jiraIssues = state.jiraIssues; 
    try {
        jiraIssues = yield call(API.getJiraIssues, key); 
        if (action.payload.onSuccess) {
            yield call(action.payload.onSuccess);
        }
    } catch (e) {
        yield put(getJiraIssuesFailure(jiraIssues)); 
    }
}

export function* getJiraIssuesWatcher(): SagaIterator {
    yield takeEvery(GetJiraIssues.REQUEST, getJiraIssuesWorker); 
}