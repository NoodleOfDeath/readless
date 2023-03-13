import React from "react";
import { Container, ContainerProps, styled } from "@mui/material";

type Props = Omit<ContainerProps, "left" | "right" | "center" | "align"> & {
  title?: string;
  left?: boolean;
  right?: boolean;
  center?: boolean;
  align?: "left" | "right" | "center";
};

const StyledContainer = styled(
  ({ left, right, center, align, ...props }: ContainerProps & Props) => (
    <Container {...props} maxWidth={false} />
  )
)(
  ({
    theme,
    left,
    right,
    center,
    align = left ? "left" : right ? "right" : center ? "center" : "left",
  }) => ({
    marginTop: theme.spacing(5),
    maxWidth: 1280,
    alignSelf: align,
    alignItems: align,
    textAlign: align,
    justifyContent: align,
  })
);

export default function Page({ children, title, ...other }: Props) {
  React.useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
  return (
    <StyledContainer {...other}>
      {children}
    </StyledContainer>
  );
}
