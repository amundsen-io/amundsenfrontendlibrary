import * as React from 'react';

import { shallow } from 'enzyme';

import globalState from 'fixtures/globalState';
import { 
  ComponentProps,
  ReportTableIssue, 
  ReportTableIssueProps, 
  mapDispatchToProps,
  mapStateToProps, 
} from '..';

describe('ReportTableIssue', () => {
  const setStateSpy = jest.spyOn(ReportTableIssue.prototype, 'setState');
  const setup = (propOverrides?: Partial<ReportTableIssueProps>) => {
    const props: ReportTableIssueProps = {
      isLoading: false,
      createJiraIssue: jest.fn(), 
      tableKey: 'key', 
      tableName: 'name',
      ...propOverrides
    };
    const wrapper = shallow<ReportTableIssue>(<ReportTableIssue {...props} />);
    return { props, wrapper };
  }

  describe('render', () => {
    it('Renders loading spinner if not ready', () => {
      const { props, wrapper } = setup();
      expect(wrapper.find('.loading-spinner')).toBeTruthy();
    }); 

    it('Renders modal if open', () => {
      const { props, wrapper } = setup({isLoading: false});
      wrapper.setState({isOpen: true}); 
      expect(wrapper.find('.report-table-issue-modal')).toBeTruthy();
    });
    
    describe('submitForm', () => {
      const clickEvent = {
        preventDefault: jest.fn(),
      };

      it ('stops propagation and prevents default', () => {
        const { props, wrapper } = setup();
        wrapper.instance().submitForm({clickEvent});
        expect(clickEvent.preventDefault).toHaveBeenCalled();
      });

      it('creates a jiraissue', () => {
        const { props, wrapper } = setup({
          isLoading: false,
        });

        wrapper.find('.submit').simulate('click', clickEvent);
        expect(props.createJiraIssue).toHaveBeenCalled();
      });

    }); 

    describe('mapDispatchToProps', () => {
      let dispatch;
      let props;
    
      beforeAll(() => {
        dispatch = jest.fn(() => Promise.resolve());
        props = mapDispatchToProps(dispatch);
      });
    
      it('sets getJiraIssues on the props', () => {
        expect(props.createJiraIssue).toBeInstanceOf(Function);
      });
    });

    describe('mapStateToProps', () => {
      let result;
      beforeAll(() => {
        let componentProps: ComponentProps = { 
          tableKey: 'key', 
          tableName: 'name'
        }; 
        result = mapStateToProps(globalState, componentProps);
      });
    
      it('sets isLoading on the props', () => {
        expect(result.isLoading).toEqual(globalState.jira.isLoading);
      });
    
      it('sets tableKey on the props', () => {
        expect(result.tableKey).toEqual('key');
      });

      it('sets tableName on the props', () => {
        expect(result.tableName).toEqual('name');
      });
    });  
  }); 
}); 