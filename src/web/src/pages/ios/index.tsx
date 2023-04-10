import React from 'react';

import Page from '~/components/layout/Page';
import { useRouter } from '~/hooks';

export default function IosRedirect() {
  const router = useRouter();

  React.useEffect(() => {
    router.push('https://apps.apple.com/us/app/read-less-news/id6447275859');
  }, [router]);
  return (
    <Page>
      Redirecting to the iOS app...
    </Page>
  );
}