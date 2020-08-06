import * as React from 'react';
import { Link } from 'react-router-dom';
import SanitizedHTML from 'react-sanitized-html';

import { AnnouncementPost } from 'interfaces';

import {
  MORE_LINK_TEXT,
  NO_ANNOUNCEMENTS_TEXT,
  ANNOUNCEMENTS_ERROR_TEXT,
  HEADER_TEXT,
} from '../constants';

const ANNOUNCEMENT_LIST_THRESHOLD = 3;
const ANNOUNCEMENTS_PAGE_PATH = '/announcements';

export interface AnnouncementsListProps {
  announcements: AnnouncementPost[];
  hasError?: boolean;
  isLoading?: boolean;
}

const getLatestsAnnouncements = (announcements: AnnouncementPost[]) =>
  announcements.length > ANNOUNCEMENT_LIST_THRESHOLD
    ? announcements.splice(announcements.length - ANNOUNCEMENT_LIST_THRESHOLD)
    : announcements;

const times = (numItems: number) => new Array(numItems).fill(0);

const AnnouncementItem: React.FC<AnnouncementPost> = ({
  date,
  title,
  html_content,
}: AnnouncementPost) => {
  return (
    <li className="announcement">
      <Link to={ANNOUNCEMENTS_PAGE_PATH} className="announcement-link">
        <h3 className="announcement-title">{title}</h3>
        <time className="announcement-date">{date}</time>
        <hr />
        <SanitizedHTML className="announcement-content" html={html_content} />
      </Link>
    </li>
  );
};

const EmptyAnnouncementItem: React.FC = () => (
  <li className="empty-announcement">{NO_ANNOUNCEMENTS_TEXT}</li>
);
const AnnouncementErrorItem: React.FC = () => (
  <li className="announcement-error">{ANNOUNCEMENTS_ERROR_TEXT}</li>
);
const ShimmeringLoaderItem: React.FC = () => (
  <li className="shimmer-loader-item is-shimmer-animated" />
);

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({
  announcements,
  hasError,
  isLoading,
}: AnnouncementsListProps) => {
  let listContent = null;

  if (announcements.length === 0) {
    listContent = <EmptyAnnouncementItem />;
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
    listContent = <AnnouncementErrorItem />;
  }
  if (isLoading) {
    listContent = times(3).map((_, index) => (
      <ShimmeringLoaderItem key={`key:${index}`} />
    ));
  }

  return (
    <article>
      <h2 className="announcements-list-title">{HEADER_TEXT}</h2>
      <ul className={`announcements-list ${isLoading ? 'shimmer-loader' : ''}`}>
        {listContent}
      </ul>
      <Link
        to={ANNOUNCEMENTS_PAGE_PATH}
        className="announcements-list-more-link"
      >
        {MORE_LINK_TEXT}
      </Link>
    </article>
  );
};

export default AnnouncementsList;
