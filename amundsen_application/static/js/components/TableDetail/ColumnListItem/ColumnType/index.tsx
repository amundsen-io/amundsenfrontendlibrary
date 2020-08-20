// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

// import './styles.scss';

export interface ColumnTypeProps {
  columnIndex: number;
  type: string;
}

export class ColumnType extends React.Component<ColumnTypeProps> {
  stopPropagation = (e) => {
    e.stopPropagation();
  };

  render = () => {
    const { columnIndex, type } = this.props;

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
          {fullText}
        </Popover>
      );
      return (
        <OverlayTrigger
          trigger={['click']}
          placement="left"
          overlay={popoverHover}
          rootClose
        >
          <a
            className="column-type"
            href="JavaScript:void(0)"
            onClick={this.stopPropagation}
          >
            {text}
          </a>
        </OverlayTrigger>
      );
    }
    return <div className="column-type">{text}</div>;
  };
}

export default ColumnType;
