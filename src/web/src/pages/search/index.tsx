import React from 'react';

import {
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';

import API, {
  InteractionResponse,
  ReadingFormat,
  SummaryResponse,
} from '@/api';
import Logo from '@/components/Logo';
import Summary from '@/components/Summary';
import Page from '@/components/layout/Page';
import LoginDialog from '@/components/login/LoginDialog';
import Filters from '@/components/search/Filters';
import { SessionContext } from '@/contexts';
import { useSummaryClient } from '@/hooks';
import { useRouter } from '@/next/router';

export default function SearchPage() {
  const { searchParams } = useRouter();
  const { recordSummaryView, interactWithSummary } = useSummaryClient();

  const { 
    searchText, 
    setSearchText,
    withHeaders,
  } = React.useContext(SessionContext);

  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [recentSummaries, setRecentSummaries] = React.useState<SummaryResponse[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [pageSize] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(1);

  const [expandedPost, setExpandedPost] = React.useState<number|undefined>();
  const [readingFormat, setReadingFormat] = React.useState<ReadingFormat|undefined>();

  const [showLoginDialog, setShowLoginDialog] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (searchParams.get('q')) {
      setSearchText(JSON.stringify(searchParams.get('q')) || '');
    }
  }, [searchParams, setSearchText]);

  React.useEffect(() => {
    setRecentSummaries([]);
    setPage(1);
    withHeaders(API
      .getSummaries)({
      filter: searchText,
      page: 0,
      pageSize,
    })
      .then((response) => {
        setTotalResults(response.data.count);
        setRecentSummaries(response.data.rows);
      })
      .catch((error) => {
        console.error(error);
        setTotalResults(0);
        setRecentSummaries([]);
      })
      .finally(() => {
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, withHeaders]);
  
  const setPostInteractions = (i: number, interactions: InteractionResponse) => {
    setRecentSummaries((prev) => {
      const newPosts = [...prev];
      newPosts[i].interactions = interactions;
      return (prev = newPosts);
    });
  };

  const expandPost = React.useCallback(async (index?: number, readingFormat?: ReadingFormat) => {
    if (index !== undefined && readingFormat) {
      try {
        await recordSummaryView(recentSummaries[index], undefined, { readingFormat }, (interactions) => setPostInteractions(index, interactions) );
      } catch (e) {
        console.error(e);
      }
    }
    setExpandedPost(readingFormat ? index : undefined);
    setReadingFormat(readingFormat);
  }, [recordSummaryView, recentSummaries]);

  const loadMore = React.useCallback(async () => {
    try {
      const { data } = await withHeaders(API
        .getSummaries)({
        filter: searchText,
        page,
        pageSize,
      });
      if (data) {
        setTotalResults(data.count);
        setRecentSummaries((prev) => [...prev, ...data.rows]);
        setPage((prev) => prev + 1);
      }
    } catch (e) {
      console.error(e);
    }
  }, [page, pageSize, searchText, withHeaders]);

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
                onInteract={ (type, content, metadata) => interactWithSummary(recentSummaries[i], type, content, metadata, (interactions) => setPostInteractions(i, interactions) ) } />
            )) : (
              <Summary
                summary={ recentSummaries[expandedPost] }
                onChange={ (newFormat) => expandPost(expandedPost, newFormat) }
                format={ readingFormat } 
                onInteract={ (type, content, metadata) => interactWithSummary(recentSummaries[expandedPost], type, content, metadata, (interactions) => setPostInteractions(expandedPost, interactions) ) } />
            )}
        </Stack>
        {loading && <CircularProgress size={ 10 } variant="indeterminate" />}
        {expandedPost === undefined && totalResults > pageSize * page && (
          <Button onClick={ () => loadMore() }>Load More</Button>
        )}
      </Stack>
      <LoginDialog defaultAction="logIn" message={ 'To prevent bad actors from compromising the integrity of our data and infrastrcture, please either log in, sign up, or download the mobile application to interact with posts' } open={ showLoginDialog } onClose={ () => setShowLoginDialog(false) } onSuccessfulLogin={ () => setShowLoginDialog(false) } />
    </Page>
  );
}
