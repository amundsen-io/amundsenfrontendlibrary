import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { GlobalState } from "../../../ducks/rootReducer";
import { updateTableOwner } from '../../../ducks/tableMetadata/owners/reducer';

import AvatarLabelList, { ComponentProps, DispatchFromProps, StateFromProps } from '../../../components/AvatarLabelList';
import { AvatarLabelProps } from '../../../components/common/AvatarLabel';

export const mapStateToProps = (state: GlobalState) => {
  const items = state.tableMetadata.tableOwners.owners.map((entry) => {
    // TODO: owner user object needs a proper id
    return [entry.display_name, { label: entry.display_name }] as [string, AvatarLabelProps];
  });
  return {
    itemProps: new Map<string, AvatarLabelProps>(items),
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ onUpdateList: updateTableOwner } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps, ComponentProps>(mapStateToProps, mapDispatchToProps)(AvatarLabelList);
