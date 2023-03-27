import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  Stack,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

import RoadMap from '@/components/about/RoadMap';
import Page from '@/components/layout/Page';
import text from '@/documents/about';

export default function AboutPage() {
  return (
    <Page title="About">
      <Card>
        <CardHeader title="About" />
        <CardContent>
          <Stack spacing={ 2 }>
            <ReactMarkdown>
              {text}
            </ReactMarkdown>
            <RoadMap />
          </Stack>
        </CardContent>
      </Card>
    </Page>
  );
}
