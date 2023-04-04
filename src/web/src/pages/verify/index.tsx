import React from 'react';

import Page from '~/components/layout/Page';
import { useLoginClient, useRouter } from '~/hooks';

export default function VerifyPage() {

  const { push, searchParams } = useRouter();
  const { verifyAlias, verifyOtp } = useLoginClient();

  const handleVerifiction = React.useCallback(async () => {
    const verificationCode = searchParams.get('vc');
    if (verificationCode) {
      const { error } = await verifyAlias({ verificationCode });
      if (error && error.name) {
        return push(`/error?error=${JSON.stringify(error)}`);
      }
      return push(`/success?${new URLSearchParams({
        msg: 'Your email has been successfully verfied. Redirecting you to the login in page...',
        r: '/login',
        t: '5000',
      }).toString()}`);
    }
    const otp = searchParams.get('otp');
    if (otp) {
      const { error } = await verifyOtp({ otp });
      if (error && error.name) {
        return push(`/error?error=${JSON.stringify(error)}`);
      }
      return push('/reset-password');
    }
    return push('/error');
  }, [push, searchParams, verifyAlias, verifyOtp]);

  React.useEffect(() => {
    handleVerifiction();
  }, [handleVerifiction]);
  
  return (
    <Page title='Carefully mulling over your web request...'>
      I am deciding if I should destroy the world or not...
    </Page>
  );
}