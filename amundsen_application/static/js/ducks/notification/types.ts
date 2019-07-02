export enum NotificationType {
  ADDED = 'amundsen/notification/OWNER_ADDED',
  REMOVED = 'amundsen/notification/OWNER_REMOVED',
  EDITED = 'amundsen/notification/TABLE_EDITED',
  REQUESTED = 'amundsen/notification/OWNER_REQUESTED',
};

export interface SendNotificationOptions {
  table_name: string,
  table_url: string,
  table_requested: boolean,
  columns_requested: boolean,
  message?: string,
};
