import React from "react";
import {
  Container,
  ContainerProps,
  Divider,
  Grid,
  Link,
  Stack,
  styled as muiStyled,
  Typography,
} from "@mui/material";

const LINKS = [
  {
    text: "Privacy Policy",
    href: "/privacy",
  },
  {
    text: "Terms of Service",
    href: "/terms",
  },
];

const StyledFooter = muiStyled((props: ContainerProps) => (
  <Container {...props} maxWidth={false} />
))(({ theme }) => ({
  marginTop: theme.spacing(5),
  padding: theme.spacing(3),
  bottom: 0,
  maxWidth: "none",
  textAlign: "left",
  justifyContent: "left",
}));

const StyledStack = muiStyled(Stack)(({ theme }) => ({
  margin: "auto",
  maxWidth: 1280,
}));

const StyledGrid = muiStyled(Grid)(({ theme }) => ({
  margin: "auto",
  width: "100%",
  justifyContent: "left",
  marginTop: theme.spacing(2),
}));

const StyledLink = muiStyled(Link)(({ theme }) => ({
  marginRight: theme.spacing(1),
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}));

export default function Footer() {
  return (
    <StyledFooter>
      <StyledStack>
        <Typography>
          Copyright &copy; {new Date().getFullYear()} TheSkoop
        </Typography>
        <Divider color="primary" variant="fullWidth" />
        <StyledGrid container spacing={2}>
          <Grid item>
            <Typography>
              {LINKS.map((link) => (
                <StyledLink key={link.href} href={link.href}>
                  {link.text}
                </StyledLink>
              ))}
            </Typography>
          </Grid>
        </StyledGrid>
      </StyledStack>
    </StyledFooter>
  );
}
