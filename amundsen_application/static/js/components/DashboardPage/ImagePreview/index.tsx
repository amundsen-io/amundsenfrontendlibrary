import * as React from "react";
import Linkify from "react-linkify";
import { OverlayTrigger, Popover } from "react-bootstrap";

import ShimmeringDashboardLoader from "../ShimmeringDashboardLoader";

import * as Constants from "./constants";
import "./styles.scss";

export interface ImagePreviewProps {
  uri: string;
  redirectUrl: string;
}

interface ImagePreviewState {
  isLoading: boolean;
  hasError: boolean;
}

export class ImagePreview extends React.Component< ImagePreviewProps, ImagePreviewState > {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      hasError: false
    };
  }

  onSuccess = () => {
    this.setState({ isLoading: false, hasError: false });
  }

  onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    this.setState({ isLoading: false, hasError: true });
  }

  render = () => {
    const { uri, redirectUrl } = this.props;
    const popoverHoverFocus = (<Popover id="popover-trigger-hover-focus">Click to enlarge</Popover>);

    return (
      <div className="image-preview">
        {this.state.isLoading && (
          <div className="text-placeholder">
            <ShimmeringDashboardLoader />
          </div>
        )}
        {!this.state.hasError && (
          <OverlayTrigger
            trigger={["hover", "focus"]}
            placement="top"
            overlay={popoverHoverFocus}
          >
            <img
              className="preview"
              style={
                this.state.isLoading
                  ? { visibility: "hidden" }
                  : { visibility: "visible" }
              }
              src={`${Constants.PREVIEW_BASE}/${this.props.uri}/${Constants.PREVIEW_END}`}
              onLoad={this.onSuccess}
              onError={this.onError}
              height="auto"
              width="100%"
            />
          </OverlayTrigger>
        )}
        {this.state.hasError && (
          <Linkify
            className="body-placeholder"
            properties={{ target: "_blank", rel: "noopener noreferrer" }}
          >{`${Constants.ERROR_MESSAGE} ${redirectUrl}`}</Linkify>
        )}
      </div>
    );
  };
}

export default ImagePreview;
