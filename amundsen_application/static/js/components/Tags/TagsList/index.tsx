// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Link } from 'react-router-dom';

import ShimmeringTagListLoader from 'components/common/ShimmeringTagListLoader';
import TagInfo from 'components/Tags/TagInfo';
import { Tag } from 'interfaces';

import {
  POPULAR_TAGS_TITLE,
  CURATED_TAGS_TITLE,
  BROWSE_MORE_TAGS_TEXT,
  OTHER_TAGS_TITLE,
  BROWSE_TAGS_TITLE,
  BROWSE_PAGE_PATH,
} from './constants';
import './styles.scss';

export type TagsListProps = StateFromProps & OwnProps;

export interface StateFromProps {
  curatedTags: Tag[];
  popularTags: Tag[];
  otherTags?: Tag[];
  isLoading?: boolean;
}

interface OwnProps {
  /* determine if we only want curated/popular tags with
  'Browse more tags' link or the entire tags list */
  shortTagsList?: boolean;
}

interface TagsListTitleProps {
  titleText: string;
}

const TagsListTitle: React.FC<TagsListTitleProps> = ({titleText}) => (
  <h1 className="title-1" id="browse-header">
    {titleText}
  </h1>
);

const TagsListLabel: React.FC<TagsListTitleProps> = ({titleText}) => (
  <label className="section-label">
    <span className="section-title title-2">{titleText}</span>
  </label>
);

interface TagsListBlockProps {
  tags: Tag[];
}

const TagsListBlock: React.FC<TagsListBlockProps> = ({tags}) => {
  return (
    <div id="tags-list" className="tags-list">
      {tags.map((tag, index) => (
        <TagInfo data={tag} compact={false} key={index} />
      ))}
    </div>
  );
};

const ShortTagsList: React.FC<TagsListProps> = ({
  curatedTags,
  popularTags,
}: TagsListProps) => {
  return (
    <div className="short-tag-list">
      {curatedTags.length === 0 &&
        popularTags.length > 0 && <TagsListTitle titleText={POPULAR_TAGS_TITLE}/>}
      {curatedTags.length > 0 && <TagsListTitle titleText={CURATED_TAGS_TITLE}/>}
      {curatedTags.length === 0 &&
        popularTags.length > 0 &&
        <TagsListBlock tags={popularTags}/>}
      {curatedTags.length > 0 && <TagsListBlock tags={curatedTags}/>}
      <span>
        <Link to={BROWSE_PAGE_PATH} className="browse-tags-link">
          {BROWSE_MORE_TAGS_TEXT}
        </Link>
      </span>
    </div>
  );
}

const LongTagsList: React.FC<TagsListProps> = ({
  curatedTags,
  popularTags,
  otherTags,
}: TagsListProps) => {
  return (
    <div className="full-tag-list">
      {<TagsListTitle titleText={BROWSE_TAGS_TITLE}/>}
      <hr className="header-hr" />
      {curatedTags.length === 0 && popularTags.length > 0 && <TagsListLabel titleText={POPULAR_TAGS_TITLE}/>}
      {curatedTags.length > 0 &&
        <TagsListLabel titleText={CURATED_TAGS_TITLE}/>}
        {curatedTags.length === 0 && popularTags.length > 0 && <TagsListBlock tags={popularTags}/>}
        {curatedTags.length > 0 && <TagsListBlock tags={curatedTags}/>}
      {(otherTags.length > 0) &&
        <TagsListLabel titleText={OTHER_TAGS_TITLE}/>}
      {otherTags.length > 0 &&
        <TagsListBlock tags={otherTags}/>}
    </div>
  );
}

const TagsList: React.FC<TagsListProps> = ({
  curatedTags,
  popularTags,
  otherTags,
  isLoading,
  shortTagsList,
}: TagsListProps) => {
  if (isLoading) {
    return <ShimmeringTagListLoader />;
  }
  if (shortTagsList){
    return <ShortTagsList
      curatedTags={curatedTags}
      popularTags={popularTags}
    />;
  }
  else {
    return <LongTagsList
      curatedTags={curatedTags}
      popularTags={popularTags}
      otherTags={otherTags}
    />
  }
}

export default TagsList;