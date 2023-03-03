import React from "react";
import { styled } from "@mui/material";

type Props = {
  children?: string;
  maxCharCount?: number;
  showMoreText?: string;
  showLessText?: string;
  truncateStart?: boolean;
  truncateMiddle?: boolean;
  truncateEnd?: boolean;
  variant?: "start" | "middle" | "end";
};

const StyledLink = styled("span")`
  cursor: pointer;
  margin-left: 1rem;
`;

export default function TruncatedText({
  children,
  maxCharCount = 100,
  showLessText,
  truncateStart,
  truncateMiddle,
  truncateEnd,
  variant = truncateStart
    ? "start"
    : truncateMiddle
    ? "middle"
    : truncateEnd
    ? "end"
    : "end",
}: Props = {}) {
  const [isTruncated, setIsTruncated] = React.useState(true);

  const truncatedText = React.useMemo(() => {
    if (children?.length ?? 0 > maxCharCount) {
      switch (variant) {
        case "start":
          return `...${children?.slice(children.length - maxCharCount)}`;
        case "middle":
          return `${children?.slice(
            0,
            Math.floor(maxCharCount / 2)
          )}...${children?.slice(
            children.length - Math.floor(maxCharCount / 2)
          )}`;
        case "end":
        default:
          return `${children?.slice(0, maxCharCount)}...`;
      }
    }
    return children;
  }, [children, maxCharCount, variant]);

  return (
    <div>
      {isTruncated ? truncatedText : children}
      {!isTruncated && showLessText && (
        <StyledLink onClick={() => setIsTruncated(!isTruncated)}>
          {showLessText}
        </StyledLink>
      )}
    </div>
  );
}
