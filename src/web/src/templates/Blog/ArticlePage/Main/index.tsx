import React from 'react';

import cn from 'classnames';

import styles from './Main.module.sass';

import Image from '~/components/Image';

const Main = () => (
  <div className={ cn('section-border-main', styles.main) }>
    <div className={ cn('container', styles.container) }>
      <div className={ styles.head }>
        <div className={ styles.category }>Product & features</div>
        <h1 className={ cn('h2', styles.title) }>
          What’s new in Paradox 2.0 Beta version
        </h1>
        <div className={ styles.avatar }>
          <Image
            src="/images/team/photo-8.jpg"
            layout="fill"
            objectFit="cover"
            alt="Avatar" />
        </div>
        <div className={ styles.author }>Brooklyn Simmons</div>
        <div className={ styles.position }>Maketer</div>
      </div>
      <div className={ styles.photo }>
        <Image
          src="/images/article-pic-1.jpg"
          width={ 1184 }
          height={ 680 }
          alt="Photo" />
      </div>
      <div className={ cn('content', styles.content) }>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit
          voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et
          quasi architecto beatae vitae dicta sunt explicabo. Nemo
          enim ipsam voluptatem quia voluptas sit aspernatur aut odit
          aut fugit, sed quia consequuntur magni dolores eos qui
          ratione voluptatem sequi nesciunt. Neque porro quisquam est,
          qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
          velit, sed quia non numquam eius modi tempora incidunt ut
          labore et dolore magnam aliquam quaerat voluptatem
        </p>
        <figure>
          <Image
            src="/images/article-pic-2.jpg"
            width={ 800 }
            height={ 500 }
            alt="Photo" />
        </figure>
        <h3>Headline here</h3>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit
          voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et
          quasi architecto beatae vitae dicta sunt explicabo. Nemo
          enim ipsam voluptatem quia voluptas sit aspernatur aut odit
          aut fugit, sed quia consequuntur magni dolores eos qui
          ratione voluptatem sequi nesciunt. Neque porro quisquam est,
          qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
          velit, sed quia non numquam eius modi tempora incidunt ut
          labore et dolore magnam aliquam quaerat voluptatem
        </p>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit
          voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et
          quasi architecto beatae vitae dicta sunt explicabo. Nemo
          enim ipsam voluptatem quia voluptas sit aspernatur
        </p>
        <figure>
          <Image
            src="/images/article-pic-3.jpg"
            width={ 800 }
            height={ 500 }
            alt="Photo" />
        </figure>
        <h3>Headline here</h3>
        <p>
          Sed ut perspiciatis unde omnis iste natus error sit
          voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et
          quasi architecto beatae vitae dicta sunt explicabo. Nemo
          enim ipsam voluptatem quia voluptas sit aspernatur aut odit
          aut fugit, sed quia consequuntur magni dolores eos qui
          ratione voluptatem sequi nesciunt. Neque porro quisquam est,
          qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
          velit, sed quia non numquam eius modi tempora incidunt ut
          labore et dolore magnam aliquam quaerat voluptatem
        </p>
        <ul>
          <li>
            Sed ut perspiciatis unde omnis iste natus error sit
            voluptatem.
          </li>
          <li>Voluptatem accusantium doloremque laudantium</li>
          <li>Sed ut perspiciatis unde omnis iste natus.</li>
          <li>Quasi architecto beatae vitae dicta.</li>
          <li>Voluptatem accusantium doloremque laudantium</li>
        </ul>
      </div>
    </div>
  </div>
);

export default Main;
