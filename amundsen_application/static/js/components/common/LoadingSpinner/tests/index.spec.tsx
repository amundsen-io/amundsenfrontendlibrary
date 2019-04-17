import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';

import { configure, shallow } from 'enzyme';

import LoadingSpinner from '../';

configure({ adapter: new Adapter() });

describe('LoadingSpinner', () => {
    let subject;

    beforeEach(() => {
        subject = shallow(<LoadingSpinner />);
    });

    describe('render', () => {
        it('renders img with props', () => {
          expect(subject.find('img').props()).toMatchObject({
            alt: 'loading...',
            className: 'loading-spinner',
            src: '/static/images/loading_spinner.gif',
          });
        });
    });
});
