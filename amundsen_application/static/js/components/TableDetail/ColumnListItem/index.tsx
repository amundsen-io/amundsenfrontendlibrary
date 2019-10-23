import * as React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { notificationsEnabled } from 'config/config-utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ColumnDescEditableText from 'components/TableDetail/ColumnDescEditableText';
import { logClick } from 'ducks/utilMethods';
import { OpenRequestAction } from 'ducks/notification/types';
import { openRequestDescriptionDialog } from 'ducks/notification/reducer';
import { RequestMetadataType, TableColumn } from 'interfaces';

// TODO: Use css-modules instead of 'import'
import './styles.scss';
import ColumnStats from 'components/TableDetail/ColumnStats';


interface DispatchFromProps {
  openRequestDescriptionDialog: (requestMetadataType: RequestMetadataType, columnName: string) => OpenRequestAction;
}

interface OwnProps {
  data: TableColumn;
  index: number;
}

interface ColumnListItemState {
  isExpanded: boolean;
}

type ColumnListItemProps = DispatchFromProps & OwnProps;

class ColumnListItem extends React.Component<ColumnListItemProps, ColumnListItemState> {
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

  openRequest = () => {
    this.props.openRequestDescriptionDialog(RequestMetadataType.COLUMN_DESCRIPTION, this.props.data.name);
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
              {
                notificationsEnabled() &&
                <Dropdown id={`detail-list-item-dropdown:${this.props.index}`}
                          onClick={ this.stopPropagation }
                          pullRight={ true }
                          className="column-dropdown">
                  <Dropdown.Toggle noCaret={ true }>
                    <img className="icon icon-more"/>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <MenuItem onClick={ this.openRequest }>
                      Request Column Description
                    </MenuItem>
                  </Dropdown.Menu>
                </Dropdown>
              }
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

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ openRequestDescriptionDialog }, dispatch);
};

export default connect<{}, DispatchFromProps, OwnProps>(null, mapDispatchToProps)(ColumnListItem);
