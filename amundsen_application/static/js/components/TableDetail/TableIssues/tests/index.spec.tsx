import * as React from 'react';

import { shallow } from 'enzyme';

import globalState from 'fixtures/globalState';

import { 
  TableIssues, 
  TableIssueProps, 
  mapStateToProps, 
  mapDispatchToProps, 
  ComponentProps 
} from '..';


describe ('TableIssues', ()=> {
  const setStateSpy = jest.spyOn(TableIssues.prototype, 'setState');
  
  const setup = (propOverrides?: Partial<TableIssueProps>) => {
    const props: TableIssueProps = {
      issues: [], 
      tableKey: 'key',
      getIssues: jest.fn(),
      ...propOverrides
    };
    const wrapper = shallow<TableIssues>(<TableIssues {...props} />);
    return { props, wrapper }; 
  }

  describe('render', () => {
    it('renders nothing if no issues', () => {
      const { props, wrapper } = setup({ issues: [] });
      expect(wrapper.html()).toBeFalsy(); 
    }); 

    it('renders issues if they exist', () => {
      const { props, wrapper } = setup({ issues: [{
        create_date: 'create_date', 
        issue_key: 'issue_key', 
        last_updated: 'last_updated', 
        title: 'title',
        url: 'http://url'
      }]}); 
      expect(wrapper.find('.table-issue-link').text()).toEqual('issue_key'); 
      expect(wrapper.find('.issue-title-name').text()).toContain('title');
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