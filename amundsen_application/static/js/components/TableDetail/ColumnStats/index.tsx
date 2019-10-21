import * as React from 'react';
import moment from 'moment-timezone';

import { TableColumnStats } from 'interfaces/index';

import './styles.scss';

interface ColumnStatsProps {
  stats: TableColumnStats[];
}

class ColumnStats extends React.Component<ColumnStatsProps> {
  constructor(props) {
    super(props);
  }

  formatDate = (unixEpochSeconds) => {
    return moment(unixEpochSeconds * 1000).format("MMM DD, YYYY");
  };

  getStatsInfoText = () => {
    const { stats } = this.props;
    const isExpandable = stats && stats.length > 0;
    const startEpoch = Math.min(...stats.map(s => parseInt(s.start_epoch, 10)));
    const endEpoch = Math.max(...stats.map(s => parseInt(s.end_epoch, 10)));
    const startDate = isExpandable ? this.formatDate(startEpoch) : null;
    const endDate = isExpandable ? this.formatDate(endEpoch) : null;

    let infoText = 'Stats reflect data collected';
    if (startDate && endDate) {
      if (startDate === endDate) {
        infoText = `${infoText} on ${startDate} only. (daily partition)`;
      } else {
        infoText = `${infoText} between ${startDate} and ${endDate}.`;
      }
    } else {
      infoText = `${infoText} over a recent period of time.`;
    }
    return infoText;
  };

  renderColumnStat = (entry: TableColumnStats) => {
    return (
      <div className="column-stat-row" key={entry.stat_type}>
        <div className="stat-name body-3">
          {entry.stat_type.toUpperCase()}
        </div>
        <div className="stat-value">
          {entry.stat_val}
        </div>
      </div>
    )
  };

  render = () => {
    const { stats } = this.props;
    if (stats.length === 0) {
      return null;
    }

    return (
      <section className="column-stats">
        <div className="stat-collection-info">
          <span className="title-3">Column Statistics </span>
          { this.getStatsInfoText() }
        </div>
        <div className="column-stats-table">
          <div className="column-stats-column">
            {
              stats.map((stat, index) => {
                if (index % 2 === 0) {
                  return this.renderColumnStat(stat);
                }
              })
            }
          </div>
          <div className="column-stats-column">
            {
              this.props.stats.map((stat, index) => {
                if (index % 2 === 1) {
                  return this.renderColumnStat(stat);
                }
              })
            }
          </div>
        </div>
      </section>
    );
  };
}

export default ColumnStats;
