import React from 'react';

import {
  Button,
  CircularProgress,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import LoginDialog from '../components/login/LoginDialog';

import API, {
  InteractionResponse,
  InteractionType,
  SummaryResponse,
} from '@/api';
import FancyScroll, { FadeAndShrink } from '@/components/FancyScroll';
import Summary, { ConsumptionMode } from '@/components/Summary';
import Page from '@/components/layout/Page';
import Filters from '@/components/search/Filters';
import { SessionContext } from '@/contexts';
import { useRouter } from '@/next/router';

const StyledFancyScroll = styled(FancyScroll)(() => ({
  '& > div': {
    transition: 'width 0.1s, opacity 0.1s',
    width: '100%',
  },
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: 'calc(100vh - 320px)',
  overflow: 'auto',
  width: '100%',
}));

const StyledSummary = styled(Summary)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export default function SearchPage() {
  const { searchParams } = useRouter();

  const { 
    searchText, 
    setSearchText,
    userData,
    withHeaders,
  } = React.useContext(SessionContext);

  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [recentSummaries, setRecentSummaries] = React.useState<SummaryResponse[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [pageSize] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(1);

  const [expandedPost, setExpandedPost] = React.useState<number|undefined>();
  const [consumptionMode, setConsumptionMode] = React.useState<ConsumptionMode|undefined>();

  const [showDialog, setShowDialog] = React.useState<boolean>(false);

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

  const recordSummaryView = React.useCallback(async (index: number, content?: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await withHeaders(API.recordSummaryView)(recentSummaries[index].id, { content, metadata });
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setPostInteractions(index, data);
    }
  }, [recentSummaries, withHeaders]);
  
  const interactWithSummary = React.useCallback(
    async (index: number, type: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
      if (!userData?.isLoggedIn) {
        setShowDialog(true);
        return;
      }
      try {
        const { data, error } = await withHeaders(API.interactWithSummary)(recentSummaries[index].id, type, {
          content, metadata, userId: userData.userId,
        });
        if (error) {
          console.error(error);
          return;
        }
        if (data) {
          setPostInteractions(index, data);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [recentSummaries, userData, withHeaders]
  );

  const expandPost = React.useCallback(async (index?: number, mode?: ConsumptionMode) => {
    if (index !== undefined && mode) {
      try {
        await recordSummaryView(index, undefined, { consumptionMode: mode });
      } catch (e) {
        console.error(e);
      }
    }
    setExpandedPost(mode ? index : undefined);
    setConsumptionMode(mode);
  }, [recordSummaryView]);

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
    <Page center>
      <Stack spacing={ 2 }>
        {expandedPost === undefined && (
          <React.Fragment>
            <Typography variant="h4">News that fits your schedule</Typography>
            <Filters />
            <Stack>
              {recentSummaries.length === 0 && (
                <Typography variant="h6">No results found</Typography>
              )}
              {recentSummaries.length > 0 && (
                <Typography variant="h6">
                  {totalResults}
                  {' '}
                  results found
                </Typography>
              )}
            </Stack>
          </React.Fragment>
        )}
        <StyledFancyScroll transform={ FadeAndShrink() }>
          {expandedPost === undefined ? 
            recentSummaries.map((summary, i) => (
              <StyledSummary 
                key={ summary.id } 
                summary={ summary }
                onChange={ (mode) => expandPost(i, mode) } 
                onInteract={ (type, content, metadata) => interactWithSummary(i, type, content, metadata) } />
            )) : (
              <StyledSummary
                summary={ recentSummaries[expandedPost] }
                onChange={ (mode) => expandPost(expandedPost, mode) }
                consumptionMode={ consumptionMode } 
                onInteract={ (type, content, metadata) => interactWithSummary(expandedPost, type, content, metadata) } />
            )}
        </StyledFancyScroll>
        {loading && <CircularProgress size={ 10 } variant="indeterminate" />}
        {expandedPost === undefined && totalResults > pageSize * page && (
          <Button onClick={ () => loadMore() }>Load More</Button>
        )}
      </Stack>
      <LoginDialog defaultAction="logIn" message={ 'To prevent bad actors from compromising the integrity of our data and infrastrcture, please either log in, sign up, or download the mobile application to interact with posts' } open={ showDialog } onClose={ () => setShowDialog(false) } />
    </Page>
  );
}
