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

import { Api, SourceAttributes } from "@/api/Api";
import Page from "@/components/Page";
import Post from "@/components/Post";
import ConsumptionModeSelector from "@/components/ConsumptionModeSelector";
import { BaseContext } from "@/contexts";

const StyledGrid = muiStyled(Grid)(({ theme }) => ({
  margin: 0,
  width: "calc(100% - 16px)",
}));
export default function Home() {
  const navigate = useNavigate();
  const { consumptionMode } = React.useContext(BaseContext);

  const [recentSources, setRecentSources] = React.useState<SourceAttributes[]>(
    []
  );
  const [loading, setLoading] = React.useState<boolean>(true);

  const smAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));

  const gridSize = React.useMemo(() => {
    if (consumptionMode === "casual") {
      return smAndUp ? (recentSources.length < 3 ? 12 : 4) : 12;
    } else if (consumptionMode === "research") {
      return smAndUp ? (recentSources.length < 2 ? 12 : 6) : 12;
    }
    return smAndUp ? (recentSources.length < 4 ? 12 : 3) : 12;
  }, [consumptionMode, recentSources, smAndUp]);

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
