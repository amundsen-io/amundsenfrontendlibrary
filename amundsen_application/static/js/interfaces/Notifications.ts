// TODO: Remove notification types that can be triggered in flask layer if necessary
export enum NotificationType {
  ADDED = 'added',
  REMOVED = 'removed',
  EDITED = 'edited',
  REQUESTED = 'requested',
}

export interface SendNotificationOptions {
  resource_name: string,
  resource_url: string,
  description_requested: boolean,
  fields_requested: boolean,
  comment?: string,
};
