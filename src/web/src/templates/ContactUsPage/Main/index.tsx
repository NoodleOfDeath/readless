import React from 'react';

import cn from 'classnames';

import FormContact from './FormContact';
import FormRequest from './FormRequest';
import Item from './Item';
import styles from './Main.module.sass';

import Animation from '~/components/Animation';

const Main = () => (
  <div className={ styles.main }>
    <div className={ cn('container-medium', styles.container) }>
      <div className={ cn('h1', styles.title) }>Contact us</div>
      <div className={ styles.list }>
        <Item
          className={ styles.item }
          title="Talk to sale"
          content="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit"
          image="/images/contact-pic-1.jpg">
          <FormContact className={ styles.button } title="Contact us" />
        </Item>
        <Item
          className={ styles.item }
          title="Get support"
          content="Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit"
          image="/images/contact-pic-2.jpg">
          <FormRequest
            className={ styles.button }
            title="Create ticket" />
        </Item>
      </div>
    </div>
    <div className={ styles.circles }>
      {Array.from(Array(4).keys()).map((x) => (
        <Animation
          className={ styles.circle }
          animateIn="fadeAlways"
          speed={ -4 }
          key={ x }
          initiallyVisible={ true }>
          <span></span>
        </Animation>
      ))}
    </div>
  </div>
);

export default Main;
