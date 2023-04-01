import React from 'react';

import { Stack } from '@mui/material';

import { InteractionResponse, SummaryResponse } from '@/api';
import Summary from '@/components/Summary';
import JustNewsHeader from '@/components/layout/JustNewsHeader';
import Page from '@/components/layout/Page';
import LoginDialog from '@/components/login/LoginDialog';
import { useSummaryClient } from '@/hooks';

export default function SearchPage() {
  const { interactWithSummary } = useSummaryClient();

  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [currentSummary, setCurrentSummary] = React.useState<SummaryResponse | undefined>(undefined);

  const updateInteractions = (interactions: InteractionResponse) => {
    setCurrentSummary((prev) => {
      if (!prev) {
        return (prev = undefined);
      }
      const newSummary = { ...prev };
      newSummary.interactions = interactions;
      return (prev = newSummary);
    });
  };

  return (
    <Page center title="Read &lt; Less">
      <Stack>
        <JustNewsHeader />
        {currentSummary && (
          <Summary
            summary={ currentSummary }
            onInteract={ (type, content, metadata) => interactWithSummary(currentSummary, type, content, metadata, (interactions) => updateInteractions(interactions)) } />
        )}
      </Stack>
      <LoginDialog defaultAction="logIn" message={ 'To prevent bad actors from compromising the integrity of our data and infrastrcture, please either log in, sign up, or download the mobile application to interact with posts' } open={ showLoginDialog } onClose={ () => setShowLoginDialog(false) } onSuccessfulLogin={ () => setShowLoginDialog(false) } />
    </Page>
  );
}
