import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

import './styles.scss';

export interface SchemaInfoProps{
  schema?: string;
  placement?: string;
  desc?: string;
}

const SchemaInfo: React.SFC<SchemaInfoProps>  = ({ schema, placement, desc }) => {
  if (schema === null || schema === '') {
    return null;
  }
  const popoverHoverFocus = (
   <Popover id="popover-trigger-hover-focus">
     <strong>{ schema }:</strong> { desc }
   </Popover>
 );

  return (
    <OverlayTrigger
     trigger={['hover', 'focus']}
     placement={ placement }
     overlay={popoverHoverFocus}
     >
      <span className="underline">{ schema }</span>
    </OverlayTrigger>
  );
};

SchemaInfo.defaultProps = {
  schema: '',
  placement: 'bottom',
  desc: 'Main source of all events data, usually recommended for use, Data is usually 24-48 hours delayed.'
};


export default SchemaInfo;
