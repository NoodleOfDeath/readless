import React from 'react';

import cn from 'classnames';

import styles from './Faq.module.sass';
import Item from './Item';

import { faqs } from '~/constants/faqs';

const Faq = () => (
  <div className={ cn('section', styles.faq) }>
    <div className={ cn('container', styles.container) }>
      <div className={ styles.head }>
        <div className={ cn('h2', styles.title) }>
          Frequently Asked Questions
        </div>
        <div className={ cn('h6', styles.info) }>
          Amet minim mollit non deserunt ullamco est.
        </div>
      </div>
      <div className={ styles.list }>
        {faqs.map((x, index) => (
          <Item className={ styles.item } item={ x } key={ index } />
        ))}
      </div>
    </div>
  </div>
);

export default Faq;
