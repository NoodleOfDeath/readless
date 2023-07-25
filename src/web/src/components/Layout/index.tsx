import React from 'react';

import cn from 'classnames';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { clearQueueScrollLocks, enablePageScroll } from 'scroll-lock';

import styles from './Layout.module.sass';

import Footer from '~/components/Footer';
import Header from '~/components/Header';

type LayoutProps = {
  layoutNoOverflow?: boolean;
  children: React.ReactNode;
  footerHide?: boolean;
};

const Layout = ({
  layoutNoOverflow, children, footerHide, 
}: LayoutProps) => {
  const { pathname } = useRouter();

  React.useEffect(() => {
    clearQueueScrollLocks();
    enablePageScroll();
  }, [pathname]);

  return (
    <React.Fragment>
      <Head>
        <title>Read Less – News without the noise</title>
      </Head>
      <div className={ cn(styles.layout, { [styles.layoutNoOverflow]: layoutNoOverflow }) }>
        <Header />
        <div className={ cn('main', styles.main) }>
          {children}
        </div>
        {!footerHide && <Footer />}
      </div>
    </React.Fragment>
  );
};

export default Layout;
