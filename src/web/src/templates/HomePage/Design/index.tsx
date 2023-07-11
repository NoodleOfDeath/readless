import React from 'react';

import cn from 'classnames';

import styles from './Design.module.sass';

import Animation from '~/components/Animation';
import Image from '~/components/Image';

const Design = () => (
  <div className={ styles.design }>
    <div className={ cn('container', styles.container) }>
      <div className={ cn('h2', styles.title) }>
        Delightfully simple &&nbsp;powerful 3D design tool
      </div>
      <div className={ styles.preview }>
        <Image
          src="/images/design.jpg"
          width={ 1184 }
          height={ 737 }
          alt="Design" />
        <div className={ styles.circles }>
          {Array.from(Array(4).keys()).map((x) => (
            <Animation
              className={ styles.circle }
              animateIn="fadeIn"
              speed={ -4 }
              key={ x }>
              <span></span>
            </Animation>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Design;
