import React from 'react';

import Icon from '@mdi/react';
import cn from 'classnames';
import { useMediaQuery } from 'react-responsive';

import styles from './Integration.module.sass';

import Animation from '~/components/Animation';
import Image from '~/components/Image';
import { integrations } from '~/constants/integrations';

const Integration = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 762px)' });
  return (
    <div className={ cn('section', styles.integration) }>
      <div className={ cn('container', styles.container) }>
        <div className={ styles.preview }>
          <Image
            src="/images/ss-custom-feed.png"
            width={ isMobile ? 360 : 480 }
            height={ isMobile ? 560 : 740 }
            alt="Iphone" />
          <div className={ styles.circles }>
            {Array.from(Array(3).keys()).map((x) => (
              <Animation
                className={ styles.circle }
                animateIn="fadeIn"
                speed={ -4 }
                key={ x }>
                <span />
              </Animation>
            ))}
          </div>
        </div>
        <div className={ styles.wrap }>
          <h2 className={ cn('h2', styles.title) }>
            Create a highly customizable feed
          </h2>
          <div className={ cn('h5M', styles.info) }>
            Without even needing to create an account
          </div>
          <div className={ styles.list }>
            {integrations.map((integration, index) => (
              <div className={ styles.item } key={ index }>
                <div
                  className={ styles.icon }
                  style={ { backgroundColor: integration.color } }>
                  <Icon path={ integration.icon } />
                </div>
                {integration.title}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integration;
