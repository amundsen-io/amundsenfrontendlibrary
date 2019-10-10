import * as React from 'react';
import moment from 'moment-timezone';

import './styles.scss';

import { Watermark } from 'interfaces';
import {
  NO_WATERMARK_LINE_1, NO_WATERMARK_LINE_2,
  WATERMARK_DISPLAY_FORMAT,
  WATERMARK_INPUT_FORMAT,
  WatermarkType
} from './constants';

interface WatermarkLabelProps {
  watermarks: Watermark[];
}

class WatermarkLabel extends React.Component<WatermarkLabelProps> {
  constructor(props) {
    super(props);
  }

  formatWatermarkDate = (dateString: string) => {
    return moment(dateString, WATERMARK_INPUT_FORMAT).format(WATERMARK_DISPLAY_FORMAT);
  };

  getWatermarkValue = (type: WatermarkType) => {
    let watermark = this.props.watermarks.find((watermark: Watermark) => watermark.watermark_type === type);
    return watermark && watermark.partition_value;
  };

  renderWatermarkInfo = () => {
    const low = this.getWatermarkValue(WatermarkType.LOW);
    const high = this.getWatermarkValue(WatermarkType.HIGH);
    if (low === undefined && high === undefined) {
      return (
        <div className="body-2">
          { NO_WATERMARK_LINE_1 }
          <br/>
          { NO_WATERMARK_LINE_2 }
        </div>
      );
    }

    return (
      <>
        <div className="range-labels body-2">
          From: <br/>
          To:
        </div>
        <div className="range-dates body-2">
          { low && this.formatWatermarkDate(low) }
          <br/>
          { high && this.formatWatermarkDate(high) }
        </div>
      </>
    );
  };

  render() {
    return (
      <div className="watermark-label">
        <img className="range-icon" src="/static/images/watermark-range.png"/>
        { this.renderWatermarkInfo() }
      </div>
    );
  }
}

export default WatermarkLabel;
