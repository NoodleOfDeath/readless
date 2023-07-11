import React from 'react';

import cn from 'classnames';

import styles from './Main.module.sass';

import Animation from '~/components/Animation';
import Image from '~/components/Image';
import Scroll from '~/components/Scroll';

type MainProps = {
    scrollToRef: any;
};

const Main = ({ scrollToRef }: MainProps) => (
  <div className={ styles.main }>
    <div className={ cn('container', styles.container) }>
      <div className={ styles.wrap }>
        <div className={ cn('hero', styles.title) }>Get Paradox</div>
        <div className={ cn('h4M', styles.info) }>
          The Real-time & powerful 3D&nbsp;design for web.
        </div>
        <div className={ styles.line }>
          <button className={ cn('button', styles.button) }>
            Download for Mac
          </button>
          <div className={ styles.note }>
            MacOS Big Sure (or higher)
          </div>
        </div>
      </div>
      <div className={ styles.preview }>
        <Image
          src="/images/download.png"
          width={ 1058 }
          height={ 793 }
          alt="Download" />
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
      <Scroll
        title="Choose other options"
        onScroll={ () =>
          scrollToRef.current.scrollIntoView({ behavior: 'smooth' }) } />
    </div>
  </div>
);

export default Main;
