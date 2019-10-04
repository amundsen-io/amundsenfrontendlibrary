import * as React from 'react';
import moment from 'moment-timezone';

import './styles.scss';

import { Watermark } from 'interfaces';

interface WatermarkRangeProps {
  watermarks: Watermark[];
}

class WatermarkRange extends React.Component<WatermarkRangeProps> {

  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div className="watermark-range">
          <img className="range" src="/static/images/watermark-range.png"/>
          { this.getWatermarksLabel() }
        </div>
      )
  }

  getWatermarksLabel = () => {
    const low = this.props.watermarks.find((wtm) => wtm.watermark_type === "low_watermark");
    const high = this.props.watermarks.find((wtm) => wtm.watermark_type === "high_watermark");
    if (low === undefined && high === undefined) {
      return "Non Partitioned Table. Data available for all dates."
    }

    return (
      <div className="range-dates">
        <div className="body-2">
          From: { moment(low.partition_value, "YYYY-MM-DD").format("MMM DD, YYYY") }
        </div>
        <div className="body-2">
          To: { moment(high.partition_value, "YYYY-MM-DD").format("MMM DD, YYYY") }
        </div>
      </div>
    );

  }
}

export default WatermarkRange;
