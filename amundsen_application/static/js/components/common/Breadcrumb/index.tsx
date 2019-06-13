import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './styles.scss';
import { GlobalState } from 'ducks/rootReducer';

export interface OwnProps {
  path?: string;
  text?: string;
}

export interface StateFromProps {
  searchTerm: string;
}

export type BreadcrumbProps = OwnProps & StateFromProps;

export const Breadcrumb: React.SFC<BreadcrumbProps> = ({path, text, searchTerm}) => {
  if (searchTerm) {
    path = `/search?searchTerm=${searchTerm}&selectedTab=table&pageIndex=0`
    text = 'Search Results'
  }
  return (
    <div className="amundsen-breadcrumb">
      <Link to={path}>
        <button className='btn btn-flat-icon title-3'>
          <img className='icon icon-left'/>
          <span>{text}</span>
        </button>
      </Link>
    </div>
  );
};

Breadcrumb.defaultProps = {
  path: '/',
  text: 'Home',
  searchTerm: '',
};

export const mapStateToProps = (state: GlobalState) => {
  return {
    searchTerm: state.search.search_term,
  };
};

export default connect<StateFromProps>(mapStateToProps, null)(Breadcrumb);
