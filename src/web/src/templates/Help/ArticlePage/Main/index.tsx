import React from 'react';

import cn from 'classnames';
import { Element, Link } from 'react-scroll';

import styles from './Main.module.sass';

import Breadcrumbs from '~/components/Breadcrumbs';
import Image from '~/components/Image';

const breadcrumbs = [
  {
    title: 'Home',
    url: '/',
  },
  { title: 'Getting started' },
];

const links = [
  {
    anchor: 'download',
    offset: -176,
    title: 'Download',
  },
  {
    anchor: 'select-your-os',
    offset: -120,
    title: 'Select your OS',
  },
  {
    anchor: 'installation',
    offset: -120,
    title: 'Installation',
  },
];

const Main = () => (
  <div className={ cn('section-main', styles.main) }>
    <div className={ cn('container', styles.container) }>
      <div className={ styles.wrap }>
        <Element className={ styles.section } name="download">
          <div className={ styles.head }>
            <Breadcrumbs items={ breadcrumbs } />
            <h1 className={ cn('h2', styles.title) }>
              How to install Paradox
            </h1>
            <div className={ cn('h5M', styles.info) }>
              Learn and level up
            </div>
          </div>
          <div className={ cn('content', styles.content) }>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit
              voluptatem accusantium doloremque laudantium, totam
              rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta
              sunt explicabo. Nemo enim ipsam voluptatem quia
              voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Neque porro quisquam est,
              qui dolorem ipsum quia dolor sit amet, consectetur,
              adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore et dolore magnam aliquam
              quaerat voluptatem
            </p>
            <figure>
              <Image
                src="/images/article-pic-4.jpg"
                width={ 800 }
                height={ 600 }
                alt="Photo" />
            </figure>
          </div>
        </Element>
        <Element className={ styles.section } name="select-your-os">
          <div className={ cn('content', styles.content) }>
            <h3>Select your OS</h3>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit
              voluptatem accusantium doloremque laudantium, totam
              rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta
              sunt explicabo. Nemo enim ipsam voluptatem quia
              voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Neque porro quisquam est,
              qui dolorem ipsum quia dolor sit amet, consectetur,
              adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore et dolore magnam aliquam
              quaerat voluptatem
            </p>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit
              voluptatem accusantium doloremque laudantium, totam
              rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta
              sunt explicabo. Nemo enim ipsam voluptatem quia
              voluptas sit aspernatur
            </p>
            <figure>
              <Image
                src="/images/article-pic-5.jpg"
                width={ 800 }
                height={ 578 }
                alt="Photo" />
            </figure>
          </div>
        </Element>
        <Element className={ styles.section } name="installation">
          <div className={ cn('content', styles.content) }>
            <h3>Installation</h3>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit
              voluptatem accusantium doloremque laudantium, totam
              rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta
              sunt explicabo. Nemo enim ipsam voluptatem quia
              voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Neque porro quisquam est,
              qui dolorem ipsum quia dolor sit amet, consectetur,
              adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore et dolore magnam aliquam
              quaerat voluptatem
            </p>
            <ul>
              <li>
                Sed ut perspiciatis unde omnis iste natus error
                sit voluptatem.
              </li>
              <li>
                Voluptatem accusantium doloremque laudantium
              </li>
              <li>Sed ut perspiciatis unde omnis iste natus.</li>
              <li>Quasi architecto beatae vitae dicta.</li>
              <li>
                Voluptatem accusantium doloremque laudantium
              </li>
            </ul>
          </div>
        </Element>
      </div>
      <div className={ styles.menu }>
        {links.map((link, index) => (
          <Link
            className={ styles.link }
            activeClass={ styles.active }
            to={ link.anchor }
            offset={ link.offset }
            spy
            smooth
            key={ index }>
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default Main;
