import { AppConfig } from "./config.types";

const configDefault: AppConfig = {
  browse: {
    curatedTags: [],
    showAllTags: true,
  },
  exploreSql: {
    enabled: false,
    generateUrl: (database: string, cluster: string, schema: string, table: string, partitionKey?: string, partitionValue?: string) => {
      return `https://DEFAULT_EXPLORE_URL?schema=${schema}&cluster=${cluster}&db=${database}&table=${table}`;
    }
  },
  google: {
    key: 'default-key',
    sampleRate: 100,
  },
  lineage: {
    enabled: false,
    generateUrl: (database: string, cluster: string, schema: string, table: string) => {
      return `https://DEFAULT_LINEAGE_URL?schema=${schema}&cluster=${cluster}&db=${database}&table=${table}`;
    },
    iconPath: 'PATH_TO_ICON'
  },
  navLinks: [
    {
      label: "Announcements",
      href: "/announcements",
      use_router: true,
    },
    {
      label: "Browse",
      href: "/browse",
      use_router: true,
    }
  ]
};

export default configDefault;
