
import * as React from 'react';
import ReactDOM from 'react-dom';
import serialize from 'form-serialize';

import AvatarLabel, { AvatarLabelProps } from '../common/AvatarLabel';
import { Modal } from 'react-bootstrap';

// TODO: Use css-modules instead of 'import'
import './styles.scss';

const DEFAULT_ERROR_TEXT = 'There was a problem with the request, please relaod the page.';

enum UpdateMethod {
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface DispatchFromProps {
  onUpdateList: (updateArray: { method: UpdateMethod; id: string; }[], onSuccess?: () => any, onFailure?: () => any) => void;
}

export interface ComponentProps {
  errorText?: string | null;
  readOnly: boolean;
}

export interface StateFromProps {
  itemProps: Map<string, AvatarLabelProps>;
}

type AvatarLabelListProps = ComponentProps & DispatchFromProps & StateFromProps;

interface AvatarLabelListState {
  errorText: string | null;
  itemProps: Map<string, AvatarLabelProps>;
  readOnly: boolean;
  showModal: boolean;
  tempItemProps: Map<string, AvatarLabelProps>;
}

class AvatarLabelList extends React.Component<AvatarLabelListProps, AvatarLabelListState> {
  private inputRef: React.RefObject<HTMLInputElement>;

  public static defaultProps: AvatarLabelListProps = {
    errorText: null,
    readOnly: true,
    itemProps: new Map(),
    onUpdateList: () => undefined,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { itemProps, readOnly } = nextProps;
    return { itemProps, readOnly, tempItemProps: itemProps };
  }

  constructor(props) {
    super(props);

    this.state = {
      errorText: props.errorText,
      itemProps: props.itemProps,
      readOnly: props.readOnly,
      showModal: false,
      tempItemProps: props.itemProps,
    };

    this.inputRef = React.createRef();
  }

  handleShow = () => {
    this.setState({ showModal: true });
  }

  cancelEdit = () => {
    this.setState({ tempItemProps: this.state.itemProps, showModal: false });
  }

  saveEdit = () => {
    const updateArray = [];
    this.state.itemProps.forEach((value, key) => {
      if (!this.state.tempItemProps.has(key)) {
        updateArray.push({ method: UpdateMethod.DELETE, id: key });
      }
    });
    this.state.tempItemProps.forEach((value, key) => {
      if (!this.state.itemProps.has(key)) {
        updateArray.push({ method: UpdateMethod.PUT, id: key });
      }
    });

    const onSuccessCallback = () => {
      this.setState({ itemProps: this.state.tempItemProps, showModal: false });
    }
    const onFailureCallback = () => {
      this.setState({ errorText: DEFAULT_ERROR_TEXT, readOnly: true, showModal: false });
    }
    this.props.onUpdateList(updateArray, onSuccessCallback, onFailureCallback);
  }

  recordAddItem = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(this.inputRef);
    const value = this.inputRef.current.value;
    if (value) {
      this.inputRef.current.value = '';
      const newTempItemProps = new Map(this.state.tempItemProps);
      newTempItemProps.set(value, { label: value });
      this.setState({ tempItemProps: newTempItemProps });
    }
  }

  recordDeleteItem = (key: string) => {
    const newTempItemProps = new Map(this.state.tempItemProps);
    newTempItemProps.delete(key)
    this.setState({ tempItemProps: newTempItemProps });
  }

  render() {
    let content;
    const items = [];
    const modalItems = [];

    if (this.state.errorText) {
      return (
        <div className='editable-list-component'>
          <label className="status-message">{this.state.errorText}</label>
        </div>
      );
    }

    if (this.state.itemProps.size === 0) {
      content = (<label className="status-message">No entries exist</label>);
    }
    else {
      this.state.itemProps.forEach((value, key) => {
        const item = (
          <li key={`list-item:${key}`}>
            { React.createElement(AvatarLabel, value) }
          </li>
        );
        items.push(item);
      });

      content = (
        <ul className='component-list'>
          { items }
        </ul>
      );
    }

    if (this.state.showModal) {
      this.state.tempItemProps.forEach((value, key) => {
        const modalItem = (
          <li key={`modal-list-item:${key}`}>
            { React.createElement(AvatarLabel, value) }
            <button
              className='btn delete-button'
              aria-label='Delete Item'
              /* tslint:disable - TODO: Investigate jsx-no-lambda rule */
              onClick={() => this.recordDeleteItem(key)}
              /* tslint:enable */
            >
             <img className='icon icon-delete'/>
            </button>
          </li>
        );
        modalItems.push(modalItem);
      });
    }

    return (
      <div className='editable-list-component'>
        { content }
        {
          !this.state.readOnly &&
          <button
           className='btn add-list-item'
           onClick={this.handleShow}>
             <img className='icon icon-plus-circle'/>
             <span>Add</span>
          </button>
        }

        <Modal className='editable-list-modal' show={this.state.showModal} onHide={this.cancelEdit}>
          <Modal.Header className="text-center" closeButton={false}>
            <Modal.Title>Owned By</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className='component-form' onSubmit={this.recordAddItem}>
              <input
                id='add-item-input'
                autoFocus={true}
                placeholder='Enter an email address'
                ref={ this.inputRef }
              />
              <button className="btn btn-light add-btn" type="submit" aria-label="Add Item">
                <span aria-hidden="true">Add</span>
              </button>
            </form>
            <ul className='component-list'>
              { modalItems }
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn cancel-btn" onClick={this.cancelEdit}>Cancel</button>
            <button type="button" className="btn save-btn" onClick={this.saveEdit}>Save</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default AvatarLabelList;
