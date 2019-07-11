// TODO: Remove notification types that can be triggered in flask layer if necessary
export enum NotificationType {
  ADDED = 'amundsen/notification/OWNER_ADDED',
  REMOVED = 'amundsen/notification/OWNER_REMOVED',
  EDITED = 'amundsen/notification/RESOURCE_EDITED',
  REQUESTED = 'amundsen/notification/OWNER_REQUESTED',
};

export interface SendNotificationOptions {
  resource_name: string,
  resource_url: string,
  description_requested: boolean,
  fields_requested: boolean,
  comment?: string,
};
