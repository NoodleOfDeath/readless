import React from 'react';

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  SwipeableDrawer,
  TextField,
} from '@mui/material';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useMediaQuery } from 'react-responsive';

import {
  API,
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import Layout from '~/components/Layout';
import Summary from '~/components/Summary';
import { SessionContext } from '~/contexts';
import { useRouter, useSummaryClient } from '~/hooks';
import { readingFormat } from '~/utils';

type Props = {
  activeSummary?: PublicSummaryGroup;
  initialFormat?: ReadingFormat;
};

export default function AppPage({ 
  activeSummary: activeSummary0, 
  initialFormat: initialFormat0,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const { replace, searchParams } = useRouter();
  const isMobile = useMediaQuery({ query: '(max-width: 762px)' });
  const { getSummaries } = useSummaryClient();

  const { preferredReadingFormat } = React.useContext(SessionContext);
  
  const initialFormat = React.useMemo(() => initialFormat0 ?? readingFormat(searchParams.get('f') ?? preferredReadingFormat ?? ReadingFormat.Summary), [initialFormat0, preferredReadingFormat, searchParams]);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [summaries, setSummaries] = React.useState<PublicSummaryGroup[]>([]);
  const [activeSummary, setActiveSummary] = React.useState<PublicSummaryGroup | undefined>(activeSummary0);
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(Boolean(activeSummary0));

  const [pageSize] = React.useState<number>(10);
  const [offset, setOffset] = React.useState<number>(0);
  const [searchText, setSearchText] = React.useState<string>();

  React.useEffect(() => { 
    if (activeSummary) {
      setDrawerOpen(true);
    }
  }, [activeSummary]);

  const load = React.useCallback(async () => {
    try {
      const { data, error } = await getSummaries({
        filter: searchText,
        offset,
        pageSize,
      });
      if (error) {
        throw error;
      }
      if (data) {
        setTotalResults(data.count);
        setSummaries((prev) => 
          [
            ...prev,
            ...data.rows.filter((s) => !prev.some((p) => p.id === s.id)),
          ]);
        setOffset((prev) => data.next ?? prev + data.count);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getSummaries, searchText, offset, pageSize]);
  
  React.useEffect(() => {
    if (!activeSummary) {
      return;
    }
    setDrawerOpen(true);
  }, [activeSummary]);

  const onMount = React.useCallback(() => {
    setOffset(0);
    setTotalResults(0);
    setLoading(true);
    setSummaries([]);
    load();
  }, [load]);

  React.useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormatChange = React.useCallback(async (summary: PublicSummaryGroup, format: ReadingFormat = ReadingFormat.Summary) => {
    replace(`/read?s=${summary.id}&f=${format}`, undefined, { scroll: false, shallow: true });
    if (activeSummary) {
      return;
    }
    setActiveSummary(summary);
    setDrawerOpen(true);
  }, [replace, activeSummary]);

  return (
    <Layout>
      <Head>
        {activeSummary && (
          <React.Fragment>
            <title 
              key='title'>
              {activeSummary.title}
            </title>
            <meta 
              name="viewport"
              content="width=device-width, initial-scale=1.0" />
            <meta 
              key="og:image"
              property="og:image"
              content={ activeSummary.media?.imageArticle || activeSummary.media?.imageAi1 || activeSummary.imageUrl } />
            <meta 
              key="og:title"
              property="og:title"
              content={ activeSummary?.title.replace(/"/g, '&quot;') } />
            <meta 
              key="og:description"
              property="og:description"
              content={ activeSummary?.shortSummary?.replace(/"/g, '&quot;') } />
          </React.Fragment>
        )}
      </Head>
      <Stack spacing={ 2 }>
        <form onSubmit={ (e) => {
          e.preventDefault(); onMount(); 
        } }>
          <Stack spacing={ 1 }>
            <TextField
              value={ searchText } 
              onChange={ (e) => setSearchText(e.target.value) }
              label="Search" />
            <Button type="submit">Search</Button>
          </Stack>
        </form>
        <Stack spacing={ 2 }>
          {summaries.length > 0 &&
          summaries.map((summary) => (
            <Summary 
              key={ summary.id } 
              summary={ summary }
              onChange={ (format) => handleFormatChange(summary, format) } />
          ))}
        </Stack>
        {loading && <CircularProgress size={ 10 } variant="indeterminate" />}
        {totalResults > offset + pageSize && (
          <Button onClick={ () => load() }>Load More</Button>
        )}
      </Stack>
      <SwipeableDrawer 
        anchor={ isMobile ? 'bottom' : 'right' }
        open={ drawerOpen }
        onOpen={ () => setDrawerOpen(true) }
        onClose={ () => { 
          setDrawerOpen(false);
          setActiveSummary(undefined);
        } }>
        <Box sx={ { width: isMobile ? '100%' : 500 } }>
          <Stack spacing={ 2 } sx={ { p: 2 } }>
            {activeSummary && (
              <Summary
                big
                summary={ activeSummary }
                initialFormat={ initialFormat }
                onChange={ (format) => handleFormatChange(activeSummary, format) } />
            )}
          </Stack>
        </Box>
      </SwipeableDrawer>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, res }) => {
  const id = parseInt(query.s as string ?? '');
  const format = readingFormat(query.f as string ?? '');
  if (Number.isNaN(id)) {
    res.statusCode = 404;
    return { props: { query } };
  }
  try {
    const { data, error } = await API.getSummaries({ ids: [id] });
    if (error) {
      throw error;
    }
    if (data) {
      return { props: { activeSummary: data.rows[0], initialFormat: format } };
    }
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    return { props: { query } };
  }
  res.statusCode = 404;
  return { props: {} };
};