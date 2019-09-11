import * as React from 'react';

import AvatarLabel from 'components/common/AvatarLabel';
import { logClick } from 'ducks/utilMethods';
import { TableWriter } from 'interfaces';

export interface WriterLinkProps {
  tableWriter: TableWriter;
}

const WriterLink: React.SFC<WriterLinkProps> = ({ tableWriter }) => {
  if (tableWriter === null || tableWriter.application_url === null) return null;

  const image = (tableWriter.name === 'Airflow') ?  '/static/images/airflow.jpeg' : '';

  return (
    <a
      className="header-link"
      href={ tableWriter.application_url }
      id="explore-writer"
      onClick={ logClick }
      target='_blank'
    >
      <AvatarLabel label={ tableWriter.name } src={ image }/>
    </a>
  );
};

export default WriterLink;
