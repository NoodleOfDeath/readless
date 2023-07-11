import React from 'react';

import Layout from '~/components/Layout';
import Subscription from '~/components/Subscription';
import Downloads from '~/templates/DownloadPage/Downloads';
import Main from '~/templates/DownloadPage/Main';

const ContactUsPage = () => {
  const scrollToRef = React.useRef(null);

  return (
    <Layout>
      <Main scrollToRef={ scrollToRef } />
      <Downloads scrollToRef={ scrollToRef } />
      <Subscription />
    </Layout>
  );
};

export default ContactUsPage;
