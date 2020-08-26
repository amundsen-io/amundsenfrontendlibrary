import * as Parser from './parser';

describe('getTruncatedText', () => {
  it('returns correct text', () => {
    const nestedType: Parser.NestedType = {
      head: 'hello<',
      children: ['how are you'],
      tail: '>',
    };
    const expected = 'hello<...>';

    expect(Parser.getTruncatedText(nestedType)).toEqual(expected);
  });

  it('returns correct text with delimeters removed', () => {
    const nestedType: Parser.NestedType = {
      head: 'hello<',
      children: ['how are you'],
      tail: '>,',
    };
    const expected = 'hello<...>';

    expect(Parser.getTruncatedText(nestedType)).toEqual(expected);
  });
});

describe('isNestedType', () => {
  it('returns true for supported complex types', () => {
    expect(Parser.isNestedType('struct<hello, goodbye>', 'hive')).toEqual(true);
  });

  it('returns false for unsupported complex types', () => {
    expect(Parser.isNestedType('xyz<hello, goodbye>', 'hive')).toEqual(false);
  });

  it('returns false for unsupported databases', () => {
    expect(Parser.isNestedType('struct<hello, goodbye>', 'xyz')).toEqual(false);
  });

  it('returns falsde for non-complex types', () => {
    expect(Parser.isNestedType('string', 'hive')).toEqual(false);
  });
});

describe('parseNestedType', () => {
  it('returns null if not a complex type', () => {
    expect(Parser.parseNestedType('test', 'hive')).toEqual(null);
  });

  it('returns expected NestedType', () => {
    const spy = jest
      .spyOn(Parser, 'isNestedType')
      .mockImplementation(() => true);

    const columnType = 'struct<how are you, goodbye>';
    const expected: Parser.NestedType = {
      head: 'struct<',
      children: ['how are you,', 'goodbye'],
      tail: '>',
    };
    expect(Parser.parseNestedType(columnType, 'hive')).toEqual(expected);

    spy.mockRestore();
  });
});
