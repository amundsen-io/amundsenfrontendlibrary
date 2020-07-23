// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import Flag, { FlagProps } from 'components/common/Flag';

import './styles.scss';

export class ClickableBadge extends React.Component<FlagProps> {
    render() {
        return (
            <span className='clickable-badge'>
            <Flag
                caseType={this.props.caseType}
                text={this.props.text}
                labelStyle={this.props.labelStyle}
          />
            </span>
        );
    }
}

export default ClickableBadge;