import React from 'react';

import BlogList from './BlogList';

import JoinCommunity from '~/components/JoinCommunity';
import Layout from '~/components/Layout';

const BlogPage = () => {
  return (
    <Layout>
      <BlogList />
      <JoinCommunity />
    </Layout>
  );
};

export default BlogPage;
