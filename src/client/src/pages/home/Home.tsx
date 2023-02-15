import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  styled as muiStyled,
  Typography,
} from "@mui/material";
import { Icon } from "@mdi/react";
import { mdiApple, mdiSpotify } from "@mdi/js";
import Page from "@/components/Page";

const StyledCard = muiStyled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  minWidth: 250,
  maxWidth: 1280,
  minHeight: 250,
  maxHeight: 500,
}));

const DIRECTORIES = [
  {
    label: "Apple Podcasts",
    icon: mdiApple,
    onClick: () =>
      window.open(
        "https://podcasts.apple.com/us/podcast/chatgptalks/id1671374300",
        "_blank"
      ),
  },
  {
    label: "Spotify",
    icon: mdiSpotify,
    onClick: () =>
      window.open(
        "https://open.spotify.com/episode/0zE70NQAZTF0mc8VKWR8DS?si=r0M8WQrcTFCEJw33XHq_-A",
        "_blank"
      ),
  },
];

export default function Home() {
  return (
    <Page>
      <Stack spacing={2}>
        <Typography variant="h4">
          Listen to our weekly podcast on the following podcast providers!
        </Typography>
        <Grid container justifyContent="center" spacing={2}>
          {DIRECTORIES.map((directory) => (
            <Grid
              key={directory.label}
              item
              sm={12}
              md={Math.floor(12 / DIRECTORIES.length)}
            >
              <StyledCard onClick={directory.onClick}>
                <CardMedia>
                  <Icon path={directory.icon} size={6} color="white" />
                </CardMedia>
                <CardContent>
                  <Typography variant="h4">{directory.label}</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Page>
  );
}
