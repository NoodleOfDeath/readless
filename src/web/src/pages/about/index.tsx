import React from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  Stack,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';

import RoadMap from './RoadMap';

import Page from '@/components/layout/Page';

export default function AboutPage() {
  return (
    <Page title="About">
      <Card>
        <CardHeader title="About" />
        <CardContent>
          <Stack spacing={ 2 }>
            <ReactMarkdown>
              TheSkoop is an innovative web application that aims to provide
              users with a way to consume news and information quickly and
              easily, without compromising on quality. The current version of
              TheSkoop is in the prototype stage and can already take any news
              source via a URL and summarize it into multiple consumption
              lengths, depending on the user&apos;s preference. The service uses
              OpenAI&apos;s completion service and always credits and links back
              to the original news source. The ultimate goal of TheSkoop is to
              provide users with comprehensive information about a current event
              but without the need to essentially read more than they have time
              for.
            </ReactMarkdown>
            <RoadMap />
          </Stack>
        </CardContent>
      </Card>
    </Page>
  );
}
