export enum SendingState {
  ERROR = "error",
  IDLE = "idle",
  WAITING = "waiting",
  COMPLETE = "complete"
};

export enum ResourceType {
  table = "table",
  user = "user",
  dashboard = "dashboard",
};

export enum UpdateMethod {
  PUT = 'PUT',
  DELETE = 'DELETE',
};
