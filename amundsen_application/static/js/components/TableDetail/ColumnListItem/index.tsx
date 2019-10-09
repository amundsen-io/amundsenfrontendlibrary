import * as React from 'react';
import moment from 'moment-timezone';

import ColumnDescEditableText from 'components/TableDetail/ColumnDescEditableText';
import { logClick } from 'ducks/utilMethods';
import { TableColumn, TableColumnStats } from 'interfaces/index';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

interface DetailListItemProps {
  data?: TableColumn;
  index: number;
}

interface DetailListItemState {
  isExpanded: boolean;
}

class DetailListItem extends React.Component<DetailListItemProps, DetailListItemState> {
  public static defaultProps: DetailListItemProps = {
    data: {} as TableColumn,
    index: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false
    };
  }

  toggleExpand = (e) => {
    if (!this.state.isExpanded) {
      const metadata = this.props.data;
      logClick(e, {
        target_id: `column::${metadata.name}`,
        target_type: 'column stats',
        label: `${metadata.name} ${metadata.type}`,
      });
    }
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  stopPropagation = (e) => {
    e.stopPropagation();
  };

  formatDate = (unixEpochSeconds) => {
    return moment(unixEpochSeconds * 1000).format("MMM DD, YYYY");
  };

  getStatsInfoText = () => {
    const metadata = this.props.data;
    const isExpandable = metadata.stats && metadata.stats.length > 0;
    const startEpoch = Math.min(...metadata.stats.map(s => parseInt(s.start_epoch, 10)));
    const endEpoch = Math.max(...metadata.stats.map(s => parseInt(s.end_epoch, 10)));
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
      <div className="column-stat" key={entry.stat_type}>
        <div className="stat-name body-3">
          {entry.stat_type.toUpperCase()}
        </div>
        <div className="stat-value">
          {entry.stat_val}
        </div>
      </div>
    )
  };


  render() {
    const metadata = this.props.data;
    const infoText = this.getStatsInfoText();
    return (
      <li className="list-group-item" onClick={ this.toggleExpand }>
        <div className="column-list-item">
          <section className="column-header">
            <div className="column-details truncated">
              <div className="column-name">
                { metadata.name }
              </div>
              {
                !this.state.isExpanded &&
                <div className="body-secondary-3 truncated">
                  { metadata.description }
                </div>
              }
            </div>
            <div className="resource-type">
              { metadata.type ? metadata.type.toLowerCase() : 'null' }
            </div>
            <div className="badges">

            </div>
            <div className="actions">

            </div>
          </section>
          {
            this.state.isExpanded &&
            <section className="expanded-content">
              {/* TODO replace with <EditableSection> when merged with that commit */}
              <div className="title-3">Description</div>
              <span onClick={ this.stopPropagation }>
                <ColumnDescEditableText
                  columnIndex={ this.props.index }
                  editable={ metadata.is_editable }
                  value={ metadata.description }
                />
              </span>
              {
                metadata.stats.length > 0 &&
                <div className="stat-collection-info">
                  <span className="title-3">Column Statistics </span>
                  { infoText }
               </div>
              }
              <div className="column-stats">
                <div className="column-stats-column">
                  {
                    metadata.stats.map((stat, index) => {
                      if (index % 2 === 0)
                        return this.renderColumnStat(stat);
                    })
                  }
                </div>
                <div className="column-stats-column">
                  {
                    metadata.stats.map((stat, index) => {
                      if (index % 2 === 1)
                        return this.renderColumnStat(stat);
                    })
                  }
                </div>
              </div>
            </section>
          }
        </div>
      </li>
    );
  }
}

export default DetailListItem;
