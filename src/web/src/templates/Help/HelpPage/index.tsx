import React from 'react';

import HelpList from './HelpList';
import Main from './Main';

import Layout from '~/components/Layout';
import Subscription from '~/components/Subscription';

const BlogPage = () => {
  return (
    <Layout>
      <Main />
      <HelpList />
      <Subscription />
    </Layout>
  );
};

export default BlogPage;
