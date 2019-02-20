import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { GlobalState } from "../../../ducks/rootReducer";
import { getPreviewData } from '../../../ducks/tableMetadata/reducer';

import DataPreviewButton, { ComponentProps, DispatchFromProps, StateFromProps, getStatusFromCode } from '../../../components/TableDetail/DataPreviewButton';

export const mapStateToProps = (state: GlobalState) => {
  return {
    previewData: state.tableMetadata.preview.data,
    status: getStatusFromCode(state.tableMetadata.preview.status),
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getPreviewData } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps, ComponentProps>(mapStateToProps, mapDispatchToProps)(DataPreviewButton);
