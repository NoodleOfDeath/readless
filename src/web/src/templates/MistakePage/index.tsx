import React from 'react';

import cn from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './MistakePage.module.sass';

import Icon from '~/components/Icon';
import Image from '~/components/Image';
import Layout from '~/components/Layout';
import { socials } from '~/constants/socials';

const AboutUsPage = () => {
  const router = useRouter();

  return (
    <Layout footerHide>
      <div className={ styles.mistake }>
        <div className={ cn('container', styles.container) }>
          <div className={ styles.wrap }>
            <div className={ cn('h1', styles.title) }>
              Whoops, that page is gone.
            </div>
            <div className={ cn('h5M', styles.info) }>
              Something went wrong.
            </div>
            <div className={ styles.btns }>
              <Link href="/contact" className={ cn('button', styles.button) }>
                Contact us
              </Link>
              <button
                className={ cn('button-white', styles.button) }
                onClick={ () => router.back() }>
                Get back
              </button>
            </div>
            <div className={ styles.foot }>
              <div className={ styles.note }>Follow us</div>
              <div className={ styles.socials }>
                {socials.map((social, index) => (
                  <a
                    className={ styles.social }
                    href={ social.href }
                    target="_blank"
                    rel="noreferrer"
                    key={ index }>
                    <Icon name={ social.icon } />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className={ styles.preview }>
            <Image
              src="/images/404.jpg"
              width={ 1050 }
              height={ 797 }
              alt="404" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUsPage;
