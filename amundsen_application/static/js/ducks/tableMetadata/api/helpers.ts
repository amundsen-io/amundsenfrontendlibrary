/** TODO: We will introduce better typing for function parameters return types */

const sortTagsAlphabetical = (a, b) => a.tag_name.localeCompare(b.tag_name);

/**
 * Generates the query string parameters needed for requests that act on a particular table resource.
 */
export function getTableParams(tableDataObject) {
  const { cluster, database, schema, table_name } = tableDataObject;
  return `db=${database}&cluster=${cluster}&schema=${schema}&table=${table_name}`;
}

/**
 * Parses the response for table metadata to create a TableMetadata object
 */
export function getTableDataFromResponseData(responseData) {
  return Object.keys(responseData)
  .filter((key) => {
    return key != 'owners' && key !== 'tags';
  })
  .reduce((obj, key) => {
    obj[key] = responseData[key];
    return obj;
  }, {});
}

/**
 * Parses the response for table metadata to return the array of table owners
 */
export function getTableOwnersFromResponseData(responseData) {
  return responseData.owners;
}

/**
 * Parses the response for table metadata to return an array of sorted table tags
 */
export function getTableTagsFromResponseData(responseData) {
  return responseData.tags.sort(sortTagsAlphabetical);
}
