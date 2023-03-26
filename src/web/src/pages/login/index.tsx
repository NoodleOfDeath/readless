import React from 'react';

import {
  Button,
  Grid,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import Page from '@/components/layout/Page';
import LoginForm, { LoginFormProps } from '@/components/login/LoginForm';
import { useRouter } from '@/next/router';

type Props = LoginFormProps;

const StyledGrid = styled(Grid)();

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

const StyledAlternateCard = styled(StyledStack)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  height: '100%',
  justifyContent: 'space-evenly',
  padding: theme.spacing(2),
}));

export default function LoginPage({ action = 'logIn' }: Props = {}) {
  const router = useRouter();

  const alternateCard = React.useMemo(() => {
    return (
      <StyledAlternateCard>
        <StyledStack spacing={ 1 }>
          <Typography variant='body2'>
            {action === 'logIn' ? 'Need an account?' : 'Already have an account?'}
          </Typography>
          <Button variant="contained" color="secondary" onClick={ () => router.push(action === 'logIn' ? '/signup' : '/login') }>
            {action === 'logIn' ? 'Sign Up Here' : 'Log In Here'}
          </Button>
        </StyledStack>
      </StyledAlternateCard>
    );
  }, [action, router]);

  return (
    <Page title={ action === 'logIn' ? 'Log In' : 'Sign Up' }>
      <StyledGrid container spacing={ 2 }>
        {action === 'logIn' && (<Grid item xs={ 12 } sm={ 6 }>{alternateCard}</Grid>)}
        <Grid item xs={ 12 } sm={ 6 }>
          <LoginForm action={ action } />
        </Grid>
        {action === 'signUp' && (<Grid item xs={ 12 } sm={ 6 }>{alternateCard}</Grid>)}
      </StyledGrid>
    </Page>
  );
}
