import * as React from 'react';

import Linkify from 'react-linkify'

import LoadingSpinner from 'components/common/LoadingSpinner';

import * as Constants from './constants';
import './styles.scss';

export interface ImagePreviewProps {
  uri: string;
  dashboard_url?: string; // TODO ttannis: Pass dashboard url after picking up connect_dashboard changes
}

interface ImagePreviewState {
  isLoading: boolean;
  hasError: boolean;
}

export class ImagePreview extends React.Component<ImagePreviewProps, ImagePreviewState> {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      hasError: false,
    }
  }

  onSuccess = () => {
    this.setState({ isLoading: false, hasError: false });
  }

  onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    this.setState({ isLoading: false, hasError: true });
  }

  render = () =>  {
    const { uri, dashboard_url = 'TODO: ttannis' } = this.props;
    return (
      <div className='image-preview'>
        { this.state.isLoading && <LoadingSpinner /> }
        {
          !this.state.hasError &&
          <img
            className='preview'
            style={this.state.isLoading ? { visibility: 'hidden' } : { visibility: 'visible' }}
            src={`${Constants.PREVIEW_BASE}/${this.props.uri}/${Constants.PREVIEW_END}`}
            onLoad={this.onSuccess}
            onError={this.onError}
            height="auto"
            width="100%"
          />
        }
        {
          this.state.hasError &&
          <Linkify>{`${Constants.ERROR_MESSAGE} ${dashboard_url}.`}</Linkify>
        }
      </div>
    );
  }
}

export default ImagePreview;
