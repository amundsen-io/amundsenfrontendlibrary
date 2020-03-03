export enum UpdateMethod {
  PUT = 'PUT',
  DELETE = 'DELETE',
};

export enum FilterType {
  CHECKBOX_SELECT = 'checkboxFilter',
  INPUT_SELECT = 'inputFilter'
}

export enum SearchType {
  CLEAR_TERM = 'clearSearchTerm',
  FILTER = 'updateFilter',
  INLINE_SEARCH = 'inlineSearch',
  INLINE_SELECT = 'inlineSelect',
  LOAD_URL = 'loadUrl',
  PAGINATION = 'updatePage',
  SUBMIT_TERM = 'submitSearchTerm',
}
