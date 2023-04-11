import React from 'react';

import Page from '~/components/layout/Page';

export default function IosDownload() {
  React.useEffect(() => {
    window.open('https://apps.apple.com/us/app/read-less-news/id6447275859');
  }, []);
  return (
    <Page>
      Redirecting to the Apple App Store
    </Page>
  );
}