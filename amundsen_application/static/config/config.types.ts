/**
 * AppConfig and AppConfigCustom should share the same definition, except each field in AppConfigCustom
 * is optional. If you choose to override one of the configs, you must provide the full type definition
 * for that section.
 */

export interface AppConfig {
  browse: BrowseConfig;
  exploreSql: ExploreSqlConfig;
  google: GoogleAnalyticsConfig;
  lineage: LineageConfig;
  navLinks: Array<LinkConfig>;
}

export interface AppConfigCustom {
  browse?: BrowseConfig;
  exploreSql?: ExploreSqlConfig;
  google?: GoogleAnalyticsConfig
  lineage?: LineageConfig;
  navLinks?: Array<LinkConfig>;
}

interface GoogleAnalyticsConfig {
  key: string;
  sampleRate: number;
}

interface BrowseConfig {
  curatedTags: Array<string>;
  showAllTags: boolean;
}

interface ExploreSqlConfig {
  enabled: boolean;
  generateUrl: (database: string, cluster: string, schema: string, table: string, partitionKey?: string, partitionValue?: string) => string;
}

interface LineageConfig {
  enabled: boolean;
  generateUrl: (database: string, cluster: string, schema: string , table: string) => string;
  iconPath: string;
}

interface LinkConfig {
  href: string;
  label: string;
  target?: string;
  use_router: boolean;
}
