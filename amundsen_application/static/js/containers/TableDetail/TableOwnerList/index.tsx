import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { GlobalState } from "../../../ducks/rootReducer";
import { updateTableOwner, UpdateMethod } from '../../../ducks/tableMetadata/reducer';

import AvatarLabelList, { ComponentProps, DispatchFromProps, StateFromProps } from '../../../components/AvatarLabelList';

export const mapStateToProps = (state: GlobalState) => {
  const items = state.tableMetadata.tableOwners.owners.map((entry) => {
    // TODO: owner user object needs a proper id
    return [entry.display_name, { label: entry.display_name }] as [string, {}];
  });
  return {
    isLoading: false,
    itemProps: new Map<string, {}>(items),
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ onUpdateList: updateTableOwner } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps, ComponentProps>(mapStateToProps, mapDispatchToProps)(AvatarLabelList);
