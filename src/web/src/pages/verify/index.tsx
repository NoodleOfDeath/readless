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
      const token = searchParams.get('t');
      if (!token) {
        setMessage('Error, no token provided.');
        setLoading(false);
        return;
      }
      const { error } = await verify({ verifiedToken: token });
      if (error) {
        throw error;
      }
      setMessage('Success! You may now login.');
    } catch (e) {
      setMessage('Error, invalid token.');
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