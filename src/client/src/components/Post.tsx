import React from "react";
import { format } from "date-fns";
import { SourceAttributes } from "@/api/Api";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  styled as muiStyled,
} from "@mui/material";

export const CONSUMPTION_MODES = ["cursory", "casual", "research"] as const;

export type ConsumptionMode = typeof CONSUMPTION_MODES[number];

type Props = {
  source?: SourceAttributes;
  consumptionMode?: ConsumptionMode;
  labelSize?:
    | "button"
    | "caption"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "inherit"
    | "overline"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2";
};

const StyledCard = muiStyled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  maxWidth: 1280,
  minWidth: 200,
}));

const StyledCardHeader = muiStyled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(1),
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
  flexDirection: "row",
}));

const StyledCardContent = muiStyled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1),
}));

export default function Post({
  source = {
    id: 0,
    category: "Loading...",
    subcategory: "Loading...",
    title: "Loading...",
    alternateTitle: "Loading...",
    tags: [],
    url: "Loading...",
    text: "Loading...",
    filteredText: "Loading...",
    abridged: "Loading...",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    shortSummary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    createdAt: "0",
    updatedAt: "0",
  },
  consumptionMode = "cursory",
  labelSize = "subtitle1",
}: Props = {}) {
  const createdAt = React.useMemo(
    () => format(new Date(source?.createdAt ?? 0), "MMM dd, yyyy - h:mma"),
    [source?.createdAt]
  );

  return (
    <Grid item sm={6} md={4} xl={3}>
      <StyledCard>
        <StyledCardHeader
          title={source?.alternateTitle}
          subheader={createdAt}
        />
        <StyledCardContent>
          {consumptionMode === "cursory" && (
            <Typography variant={labelSize}>{source?.shortSummary}</Typography>
          )}
          {consumptionMode === "casual" && (
            <Typography variant={labelSize}>{source?.summary}</Typography>
          )}
          {consumptionMode === "research" && (
            <Typography variant={labelSize}>{source?.abridged}</Typography>
          )}
        </StyledCardContent>
      </StyledCard>
    </Grid>
  );
}
