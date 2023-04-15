import React from 'react';

import { Stack, Typography } from '@mui/material';

import JustNewsHeader from '~/components/layout/JustNewsHeader';
import Page from '~/components/layout/Page';

export default function HomePage() {

  // const { getSummaries } = useSummaryClient();

  // const [summaries, setSummaries] = React.useState<PublicSummaryAttributes[]>([]);
  // const [totalCount, setTotalCount] = React.useState(0);

  // const load = React.useCallback(async () => {
  //   const { data: summaries, error } = await getSummaries();
  //   if (error || !summaries) {
  //     console.error(error);
  //     return;
  //   }
  //   setSummaries(summaries.rows);
  //   setTotalCount(summaries.count);
  // }, [getSummaries]);

  // React.useEffect(() => {
  //   load();
  // }, [load]);

  return (
    <Page center title="Read &lt; Less">
      <Stack spacing={ 2 }>
        <JustNewsHeader />
        <Typography variant="h6">Read Less is a news summarization service that helps you read more in less time</Typography>
        <Typography variant="h6">Download the app for iOS or Android</Typography>
        <Stack direction="row" spacing={ 2 }>
          <a
            href="https://apps.apple.com/us/app/read-less-news/id6447275859?itsct=apps_box_badge&amp;itscg=30200"
            target="_blank"
            style={ {
              borderRadius: 13, display: 'inline-block', height: 100, overflow: 'hidden', width: 340,
            } }
            rel="noreferrer">
            <img
              src="/apple-download-black.svg"
              alt="Download on the App Store"
              style={ {
                borderRadius: 13, height: 100, width: 340, 
              } } />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.readless"
            target="_blank"
            style={ {
              borderRadius: 13, display: 'inline-block', height: 100, overflow: 'hidden', width: 340,
            } }
            rel="noreferrer">
            <img
              src="/google-play-badge.png"
              alt="Get it on Google Play"
              style={ {
                borderRadius: 13, height: 100, width: 340, 
              } } />
          </a>
        </Stack>
      </Stack>
    </Page>
  );
}
