import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { PreferenceGroup } from './PreferenceGroup';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

export interface DispatchFromProps {
}

export type PreferencesPageProps = DispatchFromProps;

export class PreferencesPage extends React.Component<PreferencesPageProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-offset-1 col-md-10">
            <h1 className="preferences-title">Notification Preferences</h1>
            <PreferenceGroup title="All Notifications" subtitle="You will get notified via email regarding any activity on tables you own."/>
            <PreferenceGroup title="Minimum Notifications Only" subtitle="You will only be notified when you're being added as an owner, removed as an owner, or receive a description request on any table you own."/>
          </div>
        </div>
      </div>
    );
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({} , dispatch);
};

export default connect<DispatchFromProps>(null, mapDispatchToProps)(PreferencesPage);
