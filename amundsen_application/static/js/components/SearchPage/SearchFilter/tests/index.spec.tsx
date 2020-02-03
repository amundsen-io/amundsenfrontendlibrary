import * as React from 'react';
import { shallow } from 'enzyme';

import * as ConfigUtils from 'config/config-utils';
import { FilterConfig } from 'config/config-types';

import { FilterType, ResourceType } from 'interfaces';

import globalState from 'fixtures/globalState';
import { GlobalState } from 'ducks/rootReducer';

import { mapStateToProps, SearchFilter, SearchFilterProps} from '../';

describe('SearchFilter', () => {
  const setup = (propOverrides?: Partial<SearchFilterProps>) => {
    const props = {
      checkBoxSections: [
        {
          title: 'Type',
          categoryId: 'datasets',
          properties: [
            {
              value: 'bigquery',
              labelText: 'BigQuery',
              checked: true,
            },
            {
              value: 'hive',
              labelText: 'Hive',
              checked: true,
            }
          ]
        }
      ],
      inputSections: [
        {
          categoryId: 'column',
          title: 'Column',
          value: 'test'
        },
        {
          categoryId: 'schema',
          title: 'Schema',
          value: 'test'
        },
        {
          categoryId: 'tablr',
          title: 'Table',
          value: 'test'
        },
        {
          categoryId: 'tag',
          title: 'Tag',
          value: 'test'
        }
      ],
      onCheckboxChange: jest.fn(),
      onClearFilter: jest.fn(),
      ...propOverrides
    };
    const wrapper = shallow<SearchFilter>(<SearchFilter {...props} />);
    return { props, wrapper };
  };

  describe('createCheckBoxSection', () => {
    let props;
    let wrapper;
    let content;
    let mockCheckedSectionData;
    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
      mockCheckedSectionData = props.checkBoxSections[0];
      content = wrapper.instance().createCheckBoxSection('sectionKey', mockCheckedSectionData);
    });

    describe('renders a FilterSection', () => {
      it('FilterSection exists', () => {
        expect(content.type.displayName).toBe('Connect(FilterSection)');
      });

      it('with correct categoryId', () => {
        expect(content.props.categoryId).toBe(mockCheckedSectionData.categoryId);
      });

      it('with correct helpText', () => {
        expect(content.props.helpText).toBe(mockCheckedSectionData.helpText);
      });

      it('with correct title', () => {
        expect(content.props.title).toBe(mockCheckedSectionData.title);
      });

      it('with hasValue as true if at least one section is checked', () => {
        expect(content.props.hasValue).toBe(true);
      });

      it('with hasValue as false if no section is checked', () => {
        const mockUncheckedSectionData = {
          title: 'Type',
          categoryId: 'datasets',
          properties: [
            {
              value: 'bigquery',
              labelText: 'BigQuery',
              checked: false,
            }
          ]
        };
        const content = wrapper.instance().createCheckBoxSection('sectionKey', mockUncheckedSectionData);
        expect(content.props.hasValue).toBe(false);
      });

      it('renders FilterSection with CheckBoxFilter child with correct props', () => {
        const child = content.props.children;
        expect(child.type.displayName).toBe('Connect(CheckBoxFilter)');
        expect(child.props.categoryId).toEqual(mockCheckedSectionData.categoryId)
        expect(child.props.checkboxProperties).toEqual(mockCheckedSectionData.properties)
      });
    });
  });

  describe('createInputSection', () => {
    let props;
    let wrapper;
    let content;
    let mockInputDataWithValue;
    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
      mockInputDataWithValue = props.inputSections[0];
      content = wrapper.instance().createInputSection('sectionKey', mockInputDataWithValue);
    });

    describe('renders a FilterSection', () => {
      it('FilterSection exists', () => {
        expect(content.type.displayName).toBe('Connect(FilterSection)');
      });

      it('with correct categoryId', () => {
        expect(content.props.categoryId).toBe(mockInputDataWithValue.categoryId);
      });

      it('with correct helpText', () => {
        expect(content.props.helpText).toBe(mockInputDataWithValue.helpText);
      });

      it('with correct title', () => {
        expect(content.props.title).toBe(mockInputDataWithValue.title);
      });

      it('with hasValue as true if section object has value key with non-zero string', () => {
        expect(content.props.hasValue).toBe(true);
      });

      it('with hasValue as false if section object has no non-zero length value string ', () => {
        const mockInputDataNoValue = {
          categoryId: 'column',
          title: 'Column',
          value: ''
        }
        const content = wrapper.instance().createInputSection('sectionKey', mockInputDataNoValue);
        expect(content.props.hasValue).toBe(false);
      });

      it('renders FilterSection with InputFilter child with correct props', () => {
        const child = content.props.children;
        expect(child.type.displayName).toBe('Connect(InputFilter)');
        expect(child.props.categoryId).toEqual(mockInputDataWithValue.categoryId)
        expect(child.props.value).toEqual(mockInputDataWithValue.value)
      });
    });
  });

  describe('renderCheckBoxFilters', () => {
    let props;
    let wrapper;
    let createCheckBoxSectionSpy;

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
      createCheckBoxSectionSpy = jest.spyOn(wrapper.instance(), 'createCheckBoxSection');
      wrapper.instance().renderCheckBoxFilters();
    });

    it('calls createCheckBoxSection with correct key and section for each props.inputSections', () => {
      props.checkBoxSections.forEach((section) => {
        expect(createCheckBoxSectionSpy).toHaveBeenCalledWith(`section:${section.categoryId}`, section);
      })
    });
  });

  describe('renderInputFilters', () => {
    let props;
    let wrapper;
    let createInputSectionSpy;

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
      createInputSectionSpy = jest.spyOn(wrapper.instance(), 'createInputSection');
      wrapper.instance().renderInputFilters();
    });

    it('calls createInputSection with correct key and section for each props.inputSections', () => {
      props.inputSections.forEach((section) => {
        expect(createInputSectionSpy).toHaveBeenCalledWith(`section:${section.categoryId}`, section);
      })
    });
  });

  describe('render', () => {
    let props;
    let wrapper;
    let renderCheckBoxFiltersSpy;
    let renderInputFiltersSpy;

    beforeAll(() => {
      const setupResult = setup();
      props = setupResult.props;
      wrapper = setupResult.wrapper;
      renderCheckBoxFiltersSpy = jest.spyOn(wrapper.instance(), 'renderCheckBoxFilters');
      renderInputFiltersSpy = jest.spyOn(wrapper.instance(), 'renderInputFilters');
      wrapper.instance().render();
    });

    it('calls renderCheckBoxFilters', () => {
      expect(renderCheckBoxFiltersSpy).toHaveBeenCalledTimes(1);
    });

    it('calls renderInputFilters', () => {
      expect(renderInputFiltersSpy).toHaveBeenCalledTimes(1);
    });
  });
});

describe('mapStateToProps', () => {
  const mockHelpText = 'Help me';

  const mockSchemaId = 'schema';
  const mockSchemaValue = 'schema_name';
  const mockSchemaTitle = 'Schema';

  const mockDbId = 'database';
  const mockDbTitle = 'Source';

  const MOCK_CATEGORY_CONFIG: FilterConfig = [
    {
      value: mockDbId,
      displayName: mockDbTitle,
      type: FilterType.MULTI_SELECT_VALUE,
      helpText: mockHelpText,
      options: [
        { value: 'bigquery', displayName: 'BigQuery' },
        { value: 'hive', displayName: 'Hive' },
      ],
    },
    {
      value: mockSchemaId,
      displayName: mockSchemaTitle,
      helpText: mockHelpText,
      type: FilterType.SINGLE_VALUE,
    },
  ];
  const mockStateWithFilters: GlobalState = {
    ...globalState,
    search: {
      ...globalState.search,
      selectedTab: ResourceType.table,
      filters: {
        [ResourceType.table]: {
          [mockSchemaId]: mockSchemaValue,
          [mockDbId]: {
            'hive': true
          }
        }
      }
    },
  };
  const getFilterConfigByResourceSpy = jest.spyOn(ConfigUtils, 'getFilterConfigByResource').mockReturnValue(MOCK_CATEGORY_CONFIG)

  let result;
  beforeEach(() => {
    result = mapStateToProps(mockStateWithFilters);
  });

  it('calls getFilterConfigByResource with selectedTab', () => {
    expect(getFilterConfigByResourceSpy).toHaveBeenCalledWith(mockStateWithFilters.search.selectedTab);
  });

  it('sets expected checkboxSections on the result', () => {
    expect(result.checkBoxSections).toEqual([
      {
        categoryId: mockDbId,
        helpText: mockHelpText,
        properties: [
          {
            checked: false,
            labelText: 'BigQuery',
            value: 'bigquery'
          },
          {
            checked: true,
            labelText: 'Hive',
            value: 'hive'
          }
        ],
        title: mockDbTitle
      }
    ])
  });

  it('sets expected inputSections on the result', () => {
    expect(result.inputSections).toEqual([
      {
        categoryId: mockSchemaId,
        helpText: mockHelpText,
        title: mockSchemaTitle,
        value: mockSchemaValue,
      }
    ])
  });
});
