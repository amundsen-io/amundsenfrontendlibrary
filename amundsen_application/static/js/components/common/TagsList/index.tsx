// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './styles.scss';

import ShimmeringTagListLoader from 'components/common/ShimmeringTagListLoader';

import TagInfo from 'components/Tags/TagInfo';
import { Tag } from 'interfaces';

import { GlobalState } from 'ducks/rootReducer';
import { getAllTags } from 'ducks/tags/reducer';
import { GetAllTagsRequest } from 'ducks/tags/types';
import { getCuratedTags, showAllTags } from 'config/config-utils';

export interface StateFromProps {
  curatedTags: Tag[];
  otherTags: Tag[];
  isLoading: boolean;
}

interface OwnProps {
  /* determine if we only want curated/popular tags with
  'see more' or the entire tags list */
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
    return tagArray.sort(
      (a,b) => {
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
    const tagsByUsage = this.getTagsByUsage(otherTags.filter(
      tag => {
        return tag.tag_count > 0;
      }
    ));
    
    // TODO add constant here
    // TODO add test to verify this works as expected when there are less than 20 tags
    const popularTags = this.sortTagsAlphabetically(tagsByUsage.slice(0, 20));
    // TODO maybe rename remainingTags to something that differentiates it from otherTags
    const remainingTags = this.sortTagsAlphabetically(tagsByUsage.slice(20, tagsByUsage.length));
    
    // TODO refactor this logic to all be within the return statement
    if (this.props.shortTagList) {
      return (
        <div id="tags-list" className="tags-list">
          {curatedTags.length == 0 &&
            popularTags.length > 0 &&
            this.generateTagInfo(popularTags)}
          {curatedTags.length > 0 && this.generateTagInfo(curatedTags)}
          {showAllTags() && curatedTags.length > 0 && otherTags.length > 0 && (
            <hr />
          )}
          {showAllTags() &&
            otherTags.length > 0 &&
            this.generateTagInfo(otherTags)}
          {!showAllTags() && this.generateBrowseTagLink()}
        </div>
      );
    }

    // Browse page TagList
    return (
      <div>
        {this.generateTagsSectionLabel('Popular Tags')}
        {curatedTags.length == 0 &&
          popularTags.length > 0 &&
          this.generateTagInfo(popularTags)}
        {curatedTags.length > 0 && this.generateTagInfo(curatedTags)}

        {(remainingTags.length > 0 || otherTags.length > 0) &&
          this.generateTagsSectionLabel('Other Tags')}
        {curatedTags.length > 0 &&
          otherTags.length > 0 &&
          this.generateTagInfo(otherTags)}
        {curatedTags.length == 0 &&
          remainingTags.length > 0 &&
          this.generateTagInfo(remainingTags)}
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
