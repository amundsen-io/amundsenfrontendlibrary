import Analytics, { AnalyticsInstance } from 'analytics';

import { AnalyticsConfig } from 'config/config-types';
import * as ConfigUtils from 'config/config-utils';

let _analytics_instance;

export const analyticsInstance = async (): Promise<AnalyticsInstance> => {
  if (_analytics_instance) {
    return _analytics_instance;
  }

  async function loadAnalyticsPlugin(config: AnalyticsConfig): Promise<any> {
    // Webpack dynamic imports only seem to work with local imports, not
    // modules, so import('@analytics/${config.vendor}'`) won't work. So do a
    // switch with all known plugins, which seems to make the static analyzer happy.
    // This must be updated when upstream adds new plugins.
    let analyticsPluginModule;
    switch (config.vendor) {
      case 'crazy-egg':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/crazy-egg');
        break;
      case 'customerio':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/customerio');
        break;
      case 'fullstory':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/fullstory');
        break;
      case 'google-analytics':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/google-analytics');
        break;
      case 'google-tag-manager':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/google-tag-manager');
        break;
      case 'gosquared':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/gosquared');
        break;
      case 'hubspot':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/hubspot');
        break;
      case 'mixpanel':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/mixpanel');
        break;
      case 'ownstats':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/ownstats');
        break;
      case 'perfumejs':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/perfumejs');
        break;
      case 'segment':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/segment');
        break;
      case 'simple-analytics':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/simple-analytics');
        break;
      case 'snowplow':
        // @ts-ignore
        analyticsPluginModule = import('@analytics/snowplow');
        break;

      default:
        throw new Error(`Unknown analytics vendor '${config.vendor}'`);
    }
    const analyticsPluginFunction = (await analyticsPluginModule).default;
    console.log("imported", analyticsPluginFunction);
    return analyticsPluginFunction(config.options);
  }

  console.log("analytics config", ConfigUtils.getAnalyticsConfig())

  const plugins = await Promise.all(ConfigUtils.getAnalyticsConfig().map(loadAnalyticsPlugin));

  _analytics_instance = Analytics({
    app: 'amundsen',
    version: '100',
    plugins: plugins
  });

  return _analytics_instance;
};

export const trackEvent = async (eventName: string, payload: Map<string, any>) => {
  const analytics = await analyticsInstance();
  analytics.track(eventName, payload);
  console.log(`Tracking [${eventName}]:`, payload);
};
