import * as React from 'react';

import './styles.scss';

interface EditableSectionProps {
  title: string;
}

interface EditableSectionState {
  editMode: boolean;
}


export class EditableSection extends React.Component<EditableSectionProps, EditableSectionState> {

  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
    }
  }

  disableEditMode = () => {
    this.setState({ editMode: false });
  };

  enableEditMode = () => {
    this.setState({ editMode: true });
  };

  toggleEdit = () => {
    this.setState({ editMode: !this.state.editMode });
  };

  render() {
    let elements = React.Children.toArray(this.props.children);
    let child = elements[0];
    let content;
    if (React.isValidElement(child)) {
        content = React.cloneElement(child, {
          editMode: this.state.editMode,
          enableEditMode: this.enableEditMode,
          disableEditMode: this.disableEditMode,
        });
    } else {
      content = child;
    }
    return (
      <section className="editable-section">
        <div className="section-title title-3">
          { this.props.title }
          <button className={"btn btn-flat-icon edit-button" + (this.state.editMode? " active": "")} onClick={ this.toggleEdit }>
            <img className={"icon icon-small icon-edit" + (this.state.editMode ? " icon-color" : "")} />
          </button>
        </div>
        { content }
      </section>
    );
  }
}
