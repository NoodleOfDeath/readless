import React from 'react';

import cn from 'classnames';

import styles from './Footer.module.sass';
import Item from './Item';

import Logo from '~/components/Logo';
import { footerNavigation } from '~/constants/navigation';

const Footer = () => {
  return (
    <footer className={ styles.footer }>
      <div className={ styles.body }>
        <div className={ cn('container', styles.container) }>
          <div className={ styles.group }>
            {footerNavigation.map((item: any, index: number) => (
              <Item
                className={ styles.item }
                item={ item }
                key={ index } />
            ))}
          </div>
          <div className={ styles.details }>
            <Logo
              className={ styles.logo }
              titleClassName={ styles.titleLogo }
              title
              compact />
            <div className={ styles.info }>
              News without the noise
            </div>
          </div>
        </div>
      </div>
      <div className={ styles.bottom }>
        <div className={ cn('container', styles.container) }>
          <div className={ styles.copyright }>
            &copy; 
            {' '}
            {new Date().getFullYear()}
            {' '}
            Read Less LLC
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
