import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getDashboardPreview } from 'ducks/dashboard/reducer';
import { GlobalState } from 'ducks/rootReducer';

import LoadingSpinner from 'components/common/LoadingSpinner';

import './styles.scss';

export interface OwnProps {
  uri: string;
}

export interface StateFromProps {
  url: string;
  errorMessage: string;
  errorCode: number | undefined;
  isLoading: boolean;
}

export interface DispatchFromProps {
  getPreviewImage: (payload: { uri: string }) => any; // TODO ttannis: Update this
}

export type ImagePreviewProps = StateFromProps & DispatchFromProps & OwnProps;

export class ImagePreview extends React.Component<ImagePreviewProps, {}> {
  constructor(props) {
    super(props);
  }

  componentDidMount = () =>  {
    this.props.getPreviewImage({ uri: this.props.uri });
  }

  render = () =>  {
    const { errorCode, errorMessage, isLoading, url } = this.props;
    let content;
    if (isLoading) {
      content = <LoadingSpinner/>;
    }
    else if (errorCode) {
      content =  <div className="loading-error-text body-placeholder">{ errorMessage }</div>;
    }
    else {
      content = <img src={this.props.url} height="auto" width="100%" />;
    }

    return (
      <div className='image-preview'>
        { content }
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    url: state.dashboard.preview.url,
    errorMessage: state.dashboard.preview.errorMessage || '',
    errorCode: state.dashboard.preview.errorCode || undefined,
    isLoading: state.dashboard.preview.isLoading,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    getPreviewImage: getDashboardPreview,
  } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps, OwnProps>(mapStateToProps, mapDispatchToProps)(ImagePreview);
