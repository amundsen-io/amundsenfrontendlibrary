import * as React from 'react';

import BugReportFeedbackForm from './FeedbackForm/BugReportFeedbackForm';
import RatingFeedbackForm from './FeedbackForm/RatingFeedbackForm';
import RequestFeedbackForm from './FeedbackForm/RequestFeedbackForm';

import { Button, Panel } from 'react-bootstrap';

import {
  BUTTON_CLOSE_TEXT,
  FEEDBACK_TITLE,
} from './constants';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

export interface FeedbackProps {
  content?: React.SFC<any>,
  title?: string,
}

interface FeedbackState {
  content: React.SFC<any>,
  feedbackType: FeedbackType,
  isOpen: boolean,
}

export enum FeedbackType {
  Rating,
  Bug,
  Request,
}

export default class Feedback extends React.Component<FeedbackProps, FeedbackState> {
  static defaultProps = {
    content: <RatingFeedbackForm />,
    title: FEEDBACK_TITLE,
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      content: this.props.content,
      feedbackType: FeedbackType.Rating,
    };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  changeType = (type: FeedbackType) => (e) =>  {
    let content;
    if (type === FeedbackType.Request) {
      content = <RequestFeedbackForm />;
    } else if (type === FeedbackType.Bug) {
      content = <BugReportFeedbackForm />;
    } else {
      content = <RatingFeedbackForm />;
    }
    this.setState({
      content,
      feedbackType: type,
    });
  };

  render() {
    const expandedClass = this.state.isOpen ? 'expanded' : 'collapsed';
    return (
      <div className={`feedback-component ${expandedClass}`}>
        {
          this.state.isOpen &&
          <div>
            <div className="feedback-header">
              <button type="button" className="close" aria-label={BUTTON_CLOSE_TEXT} onClick={this.toggle}>
                <span aria-hidden="true">&times;</span>
              </button>
              <div className="title">
                {this.props.title.toUpperCase()}
              </div>
            </div>
            <div className="text-center">
              <div className="btn-group" role="group" aria-label="Feedback Type Selector">
                <button type="button"
                        className={"btn btn-default" + (this.state.feedbackType === FeedbackType.Rating? " active": "")}
                        onClick={this.changeType(FeedbackType.Rating)}>
                  Rating</button>
                <button type="button"
                        className={"btn btn-default" + (this.state.feedbackType === FeedbackType.Bug? " active": "")}
                        onClick={this.changeType(FeedbackType.Bug)}>
                  Bug Report</button>
                <button type="button"
                        className={"btn btn-default" + (this.state.feedbackType === FeedbackType.Request? " active": "")}
                        onClick={this.changeType(FeedbackType.Request)}>
                  Request</button>
              </div>
            </div>
            {this.state.content}
          </div>
        }
        {
          !(this.state.isOpen) &&
          <img className='icon-speech' src='/static/images/icons/Speech.svg' onClick={this.toggle}/>
        }
      </div>
    );
  }
}
