import ua from 'universal-analytics';

import { getGoogleAnalyticsConfig } from 'config/config-utils';

const { key, enabled } = getGoogleAnalyticsConfig();

const visitor = enabled ? ua(key) : null;

export const trackGAEvent = ({ payload }, state) => {
  if (!enabled) {
    return;
  }
  const { category, action, label = null, value = null } = payload;

  visitor.event(category, action, label, value).send();

  // analytics tracking api logic goes here
  console.log(`Tracking category:`, category);
  console.log(`Tracking action:`, action);
  console.log(`Tracking label:`, label);
  console.log(`Tracking value:`, value);
};
