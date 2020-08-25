// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

export type ParsedType = string | NestedType;

export interface NestedType {
  head: string;
  tail: string;
  children: ParsedType[];
}

const SUPPORTED_TYPES = {
  // https://cwiki.apache.org/confluence/display/Hive/LanguageManual+Types#LanguageManualTypes-ComplexTypes
  hive: ['array', 'map', 'struct', 'uniontype'],
  // https://prestosql.io/docs/current/language/types.html#structural
  presto: ['array', 'map', 'row']
};
const OPEN_DELIMETERS = {
  '(': ')',
  '<': '>',
  '[': ']',
};
const CLOSE_DELIMETERS = {
  ')': '(',
  '>': '<',
  ']': '[',
};
const SEPARATOR_DELIMETER = ',';

function parseNestedType(
  columnType: string,
  startIndex: number = 0,
  currentIndex: number = 0
) {
  const children = [];

  while (currentIndex < columnType.length) {
    const currentChar = columnType.charAt(currentIndex);

    if (currentChar === SEPARATOR_DELIMETER) {
      /* Case 1: End of non-nested item */
      children.push(columnType.substring(startIndex, currentIndex + 1));
      startIndex = currentIndex + 1;
      currentIndex = startIndex;
    } else if (currentChar in CLOSE_DELIMETERS) {
      /* Case 2: End of a nested item  */
      if (startIndex !== currentIndex) {
        children.push(columnType.substring(startIndex, currentIndex));
      }
      return {
        nextStartIndex:
          columnType.charAt(currentIndex + 1) === SEPARATOR_DELIMETER
            ? currentIndex + 2
            : currentIndex + 1,
        results: children,
      };
    } else if (currentChar in OPEN_DELIMETERS) {
      /* Case 3: Beginning of a nested item */
      const { nextStartIndex, results } = parseNestedType(
        columnType,
        currentIndex + 1,
        currentIndex + 1
      );
      const isNotLast = columnType.charAt(nextStartIndex) === SEPARATOR_DELIMETER;

      children.push({
        head: columnType.substring(startIndex, currentIndex + 1),
        tail: `${OPEN_DELIMETERS[currentChar]}${isNotLast ? SEPARATOR_DELIMETER : ''}`,
        children: results,
      });

      startIndex = nextStartIndex;
      currentIndex = startIndex;
    } else {
      currentIndex++;
    }
  }

  return {
    next: currentIndex + 1,
    results: children,
  };
};

function isNestedType(columnType: string, databaseId: string): boolean {
  const supportedTypes = SUPPORTED_TYPES[databaseId];
  let isNestedType = false;
  supportedTypes.forEach((supportedType) => {
    if(columnType.startsWith(supportedType) && columnType !== supportedType){
      isNestedType = true;
    }
  })
  return isNestedType;
};

export function parseComplexType(columnType: string, databaseId: string): string | NestedType {
  if (isNestedType(columnType, databaseId)) {
    return parseNestedType(columnType).results[0];
  }
  return columnType;
};

export function getTruncatedText(columnType: string, databaseId: string): string {
  const supportedTypes = SUPPORTED_TYPES[databaseId];
  let truncatedText = columnType;
  supportedTypes.forEach((supportedType) => {
    if(columnType.startsWith(supportedType) && columnType !== supportedType) {
      const open = columnType.charAt(supportedType.length);
      const close = OPEN_DELIMETERS[open];
      truncatedText = `${supportedType}${open}...${close}`;
    }
  });
  return truncatedText;
};
