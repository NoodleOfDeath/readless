import React from 'react';

import cn from 'classnames';

import styles from './Item.module.sass';

import Image from '~/components/Image';

type ItemProps = {
  className: string;
  title: string;
  content: string;
  children: React.ReactNode;
  image: string;
};

const Item = ({
  className, title, content, children, image, 
}: ItemProps) => (
  <div className={ cn(styles.item, className) }>
    <div className={ cn('h3', styles.title) }>{title}</div>
    <div className={ styles.content }>{content}</div>
    {children}
    <div className={ styles.preview }>
      <Image src={ image } layout="fill" objectFit="cover" alt="Contact" />
    </div>
  </div>
);

export default Item;
