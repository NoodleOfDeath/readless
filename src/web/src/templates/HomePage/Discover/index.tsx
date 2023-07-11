import React from 'react';

import cn from 'classnames';

import styles from './Discover.module.sass';
import Item from './Item';
import List from './List';
import Models from './Models';

import { list } from '~/constants/discover';

const Discover = () => {
  return (
    <div className={ cn('section', styles.discover) }>
      <div className={ cn('container', styles.container) }>
        <h2 className={ cn('h2', styles.title) }>Discover how it work</h2>
        <div className={ styles.list }>
          <Item
            className={ styles.item }
            title="Set up your perfect scene."
            info="Amet minim mollit non deserunt ullamco est."
            video="BHACKCNDMW8">
            <List list={ list } />
          </Item>
          <Item
            className={ styles.item }
            title="Build simple or complex models."
            info="Amet minim mollit non deserunt ullamco est."
            video="BHACKCNDMW8">
            <Models />
          </Item>
        </div>
      </div>
    </div>
  );
};

export default Discover;
