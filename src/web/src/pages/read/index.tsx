import React from 'react';

import { CircularProgress } from '@mui/material';
import Head from 'next/head';

import { PublicSummaryAttributes } from '~/api';
import Summary from '~/components/Summary';
import Page from '~/components/layout/Page';
import { useRouter, useSummaryClient } from '~/hooks';
import { SummaryUtils } from '~/utils';

export default function SummaryPage() {
  
  const { replace, searchParams } = useRouter();
  const { getSummary } = useSummaryClient();
  
  const [loading, setLoading] = React.useState(true);
  const [summary, setSummary] = React.useState<PublicSummaryAttributes | undefined>(undefined);
  const id = React.useMemo(() => parseInt(searchParams.get('s') ?? '-1'), [searchParams]);
  const initialFormat = React.useMemo(() => SummaryUtils.format(searchParams.get('f') ?? ''), [searchParams]);
  
  const load = React.useCallback(async () => {
    setLoading(true);
    const { data: summary, error } = await getSummary(id);
    if (error) {
      alert(error);
      return;
    } 
    if (summary) {
      setSummary(summary);
      document.title = summary.title;
    } else {
      replace('/404');
    }
    setLoading(false);
  }, [getSummary, id, replace]);

  React.useEffect(() => {
    load();
  }, [load]);
  
  return (
    <Page>
      <Head>
        <title>Read &apos; Less</title>
      </Head>
      {loading ? <CircularProgress variant="indeterminate" /> : summary && (
        <Summary 
          summary={ summary }
          initialFormat={ initialFormat } />
      )}
    </Page>
  );
}
