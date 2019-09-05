import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './styles_v2';
import { GlobalState } from 'ducks/rootReducer';
import { getPreviewData, getTableData } from 'ducks/tableMetadata/reducer';
import { PreviewQueryParams, TableMetadata } from 'interfaces/TableMetadata';
import { GetTableDataRequest } from 'ducks/tableMetadata/types';
import BookmarkIcon from 'components/common/Bookmark/BookmarkIcon';
import TableDescEditableText from 'components/TableDetail/TableDescEditableText';
import LoadingSpinner from 'components/common/LoadingSpinner';
import TagInput from 'components/Tags/TagInput';
import DetailList from 'components/TableDetail/DetailList';



export interface StateFromProps {
  isLoading: boolean;
  statusCode?: number;
  tableData: TableMetadata;
}

export interface DispatchFromProps {
  getTableData: (key: string, searchIndex?: string, source?: string, ) => GetTableDataRequest;
}

type TableDetailProps = StateFromProps & DispatchFromProps;

class TableDetail_v2 extends React.Component<TableDetailProps> {
  private cluster: string;
  private database: string;
  private displayName: string;
  private key: string;
  private schema: string;
  private tableName: string;


  constructor(props) {
    super(props);


    const { match } = props;
    const params = match.params;
    this.cluster = params ? params.cluster : '';
    this.database = params ? params.db : '';
    this.schema = params ? params.schema : '';
    this.tableName = params ? params.table : '';
    this.displayName = params ? `${this.schema}.${this.tableName}` : '';

    /*
    This 'key' is the `table_uri` format described in metadataservice. Because it contains the '/' character,
    we can't pass it as a single URL parameter without encodeURIComponent which makes ugly URLs.
    DO NOT CHANGE
    */
    this.key = params ? `${this.database}://${this.cluster}.${this.schema}/${this.tableName}` : '';

  }

  componentDidMount() {
    this.props.getTableData(this.key);
  }


  render() {
    if (this.props.isLoading) return <LoadingSpinner/>;

    const data = this.props.tableData;

    return (
      <div className="resource-detail-layout table-detail-2">
        <header className="resource-header">
          <div className="header-left">
            {/* TODO - Add Breadcrumb */}
            {/* TODO - Add Database Icon */}
            <h2 className="detail-header-text">
              { this.displayName }
              <BookmarkIcon bookmarkKey={ this.props.tableData.key }/>
            </h2>
            <div className="body-3">
              Datasets &bull;
              {/* TODO - Add Database Label */}
            </div>
          </div>
          <div className="header-right">
              Buttons go here
            </div>
        </header>
        <main className="column-layout-1">
          <section className="left-panel">
            <section className="banner">optional banner</section>
            <section className="column-layout-2">
              <section className="left-panel">
                <div className="title-3">Description</div>
                <TableDescEditableText
                  maxLength={ 750 }
                  value={ data.table_description }
                  editable={ data.is_editable }
                />
              </section>
              <section className="right-panel">
                <div className="title-3">Tags</div>
                <TagInput
                  readOnly={ data.is_editable } // TODO - Check readOnly value
                />
              </section>
            </section>
          </section>
          <section className="right-panel">
            <DetailList columns={ data.columns }/>
          </section>
        </main>
      </div>
    );
  }
}




export const mapStateToProps = (state: GlobalState) => {
  return {
    isLoading: state.tableMetadata.isLoading,
    statusCode: state.tableMetadata.statusCode,
    tableData: state.tableMetadata.tableData,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getTableData } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(TableDetail_v2);
