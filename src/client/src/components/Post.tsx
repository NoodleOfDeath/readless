import React from "react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

import { SourceAttr, SourceAttributes } from "@/api/Api";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  GridProps,
  Link,
  Stack,
  Typography,
  styled as muiStyled,
  Chip,
} from "@mui/material";

export const CONSUMPTION_MODES = ["cursory", "casual", "research"] as const;

export type ConsumptionMode = typeof CONSUMPTION_MODES[number];

type Props = GridProps & {
  source?: SourceAttr | SourceAttributes;
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
  margin: "auto",
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

const StyledStack = muiStyled(Stack)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const StyledChipCategory = muiStyled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const StyledChipSubcategory = muiStyled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const StyledChipTag = muiStyled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
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
    abridged: "Loading...",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    shortSummary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    createdAt: "0",
    updatedAt: "0",
  },
  consumptionMode = "cursory",
  labelSize = "body1",
  ...rest
}: Props = {}) {
  const createdAt = React.useMemo(
    () => format(new Date(source?.createdAt ?? 0), "MMM dd, yyyy - h:mma"),
    [source?.createdAt]
  );

  const content = React.useMemo(() => {
    switch (consumptionMode) {
      case "cursory":
        return source?.shortSummary;
      case "casual":
        return source?.summary;
      case "research":
        return source?.abridged;
    }
  }, [consumptionMode, source]);

  return (
    <Grid item {...rest}>
      <StyledCard>
        <StyledCardHeader
          title={source?.alternateTitle}
          subheader={
            <Stack>
              {createdAt}
              <Link
                variant="caption"
                href={source?.url}
                target="_blank"
                color="inherit"
              >
                {source?.url}
              </Link>
            </Stack>
          }
        />
        <StyledCardContent>
          <StyledStack spacing={2}>
            <Typography component={"div"} variant={labelSize}>
              <ReactMarkdown skipHtml={true}>{content}</ReactMarkdown>
            </Typography>
            <Typography variant="caption">
              <StyledChipCategory label={source?.category} color="secondary" />
              <StyledChipSubcategory
                label={source?.subcategory}
                color="secondary"
              />
            </Typography>
            <Typography variant="caption">
              {source?.tags.map((tag) => {
                const trimmedTag = tag.trim();
                return (
                  <StyledChipTag
                    label={trimmedTag}
                    key={trimmedTag}
                    color="secondary"
                    size="small"
                  />
                );
              })}
            </Typography>
          </StyledStack>
        </StyledCardContent>
      </StyledCard>
    </Grid>
  );
}
