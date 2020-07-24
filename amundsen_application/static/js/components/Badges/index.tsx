// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { OverlayTrigger } from 'react-bootstrap';

import Flag, { FlagProps } from 'components/common/Flag';
import { ResourceType } from 'interfaces';
import { updateSearchState } from 'ducks/search/reducer';
import { UpdateSearchStateRequest } from 'ducks/search/types';
import { logClick } from 'ducks/utilMethods';

import './styles.scss';

export interface DispatchFromProps {
    searchBadge: (badgeText: string) => UpdateSearchStateRequest;
}

export type ClickableBadgeProps = FlagProps & DispatchFromProps;

export class ClickableBadge extends React.Component<ClickableBadgeProps> {

    onClick = (e) => {
        const badgeText = this.props.text;
        logClick(e, {
          target_type: 'badge',
          label: name,
        });
        this.props.searchBadge(badgeText);
    } 

    render() {
        return (
            <span
            className={`clickable-badge-${this.props.labelStyle}`}
            onClick={this.onClick}
            >
            <OverlayTrigger
            trigger={['hover', 'focus']}
            placement='top'
            overlay={<span>
                className={`overlay-${this.props.labelStyle}`}
            </span>
                    }>
                <Flag
                    caseType={this.props.caseType}
                    text={this.props.text}
                    labelStyle={this.props.labelStyle}
            />
          </OverlayTrigger>
            </span>
        );
    }
}

export const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators(
      {
        searchBadge: (badgeText: string) =>
          updateSearchState({
            filters: {
              [ResourceType.dashboard]: { badge: badgeText },
              [ResourceType.table]: { badge: badgeText },
            },
            submitSearch: true,
          }),
      },
      dispatch
    );
  };

export default connect<null, DispatchFromProps>(
    null,
    mapDispatchToProps
  )(ClickableBadge);
