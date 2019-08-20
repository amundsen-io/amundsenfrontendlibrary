import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export type PreferenceGroupProps = {
  changePreference: any;
  selected: boolean;
  title: string;
  subtitle: string;
}

export class PreferenceGroup extends React.Component<PreferenceGroupProps> {
    public static defaultProps: Partial<PreferenceGroupProps> = {
      selected: false,
      title: '',
      subtitle: '',
    };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <label className="preference-group" onClick={() => this.props.changePreference(this.props.title)}>
        <input defaultChecked={ this.props.selected } type="radio" className="preference-radio" name="notification-preference"/>
        <div className="preference-text">
          <div className="title-2">{ this.props.title }</div>
          <div className="body-secondary-3">{ this.props.subtitle }</div>
        </div>
      </label>
    );
  }
}

export default PreferenceGroup;
