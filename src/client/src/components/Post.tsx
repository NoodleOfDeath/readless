import React from "react";
import { format, formatDistance } from "date-fns";
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
import { SessionContext } from "@/contexts";
import { useNavigate } from "react-router-dom";
import TruncatedText from "@/components/common/TruncatedText";

export const CONSUMPTION_MODES = [
  // "bulleted",
  "concise",
  "casual",
  "comprehensive",
] as const;

export type ConsumptionMode = typeof CONSUMPTION_MODES[number];

type Props = GridProps & {
  source?: SourceAttr | SourceAttributes;
  consumptionMode?: ConsumptionMode;
};

const StyledCard = muiStyled(Card)<Props>(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  margin: "auto",
  maxWidth: 1280,
  minWidth: 200,
}));

const StyledCardHeader = muiStyled(CardHeader)<Props>(
  ({ theme, consumptionMode }) => ({
    padding: theme.spacing(1),
    fontSize: consumptionMode === "concise" ? "1rem" : "1.5rem",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    wordBreak: "break-word",
  })
);

const StyledCardContent = muiStyled(CardContent)<Props>(
  ({ theme, consumptionMode }) => ({
    padding: theme.spacing(1),
    fontSize: consumptionMode === "concise" ? "0.75rem" : "1rem",
  })
);

const StyledStack = muiStyled(Stack)<Props>(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const StyledChipCategory = muiStyled(Chip)<Props>(({ theme }) => ({
  margin: theme.spacing(0.5),
  cursor: "pointer",
}));

const StyledChipSubcategory = muiStyled(Chip)<Props>(({ theme }) => ({
  margin: theme.spacing(0.5),
  cursor: "pointer",
}));

const StyledChipTag = muiStyled(Chip)<Props>(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function Post({
  source = {
    id: 0,
    category: "Loading...",
    subcategory: "Loading...",
    tags: [],
    title: "Loading...",
    originalTitle: "Loading...",
    url: "Loading...",
    text: "Loading...",
    abridged: "Loading...",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    shortSummary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    bullets: [],
    createdAt: "0",
    updatedAt: "0",
  },
  consumptionMode = "concise",
  ...rest
}: Props = {}) {
  const navigate = useNavigate();

  const createdAt = React.useMemo(
    () =>
      [
        format(new Date(source?.createdAt ?? 0), "MMM dd, yyyy - h:mma"),
        formatDistance(new Date(source?.createdAt ?? 0), new Date(), {
          addSuffix: true,
        }),
      ].join(" "),
    [source?.createdAt]
  );

  const content = React.useMemo(() => {
    switch (consumptionMode) {
      // case "bulleted":
      //   return source?.bullets?.map((b) => `- ${b}`).join("\n");
      case "concise":
        return source?.shortSummary;
      case "casual":
        return source?.summary;
      case "comprehensive":
        return source?.abridged;
    }
  }, [consumptionMode, source]);

  return (
    <Grid item {...rest}>
      <StyledCard>
        <StyledCardHeader
          consumptionMode={consumptionMode}
          title={source?.title}
          subheader={
            <Stack>
              {createdAt}
              <Link
                variant="caption"
                href={source?.url}
                target="_blank"
                color="inherit"
              >
                <TruncatedText truncateMiddle>{source?.url}</TruncatedText>
              </Link>
            </Stack>
          }
        />
        <StyledCardContent consumptionMode={consumptionMode}>
          <StyledStack spacing={2}>
            <ReactMarkdown skipHtml={true}>{content}</ReactMarkdown>
            <Typography variant="caption">
              <StyledChipCategory
                label={source?.category}
                color="secondary"
                onClick={() => navigate(`/search?q=${source?.category}`)}
              />
              <StyledChipSubcategory
                label={source?.subcategory}
                color="secondary"
                onClick={() => navigate(`/search?q=${source?.subcategory}`)}
              />
            </Typography>
            {consumptionMode === "comprehensive" && (
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
            )}
          </StyledStack>
        </StyledCardContent>
      </StyledCard>
    </Grid>
  );
}
