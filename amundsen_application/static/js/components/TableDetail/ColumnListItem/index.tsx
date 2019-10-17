import * as React from 'react';

import ColumnDescEditableText from 'components/TableDetail/ColumnDescEditableText';
import { logClick } from 'ducks/utilMethods';
import { TableColumn } from 'interfaces/index';

// TODO: Use css-modules instead of 'import'
import './styles.scss';
import ColumnStats from 'components/TableDetail/ColumnStats';

interface ColumnListItemProps {
  data?: TableColumn;
  index: number;
}

interface ColumnListItemState {
  isExpanded: boolean;
}

class ColumnListItem extends React.Component<ColumnListItemProps, ColumnListItemState> {
  public static defaultProps: ColumnListItemProps = {
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


  render() {
    const metadata = this.props.data;
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
              {/* Placeholder */}
            </div>
            <div className="actions">
              {/* Placeholder */}
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
              <ColumnStats stats={ metadata.stats } />
            </section>
          }
        </div>
      </li>
    );
  }
}

export default ColumnListItem;
