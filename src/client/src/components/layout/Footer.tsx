import React from "react";
import {
  Box,
  Container,
  ContainerProps,
  Divider,
  Grid,
  Link,
  Stack,
  styled,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Icon from "@mdi/react";
import { mdiFacebook, mdiInstagram, mdiTwitter } from "@mdi/js";

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

const StyledFooter = styled((props: ContainerProps) => (
  <Container {...props} maxWidth={false} component="footer" />
))(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginTop: theme.spacing(5),
  padding: theme.spacing(3),
  bottom: 0,
  maxWidth: "none",
  textAlign: "left",
  justifyContent: "left",
}));

const StyledStack = styled(Stack)(({ theme }) => ({
  margin: "auto",
  maxWidth: 1280,
}));

const StyledHorizontalStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  margin: "auto",
  width: "100%",
  justifyContent: "left",
  marginTop: theme.spacing(2),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  marginRight: theme.spacing(1),
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}));

export default function Footer() {
  
  const mdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
  
  return (
    <StyledFooter>
      <StyledStack>
        <StyledHorizontalStack direction="row">
          <Typography>
            Copyright &copy; {new Date().getFullYear()} TheSkoop
          </Typography>
          <Box flexGrow={1} />
          <Stack direction={mdAndUp ? "row" : "column"} spacing={2}>
            <Typography>Follow us on</Typography>
            <Stack direction="row" spacing={1}>
              <Icon path={mdiFacebook} size={1} />
              <Icon path={mdiInstagram} size={1} />
              <Icon path={mdiTwitter} size={1} />
            </Stack>
          </Stack>
        </StyledHorizontalStack>
        <Divider variant="fullWidth" />
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
