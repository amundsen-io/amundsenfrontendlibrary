import * as LOG_API from "./log/api/v0";
import { Tag } from 'interfaces';

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

export function logClick(event: React.MouseEvent<HTMLElement>, declaredProps?: LOG_API.ActionLogParams) {
  const target = event.currentTarget;
  const inferredProps: LOG_API.ActionLogParams = {
    command: "click",
    target_id: target.id,
    label: target.innerText || target.textContent,
  };

  if (target.nodeValue !== null) {
    inferredProps.value = target.nodeValue
  }

  let nodeName = target.nodeName.toLowerCase();
  if (nodeName === 'a') {
    if (target.classList.contains('btn')) {
      nodeName = 'button';
    } else {
      nodeName = 'link';
    }
  }
  inferredProps.target_type = nodeName;

  logAction({ ...inferredProps, ...declaredProps });
}

export function logSearchAction(declaredProps: LOG_API.SearchActionParams) {
  logAction(declaredProps);
};

export function logPaginationAction(declaredProps: LOG_API.PaginationActionParams) {
  logAction(declaredProps);
};

export function logFilterAction(declaredProps: LOG_API.FilterActionParams) {
  logAction(declaredProps);
};

export function logAction(declaredProps: LOG_API.ActionLogParams) {
  const inferredProps = {
    location: window.location.pathname
  };
  LOG_API.postActionLog({ ...inferredProps, ...declaredProps });
}
