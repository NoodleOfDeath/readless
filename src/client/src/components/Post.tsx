import React from "react";
import { format, formatDistance } from "date-fns";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  GridProps,
  Link,
  Stack,
  Typography,
  styled,
  Chip,
  CardMedia,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { SourceAttr, SourceAttributes } from "@/api/Api";
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

const StyledCard = styled(Card)<Props>(({ consumptionMode }) => ({
  minWidth: 200,
  display: "flex",
  flexDirection: consumptionMode === "concise" ? "row" : "column",
}));

const StyledBox = styled(Box)<Props>(({ consumptionMode }) => ({
  display: "flex",
  flexDirection: "column",
}));

const StyledCardHeader = styled(CardHeader)<Props>(
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

const StyledCardContent = styled(CardContent)<Props>(
  ({ theme, consumptionMode }) => ({
    padding: theme.spacing(1),
    fontSize: consumptionMode === "concise" ? "1rem" : "1.2rem",
  })
);

const StyledStack = styled(Stack)<Props>(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const StyledChipCategory = styled(Chip)<Props>(({ theme }) => ({
  margin: theme.spacing(0.5),
  cursor: "pointer",
}));

const StyledChipSubcategory = styled(Chip)<Props>(({ theme }) => ({
  margin: theme.spacing(0.5),
  cursor: "pointer",
}));

const StyledChipTag = styled(Chip)<Props>(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function Post({
  source,
  consumptionMode = "concise",
  ...rest
}: Props = {}) {
  const navigate = useNavigate();

  const createdAt = React.useMemo(
    () => (
      <>
        <Typography>
          {format(new Date(source?.createdAt ?? 0), "MMM dd, yyyy - h:mma")}
        </Typography>
        <Typography>
          {formatDistance(new Date(source?.createdAt ?? 0), new Date(), {
            addSuffix: true,
          })}
        </Typography>
      </>
    ),
    []
  );

  const content = React.useMemo(() => {
    if (!source) return "";
    switch (consumptionMode) {
      // case "bulleted":
      //   return source?.bullets?.map((b) => `- ${b}`).join("\n");
      case "concise":
        return source.shortSummary;
      case "casual":
        return source.summary;
      case "comprehensive":
        return source.abridged;
    }
  }, [consumptionMode, source]);

  return (
    <Grid item {...rest}>
      <StyledCard consumptionMode={consumptionMode}>
        <CardMedia>
          {consumptionMode === "concise" ? (
            <img height={"100%"} width={180} />
          ) : (
            <img width={"100%"} height={180} />
          )}
        </CardMedia>
        <StyledBox consumptionMode={consumptionMode}>
          <Stack>
            <CardMedia>
              <img width={"100%"} height={30} />
            </CardMedia>
            <Typography>{source?.title}</Typography>
            <Typography>{createdAt}</Typography>
            <Link
              variant="caption"
              href={source?.url}
              target="_blank"
              color="inherit"
            >
              <TruncatedText maxCharCount={50} truncateMiddle>
                {source?.url}
              </TruncatedText>
            </Link>
          </Stack>
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
        </StyledBox>
      </StyledCard>
    </Grid>
  );
}
