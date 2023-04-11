import React from 'react';

import Page from '~/components/layout/Page';

export default function AndroidDownloadPage() {
  React.useEffect(() => {
    window.open('https://play.google.com/store/apps/details?id=com.readless');
  }, []);
  return (
    <Page>
      Redirecting to the Google Play Store
    </Page>
  );
}