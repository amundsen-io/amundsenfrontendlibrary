import { GlobalState } from 'ducks/rootReducer';
import { SendingState } from 'components/Feedback/types';

const globalState: GlobalState = {
  announcements: {
      posts: [{
        date: '12/31/1999',
        title: 'Y2K',
        html_content: '<div>The end of the world</div>',
      },
      {
        date: '01/01/2000',
        title: 'False Alarm',
        html_content: '<div>Just kidding</div>',
      }],
  },
  feedback: {
      sendState: SendingState.IDLE,
  },
  popularTables: [],
  search: {
    search_term: '',
    dashboards: {
      page_index: 0,
      results: [],
      total_results: 0,
    },
    tables: {
      page_index: 0,
      results: [],
      total_results: 0,
    },
    users: {
      page_index: 0,
      results: [],
      total_results: 0,
    },
  },
  tableMetadata: {
    isLoading: true,
    lastIndexed: 1555632106,
    preview: {
      data: {},
      status: null,
    },
    statusCode: null,
    tableData: {
      cluster: '',
      columns: [],
      database: '',
      is_editable: false,
      is_view: false,
      schema: '',
      table_name: '',
      table_description: '',
      table_writer: { application_url: '', description: '', id: '', name: '' },
      partition: { is_partitioned: false },
      table_readers: [],
      source: { source: '', source_type: '' },
      watermarks: [],
    },
    tableOwners: {
      isLoading: true,
      owners: {},
    },
    tableTags: {
      isLoading: true,
      tags: [],
    },
  },
  allTags: {
    allTags: [],
    isLoading: false,
  },
  user:  {
    loggedInUser: {
      display_name: 'firstname lastname',
      email: 'user@test.com',
      employee_type: 'fulltime',
      first_name: 'firstname',
      full_name: 'firstname lastname',
      github_username: 'githubName',
      is_active: true,
      last_name: 'lastname',
      manager_fullname: 'Test Manager',
      profile_url: 'www.test.com',
      role_name: 'Tester',
      slack_id: 'www.slack.com',
      team_name: 'QA',
      user_id: 'test0',
    },
    profileUser: {
      display_name: 'firstname lastname',
      email: 'target@test.com',
      employee_type: 'fulltime',
      first_name: 'firstname',
      full_name: 'firstname lastname',
      github_username: 'githubName',
      is_active: true,
      last_name: 'lastname',
      manager_fullname: 'Test Manager',
      profile_url: 'www.test.com',
      role_name: 'Tester',
      slack_id: 'www.slack.com',
      team_name: 'QA',
      user_id: 'test0',
    },
  },
};

export default globalState;
