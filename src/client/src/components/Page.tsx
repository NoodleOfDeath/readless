import { Container, styled as muiStyled } from "@mui/material";
import React from "react";

const StyledContainer = muiStyled(Container)(({ theme }) => ({
  backgroundColor: "transparent",
  width: "100%",
  maxWidth: 1280,
  margin: "auto",
  marginTop: theme.spacing(5),
  alignSelf: "center",
  alignItems: "center",
  textAlign: "center",
}));

type Props = React.PropsWithChildren<{}>;

export default function Page({ children }: Props) {
  return <StyledContainer>{children}</StyledContainer>;
}
