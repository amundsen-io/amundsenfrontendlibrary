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

/*
 * Iterates through the columnType string and recursively creates a NestedType
 */
function parseNestedTypeHelper(
  columnType: string,
  startIndex: number = 0,
  currentIndex: number = 0
): { nextStartIndex: number, results: ParsedType[] } {
  const children: ParsedType[] = [];

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
        nextStartIndex: currentIndex + 1,
        results: children,
      };
    } else if (currentChar in OPEN_DELIMETERS) {
      /* Case 3: Beginning of a nested item */
      const parsedResults = parseNestedTypeHelper(
        columnType,
        currentIndex + 1,
        currentIndex + 1
      );
      let isLast: boolean = true;
      let nextStartIndex: number = parsedResults.nextStartIndex;

      if (columnType.charAt(nextStartIndex) === SEPARATOR_DELIMETER) {
        isLast = false;
        nextStartIndex++;
      };

      children.push({
        head: columnType.substring(startIndex, currentIndex + 1),
        tail: `${OPEN_DELIMETERS[currentChar]}${isLast ? '' : SEPARATOR_DELIMETER}`,
        children: parsedResults.results,
      });

      startIndex = nextStartIndex;
      currentIndex = startIndex;
    } else {
      currentIndex++;
    }
  }

  return {
    nextStartIndex: currentIndex + 1,
    results: children,
  };
};

/*
 * Returns whether or not a columnType string represents a complexc type for the given database
 */
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

/**
 * Returns a NestedType object for supported complex types, else returns null
 */
export function parseNestedType(columnType: string, databaseId: string): NestedType | null {
  if (isNestedType(columnType, databaseId)) {
    return parseNestedTypeHelper(columnType).results[0] as NestedType;
  }
  return null;
};

/*
 * Returns the truncated string representation for a NestedType
 */
export function getTruncatedText(nestedType: NestedType): string {
  const { head, tail } = nestedType;
  return `${head}...${tail.replace(SEPARATOR_DELIMETER, '')}`;
};
