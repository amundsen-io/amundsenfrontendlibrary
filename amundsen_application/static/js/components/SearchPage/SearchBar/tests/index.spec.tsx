import * as React from 'react';

import { shallow } from 'enzyme';

import SearchBar, { SearchBarProps, SUBTEXT_DEFAULT, SUBTEXT_EXTRA_COLON_ERROR, ERROR_CLASSNAME } from '../';

describe('SearchBar', () => {
    const eventMock = { preventDefault: jest.fn(), target: { value: 'Data Resources' } };
    const setup = (propOverrides: Partial<SearchBarProps>) => {
      const props: SearchBarProps = {
        handleValueSubmit: jest.fn(),
        ...propOverrides
      };
      const wrapper = shallow(<SearchBar {...props} />)
      return { props, wrapper };
    };

    describe('constructor', () => {
        const searchTerm = 'data';
        const subText = 'I am some text';
        let wrapper;
        beforeAll(() => {
          wrapper = setup({ searchTerm, subText }).wrapper;
        });
        it('sets the searchTerm state from props', () => {
          expect(wrapper.state().searchTerm).toEqual(searchTerm);
        });

        it('sets the subText state from props', () => {
          expect(wrapper.state().subText).toEqual(subText);
        });
    });

    describe('handleValueChange', () => {
        it('calls event.preventDefault', () => {
          const { props, wrapper } = setup();
          wrapper.instance().handleValueChange(eventMock);
          expect(wrapper.state().searchTerm).toEqual('data resources');
        });
    });

    describe('handleValueSubmit', () => {
        it('calls event.preventDefault', () => {
          const { props, wrapper } = setup();
          wrapper.instance().handleValueSubmit(eventMock);
          expect(eventMock.preventDefault).toHaveBeenCalled();
        });

        it('submits with correct props if form is valid', () => {
          const { props, wrapper } = setup();
          wrapper.instance().handleValueSubmit(eventMock);
          expect(props.handleValueSubmit).toHaveBeenCalledWith(wrapper.state().searchTerm);
        });

        it('does not submit if form is not valid', () => {
          const { props, wrapper } = setup({ searchTerm: 'tag:tag1 tag:tag2' });
          wrapper.instance().handleValueSubmit(eventMock);
          expect(props.handleValueSubmit).not.toHaveBeenCalled();
        });
    });

    describe('isFormValid', () => {
        describe('if searchTerm has more than one category', () => {
          let wrapper;
          beforeAll(() => {
            wrapper = setup({ searchTerm: 'tag:tag1 tag:tag2' }).wrapper;
          })

          it('returns false', () => {
            expect(wrapper.instance().isFormValid()).toEqual(false);
          });

          it('sets state.subText correctly', () => {
            expect(wrapper.state().subText).toEqual(SUBTEXT_EXTRA_COLON_ERROR);
          });

          it('sets state.subTextClassName correctly', () => {
            expect(wrapper.state().subTextClassName).toEqual(ERROR_CLASSNAME);
          });
        });

        describe('if searchTerm has incorrect colon syntax', () => {
          let wrapper;
          beforeAll(() => {
            wrapper = setup({ searchTerm: 'tag : tag1' }).wrapper;
          })

          it('returns false', () => {
            expect(wrapper.instance().isFormValid()).toEqual(false);
          });

          it('sets state.subText correctly', () => {
            expect(wrapper.state().subText).toEqual(`Did you mean 'tag:tag1' ? Please remove the space around the ':'.`);
          });

          it('sets state.subTextClassName correctly', () => {
            expect(wrapper.state().subTextClassName).toEqual(ERROR_CLASSNAME);
          });
        });

        describe('if searchTerm is valid', () => {
          let wrapper;
          beforeAll(() => {
            wrapper = setup({ searchTerm: 'tag:tag1' }).wrapper;
          })

          it('returns true', () => {
            expect(wrapper.instance().isFormValid()).toEqual(true);
          });

          it('sets state.subText correctly', () => {
            expect(wrapper.state().subText).toEqual(SUBTEXT_DEFAULT);
          });

          it('sets state.subTextClassName correctly', () => {
            expect(wrapper.state().subTextClassName).toEqual('');
          });
        });
    });

    describe('render', () => {
        describe('form', () => {
          it('renders with correct props', () => {
              const { props, wrapper } = setup();
              expect(wrapper.find('form').props()).toMatchObject({
                className: 'search-bar-form',
                onSubmit: wrapper.instance().handleValueSubmit,
              });
          });

          it('renders input with correct default props', () => {
              const { props, wrapper } = setup();
              expect(wrapper.find('form').find('input').props()).toMatchObject({
                'aria-label': SearchBar.defaultProps.placeholder,
                autoFocus: true,
                className: 'search-bar-input form-control',
                id: 'search-input',
                onChange: wrapper.instance().handleValueChange,
                placeholder: SearchBar.defaultProps.placeholder,
                value: wrapper.state().searchTerm,
              });
          });

          it('renders input with correct given props', () => {
              const testPlaceholder = 'Type something to search';
              const { props, wrapper } = setup({ placeholder: testPlaceholder, searchTerm: 'data' });
              expect(wrapper.find('form').find('input').props()).toMatchObject({
                'aria-label': testPlaceholder,
                autoFocus: true,
                className: 'search-bar-input form-control',
                id: 'search-input',
                onChange: wrapper.instance().handleValueChange,
                placeholder: testPlaceholder,
                value: wrapper.state().searchTerm,
              });
          });

          describe('submit button', () => {
            it('renders button with correct props', () => {
                const { props, wrapper } = setup();
                expect(wrapper.find('form').find('button').props()).toMatchObject({
                  className: 'btn btn-flat-icon search-bar-button',
                  type: 'submit',
                });
            });

            it('renders button img with correct props', () => {
                const { props, wrapper } = setup();
                expect(wrapper.find('form').find('button').find('img').props()).toMatchObject({
                  className: 'icon icon-search',
                });
            });
          });
        });

        describe('renders subtext', () =>{
          it('renders subtext div with correct class', () => {
              const { props, wrapper } = setup();
              expect(wrapper.children().at(1).props()).toMatchObject({
                className: `subtext ${wrapper.state().subTextClassName}`,
              });
          });

          it('renders subtext text', () => {
              const { props, wrapper } = setup();
              expect(wrapper.children().at(1).text()).toEqual(wrapper.state().subText);
          });
        });
    });
});
