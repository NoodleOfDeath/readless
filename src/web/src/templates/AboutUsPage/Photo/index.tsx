import React from 'react';

import cn from 'classnames';

import styles from './Photo.module.sass';

import Image from '~/components/Image';

const Photo = () => (
  <div className={ cn('section', styles.photo) }>
    <Image
      src="/images/picture-1.png"
      width={ 1100 }
      height={ 760 }
      alt="Picture" />
  </div>
);

export default Photo;
