import React from 'react';

import Layout from '~/components/Layout';
import { useSummaryClient } from '~/core';
import { useRouter } from '~/hooks';

export default function VerifyPage() {

  const { verify } = useSummaryClient();
  const { searchParams } = useRouter();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [message, setMessage] = React.useState('');

  const validateToken = React.useCallback(async () => {
    try {
      const code = searchParams.get('code');
      if (!code) {
        setMessage('Error, no code or channel provided.');
        setLoading(false);
        return;
      }
      const { error } = await verify({ verificationCode: code });
      if (error) {
        throw error;
      }
      setMessage('Success! You are now subscribed!');
    } catch (e) {
      setMessage('Error, invalid code.');
    } finally {
      setLoading(false);
    }
  }, [searchParams, verify]);

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <Layout>
      <div>
        {loading && <div>Verifying...</div>}
        {!loading && <div>{message}</div>}
      </div>
    </Layout>
  );
}