import React from "react";
import { Container, ContainerProps, styled as muiStyled } from "@mui/material";

const StyledFooter = muiStyled((props: ContainerProps) => (
  <Container {...props} maxWidth={false} />
))(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  marginTop: theme.spacing(5),
  padding: theme.spacing(3),
  minHeight: 64,
  bottom: 0,
  maxWidth: "none",
  textAlign: "center",
  alignItems: "center",
  justifyContent: "center",
}));

export default function Footer() {
  return (
    <StyledFooter>
      Copyright &copy; {new Date().getFullYear()} TheSkoop
    </StyledFooter>
  );
}
