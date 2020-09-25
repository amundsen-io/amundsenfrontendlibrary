// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Dropdown } from 'react-bootstrap';

type SortingOptions = {
  name: string;
  type: string;
};

export interface ListSortingDropdownProps {
  options: SortingOptions[];
}

const DROPDOWN_TITLE = 'Sort by';

const TableReportsDropdown: React.FC<ListSortingDropdownProps> = ({
  options,
}: ListSortingDropdownProps) => {
  if (options.length < 1) {
    return null;
  }

  return (
    <Dropdown className="list-sorting-dropdown" id="list-sorting-dropdown">
      <Dropdown.Toggle className="btn btn-default btn-lg">
        {DROPDOWN_TITLE}
      </Dropdown.Toggle>
      <Dropdown.Menu className="profile-menu">
        {options.map(({ name, type }) => (
          <li key={name}>
            <button type="button" className="btn btn-link">
              {name}
            </button>
          </li>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TableReportsDropdown;
