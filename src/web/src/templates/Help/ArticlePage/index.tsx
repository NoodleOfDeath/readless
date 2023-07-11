import React from 'react';

import Main from './Main';

import Layout from '~/components/Layout';
import Subscription from '~/components/Subscription';

const ArticlePage = () => {
  return (
    <Layout layoutNoOverflow>
      <Main />
      <Subscription />
    </Layout>
  );
};

export default ArticlePage;
