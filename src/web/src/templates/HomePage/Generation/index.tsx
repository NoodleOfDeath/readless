import React from 'react';

import cn from 'classnames';
import { useMediaQuery } from 'react-responsive';

import styles from './Generation.module.sass';

import Animation from '~/components/Animation';
import Image from '~/components/Image';
import { generation } from '~/mocks/generation';

const Generation = ({ scrollToRef }: {scrollToRef: any}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isWidescreen = useMediaQuery({ query: '(min-width: 1440px)' });

  return (
    <div className={ cn('section-border', styles.generation) }>
      <div className={ styles.anchor } ref={ scrollToRef }></div>
      <div className={ cn('container', styles.container) }>
        <h2 className={ cn('h2', styles.title) }>
          There is simply too much out there to read it all.
        </h2>
        <div className={ styles.list }>
          {generation.map((item, index) => (
            <Animation
              className={ styles.item }
              animateIn="fadeInDown"
              key={ index }
              delay={ isMobile ? 0 : item.delay }>
              <div
                className={ styles.preview }
                style={ { 
                  backgroundColor: item.color,
                  height: isMobile || isWidescreen ? 300 : 225,
                  width: isMobile || isWidescreen ? 400 : 300,
                } }>
                {item.label && (
                  <div
                    className={ cn(
                      { ['label']: item.label === 'new' },
                      styles.label
                    ) }>
                    {item.label}
                  </div>
                )}
                <div className={ styles.image }>
                  <Image
                    src={ item.image }
                    width={ isMobile || isWidescreen ? 400 : 300 }
                    height={ isMobile || isWidescreen ? 300 : 225 }
                    alt={ item.title }
                    priority />
                </div>
              </div>
              <div className={ cn('h5', styles.subtitle) }>
                {item.title}
              </div>
              <div className={ styles.content }>{item.content}</div>
            </Animation>
          ))}
        </div>
        <div className={ styles.footnote }>
          *Currently only available on iOS
        </div>
      </div>
    </div>
  );
};

export default Generation;
