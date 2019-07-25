import * as React from 'react';
import './styles.scss';

import { sendNotification } from 'ducks/notification/api/v0';
import { NotificationType } from 'interfaces/Notifications';
import { AvatarLabelProps } from 'components/common/AvatarLabel';
import { GlobalState } from 'ducks/rootReducer';
import { connect } from 'react-redux';

interface StateFromProps {
  userEmail: string;
  tableName: string;
  tableOwners: Array<String>;
}

type RequestMetadataProps = StateFromProps;

interface RequestMetadataState {
  isOpen: boolean,
}

export class RequestMetadataForm extends React.Component<RequestMetadataProps, RequestMetadataState> {
  public static defaultProps: RequestMetadataProps = {
    userEmail: '',
    tableName: '',
    tableOwners: [],
  };

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
    const recipients = String(formData.get('recipients')).split(",");
    const sender = String(formData.get('sender'));
    const descriptionRequested = formData.get('table-description') === "on" ? true : false;
    const fieldsRequested = formData.get('column-description') === "on" ? true : false;
    const comment = String(formData.get('details'));
    sendNotification(
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
          <h3 className="title">Amundsen Resource Request</h3>
          <button type="button" className="btn btn-close" aria-label={"Close"} onClick={this.toggle}/>
        </div>
        <form onSubmit={ this.submitForm } id="RequestForm">
          <div className="form-section">
            <label>From</label>
            <input type="email" name="sender" className="form-control" required={true} value={this.props.userEmail}/>
          </div>
          <div className="form-section">
            <label>To</label>
            <input type="email" name="recipients" className="form-control" required={true} multiple={true} defaultValue={this.props.tableOwners.join(",")}/>
          </div>
          <div className="form-section">
            <label>Request Type</label>
            <p><input type="checkbox" name="table-description"/> Table Description</p>
            <p><input type="checkbox" name="column-description"/> Column Descriptions</p>
          </div>
          <div className="form-section">
            <label>Additional Details</label>
            <textarea className="form-control" name="details" rows={ 8 } maxLength={ 2000 } />
          </div>
          <button className="submit-button" type="submit">
            Send Verification Request
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

export default connect<StateFromProps>(mapStateToProps)(RequestMetadataForm);
