import React from 'react';

import {
  Card,
  CardContent,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import { ScreenshotsCarousel } from '~/components';
import JustNewsHeader from '~/components/layout/JustNewsHeader';
import Page from '~/components/layout/Page';

const StyledPage = styled(Page)({ marginTop: 2778 * 0.15 });

export default function HomePage() {

  return (
    <React.Fragment>
      <ScreenshotsCarousel />
      <StyledPage center>
        <Stack spacing={ 2 }>
          <JustNewsHeader />
          <Typography variant="h6">Read Less is a news summarization service that helps you read more in less time</Typography>
          <Typography variant="h6">Download the app for iOS or Android</Typography>
          <Stack spacing={ 2 } alignItems="center">
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
              href="https://play.google.com/store/apps/details?id=ai.readless.ReadLess"
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
            <a
              href="/app"
              rel="noreferrer"
              style={ { textDecoration: 'none' } }>
              <Card
                style={ {
                  alignItems: 'center',
                  border: '1px solid #fff',
                  borderRadius: 13, 
                  display: 'flex', 
                  fontSize: '2rem',
                  height: 100, 
                  justifyContent: 'center',
                  width: 340,
                } }>
                <CardContent>Web App</CardContent>
              </Card>
            </a>
          </Stack>
        </Stack>
      </StyledPage>
    </React.Fragment>
  );
}
