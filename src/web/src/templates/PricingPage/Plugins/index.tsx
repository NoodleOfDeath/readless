import React from 'react';

import cn from 'classnames';

import styles from './Plugins.module.sass';

import Image from '~/components/Image';
import { plugins } from '~/constants/plugins';

const Plugins = () => (
  <div className={ cn('section', styles.plugins) }>
    <div className={ cn('container-medium', styles.container) }>
      <div className={ styles.head }>
        <div className={ cn('h2', styles.title) }>Plugins & add-ons</div>
        <div className={ cn('h5M', styles.info) }>
          For larger organisations. Benefit from enhanced performance
          and 24/7 support.
        </div>
      </div>
      <div className={ styles.list }>
        {plugins.map((item: any, index: number) => (
          <div className={ styles.item } key={ index }>
            <div className={ styles.preview }>
              <Image
                src={ item.image }
                layout="fill"
                objectFit="cover"
                alt="Folder" />
            </div>
            <div className={ styles.details }>
              <div className={ cn('h4', styles.subtitle) }>
                {item.title}
              </div>
              <div className={ styles.content }>{item.info}</div>
            </div>
            <div className={ cn('h3', styles.price) }>
              $
              {item.price}
              <span className={ styles.duration }>
                <span className={ styles.separator }></span>
                {' '}
                mo
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Plugins;
