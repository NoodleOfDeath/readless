import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Page from '@/components/layout/Page';

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const message = React.useMemo(() => searchParams.get('msg'), [searchParams]);
  const timeout = React.useMemo(() => Number(searchParams.get('t') || 0), [searchParams]);
  const redirect = React.useMemo(() => searchParams.get('r'), [searchParams]);
  
  React.useEffect(() => {
    if (redirect) {
      setTimeout(() => navigate(redirect), timeout);
    }
  }, [redirect, timeout]);
  
  return (
    <Page title="Yay!">
      {message}
    </Page>
  )
} 