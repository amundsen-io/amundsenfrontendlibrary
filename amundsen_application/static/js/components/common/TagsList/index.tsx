import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './styles.scss';

import AppConfig from 'config/config';
import LoadingSpinner from 'components/common/LoadingSpinner';
import TagInfo from 'components/Tags/TagInfo';
import { Tag } from 'interfaces';

import { GlobalState } from 'ducks/rootReducer';
import { getAllTags } from 'ducks/allTags/reducer';
import { GetAllTagsRequest } from 'ducks/allTags/types';

export interface StateFromProps {
  allTags: Tag[];
  curatedTags: Tag[];
  otherTags: Tag[];
  isLoading: boolean;
}

export interface DispatchFromProps {
  getAllTags: () => GetAllTagsRequest;
}

export type TagsListProps = StateFromProps & DispatchFromProps;

export class TagsList extends React.Component<TagsListProps> {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getAllTags();
  }

  generateTagInfo(tagArray: Tag[]) {
    return tagArray.map((tag, index) =>
      <TagInfo data={ tag } compact={ false } key={ index }/>)
  }

  render() {
    if (this.props.isLoading) {
      return <LoadingSpinner/>;
    }
    if (AppConfig.browse.curatedTags.length === 0) {
      return (
        <div id="tags-list" className="tags-list">
          { this.generateTagInfo(this.props.allTags) }
        </div>
      );
    }
    return (
      <div id="tags-list" className="tags-list">
        { this.generateTagInfo(this.props.curatedTags) }
        {
          AppConfig.browse.showAllTags && this.props.curatedTags.length > 0 && this.props.otherTags.length > 0 &&
            <>
              <hr />
              { this.generateTagInfo(this.props.otherTags) }
            </>
        }
      </div>
    );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    allTags: state.allTags.allTags,
    curatedTags: state.allTags.curatedTags,
    otherTags: state.allTags.otherTags,
    isLoading: state.allTags.isLoading,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getAllTags } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(TagsList);
