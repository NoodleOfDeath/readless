import React from 'react';

import cn from 'classnames';

import styles from './Main.module.sass';
import Plans from './Plans';

import Animation from '~/components/Animation';
import Image from '~/components/Image';
import Tabs from '~/components/Tabs';
import {
  images,
  plans,
  tabs,
} from '~/constants/pricing';

const Main = () => {
  const [sorting, setSorting] = React.useState<string>('pay-monthly');

  return (
    <div className={ cn('section', styles.main) }>
      <div className={ styles.inner }>
        <div className={ cn('container', styles.container) }>
          <div className={ styles.head }>
            <div className={ cn('h1', styles.title) }>
              Pricing plans
            </div>
            <div className={ cn('h5M', styles.info) }>
              No credit card required. All plans come with a free,
              30-day trial of our Premium features.
            </div>
            <Tabs
              className={ styles.tabs }
              items={ tabs }
              value={ sorting }
              setValue={ setSorting } />
          </div>
          <Plans plans={ plans } />
        </div>
        <div className={ styles.background }>
          {images.map((image, index) => (
            <Animation
              className={ styles.image }
              animateIn="fadeAlways"
              speed={ -4 }
              key={ index }
              initiallyVisible={ true }>
              <Image
                src={ image.src }
                width={ image.width }
                height={ image.height }
                alt={ image.alt } />
            </Animation>
          ))}
        </div>
        <div className={ styles.circles }>
          {Array.from(Array(4).keys()).map((x) => (
            <Animation
              className={ styles.circle }
              animateIn="fadeAlways"
              speed={ -5 }
              key={ x }
              initiallyVisible={ true }>
              <span></span>
            </Animation>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;
