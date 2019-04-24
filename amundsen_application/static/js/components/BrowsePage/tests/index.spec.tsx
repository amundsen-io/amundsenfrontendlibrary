import * as React from 'react';
import * as DocumentTitle from 'react-document-title';
import { BrowserRouter as Router } from 'react-router-dom';

import { mount, shallow } from 'enzyme';

import LoadingSpinner from 'components/common/LoadingSpinner';
import TagInfo from 'components/Tags/TagInfo';
import { BrowsePage, BrowsePageProps, mapDispatchToProps, mapStateToProps } from '../';

import globalState from 'fixtures/globalState';

import AppConfig from 'config/config';
AppConfig.browse.curatedTags = ['test1', 'test3'];

describe('BrowsePage', () => {
    let props: BrowsePageProps;
    let subject;

    beforeEach(() => {
        props = {
          allTags: [
            {
              tag_count: 2,
              tag_name: 'test1',
            },
            {
              tag_count: 1,
              tag_name: 'test2',
            },
          ],
          isLoading: false,
          getAllTags: jest.fn(),
        };
        subject = shallow(<BrowsePage {...props} />);
    });

    /*TODO: Test getDerivedStateFromProps */

    describe('componentDidMount', () => {
        it('calls props.getAllTags', () => {
            expect(props.getAllTags).toHaveBeenCalled();
        });
    });

    describe('render', () => {
        it('renders LoadingSpinner if state.isLoading', () => {
            /* Note: For some reason setState is not updating the component in this case */
            props.isLoading = true;
            subject.setProps(props);
            expect(subject.find(LoadingSpinner).exists()).toBeTruthy();
        });

        it('renders DocumentTitle w/ correct title', () => {
            expect(subject.find(DocumentTitle).props().title).toEqual('Browse - Amundsen');
        });

        it('renders correct header', () => {
            expect(subject.find('#browse-header').text()).toEqual('Browse Tags');
        });

        /*TODO: Test rendering of browse-body*/
    });
});

describe('mapDispatchToProps', () => {
    let dispatch;
    let result;

    beforeEach(() => {
        dispatch = jest.fn(() => Promise.resolve());
        result = mapDispatchToProps(dispatch);
    });

    it('sets getAllTags on the props', () => {
        expect(result.getAllTags).toBeInstanceOf(Function);
    });
});

describe('mapStateToProps', () => {
    let result;
    beforeEach(() => {
        result = mapStateToProps(globalState);
    });

    it('sets allTags on the props', () => {
        expect(result.allTags).toEqual(globalState.allTags.allTags);
    });

    it('sets isLoading on the props', () => {
        expect(result.isLoading).toEqual(globalState.allTags.isLoading);
    });
});
