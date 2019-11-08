import * as autosize from 'autosize';
import * as React from 'react';
import * as ReactMarkdown from 'react-markdown';

// TODO: Use css-modules instead of 'import'
import './styles.scss';
import {
  CANCEL_BUTTON_TEXT,
  REFRESH_BUTTON_TEXT,
  REFRESH_MESSAGE,
  UPDATE_BUTTON_TEXT
} from './constants';
import { EditableSectionChildProps } from 'components/TableDetail/EditableSection';

export interface StateFromProps {
  refreshValue?: string;
}

export interface DispatchFromProps {
  getLatestValue?: (onSuccess?: () => any, onFailure?: () => any) => void;
  onSubmitValue: (newValue: string, onSuccess?: () => any, onFailure?: () => any) => void;
}

export interface ComponentProps {
  editable?: boolean;
  maxLength?: number;
  value?: string;
}

export type EditableTextProps = ComponentProps & DispatchFromProps & StateFromProps & EditableSectionChildProps;

interface EditableTextState {
  value?: string;
  refreshValue?: string;
  isDisabled: boolean;
}

class EditableText extends React.Component<EditableTextProps, EditableTextState> {
  readonly textAreaRef;

  public static defaultProps: EditableTextProps = {
    editable: true,
    maxLength: 250,
    onSubmitValue: null,
    getLatestValue: null,
    value: '',
  };

  static getDerivedStateFromProps(nextProps) {
    const { refreshValue } = nextProps;
    return { refreshValue };
  }

  constructor(props) {
    super(props);
    this.textAreaRef = React.createRef();

    this.state = {
      isDisabled: false,
      value: props.value,
      refreshValue: props.value,
    };
  }

  componentDidUpdate() {
    const { isDisabled, refreshValue, value } = this.state;
    const textArea = this.textAreaRef.current;
    if (!this.props.isEditing) return;

    autosize(textArea);
    if (refreshValue && refreshValue !== value && !isDisabled) {
      // disable the component if a refresh is needed
      this.setState({ isDisabled: true })
    } else if (textArea) {
      // when entering edit mode, place focus in the textarea
      textArea.focus();
    }
  }

  exitEditMode = () => {
    this.setState({ isDisabled: false, refreshValue: '' });
    this.props.setEditMode(false);
  };

  enterEditMode = () => {
    if (this.props.getLatestValue) {
      const onSuccessCallback = () => { this.props.setEditMode(true); };
      this.props.getLatestValue(onSuccessCallback, null);
    } else {
      this.props.setEditMode(true);
    }
  };

  refreshText = () => {
    this.setState({value: this.state.refreshValue, isDisabled: false, refreshValue: undefined });
  };

  updateText = () => {
    const newValue = this.textAreaRef.current.value;
    const onSuccessCallback = () => {
      this.setState({value: newValue, refreshValue: undefined });
      this.props.setEditMode(false);
    };
    const onFailureCallback = () => { this.exitEditMode(); };

    this.props.onSubmitValue(newValue, onSuccessCallback, onFailureCallback);
  };

  render() {
    if (!this.props.isEditing) {
      return (
        <div className="editable-text">
          <div className="text-wrapper">
            <ReactMarkdown source={ this.state.value }/>
          </div>
          {
            this.props.editable && !this.state.value &&
            <a className="edit-link"
               href="JavaScript:void(0)"
               onClick={ this.enterEditMode }
            >Add Description</a>
          }
          </div>
      );
    }

    return (
      <div className="editable-text">
        <textarea
          className="editable-textarea"
          rows={ 2 }
          maxLength={ this.props.maxLength }
          ref={ this.textAreaRef }
          defaultValue={ this.state.value }
          disabled={ this.state.isDisabled }
        />
        <div className="editable-textarea-controls">
          {
            this.state.isDisabled &&
             <>
               <h2 className="label label-danger refresh-message">
                 { REFRESH_MESSAGE }
               </h2>
               <button className="btn btn-primary refresh-button" onClick={ this.refreshText } >
                 <img className="icon icon-refresh"/>
                 { REFRESH_BUTTON_TEXT }
               </button>
             </>
          }
          {
            !this.state.isDisabled &&
            <button className="btn btn-primary update-button" onClick={ this.updateText }>
              { UPDATE_BUTTON_TEXT }
            </button>
          }
          <button className="btn btn-default cancel-button" onClick={ this.exitEditMode }>
            { CANCEL_BUTTON_TEXT }
          </button>
        </div>
      </div>
    );
  }
}

export default EditableText;
