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
    return tagArray.sort((a, b) => {
      return a.tag_count - b.tag_count;
    }).reverse();
  }

  generateTagInfo(tagArray: Tag[]) {
    return tagArray.map((tag, index) => (
      <TagInfo data={tag} compact={false} key={index} />
    ));
  }

  generateTagsSectionLabel(labelName: string) {
    return(
      <label className="section-label">
        <span className={'section-title title-2'}>{labelName}</span>
      </label>
    );
  }

  render() {
    const { isLoading, curatedTags, otherTags } = this.props;

    if (isLoading) {
      return <ShimmeringTagListLoader />;
    }
    let tagsByUsage = this.getTagsByUsage(otherTags); // TODO add constant here
    // TODO add test to verify this wroks as expected when there are less than 20 tags
    let popularTags = tagsByUsage.slice(0, 20);
    let remainingTags = tagsByUsage.slice(20, tagsByUsage.length);
    // TODO refactor this logic to all be within the return statement
    if (this.props.shortTagList == true) {
      return (
        <div id="tags-list" className="tags-list">
          {curatedTags.length == 0 && popularTags.length > 0 && this.generateTagInfo(popularTags)}
          {curatedTags.length > 0 && this.generateTagInfo(curatedTags)}
          {showAllTags() && curatedTags.length > 0 && otherTags.length > 0 && (
            <hr />
          )}
          {showAllTags() &&
            otherTags.length > 0 &&
            this.generateTagInfo(otherTags)}
          <span><a className={'browse-tags-link'} href={'/browse'}>Browse all tags</a></span>
        </div>
      );
    }
    else {
      return (
        <div>
          {this.generateTagsSectionLabel('Popular Tags')}
          {curatedTags.length == 0 && popularTags.length > 0 && this.generateTagInfo(popularTags)}
          {curatedTags.length > 0 && this.generateTagInfo(curatedTags)}
          {remainingTags.length > 0 && this.generateTagsSectionLabel('Other Tags')}
          {remainingTags.length > 0 && this.generateTagInfo(remainingTags)}
        </div>
      );
    }
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
