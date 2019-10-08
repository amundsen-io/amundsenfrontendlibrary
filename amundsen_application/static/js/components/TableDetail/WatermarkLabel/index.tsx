import * as React from 'react';
import moment from 'moment-timezone';

import './styles.scss';

import { Watermark } from 'interfaces';

interface WatermarkLabelProps {
  watermarks: Watermark[];
}

class WatermarkLabel extends React.Component<WatermarkLabelProps> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="watermark-range body-2">
        <img className="range-icon" src="/static/images/watermark-range.png"/>
        { this.getWatermarkText() }
      </div>
    );
  }

  getWatermarkText = () => {
    const low = this.props.watermarks.find((wtm) => wtm.watermark_type === "low_watermark");
    const high = this.props.watermarks.find((wtm) => wtm.watermark_type === "high_watermark");
    if (low === undefined && high === undefined) {
      return (
        <>
          Non-Partitioned Table <br/>
          Data available for all dates
        </>
      );
    }

    return (
      <>
        <div className="range-labels">
          From: <br/>
          To:
        </div>
        <div className="range-dates">
          { low && moment(low.partition_value, "YYYY-MM-DD").format("MMM DD, YYYY") }
          <br/>
          { high && moment(high.partition_value, "YYYY-MM-DD").format("MMM DD, YYYY") }
        </div>
      </>
    );
  }
}

export default WatermarkLabel;
