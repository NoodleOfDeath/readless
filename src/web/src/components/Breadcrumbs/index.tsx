import React from 'react';

import Link from 'next/link';

import styles from './Breadcrumbs.module.sass';

type BreadcrumbsType = {
    title: string;
    url?: string;
};

type BreadcrumbsProps = {
    items: BreadcrumbsType[];
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => (
  <ul className={ styles.breadcrumbs }>
    {items.map((item, index) =>
      item.url ? (
        <li key={ index }>
          <Link href={ item.url }>
            {item.title}
          </Link>
        </li>
      ) : (
        <li key={ index }>{item.title}</li>
      ))}
  </ul>
);

export default Breadcrumbs;
