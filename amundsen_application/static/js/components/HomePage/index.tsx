// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import Joyride from 'react-joyride';

import MyBookmarks from 'components/common/Bookmark/MyBookmarks';
import Breadcrumb from 'components/common/Breadcrumb';
import PopularTables from 'components/common/PopularTables';
import { resetSearchState } from 'ducks/search/reducer';
import { UpdateSearchStateReset } from 'ducks/search/types';
import SearchBar from 'components/common/SearchBar';
import TagsList from 'components/common/TagsList';
import {
  SEARCH_BREADCRUMB_TEXT,
  HOMEPAGE_TITLE,
  TAGS_TITLE,
} from './constants';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

export interface DispatchFromProps {
  searchReset: () => UpdateSearchStateReset;
}

export type HomePageProps = DispatchFromProps & RouteComponentProps<any>;

const steps = [
  {
    target: '.search-bar-input',
    content: 'Use the search input to search for data',
  },
  {
    target: '.bookmark-list-container',
    content:
      'Star tables as you navigate to have them handy when you come back to Amundsen!',
  },
];

const steps2 = [
  {
    target: '.filter-breadcrumb',
    content: 'Try the new Advanced Search feature!',
  },
];

export class HomePage extends React.Component<HomePageProps> {
  componentDidMount() {
    this.props.searchReset();
  }

  render() {
    return (
      <main className="container home-page">
        <Joyride
          steps={steps}
          run={true}
          continuous={true}
          showSkipButton={true}
        />
        <div className="row">
          <div className="col-xs-12 col-md-offset-1 col-md-10">
            <h1 className="sr-only">{HOMEPAGE_TITLE}</h1>
            <SearchBar />
            <div className="filter-breadcrumb pull-right">
              <Joyride steps={steps2} run={true} disableOverlay={true} />
              <Breadcrumb
                direction="right"
                path="/search"
                text={SEARCH_BREADCRUMB_TEXT}
              />
            </div>
            <div className="home-element-container">
              <h2
                id="browse-tags-header"
                className="title-1 browse-tags-header"
              >
                {TAGS_TITLE}
              </h2>
              <TagsList />
            </div>
            <div className="home-element-container bookmark-list-container">
              <MyBookmarks />
            </div>
            <div className="home-element-container">
              <PopularTables />
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(
    {
      searchReset: () => resetSearchState(),
    },
    dispatch
  );
};

export default connect<DispatchFromProps>(null, mapDispatchToProps)(HomePage);
