import React from "react";
import {
  CircularProgress,
  Grid,
  Stack,
  Theme,
  Typography,
  styled,
  useMediaQuery,
  Button,
} from "@mui/material";
import {  useSearchParams } from "react-router-dom";

import { SessionContext } from "@/contexts";
import { Api, SourceAttr } from "@/api/Api";

import Page from "@/components/layout/Page";
import Post from "@/components/Post";

import Filters from "@/pages/search/Filters";

const StyledGrid = styled(Grid)(({ theme }) => ({
  margin: "auto",
  width: "calc(100% - 16px)",
  alignItems: "center",
  justifyContent: "center",
}));

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  const api = new Api({
    baseUrl: process.env.API_ENDPOINT,
  }).v1;
  const { consumptionMode, searchText, setSearchText } =
    React.useContext(SessionContext);

  const [totalResults, setTotalResults] = React.useState<number>(0);
  const [recentSources, setRecentSources] = React.useState<SourceAttr[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [pageSize] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(1);

  const mdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const gridSize = React.useMemo(() => {
    if (consumptionMode === "comprehensive") return 12;
    return mdAndUp ? (recentSources.length < 2 ? 12 : 6) : 12;
  }, [consumptionMode, recentSources, mdAndUp]);

  React.useEffect(() => {
    if (searchParams.get("q")) {
      setSearchText(searchParams.get("q") || "");
    }
  }, [searchParams, setSearchText]);

  React.useEffect(() => {
    setRecentSources([]);
    setPage(1);
    api
      .getSources({
        filter: searchText,
        pageSize,
        page: 0,
      })
      .then((response) => {
        setTotalResults(response.data.count);
        setRecentSources(response.data.rows);
      })
      .catch((error) => {
        console.error(error);
        setTotalResults(0);
        setRecentSources([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [api, pageSize, searchText]);

  const loadMore = () => {
    api
      .getSources({
        filter: searchText,
        pageSize,
        page,
      })
      .then((response) => {
        if (response.data) {
          setTotalResults(response.data.count);
          setRecentSources((prev) => [...prev, ...response.data.rows]);
          setPage((prev) => prev + 1);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Page center>
      <Stack spacing={2}>
        <Typography variant="h4">News that fits your schedule</Typography>
        <Filters />
        <StyledGrid container justifyContent="center" spacing={2}>
          {recentSources.map((source) => (
            <Post
              key={source.id}
              source={source}
              consumptionMode={consumptionMode}
              xs={gridSize}
            />
          ))}
          {loading && <CircularProgress size={10} variant="indeterminate" />}
        </StyledGrid>
        {totalResults > pageSize * page && (
          <Button onClick={() => loadMore()}>Load More</Button>
        )}
      </Stack>
    </Page>
  );
}
