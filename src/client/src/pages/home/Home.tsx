import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  styled as muiStyled,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Icon } from "@mdi/react";
import Page from "@/components/Page";
import { PODCAST_LINKS } from "@/config/PodcastLinks";
import { useNavigate } from "react-router-dom";

const StyledGrid = muiStyled(Grid)(({ theme }) => ({
  margin: 0,
  width: "calc(100% - 16px)",
}));

const StyledCard = muiStyled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  maxWidth: 1280,
  minWidth: 200,
}));

const StyledCardMedia = muiStyled(CardMedia)(({ theme }) => ({
  padding: theme.spacing(1),
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  flexDirection: "row",
}));

const StyledCardContent = muiStyled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1),
}));

export default function Home() {
  const navigate = useNavigate();
  const smAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("sm"));

  const iconSize = React.useMemo(() => (smAndUp ? 5 : 3), [smAndUp]);
  const labelSize = React.useMemo(() => (smAndUp ? "h4" : "h6"), [smAndUp]);

  return (
    <Page>
      <Stack spacing={2}>
        <Typography variant="h4">
          Listen to our weekly podcast on the following podcast providers!
        </Typography>
        <StyledGrid container justifyContent="center" spacing={2}>
          {PODCAST_LINKS.map((link) => (
            <Grid
              key={link.label}
              item
              sm={6}
              md={4}
              xl={Math.floor(12 / PODCAST_LINKS.length)}
            >
              <StyledCard onClick={() => link.onClick?.({ navigate })}>
                {link.icon && (
                  <StyledCardMedia>
                    <Icon path={link.icon} size={iconSize} color="white" />
                  </StyledCardMedia>
                )}
                <StyledCardContent>
                  <Typography variant={labelSize}>{link.label}</Typography>
                </StyledCardContent>
              </StyledCard>
            </Grid>
          ))}
        </StyledGrid>
      </Stack>
    </Page>
  );
}
