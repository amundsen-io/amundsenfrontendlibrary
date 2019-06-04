import * as React from 'react';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

import { GlobalState } from 'ducks/rootReducer';
import { bindActionCreators } from 'redux';
import SearchPage from 'components/SearchPage';

interface HomePageState {
}

export interface StateFromProps {
}

export interface DispatchFromProps {
}

export type HomePageProps = StateFromProps & DispatchFromProps;

export class HomePage extends React.Component<HomePageProps, HomePageState> {
  public static defaultProps: Partial<HomePageProps> = {};

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default HomePage;
