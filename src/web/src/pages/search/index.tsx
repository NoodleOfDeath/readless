import React from 'react';

import {
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import Logo from '~/components/Logo';
import Summary from '~/components/Summary';
import Page from '~/components/layout/Page';
import Filters from '~/components/search/Filters';
import { AppStateContext } from '~/contexts';
import { useSummaryClient } from '~/hooks';

export default function SearchPage() {
  const { getSummaries, handleInteraction } = useSummaryClient();

  const { searchText } = React.useContext(AppStateContext);

  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [summaries, setSummaries] = React.useState<PublicSummaryAttributes[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [pageSize] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(1);

  const [expandedSummary, setExpandedSummary] = React.useState<number>();
  const [format, setFormat] = React.useState<ReadingFormat>();

  const load = React.useCallback(async () => {
    try {
      const { data } = await getSummaries(
        searchText,
        undefined,
        page,
        pageSize
      );
      if (data) {
        setTotalResults(data.count);
        setSummaries((prev) => [...prev, ...data.rows.filter((s) => !prev.some((p) => p.id === s.id))]);
        setPage((prev) => prev + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getSummaries, searchText, page, pageSize, setTotalResults, setPage, setLoading]);

  React.useEffect(() => {
    setPage(0);
    setLoading(true);
    setSummaries([]);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  const handleFormatChange = React.useCallback(async (index: number, format?: ReadingFormat) => {
    const { data, error } = await handleInteraction(summaries[index], InteractionType.View, undefined, { format } );
    if (error) {
      console.error(error);
    }
    if (data) {
      setSummaries((prev) => {
        const newSummaries = [...prev];
        newSummaries[index] = { ...newSummaries[index], interactions: data };
        return (prev = newSummaries);
      });
    }
    setExpandedSummary(format ? index : expandedSummary);
    setFormat(format);
  }, [expandedSummary, handleInteraction, summaries]);

  return (
    <Page center title="Read &lt; Less | Search">
      <Stack spacing={ 2 }>
        {format === expandedSummary && (
          <React.Fragment>
            <Logo />
            <Filters />
            <Stack>
              {summaries.length === 0 && (
                <Typography variant="h6">No results found</Typography>
              )}
              {searchText && searchText.trim().length > 0 && summaries.length > 0 && (
                <Typography variant="h6">
                  {totalResults}
                  {' '}
                  results found
                </Typography>
              )}
            </Stack>
          </React.Fragment>
        )}
        <Stack spacing={ 2 }>
          {expandedSummary === undefined ? 
            summaries.map((summary, i) => (
              <Summary 
                key={ summary.id } 
                summary={ summary }
                onChange={ (format) => handleFormatChange(i, format) } 
                onInteract={ 
                  (...args) => handleInteraction(summary, ...args) 
                } />
            )) : (
              <Summary
                summary={ summaries[expandedSummary] }
                onChange={ (format) => handleFormatChange(expandedSummary, format) }
                initialFormat={ format } 
                onInteract={ 
                  (...args) => handleInteraction(summaries[expandedSummary], ...args) 
                } />
            )}
        </Stack>
        {loading && <CircularProgress size={ 10 } variant="indeterminate" />}
        {format === expandedSummary && totalResults > pageSize * page && (
          <Button onClick={ () => load() }>Load More</Button>
        )}
      </Stack>
    </Page>
  );
}
