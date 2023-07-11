import React from 'react';

import Faq from './Faq';
import Main from './Main';
import Plugins from './Plugins';

import JoinCommunity from '~/components/JoinCommunity';
import Layout from '~/components/Layout';

const PricingPage = () => {
  return (
    <Layout>
      <Main />
      <Plugins />
      <Faq />
      <JoinCommunity />
    </Layout>
  );
};

export default PricingPage;
