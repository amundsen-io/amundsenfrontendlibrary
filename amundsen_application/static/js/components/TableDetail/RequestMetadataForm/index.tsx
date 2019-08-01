import * as React from 'react';
import './styles.scss';

import { NotificationType, SendNotificationOptions } from 'interfaces/Notifications';
import { GlobalState } from 'ducks/rootReducer';
import { connect } from 'react-redux';
import {
  TITLE_TEXT,
  FROM,
  TO,
  REQUEST_TYPE,
  TABLE_DESCRIPTION,
  COLUMN_DESCRIPTIONS,
  ADDITIONAL_DETAILS,
  SEND_BUTTON,
} from './constants'
import { SubmitNotificationRequest } from 'ducks/notification/types';
import { submitNotification } from 'ducks/notification/reducer';
import { bindActionCreators } from 'redux';

interface StateFromProps {
  userEmail: string;
  tableName: string;
  tableOwners: Array<string>;
}

export interface DispatchFromProps {
  submitNotification: (
    recipients: Array<string>,
    sender: string,
    notificationType: NotificationType,
    options?: SendNotificationOptions
  ) => SubmitNotificationRequest;
}

type RequestMetadataProps = StateFromProps & DispatchFromProps;

interface RequestMetadataState {
  isOpen: boolean,
}

export class RequestMetadataForm extends React.Component<RequestMetadataProps, RequestMetadataState> {
  public static defaultProps: Partial<RequestMetadataProps> = {};


  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
    };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  submitForm = (event) => {
    event.preventDefault();
    const form = document.getElementById("RequestForm") as HTMLFormElement;
    const formData = new FormData(form);
    const recipientString = formData.get('recipients') as string
    const recipients = recipientString.split(",")
    const sender = formData.get('sender') as string;
    const descriptionRequested = formData.get('table-description') === "on" ? true : false;
    const fieldsRequested = formData.get('column-description') === "on" ? true : false;
    const comment = formData.get('details') as string;
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
    const expandedClass = this.state.isOpen ? 'expanded' : 'collapsed';
    return (
      <div className={`request-component ${expandedClass}`}>
        <div className="form-section request-header">
          <h3 className="title">{TITLE_TEXT}</h3>
          <button type="button" className="btn btn-close" aria-label={"Close"} onClick={this.toggle}/>
        </div>
        <form onSubmit={ this.submitForm } id="RequestForm">
          <div className="form-section">
            <label>{FROM}</label>
            <input type="email" name="sender" className="form-control" required={true} value={this.props.userEmail}/>
          </div>
          <div className="form-section">
            <label>{TO}</label>
            <input type="email" name="recipients" className="form-control" required={true} multiple={true} defaultValue={this.props.tableOwners.join(",")}/>
          </div>
          <div className="form-section">
            <label>{REQUEST_TYPE}</label>
            <p><input type="checkbox" name="table-description"/> {TABLE_DESCRIPTION}</p>
            <p><input type="checkbox" name="column-description"/> {COLUMN_DESCRIPTIONS}</p>
          </div>
          <div className="form-section">
            <label>{ADDITIONAL_DETAILS}</label>
            <textarea className="form-control" name="details" rows={ 8 } maxLength={ 2000 } />
          </div>
          <button className="submit-button" type="submit">
            {SEND_BUTTON}
          </button>
        </form>
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  const userEmail = state.user.loggedInUser.email;
  const tableName = state.tableMetadata.tableData.schema + '.' + state.tableMetadata.tableData.table_name;
  const ownerObj = state.tableMetadata.tableOwners.owners;
  return {
    userEmail,
    tableName,
    tableOwners: Object.keys(ownerObj),
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ submitNotification } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(RequestMetadataForm);
