import * as React from 'react';
import { logAction } from "../../../ducks/utilMethods";


export interface ScrollTrackerProps {
  location: string;
  targetId: string;
}

interface ScrollTrackerState {
  thresholds: number[];
}

export default class ScrollTracker extends React.Component<ScrollTrackerProps, ScrollTrackerState> {
  constructor(props) {
    super(props);

    this.state = {
      thresholds: [25, 50, 75, 100]
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll)
  }

  // TODO - Debounce this function
  onScroll = () => {
    if (this.state.thresholds.length == 0) {
      window.removeEventListener("scroll", this.onScroll);
      return;
    }
    const threshold = this.state.thresholds[0];
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const windowHeight = window.innerHeight || document.body.clientHeight;
    const contentHeight = document.body.offsetHeight;
    const scrollableAmount = (contentHeight - windowHeight);

    if (threshold <= 100 * scrollTop / scrollableAmount) {
      this.fireAnalyticsEvent(this.state.thresholds.shift());
    }
  };

  fireAnalyticsEvent = (threshold: number) => {
    logAction({
      command: "scroll",
      target_id: this.props.targetId,
      location: this.props.location,
      value: threshold,
    });
  };

  render() { return null; }
}

