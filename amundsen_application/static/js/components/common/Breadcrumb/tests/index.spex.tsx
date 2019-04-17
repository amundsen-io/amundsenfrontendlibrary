import * as React from 'react';
import * as Adapter from 'enzyme-adapter-react-16';

import { configure, shallow } from 'enzyme';

import { Link } from 'react-router-dom';
import Breadcrumb, { BreadcrumbProps } from '../';

configure({ adapter: new Adapter() });

describe('Breadcrumb', () => {
    let props: BreadcrumbProps;
    let subject;

    beforeEach(() => {
        props = {
          path: 'testPath',
          text: 'testText',
        };
        subject = shallow(<Breadcrumb {...props} />);
    });

    describe('render', () => {
        it('renders Link with correct path', () => {
            expect(subject.find(Link).props()).toMatchObject({
                to: props.path,
            });
        });

        it('renders Link with correct text', () => {
            expect(subject.find(Link).find('button').text()).toEqual(props.text);
        });
    });
});
