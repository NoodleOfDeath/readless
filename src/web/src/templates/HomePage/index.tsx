import React from 'react';

import Design from './Design';
import Details from './Details';
import Discover from './Discover';
import Generation from './Generation';
import Integration from './Integration';
import Main from './Main';
import Reviews from './Reviews';
import Website from './Website';

import JoinCommunity from '~/components/JoinCommunity';
import Layout from '~/components/Layout';

const HomePage = () => {
  const scrollToRef = React.useRef(null);
  const downloadRef = React.useRef(null);

  return (
    <Layout>
      <Main 
        scrollToRef={ scrollToRef } 
        downloadRef={ downloadRef } />
      <Generation scrollToRef={ scrollToRef } />
      <Website />
      <Integration />
      {/* <Details /> */}
      {/* <Discover /> */}
      <Reviews />
      {/* <Design /> */}
      <JoinCommunity downloadRef={ downloadRef } />
    </Layout>
  );
};

export default HomePage;
