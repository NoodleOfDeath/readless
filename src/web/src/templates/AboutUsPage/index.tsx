import React from 'react';

import JoinCommunity from '~/components/JoinCommunity';
import Layout from '~/components/Layout';
import Main from '~/templates/AboutUsPage/Main';
import Photo from '~/templates/AboutUsPage/Photo';
import Team from '~/templates/AboutUsPage/Team';

const AboutUsPage = () => {
  return (
    <Layout layoutNoOverflow>
      <Main />
      <Photo />
      <Team />
      <JoinCommunity />
    </Layout>
  );
};

export default AboutUsPage;
