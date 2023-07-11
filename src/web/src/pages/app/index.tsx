import React from 'react';

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  SwipeableDrawer,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from 'styled-components';

import { PublicSummaryGroup, ReadingFormat } from '~/api';
import Logo from '~/components/Logo';
import Summary from '~/components/Summary';
import { SessionContext } from '~/contexts';
import { useRouter, useSummaryClient } from '~/hooks';
import { readingFormat } from '~/utils';

const Page = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function AppPage() {

  const theme = useTheme();
  const mdAndDown = useMediaQuery(() => theme.breakpoints.down('md'));
  const { replace, searchParams } = useRouter();

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
  const [page, setPage] = React.useState<number>(0);
  const [searchText, setSearchText] = React.useState<string>();

  const load = React.useCallback(async () => {
    try {
      const { data } = await getSummaries({
        filter: searchText,
        locale: window.navigator.language,
        page,
        pageSize,
      });
      if (data) {
        setTotalResults(data.count);
        setSummaries((prev) => 
          [
            ...prev,
            ...data.rows.filter((s) => !prev.some((p) => p.id === s.id)),
          ]);
        setPage((prev) => prev + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getSummaries, searchText, page, pageSize, setTotalResults, setPage, setLoading]);
  
  const loadSummary = React.useCallback(async () => {
    if (!id || id < 0) {
      return;
    }
    try {
      const { data, error } = await getSummary(id, window.navigator.language);
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
    setPage(0);
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
    <Page>
      <Stack spacing={ 2 }>
        <Logo />
        <form onSubmit={ (e) => {
          e.preventDefault(); onMount(); 
        } }>
          <Stack spacing={ 2 }>
            <TextField
              value={ searchText } 
              onChange={ (e) => setSearchText(e.target.value) }
              label="Search" />
            <Button type="submit">Search</Button>
          </Stack>
        </form>
        <Stack>
          {summaries.length === 0 && (
            <Typography variant="h6">No results found</Typography>
          )}
        </Stack>
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
        {totalResults > pageSize * page && (
          <Button onClick={ () => load() }>Load More</Button>
        )}
      </Stack>
      <SwipeableDrawer 
        anchor={ mdAndDown ? 'bottom' : 'right' }
        open={ drawerOpen }
        onOpen={ () => setDrawerOpen(true) }
        onClose={ () => { 
          setDrawerOpen(false);
          setSelectedSummary(undefined);
        } }>
        <Box sx={ { width: mdAndDown ? '100%' : 500 } }>
          <Stack spacing={ 2 } sx={ { p: 2 } }>
            {selectedSummary && (
              <Summary
                summary={ selectedSummary }
                initialFormat={ initialFormat }
                onChange={ () => handleFormatChange(selectedSummary) } />
            )}
          </Stack>
        </Box>
      </SwipeableDrawer>
    </Page>
  );
}