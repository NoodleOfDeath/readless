import React from 'react';

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  SwipeableDrawer,
  TextField,
} from '@mui/material';
import { useMediaQuery } from 'react-responsive';

import {
  PublicSummaryGroup,
  ReadingFormat,
  SupportedLocale,
} from '~/api';
import Layout from '~/components/Layout';
import Summary from '~/components/Summary';
import { SessionContext } from '~/contexts';
import { useRouter, useSummaryClient } from '~/hooks';
import { readingFormat } from '~/utils';

export default function AppPage() {

  const { replace, searchParams } = useRouter();
  const isMobile = useMediaQuery({ query: '(max-width: 762px)' });
  const { getSummaries, getSummary } = useSummaryClient();

  const { preferredReadingFormat } = React.useContext(SessionContext);
  
  const id = React.useMemo(() => parseInt(searchParams.get('s') ?? '-1'), [searchParams]);
  const initialFormat = React.useMemo(() => readingFormat(searchParams.get('f') ?? preferredReadingFormat ?? ReadingFormat.Summary), [preferredReadingFormat, searchParams]);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [summaries, setSummaries] = React.useState<PublicSummaryGroup[]>([]);
  const [selectedSummary, setSelectedSummary] = React.useState<PublicSummaryGroup>();
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

  const [pageSize] = React.useState<number>(10);
  const [offset, setOffset] = React.useState<number>(0);
  const [searchText, setSearchText] = React.useState<string>();

  const load = React.useCallback(async () => {
    try {
      const { data, error } = await getSummaries({
        filter: searchText,
        offset,
        pageSize,
      });
      if (error) {
        alert('tits');
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
  
  const loadSummary = React.useCallback(async () => {
    if (!id || id < 0) {
      return;
    }
    try {
      const { data, error } = await getSummary(id, window.navigator.language as SupportedLocale);
      if (error) {
        throw error;
      } 
      if (data && data.rows.length > 0) {
        setSelectedSummary(data.rows[0]);
        setDrawerOpen(true);
      } else {
        replace('/404');
      }
    } catch (e) {
      console.error(e);
    }
  }, [getSummary, id, replace]);

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

  React.useEffect(() => {
    loadSummary();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFormatChange = React.useCallback(async (summary: PublicSummaryGroup) => {
    if (selectedSummary) {
      return;
    }
    setSelectedSummary(summary);
    setDrawerOpen(true);
  }, [selectedSummary]);

  return (
    <Layout>
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
              onChange={ () => handleFormatChange(summary) } />
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
          setSelectedSummary(undefined);
        } }>
        <Box sx={ { width: isMobile ? '100%' : 500 } }>
          <Stack spacing={ 2 } sx={ { p: 2 } }>
            {selectedSummary && (
              <Summary
                big
                summary={ selectedSummary }
                initialFormat={ initialFormat }
                onChange={ () => handleFormatChange(selectedSummary) } />
            )}
          </Stack>
        </Box>
      </SwipeableDrawer>
    </Layout>
  );
}