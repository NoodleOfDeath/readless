import React from 'react';

import JoinCommunity from '~/components/JoinCommunity';
import Layout from '~/components/Layout';
import Main from '~/templates/ContactUsPage/Main';

const ContactUsPage = () => {
  return (
    <Layout>
      <Main />
      <JoinCommunity />
    </Layout>
  );
};

export default ContactUsPage;
