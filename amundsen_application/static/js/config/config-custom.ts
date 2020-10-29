// This file should be used to add new config variables or overwrite defaults from config-default.ts

import { AppConfigCustom } from './config-types';

import segment from '@analytics/segment';

const configCustom: AppConfigCustom = {
  browse: {
    curatedTags: [],
    showAllTags: true,
  },
  analytics: {
    plugins: [
      segment({
        writeKey: 'MhibS57o1RGYs3ncYfeALSTbawRs1F25',
      })
    ]
  },
  mailClientFeatures: {
    feedbackEnabled: false,
    notificationsEnabled: false,
  },
  indexDashboards: {
    enabled: false,
  },
  indexUsers: {
    enabled: false,
  },
  userIdLabel: 'email address',
  issueTracking: {
    enabled: false,
  },
};

export default configCustom;
