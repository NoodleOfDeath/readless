import { Card, CardContent, styled as muiStyled } from "@mui/material";
import React from "react";

const StyledCard = muiStyled(Card)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: "transparent",
  width: "100%",
  maxWidth: 1280,
  margin: "auto",
  marginTop: theme.spacing(2),
  alignSelf: "center",
  alignItems: "center",
}));

const StyledCardContent = muiStyled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  alignSelf: "center",
  alignItems: "center",
  textAlign: "center",
}));

type Props = React.PropsWithChildren<{}>;

export default function Page({ children }: Props) {
  return (
    <StyledCard elevation={0}>
      <StyledCardContent>{children}</StyledCardContent>
    </StyledCard>
  );
}
