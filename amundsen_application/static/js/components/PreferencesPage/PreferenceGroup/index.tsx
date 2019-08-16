import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export interface DispatchFromProps {
}

interface OwnProps {
  title: string;
  subtitle: string;
}

export type PreferenceGroupProps = DispatchFromProps & OwnProps;

export class PreferenceGroup extends React.Component<PreferenceGroupProps> {
    public static defaultProps: Partial<OwnProps> = {
    title: '',
    subtitle: '',
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <label className="preference-group">
        <input type="radio" className="preference-radio" name="notification-preference"/>
        <div className="preference-text">
          <div className="title-2">{ this.props.title }</div>
          <div className="body-secondary-3">{ this.props.subtitle }</div>
        </div>
      </label>
    );
  }
}

export default PreferenceGroup;
