// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import {
    HIT_RUN_TEXT,
    MISSED_RUN_TEXT,
LAST_RUN_SUCCEEDED,} from './constants';

import './styles.scss';

export interface RunStateProps {
    lastRunState: string;
};

const MissedState: React.FC = () => {
    return (
        <div className={'missed'}>
            <div className={'missed-icon'}>
                <div className={'exclamation-top'}/>
                <div className={'exclamation-bottom'}/>
            </div>
            <span className={'status-text body-2 text-primary'}>{MISSED_RUN_TEXT}</span>
        </div>
        );
}

const HitState: React.FC = () => {
    return (
        <div className={'hit'}>
            <div className={'hit-icon'}>
                <img className="icon icon-check" alt="" />
            </div>
            <span className={'status-text body-2 text-primary'}>{HIT_RUN_TEXT}</span>
        </div>
    );
}

const RunStateContainer: React.FC<RunStateProps> = ({lastRunState}:RunStateProps) => {
    if (lastRunState == LAST_RUN_SUCCEEDED) {
        return <HitState/>;
    } else {
        return <MissedState/>;
    }
}

export default RunStateContainer;