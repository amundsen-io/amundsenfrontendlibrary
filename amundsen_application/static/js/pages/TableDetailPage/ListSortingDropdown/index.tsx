// Copyright Contributors to the Amundsen project.
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Dropdown } from 'react-bootstrap';

import { SORT_BY_DROPDOWN_TITLE, SORT_BY_MENU_TITLE_TEXT } from '../constants';

import './styles.scss';

type SortingOptions = {
  name: string;
  type: string;
};

export interface ListSortingDropdownProps {
  options: SortingOptions[];
  onChange?: (value) => void;
}

type OptionType = string;

const TableReportsDropdown: React.FC<ListSortingDropdownProps> = ({
  options,
  onChange,
}: ListSortingDropdownProps) => {
  if (options.length < 1) {
    return null;
  }

  const [selectedOption, setSelectedOption] = React.useState<OptionType>(
    options[0].type
  );

  const handleChange = (e) => {
    const { value } = e.target;

    setSelectedOption(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Dropdown
      className="list-sorting-dropdown"
      id="list-sorting-dropdown"
      pullRight
    >
      <Dropdown.Toggle className="btn btn-default list-sorting-dropdown-button">
        {SORT_BY_DROPDOWN_TITLE}
      </Dropdown.Toggle>
      <Dropdown.Menu className="list-sorting-dropdown-menu">
        <h5 className="list-sorting-dropdown-menu-title">
          {SORT_BY_MENU_TITLE_TEXT}
        </h5>
        {options.map(({ name, type }) => (
          <li key={name}>
            <label className="list-sorting-dropdown-menu-item radio-label">
              <input
                type="radio"
                name="sort-option"
                value={type}
                checked={selectedOption === type}
                onChange={handleChange}
              />
              <span className="list-sorting-dropdown-menu-item-text">
                {name}
              </span>
            </label>
          </li>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TableReportsDropdown;
