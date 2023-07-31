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
  rootSummary?: PublicSummaryGroup;
  initialFormat?: ReadingFormat;
};

export default function AppPage({ 
  rootSummary, 
  initialFormat: initialFormat0,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const { replace, searchParams } = useRouter();
  const isMobile = useMediaQuery({ query: '(max-width: 762px)' });
  const { getSummaries } = useSummaryClient();

  const { preferredReadingFormat } = React.useContext(SessionContext);
  
  const initialFormat = React.useMemo(() => readingFormat(searchParams.get('f') ?? initialFormat0 ?? preferredReadingFormat ?? ReadingFormat.Summary), [initialFormat0, preferredReadingFormat, searchParams]);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [summaries, setSummaries] = React.useState<PublicSummaryGroup[]>([]);
  const [activeSummary, setActiveSummary] = React.useState<PublicSummaryGroup>();
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

  const [pageSize] = React.useState<number>(10);
  const [offset, setOffset] = React.useState<number>(0);
  const [searchText, setSearchText] = React.useState<string>();

  React.useEffect(() => { 
    setDrawerOpen(Boolean(activeSummary));
    if (!activeSummary) {
      replace(rootSummary ? `/read?s=${rootSummary.id}&f=${initialFormat0}` : '/read', undefined, { scroll: false, shallow: true });
    }
  }, [activeSummary, replace, rootSummary, initialFormat0]);

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
            ...data.rows.filter((s) => !prev.some((p) => p.id === s.id || p.id === rootSummary?.id)),
          ]);
        setOffset((prev) => data.next ?? prev + data.count);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getSummaries, searchText, offset, pageSize, rootSummary]);
  
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

  const handleFormatChange = React.useCallback(async (summary: PublicSummaryGroup, format = initialFormat) => {
    replace(`/read?s=${summary.id}&f=${format}`, undefined, { scroll: false, shallow: true });
    if (summary.id === rootSummary?.id || activeSummary) {
      return;
    }
    setActiveSummary(summary);
    setDrawerOpen(true);
  }, [replace, activeSummary, initialFormat]);

  return (
    <Layout>
      <Head>
        {rootSummary && (
          <React.Fragment>
            <title key='title'>
              {rootSummary.title}
            </title>
            <meta 
              name="viewport"
              content="width=device-width, initial-scale=1.0" />
            <meta 
              key="og:image"
              property="og:image"
              content={ rootSummary.media?.imageArticle || rootSummary.media?.imageAi1 || rootSummary.imageUrl } />
            <meta 
              key="og:title"
              property="og:title"
              content={ rootSummary.title.replace(/"/g, '&quot;') } />
            <meta 
              key="og:description"
              property="og:description"
              content={ rootSummary.shortSummary?.replace(/"/g, '&quot;') } />
            <meta
              key='og:url'
              property="og:url"
              content={ `${process.env.NEXT_PUBLIC_BASE_URL}/read?s=${rootSummary.id}` } />
            <meta
              key='og:site_name'
              property="og:site_name"
              content={ rootSummary.title } />
            <meta 
              key='og:type'
              property="og:type"
              content="Article" />
          </React.Fragment>
        )}
      </Head>
      <Box style={ {
        margin: 'auto', maxWidth: 800, width: isMobile ? undefined : '50vw', 
      } }>
        <Stack spacing={ 2 }>
          {rootSummary && (
            <Summary
              big
              summary={ rootSummary }
              initialFormat={ initialFormat }
              onChange={ (format) => handleFormatChange(rootSummary, format) } />
          )}
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
      </Box>
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
      return { props: { initialFormat: format, rootSummary: data.rows[0] } };
    }
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    return { props: {} };
  }
  res.statusCode = 404;
  return { props: {} };
};