// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ShimmeringTagListLoader from 'components/common/ShimmeringTagListLoader';
import TagInfo from 'components/Tags/TagInfo';
import { Tag } from 'interfaces';

import { GlobalState } from 'ducks/rootReducer';
import { getAllTags } from 'ducks/tags/reducer';
import { GetAllTagsRequest } from 'ducks/tags/types';
import { getCuratedTags } from 'config/config-utils';

import {
  POPULAR_TAGS_TITLE,
  CURATED_TAGS_TITLE,
  POPULAR_TAGS_NUMBER,
  OTHER_TAGS_TITLE,
} from './constants';
import './styles.scss';

export interface StateFromProps {
  curatedTags: Tag[];
  otherTags: Tag[];
  isLoading: boolean;
}

interface OwnProps {
  /* determine if we only want curated/popular tags with
  'Browse more tags' link or the entire tags list */
  shortTagList: boolean;
}

export interface DispatchFromProps {
  getAllTags: () => GetAllTagsRequest;
}

export type TagsListProps = StateFromProps & DispatchFromProps & OwnProps;

export class TagsList extends React.Component<TagsListProps> {
  componentDidMount() {
    this.props.getAllTags();
  }

  getTagsByUsage(tagArray: Tag[]) {
    return tagArray
      .sort((a, b) => {
        return a.tag_count - b.tag_count;
      })
      .reverse();
  }

  generateTagInfo(tagArray: Tag[]) {
    return tagArray.map((tag, index) => (
      <TagInfo data={tag} compact={false} key={index} />
    ));
  }

  generateTagsSectionLabel(labelName: string) {
    // TODO maybe add classes query-list-item-name column-name to label

    return (
      <label className="section-label">
        <span className="section-title title-2">{labelName}</span>
      </label>
    );
  }

  generateBrowseTagLink() {
    return (
      <span>
        <a className="browse-tags-link" href="/browse">
          Browse all tags
        </a>
      </span>
    );
  }

  sortTagsAlphabetically(tagArray: Tag[]) {
    return tagArray.sort((a, b) => {
      if (a.tag_name < b.tag_name) return -1;
      if (a.tag_name > b.tag_name) return 1;
      return 0;
    });
  }

  render() {
    const { isLoading, curatedTags, otherTags } = this.props;

    if (isLoading) {
      return <ShimmeringTagListLoader />;
    }

    const tagsByUsage = this.getTagsByUsage(
      otherTags.filter((tag) => {
        return tag.tag_count > 0;
      })
    );
    const popularTags = this.sortTagsAlphabetically(
      tagsByUsage.slice(0, POPULAR_TAGS_NUMBER)
    );
    const remainingTags = this.sortTagsAlphabetically(
      tagsByUsage.slice(POPULAR_TAGS_NUMBER, tagsByUsage.length)
    );

    if (this.props.shortTagList) {
      // Home page TagList
      return (
        <div className="short-tag-list">
          <h2 className="title-1">
            {curatedTags.length == 0 &&
              popularTags.length > 0 &&
              POPULAR_TAGS_TITLE}
            {curatedTags.length > 0 && CURATED_TAGS_TITLE}
          </h2>
          <div id="tags-list" className="tags-list">
            {curatedTags.length == 0 &&
              popularTags.length > 0 &&
              this.generateTagInfo(popularTags)}
            {curatedTags.length > 0 && this.generateTagInfo(curatedTags)}
            {this.generateBrowseTagLink()}
          </div>
        </div>
      );
    }
    // Browse page TagList
    return (
      <div className="full-tag-list">
        {curatedTags.length == 0 &&
          popularTags.length > 0 &&
          this.generateTagsSectionLabel(POPULAR_TAGS_TITLE)}
        {curatedTags.length > 0 &&
          this.generateTagsSectionLabel(CURATED_TAGS_TITLE)}

        <div className="tags-list">
          {curatedTags.length == 0 &&
            popularTags.length > 0 &&
            this.generateTagInfo(popularTags)}
          {curatedTags.length > 0 && this.generateTagInfo(curatedTags)}
        </div>

        {(remainingTags.length > 0 || otherTags.length > 0) &&
          this.generateTagsSectionLabel(OTHER_TAGS_TITLE)}
        <div className="tags-list">
          {curatedTags.length > 0 &&
            otherTags.length > 0 &&
            this.generateTagInfo(otherTags)}
          {curatedTags.length == 0 &&
            remainingTags.length > 0 &&
            this.generateTagInfo(remainingTags)}
        </div>
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  // TODO: These functions are selectors, consider moving them into the ducks
  const curatedTagsList = getCuratedTags();
  const allTags = state.tags.allTags.tags;
  const curatedTags = allTags.filter(
    (tag) => curatedTagsList.indexOf(tag.tag_name) !== -1
  );
  const otherTags = allTags.filter(
    (tag) => curatedTagsList.indexOf(tag.tag_name) === -1
  );

  return {
    curatedTags,
    otherTags,
    isLoading: state.tags.allTags.isLoading,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getAllTags }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps, OwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(TagsList);
