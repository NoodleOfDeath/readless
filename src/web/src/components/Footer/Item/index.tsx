import React from 'react';

import cn from 'classnames';
import Link from 'next/link';

import styles from './Item.module.sass';

import Icon from '~/components/Icon';

type ItemProps = {
  className: string;
  item: any;
};

const Item = ({ className, item }: ItemProps) => {
  const [visible, setVisible] = React.useState<boolean>(false);

  return (
    <div
      className={ cn(styles.item, className, { [styles.active]: visible }) }>
      <div className={ styles.title } onClick={ () => setVisible(!visible) }>
        {item.title} 
        {' '}
        <Icon name="plus-circle" />
      </div>
      <div className={ styles.menu }>
        {item.menu.map((link: any, index: number) =>
          link.external ? (
            <a
              className={ styles.link }
              href={ link.url }
              target="_blank"
              rel="noopener noreferrer"
              key={ index }>
              {link.title}
            </a>
          ) : (
            <Link href={ link.url } key={ index } className={ styles.link }>
              {link.title}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Item;
