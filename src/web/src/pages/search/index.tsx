import React from 'react';

import {
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';

import {
  InteractionResponse,
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
  const {
    getSummaries, recordSummaryView, interactWithSummary, 
  } = useSummaryClient();

  const { searchText } = React.useContext(AppStateContext);

  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [recentSummaries, setRecentSummaries] = React.useState<PublicSummaryAttributes[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [pageSize] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(1);

  const [expandedPost, setExpandedPost] = React.useState<number>();
  const [readingFormat, setReadingFormat] = React.useState<ReadingFormat>();

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
        setRecentSummaries((prev) => [...prev, ...data.rows.filter((s) => !prev.some((p) => p.id === s.id))]);
        setPage((prev) => prev + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchText, getSummaries]);

  React.useEffect(() => {
    setPage(0);
    setLoading(true);
    setRecentSummaries([]);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);
  
  const setPostInteractions = (i: number, interactions: InteractionResponse) => {
    setRecentSummaries((prev) => {
      const newPosts = [...prev];
      newPosts[i].interactions = interactions;
      return (prev = newPosts);
    });
  };

  const handleInteraction = React.useCallback(async (summary: PublicSummaryAttributes, type: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await interactWithSummary(summary, type, content, metadata );
    if (error) {
      console.error(error);
    }
    if (data) {
      setPostInteractions(recentSummaries.findIndex((s) => s.id === summary.id), data);
    }
  }, [interactWithSummary, recentSummaries]);

  const expandPost = React.useCallback(async (index?: number, readingFormat?: ReadingFormat) => {
    if (index !== undefined && readingFormat) {
      try {
        const { data, error } = await recordSummaryView(
          recentSummaries[index], 
          undefined,
          { readingFormat }
        );
        if (error) {
          console.error(error);
        }
        if (data) {
          setPostInteractions(index, data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    setExpandedPost(readingFormat ? index : undefined);
    setReadingFormat(readingFormat);
  }, [recordSummaryView, recentSummaries]);

  return (
    <Page center title="Read &lt; Less | Search">
      <Stack spacing={ 2 }>
        {expandedPost === undefined && (
          <React.Fragment>
            <Logo />
            <Filters />
            <Stack>
              {recentSummaries.length === 0 && (
                <Typography variant="h6">No results found</Typography>
              )}
              {searchText && searchText.trim().length > 0 && recentSummaries.length > 0 && (
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
          {expandedPost === undefined ? 
            recentSummaries.map((summary, i) => (
              <Summary 
                key={ summary.id } 
                summary={ summary }
                onChange={ (newFormat) => expandPost(i, newFormat) } 
                onInteract={ 
                  (type, content, metadata) => handleInteraction(summary, type, content, metadata) 
                } />
            )) : (
              <Summary
                summary={ recentSummaries[expandedPost] }
                onChange={ (newFormat) => expandPost(expandedPost, newFormat) }
                initialFormat={ readingFormat } 
                onInteract={ 
                  (type, content, metadata) => handleInteraction(recentSummaries[expandedPost], type, content, metadata) 
                } />
            )}
        </Stack>
        {loading && <CircularProgress size={ 10 } variant="indeterminate" />}
        {expandedPost === undefined && totalResults > pageSize * page && (
          <Button onClick={ () => load() }>Load More</Button>
        )}
      </Stack>
    </Page>
  );
}
