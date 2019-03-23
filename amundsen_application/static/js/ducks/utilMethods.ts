import { Tag } from '../components/Tags/types';
import { logAction } from "./log/api/v0";

export function sortTagsAlphabetical(a: Tag, b: Tag): number {
  return a.tag_name.localeCompare(b.tag_name);
}

export function extractFromObj(initialObj: object, desiredKeys: string[]): object {
  return Object.keys(initialObj)
  .filter((key) => {
    return desiredKeys.indexOf(key) > -1;
  })
  .reduce((obj, key) => {
    obj[key] = initialObj[key];
    return obj;
  }, {});
}

export function filterFromObj(initialObj: object, rejectedKeys: string[]): object {
  return Object.keys(initialObj)
  .filter((key) => {
    return rejectedKeys.indexOf(key) === -1;
  })
  .reduce((obj, key) => {
    obj[key] = initialObj[key];
    return obj;
  }, {});
}


export function log(command: string, target_id: string, target_type: string, label?: string, location?: string, index?: number) {
  const params = { command, target_id, target_type, label, location, index };
  ['target_type', 'label', 'location', 'index'].forEach((propName) => {
    if (params[propName] == null || params[propName] === '') {
      delete params[propName];
    }
  });
  logAction(params);
}
