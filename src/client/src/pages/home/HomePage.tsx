import React from "react";
import {
  CircularProgress,
  Grid,
  Stack,
  styled as muiStyled,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { BaseContext } from "@/contexts";
import { Api, SourceAttributes } from "@/api/Api";

import Page from "@/components/layout/Page";
import Post from "@/components/Post";

import ConsumptionModeSelector from "@/pages/home/ConsumptionModeSelector";

const StyledGrid = muiStyled(Grid)(({ theme }) => ({
  margin: "auto",
  width: "calc(100% - 16px)",
  alignItems: "center",
  justifyContent: "center",
}));

export default function HomePage() {
  const navigate = useNavigate();
  const { consumptionMode } = React.useContext(BaseContext);

  const [recentSources, setRecentSources] = React.useState<SourceAttributes[]>(
    []
  );
  const [loading, setLoading] = React.useState<boolean>(true);

  const mdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const gridSize = React.useMemo(() => {
    return mdAndUp ? (recentSources.length < 2 ? 12 : 6) : 12;
  }, [recentSources, mdAndUp]);

  React.useEffect(() => {
    new Api({
      baseUrl: process.env.API_ENDPOINT,
    }).v1
      .getSources({})
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
  }, []);

  return (
    <Page>
      <Stack spacing={2}>
        <Typography variant="h4">News that fits your schedule</Typography>
        <ConsumptionModeSelector />
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
      </Stack>
    </Page>
  );
}
