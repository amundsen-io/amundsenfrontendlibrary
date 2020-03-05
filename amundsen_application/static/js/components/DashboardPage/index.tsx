import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import * as qs from 'simple-query-string';

import AvatarLabel from 'components/common/AvatarLabel';
import Breadcrumb from 'components/common/Breadcrumb';
import BookmarkIcon from 'components/common/Bookmark/BookmarkIcon';
import LoadingSpinner from 'components/common/LoadingSpinner';
import { EditableSection } from 'components/TableDetail/EditableSection';
import FrequentUsers from 'components/TableDetail/FrequentUsers';
import TabsComponent from 'components/common/TabsComponent';
import { getDashboard } from 'ducks/dashboard/reducer';
import { GetDashboardRequest } from 'ducks/dashboard/types';
import { GlobalState } from 'ducks/rootReducer';
import { logClick } from 'ducks/utilMethods';
import { Dashboard } from 'interfaces/Dashboard';

export interface RouteProps {
  uri: string;
}

interface DashboardPageState {
  uri: string;
}

export interface StateFromProps {
  isLoading: boolean;
  dashboard: Dashboard;
}

export interface DispatchFromProps {
  getDashboard: (payload: { uri: string, index?: string, source?: string }) => GetDashboardRequest;
}

export type DashboardPageProps = RouteComponentProps<RouteProps> & StateFromProps & DispatchFromProps;

export class DashboardPage extends React.Component<DashboardPageProps, DashboardPageState> {
  constructor(props) {
    super(props);

    const { uri } = qs.parse(this.props.location.search);
    this.state = { uri };
  }

  componentDidMount() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.props.getDashboard({ uri: this.state.uri });
  }

  renderTabs() {
    const tabInfo = [
      {
        content: <span>Charts</span>,
        key: 'charts',
        title: 'Charts',
      },
      {
        content: <span>Queries</span>,
        key: 'queries',
        title: 'Queries',
      },
      {
        content: <span>Tables</span>,
        key: 'tables',
        title: 'Tables',
      }
    ];
    return <TabsComponent tabs={ tabInfo } defaultTab={ "charts" } />;
  }

  render() {
    const { dashboard, isLoading } = this.props;

    if (isLoading) {
      return <LoadingSpinner/>;
    }

    return (
      <div className="resource-detail-layout dashboard-page">
        <header className="resource-header">
          <div className="header-section">
            <Breadcrumb />
            <img className="icon icon-header icon-dashboard"/>
          </div>
          <div className="header-section header-title">
            <h3 className="header-title-text truncated">
              { dashboard.name }
            </h3>
            <BookmarkIcon bookmarkKey={ '' }/>
            <div className="body-2">
              Dashboard in&nbsp;
              <a id="dashboard-group-link"
                 onClick={ logClick }
                 href={ dashboard.group_url }
                 target="_blank">{ dashboard.group_name }</a>
            </div>
          </div>
          {/* <div className="header-section header-links">links here</div> */}
          <div className="header-section header-buttons">
            <a id="dashboard-link"
               target="_blank"
               href={ dashboard.url }
               onClick={ logClick }
               className="btn btn-default btn-lg">Open Dashboard</a>
          </div>
        </header>
        <main className="column-layout-1">
          <section className="left-panel">
            <EditableSection title="Description">
              { dashboard.description }
            </EditableSection>
            <section className="column-layout-2">
                <section className="left-panel">
                  <div className="section-title title-3">Frequent Users</div>
                  <FrequentUsers readers={ dashboard.frequent_users }/>
                </section>
                <section className="right-panel">
                  <div className="section-title title-3">Owners</div>
                  <div>
                    {
                      // TODO - OwnerEditor only supports tables
                      dashboard.owners.map(owner =>
                        <AvatarLabel
                          key={owner.user_id}
                          label={owner.display_name}
                          src={`/user/${owner.user_id}`} />
                      )
                    }
                  </div>
                </section>
            </section>
          </section>
          <section className="right-panel">
            { this.renderTabs() }
          </section>
        </main>
      </div>
   );
  }
}

export const mapStateToProps = (state: GlobalState) => {
  return {
    isLoading: state.dashboard.isLoading,
    dashboard: state.dashboard.dashboard,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getDashboard } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(DashboardPage);
