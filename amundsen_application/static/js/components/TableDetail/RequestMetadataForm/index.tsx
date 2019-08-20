import * as React from 'react';
import './styles.scss';

import { NotificationType, SendNotificationOptions } from 'interfaces/Notifications';
import { GlobalState } from 'ducks/rootReducer';
import { connect } from 'react-redux';
import {
  TITLE_TEXT,
  FROM_LABEL,
  TO_LABEL,
  REQUEST_TYPE,
  TABLE_DESCRIPTION,
  COLUMN_DESCRIPTIONS,
  ADDITIONAL_DETAILS,
  SEND_BUTTON,
} from './constants'
import { ToggleRequestAction, SubmitNotificationRequest } from 'ducks/notification/types';
import { closeRequestDescriptionDialog, submitNotification } from 'ducks/notification/reducer';
import { bindActionCreators } from 'redux';

interface StateFromProps {
  userEmail: string;
  tableName: string;
  tableOwners: Array<string>;
  requestIsOpen: boolean;
}

export interface DispatchFromProps {
  submitNotification: (
    recipients: Array<string>,
    sender: string,
    notificationType: NotificationType,
    options?: SendNotificationOptions
  ) => SubmitNotificationRequest;
  closeRequestDescriptionDialog: () => ToggleRequestAction;
}

export type RequestMetadataProps = StateFromProps & DispatchFromProps;

interface RequestMetadataState {}

export class RequestMetadataForm extends React.Component<RequestMetadataProps, RequestMetadataState> {
  public static defaultProps: Partial<RequestMetadataProps> = {};

  constructor(props) {
    super(props);
  }

  closeDialog = () => {
    this.props.closeRequestDescriptionDialog();
  }

  submitNotification = (event) => {
    event.preventDefault();
    const form = document.getElementById("RequestForm") as HTMLFormElement;
    const formData = new FormData(form);
    const recipientString = formData.get('recipients') as string
    const recipients = recipientString.split(",")
    const sender = formData.get('sender') as string;
    const descriptionRequested = formData.get('table-description') === "on" ? true : false;
    const fieldsRequested = formData.get('column-description') === "on" ? true : false;
    const comment = formData.get('comment') as string;
    this.props.submitNotification(
      recipients,
      sender,
      NotificationType.REQUESTED,
      {
        comment,
        resource_name: this.props.tableName,
        resource_url: window.location.href,
        description_requested: descriptionRequested,
        fields_requested: fieldsRequested,
      }
    )
  };

  render() {
    if (!this.props.requestIsOpen) {
      return (null);
    }
    return (
      <div className={`request-component expanded`}>
        <div className="form-group request-header">
          <h3 className="title">{TITLE_TEXT}</h3>
          <button type="button" className="btn btn-close" aria-label={"Close"} onClick={this.closeDialog}/>
        </div>
        <form onSubmit={ this.submitNotification } id="RequestForm">
          <div className="form-group">
            <label>{FROM_LABEL}</label>
            <input type="email" name="sender" className="form-control" required={true} value={this.props.userEmail}/>
          </div>
          <div className="form-group">
            <label>{TO_LABEL}</label>
            <input type="email" name="recipients" className="form-control" required={true} multiple={true} defaultValue={this.props.tableOwners.join(",")}/>
          </div>
          <div className="form-group">
            <label>{REQUEST_TYPE}</label>
            <label className="select-label"><input type="checkbox" name="table-description"/> {TABLE_DESCRIPTION}</label>
            <label className="select-label"><input type="checkbox" name="column-description"/> {COLUMN_DESCRIPTIONS}</label>
          </div>
          <div className="form-group">
            <label>{ADDITIONAL_DETAILS}</label>
            <textarea className="form-control" name="comment" rows={ 8 } maxLength={ 2000 } />
          </div>
          <button className="btn btn-primary" type="submit">
            {SEND_BUTTON}
          </button>
        </form>
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  const userEmail = state.user.loggedInUser.email;
  const tableName = `${state.tableMetadata.tableData.schema}.${state.tableMetadata.tableData.table_name}`;
  const ownerObj = state.tableMetadata.tableOwners.owners;
  const requestIsOpen = state.notification.requestIsOpen;
  return {
    userEmail,
    tableName,
    requestIsOpen,
    tableOwners: Object.keys(ownerObj),
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ submitNotification, closeRequestDescriptionDialog } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(RequestMetadataForm);
