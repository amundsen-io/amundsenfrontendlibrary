// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0
import { connect } from 'react-redux';

import { GlobalState } from 'ducks/rootReducer';

import OwnerEditor, {
  ComponentProps,
  StateFromProps,
} from 'components/common/OwnerEditor';

import { indexUsersEnabled } from 'config/config-utils';

export const DASHBOARD_OWNER_SOURCE = 'dashboard_page_owner';
export const mapStateToProps = (state: GlobalState) => {
  const ownerList = state.dashboard.dashboard.owners;
  const items = ownerList.reduce((obj, ownerObj) => {
    const { profile_url, user_id, display_name } = ownerObj;
    let profileLink = profile_url;
    let isExternalLink = true;
    if (indexUsersEnabled()) {
      isExternalLink = false;
      profileLink = `/user/${user_id}?source=${DASHBOARD_OWNER_SOURCE}`;
    }
    obj[user_id] = {
      label: display_name,
      link: profileLink,
      isExternal: isExternalLink,
    };
    return obj;
  }, {});

  return {
    isLoading: false,
    itemProps: items,
  };
};

export default connect<StateFromProps, {}, ComponentProps>(
  mapStateToProps,
  null,
)(OwnerEditor);
