import { ResourceType } from 'interfaces';

export const defaultFilters = {
  [ResourceType.table]: {
    column: {},
    database: {},
    schema: {},
    table: {},
    tag: {},
  }
};
