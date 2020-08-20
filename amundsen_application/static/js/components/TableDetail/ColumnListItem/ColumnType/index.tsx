// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Modal, OverlayTrigger, Popover } from 'react-bootstrap';

import './styles.scss';

const CTA_TEXT = 'Click to see nested fields';
const MODAL_TITLE = 'Nested Type';

export interface ColumnTypeProps {
  columnIndex: number;
  columnName: string;
  type: string;
}

export interface ColumnTypeState {
  showModal: boolean;
}

export class ColumnType extends React.Component<
  ColumnTypeProps,
  ColumnTypeState
> {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  hideModal = (e) => {
    e.stopPropagation();
    this.setState({ showModal: false });
  };

  showModal = (e) => {
    e.stopPropagation();
    this.setState({ showModal: true });
  };

  render = () => {
    const { columnName, columnIndex, type } = this.props;

    const truncatedTypes: string[] = ['array', 'struct', 'map', 'row'];
    let shouldTrucate = false;

    const fullText = type.toLowerCase();
    let text = fullText;

    truncatedTypes.forEach((truncatedType) => {
      if (type.startsWith(truncatedType) && type !== truncatedType) {
        shouldTrucate = true;
        const lastChar = type.charAt(type.length - 1);
        if (lastChar === '>') {
          text = `${truncatedType}<...>`;
        } else if (lastChar === ')') {
          text = `${truncatedType}(...)`;
        } else {
          text = `${truncatedType}...`;
        }
      }
    });

    if (shouldTrucate) {
      const popoverHover = (
        <Popover
          className="column-type-popover"
          id={`column-type-popover:${columnIndex}`}
        >
          {CTA_TEXT}
        </Popover>
      );
      return (
        <>
          <OverlayTrigger
            trigger={['hover']}
            placement="top"
            overlay={popoverHover}
            rootClose
          >
            <a
              className="column-type"
              href="JavaScript:void(0)"
              onClick={this.showModal}
            >
              {text}
            </a>
          </OverlayTrigger>
          <Modal
            className="column-type-modal"
            show={this.state.showModal}
            onHide={this.hideModal}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {MODAL_TITLE}
                <div className="column-name">{columnName}</div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="column-type-modal-content">{fullText}</div>
            </Modal.Body>
          </Modal>
        </>
      );
    }

    return <div className="column-type">{text}</div>;
  };
}

export default ColumnType;
