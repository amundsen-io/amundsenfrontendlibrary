import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import Avatar from 'react-avatar';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoadingSpinner from '../common/LoadingSpinner';

import { GlobalState } from "../../ducks/rootReducer";
import { getUserById } from "../../ducks/user/reducer";
import { CurrentUser, GetUserRequest } from "../../ducks/user/types";

import Flag from "../common/Flag";
import Tabs from "../common/Tabs";

import './styles.scss';

interface StateFromProps {
  isLoading: boolean;
  user: CurrentUser;
}

interface DispatchFromProps {
  getUserById: (userId: string) => GetUserRequest;
}

type ProfilePageProps = StateFromProps & DispatchFromProps;

interface ProfilePageState {
  isLoading: boolean;
  user: CurrentUser;
}

class ProfilePage extends React.Component<ProfilePageProps, ProfilePageState> {
  private userId: string;

  constructor(props) {
    super(props);

    const { match } = props;
    const params = match.params;
    this.userId = params ? params.userId : '';

    this.state = {
      isLoading: this.props.isLoading,
      user: this.props.user,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { isLoading, user } = nextProps;
    return { isLoading, user };
  }

  componentDidMount() {
    this.props.getUserById(this.userId);
  }

  // TODO: consider moving logic for empty content into Tab component
  createEmptyTabMessage = (message: string) => {
    return (
      <div className="empty-tab-message">
        <text>{ message }</text>
      </div>
    );
  }

  generateTabInfo = () => {
    const user = this.state.user;
    const tabInfo = [];

    // TODO: Populate tabs based on data
    // TODO: consider moving logic for empty content into Tab component
    tabInfo.push({
      content: this.createEmptyTabMessage('User has no frequently used resources.'),
      key: 'frequentUses_tab',
      title: 'Frequently Uses (0)',
    });
    tabInfo.push({
      content: this.createEmptyTabMessage('User has no bookmarked resources.'),
      key: 'bookmarks_tab',
      title: 'Bookmarks (0)',
    });
    tabInfo.push({
      content: this.createEmptyTabMessage('User has no owned resources.'),
      key: 'owner_tab',
      title: 'Owner (0)',
    });

    return tabInfo;
  }

  generatePageContent = () => {
    if (this.state.isLoading) {
      return (
        <div className="container profile-page">
          <LoadingSpinner/>
        </div>
      )
    }
    
    const user = this.state.user;
    return (
      <div className="container profile-page">
        <div className="profile-header">
            <div className="profile-avatar">
              <Avatar name={user.display_name} size={74} round={true} />
            </div>
            <div className="profile-details">
              <div className="profile-title">
                <h1>{ user.display_name }</h1>
                {
                  !user.is_active &&
                  <Flag caseType="sentenceCase" labelStyle="label-danger" text="Alumni"/>
                }
              </div>
              <text>{ `${user.role_name} on ${user.team_name}` }</text>
              <text>{ `Manager: ${user.manager_name}` }</text>
              <div className="profile-icons">
                {
                  user.is_active &&
                  <a href={user.slack_url} className='btn btn-flat-icon-dark' target='_blank'>
                    <img className='icon icon-slack'/>
                    <span>Slack</span>
                  </a>
                }
                {
                  user.is_active &&
                  <a href={`mailto:${user.email}`} className='btn btn-flat-icon-dark' target='_blank'>
                    <img className='icon icon-mail'/>
                    <span>{ user.email }</span>
                  </a>
                }
                {
                  user.is_active &&
                  <a href={user.profile_url} className='btn btn-flat-icon-dark' target='_blank'>
                    <img className='icon icon-users'/>
                    <span>Employee Profile</span>
                  </a>
                }
                <a href={`https://github.com/${user.github_name}`} className='btn btn-flat-icon-dark' target='_blank'>
                  <img className='icon icon-github'/>
                  <span>Github</span>
                </a>
              </div>
            </div>
        </div>
        <div className="profile-tabs">
          <Tabs tabs={ this.generateTabInfo() } defaultTab='frequentUses_tab' />
        </div>
      </div>
    )
  }

  render() {
    return (
      <DocumentTitle title={ `${this.state.user.display_name} - Amundsen Profile` }>
        <div>
          <div className="container amundsen-crumb">
            <Link to={`/`}>
              <button className='btn btn-flat-icon'>
                <img className='icon icon-left'/>
                <span>Search Results</span>
              </button>
            </Link>
          </div>
          { this.generatePageContent() }
        </div>
      </DocumentTitle>
    );
  }
}

const mapStateToProps = (state: GlobalState) => {
  return {
    isLoading: state.user.isLoading,
    user: state.user.profilePageUser,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUserById }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(ProfilePage);
