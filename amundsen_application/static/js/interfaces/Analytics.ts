export interface AnalyticsEvent {
  name: string;
  properties: { [prop: string]: unknown };
}
