import React from 'react';

import cn from 'classnames';

import styles from './Item.module.sass';

import Play from '~/components/Play';

type ItemProps = {
  className?: string;
  title: string;
  info: string;
  video: string;
  children: React.ReactNode;
};

const Item = ({
  className, title, info, video, children, 
}: ItemProps) => (
  <div className={ cn(styles.item, className) }>
    <div className={ styles.col }>
      <div className={ cn('h3', styles.title) }>{title}</div>
      <div className={ cn('h6', styles.info) }>{info}</div>
      <Play title="Watch tutorial" video={ video } />
    </div>
    <div className={ styles.col }>{children}</div>
  </div>
);

export default Item;
