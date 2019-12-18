import AppConfig from 'config/config';
import * as ConfigUtils from 'config/config-utils';

describe('getDatabaseDisplayName', () => {
  it('returns given id if no config for that id exists', () => {
    const testId = 'fakeName';
    expect(ConfigUtils.getDatabaseDisplayName(testId)).toBe(testId);
  });

  it('returns given id for a configured database id', () => {
    const testId = 'hive';
    const expectedName = AppConfig.resourceConfig.datasets[testId].displayName;
    expect(ConfigUtils.getDatabaseDisplayName(testId)).toBe(expectedName);
  })
});

describe('getDatabaseIconClass', () => {
  it('returns default class no config for that id exists', () => {
    const testId = 'fakeName';
    expect(ConfigUtils.getDatabaseIconClass(testId)).toBe(ConfigUtils.DEFAULT_DATABASE_ICON_CLASS);
  });

  it('returns given icon class for a configured database id', () => {
    const testId = 'hive';
    const expectedClass = AppConfig.resourceConfig.datasets[testId].iconClass;
    expect(ConfigUtils.getDatabaseIconClass(testId)).toBe(expectedClass);
  })
});

describe('feedbackEnabled', () => {
  it('returns whether or not the feaadback feature is enabled', () => {
    expect(ConfigUtils.feedbackEnabled()).toBe(AppConfig.mailClientFeatures.feedbackEnabled);
  });
});

describe('indexUsersEnabled', () => {
  it('returns whether or not the notifications feature is enabled', () => {
    expect(ConfigUtils.indexUsersEnabled()).toBe(AppConfig.indexUsers.enabled);
  });
});

describe('notificationsEnabled', () => {
  it('returns whether or not the notifications feature is enabled', () => {
    expect(ConfigUtils.notificationsEnabled()).toBe(AppConfig.mailClientFeatures.notificationsEnabled);
  });
});

describe('showAllTags', () => {
  it('returns whether or not to show all tags', () => {
    AppConfig.browse.showAllTags = true;
    expect(ConfigUtils.showAllTags()).toBe(AppConfig.browse.showAllTags);
    AppConfig.browse.showAllTags = false;
    expect(ConfigUtils.showAllTags()).toBe(AppConfig.browse.showAllTags);
  });
});

describe('getCuratedTags', () => {
  it('returns a list of curated tags', () => {
    AppConfig.browse.curatedTags = ['one', 'two', 'three'];
    expect(ConfigUtils.getCuratedTags()).toBe(AppConfig.browse.curatedTags);
  });
});
