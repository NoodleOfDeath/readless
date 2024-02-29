import React from 'react';

import cn from 'classnames';

import styles from './Main.module.sass';

import Image from '~/components/Image';

const Main = () => (
  <div className={ cn('section', styles.main) }>
    <div className={ cn('container', styles.container) }>
      <div className={ styles.wrap }>
        <h1 className={ cn('hero', styles.title) }>Help center</h1>
        <div className={ cn('h5M', styles.info) }>Learn and level up</div>
      </div>
      <div className={ styles.preview }>
        <Image
          src="/images/help.png"
          width={ 950 }
          height={ 712 }
          alt="Help" />
      </div>
    </div>
  </div>
);

export default Main;
