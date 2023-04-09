import React from 'react';

import { Stack } from '@mui/material';

import {
  InteractionResponse,
  InteractionType,
  PublicSummaryAttributes,
} from '~/api';
import Summary from '~/components/Summary';
import JustNewsHeader from '~/components/layout/JustNewsHeader';
import Page from '~/components/layout/Page';
import { AppStateContext } from '~/contexts';
import { useRouter, useSummaryClient } from '~/hooks';

export default function SearchPage() {
  const { interactWithSummary } = useSummaryClient();
  const { setShowLoginDialog } = React.useContext(AppStateContext);

  const router = useRouter();

  React.useEffect(() => {
    router.push('/search');
  }, [router]);

  const [currentSummary, setCurrentSummary] = React.useState<PublicSummaryAttributes>();

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

  const handleInteraction = React.useCallback(async (summary: PublicSummaryAttributes, type: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await interactWithSummary(summary, type, content, metadata);
    if (error && error.name === 'NOT_LOGGED_IN') {
      setShowLoginDialog(true);
      return;
    }
    if (data) {
      updateInteractions(data);
    }
  }, [interactWithSummary, setShowLoginDialog]);

  return (
    <Page center title="Read &lt; Less">
      <Stack>
        <JustNewsHeader />
        {currentSummary && (
          <Summary
            summary={ currentSummary }
            onInteract={ (...args) => handleInteraction(currentSummary, ...args) } />
        )}
      </Stack>
    </Page>
  );
}
