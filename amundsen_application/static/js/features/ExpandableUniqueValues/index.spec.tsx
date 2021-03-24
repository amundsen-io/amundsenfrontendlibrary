// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { mount } from 'enzyme';

import ExpandableUniqueValues, {
  ExpandableUniqueValuesProps,
  NUMBER_OF_VALUES_SUMMARY,
} from '.';
import TestDataBuilder from './testDataBuilder';

const dataBuilder = new TestDataBuilder();

const setup = (propOverrides?: Partial<ExpandableUniqueValuesProps>) => {
  const props = {
    uniqueValues: [],
    ...propOverrides,
  };
  const wrapper = mount<typeof ExpandableUniqueValues>(
    <ExpandableUniqueValues {...props} />
  );

  return { props, wrapper };
};

describe('ExpandableUniqueValues', () => {
  describe('render', () => {
    describe('when stats are empty', () => {
      const { uniqueValues } = dataBuilder.withEmptyUniqueValues().build();

      it('does not render the component', () => {
        const { wrapper } = setup({ uniqueValues });
        const expected = uniqueValues.length;
        const actual = wrapper.find('.unique-values').length;

        expect(actual).toEqual(expected);
      });
    });

    describe('when one unique value is passed', () => {
      const { uniqueValues } = dataBuilder.withOneUniqueValue().build();

      it('renders the component', () => {
        const { wrapper } = setup({ uniqueValues });
        const expected = 1;
        const actual = wrapper.find('.unique-values').length;

        expect(actual).toEqual(expected);
      });

      it('renders uique value title', () => {
        const { wrapper } = setup({ uniqueValues });
        const expected = 1;
        const actual = wrapper.find('.unique-values-title').length;

        expect(actual).toEqual(expected);
      });

      it('renders uique values list', () => {
        const { wrapper } = setup({ uniqueValues });
        const expected = 1;
        const actual = wrapper.find('.unique-values-list').length;

        expect(actual).toEqual(expected);
      });

      it('renders one unique value', () => {
        const { wrapper } = setup({ uniqueValues });
        const expected = uniqueValues.length;
        const actual = wrapper.find('.unique-value-item').length;

        expect(actual).toEqual(expected);
      });
    });

    describe(`when the unique values are less than the limit of ${NUMBER_OF_VALUES_SUMMARY}`, () => {
      const { uniqueValues } = dataBuilder
        .withVariableNumberOfUniqueValues(NUMBER_OF_VALUES_SUMMARY - 1)
        .build();

      it(`renders ${
        NUMBER_OF_VALUES_SUMMARY - 1
      } unique values in the summary`, () => {
        const { wrapper } = setup({ uniqueValues });
        const expected = NUMBER_OF_VALUES_SUMMARY - 1;
        const actual = wrapper.find('.unique-value-item').length;

        expect(actual).toEqual(expected);
      });
    });

    describe(`when the unique values are over the limit of ${NUMBER_OF_VALUES_SUMMARY}`, () => {
      const { uniqueValues } = dataBuilder
        .withVariableNumberOfUniqueValues(NUMBER_OF_VALUES_SUMMARY + 1)
        .build();

      it(`renders ${NUMBER_OF_VALUES_SUMMARY} unique values in the summary`, () => {
        const { wrapper } = setup({ uniqueValues });
        const expected = NUMBER_OF_VALUES_SUMMARY;
        const actual = wrapper.find('.unique-value-item').length;

        expect(actual).toEqual(expected);
      });
    });
  });
});
