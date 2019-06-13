import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import * as Avatar from 'react-avatar';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Breadcrumb from 'components/common/Breadcrumb';
import Flag from 'components/common/Flag';
import Tabs from 'components/common/Tabs';

import { GlobalState } from 'ducks/rootReducer';
import { getUserById, getUserOwn, getUserRead } from 'ducks/user/reducer';
import { User, GetUserRequest, GetUserOwnRequest, GetUserReadRequest } from 'ducks/user/types';

import './styles.scss';
import { Resource } from 'interfaces';
import ResourceList from 'components/common/ResourceList';

interface StateFromProps {
  user: User;
  own: Resource[];
  read: Resource[];
}

interface DispatchFromProps {
  getUserById: (userId: string) => GetUserRequest;
  getUserOwn: (userId: string) => GetUserOwnRequest;
  getUserRead: (userId: string) => GetUserReadRequest;
}

export type ProfilePageProps = StateFromProps & DispatchFromProps;

export class ProfilePage extends React.Component<ProfilePageProps> {
  private userId: string;

  constructor(props) {
    super(props);

    const { match } = props;
    const params = match.params;
    this.userId = params && params.userId ? params.userId : '';
  }

  componentDidMount() {
    this.props.getUserById(this.userId);
    this.props.getUserOwn(this.userId);
    this.props.getUserRead(this.userId);
  }

  getUserId = () => {
    return this.userId;
  };


  getTabContent = (resource: Resource[], label: string, source: string) => {
    if (resource.length == 0) {
      return (
        <div className="empty-tab-message">
          <label>User has no { label} resources.</label>
        </div>
      );
    }
    return <ResourceList allItems={ resource } source={ `profile-${source}`} />
  };

  generateTabInfo = () => {
    const tabInfo = [];
    tabInfo.push({
      content: this.getTabContent(this.props.read, "frequently used", "read"),
      key: 'frequentUses_tab',
      title: `Frequently Uses (${this.props.read.length})`,
    });

    tabInfo.push({
      content: this.getTabContent([], "bookmarked", "bookmark"),
      key: 'bookmarks_tab',
      title: 'Bookmarks (0)',
    });
    tabInfo.push({
      content: this.getTabContent(this.props.own, "owned", "own"),
      key: 'owner_tab',
      title: `Owner (${this.props.own.length})`,
    });

    return tabInfo;
  };

  /* TODO: Add support to direct to 404 page for edgecase of someone typing in
     or pasting in a bad url. This would be consistent with TableDetail page behavior */
  render() {
    const user = this.props.user;
    return (
      <DocumentTitle title={ `${user.display_name} - Amundsen Profile` }>
        <div className="container profile-page">
          <div className="row">
            <div className="col-xs-12 col-md-offset-1 col-md-10">
              {/* remove hardcode to home when this page is ready for production */}
              <Breadcrumb path="/" text="Home" />
              <div className="profile-header">
                  <div id="profile-avatar" className="profile-avatar">
                    {
                      // default Avatar looks a bit jarring -- intentionally not rendering if no display_name
                      user.display_name && user.display_name.length > 0 &&
                      <Avatar name={user.display_name} size={74} round={true} />
                    }
                  </div>
                  <div className="profile-details">
                    <div id="profile-title" className="profile-title">
                      <h1>{ user.display_name }</h1>
                      {
                        (!user.is_active) &&
                        <Flag caseType="sentenceCase" labelStyle="label-danger" text="Alumni"/>
                      }
                    </div>
                    {
                      user.role_name && user.team_name &&
                      <label id="user-role">{ `${user.role_name} on ${user.team_name}` }</label>
                    }
                    {
                      user.manager_fullname &&
                      <label id="user-manager">{ `Manager: ${user.manager_fullname}` }</label>
                    }
                    <div className="profile-icons">
                      {
                        user.is_active &&
                        <a id="slack-link" href={user.slack_id} className='btn btn-flat-icon' target='_blank'>
                          <img className='icon icon-slack'/>
                          <span>Slack</span>
                        </a>
                      }
                      {
                        user.is_active &&
                        <a id="email-link" href={`mailto:${user.email}`} className='btn btn-flat-icon' target='_blank'>
                          <img className='icon icon-mail'/>
                          <span>{ user.email }</span>
                        </a>
                      }
                      {
                        user.is_active && user.profile_url &&
                        <a id="profile-link" href={user.profile_url} className='btn btn-flat-icon' target='_blank'>
                          <img className='icon icon-users'/>
                          <span>Employee Profile</span>
                        </a>
                      }
                      {
                        user.github_username &&
                        <a id="github-link" href={`https://github.com/${user.github_username}`} className='btn btn-flat-icon' target='_blank'>
                          <img className='icon icon-github'/>
                          <span>Github</span>
                        </a>
                      }
                    </div>
                  </div>
              </div>
              <div id="profile-tabs" className="profile-tabs">
                <Tabs tabs={ this.generateTabInfo() } defaultTab='frequentUses_tab' />
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    user: state.user.profile.user,
    own: state.user.profile.own,
    read: state.user.profile.read,
  }
};

export const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ getUserById, getUserOwn, getUserRead }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(ProfilePage);
