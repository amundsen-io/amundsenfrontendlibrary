import * as React from 'react';

import { shallow } from 'enzyme';

import AppConfig from 'config/config';
import globalState from 'fixtures/globalState';
import { 
  ComponentProps,
  ReportTableIssue, 
  ReportTableIssueProps, 
  mapDispatchToProps,
  mapStateToProps, 
} from '..';

const mockFormData = { 
  'key': 'val1', 
  'title': 'title', 
  'description': 'description', 
  'resource_name': 'resource name', 
  'resource_path': 'path', 
  'owners': 'test@test.com', 
  get: function(key: string) {
    return mockFormData[key]; 
  }
 };

  
// @ts-ignore: How to mock FormData without TypeScript error?

global.FormData = () => (mockFormData);

describe('ReportTableIssue', () => {
  const setStateSpy = jest.spyOn(ReportTableIssue.prototype, 'setState');
  const setup = (propOverrides?: Partial<ReportTableIssueProps>) => {
    const props: ReportTableIssueProps = {
      isLoading: false,
      createIssue: jest.fn(), 
      tableKey: 'key', 
      tableName: 'name',
      tableOwners: ['owner@email'], 
      tableMetadata: null,
      ...propOverrides
    };
    const wrapper = shallow<ReportTableIssue>(<ReportTableIssue {...props} />);
    return { props, wrapper };
  }

  describe('render', () => {
    beforeAll(() => {
      AppConfig.issueTracking.enabled = true;
    }); 

    it('renders nothing if issueTracking not enabled', () => {
      AppConfig.issueTracking.enabled = false;
      const { props, wrapper } = setup({ isLoading: false });
      expect(wrapper.html()).toBeFalsy(); 
    }); 

    it('Renders loading spinner if not ready', () => {
      const { props, wrapper } = setup();
      expect(wrapper.find('.loading-spinner')).toBeTruthy();
    }); 

    it('Renders modal if open', () => {
      const { props, wrapper } = setup({isLoading: false});
      wrapper.setState({isOpen: true}); 
      expect(wrapper.find('.report-table-issue-modal')).toBeTruthy();
    });

    describe('toggle', () => {
      it('calls setState with negation of state.isOpen', () => {
        setStateSpy.mockClear();
        const { props, wrapper } = setup();
        const previsOpenState = wrapper.state().isOpen;
        wrapper.instance().toggle();
        expect(setStateSpy).toHaveBeenCalledWith({ isOpen: !previsOpenState });
      });
    });
    
    describe('submitForm', () => {
      it ('calls createIssue with mocked form data', () => {
        const { props, wrapper } = setup();
        // @ts-ignore: mocked events throw type errors
        wrapper.instance().submitForm({ preventDefault: jest.fn(), 
        currentTarget: {id: 'id', nodeName: 'button'} });
        expect(props.createIssue).toHaveBeenCalledWith(
          "val1", 
          "title", 
          "description", 
          "resource name", 
          "path", 
          ["test@test.com"]);
        expect(wrapper.state().isOpen).toBe(false); 
      });

      it ('calls sets isOpen to false', () => {
        const { props, wrapper } = setup();
        // @ts-ignore: mocked events throw type errors
        wrapper.instance().submitForm({ preventDefault: jest.fn(), 
        currentTarget: {id: 'id', nodeName: 'button'} });
        expect(wrapper.state().isOpen).toBe(false); 
      });
    }); 

    describe('mapDispatchToProps', () => {
      let dispatch;
      let props;
    
      beforeAll(() => {
        dispatch = jest.fn(() => Promise.resolve());
        props = mapDispatchToProps(dispatch);
      });
    
      it('sets getIssues on the props', () => {
        expect(props.createIssue).toBeInstanceOf(Function);
      });
    });

    describe('mapStateToProps', () => {
      let result;
      beforeAll(() => {
        result = mapStateToProps(globalState);
      });
    
      it('sets isLoading on the props', () => {
        expect(result.isLoading).toEqual(globalState.issue.isLoading);
      });
    });  
  }); 
}); 
