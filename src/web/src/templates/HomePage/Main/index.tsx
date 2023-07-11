import React from 'react';

import cn from 'classnames';
import Link from 'next/link';

import styles from './Main.module.sass';

import { Screenshot } from '~/components';
import Animation from '~/components/Animation';
import Image from '~/components/Image';
import Scroll from '~/components/Scroll';

type MainProps = {
  scrollToRef: any;
  downloadRef: any;
};

const Main = ({ scrollToRef, downloadRef }: MainProps) => (
  <div className={ cn('section', styles.main) }>
    <div className={ cn('container', styles.container) }>
      <div className={ styles.wrap }>
        <h1 className={ cn('hero', styles.title) }>Read Less</h1>
        <div className={ cn('h4M', styles.info) }>
          News without the noise
        </div>
        <div className={ styles.btns }>
          <div
            className={ cn('button', styles.button) }
            onClick={ () => downloadRef.current.scrollIntoView({ behavior: 'smooth' }) }>
            Download now
          </div>
        </div>
      </div>
      <div className={ styles.preview }>
        <section>
          <h2 className={ cn('h2', styles.title) }>
            Using AI to cut through the bullsh&#128169;t
          </h2>
          <div className={ cn('h5M', styles.info) }>
            Read Less uses large language models to reduce bias and clickbait in the news while still preserving the original facts.
          </div>
        </section>
        <div className={ styles.image }>
          <Image
            src="/images/main.png"
            width={ 320 }
            height={ 540 }
            alt="Hero" />
        </div>
        <div className={ styles.ball }></div>
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
        title="Scroll down"
        onScroll={ () =>
          scrollToRef.current.scrollIntoView({ behavior: 'smooth' }) } />
    </div>
  </div>
);

export default Main;
