import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

export interface SchemaInfoProps{
  schema: string;
  placement?: string;
  desc: string;
}

const SchemaInfo: React.SFC<SchemaInfoProps>  = ({ schema, placement, desc }) => {
  const popoverHoverFocus = (
   <Popover id="popover-trigger-hover-focus">
     <strong>{ schema }:</strong> { desc }
   </Popover>
 );

  if (desc === null || desc === '' ) {
    return (
      <span>{ schema }</span>
    )
  }

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
  placement: 'bottom',
  };


export default SchemaInfo;
