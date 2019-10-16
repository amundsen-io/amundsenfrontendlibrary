import AppConfig from 'config/config';

<<<<<<< HEAD
export const DEFAULT_DATABASE_ICON_CLASS = 'icon-database icon-color';

/**
 * Returns the database display name for a given database id.
 * If a configuration or display name does not exist for the give id, the id
 * is returned.
 */
export function getDatabaseDisplayName(databaseId: string): string {
  const databaseConfig = AppConfig.resourceConfig.datasets[databaseId];
  if (!databaseConfig || !databaseConfig.displayName) {
    return databaseId;
  }

  return databaseConfig.displayName;
}

/**
 * Returns an icon class for a given database id, which should be a value
 * defined in `static/css/_icons.scss`.
 * If a configuration or icon class does not exist for the give id, the default
 * database icon class is returned.
 */
export function getDatabaseIconClass(databaseId: string): string {
  const databaseConfig = AppConfig.resourceConfig.datasets[databaseId];
  if (!databaseConfig || !databaseConfig.iconClass) {
    return DEFAULT_DATABASE_ICON_CLASS;
  }

  return databaseConfig.iconClass;
=======
export function feedbackEnabled(): boolean {
  return AppConfig.mailClientFeatures.feedbackEnabled;
}

export function notificationsEnabled(): boolean {
  return AppConfig.mailClientFeatures.notificationsEnabled;
>>>>>>> origin
}
