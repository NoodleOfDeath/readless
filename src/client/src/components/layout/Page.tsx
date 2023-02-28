import { Container, ContainerProps, styled as muiStyled } from "@mui/material";
import React from "react";

type Props = React.PropsWithChildren<{
  left?: boolean;
  right?: boolean;
  center?: boolean;
  align?: "left" | "right" | "center";
}>;

const StyledContainer = muiStyled((props: ContainerProps & Props) => (
  <Container {...props} maxWidth={false} />
))(
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

export default function Page({ children, ...other }: Props) {
  return <StyledContainer {...other}>{children}</StyledContainer>;
}
