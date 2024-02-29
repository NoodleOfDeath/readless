import React from 'react';

import cn from 'classnames';

import styles from './Downloads.module.sass';

import Image from '~/components/Image';
import { downloads } from '~/constants/downloads';

type DownloadsProps = {
  scrollToRef: any;
};

const Downloads = ({ scrollToRef }: DownloadsProps) => (
  <div className={ cn('section', styles.downloads) }>
    <div className={ styles.anchor } ref={ scrollToRef }></div>
    <div className={ cn('container', styles.container) }>
      <div className={ styles.list }>
        {downloads.map((item, index) => (
          <div className={ styles.item } key={ index }>
            <div className={ styles.inner }>
              <div className={ styles.head }>
                <div className={ cn('h4M', styles.subtitle) }>
                  {item.title}
                </div>
                <button
                  className={ cn(
                    'button-black',
                    styles.button
                  ) }>
                  {item.buttonText}
                </button>
              </div>
              {item.content && (
                <div className={ cn('h6', styles.content) }>
                  {item.content}
                </div>
              )}
              <div className={ styles.preview }>
                <Image
                  src={ item.image.src }
                  width={ item.image.width }
                  height={ item.image.height }
                  alt={ item.image.alt } />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Downloads;
