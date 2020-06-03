import * as React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import './styles.scss';

export interface SchemaInfoProps{
  schema: string;
  table: string;
  desc: string;
  placement?: string;
}

const SchemaInfo: React.SFC<SchemaInfoProps>  = ({ schema, table, desc, placement}) => {
  const popoverHoverFocus = (
   <Popover id="popover-trigger-hover-focus">
     <strong>{ schema }:</strong> { desc }
   </Popover>
 );

  return (
    <div>
    <OverlayTrigger
     trigger={['hover', 'focus']}
     placement={ placement }
     overlay={popoverHoverFocus}
     >
      <span className="underline">{ schema }</span>
    </OverlayTrigger>.{ table }
    </div>
  );
};

SchemaInfo.defaultProps = {
  placement: 'bottom',
  };


export default SchemaInfo;
