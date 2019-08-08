import * as React from 'react';
import './styles.scss';

import { GlobalState } from 'ducks/rootReducer';
import { connect } from 'react-redux';
import { ToggleRequestAction } from 'ducks/notification/types';
import { toggleRequest } from 'ducks/notification/reducer';
import { bindActionCreators } from 'redux';
import { REQUEST_DESCRIPTION } from './constants';

interface StateFromProps {
  requestIsOpen: boolean;
}

export interface DispatchFromProps {
  toggleRequest: () => ToggleRequestAction;
}

export type OpenRequestDescriptionProps = StateFromProps & DispatchFromProps;

interface OpenRequestDescriptionState {}

export class OpenRequestDescription extends React.Component<OpenRequestDescriptionProps, OpenRequestDescriptionState> {
  public static defaultProps: Partial<OpenRequestDescriptionProps> = {};

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
      <a className="request-description"
        href="JavaScript:void(0)"
        onClick={ this.openRequest }
      >
       { REQUEST_DESCRIPTION }
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

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(OpenRequestDescription);
