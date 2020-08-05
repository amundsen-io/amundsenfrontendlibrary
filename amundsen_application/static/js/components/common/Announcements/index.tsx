import * as React from 'react';
import { Link } from 'react-router-dom';

import { AnnouncementPost } from 'interfaces';

import {
  MORE_LINK_TEXT,
  NO_ANNOUNCEMENTS_TEXT,
  ANNOUNCEMENTS_ERROR_TEXT,
} from './constants';

const ANNOUNCEMENT_LIST_THRESHOLD = 3;
const ANNOUNCEMENTS_PAGE_PATH = '/announcements';

export interface AnnouncementsListProps {
  announcements: AnnouncementPost[];
  hasError?: boolean;
}

const getLatestsAnnouncements = (announcements: AnnouncementPost[]) => {
  return announcements.length > ANNOUNCEMENT_LIST_THRESHOLD
    ? announcements.splice(announcements.length - ANNOUNCEMENT_LIST_THRESHOLD)
    : announcements;
};

const AnnouncementItem: React.FC<AnnouncementPost> = ({
  date,
  title,
  html_content,
}: AnnouncementPost) => {
  return (
    <li className="announcement">
      <div className="announcement-date">{date}</div>
    </li>
  );
};

const EmptyAnnouncement = () => {
  return <li className="empty-announcement">{NO_ANNOUNCEMENTS_TEXT}</li>;
};

const AnnouncementError = () => {
  return <li className="announcement-error">{ANNOUNCEMENTS_ERROR_TEXT}</li>;
};

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
  announcements,
  hasError,
}: AnnouncementsListProps) => {
  let listContent = null;

  if (announcements.length === 0) {
    listContent = <EmptyAnnouncement />;
  }
  if (announcements.length > 0) {
    listContent = getLatestsAnnouncements(
      announcements
    ).map(({ date, title, html_content }) => (
      <AnnouncementItem
        key={`key:${date}`}
        date={date}
        title={title}
        html_content={html_content}
      />
    ));
  }
  if (hasError) {
    listContent = <AnnouncementError />;
  }

  return (
    <div>
      <ul className="announcements-list">{listContent}</ul>
      <Link to={ANNOUNCEMENTS_PAGE_PATH} className="announcements-more-link">
        {MORE_LINK_TEXT}
      </Link>
    </div>
  );
};

export default AnnouncementsList;
