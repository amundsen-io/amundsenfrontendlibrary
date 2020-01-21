import { AppConfig } from './config-types';

import { FilterType, ResourceType } from '../interfaces';

const configDefault: AppConfig = {
  badges: {},
  browse: {
    curatedTags: [],
    showAllTags: true,
  },
  editableText: {
    tableDescLength: 750,
    columnDescLength: 250,
  },
  google: {
    enabled: false,
    key: 'default-key',
    sampleRate: 100,
  },
  indexUsers: {
    enabled: false,
  },
  logoPath: null,
  mailClientFeatures: {
    feedbackEnabled: false,
    notificationsEnabled: false,
  },
  navLinks: [
    {
      label: "Announcements",
      id: "nav::announcements",
      href: "/announcements",
      use_router: true,
    },
    {
      label: "Browse",
      id: "nav::browse",
      href: "/browse",
      use_router: true,
    }
  ],
  // TODO (ttannis): Replace constants defined in some components with displayName
  resourceConfig: {
    [ResourceType.table]: {
      displayName: 'Datasets',
      supportedDatabases: {
        'bigquery': {
          displayName: 'BigQuery',
          iconClass: 'icon-bigquery',
        },
        'hive': {
          displayName: 'Hive',
          iconClass: 'icon-hive',
        },
        'presto': {
          displayName: 'Presto',
          iconClass: 'icon-presto',
        },
        'postgres': {
          displayName: 'Postgres',
          iconClass: 'icon-postgres',
        },
        'redshift': {
          displayName: 'Redshift',
          iconClass: 'icon-redshift',
        },
      },
      filterCategories: [
        {
          value: 'database',
          displayName: 'Source',
          type: FilterType.MULTI_SELECT_VALUE,
          options: [
            { value: 'bigquery', displayName: 'BigQuery' },
            { value: 'hive', displayName: 'Hive' },
            { value: 'postgres', displayName: 'Postgres' },
            { value: 'presto', displayName: 'Presto' },
            { value: 'redshift', displayName: 'Redshift' },
          ],
        },
        {
          value: 'column',
          displayName: 'Column',
          type: FilterType.SINGLE_VALUE,
        },
        {
          value: 'schema',
          displayName: 'Schema',
          type: FilterType.SINGLE_VALUE,
        },
        {
          value: 'table',
          displayName: 'Table',
          type: FilterType.SINGLE_VALUE,
        },
        {
          value: 'tag',
          displayName: 'Tag',
          type: FilterType.SINGLE_VALUE,
        },
      ]
    },
    [ResourceType.user]: {
      displayName: 'People'
    },
  },
  tableLineage: {
    iconPath: 'PATH_TO_ICON',
    isBeta: false,
    isEnabled: false,
    urlGenerator: (database: string, cluster: string, schema: string, table: string) => {
      return `https://DEFAULT_LINEAGE_URL?schema=${schema}&cluster=${cluster}&db=${database}&table=${table}`;
    },
  },
  tableProfile: {
    isBeta: false,
    isExploreEnabled: false,
    exploreUrlGenerator: (database: string, cluster: string, schema: string, table: string, partitionKey?: string, partitionValue?: string) => {
      return `https://DEFAULT_EXPLORE_URL?schema=${schema}&cluster=${cluster}&db=${database}&table=${table}`;
    }
  },
};

export default configDefault;
