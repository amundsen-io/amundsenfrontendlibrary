import * as React from 'react';

import { ResourceReport } from 'interfaces/index';
import { Dropdown, NavItem, MenuItem } from 'react-bootstrap';

export interface ResourceReportProps {
  resourceReports: ResourceReport[];
}

const TableReportsDropdown: React.SFC<ResourceReportProps> = ({ resourceReports }) => {
  if (resourceReports === null || resourceReports.length < 1) return null;
  return (
    <Dropdown id='user-dropdown' pullRight={true}>
      <Dropdown.Toggle noCaret={true} className="btn btn-default btn-lg">
        Reports
      </Dropdown.Toggle>
      <Dropdown.Menu className='profile-menu'>
        {resourceReports.map(report => <li><a target="_blank" href={`${report.url}`}>{`${report.name}`}</a></li>)}
      </Dropdown.Menu>
    </Dropdown>

  );
};

export default TableReportsDropdown;
