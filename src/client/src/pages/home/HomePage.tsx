import React from "react";
import {
  CircularProgress,
  Grid,
  Stack,
  Theme,
  Typography,
  styled as muiStyled,
  useMediaQuery,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { SessionContext } from "@/contexts";
import { Api, SourceAttr } from "@/api/Api";

import Page from "@/components/layout/Page";
import Post from "@/components/Post";

import Filters from "@/pages/home/Filters";

const StyledGrid = muiStyled(Grid)(({ theme }) => ({
  margin: "auto",
  width: "calc(100% - 16px)",
  alignItems: "center",
  justifyContent: "center",
}));

export default function HomePage() {
  const navigate = useNavigate();
  const api = new Api({
    baseUrl: process.env.API_ENDPOINT,
  }).v1;
  const {
    preferences: { consumptionMode = "concise" },
    searchCache: { searchText },
  } = React.useContext(SessionContext);

  const [recentSources, setRecentSources] = React.useState<SourceAttr[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [pageSize] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(1);

  const mdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const gridSize = React.useMemo(() => {
    return mdAndUp ? (recentSources.length < 2 ? 12 : 6) : 12;
  }, [recentSources, mdAndUp]);

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
        setRecentSources(response.data ?? []);
      })
      .catch((error) => {
        console.error(error);
        setRecentSources([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchText]);

  const loadMore = () => {
    api
      .getSources({ 
        filter: searchText,
        pageSize, 
        page,
      })
      .then((response) => {
        if (response.data) {
          setRecentSources((prev) => [...prev, ...response.data]);
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
        <Button onClick={() => loadMore()}>Load More</Button>
      </Stack>
    </Page>
  );
}
