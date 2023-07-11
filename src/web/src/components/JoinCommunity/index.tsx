import React from 'react';

import cn from 'classnames';
import Link from 'next/link';

import styles from './JoinCommunity.module.sass';

import Animation from '~/components/Animation';
import Image from '~/components/Image';
import { avatars, images } from '~/constants/joinCommunity';

const JoinCommunity = ({ downloadRef }: {downloadRef?: any} = {}) => (
  <div className={ styles.join }>
    <div className={ styles.anchor } ref={ downloadRef } id="download" />
    <div className={ cn('container', styles.container) }>
      <div className={ styles.wrap }>
        <div className={ cn('h1', styles.title) }>
          A you ready to Read Less?
        </div>
        <div className={ cn('h4M', styles.info) }>
          Join thousands of readers and become part of the Read Less community
        </div>
        <div className={ styles.avatars }>
          {avatars.map((avatar, index) => (
            <div className={ styles.avatar } key={ index }>
              <Image
                src={ avatar }
                layout="fill"
                alt="Avatar"
                priority />
            </div>
          ))}
        </div>
        <div className={ styles.btns }>
          <Link
            href="https://apps.apple.com/us/app/read-less-news/id6447275859"
            target="_blank"
            rel="noreferrer">
            <Image
              src="/apple-download-black.svg"
              width={ 360 }
              height={ 106 }
              alt="App Store Badge" />
          </Link>
          <Link
            href="https://play.google.com/store/apps/details?id=ai.readless.ReadLess"
            target="_blank"
            rel="noreferrer">
            <Image
              src="/google-play-badge.svg"
              width={ 360 }
              height={ 106 }
              alt="Play Store Badge" />
          </Link>
        </div>
      </div>
      <div className={ styles.images }>
        {images.map((image, index) => (
          <Animation
            className={ styles.image }
            animateIn="fadeIn"
            key={ index }
            speed={ index < 4 ? -5 : 0 }>
            <Image
              src={ image.src }
              width={ image.width }
              height={ image.height }
              alt={ image.alt } />
          </Animation>
        ))}
      </div>
    </div>
  </div>
);

export default JoinCommunity;
