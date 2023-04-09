import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import { StatusAttributes } from '~/api';
import Page from '~/components/layout/Page';
import { useStatusClient } from '~/hooks';

export default function StatusPage() {
  const { getStatuses } = useStatusClient();
  const [statuses, setStatuses] = React.useState<StatusAttributes[]>([]);

  const load = React.useCallback(async() => {
    const { data } = await getStatuses();
    if (data) {
      setStatuses(data.rows);
    }
  }, [getStatuses]);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <Page title="Status">
      {statuses.map((status) => (
        <Card key={ status.name }>
          <CardHeader title={ status.name } />
          <CardContent>
            <ReactMarkdown>{status.description}</ReactMarkdown>
          </CardContent>
        </Card>
      ))}
    </Page>
  );
}