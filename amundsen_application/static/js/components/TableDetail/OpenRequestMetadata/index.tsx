import * as React from 'react';
import './styles.scss';

import { GlobalState } from 'ducks/rootReducer';
import { connect } from 'react-redux';
import { ToggleRequestAction } from 'ducks/notification/types';
import { toggleRequest } from 'ducks/notification/reducer';
import { bindActionCreators } from 'redux';

interface StateFromProps {
  requestIsOpen: boolean;
}

export interface DispatchFromProps {
  toggleRequest: () => ToggleRequestAction;
}

export type OpenRequestMetadataProps = StateFromProps & DispatchFromProps;

interface OpenRequestMetadataState {}

export class OpenRequestMetadata extends React.Component<OpenRequestMetadataProps, OpenRequestMetadataState> {
  public static defaultProps: Partial<OpenRequestMetadataProps> = {};

  constructor(props) {
    super(props);
  }

  openRequest = () => {
    if (!this.props.requestIsOpen) {
      this.props.toggleRequest();
    }
  }

  render() {
    return (
      <a className="open-request"
        href="JavaScript:void(0)"
        onClick={ this.openRequest }
      >
       Request Description
      </a>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  const requestIsOpen = state.notification.requestIsOpen;
  return {
    requestIsOpen,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ toggleRequest } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(OpenRequestMetadata);
