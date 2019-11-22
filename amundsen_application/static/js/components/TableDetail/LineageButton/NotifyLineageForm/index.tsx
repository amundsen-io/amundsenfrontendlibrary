import axios from 'axios';

import * as React from 'react';
import { connect } from 'react-redux';

import './styles.scss';
import { NotificationType, SendingState } from 'interfaces';
import FlashMessage from 'components/common/FlashMessage'

import { GlobalState } from 'ducks/rootReducer';

import {
  SEND_FAILURE_MESSAGE,
  SEND_INPROGRESS_MESSAGE,
  SEND_SUCCESS_MESSAGE,
} from './constants'

interface StateFromProps {
  userEmail: string;
}

interface ComponentProps {
  onClose: any;
}

export type NotifyLineageProps = ComponentProps & StateFromProps;

interface NotifyLineageState {
  sendState: SendingState;
}

export class NotifyLineageForm extends React.Component<NotifyLineageProps, NotifyLineageState> {
  public static defaultProps: Partial<NotifyLineageProps> = {};

  constructor(props) {
    super(props);

    this.state = {
      sendState: SendingState.IDLE
    }
  }

  getFlashMessageString = (): string => {
    switch(this.state.sendState) {
      case SendingState.COMPLETE:
        return SEND_SUCCESS_MESSAGE;
      case SendingState.ERROR:
        return SEND_FAILURE_MESSAGE;
      case SendingState.WAITING:
        return SEND_INPROGRESS_MESSAGE;
      default:
        return '';
    }
  };

  renderFlashMessage = () => {
    return (
      <FlashMessage
        iconClass='icon-mail'
        message={this.getFlashMessageString()}
        onClose={this.props.onClose}
      />
    )
  }

  submitNotification = (event) => {
    event.preventDefault();
    const form = document.getElementById("RequestForm") as HTMLFormElement;
    const formData = new FormData(form);

    const recipients = ['ttannis@lyft.com']
    const sender = formData.get('sender') as string;
    const comment = formData.get('comment') as string;
    const subject = formData.get('comment') as string;
    this.setState({sendState: SendingState.WAITING})
    axios.post('/api/mail/v0/notification', {
      notificationType: NotificationType.LINEAGE,
      recipients,
      sender,
      options: {
        comment,
        subject,
        resource_path: '/test',
        resource_name: 'test',
      }
    }).then(() => {
      this.setState({sendState: SendingState.COMPLETE})
    }).catch(e => {
      this.setState({sendState: SendingState.ERROR})
    })
  };

  render() {
    const { onClose, userEmail } = this.props;

    if (this.state.sendState !== SendingState.IDLE) {
      return (
        <div className="request-component-lineage">
          {this.renderFlashMessage()}
        </div>
      );
    }

    return (
      <div className="request-component-lineage expanded">
        <div id="request-metadata-title" className="form-group request-header">
          <h3 className="title">Notify DownStream Owners</h3>
          <button type="button" className="btn btn-close" aria-label={"Close"} onClick={onClose}/>
        </div>
        <form onSubmit={ this.submitNotification } id="RequestForm">
          <div id="sender-form-group" className="form-group">
            <label>From</label>
            <input type="email" name="sender" className="form-control" required={true} value={userEmail} readOnly={true}/>
          </div>
          <div id="recipients-form-group" className="form-group">
            <label>Subject</label>
            <input type="text" name="subject" className="form-control" required={true} />
          </div>
          <div id="additional-comments-form-group" className="form-group">
            <label>Message</label>
            <textarea
              className="form-control"
              name="comment"
              placeholder='Your message will be send to all owners of downstream tables'
              required={ true }
              rows={ 8 }
              maxLength={ 4000 }
            />
          </div>
          <button id="submit-request-button" className="btn btn-primary submit-request-button" type="submit">
            <img className='icon icon-send'/>
            Send Message
          </button>
        </form>
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  const userEmail = state.user.loggedInUser.email;
  return {
    userEmail
  };
};

export default connect<StateFromProps, ComponentProps>(mapStateToProps, null)(NotifyLineageForm);
