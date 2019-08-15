import * as React from 'react';
import './styles.scss';

import { GlobalState } from 'ducks/rootReducer';
import { connect } from 'react-redux';
import { ToggleRequestAction } from 'ducks/notification/types';
import { openRequestDescriptionDialog } from 'ducks/notification/reducer';
import { bindActionCreators } from 'redux';
import { REQUEST_DESCRIPTION } from './constants';

interface StateFromProps {}

export interface DispatchFromProps {
  openRequestDescriptionDialog: () => ToggleRequestAction;
}

export type OpenRequestDescriptionProps = StateFromProps & DispatchFromProps;

interface OpenRequestDescriptionState {}

export class OpenRequestDescription extends React.Component<OpenRequestDescriptionProps, OpenRequestDescriptionState> {
  public static defaultProps: Partial<OpenRequestDescriptionProps> = {};

  constructor(props) {
    super(props);
  }

  openRequest = () => {
    this.props.openRequestDescriptionDialog();
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

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ openRequestDescriptionDialog } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(null, mapDispatchToProps)(OpenRequestDescription);
