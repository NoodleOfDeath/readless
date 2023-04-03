import React from 'react';

import { Stack } from '@mui/material';

import { InteractionResponse, SummaryResponse } from '~/api';
import Summary from '~/components/Summary';
import JustNewsHeader from '~/components/layout/JustNewsHeader';
import Page from '~/components/layout/Page';
import { SessionContext } from '~/contexts';
import { useSummaryClient } from '~/hooks';
import { useRouter } from '~/next/router';

export default function SearchPage() {
  const { interactWithSummary } = useSummaryClient();
  const { setShowLoginDialog } = React.useContext(SessionContext);

  const router = useRouter();

  React.useEffect(() => {
    router.push('/search');
  }, [router]);

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
    </Page>
  );
}
