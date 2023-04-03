import React from 'react';

import Page from '~/components/layout/Page';
import { useRouter } from '~/next/router';

export default function SuccessPage() {
  const router = useRouter();
  const { searchParams } = router;
  
  const message = React.useMemo(() => searchParams.get('msg'), [searchParams]);
  const timeout = React.useMemo(() => Number(searchParams.get('t') || 0), [searchParams]);
  const redirect = React.useMemo(() => searchParams.get('r'), [searchParams]);
  
  React.useEffect(() => {
    if (redirect) {
      setTimeout(() => router.push(redirect), timeout);
    }
  }, [router, redirect, timeout]);
  
  return (
    <Page title="Yay!">
      {message}
    </Page>
  );
} 