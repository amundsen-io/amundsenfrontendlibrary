// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { TableColumnStats } from 'interfaces/index';
import { getStatsInfoText } from '../utils';

import './styles.scss';

export interface ColumnStatsProps {
  stats: TableColumnStats[];
}

export class ColumnStats extends React.Component<ColumnStatsProps> {
  renderColumnStat = (entry: TableColumnStats) => {
    return (
      <div className="column-stat-row" key={entry.stat_type}>
        <div className="stat-name body-3">{entry.stat_type.toUpperCase()}</div>
        <div className="stat-value">{entry.stat_val}</div>
      </div>
    );
  };

  render = () => {
    const { stats } = this.props;
    if (stats.length === 0) {
      return null;
    }

    // TODO - Move map statements to separate functions for better testing
    const startEpoch = Math.min(...stats.map((s) => s.start_epoch));
    const endEpoch = Math.max(...stats.map((s) => s.end_epoch));

    return (
      <section className="column-stats">
        <div className="stat-collection-info">
          <span className="title-3">Column Statistics&nbsp;</span>
          {getStatsInfoText(startEpoch, endEpoch)}
        </div>
        <div className="column-stats-table">
          <div className="column-stats-column">
            {stats.map((stat, index) => {
              if (index % 2 === 0) {
                return this.renderColumnStat(stat);
              }
            })}
          </div>
          <div className="column-stats-column">
            {this.props.stats.map((stat, index) => {
              if (index % 2 === 1) {
                return this.renderColumnStat(stat);
              }
            })}
          </div>
        </div>
      </section>
    );
  };
}

export default ColumnStats;
