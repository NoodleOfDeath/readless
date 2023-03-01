import React from "react";
import styled from "styled-components";

type Props = {
  children?: string;
  maxCharCount?: number;
  showMoreText?: string;
  showLessText?: string;
};

const StyledLink = styled.span`
  cursor: pointer;
  margin-left: 1rem;
`;

export default function TruncatedText({
  children,
  maxCharCount = 100,
  showMoreText = "(show more...)",
  showLessText = "(show less)",
}: Props = {}) {
  const [isTruncated, setIsTruncated] = React.useState(true);

  return (
    <div>
      {isTruncated ? children?.slice(0, maxCharCount) : children}
      {isTruncated && (children?.length ?? 0 > 0) > maxCharCount && "..."}
      <StyledLink onClick={() => setIsTruncated(!isTruncated)}>
        {isTruncated ? showMoreText : showLessText}
      </StyledLink>
    </div>
  );
}
