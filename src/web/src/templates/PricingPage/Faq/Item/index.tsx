import React from 'react';

import cn from 'classnames';

import styles from './Item.module.sass';

import Icon from '~/components/Icon';

type ItemProps = {
    className?: string;
    item: any;
};

const Item = ({ className, item }: ItemProps) => {
  const [visible, setVisible] = React.useState<boolean>(false);

  return (
    <div
      className={ cn(
        styles.item,
        { [styles.active]: visible },
        className
      ) }>
      <div className={ styles.head } onClick={ () => setVisible(!visible) }>
        <div className={ cn('h6', styles.subtitle) }>{item.title}</div>
        <div className={ styles.plus }>
          <Icon name="plus-circle" />
        </div>
      </div>
      <div className={ styles.body }>{item.content}</div>
    </div>
  );
};

export default Item;
