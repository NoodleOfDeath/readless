import React from 'react';

import styles from './Scroll.module.sass';

import Icon from '~/components/Icon';

type ScrollProps = {
    title: string;
    onScroll: () => void;
};

const Scroll = ({ title, onScroll }: ScrollProps) => (
  <button className={ styles.scroll } onClick={ onScroll }>
    <div className={ styles.icon }>
      <Icon name="arrow-down" />
    </div>
    {title}
  </button>
);

export default Scroll;
