import React from "react";
import styled from "styled-components";

const StyledIcon = styled.div`
  filter: invert(100%) sepia(0%) saturate(7471%) hue-rotate(84deg)
    brightness(100%) contrast(100%);
`;

type Props = {
  height?: number;
};

export default function Logo({ height = 40 }: Props = {}) {
  return (
    <StyledIcon>
      <img src="logo.svg" alt="logo" height={height} />
    </StyledIcon>
  );
}
