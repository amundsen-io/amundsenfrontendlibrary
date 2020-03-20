import * as React from 'react';

import { shallow } from 'enzyme';

import AppConfig from 'config/config';
import globalState from 'fixtures/globalState';

import { 
  TableIssues, 
  TableIssueProps, 
  mapStateToProps, 
  mapDispatchToProps
} from '..';


describe ('TableIssues', ()=> {
  const setStateSpy = jest.spyOn(TableIssues.prototype, 'setState');
  
  const setup = (propOverrides?: Partial<TableIssueProps>) => {
    const props: TableIssueProps = {
      issues: [], 
      tableKey: 'key',
      tableName: 'tableName',
      total: 0, 
      allIssuesUrl: 'testUrl', 
      getIssues: jest.fn(),
      ...propOverrides
    };
    const wrapper = shallow<TableIssues>(<TableIssues {...props} />);
    return { props, wrapper }; 
  }

  describe('render', () => {
    beforeAll(() => {
      AppConfig.issueTracking.enabled = true;
    }); 

    it('renders nothing if no issues', () => {
      const { props, wrapper } = setup({ issues: [] });
      expect(wrapper.html()).toBeFalsy(); 
    }); 

    it('renders nothing if issueTracking not enabled', () => {
      AppConfig.issueTracking.enabled = false;
      const { props, wrapper } = setup({ issues: [] });
      expect(wrapper.html()).toBeFalsy(); 
    }); 

    it('renders issues if they exist', () => {
      AppConfig.issueTracking.enabled = true;
      const { props, wrapper } = setup({ issues: [{
        issue_key: 'issue_key', 
        title: 'title',
        url: 'http://url', 
        status: 'Open', 
        priority_display_name: 'P2', 
        priority_name: 'Major'
      }]}); 
      expect(wrapper.find('.table-issue-link').text()).toEqual('issue_key'); 
      expect(wrapper.find('.issue-title-name').text()).toContain('title');
    }); 

    it('renders no extra notice if no remaining issues', () => {
      const { props, wrapper } = setup({ issues: [{
          issue_key: 'issue_key', 
          title: 'title',
          url: 'http://url',
          status: 'Open', 
          priority_display_name: 'P2', 
          priority_name: 'Major'
        }],
        total: 0, 
        allIssuesUrl: null
      });
      expect(wrapper.find('.table-issue-more-issues').length).toEqual(0); 
    }); 
    it('renders extra notice if remaining issues', () => {
      const { props, wrapper } = setup({ issues: [{
          issue_key: 'issue_key', 
          title: 'title',
          url: 'http://url',
          status: 'Open', 
          priority_display_name: 'P2', 
          priority_name: 'Major'
        }],
        total: 1, 
        allIssuesUrl: 'url'
      });
      expect(wrapper.find('.table-issue-more-issues').text()).toEqual('View all 1 issues'); 
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
      expect(props.getIssues).toBeInstanceOf(Function);
    });
  });
  
  describe('mapStateToProps', () => {
    let result;
    beforeAll(() => {
      result = mapStateToProps(globalState);
    });

    it('sets issues on the props', () => {
      expect(result.issues).toEqual(globalState.issue.issues); 
    }); 
  }); 
}); 