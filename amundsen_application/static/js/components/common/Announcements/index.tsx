import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { GlobalState } from 'ducks/rootReducer';
import { GetAnnouncementsRequest } from 'ducks/announcements/types';
import { getAnnouncements } from 'ducks/announcements/reducer';

import { AnnouncementPost } from 'interfaces';

import AnnouncementsList from './AnnouncementsList';

export interface StateFromProps {
  announcements: AnnouncementPost[];
}

export interface DispatchFromProps {
  announcementsGet: () => GetAnnouncementsRequest;
}

export type AnnouncementContainerProps = StateFromProps & DispatchFromProps;

const AnnouncementsListContainer: React.FC<AnnouncementContainerProps> = ({
  announcements,
  announcementsGet,
}: AnnouncementContainerProps) => {
  React.useEffect(() => {
    announcementsGet();
  });

  return (
    <AnnouncementsList
      hasError={false}
      isLoading={false}
      announcements={announcements}
    />
  );
};

export const mapStateToProps = (state: GlobalState) => {
  return {
    announcements: state.announcements.posts,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ announcementsGet: getAnnouncements }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncementsListContainer);
