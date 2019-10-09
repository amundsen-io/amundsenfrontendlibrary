import * as React from 'react';
import moment from 'moment-timezone';

import ColumnDescEditableText from 'components/TableDetail/ColumnDescEditableText';
import { logClick } from 'ducks/utilMethods';
import { TableColumn } from 'interfaces/index';

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

  formatDate = (unixEpochSeconds) => {
    return moment(unixEpochSeconds * 1000).format("MMM DD, YYYY");
  };

  render() {
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

    return (
      <li className="list-group-item" onClick={ this.toggleExpand }>
        <div className="column-list-item">
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
        </div>
      </li>
    );



    // return (
    //   <li className='list-group-item column-list-item'>
    //     <div className={'column-info ' + (isExpandable ? 'expandable' : '')} onClick={ isExpandable? this.onClick : null }>
    //       <div className='title-section'>
    //         <div className='title-row'>
    //           <div className='name title-2'>{metadata.name}</div>
    //           <div className='column-type'>{metadata.type ? metadata.type.toLowerCase() : 'null'}</div>
    //         </div>
    //       </div>
    //       {
    //         isExpandable &&
    //         <img className={'icon ' + (this.state.isExpanded ? 'icon-up' : 'icon-down')}/>
    //       }
    //     </div>
    //     <div className={'body-secondary-3 description ' + (isExpandable && !this.state.isExpanded ? 'truncated' : '')}>
    //       <ColumnDescEditableText
    //         columnIndex={this.props.index}
    //         editable={metadata.is_editable}
    //         value={metadata.description}
    //       />
    //     </div>
    //     {
    //       this.state.isExpanded &&
    //       <div className='column-stats'>
    //         {
    //           metadata.stats.map(entry =>
    //             <div className='column-stat' key={entry.stat_type}>
    //               <div className='caption'>
    //                 {entry.stat_type.toUpperCase()}
    //               </div>
    //               <div className='body-link'>
    //                 {entry.stat_val}
    //               </div>
    //             </div>
    //           )
    //         }
    //         {
    //          metadata.stats.length > 0 &&
    //          <div className="stat-collection-info">
    //           { infoText }
    //         </div>
    //         }
    //       </div>
    //     }
    //   </li>
    // );
  }
}

export default DetailListItem;
