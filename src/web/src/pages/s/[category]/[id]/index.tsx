import React from 'react';

import { CircularProgress } from '@mui/material';

import { PublicSummaryAttributes } from '~/api';
import Summary from '~/components/Summary';
import Page from '~/components/layout/Page';
import { useRouter, useSummaryClient } from '~/hooks';

export default function SummaryPage() {
  
  const { replace, searchParams } = useRouter();
  const { getSummaries } = useSummaryClient();
  
  const [loading, setLoading] = React.useState(true);
  const [summary, setSummary] = React.useState<PublicSummaryAttributes | undefined>(undefined);
  const category = React.useMemo(() => searchParams.get('category'), [searchParams]);
  const id = React.useMemo(() => parseInt(searchParams.get('id') ?? '-1'), [searchParams]);
  
  const load = React.useCallback(async () => {
    setLoading(true);
    const { data, error } = await getSummaries(undefined, [id]);
    if (error) {
      replace('/404');
      return;
    } 
    if (data) {
      const summary = data.rows.find((s) => s.id === id);
      if (summary) {
        if (summary.category !== category) {
          replace(`/s/${summary.category}/${id}`);
          return;
        }
        setSummary(summary);
      }
    }
    setLoading(false);
  }, [category, getSummaries, id, replace]);

  React.useEffect(() => {
    load();
  }, [load]);
  
  return (
    <Page>
      {loading ? <CircularProgress variant="indeterminate" /> : summary && <Summary summary={ summary } /> }
    </Page>
  );
}