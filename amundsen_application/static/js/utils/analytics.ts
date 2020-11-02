import Analytics, { AnalyticsInstance } from 'analytics';

import * as ConfigUtils from 'config/config-utils';

let sharedAnalyticsInstance;

export const analyticsInstance = (): AnalyticsInstance => {
  if (sharedAnalyticsInstance) {
    return sharedAnalyticsInstance;
  }

  const { plugins } = ConfigUtils.getAnalyticsConfig();

  sharedAnalyticsInstance = Analytics({
    app: 'amundsen',
    version: '100',
    plugins,
  });

  return sharedAnalyticsInstance;
};

export const trackEvent = (eventName: string, payload: Map<string, any>) => {
  const analytics = analyticsInstance();
  analytics.track(eventName, payload);
  console.log(`Tracking [${eventName}]:`, payload);
};
