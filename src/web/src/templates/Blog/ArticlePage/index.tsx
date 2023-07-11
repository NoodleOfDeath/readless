import React from 'react';

import BlogList from './BlogList';
import Main from './Main';

import JoinCommunity from '~/components/JoinCommunity';
import Layout from '~/components/Layout';

const ArticlePage = () => {
  return (
    <Layout>
      <Main />
      <BlogList />
      <JoinCommunity />
    </Layout>
  );
};

export default ArticlePage;
