import React from 'react';

import {
  mdiFacebook,
  mdiInstagram,
  mdiTwitter,
} from '@mdi/js';
import Icon from '@mdi/react';
import {
  Box,
  Container,
  ContainerProps,
  Divider,
  Grid,
  Stack,
  Theme,
  Typography,
  styled,
  useMediaQuery,
} from '@mui/material';
import Link from 'next/link';

const LINKS = [
  {
    href: '/privacy',
    text: 'Privacy Policy',
  },
  {
    href: '/terms',
    text: 'Terms of Service',
  },
];

// eslint-disable-next-line react/display-name
const StyledFooter = styled((props: ContainerProps) => (
  <Container { ...props } maxWidth={ false } component="footer" />
))(({ theme }) => ({
  background: theme.palette.primary.main,
  bottom: 0,
  color: theme.palette.primary.contrastText,
  justifyContent: 'left',
  marginTop: theme.spacing(5),
  maxWidth: 'none',
  padding: theme.spacing(3),
  textAlign: 'left',
}));

const StyledStack = styled(Stack)(() => ({
  margin: 'auto',
  maxWidth: 1280,
}));

const StyledHorizontalStack = styled(Stack)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  justifyContent: 'left',
  margin: 'auto',
  marginTop: theme.spacing(2),
  width: '100%',
}));

const StyledLink = styled(Link)(({ theme }) => ({
  '&:hover': { textDecoration: 'underline' },
  color: theme.palette.primary.contrastText,
  marginRight: theme.spacing(1),
  textDecoration: 'none',
}));

export default function Footer() {
  const mdAndUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  return (
    <StyledFooter>
      <StyledStack>
        <StyledHorizontalStack direction="row">
          <Typography>
            Copyright &copy; 
            {' '}
            {new Date().getFullYear()}
            {' '}
            readless
          </Typography>
          <Box flexGrow={ 1 } />
          <Stack direction={ mdAndUp ? 'row' : 'column' } spacing={ 2 }>
            <Typography>Follow us on</Typography>
            <Stack direction="row" spacing={ 1 }>
              <Icon path={ mdiFacebook } size={ 1 } />
              <Icon path={ mdiInstagram } size={ 1 } />
              <Icon path={ mdiTwitter } size={ 1 } />
            </Stack>
          </Stack>
        </StyledHorizontalStack>
        <Divider variant="fullWidth" />
        <StyledGrid container spacing={ 2 }>
          <Grid item>
            <Typography>
              {LINKS.map((link) => (
                <StyledLink key={ link.href } href={ link.href }>
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
