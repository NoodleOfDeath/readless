import { Container, ContainerProps, styled as muiStyled } from "@mui/material";
import React from "react";

const StyledContainer = muiStyled((props: ContainerProps) => (
  <Container {...props} maxWidth={false} />
))(({ theme }) => ({
  marginTop: theme.spacing(5),
  maxWidth: 1280,
  alignSelf: "center",
  alignItems: "center",
  textAlign: "center",
  justifyContent: "center",
}));

type Props = React.PropsWithChildren<{}>;

export default function Page({ children }: Props) {
  return <StyledContainer>{children}</StyledContainer>;
}
