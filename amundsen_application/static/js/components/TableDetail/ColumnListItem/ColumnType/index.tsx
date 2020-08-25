// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Modal, OverlayTrigger, Popover } from 'react-bootstrap';

import './styles.scss';

import { getTruncatedText, parseComplexType, NestedType, ParsedType } from './parser';

const CTA_TEXT = 'Click to see nested fields';
const MODAL_TITLE = 'Nested Type';
const TEXT_INDENT= 8;

export interface ColumnTypeProps {
  columnName: string;
  database: string;
  type: string;
}

export interface ColumnTypeState {
  showModal: boolean;
}

export class ColumnType extends React.Component<
  ColumnTypeProps,
  ColumnTypeState
> {
  parsedType: ParsedType;

  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };

    this.parsedType = parseComplexType(this.props.type, this.props.database);
  }

  hideModal = (e) => {
    this.stopPropagation(e);
    this.setState({ showModal: false });
  };

  showModal = (e) => {
    this.stopPropagation(e);
    this.setState({ showModal: true });
  };

  stopPropagation = (e) => {
    e.stopPropagation();
  };

  createLineItem = (text: string, textIndent: number) => {
    return <div style={{ textIndent: `${textIndent}px` }}>{text}</div>;
  };

  renderParsedChildren = (children: ParsedType[], level: number) => {
    const textIndent = level * TEXT_INDENT;
    return children.map((item) => {
      if (typeof item === 'string') {
        return this.createLineItem(item, textIndent);
      }
      // TODO else check if NestedType, else render nothing.
      // Look into other checks for preventing endless loop failure crashing whole page
      return this.renderParsedType(item as NestedType, level);
    });
  };

  renderParsedType = (nestedType: ParsedType, level: number = 0) => {
    if (typeof nestedType === 'string') {
      return '';
    }
    const { head, tail, children } = nestedType as NestedType;
    const textIndent = level * TEXT_INDENT;
    return (
      <>
        {this.createLineItem(head, textIndent)}
        {this.renderParsedChildren(children, level + 1)}
        {this.createLineItem(tail, textIndent)}
      </>
    );
  };

  render = () => {
    const { columnName, database, type } = this.props;
    const truncatedText = getTruncatedText(type, database);

    if (truncatedText !== type) {
      const popoverHover = (
        <Popover
          className="column-type-popover"
          id={`column-type-popover:${columnName}`}
        >
          {CTA_TEXT}
        </Popover>
      );
      return (
        <div onClick={this.stopPropagation}>
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
              {truncatedText}
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
              <div className="column-type-modal-content">
                {this.renderParsedType(this.parsedType)}
              </div>
            </Modal.Body>
          </Modal>
        </div>
      );
    }

    return <div className="column-type">{type}</div>;
  };
}

export default ColumnType;
