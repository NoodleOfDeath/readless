import React from 'react';

import cn from 'classnames';

import styles from './Website.module.sass';

import Image from '~/components/Image';

const Website = () => {
  return (
    <div className={ cn('section-border', styles.website) }>
      <div className={ cn('container', styles.container) }>
        <div className={ styles.wrap }>
          <h2 className={ cn('h2', styles.title) }>
            Top coverage from the best publishers
          </h2>
          <div className={ cn('h5M', styles.info) }>
            Read Less pulls from over 80+ publishers with more added every week
          </div>
        </div>
        <div className={ styles.previewMobile }>
          <Image
            src="/images/ss-publishers.png"
            width={ 500 }
            height={ 360 }
            alt="Hero" />
        </div>
        <div className={ styles.previewDesktop }>
          <Image
            src="/images/ss-publishers.png"
            width={ 864 }
            height={ 560 }
            alt="Hero" />
        </div>
        <div className={ styles.preview }>
          <Image
            src="/images/ss-publishers.png"
            width={ 580 }
            height={ 420 }
            alt="Hero" />
        </div>
      </div>
    </div>
  );
};

export default Website;
