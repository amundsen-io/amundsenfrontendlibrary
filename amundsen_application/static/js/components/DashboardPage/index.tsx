import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import * as qs from 'simple-query-string';

import AvatarLabel from 'components/common/AvatarLabel';
import Breadcrumb from 'components/common/Breadcrumb';
import BookmarkIcon from 'components/common/Bookmark/BookmarkIcon';
import LoadingSpinner from 'components/common/LoadingSpinner';
import TabsComponent from 'components/common/TabsComponent';
import { getDashboard } from 'ducks/dashboard/reducer';
import { GetDashboardRequest } from 'ducks/dashboard/types';
import { GlobalState } from 'ducks/rootReducer';
import { logClick } from 'ducks/utilMethods';
import { Dashboard } from 'interfaces/Dashboard';
import ImagePreview from './ImagePreview';
import QueryList from 'components/DashboardPage/QueryList';
import ChartList from 'components/DashboardPage/ChartList';
import { formatDateTimeShort } from '../../utils/dateUtils';
import ResourceList from 'components/common/ResourceList';
import { DASHBOARD_OWNER_SOURCE, DASHBOARD_SOURCE, TABLES_PER_PAGE } from 'components/DashboardPage/constants';
import TagInput from 'components/Tags/TagInput';
import { EditableSection } from 'components/TableDetail/EditableSection';
import { ResourceType } from 'interfaces';

import './styles.scss';

export interface RouteProps {
  uri: string;
}

interface DashboardPageState {
  uri: string;
}

export interface StateFromProps {
  isLoading: boolean;
  statusCode: number;
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
        content:
          (
            <ResourceList
              allItems={ this.props.dashboard.tables }
              itemsPerPage={ TABLES_PER_PAGE }
              paginate={ false }
              source={ DASHBOARD_SOURCE }
            />
          ),
        key: 'tables',
        title: 'Tables',
      },
      {
        content: <ChartList charts={ this.props.dashboard.chart_names }/>,
        key: 'charts',
        title: 'Charts',
      },
      {
        content: <QueryList queries={ this.props.dashboard.query_names }/>,
        key: 'queries',
        title: 'Queries',
      },
    ];
    return <TabsComponent tabs={ tabInfo } defaultTab={ "tables" } />;
  }

  render() {
    const { dashboard, isLoading } = this.props;

    if (isLoading) {
      return <LoadingSpinner/>;
    }
    if (this.props.statusCode === 500) {
      return (
        <div className="container error-label">
          <Breadcrumb />
          <label>Something went wrong...</label>
        </div>
      );
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
            <BookmarkIcon bookmarkKey={ dashboard.uri } resourceType={ ResourceType.dashboard } />
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
            <div className="section-title title-3">Description</div>
            <div>
              { dashboard.description }
            </div>
            <section className="column-layout-2">
              <section className="left-panel">
                <div className="section-title title-3">Owners</div>
                <div>
                  {
                    dashboard.owners.map(owner =>
                      <Link
                        key={owner.user_id}
                        to={`/user/${owner.user_id}?source=${DASHBOARD_OWNER_SOURCE}`}>
                        <AvatarLabel
                          label={owner.display_name}/>
                      </Link>
                    )
                  }
                </div>
                <div className="section-title title-3">Created</div>
                <div>
                  { formatDateTimeShort({ epochTimestamp: dashboard.created_timestamp}) }
                </div>
                <div className="section-title title-3">Last Updated</div>
                <div>
                  { formatDateTimeShort({ epochTimestamp: dashboard.updated_timestamp }) }
                </div>
                <div className="section-title title-3">Recent View Count</div>
                <div>
                  { dashboard.recent_view_count }
                </div>
              </section>
              <section className="right-panel">
                <EditableSection title="Tags">
                  <TagInput
                    resourceType={ ResourceType.dashboard }
                    uriKey={ this.props.dashboard.uri }
                  />
                </EditableSection>
                <div className="section-title title-3">Last Successful Run</div>
                <div>
                  { formatDateTimeShort({ epochTimestamp: dashboard.last_successful_run_timestamp }) }
                </div>
                <div className="section-title title-3">Last Run</div>
                <div>
                  { formatDateTimeShort({ epochTimestamp: dashboard.last_run_timestamp }) }
                  <div className="last-run-state title-3">
                    { dashboard.last_run_state }
                  </div>
                </div>
              </section>
            </section>
            <ImagePreview uri={this.state.uri} />
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
    statusCode: state.dashboard.statusCode,
    dashboard: state.dashboard.dashboard,
  };
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({ getDashboard } , dispatch);
};

export default connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(DashboardPage);
